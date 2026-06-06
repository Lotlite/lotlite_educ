import OpenAI from 'openai';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { scoreToRecommendation } from '../utils/constants.js';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeCandidate(pdfText, jobTitle, jobDescription, candidateName, email, requiredSkills = [], preferredSkills = [], weights = {}, minAtsScore = 0) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API Key is missing in server environment variables.');
  }

  const skillsContext = requiredSkills.length > 0 ? `\nRequired Skills: ${requiredSkills.join(', ')}` : '';
  const preferredContext = preferredSkills.length > 0 ? `\nPreferred Skills: ${preferredSkills.join(', ')}` : '';
  
  const systemPrompt = `You are the recruiter in recruiting agency, you are strict and you pay extra attention on details in a resume. You work with companies and find talents for their jobs. You asses any resume really attentively and critically. If the candidate is a jumper, you notice that and say us. You need to say if the candidate from out base is suitable for this job. Return 4 things: 1. Percentage (10% step) of matching candidate resume with job. 2. Short summary - should use simple language and be short. Provide final decision on candidate based on matching percentage and candidate skills vs job requirements. 3. Summary why this candidate suits this jobs. 4. Summary why this candidate doesn't suit this jobs.\n\nContext - Job Description: ${jobDescription}\nJob Title: ${jobTitle}${skillsContext}${preferredContext}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: pdfText }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: "candidate_evaluation",
        description: "Structured data for evaluating a candidate based on experience and fit",
        strict: true,
        schema: {
          type: "object",
          properties: {
            candidate_name: { type: "string", description: "Full name of the candidate as it appears on their resume" },
            email: { type: "string", description: "Email address of the candidate extracted from the resume. Return empty string if not found." },
            phone_number: { type: "string", description: "Phone number of the candidate extracted from the resume. Return empty string if not found." },
            percentage: { type: "integer", description: "Overall suitability percentage score for the candidate (multiples of 10)" },
            summary: { type: "string", description: "A brief summary of the candidate's experience, personality, and any notable strengths or concerns" },
            "reasons-suit": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Title of the strength or reason for suitability" },
                  text: { type: "string", description: "Description of how this experience or skill matches the job requirements" }
                },
                required: ["name", "text"],
                additionalProperties: false
              },
              description: "List of reasons why the candidate is suitable for the position"
            },
            "reasons-notsuit": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Title of the concern or reason for unsuitability" },
                  text: { type: "string", description: "Description of how this factor may not align with the job requirements" }
                },
                required: ["name", "text"],
                additionalProperties: false
              },
              description: "List of reasons why the candidate may not be suitable for the position"
            }
          },
          required: ["candidate_name", "email", "phone_number", "percentage", "summary", "reasons-suit", "reasons-notsuit"],
          additionalProperties: false
        }
      }
    }
  });

  const resultText = completion.choices[0].message.content;
  const parsedResult = JSON.parse(resultText || "{}");

  const missingSkills = parsedResult["reasons-notsuit"]?.map(r => r.name) || [];

  const recommendation = scoreToRecommendation(parsedResult.percentage || 0);

  return {
    id: crypto.randomUUID(),
    candidateName: parsedResult.candidate_name || candidateName || 'Unknown Candidate',
    email: parsedResult.email || email || '',
    phoneNumber: parsedResult.phone_number || '',
    atsScore: parsedResult.percentage || 0,
    matchPercentage: parsedResult.percentage || 0,
    missingSkills,
    recommendation,
    analysisSummary: parsedResult.summary,
    suitReasons: parsedResult["reasons-suit"],
    notSuitReasons: parsedResult["reasons-notsuit"],
  };
}
