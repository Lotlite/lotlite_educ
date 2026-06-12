import { HeartHandshake } from 'lucide-react';

export default function ParentFocus() {
  return (
    <section className="bg-white relative overflow-hidden py-16 md:py-24 border-y border-black/5" id="parent-focus">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center" data-aos="fade-up">
        <div className="w-16 h-16 bg-wine/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-wine">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Note to Parents</span>
        <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-8">
          A Career Focused Programme <br className="hidden md:block" /> for the Next Generation
        </h2>
        <div className="space-y-6 text-base md:text-lg text-muted font-medium leading-relaxed">
          <p>
            Choosing a programme is not just about admission. It is about choosing a career direction. Lotlite Edu is designed for students who want practical exposure, business confidence, and industry focused learning.
          </p>
          <p>
            The programme helps students understand how real estate businesses work, from sales and marketing to customer management, investment, compliance, and technology. For parents, this means a learning path that gives students direction, practical skills, and career awareness.
          </p>
        </div>
      </div>
    </section>
  );
}
