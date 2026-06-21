const Otp = require('../models/Otp');
const whatsappService = require('../services/whatsappService');
const leadController = require('./leadController'); // Used to submit lead upon verification

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log('[OTP Controller] sendOtp received request for phone:', phone);

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert OTP (so multiple requests don't bloat the DB, and they just get the newest one)
    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true, returnDocument: 'after' }
    );

    // ALWAYS log the OTP to the backend terminal so the admin can test easily without waiting for WhatsApp
    console.log(`\n================================`);
    console.log(`[OTP GENERATED] Phone: ${phone} | OTP: ${otp}`);
    console.log(`================================\n`);

    // Attempt to send OTP via WhatsApp — failure does NOT block the flow
    // The OTP is already saved in DB above, so the user can still verify
    try {
      const result = await whatsappService.sendWhatsappOtp(phone, otp);
      if (result && result.success) {
        console.log(`[OTP Controller] WhatsApp OTP delivered successfully to ${phone}`);
      } else if (result && result.message === 'WhatsApp API credentials missing') {
        console.warn(`[OTP Dev Mode] WhatsApp not configured. OTP for ${phone}: ${otp}`);
      }
    } catch (whatsappError) {
      // Log the WhatsApp error but DO NOT fail the request
      // The OTP is in the DB — user can still enter it if received via another channel
      console.error(`[OTP Controller] WhatsApp delivery failed for ${phone} — OTP still valid in DB:`, whatsappError?.data?.error?.message || whatsappError?.message || whatsappError);
    }

    // Always return success — OTP is saved regardless of WhatsApp delivery
    return res.status(200).json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('[OTP Controller] Error in sendOtp:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


const verifyOtpAndSubmitLead = async (req, res) => {
  try {
    const { phone, otp, leadData } = req.body;
    console.log('[OTP Controller] verifyOtpAndSubmitLead received:', { phone, otp, leadData });

    if (!phone || !otp || !leadData) {
      return res.status(400).json({ success: false, error: 'Phone, OTP, and leadData are required' });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ phone, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // OTP is valid. Delete it so it can't be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    // Inject the leadData into the request body and call the leadController
    req.body = leadData; 
    
    // Call the createLead function. We have to be careful with Express req/res.
    // Instead of directly calling it with the same res, we'll create a mock res 
    // or just import the service if they have one. Looking at standard express, 
    // we can pass the req and res down.
    
    return await leadController.handleCreateLead(req, res);

  } catch (error) {
    console.error('[OTP Controller] Error in verifyOtpAndSubmitLead:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  sendOtp,
  verifyOtpAndSubmitLead
};
