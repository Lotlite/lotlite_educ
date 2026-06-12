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

const sendWhatsappOtp = async (phone, otp) => {
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
    console.error('[WhatsApp Service] Error sending OTP:', error);
    throw error;
  }
};

module.exports = {
  sendWhatsappAcknowledgement,
  sendWhatsappOtp
};
