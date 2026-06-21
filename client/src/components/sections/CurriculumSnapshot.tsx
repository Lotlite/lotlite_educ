import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, BookOpen } from 'lucide-react';

const mbaCurriculum = [
  {
    term: "Semester 1",
    title: "Business Foundation and Real Estate Basics",
    desc: [
      "Business Statistics", "Marketing Management", "Financial Accounting",
      "Operations Management", "Legal Aspects of Business", "Human Resource Management",
      "Research Methodology", "Microeconomics", "Technology in Business",
      "Data Driven Decision Making", "REIT", "RERA", "SEZ", "FDI",
      "Construction Engineering Basics", "Architecture Engineering Basics",
      "Government Approvals", "Township Planning", "Real Estate Investment",
      "Real Estate Centric Technology", "ERP"
    ]
  },
  {
    term: "Semester 2",
    title: "Business Systems and Digital Growth",
    desc: [
      "Organizational Behaviour", "Operations Research", "Financial Management",
      "Project Management", "Business Communication", "Consumer Behaviour and Insights",
      "Digital Marketing", "Design Thinking and Innovation Management",
      "Management Information Systems", "CRM", "Automation"
    ]
  },
  {
    term: "Semester 3",
    title: "Strategy and Real Estate Marketing",
    desc: [
      "Project I", "Corporate Governance and Ethics", "Crisis Management in Business",
      "Strategic Management", "AI and ML for Business Management",
      "Real Estate Brand Management and Corporate Identity",
      "Integrated Marketing Communication for Real Estate",
      "Architectural Photography, Video Editing and Visual Storytelling",
      "Commercial and Residential Property Marketing Strategies"
    ]
  },
  {
    term: "Semester 4",
    title: "PropTech, Sales Channels and Launch Strategy",
    desc: [
      "Project II", "Entrepreneurship", "Global Business Environment",
      "Conflict and Negotiation", "Doing Business in India",
      "Business Transformation and Organizational Turnaround",
      "Marketing Analytics and PropTech", "Real Estate Broker and Channel Management",
      "Real Estate CRM and Lead Nurturing", "New Property Launch and Campaign Management"
    ]
  }
];

const bbaCurriculum = [
  {
    term: "Semester 1",
    title: "Foundation and Basics",
    desc: [
      "Principles of Management", "Business Communication", "Microeconomics",
      "Financial Accounting", "Business Mathematics"
    ]
  },
  {
    term: "Semester 2",
    title: "Organizational Dynamics",
    desc: [
      "Organizational Behavior", "Macroeconomics", "Cost and Management Accounting",
      "Business Statistics", "Environmental Studies"
    ]
  },
  {
    term: "Semester 3",
    title: "Core Business Functions",
    desc: [
      "Marketing Management", "Human Resource Management", "Financial Management",
      "Business Law", "Management Information Systems"
    ]
  },
  {
    term: "Semester 4",
    title: "Advanced Operations and Research",
    desc: [
      "Operations Research", "Business Research Methods", "Taxation",
      "International Business", "Entrepreneurship Development"
    ]
  },
  {
    term: "Semester 5",
    title: "Strategy and Specialisation",
    desc: [
      "Corporate Internship or Summer Project", "Services Marketing",
      "Fundamentals of Brand Management", "Sales and Distribution Management",
      "Open choice subjects in HR, Finance, or Business Analytics"
    ]
  },
  {
    term: "Semester 6",
    title: "Capstone and Application",
    desc: [
      "Analytics Foundations", "Corporate Governance and Ethics", "Marketing Analytics",
      "Retail Marketing", "Marketing Communication covering Advertising, PR and Events",
      "Final Research Project or Dissertation"
    ]
  }
];

export default function CurriculumSnapshot() {
  const [activeTab, setActiveTab] = useState<'mba' | 'bba'>('mba');
  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({});

  const activeData = activeTab === 'mba' ? mbaCurriculum : bbaCurriculum;

  const toggleExpand = (term: string) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [term]: !prev[term]
    }));
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="curriculum">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Academic Structure</span>
          <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-6">
            Curriculum Snapshot
          </h2>
          <p className="text-muted text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            Explore the semester-by-semester breakdown of our career-focused Programs.
          </p>
        </div>

        <div className="flex justify-center border-b border-black/10 mb-12 max-w-lg mx-auto" data-aos="fade-up">
          <button
            onClick={() => setActiveTab('mba')}
            className={`flex-1 pb-4 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all text-center ${activeTab === 'mba' ? 'border-wine text-wine' : 'border-transparent text-muted hover:text-black'
              }`}
          >
            MBA Curriculum
          </button>
          <button
            onClick={() => setActiveTab('bba')}
            className={`flex-1 pb-4 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all text-center ${activeTab === 'bba' ? 'border-bottle-green text-bottle-green' : 'border-transparent text-muted hover:text-black'
              }`}
          >
            BBA Curriculum
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {activeData.map((sem, idx) => {
              const isExpanded = !!expandedSemesters[sem.term];

              return (
                <div
                  key={idx}
                  className="bg-offwhite border border-black/5 rounded-2xl shadow-sm overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  {/* Header (Clickable Toggle) */}
                  <button
                    onClick={() => toggleExpand(sem.term)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-black/[0.02] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'mba' ? 'bg-wine/10 text-wine' : 'bg-bottle-green/10 text-bottle-green'}`}>
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className={`font-bold text-[10px] uppercase tracking-widest mb-1 ${activeTab === 'mba' ? 'text-wine' : 'text-bottle-green'}`}>
                          {sem.term}
                        </p>
                        <h4 className="text-lg md:text-xl font-bold text-black">{sem.title}</h4>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full border border-black/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-black/5' : ''}`}>
                      <ChevronDown size={18} className="text-muted" />
                    </div>
                  </button>

                  {/* Expandable Content Area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-black/5">
                          <ul className="space-y-2 pl-4 list-disc marker:text-muted">
                            {sem.desc.map((subject, subIdx) => (
                              <li
                                key={subIdx}
                                className="text-xs md:text-sm text-muted font-medium leading-relaxed"
                              >
                                {subject}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
