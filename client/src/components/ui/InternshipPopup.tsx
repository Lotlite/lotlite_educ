import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, User, Mail, Phone, CheckCircle2, ChevronRight, ArrowRight, Award, Briefcase, GraduationCap } from 'lucide-react';
import OtpVerificationPage from '../auth/OtpVerificationPage';

interface InternshipPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InternshipPopup({ isOpen, onClose }: InternshipPopupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingLead, setPendingLead] = useState<any>(null);
  const [otpError, setOtpError] = useState('');

  // Reset states when open/close
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPhone('');
      setEducation('');
      setIsSuccess(false);
      setErrors({});
      setPendingLead(null);
      setOtpError('');
    }
  }, [isOpen]);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else {
      const numbersOnly = phone.replace(/\D/g, '');
      if (numbersOnly.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      }
    }

    if (!education.trim()) {
      newErrors.education = 'Please enter your education or degree';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setOtpError('');

    // Form submission payload
    const newApp = {
      id: `app-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      program: 'Career & Internship Co-Op (₹30k Stipend)',
      background: 'Web Pop-Up Career Portal Inquiry',
      status: 'Pending',
      experience: `Education: ${education.trim()} | Submitted via Home On-Load Career Ad Form`,
      appliedDate: new Date().toISOString().split('T')[0]
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setOtpError(data.error || 'Failed to send OTP. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setPendingLead({
        phone: phone.trim(),
        localData: newApp,
        leadData: {
          fullName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          programCategory: 'Career & Internship Co-Op (₹30k Stipend)',
          programSpecialization: education.trim(),
          source: 'Web Pop-Up Career Portal Inquiry',
          lead_tags: ['Lotlite Edu', 'Internship']
        }
      });
    } catch (err) {
      console.error('OTP Send error', err);
      setOtpError('Network error. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/40 dark:bg-zinc-950/30 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* OTP Verification Overlay */}
          {pendingLead && (
            <OtpVerificationPage
              pendingLead={pendingLead}
              onSuccess={() => {
                setPendingLead(null);
                setIsSuccess(true);
              }}
              onCancel={() => setPendingLead(null)}
            />
          )}

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', duration: 0.55, bounce: 0.2 }}
            className="bg-card border border-border dark:border-white/10 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] w-[92%] sm:w-[85%] md:w-full max-w-[390px] sm:max-w-[480px] md:max-w-[850px] relative rounded-3xl z-10 flex flex-col md:flex-row max-h-[90vh] sm:max-h-[85vh] md:max-h-[640px] overflow-hidden my-auto"
          >
            {/* Elegant Floating Close Button at Root */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50">
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-offwhite hover:bg-neutral-200/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-muted hover:text-black dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer backdrop-blur-xs border border-border dark:border-white/5 flex items-center justify-center shadow-xs"
                aria-label="Close"
              >
                <X size={13} className="sm:w-[15px] sm:h-[15px]" />
              </button>
            </div>

            {/* Dynamic decorative visual left/top banner */}
            <div 
              className="relative h-24 sm:h-28 md:h-auto md:w-[38%] bg-cover bg-center overflow-hidden flex flex-col justify-end p-4 sm:p-5 md:p-6 select-none shrink-0" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop')" }}
            >
              {/* Solid readable photographic overlay */}
              <div className="absolute inset-0 true-bg-black-60 md:true-bg-black-65 z-[1]" />
              <div className="absolute inset-0 true-gradient-overlay z-[2]" />
              
              {/* Floating elements inside banner */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-wine/30 rounded-full blur-2xl pointer-events-none z-[1]" />

              {/* Banner Text Label details */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-0.5 md:px-3 md:py-1 bg-wine/95 true-text-white rounded-full text-[8px] md:text-[9px] font-extrabold uppercase tracking-widest mb-1 shadow-sm true-border-white-10 border">
                  <Sparkles size={8} className="animate-spin true-text-white" />
                  <span className="true-text-white">Careers & Fellowships</span>
                </div>
                <h3 className="text-sm sm:text-base md:text-xl font-serif font-semibold true-text-white tracking-wide leading-tight relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  Real Estate Co-Op Placement
                </h3>
              </div>
            </div>

            {/* Inner Content Area - Scrollable on shorter viewports with elegant thin custom scrollbar */}
            <div className="p-4 sm:p-6 md:p-7 relative overflow-y-auto custom-modal-scrollbar max-h-full w-full flex flex-col justify-start md:justify-center">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    {/* Advertisement info */}
                    <div className="mb-3.5 sm:mb-4 md:pr-4">
                      <p className="text-muted text-[10.5px] sm:text-xs leading-relaxed mb-2.5 sm:mb-3">
                        Secure a prestigious professional internship and placement with premium developers. Kickstart your real estate management career with hands-on corporate co-ops.
                      </p>
                      
                      {/* Stipend Callout High Contrast Box */}
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-wine/[0.03] border border-wine/10 dark:bg-wine/10 dark:border-wine/25">
                        <div className="w-8 h-8 rounded-lg bg-wine/10 dark:bg-wine/20 text-wine flex items-center justify-center shrink-0">
                          <Briefcase size={14} className="sm:w-[15px] sm:h-[15px]" />
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-bold tracking-widest text-muted">Guaranteed Monthly Compensation</p>
                          <p className="text-xs sm:text-sm md:text-[15px] font-serif font-extrabold text-wine">
                            Stipend Up to ₹30,000 / month
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Applications form */}
                    <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5 md:pr-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-black mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                            <User size={12} className="sm:w-[13px] sm:h-[13px]" />
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className={`w-full bg-input text-black placeholder:text-muted/40 border ${
                              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-border focus:border-wine'
                            } rounded-xl py-1.5 sm:py-2 pl-9 pr-4 text-xs font-medium focus:outline-none transition-all`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-[8px] text-red-500 font-bold mt-0.5 uppercase tracking-wider">{errors.name}</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-black mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                            <Mail size={12} className="sm:w-[13px] sm:h-[13px]" />
                          </span>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="rahul.sharma@example.com"
                            className={`w-full bg-input text-black placeholder:text-muted/40 border ${
                              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border focus:border-wine'
                            } rounded-xl py-1.5 sm:py-2 pl-9 pr-4 text-xs font-medium focus:outline-none transition-all`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-[8px] text-red-500 font-bold mt-0.5 uppercase tracking-wider">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-black mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                            <Phone size={12} className="sm:w-[13px] sm:h-[13px]" />
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            className={`w-full bg-input text-black placeholder:text-muted/40 border ${
                              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-border focus:border-wine'
                            } rounded-xl py-1.5 sm:py-2 pl-9 pr-4 text-xs font-medium focus:outline-none transition-all`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-[8px] text-red-500 font-bold mt-0.5 uppercase tracking-wider">{errors.phone}</p>
                        )}
                      </div>

                      {/* Education / Qualification */}
                      <div>
                        <label className="block text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-black mb-1">
                          Education / Qualification
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                            <GraduationCap size={12} className="sm:w-[13px] sm:h-[13px]" />
                          </span>
                          <input
                            type="text"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            placeholder="e.g. BBA, B.Com, B.Tech, or Postgraduate"
                            className={`w-full bg-input text-black placeholder:text-muted/40 border ${
                              errors.education ? 'border-red-500 focus:ring-red-500' : 'border-border focus:border-wine'
                            } rounded-xl py-1.5 sm:py-2 pl-9 pr-4 text-xs font-medium focus:outline-none transition-all`}
                          />
                        </div>
                        {errors.education && (
                          <p className="text-[8px] text-red-500 font-bold mt-0.5 uppercase tracking-wider">{errors.education}</p>
                        )}
                      </div>

                      {/* Error Message */}
                      {otpError && (
                        <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider text-center">{otpError}</p>
                      )}

                      {/* Action Submission Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-wine hover:bg-wine-hover text-white py-2 sm:py-2.5 rounded-xl font-bold transition-all text-[10px] sm:text-[11px] uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 mt-1.5 shadow-md shadow-wine/10 hover:shadow-wine/20 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Apply for Internship</span>
                            <ArrowRight size={12} />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-2 text-center flex flex-col items-center w-full"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wine/5 text-wine flex items-center justify-center mb-3 shadow-inner border border-wine/10 select-none">
                      <CheckCircle2 size={20} className="sm:w-6 sm:h-6 animate-bounce" />
                    </div>
                    <h4 className="text-base sm:text-lg font-serif font-semibold text-black tracking-wide">
                      Application Submitted!
                    </h4>
                    <p className="text-[8px] sm:text-[9px] uppercase font-extrabold tracking-widest text-[#1B8C68] mt-0.5">
                      Career Fellowship Queue Active
                    </p>
                    
                    <div className="w-full max-w-sm mt-3 sm:mt-4 p-3 rounded-xl bg-offwhite border border-border text-left space-y-2">
                      <div className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-wine mt-1.5 shrink-0" />
                        <p className="text-[9.5px] sm:text-[10.5px] text-muted leading-relaxed">
                          We just secured your application for the stipend co-op. Your ID is <span className="font-mono bg-card px-1 py-0.5 rounded border border-border text-black">INTERN-{Date.now().toString().slice(-6)}</span>.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-wine mt-1.5 shrink-0" />
                        <p className="text-[9.5px] sm:text-[10.5px] text-muted leading-relaxed">
                          A dedicated Career Program Mentor will reach out on your phone <span className="font-semibold text-black">{phone}</span> to verify qualifications and setup interviews.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="mt-4 sm:mt-5 border border-border bg-card hover:bg-offwhite text-black py-2 px-4 rounded-xl font-bold text-[9.5px] sm:text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-xs select-none"
                    >
                      Explore Career Tracks
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
