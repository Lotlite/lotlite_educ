import { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../AppContext';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { faqs, faqsLoading: loading, fetchFaqs } = useApp();

  useEffect(() => {
    fetchFaqs('general');
  }, []);

  // Filter the FAQs to ensure ONLY 'general' categorized questions are displayed here
  const generalFaqs = faqs.filter(f => f.category === 'general');

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden">
      <div className="green-glow -bottom-20 -right-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
           <h2 className="text-4xl md:text-5xl font-serif text-black">Everything you need to know</h2>
           <p className="text-sm font-mono mt-3 text-wine dark:text-wine-light uppercase tracking-wider">Dynamic answers from our Academic Board</p>
        </div>

        {loading && generalFaqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-wine" size={40} />
            <p className="text-black/60 dark:text-zinc-400 font-mono text-sm leading-relaxed">Retrieving latest admissions ledger FAQs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {generalFaqs.map((faq, idx) => (
              <div 
                key={faq.id || idx}
                className="bg-[#FAFAFA] dark:bg-zinc-900/40 border border-border dark:border-white/10 rounded-2xl overflow-hidden hover:border-wine/30 dark:hover:border-wine/30 transition-colors shadow-sm"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-bold text-black group-hover:text-wine dark:group-hover:text-wine transition-colors">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    className="text-wine shrink-0"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-8 pb-8 text-black/60 dark:text-zinc-300 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
