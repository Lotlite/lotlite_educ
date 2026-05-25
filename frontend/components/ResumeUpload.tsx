import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { ResumeUploadState } from '../types';
import { formatFileSize } from '../utils/format';
import { cn } from '../utils/cn';

interface ResumeUploadProps {
  onUpload: (files: File[]) => void;
  uploadStates: ResumeUploadState[];
}

export default function ResumeUpload({ onUpload, uploadStates }: ResumeUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getStatusIcon = (status: ResumeUploadState['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: ResumeUploadState['status']) => {
    switch (status) {
      case 'uploading':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            Uploading
          </span>
        );
      case 'processing':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
            Failed
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
            Queued
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Drop Zone Card */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 sm:p-12 text-center bg-card flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group select-none",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-border hover:border-primary/40 hover:bg-muted/10"
        )}
        onClick={onButtonClick}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept=".pdf,.docx" 
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Dynamic Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

        <div className="relative space-y-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
            <UploadCloud className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-foreground">
              Drag and drop candidate resumes here, or <span className="text-primary hover:underline">browse files</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Supported Formats: <strong className="font-semibold text-foreground">PDF, DOCX</strong> (Up to 10MB per file)
            </p>
          </div>
          <div className="flex justify-center gap-4 text-[10px] font-semibold text-muted-foreground border-t border-border pt-4 max-w-xs mx-auto">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              Secure cloud upload
            </span>
            <span className="h-4 w-px bg-border" />
            <span>AI-powered screening</span>
          </div>
        </div>
      </div>

      {/* Upload Progress List */}
      {uploadStates.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
            <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Queue Processing ({uploadStates.length})</h3>
            <span className="text-[10px] text-muted-foreground">Uploading in parallel</span>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {uploadStates.map((state) => (
              <div key={state.fileId} className="p-4 space-y-2 hover:bg-muted/10 transition-colors">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="shrink-0">{getStatusIcon(state.status)}</span>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-foreground truncate">{state.fileName}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatFileSize(state.fileSize)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {state.status === 'completed' && state.atsScore !== undefined && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                        ATS: {state.atsScore}%
                      </span>
                    )}
                    {getStatusBadge(state.status)}
                  </div>
                </div>

                {/* Progress bar and details */}
                {(state.status === 'uploading' || state.status === 'processing') && (
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          state.status === 'uploading' ? "bg-blue-500" : "bg-purple-500"
                        )}
                        style={{ width: `${state.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-semibold text-muted-foreground">
                      <span>
                        {state.status === 'uploading' 
                          ? `Uploading resume: ${state.progress}%` 
                          : 'Analysing resume with AI...'}
                      </span>
                      <span>{state.progress}%</span>
                    </div>
                  </div>
                )}

                {/* Completed Details */}
                {state.status === 'completed' && state.candidateName && (
                  <p className="text-[10px] text-muted-foreground">
                    Parsed candidate: <strong className="font-semibold text-foreground">{state.candidateName}</strong>. Matches added to database.
                  </p>
                )}

                {/* Error Box */}
                {state.status === 'failed' && state.error && (
                  <div className="p-2.5 bg-destructive/10 border border-destructive/20 rounded-lg text-[10px] text-destructive flex items-center gap-1.5 leading-normal font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
