import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

const phrases = [
  "4 Years. Full-Time. Mumbai.",
  "200 Seats. Industry-Led.",
  "Day-1 Employment."
];

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [subText, setSubText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentPhrase = phrases[index];
      if (!isDeleting) {
        setSubText(currentPhrase.substring(0, subText.length + 1));
        if (subText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setSubText(currentPhrase.substring(0, subText.length - 1));
        if (subText.length === 0) {
          setIsDeleting(false);
          setIndex((index + 1) % phrases.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subText, isDeleting, index]);

  return (
    <section className="relative pt-28 pb-10 md:pt-36 lg:pt-48 md:pb-12 overflow-hidden border-b border-black/5" id="hero">
      {/* Background Layer with Red-and-White Gradient & Buildings Background */}
      <div className="absolute inset-0 z-0 bg-white dark:bg-[#121212] transition-colors duration-500" />
      <div 
        className="absolute inset-0 z-[1] bg-cover bg-center opacity-30 dark:opacity-15 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`
        }}
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/40 to-100% dark:from-[#121212] dark:via-[#121212]/80 dark:via-40% dark:to-[#E3262F]/40 dark:to-100% pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-box">
          
          {/* Left Column (Content & Action Buttons) */}
          <div data-aos="fade-up" className="text-center md:text-left space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-black font-serif leading-[1.15]">
              B.REM in Real Estate <br className="hidden md:block"/>
              <span className="text-wine">Management & Investment</span>
            </h1>
            
            <div className="h-8">
              <p className="text-lg text-muted italic font-serif">
                "{subText}"
              </p>
            </div>
 
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1 pb-4">
              {["4 Years", "Full-Time", "Mumbai", "200 Seats", "Day-1 Placement"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg border border-border text-muted text-[9px] font-bold uppercase tracking-widest bg-offwhite/50">
                  {tag}
                </span>
              ))}
            </div>
 
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'apply_form' }));
                }}
                className="bg-wine text-white border border-transparent px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all text-center cursor-pointer"
              >
                Apply Now
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'fees' }));
                }}
                className="border border-border text-black bg-white px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer text-center"
              >
                Plan Fees & Scholarships
              </button>
            </div>
          </div>
 
          {/* Right Column (Compact Video Player) */}
          <div className="w-full relative md:pl-6" data-aos="fade-up" data-aos-delay="100">
            <div className="w-full bg-white/40 border border-neutral-100 rounded-2xl shadow-xl overflow-hidden p-4 md:p-5">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div 
                  className={`w-full md:w-[48%] lg:w-[52%] aspect-video bg-offwhite rounded-xl flex items-center justify-center border border-border relative overflow-hidden shrink-0 group ${!isPlaying ? 'cursor-pointer' : ''}`}
                  onClick={() => !isPlaying && setIsPlaying(true)}
                >
                  {isPlaying ? (
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Lotlite Education Film"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-wine/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-10 h-10 bg-wine rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform group-hover:scale-110">
                         <Play className="fill-white text-white w-4 h-4 ml-0.5" />
                      </div>
                    </>
                  )}
                </div>
                <div className="text-center md:text-left flex-1 min-w-0">
                  <span className="text-wine text-[9px] font-bold uppercase tracking-widest block mb-0.5">2 min Film</span>
                  <h3 className="text-base font-bold text-black leading-snug mb-1 truncate">Karan Mehta · Masterclass</h3>
                  <p className="text-muted text-[11px] leading-relaxed line-clamp-2">Why professional real estate management command absolute premium wages in Indian realty boards.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic partners row positioned discreetly at the bottom */}
        <div className="mt-8 pt-4 border-t border-black/5 flex flex-wrap items-center justify-center lg:justify-between gap-4">
          <p className="text-muted text-[8px] uppercase tracking-[0.3em] font-bold text-center lg:text-left">Strategic Endorsement Credentials</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-2 opacity-30 grayscale text-[10px] font-bold uppercase tracking-widest text-black">
            {["RICS Standard", "NAREDCO", "HIRANANDANI", "LODHA", "99acres"].map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
