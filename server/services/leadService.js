const Lead = require('../models/Lead');
const emailService = require('./emailService');
const whatsappService = require('./whatsappService');
const agenda = require('../config/agenda');
const dograhService = require('./dograhService');

/**
 * Format payload and send lead to Callyzer
 */
const sendLeadToCallyzer = async (leadData) => {
  const apiKey = process.env.CALLYZER_API_KEY;
  const rawBaseUrl = process.env.CALLYZER_BASE_URL || '';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  if (!apiKey || !baseUrl) {
    throw new Error('Callyzer credentials are not configured in environment variables.');
  }

  const { 
    fullName = '', 
    email = '', 
    phone = '', 
    programCategory = '', 
    programSpecialization = '', 
    source = 'Website Lead',
    lead_tags = ['Lotlite Edu'] 
  } = leadData;

  // Add source to lead tags if not already present
  const tags = Array.isArray(lead_tags) ? [...lead_tags] : [lead_tags];
  if (source && !tags.includes(source)) {
    tags.push(source);
  }


  // Split name for Callyzer requirements
  const parts = fullName.trim().split(/\s+/);
  const rawFirst = parts[0] || 'Applicant';
  const rawLast = parts.slice(1).join(' ');
  const first_name = rawFirst.length >= 3 ? rawFirst : rawFirst.padEnd(3, '.');
  const last_name = rawLast.length === 0 ? '' : rawLast.length >= 2 ? rawLast : rawLast.padEnd(2, '.');

  // Normalise phone number
  const digits = phone.replace(/\s+/g, '').replace(/^\+/, '');
  const contactNumber = digits.length === 12 && digits.startsWith('91')
    ? `91-${digits.slice(2)}`
    : digits;

  const callyzerPayload = {
    leads: [
      {
        first_name,
        ...(last_name && { last_name }),
        contact_numbers: [contactNumber],
        fields: {
          InputBox1780143703106: email,
          InputBox1780143703123: source !== 'Website Lead' ? `${source} - ${programCategory}` : programCategory,
          InputBox1780143703131: programSpecialization,
        },
      },
    ],
    lead_tags: tags,
    assignment: { strategy: 'Round Robin' },
    existing_lead: {
      lead_details: 'UpdateBlankOnly',
      assignee: 'Ignore',
      lead_tags: 'Ignore',
    },
    is_map_existing_call_logs: true,
  };

  const { default: fetch } = await import('node-fetch');
  const response = await fetch(`${baseUrl}/lead/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(callyzerPayload),
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

  return json;
};

/**
 * Handle complete lead creation cycle:
 * 1. Save locally to MongoDB
 * 2. Send to Callyzer
 * 3. Update MongoDB status based on Callyzer outcome
 */
const createLead = async (leadData) => {
  // Create and save lead in MongoDB first
  const lead = new Lead(leadData);
  await lead.save();

  console.log('[LeadService] ✓ Lead saved to MongoDB successfully');

  // ── Dograh Voice Agent Calls (fire immediately after save, independent of Callyzer) ──
  // 1. Admission call — fires right now
  dograhService.triggerAdmissionCall(leadData)
    .then(r => console.log(`[Dograh] ✓ Admission call triggered | run_id=${r.workflow_run_id}`))
    .catch(e => console.error('[Dograh] ✗ Admission call failed:', e.message || e));

  // 2. Visit call — fires 30 minutes later via Agenda
  agenda.schedule('in 30 minutes', 'dograh_visit_call', { leadData })
    .then(() => console.log('[Dograh] ✓ Visit call scheduled in 30 minutes'))
    .catch(e => console.error('[Dograh] ✗ Failed to schedule visit call:', e));

  // 3. Follow-up call — fires 24 hours later via Agenda
  agenda.schedule('in 24 hours', 'dograh_followup_call', { leadData })
    .then(() => console.log('[Dograh] ✓ Follow-up call scheduled in 24 hours'))
    .catch(e => console.error('[Dograh] ✗ Failed to schedule follow-up call:', e));
  // ────────────────────────────────────────────────────────────────────────────

  try {
    const callyzerRes = await sendLeadToCallyzer(leadData);
    lead.callyzerStatus = 'sent';
    lead.callyzerResponse = callyzerRes;
    await lead.save();
    
    console.log('[LeadService] ✓ Lead forwarded to Callyzer successfully');

    // Schedule 15-minute lead contact check
    agenda.schedule('in 15 minutes', 'check_lead_contact', {
      localLeadId: lead._id.toString(),
      callyzerLeadId: callyzerRes?.lead_id || null,
      phone: leadData.phone
    }).then(() => console.log('[LeadService] ✓ Scheduled 15-minute contact check job'))
      .catch(e => console.error('[LeadService] ✗ Failed to schedule job:', e));

    // Fire and forget email and whatsapp acknowledgements
    emailService.sendEmailAcknowledgement(leadData)
      .then(() => console.log('[LeadService] ✓ Email sent successfully'))
      .catch(e => console.error('[LeadService] ✗ Email error:', e.message || e));
      
    whatsappService.sendWhatsappAcknowledgement(leadData)
      .then(() => console.log('[LeadService] ✓ WhatsApp message sent successfully'))
      .catch(e => console.error('[LeadService] ✗ WhatsApp error:', e.message || e));

    return { lead, callyzerResponse: callyzerRes };
  } catch (err) {
    lead.callyzerStatus = 'failed';
    lead.errorDetail = err.message || JSON.stringify(err.data || err);
    lead.callyzerResponse = err.data || null;
    await lead.save();
    throw err;
  }
};

const getAllLeads = async () => {
  return await Lead.find().sort({ createdAt: -1 });
};

const deleteLead = async (id) => {
  return await Lead.findByIdAndDelete(id);
};


/**
 * Proxy function directly forwarding any payload to Callyzer
 */
const proxyCallyzerLead = async (payload) => {
  const apiKey = process.env.CALLYZER_API_KEY;
  const rawBaseUrl = process.env.CALLYZER_BASE_URL || '';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  if (!apiKey || !baseUrl) {
    throw new Error('Callyzer credentials are not configured in environment variables.');
  }

  const { default: fetch } = await import('node-fetch');
  const response = await fetch(`${baseUrl}/lead/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
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

  return json;
};

module.exports = {
  createLead,
  proxyCallyzerLead,
  getAllLeads,
  deleteLead
};
