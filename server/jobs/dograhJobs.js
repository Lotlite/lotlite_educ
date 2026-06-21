/**
 * dograhJobs.js
 * 
 * Agenda.js job definitions for delayed Dograh voice agent calls.
 * 
 * Jobs defined:
 *   - 'dograh_visit_call'   : fires ~30 minutes after lead creation
 *   - 'dograh_followup_call': fires ~24 hours after lead creation
 * 
 * These jobs are scheduled inside leadService.js → createLead()
 */

const agenda = require('../config/agenda');
const dograhService = require('../services/dograhService');

// ─── Visit Call Job (fires 30 minutes after lead creation) ─────────────────────
agenda.define('dograh_visit_call', async (job) => {
  const { leadData } = job.attrs.data;
  const label = `[Agenda:dograh_visit_call] phone=${leadData?.phone}`;

  console.log(`${label} | Starting job`);

  try {
    const result = await dograhService.triggerVisitCall(leadData);
    console.log(`${label} | ✓ Call triggered | run_id=${result.workflow_run_id}`);
  } catch (err) {
    console.error(`${label} | ✗ Failed:`, err.message || err);
    // Re-throw so Agenda marks the job as failed (and can retry if configured)
    throw err;
  }
});

// ─── Follow-up Call Job (fires 24 hours after lead creation) ──────────────────
agenda.define('dograh_followup_call', async (job) => {
  const { leadData } = job.attrs.data;
  const label = `[Agenda:dograh_followup_call] phone=${leadData?.phone}`;

  console.log(`${label} | Starting job`);

  try {
    const result = await dograhService.triggerFollowUpCall(leadData);
    console.log(`${label} | ✓ Call triggered | run_id=${result.workflow_run_id}`);
  } catch (err) {
    console.error(`${label} | ✗ Failed:`, err.message || err);
    throw err;
  }
});
