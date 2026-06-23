import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileDown } from 'lucide-react';
import { useApp } from '../../AppContext';
import OtpVerificationPage from './OtpVerificationPage';

export default function DownloadBrochureModal() {
  const {
    isDownloadBrochureOpen,
    setDownloadBrochureOpen,
    downloadBrochureDefaultProgram,
    websiteData,
    triggerToast
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('mba'); // 'bba' or 'mba'
  
  const [pendingLead, setPendingLead] = useState<any>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [formError, setFormError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isDownloadBrochureOpen) {
      setName('');
      setPhone('');
      setProgram(downloadBrochureDefaultProgram || 'mba');
      setPendingLead(null);
      setFormError('');
      setIsSendingOtp(false);
    }
  }, [isDownloadBrochureOpen, downloadBrochureDefaultProgram]);

  if (!isDownloadBrochureOpen) return null;

  const handleClose = () => {
    if (!pendingLead) {
      setDownloadBrochureOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!name || !phone) {
      setFormError('Please fill in all fields.');
      return;
    }

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

      let programFullName = 'MBA in Real Estate, Business and PropTech';
      if (program === 'bba') {
        programFullName = 'BBA in Business, Real Estate and Marketing';
      } else if (program === 'bca') {
        programFullName = 'BCA in Computer Applications, Data Science & Software Development';
      } else if (program === 'mca') {
        programFullName = 'MCA in AI, Software Engineering & Applied Computing';
      }

      const newApp = {
        id: `app-${Date.now()}`,
        name,
        email: 'brochure-download@noemail.com', // Dummy email since we only asked for phone
        phone,
        program: programFullName,
        background: 'Brochure Download Request',
        status: 'Pending',
        experience: 'Downloaded PDF Brochure',
        appliedDate: new Date().toISOString().split('T')[0]
      };

      setPendingLead({
        phone,
        localData: newApp,
        leadData: {
          fullName: name,
          email: 'brochure-download@noemail.com',
          phone,
          programCategory: programFullName,
          programSpecialization: '',
          source: 'Brochure Download Form'
        }
      });
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSuccess = () => {
    // 1. Close modal
    setPendingLead(null);
    setDownloadBrochureOpen(false);

    // 2. Fetch correct URL
    let url = websiteData.mba_brochure_url;
    if (program === 'bba') {
      url = websiteData.bba_brochure_url;
    } else if (program === 'bca') {
      url = websiteData.bca_brochure_url;
    } else if (program === 'mca') {
      url = websiteData.mca_brochure_url;
    }

    if (url) {
      triggerToast({
        title: 'Verification Successful',
        description: 'Your brochure download will begin shortly.',
        type: 'success'
      });
      
      // Use anchor trick to bypass popup blockers
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = `${program}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      triggerToast({
        title: 'Brochure Not Available',
        description: 'The requested brochure is currently being updated. Please check back later.',
        type: 'warning'
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white border border-border rounded-3xl shadow-2xl p-8 overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-black/50 hover:text-black transition-all z-20"
          >
            <X size={16} />
          </button>

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-wine/10 text-wine rounded-full flex items-center justify-center mx-auto mb-4">
              <FileDown size={32} />
            </div>
            <h2 className="text-3xl font-serif text-black leading-tight mb-2">
              Download <span className="text-wine">Brochure</span>
            </h2>
            <p className="text-muted text-sm font-medium px-4">
              Please enter your details to receive the detailed academic syllabus and curriculum overview.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-offwhite border border-border rounded-xl px-4 py-3.5 text-black focus:outline-none focus:border-wine transition-colors font-medium text-sm"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">Phone Number</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-offwhite border border-border rounded-xl px-4 py-3.5 text-black focus:outline-none focus:border-wine transition-colors font-medium text-sm"
                placeholder="+91 98765 00000"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">Select Program</label>
              <div className="relative">
                <select
                  required
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-offwhite border border-border rounded-xl px-4 py-3.5 text-black focus:outline-none focus:border-wine transition-colors appearance-none font-bold text-sm cursor-pointer"
                >
                  <option value="mba">MBA in Real Estate & PropTech</option>
                  <option value="bba">BBA in Real Estate & Marketing</option>
                  <option value="bca">BCA in Computer Applications & Software Development</option>
                  <option value="mca">MCA in AI & Software Engineering</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full bg-wine text-white py-4 rounded-xl font-bold border-2 border-transparent shadow-xl shadow-wine/20 hover:bg-transparent hover:text-wine hover:border-wine transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isSendingOtp ? 'Sending OTP...' : 'Continue to Download'}
            </button>
            
            {formError && (
              <p className="text-center text-red-500 text-xs font-bold uppercase mt-3">{formError}</p>
            )}
          </form>

          {pendingLead && (
            <OtpVerificationPage
              pendingLead={pendingLead}
              onSuccess={handleSuccess}
              onCancel={() => setPendingLead(null)}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
