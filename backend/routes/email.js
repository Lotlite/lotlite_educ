import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendShortlistedEmail, sendNotShortlistedEmail } from '../services/email.js';

const router = express.Router();

// Initialize Supabase client using Service Role Key (bypasses RLS)
// It requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pelbzgpgbmtzahxfnanc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function markCandidateEmailSent(candidateId) {
  if (!supabase || !candidateId) return;
  try {
    const { error } = await supabase.from('candidates').update({ email_sent: true }).eq('id', candidateId);
    if (error) {
      console.error(`[DB] Failed to mark email_sent for ${candidateId}:`, error.message);
    } else {
      console.log(`[DB] ✅ Marked email_sent = true for ${candidateId}`);
    }
  } catch (err) {
    console.error(`[DB] Error updating candidate ${candidateId}:`, err);
  }
}

/**
 * POST /api/email/send
 */
router.post('/send', async (req, res) => {
  const { candidateId, type, to, candidateName, jobTitle, atsScore, recommendation, missingSkills = [] } = req.body;

  if (!type || !to || !candidateName || !jobTitle || atsScore === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    if (type === 'shortlisted') {
      await sendShortlistedEmail({ to, candidateName, jobTitle, atsScore, recommendation, missingSkills });
    } else {
      await sendNotShortlistedEmail({ to, candidateName, jobTitle, atsScore, missingSkills });
    }

    console.log(`[Email] ✅ ${type} email sent to ${to} for "${jobTitle}"`);
    
    // Update the database
    if (candidateId) {
      await markCandidateEmailSent(candidateId);
    }

    return res.json({ success: true, message: `${type} email sent to ${to}` });
  } catch (err) {
    console.error('[Email] ❌ Failed to send email:', err.message);
    return res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

/**
 * POST /api/email/send-bulk
 */
router.post('/send-bulk', async (req, res) => {
  const { candidates } = req.body;

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res.status(400).json({ error: 'candidates must be a non-empty array' });
  }

  const results = await Promise.allSettled(
    candidates.map(async (c) => {
      const { candidateId, type, to, candidateName, jobTitle, atsScore, recommendation, missingSkills = [] } = c;

      if (!type || !to || !candidateName || !jobTitle || atsScore === undefined) {
        throw new Error(`Missing fields for candidate: ${candidateName || to}`);
      }

      if (type === 'shortlisted') {
        await sendShortlistedEmail({ to, candidateName, jobTitle, atsScore, recommendation, missingSkills });
      } else {
        await sendNotShortlistedEmail({ to, candidateName, jobTitle, atsScore, missingSkills });
      }

      console.log(`[Email] ✅ ${type} email sent to ${to}`);
      
      // Update database
      if (candidateId) {
        await markCandidateEmailSent(candidateId);
      }
      
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
