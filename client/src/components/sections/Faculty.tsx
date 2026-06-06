import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const faculty = [
  {
    name: "Anil Bassamboo",
    course: "Real Estate Operations",
    title: "Professor of Decision Sciences & Operations, MIT Real Estate Center",
    overview: "Learn how real estate portfolios run at scale — from asset operations to process design — using frameworks from one of the world's top operations researchers.",
    tags: ["Kellogg", "Stanford"]
  },
  {
    name: "Tim Calkins",
    course: "Brand & Marketing",
    title: "Kellogg School of Management, Northwestern University",
    overview: "Study how the brands that dominate real estate built lasting trust and pricing power — from Hiranandani's legacy positioning to Lodha's urban repositioning.",
    tags: ["Kellogg", "Harvard"]
  },
  {
    name: "Siddarth Menon",
    course: "Digital Marketing & Strategy",
    title: "Marketing & Strategy Consultant, Ex-CMO Square Yards",
    overview: "Run real digital campaigns with real data from major developers. Learn what actually converts property buyers — not what works in textbook theory.",
    tags: ["99acres", "Magicbricks"]
  },
  {
    name: "Prof. Sundar Venkatesh",
    course: "Real Estate Finance",
    title: "Educator & learning consultant working with REITs",
    overview: "Learn to analyze financial data, plan strategically, and make informed real estate decisions.",
    tags: ["ISB", "SNU"]
  }
];

export default function Faculty() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-16 md:py-24 bg-transparent overflow-hidden relative scroll-mt-20" id="faculty">
      <div className="wine-glow -top-20 -right-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div data-aos="fade-right">
            <span className="text-bottle-green text-xs font-bold uppercase tracking-widest block mb-4">New Age Academics</span>
            <h2 className="text-4xl md:text-5xl text-black mb-6">Faculty who've done it, <br/>not just studied it</h2>
            <div className="flex flex-wrap gap-3 mb-8">
              {["RICS, IREI, JLL · Faculty from top global firms", "600+ Hours of curriculum", "75+ Real-world case studies", "6 Majors"].map(tag => (
                <span key={tag} className="light-gradient-card px-3 py-1 text-[10px] font-bold uppercase text-black/60 tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <button className="bg-bottle-green text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 border-2 border-transparent hover:bg-transparent hover:text-bottle-green hover:border-bottle-green transition-all">
              Download Brochure <span className="text-lg">⤓</span>
            </button>
          </div>
          
          <div className="md:max-w-md" data-aos="fade-left">
            <p className="text-bottle-green font-bold text-lg mb-2">Tim Calkins | Visiting Marketing Professor</p>
            <p className="text-black/40 text-sm italic mb-4">Harvard · Kellogg · Yale</p>
            <p className="text-black/70 text-sm leading-relaxed font-medium">
              Our most-loved courses are taught by academics and practitioners who led the firms you want to work at.
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
        onMouseMove={handleMouseMove}
        className="flex gap-8 overflow-x-auto pb-12 px-6 lg:px-24 scrollbar-hide cursor-grab active:cursor-grabbing relative z-10"
      >
        {faculty.map((prof, idx) => (
          <div 
            key={idx}
            className="min-w-[280px] md:min-w-[480px] bg-offwhite border border-bottle-green/10 rounded-2xl group relative transition-all duration-300 hover:border-bottle-green/40 hover:-translate-y-2 overflow-hidden flex flex-col md:flex-row shadow-sm"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            {/* One-sided Gradient Image */}
            <div className="relative w-full md:w-1/3 aspect-[4/5] md:aspect-auto overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-${idx === 0 ? '1507003211169-0a1dd7228f2d' : idx === 1 ? '1500648767791-00dcc994a43e' : idx === 2 ? '1573496359142-b8d87734a5a2' : '1472099645785-5658abf4ff4e'}?auto=format&fit=crop&w=600&q=80`}
                alt={prof.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-offwhite" />
              <div className="absolute inset-0 bg-linear-to-t from-offwhite via-transparent to-transparent md:hidden" />
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center bg-transparent">
              <p className="text-bottle-green font-bold text-[10px] uppercase tracking-widest mb-2">{prof.course}</p>
              <h3 className="text-2xl md:text-3xl font-bold mb-1 text-black leading-tight">{prof.name}</h3>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-6 leading-snug">{prof.title}</p>
              
              <div className="flex flex-wrap gap-2">
                {prof.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-bottle-green/5 rounded text-[9px] font-bold uppercase text-bottle-green tracking-widest border border-bottle-green/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
