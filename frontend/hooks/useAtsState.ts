import { useState, useCallback, useEffect, useRef } from 'react';
import { JobConfig, ResumeUploadState, CandidateResult, WebhookPayload } from '../types';
import {
  uploadResume,
  fetchCandidates,
  insertCandidate,
  deleteCandidate as dbDeleteCandidate,
  fetchActiveJobConfig,
  fetchAllActiveJobConfigs,
  upsertJobConfig,
} from '../lib/supabase';
import { sendResumeToWebhook } from '../services/webhook';
import { parseCandidateDetailsFromFileName } from '../utils/parser';

const DEFAULT_JOB_CONFIG: JobConfig = {
  jobTitle: '',
  jobDescription: '',
  requiredSkills: [],
  preferredSkills: [],
  minimumAtsScore: 70,
  weights: {
    skills: 20,
    experience: 20,
    projects: 20,
    education: 20,
    certifications: 20,
  },
};

export interface JobEntry {
  id: string;
  config: JobConfig;
}

export function useAtsState() {
  const [jobConfig, setJobConfig] = useState<JobConfig>(DEFAULT_JOB_CONFIG);
  const [allJobs, setAllJobs]     = useState<JobEntry[]>([]);
  const [selectedUploadJobId, setSelectedUploadJobId] = useState<string>('');
  const [uploads, setUploads]     = useState<ResumeUploadState[]>([]);
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [isClient, setIsClient]   = useState(false);

  // Track the active job_config row id so we can link candidates to it
  const activeJobConfigId = useRef<string | undefined>(undefined);

  // ── On mount: load from Supabase, fall back to localStorage ──────────
  useEffect(() => {
    setIsClient(true);

    async function loadFromDB() {
      // Load candidates
      const dbCandidates = await fetchCandidates();
      if (dbCandidates.length > 0) {
        setCandidates(dbCandidates);
      } else {
        // Fallback: try localStorage (for offline/dev mode)
        try {
          const raw = localStorage.getItem('ats_candidates_v2');
          if (raw) setCandidates(JSON.parse(raw));
        } catch (_) {}
      }

      // Load active job config
      const dbJobConfig = await fetchActiveJobConfig();
      if (dbJobConfig) {
        activeJobConfigId.current = dbJobConfig.id;
        setJobConfig(dbJobConfig.config);
      } else {
        // Fallback: try localStorage
        try {
          const raw = localStorage.getItem('ats_job_config_v2');
          if (raw) setJobConfig(JSON.parse(raw));
        } catch (_) {}
      }

      // Load all active jobs for the upload job selector
      const jobs = await fetchAllActiveJobConfigs();
      setAllJobs(jobs);
      if (jobs.length > 0) {
        setSelectedUploadJobId(jobs[0].id);
      }
    }

    loadFromDB();
  }, []);

  // ── Update and save job config ────────────────────────────────────────
  const updateJobConfig = useCallback(async (config: JobConfig) => {
    setJobConfig(config);
    // Persist to localStorage immediately for offline resilience
    localStorage.setItem('ats_job_config_v2', JSON.stringify(config));
    // Persist to Supabase
    const id = await upsertJobConfig(config, activeJobConfigId.current ?? undefined);
    if (id) {
      activeJobConfigId.current = id;
      const jobs = await fetchAllActiveJobConfigs();
      setAllJobs(jobs);
    }
  }, []);

  // ── Clear all candidates ──────────────────────────────────────────────
  const clearCandidates = useCallback(() => {
    setCandidates([]);
    setUploads([]);
    localStorage.removeItem('ats_candidates_v2');
    // Note: does not bulk-delete from Supabase to avoid accidental data loss
  }, []);

  // ── Delete single candidate ───────────────────────────────────────────
  const deleteCandidate = useCallback(async (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    
    // Legacy localStorage items had ids like 'cand_xxxxx' which break Supabase's UUID parser
    if (!id.startsWith('cand_')) {
      await dbDeleteCandidate(id);
    }
  }, []);

  // ── Process a single resume file ──────────────────────────────────────
  const processFile = useCallback(async (file: File, fileId: string, currentConfig: JobConfig) => {
    const updateUploadStatus = (
      status: ResumeUploadState['status'],
      progress: number,
      error?: string,
      extra?: Partial<ResumeUploadState>
    ) => {
      setUploads(prev =>
        prev.map(u =>
          u.fileId === fileId ? { ...u, status, progress, ...(error && { error }), ...extra } : u
        )
      );
    };

    try {
      updateUploadStatus('uploading', 10);

      // Simulate progressive upload bar
      const interval = setInterval(() => {
        setUploads(prev =>
          prev.map(u => {
            if (u.fileId === fileId && u.status === 'uploading' && u.progress < 85) {
              return { ...u, progress: u.progress + 15 };
            }
            return u;
          })
        );
      }, 300);

      // Upload file to Supabase Storage
      const resumeUrl = await uploadResume(file);
      clearInterval(interval);
      updateUploadStatus('uploading', 100);
      updateUploadStatus('processing', 100);

      // Parse fallback candidate details from filename
      const parsedDetails = parseCandidateDetailsFromFileName(file.name);

      const payload: WebhookPayload = {
        candidate_name:    parsedDetails.name,
        email:             parsedDetails.email,
        resume_url:        resumeUrl,
        job_title:         currentConfig.jobTitle,
        job_description:   currentConfig.jobDescription,
        required_skills:   currentConfig.requiredSkills,
        preferred_skills:  currentConfig.preferredSkills,
        weights:           currentConfig.weights,
        minimum_ats_score: currentConfig.minimumAtsScore,
      };

      const webhookResponse = await sendResumeToWebhook(payload);

      if (!webhookResponse || webhookResponse.atsScore === undefined) {
        throw new Error('AI analysis returned an invalid response. Please try again.');
      }

      const analysisResult: CandidateResult = {
        id:              webhookResponse.id || crypto.randomUUID(),
        candidateName:   webhookResponse.candidateName   || parsedDetails.name,
        email:           webhookResponse.email           || parsedDetails.email,
        phoneNumber:     webhookResponse.phoneNumber     || '',
        atsScore:        Number(webhookResponse.atsScore),
        matchPercentage: Number(webhookResponse.matchPercentage || webhookResponse.atsScore),
        missingSkills:   Array.isArray(webhookResponse.missingSkills) ? webhookResponse.missingSkills : [],
        recommendation:  webhookResponse.recommendation  || 'Potential Match',
        resumeLink:      resumeUrl,
        appliedAt:       webhookResponse.appliedAt || new Date().toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
        analysisSummary: webhookResponse.analysisSummary,
        suitReasons:     webhookResponse.suitReasons,
        notSuitReasons:  webhookResponse.notSuitReasons,
      };

      // Save to Supabase DB
      await insertCandidate(analysisResult, activeJobConfigId.current);

      // Update local state
      setCandidates(prev => [analysisResult, ...prev]);

      updateUploadStatus('completed', 100, undefined, {
        candidateName: analysisResult.candidateName,
        atsScore:      analysisResult.atsScore,
      });

    } catch (err: any) {
      console.error('Error processing resume:', file.name, err);
      updateUploadStatus('failed', 0, err.message || 'An error occurred during resume processing');
    }
  }, []);

  // ── Upload and process multiple resumes in parallel ───────────────────
  const uploadAndProcessResumes = useCallback(async (files: FileList | File[], jobIdOverride?: string) => {
    const fileList    = Array.from(files);
    const validFiles  = fileList.filter(file => {
      const ext      = file.name.split('.').pop()?.toLowerCase();
      const validExt  = ext === 'pdf' || ext === 'docx';
      const validSize = file.size <= 10 * 1024 * 1024;
      return validExt && validSize;
    });

    if (validFiles.length === 0) {
      alert('No valid resumes selected. Only PDF and DOCX files up to 10MB are supported.');
      return;
    }

    // Resolve which job config to screen against
    const targetJobId = jobIdOverride ?? selectedUploadJobId;
    const targetJob   = allJobs.find(j => j.id === targetJobId);
    const configToUse = targetJob?.config ?? jobConfig;

    // Temporarily override activeJobConfigId so candidates link to the right job
    const prevJobId = activeJobConfigId.current;
    if (targetJobId) activeJobConfigId.current = targetJobId;

    const newUploads = validFiles.map(file => ({
      fileId:   `file_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      progress: 0,
      status:   'idle' as const,
    }));

    setUploads(prev => [...newUploads, ...prev]);

    await Promise.all(
      validFiles.map((file, index) =>
        processFile(file, newUploads[index].fileId, configToUse)
      )
    );

    activeJobConfigId.current = prevJobId;
  }, [jobConfig, allJobs, selectedUploadJobId, processFile]);

  return {
    jobConfig,
    updateJobConfig,
    allJobs,
    selectedUploadJobId,
    setSelectedUploadJobId,
    uploads,
    candidates,
    deleteCandidate,
    clearCandidates,
    uploadAndProcessResumes,
    isClient,
  };
}

export type UseAtsStateReturn = ReturnType<typeof useAtsState>;
