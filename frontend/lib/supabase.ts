import { createClient } from '@supabase/supabase-js';
import { CandidateResult, JobConfig } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Please configure them in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a resume file to the 'resumes' Supabase Storage bucket.
 * Generates a unique filename and returns the public URL of the uploaded file.
 */
export async function uploadResume(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'pdf';
  const cleanName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 30);

  const fileName = `${Date.now()}-${cleanName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload resume to storage: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('resumes')
    .getPublicUrl(fileName);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Failed to generate public URL for uploaded resume');
  }

  return publicUrlData.publicUrl;
}

// ─────────────────────────────────────────────
// Candidates DB helpers
// ─────────────────────────────────────────────

/** Fetch all candidates ordered by newest first */
export async function fetchCandidates(): Promise<CandidateResult[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch candidates:', error.message);
    return [];
  }

  // Map snake_case DB columns → camelCase frontend type
  return (data || []).map((row: any): CandidateResult => ({
    id:              row.id,
    candidateName:   row.candidate_name,
    email:           row.email,
    phoneNumber:     row.phone_number,
    atsScore:        row.ats_score,
    matchPercentage: row.match_percentage,
    missingSkills:   row.missing_skills   || [],
    recommendation:  row.recommendation,
    resumeLink:      row.resume_url,
    appliedAt:       new Date(row.applied_at).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
    analysisSummary: row.analysis_summary  ?? undefined,
    suitReasons:     row.suit_reasons      ?? undefined,
    notSuitReasons:  row.not_suit_reasons  ?? undefined,
  }));
}

/** Insert a single candidate result into the DB */
export async function insertCandidate(
  c: CandidateResult,
  jobConfigId?: string
): Promise<void> {
  const { error } = await supabase.from('candidates').insert({
    id:               c.id,
    job_config_id:    jobConfigId ?? null,
    candidate_name:   c.candidateName,
    email:            c.email          || '',
    phone_number:     c.phoneNumber    || '',
    ats_score:        c.atsScore,
    match_percentage: c.matchPercentage,
    missing_skills:   c.missingSkills,
    recommendation:   c.recommendation,
    resume_url:       c.resumeLink,
    analysis_summary: c.analysisSummary ?? null,
    suit_reasons:     c.suitReasons     ?? null,
    not_suit_reasons: c.notSuitReasons  ?? null,
  });

  if (error) {
    console.error('Failed to insert candidate:', error.message);
  }
}

/** Delete a candidate from the DB by id */
export async function deleteCandidate(id: string): Promise<void> {
  const { error } = await supabase.from('candidates').delete().eq('id', id);
  if (error) console.error('Failed to delete candidate:', error.message);
}

// ─────────────────────────────────────────────
// Job Config DB helpers
// ─────────────────────────────────────────────

/** Fetch the single active job configuration */
export async function fetchActiveJobConfig(): Promise<{ id: string; config: JobConfig } | null> {
  const { data, error } = await supabase
    .from('job_configs')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    config: {
      jobTitle:        data.job_title,
      jobDescription:  data.job_description,
      requiredSkills:  data.required_skills  || [],
      preferredSkills: data.preferred_skills || [],
      minimumAtsScore: data.minimum_ats_score,
      weights: {
        skills:         data.weight_skills,
        experience:     data.weight_experience,
        projects:       data.weight_projects,
        education:      data.weight_education,
        certifications: data.weight_certifications,
      },
    },
  };
}

/** Upsert the active job configuration (deactivate old ones first) */
export async function upsertJobConfig(
  config: JobConfig,
  existingId?: string
): Promise<string | null> {
  // Deactivate all existing configs
  await supabase.from('job_configs').update({ is_active: false }).eq('is_active', true);

  const row = {
    job_title:             config.jobTitle,
    job_description:       config.jobDescription,
    required_skills:       config.requiredSkills,
    preferred_skills:      config.preferredSkills,
    minimum_ats_score:     config.minimumAtsScore,
    weight_skills:         config.weights.skills,
    weight_experience:     config.weights.experience,
    weight_projects:       config.weights.projects,
    weight_education:      config.weights.education,
    weight_certifications: config.weights.certifications,
    is_active:             true,
  };

  if (existingId) {
    const { error } = await supabase.from('job_configs').update(row).eq('id', existingId);
    if (error) console.error('Failed to update job config:', error.message);
    return existingId;
  } else {
    const { data, error } = await supabase.from('job_configs').insert(row).select('id').single();
    if (error) console.error('Failed to insert job config:', error.message);
    return data?.id ?? null;
  }
}
