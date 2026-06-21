const sendWhatsappAcknowledgement = async (leadData) => {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  if (!apiUrl || !apiToken) {
    console.warn('WhatsApp credentials not configured. Skipping WhatsApp acknowledgement.');
    return { success: false, message: 'WhatsApp API credentials missing' };
  }

  const { phone, fullName, programCategory, programSpecialization } = leadData;
  if (!phone) {
    throw new Error('Phone number is required for WhatsApp acknowledgement.');
  }

  // Format phone number (assuming it might need country code)
  const formattedPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
  const contactNumber = formattedPhone.length === 10 ? `91${formattedPhone}` : formattedPhone;

  // Using Meta approved template for business-initiated conversations
  const isInternship = programCategory === 'Career & Internship Co-Op';
  let templateName;

  if (isInternship) {
    // Fallback to the admission template for testing if an internship-specific one isn't set yet
    templateName = process.env.WHATSAPP_INTERNSHIP_TEMPLATE_NAME || process.env.WHATSAPP_TEMPLATE_NAME || 'acknowledgement_applynow';
  } else {
    templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'acknowledgement_applynow';
  }

  const payload = {
    messaging_product: "whatsapp",
    to: contactNumber,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              parameter_name: "applicant_name",
              text: fullName || "Applicant"
            },
            {
              type: "text",
              parameter_name: "program_category",
              text: programCategory || "Program"
            },
            {
              type: "text",
              parameter_name: "specialization",
              text: programSpecialization || "Specialization"
            }
          ]
        }
      ]
    }
  };

  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!response.ok) {
      throw { status: response.status, data: json };
    }

    return { success: true, data: json };
  } catch (error) {
    console.error('[WhatsApp Service] Error sending acknowledgement:', error);
    throw error;
  }
};

// Helper: sleep for ms milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendWhatsappOtp = async (phone, otp, retries = 3, delayMs = 1000) => {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  if (!apiUrl || !apiToken) {
    console.warn('WhatsApp credentials not configured. Skipping WhatsApp OTP.');
    return { success: false, message: 'WhatsApp API credentials missing' };
  }

  // Format phone number
  const formattedPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
  const contactNumber = formattedPhone.length === 10 ? `91${formattedPhone}` : formattedPhone;

  const payload = {
    messaging_product: "whatsapp",
    to: contactNumber,
    type: "template",
    template: {
      name: "lotlite_otp_verification",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp
            }
          ]
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: otp
            }
          ]
        }
      ]
    }
  };

  const { default: fetch } = await import('node-fetch');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[WhatsApp Service] Sending OTP attempt ${attempt}/${retries} to ${contactNumber}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }

      if (!response.ok) {
        // Check if it's a transient error (Meta code 2) — worth retrying
        const isTransient = json?.error?.is_transient === true || json?.error?.code === 2;

        if (isTransient && attempt < retries) {
          console.warn(`[WhatsApp Service] Transient error on attempt ${attempt}. Retrying in ${delayMs}ms...`);
          await sleep(delayMs * attempt); // exponential backoff: 1s, 2s, 3s
          continue;
        }

        throw { status: response.status, data: json };
      }

      console.log(`[WhatsApp Service] OTP sent successfully on attempt ${attempt}`);
      return { success: true, data: json };

    } catch (error) {
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        console.error('[WhatsApp Service] Error sending OTP after all retries:', error);
        throw error;
      }

      // For network-level errors, also retry
      console.warn(`[WhatsApp Service] Network error on attempt ${attempt}. Retrying...`, error?.message || error);
      await sleep(delayMs * attempt);
    }
  }
};

module.exports = {
  sendWhatsappAcknowledgement,
  sendWhatsappOtp
};

