import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../AppContext';
import { 
  Sparkles, 
  ChevronRight, 
  Zap, 
  Terminal, 
  Box, 
  CheckCircle2, 
  Clock, 
  FileDown,
  Calendar, 
  DollarSign, 
  Award,
  BookOpen,
  ClipboardList,
  Rocket
} from 'lucide-react';

export default function Programs() {
  const { triggerToast } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<'mba' | 'bba'>('mba');
  const [activeSubmenu, setActiveSubmenu] = useState<'overview' | 'structure' | 'eligibility' | 'admissions'>('overview');

  const [downloadingCourse, setDownloadingCourse] = useState<string | null>(null);

  const handleDownloadBrochure = (courseKey: string) => {
    setDownloadingCourse(courseKey);
    triggerToast({
      title: "Downloading Brochure",
      description: "Preparing your customized academic prospectus document...",
      type: 'info'
    });

    setTimeout(() => {
      triggerToast({
        title: "Download Complete",
        description: `Successfully downloaded prospectus!`,
        type: 'success'
      });
      setDownloadingCourse(null);
    }, 1200);
  };

  const mbaOverview = {
    title: "MBA in Real Estate, Business and PropTech",
    slug: "Postgraduate Pathway",
    description: "Build a serious career in real estate, business, marketing, sales, investment, or entrepreneurship.",
    tags: ["24 Months", "Real Estate", "Business Management", "PropTech"],
    idealFor: "Graduates, working professionals, aspiring real estate entrepreneurs, sales professionals, and business students",
    focus: "Real estate, business management, marketing, sales, CRM, investment, PropTech, analytics, and entrepreneurship"
  };

  const bbaOverview = {
    title: "BBA in Business, Real Estate and Marketing",
    slug: "Undergraduate Pathway",
    description: "Get an early start in business, management, marketing, real estate, and entrepreneurship after class twelve.",
    tags: ["36 Months", "Business Foundation", "Marketing", "Real Estate Exposure"],
    idealFor: "Class twelve students, commerce students, business aspirants, family business students, and students interested in real estate careers",
    focus: "Business foundation, marketing, finance, human resources, analytics, entrepreneurship, and real estate exposure"
  };

  const mbaCurriculum = [
    { term: "Semester 1", title: "Business Foundation and Real Estate Basics", desc: "Business Statistics, Marketing Management, Financial Accounting, Operations Management, Legal Aspects, HR, Research, Microeconomics, Tech in Business, Data Driven Decisions. Real Estate Basics: REIT, RERA, SEZ, FDI, Construction, Govt Approvals, Investment." },
    { term: "Semester 2", title: "Business Systems and Digital Growth", desc: "Organizational Behaviour, Operations Research, Financial Management, Project Management, Business Communication, Consumer Behaviour, Digital Marketing, Design Thinking, MIS, CRM, Automation." },
    { term: "Semester 3", title: "Strategy and Real Estate Marketing", desc: "Corporate Governance, Crisis Management, Strategic Management, AI & ML, Real Estate Brand Management, Integrated Marketing, Architectural Photography, Property Marketing Strategies." },
    { term: "Semester 4", title: "PropTech, Sales Channels and Launch Strategy", desc: "Entrepreneurship, Global Business, Conflict & Negotiation, Business Transformation, Marketing Analytics & PropTech, Broker Management, Real Estate CRM, New Property Launch Strategy." }
  ];

  const bbaCurriculum = [
    { term: "Semester 1", title: "Foundation and Basics", desc: "Principles of Management, Business Communication, Microeconomics, Financial Accounting, Business Mathematics." },
    { term: "Semester 2", title: "Organizational Dynamics", desc: "Organizational Behavior, Macroeconomics, Cost and Management Accounting, Business Statistics, Environmental Studies." },
    { term: "Semester 3", title: "Core Business Functions", desc: "Marketing Management, Human Resource Management, Financial Management, Business Law, Management Information Systems." },
    { term: "Semester 4", title: "Advanced Operations and Research", desc: "Operations Research, Business Research Methods, Taxation, International Business, Entrepreneurship Development." },
    { term: "Semester 5", title: "Strategy and Specialisation", desc: "Corporate Internship, Services Marketing, Brand Management, Sales and Distribution Management, Open Choice Subjects." },
    { term: "Semester 6", title: "Capstone and Application", desc: "Analytics Foundations, Corporate Governance, Marketing Analytics, Retail Marketing, Marketing Communication (Ads, PR, Events), Final Research Project." }
  ];

  const submenuItems = [
    { id: 'overview', name: 'Programme Overview', icon: <BookOpen size={16} /> },
    { id: 'structure', name: 'Curriculum Snapshot', icon: <ClipboardList size={16} /> },
    { id: 'eligibility', name: 'Eligibility & Intake', icon: <Award size={16} /> },
    { id: 'admissions', name: 'Admission Process', icon: <Clock size={16} /> }
  ] as const;

  const activeThemeColor = selectedProgram === 'mba' ? 'text-wine' : 'text-bottle-green';
  const activeBgColor = selectedProgram === 'mba' ? 'bg-wine' : 'bg-bottle-green';

  return (
    <section className="py-20 bg-transparent relative overflow-hidden scroll-mt-20" id="programs">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-14 text-center md:text-left" data-aos="fade-up">
          <span className="text-muted text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Lotlite Edu</span>
          <h2 className="text-4xl md:text-5xl text-black font-serif leading-tight">
            Programmes Offered
          </h2>
          <p className="text-muted text-sm mt-3 max-w-2xl font-medium">
            Career-focused education pathways designed for the modern real estate ecosystem.
          </p>
        </div>

        <div className="flex border-b border-black/10 mb-12 max-w-2xl" data-aos="fade-up">
          <button
            onClick={() => { setSelectedProgram('mba'); setActiveSubmenu('overview'); }}
            className={`flex-1 pb-4 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all text-center ${
              selectedProgram === 'mba' ? 'border-wine text-wine' : 'border-transparent text-muted hover:text-black'
            }`}
          >
            MBA Pathway (24 Months)
          </button>
          <button
            onClick={() => { setSelectedProgram('bba'); setActiveSubmenu('overview'); }}
            className={`flex-1 pb-4 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all text-center ${
              selectedProgram === 'bba' ? 'border-bottle-green text-bottle-green' : 'border-transparent text-muted hover:text-black'
            }`}
          >
            BBA Pathway (36 Months)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 bg-offwhite border border-black/5 rounded-2xl p-5 md:p-6 lg:sticky lg:top-24 shadow-sm" data-aos="fade-right">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted mb-4 px-3">Programme Menu</p>
            <div className="flex flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
              <div className="flex lg:flex-col gap-1 min-w-[max-content] lg:min-w-0">
                {submenuItems.map((item) => {
                  const isCurActive = activeSubmenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubmenu(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal w-full ${
                        isCurActive ? `${activeBgColor} text-white shadow-md shadow-black/5` : 'text-muted hover:bg-black/5'
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronRight size={14} className={`hidden lg:block shrink-0 ${isCurActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} transition-all`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedProgram}-${activeSubmenu}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                {activeSubmenu === 'overview' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.4em] block mb-2 ${activeThemeColor}`}>
                        {selectedProgram === 'mba' ? mbaOverview.slug : bbaOverview.slug}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-serif text-black leading-tight">
                        {selectedProgram === 'mba' ? mbaOverview.title : bbaOverview.title}
                      </h3>
                    </div>
                    <p className="text-muted text-base leading-relaxed font-medium">
                      {selectedProgram === 'mba' ? mbaOverview.description : bbaOverview.description}
                    </p>
                    <div className="bg-offwhite p-5 rounded-2xl border border-black/5 space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted tracking-widest block mb-1">Ideal For</span>
                        <p className="text-xs text-black font-semibold">{selectedProgram === 'mba' ? mbaOverview.idealFor : bbaOverview.idealFor}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted tracking-widest block mb-1">Focus Areas</span>
                        <p className="text-xs text-black font-semibold">{selectedProgram === 'mba' ? mbaOverview.focus : bbaOverview.focus}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button onClick={() => handleDownloadBrochure(selectedProgram)} className={`inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md ${activeBgColor} hover:opacity-90`}>
                        <FileDown size={14} className="animate-bounce" />
                        Explore {selectedProgram === 'mba' ? 'MBA' : 'BBA'} Curriculum
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4">
                      {(selectedProgram === 'mba' ? mbaOverview.tags : bbaOverview.tags).map((tag) => (
                        <span key={tag} className="px-5 py-2.5 rounded-xl bg-offwhite text-muted font-bold text-[10px] uppercase tracking-widest border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubmenu === 'structure' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">
                        {selectedProgram === 'mba' ? "MBA Curriculum Snapshot" : "BBA Curriculum Snapshot"}
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {(selectedProgram === 'mba' ? mbaCurriculum : bbaCurriculum).map((sem, idx) => (
                        <div key={idx} className={`relative pl-8 border-l border-black/10 pb-4`}>
                          <div className={`absolute top-1 -left-1.5 w-3 h-3 rounded-full shadow-md ${activeBgColor}`} />
                          <p className={`font-bold text-[10px] uppercase tracking-widest mb-1 ${activeThemeColor}`}>{sem.term}</p>
                          <h4 className="text-lg font-bold text-black mb-2">{sem.title}</h4>
                          <p className="text-muted text-xs leading-relaxed font-medium">{sem.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubmenu === 'eligibility' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">Who Can Apply</h3>
                    </div>
                    <div className="bg-offwhite border border-black/5 p-6 rounded-2xl">
                      {selectedProgram === 'mba' ? (
                        <p className="text-sm font-medium text-muted leading-relaxed">
                          Graduates and professionals interested in real estate, business management, sales, marketing, PropTech, investment, or entrepreneurship can apply, subject to final eligibility rules confirmed by Lotlite.
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-muted leading-relaxed">
                          Students who have completed class twelve and want to build a career in business, marketing, real estate, or entrepreneurship can apply, subject to final eligibility rules confirmed by Lotlite.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeSubmenu === 'admissions' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">Admission Process</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { n: "01", title: "Submit Enquiry" },
                        { n: "02", title: "Speak with Counsellor" },
                        { n: "03", title: "Attend Session" },
                        { n: "04", title: "Complete Documentation" }
                      ].map((step, idx) => (
                        <div key={idx} className="bg-offwhite p-5 rounded-xl border border-black/5 flex gap-4 items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-serif text-lg font-bold shrink-0 ${activeBgColor} text-white`}>
                            {step.n}
                          </div>
                          <h4 className="text-black font-bold text-sm tracking-tight">{step.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
