import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export default function Admissions() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Undergraduate');
  const [program, setProgram] = useState('B.REM in Real Estate Management');

  // Listen for global OTP completion
  React.useEffect(() => {
    const handleApplicantRegistered = (e: Event) => {
      // Once OTP is verified and lead registered, show success state
      setIsSubmitted(true);
    };
    window.addEventListener('applicant-registered', handleApplicantRegistered);
    return () => window.removeEventListener('applicant-registered', handleApplicantRegistered);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    try {
      // Step 1: Request OTP
      const response = await fetch(`${apiUrl}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setSubmitError(data.error || 'Failed to send OTP. Please check your number.');
        setIsSubmitting(false);
        return;
      }

      // Prepare Lead Data to pass to the OTP Verification Page
      const pendingLead = {
        phone,
        leadData: {
          fullName: name,
          email,
          phone,
          programCategory: category,
          programSpecialization: program,
          source: 'Admission',
        },
        localData: {
          id: `app-${Date.now()}`,
          name,
          email,
          phone,
          program,
          background: 'Inquire Brief Draft (Undergrad Background)',
          status: 'Pending',
          experience: 'Submitted via Public Application Desk Form',
          appliedDate: new Date().toISOString().split('T')[0]
        }
      };

      // Transition to OTP Page
      window.dispatchEvent(new CustomEvent('require-otp', { detail: pendingLead }));

    } catch (err) {
      console.error("Submission error", err);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCategory('Undergraduate');
    setProgram('B.REM in Real Estate Management');
    setIsSubmitted(false);
    setSubmitError('');
  };

  return (
    <section className="bg-transparent relative overflow-hidden pt-4 pb-16 md:pt-4 md:pb-24 scroll-mt-20" id="apply">
      <div className="wine-glow -top-20 -right-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="absolute inset-0 z-[1] bg-arch-1 pointer-events-none" />
      <div className="grid md:grid-cols-2 min-h-screen relative z-10">
        <div className="p-12 md:p-24 flex flex-col justify-center">
          <div data-aos="fade-right">
            <span className="text-bottle-green text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">ADMISSIONS OPEN</span>
            <h2 className="text-5xl md:text-8xl text-black font-serif mb-8 leading-[1.1]">40 Seats. <br/><span className="text-bottle-green">One Shot.</span></h2>
            <p className="text-muted text-xl font-medium mb-20 max-w-md leading-relaxed italic">
              Applications for the August 2026 cohort are now open. Seats fill at a record pace.
            </p>

            <div className="space-y-12 mb-20">
              {[
                { n: "01", title: "Apply Online", sub: "Digital Submission (5 min)" },
                { n: "02", title: "Aptitude Test", sub: "Cognitive Assessment (30 min)" },
                { n: "03", title: "Panel Interview", sub: "Founders' Round" },
                { n: "04", title: "Final Offer", sub: "Enrollment Ceremony" }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-8 items-start group">
                  <div className="w-14 h-14 rounded-xl border border-border flex items-center justify-center text-bottle-green font-serif text-2xl font-bold group-hover:bg-bottle-green group-hover:text-white transition-all duration-300 shadow-sm">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-black font-bold text-xl tracking-tight mb-1">{step.title}</h3>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-border">
              <p className="text-muted/50 text-[10px] uppercase tracking-[0.3em] mb-4 font-bold">CAMPUS LOCATION</p>
              <p className="text-2xl font-serif text-black">Bengaluru Urban Campus, 2026</p>
            </div>
          </div>
        </div>

        <div className="bg-transparent p-6 md:p-24 flex items-center justify-center border-l border-border">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="light-gradient-card p-10 md:p-14 rounded-3xl shadow-2xl w-full max-w-xl"
              >
                <h3 className="text-3xl md:text-4xl font-serif text-black mb-10">Start Your <span className="text-bottle-green">Application</span></h3>
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Full Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-bottle-green transition-colors font-medium placeholder:text-muted/30" placeholder="Aarav Sharma" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Email Address</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-bottle-green transition-colors font-medium placeholder:text-muted/30" placeholder="aarav@university.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Phone Number</label>
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-bottle-green transition-colors font-medium placeholder:text-muted/30" placeholder="+91 98765 00000" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Program Category</label>
                      <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-bottle-green transition-colors appearance-none font-medium">
                        <option value="Undergraduate" className="bg-white dark:bg-offwhite text-black">Undergraduate</option>
                        <option value="Postgraduate" className="bg-white dark:bg-offwhite text-black">Postgraduate</option>
                        <option value="Certification" className="bg-white dark:bg-offwhite text-black">Certification</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Academic Program</label>
                      <select required value={program} onChange={(e) => setProgram(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-bottle-green transition-colors appearance-none font-medium">
                        <option value="B.REM in Real Estate Management" className="bg-white dark:bg-offwhite text-black">B.REM in Real Estate Management</option>
                        <option value="B.REM in Real Estate Finance" className="bg-white dark:bg-offwhite text-black">B.REM in Real Estate Finance</option>
                        <option value="Advanced PG Program" className="bg-white dark:bg-offwhite text-black">Advanced PG Program</option>
                        <option value="Digital Certification" className="bg-white dark:bg-offwhite text-black">Digital Certification</option>
                      </select>
                    </div>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs md:text-sm font-semibold border border-red-100 text-center">
                      {submitError}
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="w-full bg-bottle-green text-white py-3.5 md:py-5 rounded-xl font-bold border-2 border-transparent shadow-xl shadow-bottle-green/20 hover:bg-transparent hover:text-bottle-green hover:border-bottle-green transition-all uppercase tracking-[0.2em] text-xs md:text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    <span className="md:hidden">{isSubmitting ? 'Sending Code...' : 'Submit Application'}</span>
                    <span className="hidden md:inline">{isSubmitting ? 'Sending Verification Code...' : 'Submit My Application →'}</span>
                  </button>
                  <p className="text-center text-black/20 text-[10px] font-bold uppercase tracking-widest mt-6">Secure Submission backed by Lotlite Group</p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-offwhite p-16 rounded-3xl shadow-2xl w-full max-w-lg text-center flex flex-col items-center border border-border"
              >
                <div className="w-24 h-24 bg-bottle-green/10 rounded-full flex items-center justify-center text-bottle-green mb-10 shadow-lg shadow-bottle-green/5">
                  <CheckCircle size={56} />
                </div>
                <h3 className="text-4xl font-serif text-black mb-4 leading-tight">Inspiration <span className="text-bottle-green">Confirmed.</span></h3>
                <p className="text-muted leading-relaxed font-medium text-lg">
                  🎉 Your application has reached our board. Expect a strategy call from the admissions office within 24 hours.
                </p>
                <button 
                  onClick={handleResetForm}
                  className="mt-12 text-bottle-green font-bold text-sm uppercase tracking-widest hover:underline opacity-60 hover:opacity-100 transition-opacity"
                >
                  Apply for another program?
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
