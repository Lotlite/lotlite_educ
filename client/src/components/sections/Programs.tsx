import { Clock, GraduationCap, Target, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const programs = [
  {
    id: "mba",
    name: "MBA in Real Estate, Business and PropTech",
    level: "Postgraduate pathway",
    bestFor: "Graduates who want to build a serious career in real estate, business, marketing, sales, investment, or entrepreneurship",
    duration: "24 months",
    focus: "Real estate, business management, marketing, sales, CRM, investment, PropTech, analytics, and entrepreneurship",
    audience: "Graduates, working professionals, aspiring real estate entrepreneurs, sales professionals, and business students",
    cta: "Explore MBA Curriculum",
    theme: "wine"
  },
  {
    id: "bba",
    name: "BBA in Business, Real Estate and Marketing",
    level: "Undergraduate pathway",
    bestFor: "Students after class twelve who want an early start in business, management, marketing, real estate, and entrepreneurship",
    duration: "36 months",
    focus: "Business foundation, marketing, finance, human resources, analytics, entrepreneurship, and real estate exposure",
    audience: "Class twelve students, commerce students, business aspirants, family business students, and students interested in real estate careers",
    cta: "Explore BBA Curriculum",
    theme: "bottle-green"
  },
  {
    id: "bca",
    name: "BCA in Computer Applications, Data Science and Software Development",
    level: "Undergraduate pathway",
    bestFor: "Students after class twelve who want a career in software development, data science, web technologies, and computer applications",
    duration: "36 months",
    focus: "Programming, data structures, web development, databases, AI fundamentals, cloud computing, mobile apps, and capstone projects",
    audience: "Class twelve students, science and math enthusiasts, aspiring developers, tech-curious learners, and students interested in IT careers",
    cta: "Explore BCA Curriculum",
    theme: "bottle-green"
  },
  {
    id: "mca",
    name: "MCA in AI, Software Engineering and Applied Computing",
    level: "Postgraduate pathway",
    bestFor: "Graduates who want stronger foundations in software engineering, cloud, databases, AI, system design, product thinking, and deployment",
    duration: "24 months",
    focus: "Advanced programming, AI/ML, full stack development, system design, cloud computing, DevOps, data engineering, and capstone projects",
    audience: "BCA/BSc/BTech graduates, working IT professionals, aspiring software engineers, data scientists, and AI enthusiasts",
    cta: "Explore MCA Curriculum",
    theme: "wine"
  }
];

export default function Programs() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-transparent relative overflow-hidden scroll-mt-20" id="programs">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-14 text-center" data-aos="fade-up">
          <span className="text-muted text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Lotlite Edu</span>
          <h2 className="text-4xl md:text-5xl text-black font-serif leading-tight mb-4">
            Programs Offered
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto font-medium">
            Career-focused education pathways designed for the modern real estate and technology ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {programs.map((prog, idx) => (
            <div
              key={prog.id}
              className="bg-white border border-black/5 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all flex flex-col"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              {/* Header */}
              <div className="mb-8 border-b border-black/5 pb-6">
                <span className={`text-[10px] font-bold uppercase tracking-[0.3em] block mb-3 text-${prog.theme}`}>
                  {prog.level}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-black leading-tight">
                  {prog.name}
                </h3>
              </div>

              {/* Info List */}
              <div className="space-y-6 flex-1 mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-black">
                    <Target size={16} className={`text-${prog.theme}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Best For</span>
                  </div>
                  <p className="text-sm text-muted font-medium leading-relaxed pl-6">
                    {prog.bestFor}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-black">
                    <Clock size={16} className={`text-${prog.theme}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="text-sm text-muted font-medium leading-relaxed pl-6">
                    {prog.duration}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-black">
                    <GraduationCap size={16} className={`text-${prog.theme}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Focus Areas</span>
                  </div>
                  <p className="text-sm text-muted font-medium leading-relaxed pl-6">
                    {prog.focus}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-black">
                    <Users size={16} className={`text-${prog.theme}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Ideal Audience</span>
                  </div>
                  <p className="text-sm text-muted font-medium leading-relaxed pl-6">
                    {prog.audience}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/programs/${prog.id}-overview`);
                }}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-all bg-${prog.theme} hover:opacity-90 shadow-md cursor-pointer`}
              >
                {prog.cta} <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

