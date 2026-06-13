import { Briefcase, PieChart, Landmark, Mic, Presentation, FileCheck, Building, Database, Target, Globe } from 'lucide-react';

const managementCards = [
  { icon: <Briefcase className="w-5 h-5" />, title: "Business Management" },
  { icon: <PieChart className="w-5 h-5" />, title: "Marketing & Sales" },
  { icon: <Landmark className="w-5 h-5" />, title: "Finance & Investment Basics" },
  { icon: <Mic className="w-5 h-5" />, title: "Communication & Leadership" },
  { icon: <Presentation className="w-5 h-5" />, title: "Projects & Research" },
];

const realEstateCards = [
  { icon: <FileCheck className="w-5 h-5" />, title: "RERA, REIT & Regulations" },
  { icon: <Building className="w-5 h-5" />, title: "Property Sales & Channels" },
  { icon: <Database className="w-5 h-5" />, title: "CRM & Lead Nurturing" },
  { icon: <Target className="w-5 h-5" />, title: "Property Launch Campaigns" },
  { icon: <Globe className="w-5 h-5" />, title: "PropTech & Marketing Analytics" },
];

export default function BestOfBothWorlds() {
  return (
    <section className="bg-white py-20 relative overflow-hidden" id="best-of-both-worlds">
      {/* Custom AI-Generated Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none mix-blend-darken"
        style={{
          backgroundImage: `url('/images/abstract-edu-bg.png')`
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Title Block */}
        <div className="text-center mb-16 z-20" data-aos="fade-up">
          <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Methodology</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-black tracking-tight mb-4 font-serif">
            Best of Both <span className="text-wine">Worlds</span>
          </h2>
          <p className="text-muted text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Where Management Education Meets Real Estate Industry Learning
          </p>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-24 relative mt-4">
          
          {/* Left Column */}
          <div className="w-full flex flex-col space-y-4 z-20" data-aos="fade-right">
            <div className="flex items-center gap-3 mb-4 pl-2">
              <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black font-bold text-xs shrink-0">1</span>
              <h3 className="text-xl font-bold text-black">Management Foundation</h3>
            </div>
            <div className="space-y-3">
              {managementCards.map((card, idx) => (
                <div key={idx} className="bg-offwhite border border-black/5 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-black/20 hover:bg-black/5 transition-all group cursor-default shadow-sm">
                  <div className="text-black/40 group-hover:text-black transition-colors shrink-0">
                    {card.icon}
                  </div>
                  <div className="w-px h-6 bg-black/10 shrink-0 group-hover:bg-black/20 transition-colors"></div>
                  <h4 className="text-[13px] font-bold text-black tracking-wide">{card.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full flex flex-col space-y-4 z-20" data-aos="fade-left">
            <div className="flex items-center gap-3 mb-4 pl-2">
              <span className="w-8 h-8 rounded-full bg-wine/10 flex items-center justify-center text-wine font-bold text-xs shrink-0">2</span>
              <h3 className="text-xl font-bold text-wine">Real Estate & PropTech</h3>
            </div>
            <div className="space-y-3">
              {realEstateCards.map((card, idx) => (
                <div key={idx} className="bg-wine/5 border border-wine/10 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-wine/30 hover:bg-wine/10 transition-all group cursor-default shadow-sm">
                  <div className="text-wine/60 group-hover:text-wine transition-colors shrink-0">
                    {card.icon}
                  </div>
                  <div className="w-px h-6 bg-wine/10 shrink-0 group-hover:bg-wine/30 transition-colors"></div>
                  <h4 className="text-[13px] font-bold text-black tracking-wide">{card.title}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
