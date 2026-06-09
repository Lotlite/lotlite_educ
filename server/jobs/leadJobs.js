const agenda = require('../config/agenda');
const Lead = require('../models/Lead');

agenda.define('check_lead_contact', async (job) => {
  const { localLeadId, callyzerLeadId, phone } = job.attrs.data;
  console.log(`[Agenda] Running 'check_lead_contact' for Lead ID: ${localLeadId}`);

  try {
    const lead = await Lead.findById(localLeadId);
    if (!lead) {
      console.warn(`[Agenda] Lead not found: ${localLeadId}`);
      return;
    }

    // TODO: Phase 1 - Fetch Callyzer status/call logs
    // We don't have the exact API endpoint. It might be a GET /lead/:id or similar.
    // Replace with actual implementation once API is known.
    const isContacted = await checkCallyzerLeadContacted(callyzerLeadId, phone);

    if (!isContacted) {
      console.log(`[Agenda] Lead ${localLeadId} was NOT contacted. Reassigning...`);
      // TODO: Phase 2 - Reassign lead to a free agent
      // Replace with actual implementation once API is known.
      await reassignCallyzerLead(callyzerLeadId);
    } else {
      console.log(`[Agenda] Lead ${localLeadId} was contacted. No reassignment needed.`);
    }

  } catch (err) {
    console.error(`[Agenda] Error checking lead contact for ${localLeadId}:`, err);
    throw err; // Agenda will automatically retry if configured
  }
});

// Placeholder for checking if lead was contacted
async function checkCallyzerLeadContacted(callyzerLeadId, phone) {
  // const apiKey = process.env.CALLYZER_API_KEY;
  // const baseUrl = (process.env.CALLYZER_BASE_URL || '').replace(/\/+$/, '');
  
  // NOTE: The endpoint provided 'POST /call-log/get' requires 'unique_ids' of call logs
  // which we do not have. You need an endpoint like GET /lead/{id} to check the status.
  
  // Returning false to simulate an uncontacted lead for testing
  return false;
}

// Placeholder for reassigning the lead
async function reassignCallyzerLead(callyzerLeadId) {
  // const apiKey = process.env.CALLYZER_API_KEY;
  // const baseUrl = (process.env.CALLYZER_BASE_URL || '').replace(/\/+$/, '');
  
  // IMPLEMENTATION NEEDED: 
  // e.g. PUT /lead/assign/{callyzerLeadId} with body { employee_id: nextAgentId }
}
