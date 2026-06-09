import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, User, ArrowRight } from 'lucide-react';
import { useApp } from '../../AppContext';

interface AdvisorPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function AdvisorPopup({ isOpen, onClose }: AdvisorPopupProps) {
  const { triggerToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || phone.length < 10) {
      triggerToast({
        title: 'Validation Error',
        description: 'Please enter a valid name and phone number.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Send to Callyzer (Leads API)
      const leadRes = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          phone: phone,
          source: 'Advisor Request Popup',
          lead_tags: ['Lotlite Edu', 'Advisor Consultation']
        })
      });

      if (!leadRes.ok) {
        throw new Error('Failed to submit request to Callyzer');
      }

      triggerToast({
        title: 'Request Submitted',
        description: 'An advisor will contact you shortly.',
        type: 'success'
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setPhone('');
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error(err);
      triggerToast({
        title: 'Submission Failed',
        description: 'There was an issue submitting your request. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[160] px-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-border dark:border-white/10 relative">
              {/* Header */}
              <div className="bg-wine p-6 text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 true-text-white opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X size={20} />
                </button>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <Phone size={24} className="true-text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold true-text-white">Talk to an Advisor</h3>
                <p className="text-sm true-text-white opacity-80 mt-1">Leave your details and we'll call you right back</p>
              </div>

              {/* Body */}
              <div className="p-6 min-h-[280px] flex flex-col justify-center">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-4 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold dark:text-white mb-2">Request Submitted!</h4>
                    <p className="text-muted text-sm">We've received your details. Our advisor will reach out to you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-zinc-100">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-border dark:border-white/10 rounded-xl focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors dark:text-zinc-100"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-zinc-100">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-border dark:border-white/10 rounded-xl focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors dark:text-zinc-100"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-wine hover:bg-wine-hover true-text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        Request Call Back <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
