import React from 'react';
import { Users, CheckCircle, Percent, AlertCircle, TrendingUp } from 'lucide-react';
import { CandidateResult, JobConfig } from '../types';

interface DashboardStatsProps {
  candidates: CandidateResult[];
  jobConfig: JobConfig;
}

export default function DashboardStats({ candidates, jobConfig }: DashboardStatsProps) {
  const totalCandidates = candidates.length;
  
  // Calculate average ATS Score
  const avgAtsScore = totalCandidates > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.atsScore, 0) / totalCandidates)
    : 0;

  // Calculate matches passing the threshold
  const thresholdPasses = candidates.filter(c => c.atsScore >= jobConfig.minimumAtsScore).length;
  const passRate = totalCandidates > 0
    ? Math.round((thresholdPasses / totalCandidates) * 100)
    : 0;

  // Strong matches (>= threshold + 10)
  const strongMatches = candidates.filter(c => c.recommendation === 'Strong Match').length;

  const stats = [
    {
      label: 'Total Processed',
      value: totalCandidates,
      subtext: totalCandidates > 0 ? 'Active candidates in pipeline' : 'No candidates processed',
      icon: Users,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    {
      label: 'Avg. ATS Score',
      value: `${avgAtsScore}%`,
      subtext: `Threshold is ${jobConfig.minimumAtsScore}%`,
      icon: Percent,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      label: 'Strong Matches',
      value: strongMatches,
      subtext: strongMatches > 0 ? 'Ready for recruiter call' : 'No strong matches yet',
      icon: CheckCircle,
      color: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
    {
      label: 'Shortlist Rate',
      value: `${passRate}%`,
      subtext: totalCandidates > 0 ? `${thresholdPasses} candidates selected` : 'No candidates shortlisted',
      icon: TrendingUp,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx}
            className="p-5 bg-card rounded-xl border border-border flex items-center justify-between hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                {stat.value}
              </h3>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span>{stat.subtext}</span>
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} border shadow-inner`}>
              <Icon className="h-5.5 w-5.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
