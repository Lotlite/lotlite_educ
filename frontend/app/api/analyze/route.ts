import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDocumentProxy, extractText } from 'unpdf';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      resume_url, 
      job_title, 
      job_description,
      candidate_name,
      email,
    } = body;

    if (!resume_url) {
      return NextResponse.json({ error: 'Missing resume_url' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API Key is missing in server environment variables.' }, { status: 500 });
    }

    // Step 1: Download the PDF from the Supabase public URL
    const response = await fetch(resume_url);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Step 2: Extract text from PDF using unpdf (no native deps)
    const pdf = await getDocumentProxy(buffer);
    const { text: pdfText } = await extractText(pdf, { mergePages: true });

    // Step 3: Prepare the system prompt
    const systemPrompt = `You are the recruiter in recruiting agency, you are strict and you pay extra attention on details in a resume. You work with companies and find talents for their jobs. You asses any resume really attentively and critically. If the candidate is a jumper, you notice that and say us. You need to say if the candidate from out base is suitable for this job. Return 4 things: 1. Percentage (10% step) of matching candidate resume with job. 2. Short summary - should use simple language and be short. Provide final decision on candidate based on matching percentage and candidate skills vs job requirements. 3. Summary why this candidate suits this jobs. 4. Summary why this candidate doesn't suit this jobs.\n\nContext - Job Description: ${job_description}\nJob Title: ${job_title}`;

    // Step 4: Run OpenAI analysis with Structured Outputs
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
              candidate_name: {
                type: "string",
                description: "Full name of the candidate as it appears on their resume"
              },
              email: {
                type: "string",
                description: "Email address of the candidate extracted from the resume. Return empty string if not found."
              },
              phone_number: {
                type: "string",
                description: "Phone number of the candidate extracted from the resume. Return empty string if not found."
              },
              percentage: { 
                type: "integer", 
                description: "Overall suitability percentage score for the candidate (multiples of 10)" 
              },
              summary: { 
                type: "string", 
                description: "A brief summary of the candidate's experience, personality, and any notable strengths or concerns" 
              },
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

    // Map reasons-notsuit titles as missing skills for the table
    const missingSkills = parsedResult["reasons-notsuit"]?.map((r: any) => r.name) || [];

    // Assign recommendation bracket based on score
    let recommendation = 'Potential Match';
    if (parsedResult.percentage >= 80) recommendation = 'Strong Match';
    else if (parsedResult.percentage >= 60) recommendation = 'Good Match';
    else recommendation = 'Not Recommended';

    // Use LLM-extracted contact details; fall back to values passed from frontend
    const finalPayload = {
      id: crypto.randomUUID(),
      candidateName: parsedResult.candidate_name || candidate_name || 'Unknown Candidate',
      email:         parsedResult.email         || email          || '',
      phoneNumber:   parsedResult.phone_number  || '',
      atsScore:        parsedResult.percentage || 0,
      matchPercentage: parsedResult.percentage || 0,
      missingSkills,
      recommendation,
      analysisSummary: parsedResult.summary,
      suitReasons:    parsedResult["reasons-suit"],
      notSuitReasons: parsedResult["reasons-notsuit"],
      resumeLink: resume_url,
      appliedAt: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
    };

    return NextResponse.json(finalPayload);

  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json(
      { error: isProd ? 'Analysis failed' : error.message },
      { status: 500 }
    );
  }
}
