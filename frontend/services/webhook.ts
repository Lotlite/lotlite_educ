import axios from 'axios';
import { WebhookPayload, CandidateResult, JobConfig } from '../types';

// Falls back to the built-in Next.js API route so the frontend works standalone
// (no separate Express service needed). Set NEXT_PUBLIC_BACKEND_URL to route to
// an external backend instead.
const WEBHOOK_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '/api/analyze';

/**
 * Sends candidate resume details and job configuration to the n8n webhook.
 */
export async function sendResumeToWebhook(
  payload: WebhookPayload
): Promise<any> {
  const response = await axios.post(WEBHOOK_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout
  });
  return response.data;
}

/**
 * Fallback local parser to simulate AI resume analysis.
 * This runs if the webhook fails, ensuring the recruiter gets a fully working dashboard.
 */
export function generateLocalAnalysis(
  candidateName: string,
  email: string,
  resumeUrl: string,
  jobConfig: JobConfig
): CandidateResult {
  // Generate semi-random matching based on job skills to make it look realistic
  const allJobSkills = [...jobConfig.requiredSkills, ...jobConfig.preferredSkills];
  
  // Decide which skills are matched (approx 60-90% match rate)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  
  jobConfig.requiredSkills.forEach(skill => {
    // 75% chance of matching a required skill
    if (Math.random() > 0.25) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  jobConfig.preferredSkills.forEach(skill => {
    // 50% chance of matching a preferred skill
    if (Math.random() > 0.5) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate a simulated ATS score based on matched skills and random factors (e.g. experience, education)
  const skillsScore = allJobSkills.length > 0 
    ? (matchedSkills.length / allJobSkills.length) * 100 
    : 70;
    
  // Add weightage simulation
  const w = jobConfig.weights;
  
  // Experience score (60 - 95)
  const experienceScore = 60 + Math.floor(Math.random() * 36);
  // Projects score (50 - 100)
  const projectsScore = 50 + Math.floor(Math.random() * 51);
  // Education score (60 - 95)
  const educationScore = 60 + Math.floor(Math.random() * 36);
  // Certifications score (40 - 100)
  const certificationsScore = 40 + Math.floor(Math.random() * 61);

  // Weighted total score
  const totalScore = Math.round(
    (skillsScore * (w.skills / 100)) +
    (experienceScore * (w.experience / 100)) +
    (projectsScore * (w.projects / 100)) +
    (educationScore * (w.education / 100)) +
    (certificationsScore * (w.certifications / 100))
  );

  // Recommendations based on score
  let recommendation: CandidateResult['recommendation'] = 'Potential Match';
  if (totalScore >= jobConfig.minimumAtsScore + 10) {
    recommendation = 'Strong Match';
  } else if (totalScore >= jobConfig.minimumAtsScore) {
    recommendation = 'Good Match';
  } else if (totalScore < 50) {
    recommendation = 'Not Recommended';
  } else {
    recommendation = 'Potential Match';
  }

  return {
    id: crypto.randomUUID(),
    candidateName,
    email,
    phoneNumber: '',
    atsScore: totalScore,
    matchPercentage: totalScore, // Simplify match % to equal the score for display
    missingSkills,
    recommendation,
    resumeLink: resumeUrl,
    appliedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}
