'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, Briefcase, User, Mail, Phone, FileText } from 'lucide-react';
import { supabase, uploadResume } from '../lib/supabase';
import { JobConfig } from '../types';
import { sendResumeToWebhook } from '../services/webhook';

interface Props {
  jobConfig: JobConfig;
  jobId: string;
}

export default function CandidateApplyForm({ jobConfig, jobId }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      setStatus('uploading');
      const publicUrl = await uploadResume(file);

      setStatus('processing');
      const payload = {
        resume_url: publicUrl,
        job_title: jobConfig.jobTitle,
        job_description: jobConfig.jobDescription,
        candidate_name: name,
        email: email,
        required_skills: jobConfig.requiredSkills,
        preferred_skills: jobConfig.preferredSkills,
        weights: jobConfig.weights,
        minimum_ats_score: jobConfig.minimumAtsScore,
      };

      const result = await sendResumeToWebhook(payload);

      await supabase.from('candidates').insert({
        id: result.id,
        job_config_id: jobId,
        candidate_name: result.candidateName || name,
        email: result.email || email,
        phone_number: result.phoneNumber || phone,
        ats_score: result.atsScore,
        match_percentage: result.matchPercentage,
        missing_skills: result.missingSkills,
        recommendation: result.recommendation,
        resume_url: publicUrl,
        analysis_summary: result.analysisSummary,
        suit_reasons: result.suitReasons,
        not_suit_reasons: result.notSuitReasons,
      });

      setStatus('success');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Something went wrong while processing your application.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 text-center">
        <div className="bg-card p-10 rounded-2xl shadow-xl max-w-md w-full border border-border">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Thank you for applying for the <strong>{jobConfig.jobTitle}</strong> position. Our recruitment team will review your profile and get back to you shortly.
          </p>
          <button
            onClick={() => {
              setStatus('idle');
              setFile(null);
              setName('');
              setEmail('');
              setPhone('');
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8 bg-card p-8 rounded-3xl border border-border shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Join Our Team</h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Applying for: <span className="text-primary">{jobConfig.jobTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                required
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="pl-10 w-full bg-accent/40 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 w-full bg-accent/40 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="pl-10 w-full bg-accent/40 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-foreground mb-2">Resume Document</label>
              <div
                onClick={() => document.getElementById('resume-upload')?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  required
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />

                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{file.name}</span>
                    <span className="text-xs text-muted-foreground">Click to change file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Click to upload your resume</span>
                    <span className="text-xs text-muted-foreground">PDF or DOCX (Max 10MB)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'uploading' || status === 'processing' || !file}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {(status === 'uploading' || status === 'processing') && <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Application...</>}
            {(status === 'idle' || status === 'error') && 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
