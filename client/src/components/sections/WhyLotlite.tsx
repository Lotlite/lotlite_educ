import { CheckCircle2 } from 'lucide-react';

export default function WhyLotlite() {
  return (
    <section className="bg-white relative overflow-hidden" id="why-lotlite">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center md:text-left">
        <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4 text-center">Why Lotlite Edu</span>
        <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-8 text-center">
          A Real Estate Business School <br className="hidden md:block"/>Built for Modern Careers
        </h2>
        
        <div className="space-y-6 text-sm md:text-base text-muted font-medium leading-relaxed mb-12 max-w-3xl mx-auto text-center">
          <p>
            The real estate industry needs professionals who understand more than property. Today, successful real estate careers require business knowledge, finance awareness, sales skills, compliance understanding, marketing ability, technology adoption, communication confidence, and customer management.
          </p>
          <p>
            Lotlite Edu is designed to prepare students for this new reality. The programmes help learners build a strong foundation in business while developing practical understanding of real estate and PropTech.
          </p>
        </div>
        
        <div className="bg-offwhite rounded-3xl p-8 md:p-12 border border-black/5 shadow-sm">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            {[
              "Learn real estate as a business ecosystem",
              "Understand property markets, customer journeys, and project launches",
              "Build confidence for sales, consulting, CRM, and business development roles",
              "Get exposure to technology led real estate operations",
              "Develop practical thinking through case studies and projects"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4 text-sm text-black font-semibold">
                <CheckCircle2 className="w-5 h-5 text-wine shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
