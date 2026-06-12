import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import OtpVerificationPage from '../auth/OtpVerificationPage';

export default function Admissions() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('MBA in Real Estate, Business and PropTech');

  const [pendingLead, setPendingLead] = useState<any>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSendingOtp(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setFormError(data.error || 'Failed to send OTP. Please try again.');
        setIsSendingOtp(false);
        return;
      }

      const newApp = {
        id: `app-${Date.now()}`,
        name,
        email,
        phone,
        program,
        background: 'Inquire Brief Draft',
        status: 'Pending',
        experience: 'Submitted via Public Application Desk Form',
        appliedDate: new Date().toISOString().split('T')[0]
      };

      setPendingLead({
        phone,
        localData: newApp,
        leadData: {
          fullName: name,
          email,
          phone,
          programCategory: program,
          programSpecialization: '',
          source: 'Admissions Desk Form'
        }
      });
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setProgram('MBA in Real Estate, Business and PropTech');
    setIsSubmitted(false);
  };

  return (
    <section className="bg-transparent relative overflow-hidden pt-4 pb-16 md:pt-4 md:pb-24 scroll-mt-20" id="apply">
      <div className="wine-glow -top-20 -right-20 w-[600px] h-[600px] blur-[150px]" />
      <div className="absolute inset-0 z-[1] bg-arch-1 pointer-events-none opacity-20" />
      <div className="grid md:grid-cols-2 min-h-screen relative z-10">
        <div className="p-12 md:p-24 flex flex-col justify-center">
          <div data-aos="fade-right">
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">ADMISSIONS OPEN</span>
            <h2 className="text-4xl md:text-5xl text-black font-serif mb-6 leading-[1.1]">Build Your Career in <br/><span className="text-wine">Real Estate and PropTech</span></h2>
            <p className="text-muted text-sm font-medium mb-12 max-w-md leading-relaxed">
              The real estate industry is changing. The next generation of professionals will need business knowledge, communication skills, technology understanding, and industry exposure. Lotlite Edu helps students prepare for that future.
            </p>

            <div className="space-y-6 mb-16">
              {[
                { n: "01", title: "Submit your enquiry" },
                { n: "02", title: "Speak with a programme counsellor" },
                { n: "03", title: "Attend a counselling session" },
                { n: "04", title: "Complete eligibility and documentation" },
                { n: "05", title: "Confirm your admission" }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-center group">
                  <div className="w-10 h-10 rounded-xl border border-black/5 flex items-center justify-center text-wine font-serif text-lg font-bold group-hover:bg-wine group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                    {step.n}
                  </div>
                  <h3 className="text-black font-bold text-sm tracking-tight">{step.title}</h3>
                </div>
              ))}
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
                <h3 className="text-3xl md:text-4xl font-serif text-black mb-10">Submit <span className="text-wine">Enquiry</span></h3>
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Full Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors font-medium placeholder:text-muted/30" placeholder="Aarav Sharma" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Email Address</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors font-medium placeholder:text-muted/30" placeholder="aarav@university.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Phone Number</label>
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors font-medium placeholder:text-muted/30" placeholder="+91 98765 00000" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Academic Program Interest</label>
                    <select required value={program} onChange={(e) => setProgram(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors appearance-none font-medium">
                      <option value="MBA in Real Estate, Business and PropTech" className="bg-white dark:bg-offwhite text-black">MBA in Real Estate, Business and PropTech</option>
                      <option value="BBA in Business, Real Estate and Marketing" className="bg-white dark:bg-offwhite text-black">BBA in Business, Real Estate and Marketing</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSendingOtp} className="w-full bg-wine text-white py-3.5 md:py-5 rounded-xl font-bold border-2 border-transparent shadow-xl shadow-wine/20 hover:bg-transparent hover:text-wine hover:border-wine transition-all uppercase tracking-[0.2em] text-xs md:text-sm disabled:opacity-75 disabled:cursor-not-allowed">
                    <span className="md:hidden">{isSendingOtp ? 'Sending...' : 'Apply Now'}</span>
                    <span className="hidden md:inline">{isSendingOtp ? 'Sending OTP...' : 'Apply Now →'}</span>
                  </button>
                  {formError && <p className="text-center text-red-500 text-xs font-bold uppercase mt-2">{formError}</p>}
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-offwhite p-16 rounded-3xl shadow-2xl w-full max-w-lg text-center flex flex-col items-center border border-border"
              >
                <div className="w-24 h-24 bg-wine/10 rounded-full flex items-center justify-center text-wine mb-10 shadow-lg shadow-wine/5">
                  <CheckCircle size={56} />
                </div>
                <h3 className="text-4xl font-serif text-black mb-4 leading-tight">Enquiry <span className="text-wine">Received.</span></h3>
                <p className="text-muted leading-relaxed font-medium text-lg">
                  🎉 We have received your details. A programme counsellor will be in touch with you shortly.
                </p>
                <button 
                  onClick={handleResetForm}
                  className="mt-12 text-wine font-bold text-sm uppercase tracking-widest hover:underline opacity-60 hover:opacity-100 transition-opacity"
                >
                  Submit another enquiry?
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {pendingLead && (
        <OtpVerificationPage
          pendingLead={pendingLead}
          onSuccess={() => {
            setPendingLead(null);
            setIsSubmitted(true);
          }}
          onCancel={() => setPendingLead(null)}
        />
      )}
    </section>
  );
}
