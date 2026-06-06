'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { 
  ArrowUpDown, 
  Trash2, 
  Search, 
  Filter, 
  AlertCircle, 
  FileDown,
  UserCheck2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MinusCircle,
  Mail,
  Loader2,
  Send,
} from 'lucide-react';
import { CandidateResult, JobConfig } from '../types';
import { JobEntry } from '../hooks/useAtsState';
import { cn } from '../utils/cn';
import { sendCandidateEmail, sendBulkCandidateEmails } from '../services/email';
import { markCandidateEmailSent } from '../lib/supabase';

interface CandidateTableProps {
  candidates: CandidateResult[];
  jobConfig: JobConfig;
  allJobs: JobEntry[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function CandidateTable({ candidates, jobConfig, allJobs, onDelete, onClearAll }: CandidateTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [recFilter, setRecFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [minAtsScore, setMinAtsScore] = useState<number>(0);
  const [minMatch, setMinMatch] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  // email state: { [candidateId]: 'idle' | 'sending' | 'sent' | 'error' }
  const [emailState, setEmailState] = useState<Record<string, 'idle' | 'sending' | 'sent' | 'error'>>({});
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredData = useMemo(() => {
    return candidates.filter(c => {
      if (recFilter !== 'all' && c.recommendation.toLowerCase() !== recFilter.toLowerCase()) return false;
      if (jobFilter !== 'all' && c.jobConfigId !== jobFilter) return false;
      if (c.atsScore < minAtsScore) return false;
      if (c.matchPercentage < minMatch) return false;
      return true;
    });
  }, [candidates, recFilter, jobFilter, minAtsScore, minMatch]);

  const activeFilterCount = [
    recFilter !== 'all',
    jobFilter !== 'all',
    minAtsScore > 0,
    minMatch > 0,
  ].filter(Boolean).length;

  const columns = useMemo<ColumnDef<CandidateResult>[]>(() => [
    {
      id: 'expand',
      size: 50,
      header: () => null,
      cell: ({ row }) => {
        const isOpen = expandedRows.has(row.original.id);
        return (
          <button
            onClick={(e) => { e.stopPropagation(); toggleRow(row.original.id); }}
            title={isOpen ? 'Collapse details' : 'View candidate details'}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        );
      }
    },
    {
      accessorKey: 'candidateName',
      size: 220,
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1.5 hover:text-foreground font-semibold py-1.5"
        >
          Candidate Name
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ row }) => {
        const name = row.getValue('candidateName') as string;
        const email = row.original.email;
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {initials || 'C'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-foreground truncate">{name}</h4>
              <p className="text-[10px] text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'atsScore',
      size: 140,
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1.5 hover:text-foreground font-semibold py-1.5"
        >
          ATS Score
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ row }) => {
        const score = row.getValue('atsScore') as number;
        const pass = score >= jobConfig.minimumAtsScore;
        return (
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-mono font-bold text-xs px-2 py-0.5 rounded border select-none",
              score >= jobConfig.minimumAtsScore + 10 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                : pass 
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-500" 
                  : "bg-destructive/10 border-destructive/20 text-destructive"
            )}>
              {score}%
            </span>
            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
              <div 
                className={cn(
                  "h-full rounded-full",
                  score >= jobConfig.minimumAtsScore + 10 ? "bg-emerald-500" : pass ? "bg-blue-500" : "bg-destructive"
                )}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'missingSkills',
      size: 220,
      header: 'Missing Skills',
      cell: ({ row }) => {
        const skills = row.getValue('missingSkills') as string[];
        if (!skills || skills.length === 0) {
          return (
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 select-none">
              <UserCheck2 className="h-3.5 w-3.5" />
              Full Skill Match
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px] sm:max-w-xs">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 select-none"
              >
                {skill}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: 'recommendation',
      size: 160,
      header: 'Recommendation',
      cell: ({ row }) => {
        const rec = row.getValue('recommendation') as string;
        return (
          <span className={cn(
            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border select-none inline-flex items-center gap-1",
            rec === 'Strong Match' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
            rec === 'Good Match' && "bg-blue-500/10 border-blue-500/20 text-blue-500",
            rec === 'Potential Match' && "bg-amber-500/10 border-amber-500/20 text-amber-500",
            rec === 'Not Recommended' && "bg-destructive/10 border-destructive/20 text-destructive"
          )}>
            {rec === 'Strong Match' && <UserCheck2 className="h-3 w-3" />}
            {rec === 'Not Recommended' && <XCircle className="h-3 w-3" />}
            {rec === 'Potential Match' && <AlertTriangle className="h-3 w-3" />}
            {rec}
          </span>
        );
      }
    },
    {
      accessorKey: 'appliedAt',
      size: 130,
      header: 'Screened',
      cell: ({ row }) => (
        <span className="text-[10px] text-muted-foreground select-none">
          {row.original.appliedAt}
        </span>
      )
    },
    {
      id: 'actions',
      size: 120,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const candidate = row.original;
        const isShortlisted = candidate.atsScore >= jobConfig.minimumAtsScore;
        const eState = emailState[candidate.id] || (candidate.emailSent ? 'sent' : 'idle');
        const hasEmail = !!candidate.email;

        const handleSendEmail = async (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!hasEmail || eState === 'sending' || eState === 'sent') return;
          setEmailState(prev => ({ ...prev, [candidate.id]: 'sending' }));
          try {
            // Resolve the exact job title the candidate was screened against
            const candidateJob = allJobs.find(j => j.id === candidate.jobConfigId);
            const resolvedJobTitle = candidateJob?.config.jobTitle ?? jobConfig.jobTitle;
            const resolvedMinScore = candidateJob?.config.minimumAtsScore ?? jobConfig.minimumAtsScore;
            await sendCandidateEmail({
              candidateId: candidate.id,
              type: candidate.atsScore >= resolvedMinScore ? 'shortlisted' : 'not_shortlisted',
              to: candidate.email,
              candidateName: candidate.candidateName,
              jobTitle: resolvedJobTitle,
              atsScore: candidate.atsScore,
              recommendation: candidate.recommendation,
              missingSkills: candidate.missingSkills,
            });
            candidate.emailSent = true;
            setEmailState(prev => ({ ...prev, [candidate.id]: 'sent' }));
          } catch {
            setEmailState(prev => ({ ...prev, [candidate.id]: 'error' }));
            setTimeout(() => setEmailState(prev => ({ ...prev, [candidate.id]: 'idle' })), 3000);
          }
        };

        return (
          <div className="flex items-center justify-end gap-1.5">
            {/* Send email button */}
            <button
              onClick={handleSendEmail}
              disabled={!hasEmail || eState === 'sending' || eState === 'sent'}
              title={!hasEmail ? 'No email address on file' : eState === 'sent' ? 'Email sent!' : `Send ${isShortlisted ? 'shortlist' : 'rejection'} email`}
              className={cn(
                'p-1.5 rounded-lg border transition-all duration-200',
                eState === 'sent'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 cursor-default'
                  : eState === 'error'
                    ? 'border-destructive/30 bg-destructive/10 text-destructive'
                    : !hasEmail
                      ? 'border-border bg-card text-muted-foreground/40 cursor-not-allowed'
                      : 'border-border bg-card text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30'
              )}
            >
              {eState === 'sending'
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : eState === 'sent'
                  ? <CheckCircle2 className="h-3.5 w-3.5" />
                  : <Mail className="h-3.5 w-3.5" />}
            </button>
            <a
              href={candidate.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Download Resume"
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              <FileDown className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => onDelete(candidate.id)}
              title="Remove Candidate"
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      }
    }
  ], [jobConfig.minimumAtsScore, onDelete, expandedRows, emailState]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const s = filterValue.toLowerCase();
      return (
        row.original.candidateName.toLowerCase().includes(s) ||
        row.original.email.toLowerCase().includes(s) ||
        row.original.missingSkills.join(' ').toLowerCase().includes(s)
      );
    }
  });

  return (
    <div className="space-y-4">
      {/* Filtering Toolbar */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Primary row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center p-4 border-b border-border">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, email, skills..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            <select
              value={recFilter}
              onChange={(e) => setRecFilter(e.target.value)}
              className="bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer font-medium"
            >
              <option value="all">All Recommendations</option>
              <option value="Strong Match">Strong Matches</option>
              <option value="Good Match">Good Matches</option>
              <option value="Potential Match">Potential Matches</option>
              <option value="Not Recommended">Not Recommended</option>
            </select>
            <button
              onClick={() => setShowAdvanced(p => !p)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition-all',
                showAdvanced || activeFilterCount > 0
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* Bulk Send All Emails */}
            {candidates.length > 0 && (
              <button
                onClick={async () => {
                  const pendingCandidates = filteredData.filter(c => !!c.email && !c.emailSent && emailState[c.id] !== 'sent');
                  if (pendingCandidates.length === 0) { setBulkResult('No new candidates to email.'); setTimeout(() => setBulkResult(null), 3000); return; }
                  setBulkSending(true);
                  setBulkResult(null);
                  try {
                    const results = await sendBulkCandidateEmails(pendingCandidates.map(c => {
                      // Resolve each candidate's own job profile
                      const candidateJob = allJobs.find(j => j.id === c.jobConfigId);
                      const resolvedJobTitle = candidateJob?.config.jobTitle ?? jobConfig.jobTitle;
                      const resolvedMinScore = candidateJob?.config.minimumAtsScore ?? jobConfig.minimumAtsScore;
                      return {
                        candidateId: c.id,
                        type: c.atsScore >= resolvedMinScore ? 'shortlisted' : 'not_shortlisted',
                        to: c.email,
                        candidateName: c.candidateName,
                        jobTitle: resolvedJobTitle,
                        atsScore: c.atsScore,
                        recommendation: c.recommendation,
                        missingSkills: c.missingSkills,
                      };
                    }));
                    // Mark successful ones as sent
                    const sentMap: Record<string, 'sent'> = {};
                    let sentCount = 0;
                    let failedCount = 0;
                    
                    await Promise.all(results.map(async (r, idx) => {
                      const c = pendingCandidates[idx];
                      if (r.status === 'sent') {
                        sentMap[c.id] = 'sent';
                        c.emailSent = true;
                        sentCount++;
                      } else {
                        failedCount++;
                      }
                    }));
                    
                    setEmailState(prev => ({ ...prev, ...sentMap }));
                    setBulkResult(`✅ ${sentCount} sent${failedCount > 0 ? `, ❌ ${failedCount} failed` : ''}`);
                  } catch (err: any) {
                    setBulkResult(`❌ ${err.message}`);
                  } finally {
                    setBulkSending(false);
                    setTimeout(() => setBulkResult(null), 5000);
                  }
                }}
                disabled={bulkSending}
                className="flex items-center gap-1.5 text-xs px-3 py-2 border border-primary/25 bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors font-bold whitespace-nowrap disabled:opacity-60"
              >
                {bulkSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Send All Emails
              </button>
            )}
            {candidates.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs px-3 py-2 border border-destructive/20 hover:border-destructive/35 bg-destructive/5 text-destructive rounded-lg hover:bg-destructive/10 transition-colors font-bold whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Advanced filters panel */}
        {showAdvanced && (
          <div className="p-4 bg-muted/10 border-b border-border flex flex-wrap gap-5 items-end animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Job Profile filter */}
            <div className="space-y-1 min-w-[180px]">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Job Profile</label>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="w-full bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer font-medium"
              >
                <option value="all">All Jobs</option>
                {allJobs.map(job => (
                  <option key={job.id} value={job.id}>{job.config.jobTitle}</option>
                ))}
              </select>
            </div>
            {/* Min ATS Score */}
            <div className="space-y-1 min-w-[160px]">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Min ATS Score</label>
                <span className="text-[10px] font-mono font-bold text-primary">{minAtsScore}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={minAtsScore}
                onChange={(e) => setMinAtsScore(Number(e.target.value))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            {/* Min Match % */}
            <div className="space-y-1 min-w-[160px]">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Min Match %</label>
                <span className="text-[10px] font-mono font-bold text-primary">{minMatch}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setRecFilter('all'); setJobFilter('all'); setMinAtsScore(0); setMinMatch(0); }}
                className="text-[10px] font-bold text-destructive hover:underline self-end pb-2"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk email result banner */}
      {bulkResult && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-xs font-semibold text-foreground animate-in fade-in slide-in-from-top-2 duration-200">
          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
          {bulkResult}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-border bg-muted/20">
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className="px-4 py-3 text-xs font-bold text-muted-foreground select-none uppercase tracking-wider"
                      style={header.id === 'expand' ? { width: 50, minWidth: 50 } : undefined}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => {
                  const candidate = row.original;
                  const isExpanded = expandedRows.has(candidate.id);

                  return (
                    <React.Fragment key={row.id}>
                      {/* Main Row */}
                      <tr
                        className={cn(
                          "transition-colors duration-150 cursor-pointer",
                          isExpanded ? "bg-muted/20" : "hover:bg-muted/10",
                        )}
                        onClick={() => toggleRow(candidate.id)}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className="px-4 py-3.5 text-xs text-foreground align-middle"
                            style={cell.column.id === 'expand' ? { width: 50, minWidth: 50 } : undefined}
                            onClick={cell.column.id === 'actions' || cell.column.id === 'expand' ? (e) => e.stopPropagation() : undefined}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>

                      {/* Expandable AI Analysis Panel */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={columns.length} className="px-0 py-0 border-b border-border">
                            <div className="px-6 py-5 bg-gradient-to-br from-muted/30 to-muted/10 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">

                              {/* Contact Info Strip */}
                              <div className="flex flex-wrap gap-3 text-[10px]">
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg font-semibold text-foreground">
                                  <span className="text-muted-foreground">Name:</span> {candidate.candidateName}
                                </span>
                                {candidate.email && (
                                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg font-semibold text-foreground">
                                    <span className="text-muted-foreground">Email:</span> {candidate.email}
                                  </span>
                                )}
                                {candidate.phoneNumber && (
                                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg font-semibold text-foreground">
                                    <span className="text-muted-foreground">Phone:</span> {candidate.phoneNumber}
                                  </span>
                                )}
                              </div>

                              {/* AI Summary */}
                              {candidate.analysisSummary && (
                                <div className="space-y-1.5">
                                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Recruiter Summary</h5>
                                  <p className="text-xs text-foreground leading-relaxed bg-card border border-border rounded-lg px-4 py-3">
                                    {candidate.analysisSummary}
                                  </p>
                                </div>
                              )}

                              {/* Suit / Not-Suit reasons grid */}
                              {(candidate.suitReasons?.length || candidate.notSuitReasons?.length) ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {candidate.suitReasons && candidate.suitReasons.length > 0 && (
                                    <div className="space-y-2">
                                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Why They're a Fit
                                      </h5>
                                      <div className="space-y-2">
                                        {candidate.suitReasons.map((reason, i) => (
                                          <div key={i} className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3.5 py-2.5 space-y-0.5">
                                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{reason.name}</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">{reason.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {candidate.notSuitReasons && candidate.notSuitReasons.length > 0 && (
                                    <div className="space-y-2">
                                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                                        <MinusCircle className="h-3.5 w-3.5" />
                                        Potential Gaps
                                      </h5>
                                      <div className="space-y-2">
                                        {candidate.notSuitReasons.map((reason, i) => (
                                          <div key={i} className="bg-destructive/5 border border-destructive/15 rounded-lg px-3.5 py-2.5 space-y-0.5">
                                            <p className="text-[10px] font-bold text-destructive">{reason.name}</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">{reason.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* Fallback: score summary for candidates without AI analysis */
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="bg-card border border-border rounded-lg px-4 py-3 space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">ATS Score</p>
                                    <p className={cn(
                                      "text-2xl font-extrabold font-mono",
                                      candidate.atsScore >= jobConfig.minimumAtsScore ? "text-emerald-500" : "text-destructive"
                                    )}>{candidate.atsScore}%</p>
                                    <p className="text-[9px] text-muted-foreground">Threshold: {jobConfig.minimumAtsScore}%</p>
                                  </div>
                                  <div className="bg-card border border-border rounded-lg px-4 py-3 space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Recommendation</p>
                                    <p className="text-sm font-bold text-foreground">{candidate.recommendation}</p>
                                    <p className="text-[9px] text-muted-foreground">Based on job criteria</p>
                                  </div>
                                  <div className="bg-card border border-border rounded-lg px-4 py-3 space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Missing Skills</p>
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                      {candidate.missingSkills.length > 0
                                        ? candidate.missingSkills.map((s, i) => (
                                            <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">{s}</span>
                                          ))
                                        : <span className="text-[9px] text-emerald-500 font-bold">Full skill match</span>
                                      }
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border text-muted-foreground">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-foreground">No candidates found</h4>
                        <p className="text-[11px] text-muted-foreground leading-normal">
                          {candidates.length === 0 
                            ? "Upload PDF or DOCX resumes from the Dashboard tab to begin screening." 
                            : "No candidates match the current filter. Try resetting the filter above."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {table.getRowModel().rows.length > 0 && (
          <div className="px-5 py-3.5 border-t border-border bg-muted/10 flex items-center justify-between text-xs text-muted-foreground font-semibold select-none">
            <span>
              Showing {table.getRowModel().rows.length} of {candidates.length} applications
            </span>
            <span>
              Shortlisted: {candidates.filter(c => c.atsScore >= jobConfig.minimumAtsScore).length} candidates
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
