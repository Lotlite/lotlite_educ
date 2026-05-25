'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardStats from '../components/DashboardStats';
import JobForm from '../components/JobForm';
import ResumeUpload from '../components/ResumeUpload';
import CandidateTable from '../components/CandidateTable';
import JDPanel from '../components/JDPanel';
import { useAtsState } from '../hooks/useAtsState';
import { 
  Briefcase, 
  ChevronRight, 
  HelpCircle, 
  FileCheck2, 
  BarChart4, 
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const {
    jobConfig,
    updateJobConfig,
    uploads,
    candidates,
    deleteCandidate,
    clearCandidates,
    uploadAndProcessResumes,
    isClient,
  } = useAtsState();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [jdPanelOpen, setJdPanelOpen] = useState(false);

  // SSR Safe Hydration check
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-semibold">Loading Lotlite Talent Acquisition ATS...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Dashboard Statistics */}
            <DashboardStats candidates={candidates} jobConfig={jobConfig} />

            {/* Quick action bar */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">Inbound Pipeline</h3>
                <p className="text-[11px] text-muted-foreground">Upload resumes to screen against the active job position.</p>
              </div>
              <button
                onClick={() => setJdPanelOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all hover:scale-[1.02] shrink-0"
              >
                <Briefcase className="h-3.5 w-3.5" />
                Configure Job
              </button>
            </div>

            {/* Split layout: Upload & Table on left, Quick Config on right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Main Screen (Upload Resume & Candidate Table) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upload zone */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Inbound Screen</h3>
                    <p className="text-[11px] text-muted-foreground">Upload single or multiple candidate resumes to parse details and evaluate qualifications instantly.</p>
                  </div>
                  <ResumeUpload onUpload={uploadAndProcessResumes} uploadStates={uploads} />
                </div>

                {/* Candidate Table */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Shortlist Pipeline</h3>
                    <p className="text-[11px] text-muted-foreground">Ranked listings of screened resumes matching the job description parameters.</p>
                  </div>
                  <CandidateTable 
                    candidates={candidates} 
                    jobConfig={jobConfig} 
                    onDelete={deleteCandidate} 
                    onClearAll={clearCandidates} 
                  />
                </div>
              </div>

              {/* Right Sidebar (Quick Configuration Preview) */}
              <div className="space-y-6">
                {/* Job Config Card */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Active Position
                    </h3>
                    <button 
                      onClick={() => setActiveTab('job-config')}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center"
                    >
                      Configure &rarr;
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{jobConfig.jobTitle}</h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-3 mt-1.5 leading-relaxed">
                        {jobConfig.jobDescription}
                      </p>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Skill Badges Summary */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Required Skills ({jobConfig.requiredSkills.length})</h5>
                      <div className="flex flex-wrap gap-1">
                        {jobConfig.requiredSkills.slice(0, 5).map(skill => (
                          <span key={skill} className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary dark:bg-primary/20">
                            {skill}
                          </span>
                        ))}
                        {jobConfig.requiredSkills.length > 5 && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                            +{jobConfig.requiredSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Weights Calibration</h5>
                      <div className="space-y-1.5 font-mono text-[10px]">
                        {[
                          { name: 'Skills', val: jobConfig.weights.skills },
                          { name: 'Experience', val: jobConfig.weights.experience },
                          { name: 'Projects', val: jobConfig.weights.projects },
                          { name: 'Education', val: jobConfig.weights.education },
                          { name: 'Certs', val: jobConfig.weights.certifications },
                        ].map((w, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-muted-foreground font-semibold">{w.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${w.val}%` }} />
                              </div>
                              <span className="font-bold text-foreground w-6 text-right">{w.val}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Shortlist Threshold</span>
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/15">
                        {jobConfig.minimumAtsScore}%
                      </span>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        );

      case 'batch-upload':
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-base text-foreground">Batch Candidate Screening</h3>
                <p className="text-xs text-muted-foreground mt-1">Upload multiple resumes at once. The AI will process them concurrently in the background and add matches to the Candidates table.</p>
              </div>
              <ResumeUpload onUpload={uploadAndProcessResumes} uploadStates={uploads} />
            </div>
          </div>
        );

      case 'job-config':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm max-w-4xl mx-auto">
              <div>
                <h3 className="font-bold text-sm text-foreground">ATS Target Position Settings</h3>
                <p className="text-[10px] text-muted-foreground">Adjust keyword queries, requirements thresholds and algorithms scoring weights distributions.</p>
              </div>
            </div>
            <JobForm initialConfig={jobConfig} onSave={updateJobConfig} />
          </div>
        );

      case 'candidates':
        return (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-foreground">Complete Shortlisted Candidates</h3>
                <p className="text-[10px] text-muted-foreground">Global view of all processed applications across candidate categories.</p>
              </div>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/95 shadow-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            <CandidateTable 
              candidates={candidates} 
              jobConfig={jobConfig} 
              onDelete={deleteCandidate} 
              onClearAll={clearCandidates} 
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Analytics Header */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <BarChart4 className="h-4.5 w-4.5 text-primary" />
                  Recruitment Metrics Overview
                </h3>
                <p className="text-[10px] text-muted-foreground">Visual analytics detailing funnel efficiency, average matching metrics, and skill-gap frequencies.</p>
              </div>
            </div>

            {/* Custom visual chart stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Funnel chart card */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-sm">
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Screening Funnel Conversion</h4>
                <div className="space-y-3 pt-2">
                  {[
                    { stage: 'Resumes Uploaded', count: candidates.length, pct: 100, color: 'bg-indigo-500' },
                    { stage: 'Passed Initial Screen', count: candidates.filter(c => c.atsScore >= 50).length, pct: candidates.length > 0 ? Math.round((candidates.filter(c => c.atsScore >= 50).length / candidates.length) * 100) : 0, color: 'bg-sky-500' },
                    { stage: 'Matches Selected (Passing Threshold)', count: candidates.filter(c => c.atsScore >= jobConfig.minimumAtsScore).length, pct: candidates.length > 0 ? Math.round((candidates.filter(c => c.atsScore >= jobConfig.minimumAtsScore).length / candidates.length) * 100) : 0, color: 'bg-emerald-500' },
                    { stage: 'Strong Matches Invited', count: candidates.filter(c => c.recommendation === 'Strong Match').length, pct: candidates.length > 0 ? Math.round((candidates.filter(c => c.recommendation === 'Strong Match').length / candidates.length) * 100) : 0, color: 'bg-purple-500' },
                  ].map((stage, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground">{stage.stage}</span>
                        <span className="text-muted-foreground font-mono">{stage.count} ({stage.pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className={`${stage.color} h-full rounded-full transition-all duration-500`} style={{ width: `${stage.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill gap frequency */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-sm">
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  Missing Skills Frequency
                </h4>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Identifies skillsets most commonly absent among applicants. Useful for adjusting job posts.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    { skill: 'GraphQL', count: candidates.filter(c => c.missingSkills.includes('GraphQL')).length, total: candidates.length },
                    { skill: 'Jest', count: candidates.filter(c => c.missingSkills.includes('Jest')).length, total: candidates.length },
                    { skill: 'TypeScript', count: candidates.filter(c => c.missingSkills.includes('TypeScript')).length, total: candidates.length },
                    { skill: 'Next.js', count: candidates.filter(c => c.missingSkills.includes('Next.js')).length, total: candidates.length },
                  ].map((item, idx) => {
                    const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-foreground font-mono bg-secondary/80 px-1.5 py-0.5 rounded border border-border text-[10px]">{item.skill}</span>
                          <span className="text-muted-foreground font-mono">{item.count} applicants ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} candidateCount={candidates.length} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} candidateCount={candidates.length} />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {renderTabContent()}
        </main>
      </div>

      {/* JD Configuration Slide-over Panel */}
      <JDPanel
        open={jdPanelOpen}
        onClose={() => setJdPanelOpen(false)}
        currentConfig={jobConfig}
        onSave={(config) => {
          updateJobConfig(config);
          setJdPanelOpen(false);
        }}
      />
    </div>
  );
}
