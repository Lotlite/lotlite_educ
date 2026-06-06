import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  Cpu, 
  Rocket, 
  HandCoins, 
  Target, 
  ChevronRight, 
  Zap, 
  Terminal, 
  Box, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  HelpCircle, 
  DollarSign, 
  Award,
  BookOpen,
  ClipboardList
} from 'lucide-react';

export default function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<'ug' | 'pg'>('ug');
  const [activeSubmenu, setActiveSubmenu] = useState<'overview' | 'highlights' | 'structure' | 'eligibility' | 'admissions' | 'fees' | 'outcomes'>('overview');

  // UG Program text & features (from ProgramDetails.tsx)
  const ugOverview = {
    title: "B.REM in Real Estate Management & Investment",
    slug: "Bachelor of Real Estate Management (B.REM)",
    description: "Our core 4-year premier undergraduate degree program. Taught by industry practitioners and Ivy League faculty, designed to accelerate your career to real estate heights.",
    tags: ["4 Years", "Full-Time, Residential", "Aug 2026", "Bengaluru"],
    feesInfo: "Secure Submission backed by Lotlite Group. Scholarships & financial assistance options are available up to 50% based on merit & cognitive rounds. Reach out to admissions for detailed fee breakdown."
  };

  const ugFeatures = [
    {
      icon: <Sparkles className="text-wine animate-pulse" size={20} />,
      title: "New-age academics",
      body: "Study valuation, PropTech, urban finance, and AI-powered deal-making — taught by RICS-certified faculty, unicorn founders, and professors from IIM, Kellogg, and MIT."
    },
    {
      icon: <Users className="text-wine" size={20} />,
      title: "Learn directly from founders",
      body: "100+ real estate founders teach on campus across four years. Not panels. Not lectures. They walk you through their real deals, their real mistakes, and give you real access."
    },
    {
      icon: <Cpu className="text-wine" size={20} />,
      title: "AI & PropTech focus",
      body: "Build 3 live PropTech products, master 25+ tools, and get 100 paying customers within weeks of launch. You learn by shipping — not by studying case studies about companies that shipped."
    },
    {
      icon: <HandCoins className="text-wine" size={20} />,
      title: "In-house incubator",
      body: "Access a ₹5Cr startup fund, mentorship from 100+ founders, and pitch sessions with 50+ VCs. If your idea has legs, Lotlite helps you run with it while you're still a student."
    },
    {
      icon: <Target className="text-wine" size={20} />,
      title: "Learn sales by doing sales",
      body: "Close ₹1L in property sales in your first four weeks — telecalling, door-to-door, flea booths, site visits. No classroom exercise. Actual buyers, actual commission, actual experience."
    },
    {
      icon: <Rocket className="text-wine" size={20} />,
      title: "Structured career prep",
      body: "250+ hours of career preparation built around your ambitions, not a one-size curriculum. Result: graduates average 9L+ CTC, with top 25% crossing 14L."
    }
  ];

  // PG Program text & features (from AIPropTech.tsx)
  const pgOverview = {
    title: "AI & PropTech Focus Specialization",
    slug: "Advanced PG Program (AI & PropTech)",
    description: "Build real PropTech products, launch on Product Hunt, and get 100 paying customers. Designed for professionals and students seeking absolute AI competency in property markets.",
    tags: ["1 Year", "Advanced Specialized", "Hybrid Track", "Bengaluru & Online"],
    feesInfo: "Corporate sponsorships and educational grants available. Installment plans are offered to corporate cohorts and founders."
  };

  const pgStats = [
    { icon: <Zap size={20} className="text-bottle-green" />, text: "150 Hours AI Curriculum — from no-code to fine-tuning" },
    { icon: <CheckCircle2 size={20} className="text-bottle-green" />, text: "25+ AI Tools — that you will gain expertise in" },
    { icon: <Terminal size={20} className="text-bottle-green" />, text: "Build Automation Agents — automating brokerage workflows" },
    { icon: <Box size={20} className="text-bottle-green" />, text: "Product Building — from idea to paying customers" }
  ];

  const pgCurriculum = [
    { term: "Term 1", title: "The AI Stack", desc: "Mastering LLMs, prompt engineering, and visual AI." },
    { term: "Term 2", title: "No-Code Build", desc: "Shipping your first MVP using Zapier, Bubble, and Softr." },
    { term: "Term 3", title: "PropTech Logic", desc: "Integrating real estate data streams into custom apps." },
    { term: "Term 4", title: "The Launchpad", desc: "Monetizing your product and building a distribution engine." }
  ];

  const pgTools = [
    { name: "ChatGPT", cat: "LLMs" },
    { name: "Midjourney", cat: "Design" },
    { name: "Zapier", cat: "Automation" },
    { name: "Make", cat: "Automation" },
    { name: "Notion AI", cat: "Productivity" },
    { name: "Hubspot CRM", cat: "Sales" },
    { name: "PropTech APIs", cat: "Data" },
    { name: "Python Basics", cat: "Dev" },
    { name: "No-Code builders", cat: "Web" }
  ];

  const pgLaunches = [
    { name: "Aura Insights", cat: "Analytics", rev: "₹2.5L Revenue" },
    { name: "BrokerBot API", cat: "Automation", rev: "50+ Firms" },
    { name: "PlotWise", cat: "Mapping", rev: "100+ Customers" }
  ];

  // Shared Submenu definitions
  const submenuItems = [
    { id: 'overview', name: 'Programme Overview', icon: <BookOpen size={16} /> },
    { id: 'highlights', name: 'Program Highlights', icon: <Sparkles size={16} /> },
    { id: 'structure', name: 'Program Structure', icon: <ClipboardList size={16} /> },
    { id: 'eligibility', name: 'Eligibility Criteria & Intake', icon: <Award size={16} /> },
    { id: 'admissions', name: 'Admission Process', icon: <Clock size={16} /> },
    { id: 'fees', name: 'Fee Structure', icon: <DollarSign size={16} /> },
    { id: 'outcomes', name: 'Programme Outcomes', icon: <Rocket size={16} /> }
  ] as const;

  const activeThemeColor = selectedProgram === 'ug' ? 'text-wine' : 'text-bottle-green';
  const activeBgColor = selectedProgram === 'ug' ? 'bg-wine' : 'bg-bottle-green';
  const activeBorderColor = selectedProgram === 'ug' ? 'border-wine/30' : 'border-bottle-green/30';
  const activeGlow = selectedProgram === 'ug' ? 'wine-glow' : 'green-glow';

  return (
    <section className="py-20 md:py-28 bg-transparent relative overflow-hidden scroll-mt-20" id="programs">
      <div className={`absolute top-10 left-10 w-[500px] h-[500px] blur-[150px] opacity-[0.05] pointer-events-none ${activeGlow}`} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-14 text-center md:text-left" data-aos="fade-up">
          <span className="text-muted text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Symbiosis Statistical Institute Design</span>
          <h2 className="text-4xl md:text-5xl text-black font-serif leading-tight">
            Academic Programs Hub
          </h2>
          <p className="text-muted text-sm mt-3 max-w-2xl font-medium">
            Explore our state-of-the-art educational structures built around real mastery, real-world relevance, and AI technologies.
          </p>
        </div>

        {/* Top Program Selector Tab */}
        <div className="flex border-b border-black/10 mb-12 max-w-2xl" data-aos="fade-up">
          <button
            onClick={() => {
              setSelectedProgram('ug');
              setActiveSubmenu('overview');
            }}
            className={`flex-1 pb-4 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all text-center ${
              selectedProgram === 'ug' 
                ? 'border-wine text-wine' 
                : 'border-transparent text-muted hover:text-black'
            }`}
          >
            Undergraduate (B.REM Program)
          </button>
          <button
            onClick={() => {
              setSelectedProgram('pg');
              setActiveSubmenu('overview');
            }}
            className={`flex-1 pb-4 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all text-center ${
              selectedProgram === 'pg' 
                ? 'border-bottle-green text-bottle-green' 
                : 'border-transparent text-muted hover:text-black'
            }`}
          >
            Postgraduate / Specialization (AI & PropTech)
          </button>
        </div>

        {/* Main Content Layout with Left Sticky Submenu Sidebar and Right Content Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Submenu Navigation Pane (Responsive Sidebar) */}
          <div className="lg:col-span-4 bg-offwhite border border-black/5 rounded-2xl p-5 md:p-6 lg:sticky lg:top-24 shadow-sm" data-aos="fade-right">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted mb-4 px-3">
              Programme Menu
            </p>
            <div className="flex flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
              <div className="flex lg:flex-col gap-1 min-w-[max-content] lg:min-w-0">
                {submenuItems.map((item) => {
                  const isCurActive = activeSubmenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubmenu(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal w-full ${
                        isCurActive
                          ? `${activeBgColor} text-white shadow-md shadow-black/5`
                          : 'text-muted hover:bg-black/5'
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

          {/* Right Submenu Target Content Pane with AnimatePresence for replacing content */}
          <div className="lg:col-span-8 min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedProgram}-${activeSubmenu}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="bg-transparent"
              >
                
                {/* 1. OVERVIEW VIEW */}
                {activeSubmenu === 'overview' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.4em] block mb-2 ${activeThemeColor}`}>
                        {selectedProgram === 'ug' ? ugOverview.slug : pgOverview.slug}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-serif text-black leading-tight">
                        {selectedProgram === 'ug' ? ugOverview.title : pgOverview.title}
                      </h3>
                    </div>

                    <p className="text-muted text-base leading-relaxed font-medium">
                      {selectedProgram === 'ug' ? ugOverview.description : pgOverview.description}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-4">
                      {(selectedProgram === 'ug' ? ugOverview.tags : pgOverview.tags).map((tag) => (
                        <span key={tag} className="px-5 py-2.5 rounded-xl bg-offwhite text-muted font-bold text-[10px] uppercase tracking-widest border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {selectedProgram === 'ug' && (
                      <div className="bg-wine/5 border border-wine/10 p-6 rounded-2xl flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-wine/10 flex items-center justify-center text-wine font-bold text-lg shrink-0">
                          🎓
                        </div>
                        <div>
                          <h4 className="text-black font-bold text-sm tracking-tight mb-1">Lotlite Real Estate Fellowship</h4>
                          <p className="text-muted text-xs leading-relaxed font-medium">
                            Includes rigorous case pedagogy, incubation support, and mandatory leadership development activities built from actual real estate brokerage projects.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. HIGHLIGHTS VIEW */}
                {activeSubmenu === 'highlights' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">
                        {selectedProgram === 'ug' ? "B.REM Programme Highlights" : "AI & PropTech Specialization Highlights"}
                      </h3>
                    </div>

                    {selectedProgram === 'ug' ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {ugFeatures.map((feat, idx) => (
                          <div key={idx} className="bg-offwhite border border-wine/10 rounded-2xl p-6 hover:border-wine/30 transition-all shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-wine/5 flex items-center justify-center text-wine mb-4 shrink-0">
                              {feat.icon}
                            </div>
                            <h4 className="text-lg font-bold text-black mb-2 tracking-tight">{feat.title}</h4>
                            <p className="text-muted text-xs leading-relaxed font-medium">{feat.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {pgStats.map((stat, idx) => (
                          <div key={idx} className="bg-offwhite border border-bottle-green/10 p-6 rounded-2xl flex flex-col gap-4 text-black shadow-sm hover:border-bottle-green/35 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-bottle-green/5 flex items-center justify-center text-bottle-green">
                              {stat.icon}
                            </div>
                            <p className="text-xs font-semibold leading-relaxed text-black/80">{stat.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PROGRAM STRUCTURE VIEW */}
                {activeSubmenu === 'structure' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">
                        {selectedProgram === 'ug' ? "Undergraduate Learning Track" : "AI & Proptech Term Structure"}
                      </h3>
                    </div>

                    {selectedProgram === 'ug' ? (
                      <div className="space-y-6">
                        {[
                          { term: "Academic Years 1 & 2", title: "Real Estate Core Foundations", desc: "Covers valuation, brokerage execution, urban land design, and financial modeling." },
                          { term: "Academic Year 3", title: "Specialization & Incubation", desc: "Select majors in Real Estate Investment or Management & launch first MVP in the incubator." },
                          { term: "Academic Year 4", title: "Corporate Practicum", desc: "Advanced case study analysis and full-time professional training placement at global real estate firms." }
                        ].map((year, idx) => (
                          <div key={idx} className="relative pl-8 border-l border-wine/20 pb-4">
                            <div className="absolute top-1 -left-1.5 w-3 h-3 rounded-full bg-wine shadow-md" />
                            <p className="text-wine font-bold text-[10px] uppercase tracking-widest mb-1">{year.term}</p>
                            <h4 className="text-lg font-bold text-black mb-1">{year.title}</h4>
                            <p className="text-muted text-xs leading-relaxed font-medium">{year.desc}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-10">
                        {/* Term-by-Term structure */}
                        <div className="grid md:grid-cols-2 gap-6">
                          {pgCurriculum.map((term, idx) => (
                            <div key={idx} className="relative pl-6 border-l border-bottle-green/20">
                              <div className="absolute top-1 -left-1 w-2 h-2 rounded-full bg-bottle-green" />
                              <p className="text-bottle-green font-bold text-[9px] uppercase tracking-widest mb-1">{term.term}</p>
                              <h4 className="text-base font-bold text-black mb-1">{term.title}</h4>
                              <p className="text-muted text-xs font-medium leading-relaxed">{term.desc}</p>
                            </div>
                          ))}
                        </div>

                        {/* Tools Subtopic inside Structure */}
                        <div className="pt-6 border-t border-black/5">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Hands-on Software Stack</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {pgTools.map((tool, idx) => (
                              <div key={idx} className="bg-offwhite border border-bottle-green/10 p-3 rounded-xl flex items-center justify-between">
                                <span className="text-bottle-green font-bold text-xs">{tool.name}</span>
                                <span className="text-black/30 text-[8px] font-bold uppercase uppercase tracking-wider">{tool.cat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Launches Subtopic inside Structure */}
                        <div className="pt-6 border-t border-black/5">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Incubated MVP Releases</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            {pgLaunches.map((item, idx) => (
                              <div key={idx} className="bg-bottle-green/5 border border-bottle-green/10 p-5 rounded-2xl">
                                <h5 className="font-bold text-black text-sm mb-1">{item.name}</h5>
                                <p className="text-bottle-green text-[9px] font-bold uppercase tracking-widest mb-3">{item.cat}</p>
                                <span className="px-2 py-0.5 bg-bottle-green/10 text-bottle-green rounded-full text-[9px] font-bold">
                                  {item.rev}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. ELIGIBILITY & INTAKE VIEW */}
                {activeSubmenu === 'eligibility' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">
                        Eligibility Criteria & Batch Intake
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-offwhite border border-black/5 p-6 rounded-2xl">
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${activeThemeColor}`}>
                          Minimum Requirements
                        </span>
                        {selectedProgram === 'ug' ? (
                          <ul className="space-y-3 font-medium text-xs text-muted list-disc pl-4">
                            <li>Successful completion of 10+2 (CBSE, ICSE, State Boards, or IB)</li>
                            <li>Minimum 50% aggregate score in high school</li>
                            <li>Critical thinking and analytical competencies evaluated in aptitude rounds</li>
                            <li>No coding pre-requisites required; business development index prioritized</li>
                          </ul>
                        ) : (
                          <ul className="space-y-3 font-medium text-xs text-muted list-disc pl-4">
                            <li>Undergraduate graduation in any discipline (B.E., BCA, B.Sc., BBA, or equivalent)</li>
                            <li>Core interest in developing automated agent flows and PropTech services</li>
                            <li>Familiarity with basic business operations is preferred</li>
                          </ul>
                        )}
                      </div>

                      <div className="light-gradient-card border border-black/5 p-6 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-muted">
                            Intake Size
                          </span>
                          <h4 className={`text-4xl font-serif mb-2 font-bold ${activeThemeColor}`}>40 Seats</h4>
                          <p className="text-muted text-xs leading-relaxed font-medium">
                            Extremely exclusive cohort selected via 2 levels of founder screening rounds. This ensures absolute peer quality and maximized placement support.
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-black text-[10px] font-bold uppercase tracking-widest">
                          <Calendar size={14} className={activeThemeColor} /> Cohort Starts Aug 2026
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ADMISSION PROCESS VIEW */}
                {activeSubmenu === 'admissions' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">
                        Admission Selection Timeline
                      </h3>
                    </div>

                    <p className="text-muted text-sm font-medium">
                      Follow our structured 4-step admission sequence designed to measure passion, capabilities, and innovative mindset:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { n: "01", title: "Apply Online", sub: "Digital Submission (5 min)" },
                        { n: "02", title: "Aptitude Test", sub: "Cognitive Assessment (30 min)" },
                        { n: "03", title: "Panel Interview", sub: "Founders' Round" },
                        { n: "04", title: "Final Offer", sub: "Enrollment Ceremony" }
                      ].map((step, idx) => (
                        <div key={idx} className="bg-offwhite/80 p-5 rounded-xl border border-black/5 flex gap-4 items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-serif text-lg font-bold shrink-0 ${activeBgColor} text-white`}>
                            {step.n}
                          </div>
                          <div>
                            <h4 className="text-black font-bold text-sm tracking-tight">{step.title}</h4>
                            <p className="text-muted text-[9px] font-bold uppercase tracking-widest">{step.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <a href="#apply" className={`inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeBgColor} hover:opacity-90`}>
                      Launch Application Form →
                    </a>
                  </div>
                )}

                {/* 6. FEE STRUCTURE VIEW */}
                {activeSubmenu === 'fees' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h3 className="text-2xl font-serif text-black">
                        Financial Investment & Grants
                      </h3>
                    </div>

                    <p className="text-muted text-sm font-medium">
                      {selectedProgram === 'ug' ? ugOverview.feesInfo : pgOverview.feesInfo}
                    </p>

                    <div className="bg-offwhite border border-black/5 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/5 text-black border-b border-black/5 text-[9px] uppercase tracking-widest font-bold">
                            <th className="p-4">Fee Component</th>
                            <th className="p-4 text-right">Academic Base Contribution</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-muted font-medium">
                          <tr className="border-b border-black/5">
                            <td className="p-4 font-semibold text-black">Admission Application Processing</td>
                            <td className="p-4 text-right">Complimentary</td>
                          </tr>
                          <tr className="border-b border-black/5">
                            <td className="p-4 font-semibold text-black">Tuition and Academic Resources</td>
                            <td className="p-4 text-right">Based on cohort profile</td>
                          </tr>
                          <tr className="border-b border-black/5">
                            <td className="p-4 font-semibold text-black">Startup Incubator & API Allocations</td>
                            <td className="p-4 text-right">Fully Sponsored</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-semibold text-black">Hostel/Residential (Optional)</td>
                            <td className="p-4 text-right">Standard campus charge</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-5 border border-dashed border-black/10 rounded-2xl text-[11px] font-medium text-muted leading-relaxed">
                      💡 <strong>Flexible Scholarship Rule:</strong> Candidates who achieve top-decile ranks in our proprietary analytical challenge rounds will received full or partial tuition fellowships of up to ₹2.5L.
                    </div>
                  </div>
                )}

                {/* 7. PROGRAMME OUTCOMES VIEW */}
                {activeSubmenu === 'outcomes' && (
                  <div className="space-y-8">
                    <div className="border-b border-black/5 pb-6">
                      <h4 className={`text-[10px] font-bold uppercase tracking-[0.3em] block mb-2 ${activeThemeColor}`}>
                        Our Proven Track Records
                      </h4>
                      <h3 className="text-2xl md:text-3xl font-serif text-black leading-tight">
                        9L+ Average CTC & Absolute Placements Support
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-offwhite rounded-2xl border border-black/5 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Our Metrics</p>
                          <ul className="space-y-3 font-medium text-xs text-muted">
                            <li>• <strong>₹9,00,000+</strong> Average Annual Compensation Packages</li>
                            <li>• <strong>₹14,00,000+</strong> Top 25% Compensation Track</li>
                            <li>• <strong>250+ Hours</strong> custom career preparation</li>
                            <li>• Direct placement channels in top global realty giants</li>
                          </ul>
                        </div>
                        <a href="#outcomes" className={`mt-6 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1 hover:underline ${activeThemeColor}`}>
                          View Alumni Stories <ChevronRight size={12} />
                        </a>
                      </div>

                      <div className="p-6 bg-white border border-black/5 group hover:border-wine/20 rounded-2xl flex items-start gap-4 shadow-sm">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-inner shrink-0 ${activeBgColor} text-white`}>
                          AA
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-black mb-0.5">Ankit Agrawal</h4>
                          <p className="text-wine text-[9px] font-bold uppercase tracking-widest opacity-80 mb-3">Head of Placements</p>
                          <div className="flex flex-wrap gap-1">
                            {['CBRE', 'Lodha', 'JLL'].map(comp => (
                              <span key={comp} className="px-2 py-0.5 bg-offwhite border border-black/5 rounded text-[8px] font-bold uppercase text-muted tracking-widest">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
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
