import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    q: "Who is the B.REM program designed for?",
    a: "Students who want to build a serious career in real estate — whether in sales, finance, PropTech, or entrepreneurship — and are willing to learn by doing from day one."
  },
  {
    q: "Do I need a real estate background to apply?",
    a: "No. Most of our students come in with zero real estate experience. The program is designed to take you from zero to deal-ready in the first semester."
  },
  {
    q: "Is the B.REM degree recognized?",
    a: "Yes. The curriculum is built with RICS and NAREDCO, and the degree is structured as a full 4-year undergraduate program backed by the Lotlite Group."
  },
  {
    q: "What does the fee structure look like?",
    a: "Fee details are shared during the admissions process. EMI and scholarship options are available for eligible candidates."
  },
  {
    q: "What types of companies hire from Lotlite?",
    a: "Graduates have been placed at Lodha, CBRE, JLL, NoBroker, Square Yards, PropTiger, 99acres, Knight Frank, and 40+ other partner firms."
  },
  {
    q: "Is there a placement guarantee?",
    a: "We offer 100% placement support. Our founding cohort achieved a ₹9L average CTC with the top 25% crossing ₹14L."
  },
  {
    q: "Can I apply while still in Class 12?",
    a: "Yes. The B.REM is an undergraduate program. Students who have completed or are appearing for their Class 12 board exams are eligible to apply."
  },
  {
    q: "When does the next cohort begin?",
    a: "The next cohort begins in August 2026 at our Bengaluru campus. We admit 200 students per cohort."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden">
      <div className="green-glow -bottom-20 -right-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
           <h2 className="text-4xl md:text-5xl text-black">Everything you need to know</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-offwhite border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm"
              data-aos="fade-up"
              data-aos-delay={idx * 50}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  className="text-wine"
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
                    <div className="px-8 pb-8 text-black/60 leading-relaxed font-medium">
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
