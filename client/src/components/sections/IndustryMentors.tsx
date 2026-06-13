import React, { useRef, useState } from 'react';
import { useApp } from '../../AppContext';
import { Linkedin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const defaultMentors = [
  {
    name: "Rohan Shah",
    role: "Director · Sales",
    company: "Hiranandani Group",
    bio: "Industry Advisor · Avid Real Estate Investor",
    tags: ["Sales", "PropTech", "Investor"],
    imageUrl: ""
  },
  {
    name: "Vikram Aatrey",
    role: "PropTiger Founder",
    company: "IIT Bombay",
    bio: "Ex–Magicbricks",
    tags: ["Entrepreneur", "IIT"],
    imageUrl: ""
  },
  {
    name: "Anita Khanna",
    role: "CFO",
    company: "Lodha Group",
    bio: "Delhi School of Economics | Avid Angel Investor",
    tags: ["Finance", "Investor", "Woman In RE"],
    imageUrl: ""
  },
  {
    name: "Mihir M",
    role: "NoBroker Founder",
    company: "Ex–Flipkart",
    bio: "Avid Angel Investor",
    tags: ["PropTech", "IIM", "Tech"],
    imageUrl: ""
  }
];

export default function IndustryMentors() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const { websiteData } = useApp();
  const activeMentors = websiteData?.industryMentors?.length > 0 ? websiteData.industryMentors : defaultMentors;

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

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#FAFAFA] via-white to-red-50/50 relative overflow-hidden" id="mentors">
      <div className="wine-glow -top-20 -left-20 w-[600px] h-[600px] blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-bottle-green font-bold text-xs uppercase tracking-widest block mb-1">
              Backed by the People Who Built Indian Real Estate
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold text-black leading-tight">
              founders on campus.<br />
              <span className="text-wine">Not panels. Real access.</span>
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
          {activeMentors.map((mentor: any, idx: number) => (
            <div
              key={idx}
              className="min-w-[300px] md:min-w-[340px] xl:min-w-[360px] h-[210px] bg-white border border-gray-100 rounded-3xl flex shadow-[0_8px_30px_rgb(0,0,0,0.04)] shrink-0 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              {/* Image side (Left) */}
              <div className="w-[35%] relative shrink-0">
                <img
                  src={mentor.imageUrl || `https://images.unsplash.com/photo-${idx === 0 ? '1560250097-0b93528c311a' : idx === 1 ? '1519085360753-af0119f7cbe7' : '1506794778202-cad84cf45f1d'}?auto=format&fit=crop&w=400&q=80`}
                  alt={mentor.name}
                  className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white pointer-events-none" />
              </div>

              {/* Content side (Right) */}
              <div className="w-[65%] p-5 flex flex-col justify-center bg-white relative -ml-1">
                {mentor.company && (
                  <p className="text-wine font-bold text-[8px] md:text-[9px] uppercase tracking-[0.15em] mb-2">
                    {mentor.company}
                  </p>
                )}

                <h3 className="text-xl md:text-2xl font-extrabold text-[#2D2D2D] mb-1.5 tracking-tight leading-tight">
                  {mentor.name}
                </h3>

                <p className="text-[#6C757D] text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-snug mb-4">
                  {mentor.role}
                </p>

                {/* Tags */}
                {(mentor.tags && mentor.tags.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mentor.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-50/50 border border-wine/20 text-wine rounded-md text-[8px] font-bold uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="w-full h-px bg-gray-100 mb-4" />

                <div className="mt-auto">
                  <p className="text-[10px] md:text-[11px] text-gray-500 font-medium italic line-clamp-1">
                    "{mentor.bio}"
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
