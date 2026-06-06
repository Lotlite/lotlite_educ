'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Briefcase } from 'lucide-react';
import { fetchAllActiveJobConfigs, jobSlug } from '../../../lib/supabase';
import { JobConfig } from '../../../types';
import CandidateApplyForm from '../../../components/CandidateApplyForm';

export default function ApplyJobPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const [jobConfig, setJobConfig] = useState<JobConfig | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchAllActiveJobConfigs().then((entries) => {
      const match = entries.find((e) => jobSlug(e.config.jobTitle) === slug);
      if (match) {
        setJobConfig(match.config);
        setJobId(match.id);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobConfig || !jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 text-center">
        <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md w-full border border-border">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Position Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This position is no longer accepting applications or may have been removed.
          </p>
          <a
            href="/apply"
            className="inline-block px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            View Open Positions
          </a>
        </div>
      </div>
    );
  }

  return <CandidateApplyForm jobConfig={jobConfig} jobId={jobId} />;
}
