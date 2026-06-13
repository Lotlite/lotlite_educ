import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { YearStructure } from '../../data/curriculumData';

interface ProgramStructureDetailProps {
  data: YearStructure[];
}

export default function ProgramStructureDetail({ data }: ProgramStructureDetailProps) {
  const [activeYear, setActiveYear] = useState<string>(data[0]?.year || "");

  useEffect(() => {
    if (data.length > 0 && !data.some(y => y.year === activeYear)) {
      setActiveYear(data[0].year);
    }
  }, [data]);

  const activeYearDetail = data.find(y => y.year === activeYear) || data[0];

  const isBBA = data.length === 3;
  const activeColor = isBBA 
    ? 'bg-bottle-green border-bottle-green text-white shadow-lg shadow-bottle-green/10' 
    : 'bg-wine border-wine text-white shadow-lg shadow-wine/10';
  const inactiveHoverColor = isBBA 
    ? 'hover:text-bottle-green hover:border-bottle-green/30' 
    : 'hover:text-wine hover:border-wine/30';
  const borderHighlightColor = isBBA 
    ? 'border-l-4 border-l-bottle-green hover:border-bottle-green/20 hover:bg-bottle-green/[0.01]' 
    : 'border-l-4 border-l-wine hover:border-wine/20 hover:bg-wine/[0.01]';
  const tagColor = isBBA 
    ? 'text-bottle-green bg-bottle-green/5 border-bottle-green/10' 
    : 'text-wine bg-wine/5 border-wine/10';
  const textThemeColor = isBBA ? 'text-bottle-green' : 'text-wine';

  return (
    <div className="space-y-8 pt-4 text-left" id="program-structure-tab-container">
      {/* Year Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-black/5 pb-6">
        {data.map((yearDetail) => {
          const isActive = activeYear === yearDetail.year;
          return (
            <button
              key={yearDetail.year}
              onClick={() => setActiveYear(yearDetail.year)}
              className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer shadow-xs select-none ${
                isActive 
                  ? `${activeColor} font-black` 
                  : `bg-white border-border text-muted ${inactiveHoverColor}`
              }`}
            >
              {yearDetail.year}
            </button>
          );
        })}
      </div>

      {/* active Year Contents */}
      {activeYearDetail && (
        <div className="space-y-8 animate-fade-in" key={activeYear}>
          <div>
            <span className={`font-mono font-black text-[10px] uppercase tracking-widest block mb-1 ${textThemeColor}`}>
              {activeYearDetail.year}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-black font-serif tracking-tight pr-2">
              {activeYearDetail.title}
            </h4>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-semibold mt-1">
              {activeYearDetail.summary}
            </p>
          </div>

          {/* Semesters Side-By-Side Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {activeYearDetail.semesters.map((sem, semIdx) => (
              <div key={sem.semester} className="space-y-5 flex flex-col h-full bg-offwhite/50 border border-black/5 p-6 rounded-3xl">
                {/* Semester Header */}
                <div className="flex items-center gap-3 border-b border-black/5 pb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tagColor}`}>
                    <BookOpen size={16} />
                  </div>
                  <h5 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#1a1a1a]">
                    {sem.semester.split(':')[0] || sem.semester}
                  </h5>
                </div>

                {/* Subject Cards Stack */}
                <div className="space-y-4 flex-1">
                  {sem.subjects.map((sub, subIdx) => (
                    <div 
                      key={sub.name}
                      className={`group bg-white p-5 rounded-2xl border border-black/5 hover:border-black/10 hover:shadow-md transition-all duration-300 ${borderHighlightColor}`}
                    >
                      <h6 className="text-xs sm:text-sm font-extrabold text-black tracking-tight leading-snug group-hover:text-black transition-colors">
                        {sub.name}
                      </h6>
                      <p className="text-[11px] text-muted mt-2 leading-relaxed font-semibold">
                        {sub.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
