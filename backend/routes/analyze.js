import express from 'express';
import { validateAnalyzeRequest } from '../middleware/validation.js';
import { extractTextFromPdfUrl } from '../services/pdf.js';
import { analyzeCandidate } from '../services/openai.js';

const router = express.Router();

router.post('/', validateAnalyzeRequest, async (req, res) => {
  try {
    const { 
      resume_url, 
      job_title, 
      job_description,
      candidate_name,
      email,
    } = req.body;

    console.log(`-> Processing application for: ${candidate_name || email || 'Unknown Candidate'}`);
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
      candidate_name, 
      email
    );
    console.log(`         AI Analysis complete! Score: ${analysisPayload.atsScore}%`);

    // 3. Construct final response
    console.log(`   [3/3] Formatting final response...`);
    const finalPayload = {
      ...analysisPayload,
      resumeLink: resume_url,
      appliedAt: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
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
