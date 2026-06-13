import { TrendingUp, Megaphone, Briefcase, Rocket, Check } from 'lucide-react';

const outcomeDomains = [
  {
    title: "Sales & Brokerage Advisory",
    icon: <TrendingUp className="w-6 h-6 text-wine" />,
    roles: [
      "Real Estate Sales Executive",
      "Property Consultant",
      "Channel Partner Manager",
      "Leasing Consultant",
      "Pre Sales Executive",
      "Sales Strategy Executive"
    ]
  },
  {
    title: "Marketing, Campaigns & Branding",
    icon: <Megaphone className="w-6 h-6 text-wine" />,
    roles: [
      "Real Estate Marketing Executive",
      "Project Launch Executive",
      "Digital Marketing Executive for Real Estate",
      "Real Estate Brand Executive"
    ]
  },
  {
    title: "Operations, CRM & Investment",
    icon: <Briefcase className="w-6 h-6 text-wine" />,
    roles: [
      "CRM Executive",
      "Customer Relationship Manager",
      "Real Estate Investment Associate",
      "PropTech Operations Executive"
    ]
  },
  {
    title: "Entrepreneurship & Growth",
    icon: <Rocket className="w-6 h-6 text-wine" />,
    roles: [
      "Business Development Executive",
      "Real Estate Entrepreneur",
      "Brokerage Business Owner"
    ]
  }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {outcomeDomains.map((domain, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-black/5 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:border-wine/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-black/5 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-wine/5 border border-wine/10 flex items-center justify-center shrink-0">
                  {domain.icon}
                </div>
                <h3 className="text-lg font-bold text-black">{domain.title}</h3>
              </div>
              <ul className="space-y-3.5 flex-1">
                {domain.roles.map((role, roleIdx) => (
                  <li key={roleIdx} className="flex items-start gap-3 group">
                    <div className="w-5 h-5 rounded-full bg-wine/5 border border-wine/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-wine group-hover:text-white transition-colors duration-200">
                      <Check className="w-3 h-3 text-wine group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-black transition-colors">
                      {role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
