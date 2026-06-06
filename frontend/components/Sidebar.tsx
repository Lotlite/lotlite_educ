'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Zap,
  LogOut,
  Files,
  Link2,
  Check,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { jobSlug } from '../lib/supabase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  candidateCount: number;
  jobTitle?: string;
}

export default function Sidebar({ activeTab, setActiveTab, candidateCount, jobTitle }: SidebarProps) {
  const [copied, setCopied] = useState(false);

  const menuItems = [
    { id: 'dashboard',    label: 'Dashboard',         icon: LayoutDashboard },
    { id: 'batch-upload', label: 'Batch Upload',       icon: Files },
    { id: 'job-config',   label: 'Job Configuration',  icon: Briefcase },
    { id: 'candidates',   label: 'Candidates',         icon: Users, badge: candidateCount > 0 ? candidateCount : undefined },
    { id: 'analytics',    label: 'Analytics',          icon: BarChart3 },
  ];

  const applyUrl = jobTitle
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/apply/${jobSlug(jobTitle)}`
    : null;

  function copyLink() {
    if (!applyUrl) return;
    navigator.clipboard.writeText(applyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <aside className="w-64 border-r border-border bg-card text-card-foreground flex-col justify-between hidden md:flex h-full shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center gap-3 border-b border-border bg-muted/30">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight leading-none">Lotlite Talent Acquisition</h1>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">ATS Dashboard</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 transition-all",
                    isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                  )}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-1 top-1/4 bottom-1/4 w-1 rounded bg-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-border bg-muted/10 space-y-3">

        {/* Shareable Apply Link */}
        {applyUrl && (
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Link2 className="h-3 w-3" /> Apply Link
            </p>
            <p className="text-[10px] text-foreground font-mono break-all leading-relaxed line-clamp-2" title={applyUrl}>
              /apply/{jobSlug(jobTitle!)}
            </p>
            <button
              onClick={copyLink}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-bold transition-all",
                copied
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/15"
              )}
            >
              {copied ? (
                <><Check className="h-3 w-3" /> Copied!</>
              ) : (
                <><Link2 className="h-3 w-3" /> Copy Link</>
              )}
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground">HR</span>
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-card animate-pulse-ring" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-xs leading-none text-foreground truncate">Recruiter</h3>
              <span className="text-[10px] text-muted-foreground truncate block mt-0.5">Talent Acquisition</span>
            </div>
          </div>
          <button
            title="Log Out"
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
