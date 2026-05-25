import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  BarChart3, 
  Zap, 
  HelpCircle,
  LogOut,
  Files
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  candidateCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, candidateCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batch-upload', label: 'Batch Upload', icon: Files },
    { id: 'job-config', label: 'Job Configuration', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users, badge: candidateCount > 0 ? candidateCount : undefined },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

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

      {/* Recruiter Profile / Bottom section */}
      <div className="p-4 border-t border-border bg-muted/10 space-y-4">
        {/* Profile Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" 
                alt="Sarah Jenkins" 
                className="h-9 w-9 rounded-full object-cover border border-border"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-card animate-pulse-ring" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-xs leading-none text-foreground truncate">Sarah Jenkins</h3>
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
