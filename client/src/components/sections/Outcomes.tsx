import { CheckCircle2 } from 'lucide-react';

const outcomes = [
  "Real Estate Sales Executive",
  "Property Consultant",
  "Business Development Executive",
  "Channel Partner Manager",
  "CRM Executive",
  "Real Estate Marketing Executive",
  "Project Launch Executive",
  "Leasing Consultant",
  "Real Estate Investment Associate",
  "PropTech Operations Executive",
  "Digital Marketing Executive for Real Estate",
  "Customer Relationship Manager",
  "Real Estate Entrepreneur",
  "Brokerage Business Owner",
  "Real Estate Brand Executive",
  "Pre Sales Executive",
  "Sales Strategy Executive"
];

export default function Outcomes() {
  return (
    <section className="py-20 md:py-28 bg-offwhite relative overflow-hidden" id="outcomes">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Career Pathways</span>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            Career Outcomes
          </h2>
          <p className="text-muted text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            Lotlite Edu prepares students for opportunities across real estate, business, marketing, sales, CRM, consulting, and PropTech. Our focus is on practical skill-building to help you become job ready.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {outcomes.map((role, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-black/5 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-sm hover:border-wine/30 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-wine" />
              <span className="text-xs font-bold text-black uppercase tracking-wider">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
