import { useState } from 'react';
import { ChevronDown, Sparkles, Users, Cpu, Rocket, HandCoins, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const features = [
  {
    icon: <Sparkles className="text-wine" size={24} />,
    title: "New-age academics",
    body: "Study valuation, PropTech, urban finance, and AI-powered deal-making — taught by RICS-certified faculty, unicorn founders, and professors from IIM, Kellogg, and MIT."
  },
  {
    icon: <Users className="text-wine" size={24} />,
    title: "Learn directly from founders",
    body: "100+ real estate founders teach on campus across four years. Not panels. Not lectures. They walk you through their real deals, their real mistakes, and give you real access."
  },
  {
    icon: <Cpu className="text-wine" size={24} />,
    title: "AI & PropTech focus",
    body: "Build 3 live PropTech products, master 25+ tools, and get 100 paying customers within weeks of launch. You learn by shipping — not by studying case studies about companies that shipped."
  },
  {
    icon: <HandCoins className="text-wine" size={24} />,
    title: "In-house incubator",
    body: "Access a ₹5Cr startup fund, mentorship from 100+ founders, and pitch sessions with 50+ VCs. If your idea has legs, Lotlite helps you run with it while you're still a student."
  },
  {
    icon: <Target className="text-wine" size={24} />,
    title: "Learn sales by doing sales",
    body: "Close ₹1L in property sales in your first four weeks — telecalling, door-to-door, flea booths, site visits. No classroom exercise. Actual buyers, actual commission, actual experience."
  },
  {
    icon: <Rocket className="text-wine" size={24} />,
    title: "Structured career prep",
    body: "250+ hours of career preparation built around your ambitions, not a one-size curriculum. Result: graduates average 9L+ CTC, with top 25% crossing 14L."
  }
];

export default function ProgramDetails() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden scroll-mt-20" id="ug-program">
      <div className="wine-glow -top-20 -left-20 w-[400px] h-[400px]" />
      <div className="absolute inset-0 z-[1] bg-arch-2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 text-center" data-aos="fade-up">
          <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">Program Architecture</span>
          <h2 className="text-4xl md:text-5xl text-black mb-8 font-serif leading-[1.1]">B.REM in Real Estate <br/><span className="text-wine">Management & Investment</span></h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["4 Years", "Full-Time, Residential", "Aug 2026", "Bengaluru"].map((tag) => (
              <span key={tag} className="px-5 py-2 rounded-lg bg-offwhite text-muted font-bold text-[10px] uppercase tracking-widest border border-border">
                {tag}
              </span>
            ))}
          </div>
          
          <button className="bg-wine text-white px-8 md:px-12 py-4 md:py-5 rounded-lg font-bold border-2 border-transparent shadow-2xl shadow-wine/20 hover:bg-transparent hover:text-wine hover:border-wine transition-all uppercase tracking-widest text-sm">
            Apply Now
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`light-gradient-card rounded-2xl p-6 md:p-10 transition-all duration-500 border border-wine/10 hover:border-wine/40 ${expandedIndex === idx ? 'ring-2 ring-wine/20' : ''} cursor-default md:cursor-auto`}
              onClick={() => {
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                  setExpandedIndex(expandedIndex === idx ? null : idx);
                }
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-wine/5 flex items-center justify-center text-wine shadow-lg shadow-wine/5">
                  {feature.icon}
                </div>
                <div className="text-black/5 font-serif text-3xl font-bold tracking-tighter">0{idx + 1}</div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 tracking-tight flex items-center justify-between">
                {feature.title}
                <motion.div
                  animate={{ rotate: expandedIndex === idx ? 180 : 0 }}
                  className="text-wine md:hidden shrink-0 ml-4"
                >
                  <ChevronDown size={24} />
                </motion.div>
              </h3>
              
              <div className="block">
                <AnimatePresence initial={false}>
                  <motion.div
                    key="content"
                    initial={false}
                    animate={{ 
                      height: (expandedIndex === idx || typeof window !== 'undefined' && window.innerWidth >= 768) ? "auto" : 0,
                      opacity: (expandedIndex === idx || typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted text-sm leading-relaxed font-medium">
                      {feature.body}
                    </p>
                    {expandedIndex === idx && (
                      <div className="mt-8 pt-6 border-t border-border text-wine text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 md:hidden">
                        EXPAND CURRICULUM MAP <ChevronDown size={14} className="-rotate-90" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
