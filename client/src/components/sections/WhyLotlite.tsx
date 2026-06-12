import { CheckCircle2, GraduationCap, Building2, TrendingUp, Laptop, Users } from 'lucide-react';

const advantages = [
  { icon: <GraduationCap className="w-5 h-5 text-wine" />, title: "Real Estate Centric Curriculum", text: "Learn business management through the lens of real estate, construction, property marketing, investment, CRM, and PropTech." },
  { icon: <Building2 className="w-5 h-5 text-wine" />, title: "Industry Focused Learning", text: "Go beyond theory with case studies, market research, project work, and practical business scenarios." },
  { icon: <TrendingUp className="w-5 h-5 text-wine" />, title: "Career Oriented Approach", text: "Build skills for sales, marketing, CRM, business development, channel management, consulting, and entrepreneurship." },
  { icon: <Laptop className="w-5 h-5 text-wine" />, title: "Technology Enabled Training", text: "Understand CRM, ERP, automation, analytics, lead management, and modern real estate technology." },
  { icon: <Users className="w-5 h-5 text-wine" />, title: "Business and Practical Exposure", text: "Learn management fundamentals while understanding how real estate businesses actually operate." },
];

export default function WhyLotlite() {
  return (
    <section className="bg-offwhite relative overflow-hidden" id="why-lotlite">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Why Lotlite Copy */}
          <div className="lg:col-span-5" data-aos="fade-right">
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Why Lotlite Edu</span>
            <h2 className="text-3xl md:text-4xl font-serif text-black leading-tight mb-6">
              A Real Estate Business School Built for Modern Careers
            </h2>
            <div className="space-y-4 text-sm text-muted font-medium leading-relaxed mb-8">
              <p>
                The real estate industry needs professionals who understand more than property. Today, successful real estate careers require business knowledge, finance awareness, sales skills, compliance understanding, marketing ability, technology adoption, communication confidence, and customer management.
              </p>
              <p>
                Lotlite Edu is designed to prepare students for this new reality. The programmes help learners build a strong foundation in business while developing practical understanding of real estate and PropTech.
              </p>
            </div>
            
            <ul className="space-y-3">
              {[
                "Learn real estate as a business ecosystem",
                "Understand property markets, customer journeys, and project launches",
                "Build confidence for sales, consulting, CRM, and business development roles",
                "Get exposure to technology led real estate operations",
                "Develop practical thinking through case studies and projects"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-black font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-wine shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lotlite Edu Advantage */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-black/5 shadow-xl shadow-black/5" data-aos="fade-left">
            <h3 className="text-xl font-bold text-black mb-8 border-b border-black/5 pb-4">
              The Lotlite Edu Advantage
            </h3>
            <div className="space-y-6">
              {advantages.map((adv, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-wine/5 border border-wine/10 flex items-center justify-center shrink-0">
                    {adv.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black mb-1">{adv.title}</h4>
                    <p className="text-xs text-muted leading-relaxed font-medium">{adv.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
