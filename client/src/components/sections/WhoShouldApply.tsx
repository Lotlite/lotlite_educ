import React from 'react';
import { Users, Target } from 'lucide-react';

export default function WhoShouldApply() {
  return (
    <section className="py-20 md:py-28 bg-offwhite relative overflow-hidden" id="who-should-apply">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Admissions</span>
        <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-12">
          Who Should Apply?
        </h2>

        <div className="bg-white border border-black/5 rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left">
          <div className="space-y-6">
            {[
              "Students who want a career in real estate, sales, marketing, or business development",
              "Graduates looking for a career focused management Program",
              "Class twelve students who want to build a business and real estate career early",
              "Family business students from real estate, construction, interiors, architecture, or property backgrounds",
              "Working professionals who want to move into real estate, CRM, channel sales, or property consulting",
              "Aspiring entrepreneurs who want to start a real estate consulting, brokerage, or property marketing business"
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-offwhite transition-colors"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="w-10 h-10 rounded-xl bg-wine/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-wine" />
                </div>
                <p className="text-sm md:text-base text-black font-medium leading-relaxed pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
