const Otp = require('../models/Otp');
const whatsappService = require('../services/whatsappService');
const leadController = require('./leadController'); // Used to submit lead upon verification

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert OTP (so multiple requests don't bloat the DB, and they just get the newest one)
    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send OTP via WhatsApp
    const result = await whatsappService.sendWhatsappOtp(phone, otp);

    if (!result.success) {
      // If WhatsApp service is configured but failed
      if (result.message !== 'WhatsApp API credentials missing') {
         return res.status(500).json({ success: false, error: 'Failed to send OTP via WhatsApp' });
      } else {
        // If credentials are missing, we still return success for local testing / development
        // The user can enter the OTP generated since it's saved in DB. In real prod, this is a warning.
        console.warn(`[OTP Dev Mode] Generated OTP for ${phone}: ${otp}`);
      }
    }

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('[OTP Controller] Error in sendOtp:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const verifyOtpAndSubmitLead = async (req, res) => {
  try {
    const { phone, otp, leadData } = req.body;

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
