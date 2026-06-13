import { GraduationCap, Building2, TrendingUp, Laptop, Users } from 'lucide-react';

const advantages = [
  { icon: <GraduationCap className="w-6 h-6 text-wine" />, title: "Real Estate Centric Curriculum", text: "Learn business management through the lens of real estate, construction, property marketing, investment, CRM, and PropTech." },
  { icon: <Building2 className="w-6 h-6 text-wine" />, title: "Industry Focused Learning", text: "Go beyond theory with case studies, market research, project work, and practical business scenarios." },
  { icon: <TrendingUp className="w-6 h-6 text-wine" />, title: "Career Oriented Approach", text: "Build skills for sales, marketing, CRM, business development, channel management, consulting, and entrepreneurship." },
  { icon: <Laptop className="w-6 h-6 text-wine" />, title: "Technology Enabled Training", text: "Understand CRM, ERP, automation, analytics, lead management, and modern real estate technology." },
  { icon: <Users className="w-6 h-6 text-wine" />, title: "Business and Practical Exposure", text: "Learn management fundamentals while understanding how real estate businesses actually operate." },
];

export default function LotliteAdvantage() {
  return (
    <section className="bg-offwhite relative overflow-hidden" id="advantage">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">The Lotlite Edu Advantage</span>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight">
            Learn Management Through the <br className="hidden md:block"/> Lens of Real Estate
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {advantages.map((adv, idx) => (
            <div 
              key={idx} 
              className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] bg-white rounded-3xl p-8 border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 max-w-sm md:max-w-none text-left"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="w-16 h-16 rounded-2xl bg-wine/5 border border-wine/10 flex items-center justify-center mb-6">
                {adv.icon}
              </div>
              <h4 className="text-lg font-bold text-black mb-3">{adv.title}</h4>
              <p className="text-sm text-muted leading-relaxed font-medium">{adv.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
