'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  X,
  Plus,
  Sparkles,
  Briefcase,
  Save,
  AlertCircle,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { JobConfig, JobWeights } from '../types';
import { cn } from '../utils/cn';

// ─── Validation Schema ────────────────────────────────────
const jdSchema = z.object({
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters'),
  jobDescription: z.string().min(20, 'Description must be at least 20 characters'),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill is needed'),
  preferredSkills: z.array(z.string()),
  minimumAtsScore: z.number().min(30).max(95),
  weights: z.object({
    skills: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    projects: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    certifications: z.number().min(0).max(100),
  }).refine(
    (d) => d.skills + d.experience + d.projects + d.education + d.certifications === 100,
    { message: 'Weights must sum to exactly 100%', path: ['skills'] }
  ),
});

type JDFormValues = z.infer<typeof jdSchema>;

// ─── Props ────────────────────────────────────────────────
interface JDPanelProps {
  open: boolean;
  onClose: () => void;
  currentConfig: JobConfig;
  onSave: (config: JobConfig) => void;
}

// ─── Weight Sliders Config ────────────────────────────────
const WEIGHT_FIELDS: { key: keyof JobWeights; label: string; color: string }[] = [
  { key: 'skills',          label: 'Skills',          color: 'bg-indigo-500' },
  { key: 'experience',      label: 'Experience',      color: 'bg-violet-500' },
  { key: 'projects',        label: 'Projects',        color: 'bg-sky-500' },
  { key: 'education',       label: 'Education',       color: 'bg-emerald-500' },
  { key: 'certifications',  label: 'Certifications',  color: 'bg-amber-500' },
];

export default function JDPanel({ open, onClose, currentConfig, onSave }: JDPanelProps) {
  const [reqInput, setReqInput]   = useState('');
  const [prefInput, setPrefInput] = useState('');
  const [saved, setSaved]         = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<JDFormValues>({
    resolver: zodResolver(jdSchema),
    defaultValues: {
      jobTitle:        currentConfig.jobTitle,
      jobDescription:  currentConfig.jobDescription,
      requiredSkills:  currentConfig.requiredSkills,
      preferredSkills: currentConfig.preferredSkills,
      minimumAtsScore: currentConfig.minimumAtsScore,
      weights:         currentConfig.weights,
    },
  });

  // Sync form if config changes externally
  useEffect(() => {
    reset({
      jobTitle:        currentConfig.jobTitle,
      jobDescription:  currentConfig.jobDescription,
      requiredSkills:  currentConfig.requiredSkills,
      preferredSkills: currentConfig.preferredSkills,
      minimumAtsScore: currentConfig.minimumAtsScore,
      weights:         currentConfig.weights,
    });
  }, [currentConfig, reset]);

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const reqSkills  = watch('requiredSkills');
  const prefSkills = watch('preferredSkills');
  const weights    = watch('weights');
  const threshold  = watch('minimumAtsScore');

  const totalWeights = WEIGHT_FIELDS.reduce((s, f) => s + (weights?.[f.key] || 0), 0);

  const addSkill = useCallback((type: 'required' | 'preferred') => {
    const raw = type === 'required' ? reqInput : prefInput;
    const val = raw.trim();
    if (!val) return;
    const list = type === 'required' ? reqSkills : prefSkills;
    if (!list.includes(val)) {
      setValue(type === 'required' ? 'requiredSkills' : 'preferredSkills', [...list, val], { shouldDirty: true });
    }
    type === 'required' ? setReqInput('') : setPrefInput('');
  }, [reqInput, prefInput, reqSkills, prefSkills, setValue]);

  const removeSkill = useCallback((skill: string, type: 'required' | 'preferred') => {
    const list = type === 'required' ? reqSkills : prefSkills;
    setValue(
      type === 'required' ? 'requiredSkills' : 'preferredSkills',
      list.filter(s => s !== skill),
      { shouldDirty: true }
    );
  }, [reqSkills, prefSkills, setValue]);

  const onSubmit = (data: JDFormValues) => {
    onSave(data as JobConfig);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <>
      {/* ── Backdrop ─────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* ── Slide-over Panel ─────────────────────── */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-[520px] bg-card border-l border-border shadow-2xl flex flex-col',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md shadow-primary/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground leading-none">Configure Job Position</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">Set up automated shortlisting criteria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto">
          <form id="jd-panel-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

            {/* ── Job Title ── */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                Job Title <span className="text-destructive">*</span>
              </label>
              <input
                {...register('jobTitle')}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
              {errors.jobTitle && (
                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* ── Job Description ── */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Job Description <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register('jobDescription')}
                rows={5}
                placeholder="Describe responsibilities, environment, and expectations..."
                className="w-full bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none placeholder:text-muted-foreground"
              />
              {errors.jobDescription && (
                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.jobDescription.message}
                </p>
              )}
            </div>

            {/* ── Required Skills ── */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">
                Required Skills <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reqInput}
                  onChange={e => setReqInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill('required'); }}}
                  placeholder="e.g. React, Node.js…"
                  className="flex-1 bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => addSkill('required')}
                  className="px-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {errors.requiredSkills && (
                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.requiredSkills.message}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {reqSkills?.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill, 'required')} className="hover:text-destructive transition-colors">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                {(!reqSkills || reqSkills.length === 0) && (
                  <span className="text-[10px] text-muted-foreground italic">No required skills added yet.</span>
                )}
              </div>
            </div>

            {/* ── Preferred Skills ── */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Preferred Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prefInput}
                  onChange={e => setPrefInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill('preferred'); }}}
                  placeholder="e.g. GraphQL, Docker…"
                  className="flex-1 bg-background border border-border text-xs text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => addSkill('preferred')}
                  className="px-3 bg-secondary hover:bg-accent border border-border text-foreground rounded-lg transition-colors shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {prefSkills?.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 border border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill, 'preferred')} className="hover:text-destructive transition-colors">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                {(!prefSkills || prefSkills.length === 0) && (
                  <span className="text-[10px] text-muted-foreground italic">No preferred skills added yet.</span>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px bg-border" />

            {/* ── ATS Threshold ── */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                  Minimum ATS Score
                </label>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">{threshold}%</span>
              </div>
              <Controller
                name="minimumAtsScore"
                control={control}
                render={({ field }) => (
                  <input
                    type="range" min="30" max="95" step="5"
                    value={field.value}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                )}
              />
              <p className="text-[10px] text-muted-foreground">
                Candidates scoring below this threshold will be flagged as non-matching.
              </p>
            </div>

            {/* ── Scoring Weights ── */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground">Scoring Weights</label>
                <span className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded border font-mono',
                  totalWeights === 100
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    : 'bg-destructive/10 border-destructive/20 text-destructive'
                )}>
                  {totalWeights}/100
                </span>
              </div>

              {WEIGHT_FIELDS.map(({ key, label, color }) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-mono">{weights?.[key] ?? 0}%</span>
                  </div>
                  <Controller
                    name={`weights.${key}`}
                    control={control}
                    render={({ field }) => (
                      <input
                        type="range" min="0" max="100" step="5"
                        value={field.value}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: '' }}
                      />
                    )}
                  />
                </div>
              ))}

              {totalWeights !== 100 && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-[10px] text-destructive font-semibold">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-px" />
                  Weights must add up to exactly 100%. Current total: {totalWeights}%.
                </div>
              )}
            </div>

          </form>
        </div>

        {/* ── Footer Actions ── */}
        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            form="jd-panel-form"
            type="submit"
            disabled={totalWeights !== 100}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200',
              totalWeights === 100
                ? saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20 hover:scale-[1.01]'
                : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
            )}
          >
            {saved ? (
              <>Saved! Redirecting…</>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save &amp; Apply Configuration
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
