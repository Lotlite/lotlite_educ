import { Megaphone, Network, Database, Users, Rocket, Landmark } from 'lucide-react';

const focusAreas = [
  { icon: <Megaphone className="w-5 h-5 text-wine" />, title: "Real Estate Marketing", text: "Learn how residential and commercial properties are positioned, promoted, launched, and sold." },
  { icon: <Network className="w-5 h-5 text-wine" />, title: "PropTech and Analytics", text: "Understand how technology, data, automation, dashboards, and analytics are changing real estate business." },
  { icon: <Database className="w-5 h-5 text-wine" />, title: "CRM and Lead Nurturing", text: "Learn how real estate companies manage enquiries, follow ups, site visits, customer relationships, and conversion journeys." },
  { icon: <Users className="w-5 h-5 text-wine" />, title: "Broker & Channel Management", text: "Understand how brokers, channel partners, and sales networks operate in real estate." },
  { icon: <Rocket className="w-5 h-5 text-wine" />, title: "Property Launch Strategy", text: "Learn how new projects are planned, marketed, promoted, and launched through online and offline channels." },
  { icon: <Landmark className="w-5 h-5 text-wine" />, title: "Real Estate Investment", text: "Understand basic investment concepts, REITs, market analysis, and property decision making." }
];

export default function FocusAreas() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden" id="focus-areas">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Core Competencies</span>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            New Age Real Estate Focus Areas
          </h2>
          <p className="text-muted text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            Go beyond standard management theory. Dive deep into the specialized skills required to lead, innovate, and sell in the modern property market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((area, idx) => (
            <div key={idx} className="bg-offwhite border border-black/5 rounded-2xl p-8 hover:-translate-y-1 transition-transform shadow-sm group" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="w-12 h-12 rounded-xl bg-wine/5 border border-wine/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {area.icon}
              </div>
              <h3 className="text-lg font-bold text-black mb-3">{area.title}</h3>
              <p className="text-sm text-muted leading-relaxed font-medium">{area.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
