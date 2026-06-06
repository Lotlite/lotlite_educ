import React, { useEffect, useState } from 'react';
import { Sun, Moon, Search, Bell, Menu, Briefcase, Users, LayoutDashboard, Files } from 'lucide-react';
import { cn } from '../utils/cn';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  candidateCount: number;
}

export default function Header({ activeTab, setActiveTab, candidateCount }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize theme from HTML element class list
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'ATS Screening Dashboard';
      case 'batch-upload':
        return 'Batch Resume Upload';
      case 'job-config':
        return 'Job Configuration';
      case 'candidates':
        return 'Shortlisted Candidates';
      case 'analytics':
        return 'Hiring Analytics';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-border h-16 px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Mobile Menu trigger & Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight transition-all duration-200">
            {getPageTitle()}
          </h2>
          <p className="text-[10px] text-muted-foreground hidden sm:block">
            Track, analyze and shortlist inbound applications automatically.
          </p>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search candidates, jobs..." 
            className="w-full bg-accent/40 text-xs text-foreground placeholder:text-muted-foreground pl-9 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-4.5 w-4.5 text-slate-700" />
          ) : (
            <Sun className="h-4.5 w-4.5 text-amber-400" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105">
            <Bell className="h-4.5 w-4.5" />
          </button>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card animate-pulse-ring" />
        </div>

        {/* User Quick Info */}
        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />
        <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
          <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center">
            <span className="text-xs font-semibold text-muted-foreground">HR</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-64 max-w-xs bg-card h-full flex flex-col justify-between border-r border-border p-4 shadow-xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white text-xs font-bold font-mono">LTA</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Lotlite Talent Acquisition</h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Dashboard</span>
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'batch-upload', label: 'Batch Upload', icon: Files },
                  { id: 'job-config', label: 'Job Configuration', icon: Briefcase },
                  { id: 'candidates', label: 'Candidates', icon: Users, badge: candidateCount > 0 ? candidateCount : undefined },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary dark:bg-primary/20"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground">HR</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Recruiter</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
