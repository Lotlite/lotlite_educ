import React from 'react';

export default function PracticalLearning() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden" id="practical-learning">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Methodology</span>
        <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
          Learn by Doing, Not Just Reading
        </h2>
        <p className="text-sm md:text-base text-muted font-medium leading-relaxed mb-12">
          At Lotlite Edu, students learn through a practical and application based approach. The learning journey is designed to help students understand real industry situations and build workplace confidence.
        </p>
        
        <div className="bg-offwhite border border-black/5 rounded-3xl p-8 md:p-12 shadow-sm text-left">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {[
              "Real estate case studies",
              "Market research assignments",
              "CRM and lead management practice",
              "Property launch campaign planning",
              "Sales and counselling simulations",
              "Business communication training",
              "Marketing strategy projects",
              "Research projects",
              "Internship or field exposure",
              "Final project presentation"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-wine shrink-0" />
                <span className="text-sm font-bold text-black">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
