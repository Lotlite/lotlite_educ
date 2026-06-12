import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, BookOpen, Clock, Award } from 'lucide-react';
import { YearStructure, SemesterDetails } from '../../data/curriculumData';

interface ProgramStructureDetailProps {
  data: YearStructure[];
}

export default function ProgramStructureDetail({ data }: ProgramStructureDetailProps) {
  const [expandedYear, setExpandedYear] = useState<string | null>(data[0]?.year || null);

  const toggleYear = (year: string) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };

  return (
    <div className="space-y-4 pt-4" id="program-structure-accordion-container">
      {data.map((yearDetail, index) => {
        const isExpanded = expandedYear === yearDetail.year;
        return (
          <div 
            key={yearDetail.year}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'border-wine bg-wine/[0.01] shadow-md shadow-wine/5' 
                : 'border-border bg-white hover:border-black/20 dark:hover:border-white/20'
            }`}
            id={`year-block-${index}`}
          >
            {/* Year Accordion Header */}
            <button
              onClick={() => toggleYear(yearDetail.year)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer select-none"
              id={`year-trigger-${index}`}
            >
              <div className="space-y-1 pr-4">
                <span className="text-wine font-mono font-black text-xs sm:text-sm uppercase tracking-widest block">
                  {yearDetail.year}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-black font-serif tracking-tight pr-2">
                  {yearDetail.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-semibold">
                  {yearDetail.summary}
                </p>
              </div>
              <div className={`p-2 rounded-full border transition-all shrink-0 ${
                isExpanded 
                  ? 'bg-wine text-white border-wine' 
                  : 'bg-neutral-50 text-neutral-500 border-border group-hover:bg-neutral-100'
              }`}>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {/* Year Accordion content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-6 md:px-6 md:pb-8 border-t border-border/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5" id={`semesters-grid-${index}`}>
                      {yearDetail.semesters.map((sem, semIdx) => (
                        <div key={sem.semester} className="space-y-4" id={`semester-col-${index}-${semIdx}`}>
                          <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                            <BookOpen size={16} className="text-wine" />
                            <h5 className="text-sm font-black uppercase tracking-widest text-[#1a1a1a]">
                              {sem.semester}
                            </h5>
                          </div>

                          <div className="space-y-3" id={`semester-subjects-${index}-${semIdx}`}>
                            {sem.subjects.map((sub, subIdx) => (
                              <div 
                                key={sub.name}
                                className="bg-card dark:bg-zinc-900/10 p-4 rounded-xl border border-border/80 hover:shadow-xs transition-shadow"
                                id={`subject-card-${index}-${semIdx}-${subIdx}`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <h6 className="text-sm sm:text-base font-extrabold text-black tracking-tight leading-snug">
                                    {sub.name}
                                  </h6>
                                </div>
                                <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                  {sub.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
