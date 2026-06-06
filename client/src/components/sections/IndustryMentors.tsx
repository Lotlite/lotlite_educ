import React, { useRef, useState } from 'react';

const mentors = [
  {
    name: "Rohan Shah",
    role: "Director · Sales",
    company: "Hiranandani Group",
    bio: "Industry Advisor · Avid Real Estate Investor",
    tags: ["Sales", "PropTech", "Investor"]
  },
  {
    name: "Vikram Aatrey",
    role: "PropTiger Founder",
    company: "IIT Bombay",
    bio: "Ex–Magicbricks",
    tags: ["Entrepreneur", "IIT"]
  },
  {
    name: "Anita Khanna",
    role: "CFO",
    company: "Lodha Group",
    bio: "Delhi School of Economics | Avid Angel Investor",
    tags: ["Finance", "Investor", "Woman In RE"]
  },
  {
    name: "Mihir M",
    role: "NoBroker Founder",
    company: "Ex–Flipkart",
    bio: "Avid Angel Investor",
    tags: ["Growth", "PropTech"]
  },
  {
    name: "Abhinav Bansal",
    role: "Square Yards Founder",
    company: "IIM Ahmedabad",
    bio: "Ex–CBRE",
    tags: ["Sales", "IIM"]
  },
  {
    name: "Varun Khaitan",
    role: "MD",
    company: "Knight Frank",
    bio: "IIT Kanpur | Ex–BCG",
    tags: ["Advisory", "Consulting"]
  }
];

export default function IndustryMentors() {
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
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden" id="mentors">
      <div className="wine-glow -top-20 -left-20 w-[600px] h-[600px] blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <span className="text-bottle-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-4" data-aos="fade-up">Backed by the People Who Built Indian Real Estate</span>
        <h2 className="text-5xl md:text-6xl text-black leading-[1.1] font-serif" data-aos="fade-up" data-aos-delay="100">
          100+ founders on campus. <br/>
          <span className="italic text-black/40">Not panels. Real access.</span>
        </h2>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
        onMouseMove={handleMouseMove}
        className="flex gap-8 overflow-x-auto pb-12 px-6 scrollbar-hide cursor-grab active:cursor-grabbing relative z-10"
      >
        {mentors.map((mentor, idx) => (
          <div 
            key={idx}
            className="min-w-[320px] md:min-w-[380px] bg-offwhite border border-bottle-green/10 rounded-2xl group relative transition-all duration-300 hover:border-bottle-green/40 hover:-translate-y-2 overflow-hidden flex flex-col shadow-sm"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            {/* One-sided Gradient Image Header */}
            <div className="relative w-full h-48 overflow-hidden">
               <img 
                 src={`https://images.unsplash.com/photo-${idx === 0 ? '1560250097-0b93528c311a' : idx === 1 ? '1519085360753-af0119f7cbe7' : '1506794778202-cad84cf45f1d'}?auto=format&fit=crop&w=400&q=80`}
                 alt={mentor.name}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-linear-to-t from-offwhite via-offwhite/40 to-transparent" />
               <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-bold text-black tracking-tight leading-tight">{mentor.name}</h3>
                  <p className="text-bottle-green text-[10px] font-bold uppercase tracking-widest opacity-80">{mentor.role}</p>
               </div>
            </div>

            <div className="p-8 pt-4 flex-grow flex flex-col bg-transparent">
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-4">@ {mentor.company}</p>
              <p className="text-black leading-relaxed text-sm mb-8 italic flex-grow opacity-70">"{mentor.bio}"</p>
              <div className="flex flex-wrap gap-2">
                {mentor.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 border border-border bg-offwhite rounded text-[9px] font-bold uppercase text-muted tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div 
          className="min-w-[320px] bg-bottle-green/5 border border-bottle-green/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center group"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="w-16 h-16 rounded-full border border-bottle-green/20 flex items-center justify-center text-bottle-green mb-6 group-hover:scale-110 transition-transform">
            <span className="text-2xl font-bold">+</span>
          </div>
          <h3 className="text-bottle-green text-2xl font-serif mb-2 tracking-tight">50+ More Founders</h3>
          <p className="text-muted text-xs font-bold uppercase tracking-widest leading-relaxed">Direct Campus Access</p>
        </div>
      </div>
    </section>
  );
}
