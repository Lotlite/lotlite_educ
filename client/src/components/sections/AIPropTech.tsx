import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, Terminal, Box } from 'lucide-react';

export default function AIPropTech() {
  const [activeTab, setActiveTab] = useState(1);

  const tools = [
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

  return (
    <section className="pt-16 pb-12 md:pt-24 md:pb-8 bg-transparent relative overflow-hidden scroll-mt-20" id="pg-program">
      <div className="wine-glow -bottom-20 -right-20 w-[400px] h-[400px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center" data-aos="fade-up">
          <span className="text-bottle-green text-xs font-bold uppercase tracking-widest block mb-4">AI & PropTech Focus</span>
          <h2 className="text-4xl md:text-5xl text-black mb-6">Build real PropTech products, launch on Product Hunt and get 100 paying customers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: <Zap size={20} />, text: "150 Hours AI Curriculum — from no-code to fine-tuning" },
            { icon: <CheckCircle2 size={20} />, text: "25+ AI Tools — that you will gain expertise in" },
            { icon: <Terminal size={20} />, text: "Build Automation Agents — automating brokerage workflows" },
            { icon: <Box size={20} />, text: "Product Building — from idea to paying customers" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-offwhite border border-bottle-green/10 p-6 rounded-2xl flex flex-col gap-4 text-black shadow-sm hover:border-bottle-green/30 transition-all" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="text-bottle-green">{stat.icon}</div>
              <p className="text-xs font-medium leading-relaxed">{stat.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-offwhite/50 p-4 rounded-full flex justify-center gap-2 mb-12 max-w-2xl mx-auto" data-aos="fade-up">
          {["Curriculum", "Tools", "Launches"].map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx + 1)}
              className={`flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm transition-all ${activeTab === idx + 1 ? 'bg-bottle-green text-white shadow-lg' : 'text-muted hover:bg-offwhite'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 1 && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid md:grid-cols-4 gap-8"
              >
                {[
                  { term: "Term 1", title: "The AI Stack", desc: "Mastering LLMs, prompt engineering, and visual AI." },
                  { term: "Term 2", title: "No-Code Build", desc: "Shipping your first MVP using Zapier, Bubble, and Softr." },
                  { term: "Term 3", title: "PropTech Logic", desc: "Integrating real estate data streams into custom apps." },
                  { term: "Term 4", title: "The Launchpad", desc: "Monetizing your product and building a distribution engine." }
                ].map((term, idx) => (
                  <div key={idx} className="relative pl-8 border-l border-border">
                    <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-bottle-green shadow-[0_0_10px_rgba(27,140,104,0.3)]" />
                    <p className="text-bottle-green font-bold text-xs uppercase tracking-widest mb-2">{term.term}</p>
                    <h3 className="text-xl text-black font-bold mb-2">{term.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{term.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              >
                {tools.map((tool, idx) => (
                  <div key={idx} className="bg-offwhite border border-bottle-green/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-bottle-green/5 hover:border-bottle-green/30 transition-colors shadow-sm">
                    <p className="text-bottle-green font-bold text-lg mb-1">{tool.name}</p>
                    <p className="text-muted text-[10px] uppercase font-bold tracking-widest opacity-50">{tool.cat}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="launches"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid md:grid-cols-3 gap-8"
              >
                {[
                  { name: "Aura Insights", cat: "Analytics", rev: "₹2.5L Revenue" },
                  { name: "BrokerBot API", cat: "Automation", rev: "50+ Firms" },
                  { name: "PlotWise", cat: "Mapping", rev: "100+ Customers" }
                ].map((prod, idx) => (
                  <div key={idx} className="light-gradient-card border border-bottle-green/10 p-8 flex flex-col items-start hover:border-bottle-green/30 transition-all">
                    <div className="w-12 h-12 bg-bottle-green/5 rounded-xl flex items-center justify-center text-bottle-green font-bold text-xl mb-6">
                      {prod.name[0]}
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-1">{prod.name}</h3>
                    <p className="text-bottle-green text-xs font-bold uppercase tracking-widest mb-6">{prod.cat}</p>
                    <span className="px-3 py-1 bg-bottle-green/10 text-bottle-green rounded-full text-xs font-bold">
                      {prod.rev}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
