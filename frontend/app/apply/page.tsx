'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, Loader2, MapPin, Clock } from 'lucide-react';
import { fetchAllActiveJobConfigs, jobSlug } from '../../lib/supabase';
import { JobConfig } from '../../types';

interface JobEntry {
  id: string;
  config: JobConfig;
  slug: string;
}

export default function ApplyPage() {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllActiveJobConfigs().then((entries) => {
      setJobs(entries.map((e) => ({ ...e, slug: jobSlug(e.config.jobTitle) })));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="mx-auto h-14 w-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
            <Briefcase className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Open Positions</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Find a role where you can do your best work.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-sm">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-1">No Open Positions</h2>
            <p className="text-sm text-muted-foreground">
              We are not currently hiring. Please check back later.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {jobs.map(({ id, config, slug }) => (
              <li key={id}>
                <Link
                  href={`/apply/${slug}`}
                  className="group flex items-center justify-between bg-card rounded-2xl border border-border p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {config.jobTitle}
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Remote
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Full-time
                      </span>
                    </div>
                    {config.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {config.requiredSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {config.requiredSkills.length > 4 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground font-medium">
                            +{config.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
