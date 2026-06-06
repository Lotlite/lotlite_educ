import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function IncubatorStories() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden scroll-mt-20" id="incubation">
      <div className="green-glow -top-20 -left-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center" data-aos="fade-up">
          <span className="text-bottle-green text-xs font-bold uppercase tracking-widest block mb-4">#FromTheFiles</span>
          <h2 className="text-4xl md:text-5xl text-black">Students who built real companies, inside Lotlite</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12" data-aos="fade-up">
          <button 
            onClick={() => setActiveTab(1)}
            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all text-xs md:text-sm border ${activeTab === 1 ? 'bg-bottle-green text-white border-bottle-green shadow-lg shadow-bottle-green/20' : 'bg-transparent text-muted border-border hover:border-bottle-green/50'}`}
          >
            Vihaan Realty
          </button>
          <button 
            onClick={() => setActiveTab(2)}
            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all text-xs md:text-sm border ${activeTab === 2 ? 'bg-bottle-green text-white border-bottle-green shadow-lg shadow-bottle-green/20' : 'bg-transparent text-muted border-border hover:border-bottle-green/50'}`}
          >
            Aura Insights
          </button>
        </div>

        <div className="relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 1 ? (
              <motion.div
                key="tab1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-black/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="bg-bottle-green text-white text-[10px] font-bold px-3 py-1 rounded block mb-4 w-fit uppercase tracking-widest">PROPERTY EXPO MUMBAI</span>
                    <h3 className="text-4xl text-white font-serif mb-2">Vihaan Realty</h3>
                    <p className="text-white/80">Founded by Lakshay Soni</p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap gap-4 mb-8">
                    <span className="bg-bottle-green/5 px-4 py-2 text-bottle-green font-bold text-sm rounded-lg border border-bottle-green/10">₹6L+ Monthly Revenue</span>
                    <span className="bg-offwhite px-4 py-2 text-black font-bold text-sm rounded-lg border border-border">Hero project piloted & scaled at Lotlite</span>
                  </div>
                  <p className="text-muted text-[10px] font-bold tracking-widest uppercase mb-4">THE STORY</p>
                  <p className="text-black leading-relaxed text-lg mb-8 opacity-70">
                    Vihaan Realty's core offering — mid-segment plotted developments — accounts for 70% of revenue. It was piloted, launched, and scaled entirely inside Lotlite's Build Sprint, BREB. Lakshay arrived with an idea. His first real public test was Lotlite's pitch showdown — he won it through open voting, triggering structured sprint support. 
                    <br/><br/>
                    Within days of BREB kickoff on 2 July 2024, he defined a new mid-income plotted concept. Over 10 weeks: 500+ leads and ₹2.5L in revenue.
                  </p>
                  <div className="light-gradient-card p-8 border-l-4 border-l-bottle-green border-bottle-green/10 shadow-sm">
                    <p className="text-bottle-green italic font-serif text-xl mb-4 leading-relaxed">
                      "I used Lotlite's ecosystem deliberately. The VC class with Mohit Bhasin gave me term-sheet literacy. GTM with Prof. Ray Titus shaped how we think about packaging. We closed ₹6L in October. Goal: make Vihaan the default name in mid-income plotted real estate."
                    </p>
                    <p className="text-black font-bold text-sm text-right">— Lakshay Soni, Cohort 2</p>
                  </div>
                </div>
              </motion.div>
            ) : (
                <motion.div
                key="tab2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-black/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bbbda5366991?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="bg-bottle-green text-white text-[10px] font-bold px-3 py-1 rounded block mb-4 w-fit uppercase tracking-widest">PROPTECH INNOVATION</span>
                    <h3 className="text-4xl text-white font-serif mb-2">Aura Insights</h3>
                    <p className="text-white/80">Founded by Neha Gupta</p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap gap-4 mb-8">
                    <span className="bg-bottle-green/5 px-4 py-2 text-bottle-green font-bold text-sm rounded-lg border border-bottle-green/10">100+ Paying Customers</span>
                    <span className="bg-offwhite px-4 py-2 text-black font-bold text-sm rounded-lg border border-border">Launched via Lotlite Incubator</span>
                  </div>
                  <p className="text-muted text-[10px] font-bold tracking-widest uppercase mb-4">THE STORY</p>
                  <p className="text-black leading-relaxed text-lg mb-8 opacity-70">
                    Aura Insights uses AI to predict property valuation trends in micro-markets — giving retail investors the data intelligence that institutional funds have kept to themselves. 
                    <br/><br/>
                    Neha's hypothesis came from the AI & PropTech focus term. She identified a 15% pricing gap agents were consistently missing. She built the MVP with no-code tools from Term 1 and launched on Product Hunt. Within 3 weeks: 100 paying subscribers.
                  </p>
                  <div className="light-gradient-card p-8 border-l-4 border-l-bottle-green border-bottle-green/10 shadow-sm">
                    <p className="text-bottle-green italic font-serif text-xl mb-4 leading-relaxed">
                      "Lotlite's PropTech curriculum taught me to use technology to solve real estate problems. Mentorship from unicorn founders sharpened my positioning. The incubator's ₹10L grant covered our API costs and early marketing — the kind of support that lets you move fast."
                    </p>
                    <p className="text-black font-bold text-sm text-right">— Neha Gupta, Cohort 3</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
