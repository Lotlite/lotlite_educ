/**
 * dograhService.js
 * 
 * Triggers outbound voice calls via the self-hosted Dograh platform.
 * Base URL: https://voice.bitlancetechhub.com
 * 
 * Three flows per stream (BBA / MBA):
 *   - Admission  : fires immediately on lead creation
 *   - Visit      : scheduled (e.g. 30 minutes after admission call)
 *   - Follow-up  : scheduled (e.g. 24 hours later)
 * 
 * Env vars required (add to server/.env):
 *   DOGRAH_API_KEY
 *   DOGRAH_BASE_URL                  (defaults to https://voice.bitlancetechhub.com)
 *   DOGRAH_BBA_ADMISSION_UUID
 *   DOGRAH_MBA_ADMISSION_UUID
 *   DOGRAH_BBA_VISIT_UUID
 *   DOGRAH_MBA_VISIT_UUID
 *   DOGRAH_BBA_FOLLOWUP_UUID
 *   DOGRAH_MBA_FOLLOWUP_UUID
 */

// ─── Dynamic Config (read at call time, not module load time) ─────────────────
// This ensures env vars added after server start are always picked up.
function getConfig() {
  return {
    baseUrl: (process.env.DOGRAH_BASE_URL || 'https://voice.bitlancetechhub.com').replace(/\/+$/, ''),
    apiKey:  process.env.DOGRAH_API_KEY || '',
    uuids: {
      bba: {
        admission: process.env.DOGRAH_BBA_ADMISSION_UUID || '',
        visit:     process.env.DOGRAH_BBA_VISIT_UUID     || '',
        followup:  process.env.DOGRAH_BBA_FOLLOWUP_UUID  || '',
      },
      mba: {
        admission: process.env.DOGRAH_MBA_ADMISSION_UUID || '',
        visit:     process.env.DOGRAH_MBA_VISIT_UUID     || '',
        followup:  process.env.DOGRAH_MBA_FOLLOWUP_UUID  || '',
      },
    },
  };
}

// ─── Stream Detection ──────────────────────────────────────────────────────────
/**
 * Determine stream key ('bba' | 'mba') from the programCategory field.
 * Falls back to 'bba' if no match is found.
 */
function detectStream(programCategory = '') {
  const lower = programCategory.toLowerCase();
  if (lower.includes('mba') || lower.includes('mca') || lower.includes('postgraduate')) return 'mba';
  return 'bba';
}

// ─── Core Trigger ─────────────────────────────────────────────────────────────
/**
 * Fire an outbound call via the Dograh workflow UUID endpoint.
 * 
 * @param {string} workflowUuid  - Agent UUID
 * @param {string} phone         - Recipient phone number (E.164, e.g. +919876500000)
 * @param {object} initialContext - Template variables injected into agent prompts
 * @returns {Promise<{workflow_run_id: number, workflow_run_name: string, status: string}>}
 */
async function triggerCall(workflowUuid, phone, initialContext = {}) {
  const { baseUrl, apiKey } = getConfig();

  if (!apiKey) throw new Error('[Dograh] DOGRAH_API_KEY is not set.');
  if (!workflowUuid) throw new Error('[Dograh] Agent UUID is empty — check your .env variables.');

  // Normalise phone to E.164 format (+91XXXXXXXXXX for Indian numbers)
  let normalised = phone.replace(/[\s\-]/g, ''); // strip spaces and dashes
  if (!normalised.startsWith('+')) {
    normalised = normalised.replace(/^0+/, ''); // strip leading zeros (e.g. 06398... → 6398...)
    if (normalised.length === 10) {
      // Plain 10-digit Indian mobile number — prepend country code
      normalised = '91' + normalised;
    }
    normalised = '+' + normalised;
  }

  const { default: fetch } = await import('node-fetch');
  const url = `${baseUrl}/api/v1/public/agent/workflow/${workflowUuid}`;

  console.log(`[Dograh] POST ${url} | phone=${normalised}`);

  const response = await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key':    apiKey,
    },
    body: JSON.stringify({
      phone_number:    normalised,
      initial_context: initialContext,
    }),
  });

  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (!response.ok) {
    const err = new Error(`[Dograh] HTTP ${response.status}: ${text}`);
    err.status = response.status;
    err.data   = json;
    throw err;
  }

  return json; // { status, workflow_run_id, workflow_run_name }
}

// ─── Flow Helpers ─────────────────────────────────────────────────────────────

/**
 * Build a concise initial_context object from lead data
 * so the Dograh agent can personalise the conversation.
 */
function buildContext(leadData) {
  return {
    name:    leadData.fullName  || leadData.name  || 'Student',
    email:   leadData.email     || '',
    program: leadData.programCategory || leadData.program || '',
    source:  leadData.source    || 'Website',
    phone:   leadData.phone     || '',
  };
}

/**
 * Trigger Admission flow — call immediately after lead is created.
 */
async function triggerAdmissionCall(leadData) {
  const { uuids } = getConfig();
  const stream = detectStream(leadData.programCategory || leadData.program);
  const uuid   = uuids[stream]?.admission;
  console.log(`[Dograh] Triggering ADMISSION call | stream=${stream} | uuid=${uuid}`);
  return triggerCall(uuid, leadData.phone, buildContext(leadData));
}

/**
 * Trigger Visit flow — scheduled 30 minutes after admission.
 */
async function triggerVisitCall(leadData) {
  const { uuids } = getConfig();
  const stream = detectStream(leadData.programCategory || leadData.program);
  const uuid   = uuids[stream]?.visit;
  console.log(`[Dograh] Triggering VISIT call | stream=${stream} | uuid=${uuid}`);
  return triggerCall(uuid, leadData.phone, buildContext(leadData));
}

/**
 * Trigger Follow-up flow — scheduled 24 hours after lead creation.
 */
async function triggerFollowUpCall(leadData) {
  const { uuids } = getConfig();
  const stream = detectStream(leadData.programCategory || leadData.program);
  const uuid   = uuids[stream]?.followup;
  console.log(`[Dograh] Triggering FOLLOW-UP call | stream=${stream} | uuid=${uuid}`);
  return triggerCall(uuid, leadData.phone, buildContext(leadData));
}

module.exports = {
  triggerAdmissionCall,
  triggerVisitCall,
  triggerFollowUpCall,
};
