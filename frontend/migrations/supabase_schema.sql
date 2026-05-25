-- ============================================================
-- Lotlite Talent Acquisition — Supabase Database Migration
-- Version : 1.0.0
-- Created : 2026-05-24
-- Description:
--   Full schema for the ATS Resume Shortlisting Dashboard.
--   Covers: job_configs, candidates, resume_uploads tables,
--           enums, RLS policies, indexes, and Storage bucket.
-- ============================================================


-- ──────────────────────────────────────────────────────────
-- 1. EXTENSIONS
-- ──────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- gen_random_uuid()


-- ──────────────────────────────────────────────────────────
-- 2. ENUMS
-- ──────────────────────────────────────────────────────────

-- Candidate recommendation label (maps to CandidateResult.recommendation)
CREATE TYPE recommendation_status AS ENUM (
  'Strong Match',
  'Good Match',
  'Potential Match',
  'Not Recommended'
);

-- Resume upload processing state (maps to ResumeUploadState.status)
CREATE TYPE processing_status AS ENUM (
  'idle',
  'uploading',
  'processing',
  'completed',
  'failed'
);


-- ──────────────────────────────────────────────────────────
-- 3. TABLES
-- ──────────────────────────────────────────────────────────

-- ┌──────────────────────────────────────┐
-- │  job_configs                         │
-- │  Persists recruiter job positions.   │
-- └──────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS job_configs (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Core job fields (maps to JobConfig interface)
  job_title         TEXT          NOT NULL,
  job_description   TEXT          NOT NULL,
  required_skills   TEXT[]        NOT NULL DEFAULT '{}',
  preferred_skills  TEXT[]        NOT NULL DEFAULT '{}',
  minimum_ats_score INTEGER       NOT NULL DEFAULT 70
                                  CHECK (minimum_ats_score BETWEEN 1 AND 100),

  -- Scoring weights (maps to JobWeights interface — must sum to 100)
  weight_skills           INTEGER NOT NULL DEFAULT 40,
  weight_experience       INTEGER NOT NULL DEFAULT 25,
  weight_projects         INTEGER NOT NULL DEFAULT 20,
  weight_education        INTEGER NOT NULL DEFAULT 10,
  weight_certifications   INTEGER NOT NULL DEFAULT 5,

  -- Soft constraint: all weights should sum to 100
  CONSTRAINT weights_sum_100 CHECK (
    weight_skills + weight_experience + weight_projects
    + weight_education + weight_certifications = 100
  ),

  -- Metadata
  is_active         BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE job_configs IS
  'Stores each job position configuration set by the recruiter. '
  'Only one record should have is_active = TRUE at a time.';


-- ┌──────────────────────────────────────────────────────┐
-- │  candidates                                          │
-- │  One row per processed resume / applicant result.    │
-- └──────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS candidates (
  id                  UUID                  PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Links back to the job this candidate was screened against
  job_config_id       UUID                  REFERENCES job_configs (id)
                                            ON DELETE SET NULL,

  -- Applicant identity (maps to CandidateResult)
  candidate_name      TEXT                  NOT NULL,
  email               TEXT                  NOT NULL DEFAULT '',
  phone_number        TEXT                  NOT NULL DEFAULT '',

  -- AI Scoring output
  ats_score           INTEGER               NOT NULL DEFAULT 0
                                            CHECK (ats_score BETWEEN 0 AND 100),
  match_percentage    INTEGER               NOT NULL DEFAULT 0
                                            CHECK (match_percentage BETWEEN 0 AND 100),
  recommendation      recommendation_status NOT NULL DEFAULT 'Potential Match',

  -- Skill analysis
  missing_skills      TEXT[]                NOT NULL DEFAULT '{}',

  -- Full AI analysis (from new OpenAI structured output)
  analysis_summary    TEXT,                          -- GPT summary paragraph
  suit_reasons        JSONB,                         -- [{name, text}, ...]
  not_suit_reasons    JSONB,                         -- [{name, text}, ...]

  -- Resume storage
  resume_url          TEXT                  NOT NULL, -- Supabase Storage public URL

  -- Metadata
  applied_at          TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE candidates IS
  'Each row is one AI-screened resume result tied to a job_config. '
  'suit_reasons / not_suit_reasons are stored as JSONB arrays from the GPT structured output.';

COMMENT ON COLUMN candidates.suit_reasons IS
  'Array of {name: string, text: string} objects. Mirrors reasons-suit from LLM schema.';

COMMENT ON COLUMN candidates.not_suit_reasons IS
  'Array of {name: string, text: string} objects. Mirrors reasons-notsuit from LLM schema.';


-- ┌──────────────────────────────────────────────────────┐
-- │  resume_uploads                                      │
-- │  Tracks the processing state of individual uploads.  │
-- └──────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS resume_uploads (
  id              UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Linked candidate once processing completes
  candidate_id    UUID              REFERENCES candidates (id)
                                    ON DELETE CASCADE,

  -- File metadata (maps to ResumeUploadState interface)
  file_name       TEXT              NOT NULL,
  file_size       BIGINT            NOT NULL, -- bytes
  resume_url      TEXT,                       -- populated after Supabase upload
  progress        INTEGER           NOT NULL DEFAULT 0
                                    CHECK (progress BETWEEN 0 AND 100),
  status          processing_status NOT NULL DEFAULT 'idle',
  error_message   TEXT,                       -- populated if status = 'failed'

  -- Metadata
  uploaded_at     TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE resume_uploads IS
  'Tracks the upload and AI-processing lifecycle of each resume file. '
  'Maps to the ResumeUploadState interface in the frontend.';


-- ──────────────────────────────────────────────────────────
-- 4. INDEXES
-- ──────────────────────────────────────────────────────────

-- Fast retrieval of the currently active job config
CREATE INDEX IF NOT EXISTS idx_job_configs_is_active
  ON job_configs (is_active)
  WHERE is_active = TRUE;

-- Candidate lookups ordered by score (descending — top performers first)
CREATE INDEX IF NOT EXISTS idx_candidates_ats_score
  ON candidates (ats_score DESC);

-- Filter candidates by job
CREATE INDEX IF NOT EXISTS idx_candidates_job_config_id
  ON candidates (job_config_id);

-- Filter candidates by recommendation tier
CREATE INDEX IF NOT EXISTS idx_candidates_recommendation
  ON candidates (recommendation);

-- Upload status lookups
CREATE INDEX IF NOT EXISTS idx_resume_uploads_status
  ON resume_uploads (status);


-- ──────────────────────────────────────────────────────────
-- 5. UPDATED_AT TRIGGER  (auto-updates job_configs.updated_at)
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_job_configs_updated_at
  BEFORE UPDATE ON job_configs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();


-- ──────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE job_configs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_uploads  ENABLE ROW LEVEL SECURITY;

-- ── job_configs policies ─────────────────────────────────
-- Allow full public read/write (adjust to auth.uid() when auth is added)
CREATE POLICY "job_configs: public read"
  ON job_configs FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "job_configs: public insert"
  ON job_configs FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "job_configs: public update"
  ON job_configs FOR UPDATE
  TO anon, authenticated
  USING (TRUE);

-- ── candidates policies ───────────────────────────────────
CREATE POLICY "candidates: public read"
  ON candidates FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "candidates: public insert"
  ON candidates FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "candidates: public delete"
  ON candidates FOR DELETE
  TO anon, authenticated
  USING (TRUE);

-- ── resume_uploads policies ───────────────────────────────
CREATE POLICY "resume_uploads: public read"
  ON resume_uploads FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "resume_uploads: public insert"
  ON resume_uploads FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "resume_uploads: public update"
  ON resume_uploads FOR UPDATE
  TO anon, authenticated
  USING (TRUE);


-- ──────────────────────────────────────────────────────────
-- 7. STORAGE BUCKET
-- ──────────────────────────────────────────────────────────
-- Run these statements in the Supabase SQL Editor.
-- The storage schema is managed by Supabase internally;
-- these INSERT statements create the bucket if it doesn't exist.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  TRUE,           -- Public bucket so generated URLs work without auth tokens
  10485760,       -- 10 MB max file size
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: allow anyone to upload and read from the resumes bucket
CREATE POLICY "resumes: public upload"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "resumes: public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resumes');


-- ──────────────────────────────────────────────────────────
-- 8. SEED: Default job config (matches DEFAULT_JOB_CONFIG in useAtsState.ts)
-- ──────────────────────────────────────────────────────────
INSERT INTO job_configs (
  job_title,
  job_description,
  required_skills,
  preferred_skills,
  minimum_ats_score,
  weight_skills,
  weight_experience,
  weight_projects,
  weight_education,
  weight_certifications,
  is_active
) VALUES (
  'Senior Frontend Engineer',
  'We are looking for a Senior Frontend Engineer to join our core product team. You will lead the development of complex React/Next.js features, design and implement reusable component libraries, collaborate closely with UI/UX designers, and optimize web app performance.',
  ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
  ARRAY['Supabase', 'GraphQL', 'TanStack Query', 'Zod', 'Jest'],
  70,
  40, 25, 20, 10, 5,
  TRUE
)
ON CONFLICT DO NOTHING;
