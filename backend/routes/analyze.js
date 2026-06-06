import express from 'express';
import { validateAnalyzeRequest } from '../middleware/validation.js';
import { extractTextFromPdfUrl } from '../services/pdf.js';
import { analyzeCandidate } from '../services/openai.js';
import { parseCandidateDetailsFromFileName } from '../utils/parser.js';
import { formatAppliedAt } from '../utils/format.js';

const router = express.Router();

router.post('/', validateAnalyzeRequest, async (req, res) => {
  try {
    const {
      resume_url,
      job_title,
      job_description,
      candidate_name,
      email,
      required_skills,
      preferred_skills,
      weights,
      minimum_ats_score,
    } = req.body;

    // Fall back to filename-parsed details when the caller doesn't supply them
    const fileName = resume_url.split('/').pop() || '';
    const parsed = parseCandidateDetailsFromFileName(fileName);
    const resolvedName  = candidate_name || parsed.name;
    const resolvedEmail = email          || parsed.email;

    console.log(`-> Processing application for: ${resolvedName}`);
    console.log(`   Job Title: ${job_title}`);

    // 1. Extract Text
    console.log(`   [1/3] Downloading & extracting text from PDF...`);
    const pdfText = await extractTextFromPdfUrl(resume_url);
    console.log(`         Successfully extracted ${pdfText.length} characters.`);

    // 2. Analyze via OpenAI
    console.log(`   [2/3] Sending resume to OpenAI for analysis...`);
    const analysisPayload = await analyzeCandidate(
      pdfText,
      job_title,
      job_description,
      resolvedName,
      resolvedEmail,
      required_skills,
      preferred_skills,
      weights,
      minimum_ats_score
    );
    console.log(`         AI Analysis complete! Score: ${analysisPayload.atsScore}%`);

    // 3. Construct final response
    console.log(`   [3/3] Formatting final response...`);
    const finalPayload = {
      ...analysisPayload,
      resumeLink: resume_url,
      appliedAt: formatAppliedAt(),
    };

    console.log(`-> ✅ Successfully processed candidate: ${finalPayload.candidateName}`);
    return res.json(finalPayload);

  } catch (error) {
    console.error('-> ❌ Error in /api/analyze route:', error);
    const isProd = process.env.NODE_ENV === 'production';
    return res.status(500).json({ error: isProd ? 'Analysis failed' : error.message });
  }
});

export default router;
