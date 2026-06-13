import React, { useRef, useState } from 'react';
import { Linkedin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../AppContext';

const defaultInstructors = [
  {
    name: "Anil Bassamboo",
    course: "REAL ESTATE OPERATIONS",
    title: "PROFESSOR OF DECISION SCIENCES & OPERATIONS, MIT REAL ESTATE CENTER",
    tags: ["KELLOGG", "STANFORD"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://linkedin.com"
  },
  {
    name: "Tim Calkins",
    course: "BRAND & MARKETING",
    title: "KELLOGG SCHOOL OF MANAGEMENT, NORTHWESTERN UNIVERSITY",
    tags: ["KELLOGG", "HARVARD"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://linkedin.com"
  },
  {
    name: "Siddarth Menon",
    course: "DIGITAL MARKETING & STRATEGY",
    title: "MARKETING & STRATEGY CONSULTANT, EX-CMO SQUARE YARDS",
    tags: ["99ACRES", "MAGICBRICKS"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://linkedin.com"
  },
  {
    name: "Prof. Sundar Venkatesh",
    course: "REAL ESTATE FINANCE",
    title: "EDUCATOR & LEARNING CONSULTANT",
    tags: ["ISB", "SNU"],
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://linkedin.com"
  }
];

export default function Faculty() {
  const { websiteData } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeftState(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const activeInstructors = websiteData?.instructors?.length > 0 ? websiteData.instructors : defaultInstructors;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#FAFAFA] via-white to-red-50/50 overflow-hidden relative scroll-mt-20" id="faculty">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Instructors</span>
            <h2 className="text-3xl md:text-5xl font-semibold text-black">
              Faculty who've done it,<br />
              <span className="text-wine">not just studied it </span>
            </h2>


          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-wine hover:border-wine transition-colors shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-wine hover:border-wine transition-colors shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1600px] mx-auto lg:px-6">
        {/* Left/Right Scroll Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
          onMouseMove={handleMouseMove}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-12 px-6 lg:px-6 scrollbar-hide cursor-grab active:cursor-grabbing relative z-10"
        >
          {activeInstructors.map((prof: any, idx: number) => (
            <div
              key={idx}
              className="min-w-[300px] md:min-w-[340px] xl:min-w-[360px] h-[210px] bg-white border border-gray-100 rounded-3xl flex shadow-[0_8px_30px_rgb(0,0,0,0.04)] shrink-0 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              {/* Image side (Left) */}
              <div className="w-[35%] relative shrink-0">
                <img
                  src={prof.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                  alt={prof.name}
                  className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                {/* Gradient overlay to blend image into white background seamlessly */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white pointer-events-none" />
              </div>

              {/* Content side (Right) */}
              <div className="w-[65%] p-5 flex flex-col justify-center bg-white relative -ml-1">
                {prof.course && (
                  <p className="text-wine font-bold text-[8px] md:text-[9px] uppercase tracking-[0.15em] mb-2">
                    {prof.course}
                  </p>
                )}

                <h3 className="text-xl md:text-2xl font-extrabold text-[#2D2D2D] mb-1.5 tracking-tight leading-tight">
                  {prof.name}
                </h3>

                <p className="text-[#6C757D] text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-snug mb-4">
                  {prof.title}
                </p>

                {/* Tags */}
                {(prof.tags && prof.tags.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prof.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-50/50 border border-wine/20 text-wine rounded-md text-[8px] font-bold uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Line Separator */}
                <div className="w-full h-px bg-gray-100 mb-4" />

                <div className="mt-auto">
                  {prof.linkedinUrl ? (
                    <a
                      href={prof.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] text-[#5D7BBA] hover:text-blue-700 font-bold uppercase tracking-widest transition-colors"
                    >
                      <Linkedin size={14} className="fill-current text-[#5D7BBA]" />
                      LinkedIn Profile ↗
                    </a>
                  ) : (
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] text-gray-500 font-bold uppercase tracking-widest transition-colors"
                    >
                      <ExternalLink size={14} />
                      Profile ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
