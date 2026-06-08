import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';

const cases = [
  {
    founder: "Utkarsh Gupta",
    company: "Cosmos Realty",
    problem: "Scale operations across MMR while preserving Cosmos' premium brand identity.",
    tag: "Brand"
  },
  {
    founder: "Anil Goteti",
    company: "Scapia Living",
    problem: "Design strategies to boost Scapia's tenant engagement, strengthen loyalty, and build a distinct, memorable co-living brand.",
    tag: "Growth"
  },
  {
    founder: "Vibha Harish",
    company: "CoSmix Realty",
    problem: "Improve TOFU awareness and increase virality of property listings via organic channels & partnerships.",
    tag: "Growth"
  },
  {
    founder: "Shamika Haldipurkar",
    company: "d'you Spaces",
    problem: "Plan, execute, and launch d'you Spaces' co-working portfolio on quick-commerce platforms.",
    tag: "Sales"
  },
  {
    founder: "Varun Khaitan",
    company: "Urban Property",
    problem: "Improve NPS of the Property Management vertical at Urban Property, which does over ₹80Cr ARR.",
    tag: "Sales"
  },
  {
    founder: "Vivek Sinha",
    company: "Emversity Properties",
    problem: "Identify how Emversity can reduce CAC below 15% by balancing digital marketing efficiency with scalable, low-cost growth channels.",
    tag: "Growth"
  }
];

export default function CaseStudies() {
  const [filter, setFilter] = useState('All');
  const [selectedCase, setSelectedCase] = useState<typeof cases[0] | null>(null);

  const tags = ['All', 'Sales', 'Brand', 'PropTech', 'Growth'];
  const filteredCases = filter === 'All' ? cases : cases.filter(c => c.tag === filter || (filter === 'PropTech' && c.tag.includes('PropTech')));

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden">
      <div className="wine-glow -top-20 -left-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center" data-aos="fade-up">
          <span className="text-wine text-xs font-bold uppercase tracking-widest block mb-4">Learn Directly from Founders</span>
          <h2 className="text-4xl md:text-5xl text-black font-serif mb-12">Solve real real estate problems with 100+ Founders</h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-20 text-left md:text-center">
            {[
              { title: "Case-Based Classrooms", body: "Meeting-style discussions & debates." },
              { title: "Real-World Projects", body: "Live problems through Property Strategy Lab." },
              { title: "Powerful Network Access", body: "Connect with founders, mentors & peers." },
              { title: "Internship Opportunities", body: "Work on real estate problems that matter." }
            ].map((usp, idx) => (
              <div key={idx} className="flex flex-col">
                <p className="text-black font-bold text-lg mb-2">{usp.title}</p>
                <p className="text-muted text-sm font-medium">{usp.body}</p>
              </div>
            ))}
          </div>

          <div className="py-12 border-y border-border mb-16">
            <p className="text-2xl md:text-3xl font-serif text-black italic">"Bharat Mueller | Founder, Mumbai Realty Co."</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 md:px-6 py-2 rounded-full font-bold transition-all text-xs md:text-sm border ${filter === tag ? 'bg-wine text-white border-wine shadow-lg shadow-wine/20' : 'bg-transparent text-muted border-border hover:border-wine/50'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((prof, idx) => (
              <motion.div
                key={prof.founder}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-offwhite border border-wine/10 rounded-2xl cursor-pointer group hover:border-wine/50 transition-all overflow-hidden flex flex-col shadow-sm"
                onClick={() => setSelectedCase(prof)}
              >
                <div className="relative h-48 overflow-hidden">
                   <img 
                    src={`https://images.unsplash.com/photo-${idx % 2 === 0 ? '1460925895917-afdab827c52f' : '1504384308090-c89e1224ad8f'}?auto=format&fit=crop&w=600&q=80`}
                    alt={prof.company}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-linear-to-t from-offwhite via-offwhite/40 to-transparent" />
                   <div className="absolute top-4 right-4">
                      <span className="px-2 py-0.5 bg-wine/10 backdrop-blur-md border border-wine/20 text-[9px] font-bold uppercase text-wine tracking-widest rounded">
                        {prof.tag}
                      </span>
                   </div>
                </div>
                <div className="p-8 bg-transparent">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-wine transition-colors text-black">{prof.founder}</h3>
                  <p className="text-muted text-[10px] font-bold uppercase mb-6 tracking-widest">Founder, {prof.company}</p>
                  <p className="text-black leading-relaxed text-xs opacity-70 line-clamp-3">
                    <strong className="text-wine uppercase text-[9px] tracking-widest block mb-2">The Problem</strong> {prof.problem}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="light-gradient-card border border-border p-8 md:p-20 overflow-hidden relative rounded-3xl" data-aos="fade-up">
           <div className="relative z-20 flex flex-col items-start max-w-3xl">
              <span className="text-wine text-xs font-bold uppercase tracking-[0.3em] mb-6 block">IN-OFFICE PROJECT SPOTLIGHT</span>
              <h3 className="text-4xl md:text-6xl text-black font-serif mb-8">EPIGAMIA REALTY</h3>
              <p className="text-black leading-relaxed text-lg mb-10 font-medium opacity-70">
                As competition heated up in the premium plotted-development space, Epigamia Realty needed to decide whether to double down or pivot its strategy. Lotlite students led market research, 100+ buyer interviews, and on-site tours to uncover insights, then built a 24-month roadmap across brand, product, and growth. Two students from this team later joined Epigamia as Heads of Sales.
              </p>
              <button className="bg-wine text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold border-2 border-transparent hover:bg-transparent hover:text-wine hover:border-wine transition-all shadow-lg shadow-wine/20 text-sm">
                View All Projects
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-offwhite dark:bg-zinc-900 border border-border dark:border-white/10 shadow-2xl w-[calc(100%-2rem)] max-w-sm md:max-w-2xl p-6 md:p-12 relative rounded-3xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-muted hover:text-black dark:hover:text-white transition-colors"
                onClick={() => setSelectedCase(null)}
              >
                <X size={20} />
              </button>
              <span className="inline-block px-3 py-1 bg-wine text-white rounded text-[10px] font-bold uppercase tracking-widest mb-8">
                {selectedCase.tag}
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-2 text-black dark:text-white leading-tight">{selectedCase.founder}</h3>
              <p className="text-wine text-sm font-bold uppercase tracking-widest mb-8">Founder, {selectedCase.company}</p>
              <div className="space-y-6 text-black dark:text-neutral-200 leading-relaxed text-base md:text-lg font-medium opacity-80">
                <p><strong className="text-wine">The Challenge:</strong></p>
                <p>{selectedCase.problem}</p>
                <p className="text-sm border-t border-border dark:border-white/10 pt-6">Learn how Lotlite students tackled this real-world problem during the intensive industry practicum module.</p>
              </div>
              <button className="mt-10 md:mt-12 bg-wine text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold flex items-center gap-2 border-2 border-transparent hover:bg-transparent hover:text-wine hover:border-wine transition-all text-xs md:text-sm">
                Read Full Paper <ExternalLink size={14} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
