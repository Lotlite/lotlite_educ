export interface JobWeights {
  skills: number;
  experience: number;
  projects: number;
  education: number;
  certifications: number;
}

export interface JobConfig {
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minimumAtsScore: number;
  weights: JobWeights;
}

export interface WebhookPayload {
  candidate_name: string;
  email: string;
  resume_url: string;
  job_title: string;
  job_description: string;
  required_skills: string[];
  preferred_skills: string[];
  weights: JobWeights;
  minimum_ats_score: number;
}

export interface AnalysisReason {
  name: string;
  text: string;
}

export interface CandidateResult {
  id: string;
  candidateName: string;
  email: string;
  atsScore: number;
  matchPercentage: number;
  missingSkills: string[];
  recommendation: 'Strong Match' | 'Good Match' | 'Potential Match' | 'Not Recommended';
  resumeLink: string;
  appliedAt: string;
  phoneNumber?: string;
  jobConfigId?: string;  // links candidate to a job_configs row
  emailSent?: boolean;   // tracks if an email has been sent
  // AI analysis fields from OpenAI structured output
  analysisSummary?: string;
  suitReasons?: AnalysisReason[];
  notSuitReasons?: AnalysisReason[];
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface ResumeUploadState {
  fileId: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: ProcessingStatus;
  error?: string;
  candidateName?: string;
  atsScore?: number;
}
