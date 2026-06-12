import { BookOpen, Target, Users } from 'lucide-react';

export default function PracticalLearning() {
  return (
    <section className="bg-white relative overflow-hidden" id="practical-learning">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Practical Learning */}
          <div data-aos="fade-right">
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Methodology</span>
            <h2 className="text-3xl md:text-4xl font-serif text-black leading-tight mb-6">
              Learn by Doing, Not Just Reading
            </h2>
            <p className="text-sm text-muted font-medium leading-relaxed mb-8">
              At Lotlite Edu, students learn through a practical and application based approach. The learning journey is designed to help students understand real industry situations and build workplace confidence.
            </p>
            
            <div className="bg-offwhite border border-black/5 rounded-3xl p-6 md:p-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
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
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-wine shrink-0" />
                    <span className="text-xs font-bold text-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Who Should Apply */}
          <div className="bg-wine/5 border border-wine/10 rounded-3xl p-8 md:p-10 shadow-lg" data-aos="fade-left">
            <div className="flex items-center gap-4 mb-8 border-b border-wine/10 pb-6">
              <div className="w-12 h-12 bg-wine/10 rounded-xl flex items-center justify-center text-wine">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-black">Who Should Apply?</h3>
            </div>
            
            <div className="space-y-4">
              {[
                "Students who want a career in real estate, sales, marketing, or business development",
                "Graduates looking for a career focused management programme",
                "Class twelve students who want to build a business and real estate career early",
                "Family business students from real estate, construction, interiors, architecture, or property backgrounds",
                "Working professionals who want to move into real estate, CRM, channel sales, or property consulting",
                "Aspiring entrepreneurs who want to start a real estate consulting, brokerage, or property marketing business"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-wine shrink-0 mt-0.5" />
                  <p className="text-xs text-muted font-bold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
