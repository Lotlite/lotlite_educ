import express from 'express';
import { sendShortlistedEmail, sendNotShortlistedEmail } from '../services/email.js';

const router = express.Router();

/**
 * POST /api/email/send
 * Body:
 *   {
 *     type: 'shortlisted' | 'not_shortlisted',
 *     to: string,                   // candidate email
 *     candidateName: string,
 *     jobTitle: string,
 *     atsScore: number,
 *     recommendation?: string,
 *     missingSkills?: string[]
 *   }
 */
router.post('/send', async (req, res) => {
  const { type, to, candidateName, jobTitle, atsScore, recommendation, missingSkills = [] } = req.body;

  // ── Validation ────────────────────────────────────────────────────────────
  if (!type || !to || !candidateName || !jobTitle || atsScore === undefined) {
    return res.status(400).json({ error: 'Missing required fields: type, to, candidateName, jobTitle, atsScore' });
  }

  if (!['shortlisted', 'not_shortlisted'].includes(type)) {
    return res.status(400).json({ error: 'type must be "shortlisted" or "not_shortlisted"' });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    if (type === 'shortlisted') {
      await sendShortlistedEmail({ to, candidateName, jobTitle, atsScore, recommendation, missingSkills });
    } else {
      await sendNotShortlistedEmail({ to, candidateName, jobTitle, atsScore, missingSkills });
    }

    console.log(`[Email] ✅ ${type} email sent to ${to} for "${jobTitle}"`);
    return res.json({ success: true, message: `${type} email sent to ${to}` });

  } catch (err) {
    console.error('[Email] ❌ Failed to send email:', err.message);
    return res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

/**
 * POST /api/email/send-bulk
 * Sends emails to multiple candidates in one call.
 * Body: { candidates: Array<{ type, to, candidateName, jobTitle, atsScore, recommendation, missingSkills }> }
 */
router.post('/send-bulk', async (req, res) => {
  const { candidates } = req.body;

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res.status(400).json({ error: 'candidates must be a non-empty array' });
  }

  const results = await Promise.allSettled(
    candidates.map(async (c) => {
      const { type, to, candidateName, jobTitle, atsScore, recommendation, missingSkills = [] } = c;

      if (!type || !to || !candidateName || !jobTitle || atsScore === undefined) {
        throw new Error(`Missing fields for candidate: ${candidateName || to}`);
      }

      if (type === 'shortlisted') {
        await sendShortlistedEmail({ to, candidateName, jobTitle, atsScore, recommendation, missingSkills });
      } else {
        await sendNotShortlistedEmail({ to, candidateName, jobTitle, atsScore, missingSkills });
      }

      console.log(`[Email] ✅ ${type} email sent to ${to}`);
      return { to, status: 'sent' };
    })
  );

  const summary = results.map((r, i) => ({
    to: candidates[i].to,
    status: r.status === 'fulfilled' ? 'sent' : 'failed',
    error: r.status === 'rejected' ? r.reason?.message : undefined,
  }));

  const failCount = summary.filter(s => s.status === 'failed').length;
  console.log(`[Email] Bulk send complete: ${summary.length - failCount} sent, ${failCount} failed`);

  return res.json({ results: summary });
});

export default router;
