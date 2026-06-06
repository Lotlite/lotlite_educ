import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const alumni = [
  { name: "Sanchit Madhura", role: "Chief of Staff", company: "Epigamia", batch: "2025" },
  { name: "Arvind Girish", role: "Sales Lead", company: "Lodha", batch: "2025" },
  { name: "Harshit Maheshwari", role: "PropTech PM", company: "99acres", batch: "2024" },
  { name: "Ruheen Singh", role: "Growth Manager", company: "NoBroker", batch: "2024" },
  { name: "Richa Pherwani", role: "Chief of Staff AI", company: "Epigamia", batch: "2025" },
  { name: "Piyush Verma", role: "Category Manager", company: "Square Yards", batch: "2024" },
  { name: "Varun Bali", role: "Founder's Office", company: "PropTiger", batch: "2024" },
  { name: "Atishay Nijhawan", role: "Senior Manager", company: "Knight Frank", batch: "2025" },
];

export default function Outcomes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alumni.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % alumni.length);
    setIsAutoPlaying(false);
  };
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + alumni.length) % alumni.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-16 md:py-24 bg-transparent relative scroll-mt-20" id="outcomes">
      <div className="grid md:grid-cols-2 min-h-[800px]">
        {/* Left Stats */}
        <div className="relative p-12 md:p-24 flex flex-col justify-center overflow-hidden">
          <div className="wine-glow -top-20 -left-20 w-[400px] h-[400px]" />
          
          <div className="grid grid-cols-2 gap-4 mb-20">
            {[
              { val: "₹9L", label: "Average CTC" },
              { val: "₹14L", label: "Top 25% Average CTC" },
              { val: "3.2X", label: "Average CTC jump" },
              { val: "62%", label: "Deal-facing roles" },
              { val: "40+", label: "Partner firms" }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="light-gradient-card p-6 rounded-2xl flex flex-col items-start gap-2"
                data-aos="fade-up" 
                data-aos-delay={idx * 100}
              >
                <div className="text-3xl font-serif italic font-bold text-wine tracking-tighter">{stat.val}</div>
                <div className="text-black/40 text-[10px] uppercase font-bold tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-20" data-aos="fade-up">
            <button className="bg-wine text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold border-2 border-transparent shadow-xl shadow-wine/20 hover:bg-transparent hover:text-wine hover:border-wine transition-all text-sm uppercase tracking-widest">
              See Placement Stories
            </button>
            <button className="border-2 border-black/20 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold hover:bg-wine hover:text-white hover:border-wine transition-all text-sm uppercase tracking-widest">
              Download Report ⤓
            </button>
          </div>

          <div className="pt-8 border-t border-black/5" data-aos="fade-up">
            <p className="text-black/30 text-[10px] uppercase tracking-[0.3em] mb-6 font-bold">Leading Placement</p>
            <div className="bg-white border border-wine/10 p-6 rounded-2xl flex items-center gap-6 shadow-sm group hover:border-wine/40 transition-all">
              <div className="w-16 h-16 rounded-full bg-offwhite border border-black/10 flex items-center justify-center text-wine font-bold text-xl shadow-inner shrink-0">
                AA
              </div>
              <div className="flex flex-col">
                <h4 className="text-xl font-bold text-black group-hover:text-wine transition-colors">Ankit Agrawal</h4>
                <p className="text-wine text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Head of Placements</p>
                <div className="flex flex-wrap gap-2">
                  {['CBRE', 'Lodha', 'JLL'].map(comp => (
                    <span key={comp} className="px-2 py-0.5 border border-border bg-offwhite rounded text-[8px] font-bold uppercase text-muted tracking-widest">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Alumni Carousel */}
        <div className="p-12 md:p-24 bg-transparent flex flex-col justify-center relative overflow-hidden border-l border-black/5">
          <div className="mb-12" data-aos="fade-up">
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">ALUMNI OUTCOMES</span>
            <h2 className="text-4xl md:text-5xl text-black font-serif leading-tight mb-6">At the Forefront of Indian Real Estate</h2>
            <p className="text-black/50 leading-relaxed font-medium">
              Three cohorts in. Our graduates are running their own firms, closing multi-crore deals, and leading strategic teams at India's top property developers.
            </p>
          </div>

          <div className="relative h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white border border-black/5 rounded-2xl shadow-2xl p-10 flex flex-col items-center text-center justify-center group"
              >
                <div className="w-24 h-24 rounded-full bg-offwhite border border-black/10 flex items-center justify-center text-wine font-bold text-3xl mb-6 shadow-inner relative">
                  <div className="absolute inset-0 rounded-full bg-wine/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">{alumni[currentIndex].name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">{alumni[currentIndex].name}</h3>
                <p className="text-wine font-bold uppercase text-[10px] tracking-[0.2em] mb-1">{alumni[currentIndex].role} @ {alumni[currentIndex].company}</p>
                <div className="w-12 h-px bg-black/10 my-4" />
                <p className="text-black/30 text-[10px] uppercase tracking-[0.3em] font-bold">Batch of {alumni[currentIndex].batch}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:bg-wine hover:text-white hover:border-wine transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:bg-wine hover:text-white hover:border-wine transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
