import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    q: "What is Lotlite Edu?",
    a: "Lotlite Edu is a real estate and PropTech focused education initiative designed to prepare students for careers in property, business, sales, marketing, investment, CRM, and entrepreneurship."
  },
  {
    q: "Who can apply for the MBA pathway?",
    a: "Graduates and professionals interested in real estate, business management, sales, marketing, PropTech, investment, or entrepreneurship can apply, subject to final eligibility rules confirmed by Lotlite."
  },
  {
    q: "Who can apply for the BBA pathway?",
    a: "Students who have completed class twelve and want to build a career in business, marketing, real estate, or entrepreneurship can apply, subject to final eligibility rules confirmed by Lotlite."
  },
  {
    q: "Does the programme include practical learning?",
    a: "Yes. The learning model includes case studies, market research, CRM exposure, property launch planning, sales simulations, communication practice, and project based learning."
  },
  {
    q: "What career roles can students explore?",
    a: "Students can explore roles in real estate sales, property consulting, CRM, channel management, project launches, marketing, leasing, investment advisory, PropTech operations, and entrepreneurship."
  },
  {
    q: "Is this only for students who want to become brokers?",
    a: "No. The programme covers the wider real estate business ecosystem including marketing, sales, CRM, investment, compliance, technology, customer management, branding, and entrepreneurship."
  },
  {
    q: "Does Lotlite Edu provide placement support?",
    a: "Lotlite Edu can provide career guidance, practical exposure, and industry oriented learning to help students become job ready. Placement policies are subject to Lotlite's final institutional frameworks."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden" id="faq">
      <div className="green-glow -bottom-20 -right-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
           <h2 className="text-4xl md:text-5xl font-serif text-black mb-4">Frequently Asked Questions</h2>
           <p className="text-sm mt-3 text-muted leading-relaxed font-medium">Everything you need to know about the programmes.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white border border-black/5 rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm"
              data-aos="fade-up"
              data-aos-delay={idx * 50}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className="text-sm font-bold text-black group-hover:text-wine transition-colors pr-6">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  className="text-wine shrink-0"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-8 pb-8 text-muted leading-relaxed text-sm font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
