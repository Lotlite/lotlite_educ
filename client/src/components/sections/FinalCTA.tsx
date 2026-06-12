import React from 'react';
import { useApp } from '../../AppContext';
import { ArrowRight, FileDown, Phone } from 'lucide-react';

export default function FinalCTA() {
  const { setApplyPopupOpen, setAdvisorPopupOpen } = useApp();

  return (
    <section className="py-20 md:py-28 bg-wine relative overflow-hidden" id="final-cta">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.15)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">
          Your Future Starts Here
        </span>
        <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-8">
          Build Your Career in <br className="hidden md:block" />
          Real Estate and PropTech
        </h2>
        <p className="text-white/70 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-14">
          The real estate industry is changing. The next generation of professionals will need business knowledge, communication skills, technology understanding, and industry exposure. Lotlite Edu helps students prepare for that future.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setApplyPopupOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-wine px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-white/90 transition-colors"
          >
            Apply Now <ArrowRight size={16} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'fees' }));
            }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-white/20 transition-colors"
          >
            <FileDown size={16} /> Download Brochure
          </button>
          <button
            onClick={() => setAdvisorPopupOpen(true)}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-white/20 transition-colors"
          >
            <Phone size={16} /> Speak to Admission Team
          </button>
        </div>
      </div>
    </section>
  );
}
