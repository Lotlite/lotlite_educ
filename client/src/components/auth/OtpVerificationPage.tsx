import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowRight, X } from 'lucide-react';

interface OtpVerificationPageProps {
  pendingLead: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OtpVerificationPage({ pendingLead, onSuccess, onCancel }: OtpVerificationPageProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!pendingLead || !pendingLead.phone) {
      onCancel();
    }
  }, [pendingLead, onCancel]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setError('');

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${apiUrl}/api/otp/verify-and-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: pendingLead.phone,
          otp,
          leadData: pendingLead.leadData
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Invalid OTP. Please try again.');
        setIsVerifying(false);
        return;
      }

      const stored = localStorage.getItem('lotlite_applicants');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('lotlite_applicants', JSON.stringify([pendingLead.localData, ...list]));
      window.dispatchEvent(new CustomEvent('applicant-registered', { detail: pendingLead.localData }));

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);

    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
      setIsVerifying(false);
    }
  };

  if (!pendingLead) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white border border-border rounded-3xl shadow-2xl p-8 md:p-12 text-center z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-black/40 hover:text-black transition-all"
          >
            <X size={16} />
          </button>

          {!isSuccess ? (
            <>
              <div className="w-14 h-14 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">📱</span>
              </div>
              <h2 className="text-2xl font-serif text-black mb-2">Verify <span className="text-wine">Identity</span></h2>
              <p className="text-muted text-sm mb-8 leading-relaxed">
                We've sent a 6-digit code to your WhatsApp number <br />
                <span className="font-bold text-black bg-black/5 px-2 py-0.5 rounded inline-block mt-1">
                  {pendingLead.phone}
                </span>
              </p>

              <form onSubmit={handleVerify} className="space-y-5">
                <input
                  autoFocus
                  required
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-offwhite border border-border rounded-xl py-4 px-4 text-black focus:outline-none focus:border-wine transition-colors font-bold text-center tracking-[1em] text-2xl shadow-inner"
                  placeholder="------"
                />

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-wine hover:bg-wine-hover text-white py-4 rounded-xl font-bold transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-wine/20 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Submit Application</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6"
              >
                <CheckCircle size={40} />
              </motion.div>
              <h2 className="text-2xl font-serif text-black mb-2">Verified!</h2>
              <p className="text-muted text-sm font-medium">Your application has been submitted.</p>
              <div className="mt-6">
                <div className="w-5 h-5 border-2 border-wine/20 border-t-wine rounded-full animate-spin mx-auto" />
                <p className="text-[10px] text-muted uppercase tracking-widest mt-3 font-bold">Closing...</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
