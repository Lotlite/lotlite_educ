import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, X, AlertCircle, HelpCircle, Save, RotateCcw } from 'lucide-react';
import { JobConfig, JobWeights } from '../types';

const jobConfigSchema = z.object({
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters.'),
  jobDescription: z.string().min(20, 'Job description must be at least 20 characters.'),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill is required.'),
  preferredSkills: z.array(z.string()),
  minimumAtsScore: z.number().min(30).max(95),
  weights: z.object({
    skills: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    projects: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    certifications: z.number().min(0).max(100),
  }).refine((data) => {
    const total = data.skills + data.experience + data.projects + data.education + data.certifications;
    return total === 100;
  }, {
    message: 'Weights must sum to exactly 100%',
    path: ['skills'], // Point to skills as primary display path for weights error
  }),
});

type JobFormValues = z.infer<typeof jobConfigSchema>;

interface JobFormProps {
  initialConfig: JobConfig;
  onSave: (config: JobConfig) => void;
}

export default function JobForm({ initialConfig, onSave }: JobFormProps) {
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobConfigSchema),
    defaultValues: {
      jobTitle: initialConfig.jobTitle,
      jobDescription: initialConfig.jobDescription,
      requiredSkills: initialConfig.requiredSkills,
      preferredSkills: initialConfig.preferredSkills,
      minimumAtsScore: initialConfig.minimumAtsScore,
      weights: {
        skills: initialConfig.weights.skills,
        experience: initialConfig.weights.experience,
        projects: initialConfig.weights.projects,
        education: initialConfig.weights.education,
        certifications: initialConfig.weights.certifications,
      },
    },
  });

  const watchedWeights = watch('weights');
  const watchedRequiredSkills = watch('requiredSkills');
  const watchedPreferredSkills = watch('preferredSkills');
  const watchedThreshold = watch('minimumAtsScore');

  const totalWeightsSum = 
    (watchedWeights?.skills || 0) + 
    (watchedWeights?.experience || 0) + 
    (watchedWeights?.projects || 0) + 
    (watchedWeights?.education || 0) + 
    (watchedWeights?.certifications || 0);

  const addSkill = (type: 'required' | 'preferred') => {
    const input = type === 'required' ? reqSkillInput : prefSkillInput;
    const list = type === 'required' ? watchedRequiredSkills : watchedPreferredSkills;
    
    if (input.trim()) {
      const cleanSkill = input.trim();
      if (!list.includes(cleanSkill)) {
        setValue(
          type === 'required' ? 'requiredSkills' : 'preferredSkills',
          [...list, cleanSkill],
          { shouldDirty: true }
        );
      }
      if (type === 'required') setReqSkillInput('');
      else setPrefSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string, type: 'required' | 'preferred') => {
    const list = type === 'required' ? watchedRequiredSkills : watchedPreferredSkills;
    setValue(
      type === 'required' ? 'requiredSkills' : 'preferredSkills',
      list.filter(s => s !== skillToRemove),
      { shouldDirty: true }
    );
  };

  const onSubmit = (data: JobFormValues) => {
    onSave({
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      requiredSkills: data.requiredSkills,
      preferredSkills: data.preferredSkills,
      minimumAtsScore: data.minimumAtsScore,
      weights: data.weights,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        {/* Card Header */}
        <div className="p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-foreground">Position Details</h3>
            <p className="text-[11px] text-muted-foreground">Configure keywords, thresholds, and weights for matching resumes.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Form
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/95 flex items-center gap-1.5 shadow-sm shadow-primary/10 transition-all hover:scale-[1.02]"
            >
              <Save className="h-3.5 w-3.5" />
              {saveSuccess ? 'Configuration Saved!' : 'Save Config'}
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
              <CheckBadgeIcon className="h-4.5 w-4.5 shrink-0" />
              ATS shortlisting algorithm updated successfully with new weights!
            </div>
          )}

          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1">
              Job Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              {...register('jobTitle')}
              placeholder="e.g., Senior Full Stack Developer"
              className="w-full bg-background border border-border text-xs text-foreground rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
            {errors.jobTitle && (
              <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.jobTitle.message}
              </p>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1">
              Job Description <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={4}
              {...register('jobDescription')}
              placeholder="Describe the role responsibilities, guidelines, projects and environment details..."
              className="w-full bg-background border border-border text-xs text-foreground rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
            />
            {errors.jobDescription && (
              <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.jobDescription.message}
              </p>
            )}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Required Skills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                Required Skills <span className="text-destructive">*</span>
                <span title="Essential skillsets. Candidates lacking these will drop points heavily.">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </span>
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Next.js) and click Add or press Enter"
                  value={reqSkillInput}
                  onChange={(e) => setReqSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill('required');
                    }
                  }}
                  className="w-full bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => addSkill('required')}
                  className="px-3 bg-secondary hover:bg-accent border border-border rounded-lg text-foreground transition-colors shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {errors.requiredSkills && (
                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.requiredSkills.message}
                </p>
              )}

              {/* Required Tags List */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {watchedRequiredSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary dark:bg-primary/20"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill, 'required')}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {(!watchedRequiredSkills || watchedRequiredSkills.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">No required skills defined yet.</span>
                )}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                Preferred Skills
                <span title="Nice-to-have skillsets. Adds bonus credit to matching candidate scores.">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add optional skill (e.g. Docker) and click Add"
                  value={prefSkillInput}
                  onChange={(e) => setPrefSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill('preferred');
                    }
                  }}
                  className="w-full bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => addSkill('preferred')}
                  className="px-3 bg-secondary hover:bg-accent border border-border rounded-lg text-foreground transition-colors shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Preferred Tags List */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {watchedPreferredSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 border border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill, 'preferred')}
                      className="hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {(!watchedPreferredSkills || watchedPreferredSkills.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">No preferred skills defined yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold & Scoring Weightage Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamic Scoring Sliders (Card Span 2) */}
        <div className="bg-card rounded-xl border border-border shadow-sm md:col-span-2 overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="font-bold text-sm text-foreground">Scoring Weights</h3>
            <p className="text-[11px] text-muted-foreground">Adjust weight distribution. Total must sum to 100%.</p>
          </div>
          <div className="p-6 space-y-5">
            {/* Weight Sliders */}
            {[
              { key: 'skills', label: 'Skills Weight', desc: 'Matching keywords, libraries, core tech' },
              { key: 'experience', label: 'Experience Weight', desc: 'Job tenure, seniority, title history' },
              { key: 'projects', label: 'Projects Weight', desc: 'Listed works, portfolios, open source contributions' },
              { key: 'education', label: 'Education Weight', desc: 'Degrees, university ranks, relevant courses' },
              { key: 'certifications', label: 'Certifications Weight', desc: 'Accreditations, tech certs, bootcamps' },
            ].map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1">
                    {item.label}
                  </span>
                  <span className="text-primary font-mono">{watchedWeights?.[item.key as keyof JobWeights] || 0}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-none">{item.desc}</p>
                <Controller
                  name={`weights.${item.key as keyof JobWeights}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Calculation Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-5 border-b border-border bg-muted/20">
              <h3 className="font-bold text-sm text-foreground">Threshold & Status</h3>
              <p className="text-[11px] text-muted-foreground">Scoring parameters health checker.</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* ATS Pass Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-foreground">
                  <span>Minimum ATS Score</span>
                  <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary dark:bg-primary/20 rounded font-mono">
                    {watchedThreshold}%
                  </span>
                </div>
                <Controller
                  name="minimumAtsScore"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="range"
                      min="30"
                      max="95"
                      step="5"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  )}
                />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Candidates with scores below this threshold will be flagged as not matching configuration requirements.
                </p>
              </div>

              {/* Weight Sum Validation Card */}
              <div className="h-px bg-border my-4" />

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground">Weights Calibration</h4>
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Current Sum</span>
                    <span className={`text-2xl font-extrabold font-mono tracking-tight ${totalWeightsSum === 100 ? 'text-emerald-500' : 'text-destructive'}`}>
                      {totalWeightsSum}%
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    totalWeightsSum === 100 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                      : 'bg-destructive/10 border-destructive/20 text-destructive'
                  }`}>
                    {totalWeightsSum === 100 ? 'Valid Balance' : 'Out of Balance'}
                  </span>
                </div>

                {totalWeightsSum !== 100 && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-[10px] leading-normal flex gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Weight distributions must add up to exactly 100%. Adjust sliders to calibrate.</span>
                  </div>
                )}
                {totalWeightsSum === 100 && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Weight values total 100% exactly. The screening algorithm is calibrated and ready to shortlist.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/10 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={totalWeightsSum !== 100}
              className={`w-full py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                totalWeightsSum === 100 
                  ? 'bg-primary text-white hover:bg-primary/95 shadow-sm' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
              }`}
            >
              Apply Algorithms
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

// Icon helper
function CheckBadgeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}
