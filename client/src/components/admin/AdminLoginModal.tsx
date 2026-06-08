import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../AppContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const { authenticateAdmin, triggerToast, clearAuthError, authError } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFillDemo = () => {
    setEmail('admin@lotlite.edu');
    setPassword('lotlite2026');
    setError('');
    clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isSuccessAuth = await authenticateAdmin(email, password);
      if (isSuccessAuth) {
        setIsSuccess(true);
        triggerToast({
          title: "Access Granted",
          description: "Welcome back, Lotlite Admin!",
          type: 'success'
        });
        setTimeout(() => {
          onLoginSuccess();
          setIsSuccess(false);
          onClose();
          setIsLoading(false);
        }, 1200);
      } else {
        setError('Invalid administrator keys. Please verify credentials.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'System login exception.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-card border border-border shadow-2xl w-full max-w-md p-8 relative rounded-3xl z-10 overflow-hidden"
          >
            {/* Background Ambience inside modal */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-wine/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-wine rotate-45 flex items-center justify-center text-white font-bold text-base shadow-md">
                  <span className="-rotate-45">L</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black leading-tight">Admin Portal</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted mt-1">Lotlite Education Board</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="login-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-12 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-serif text-black font-bold mb-2">Access Granted</h4>
                  <p className="text-sm text-muted">Synchronizing admissions registries...</p>
                </motion.div>
              ) : (
                <motion.form
                  key="login-form"
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2 font-medium"
                    >
                      <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">Board Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30">
                        <Mail size={16} />
                      </span>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-input border border-border rounded-xl pl-12 pr-4 py-3.5 text-black focus:outline-none focus:border-wine transition-colors font-semibold text-sm placeholder:text-muted/30"
                        placeholder="board@lotlite-education.in"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">Secret Security Key</label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30">
                        <Lock size={16} />
                      </span>
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-input border border-border rounded-xl pl-12 pr-4 py-3.5 text-black focus:outline-none focus:border-wine transition-colors font-semibold text-sm placeholder:text-muted/30"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  {/* demo creds helper card */}
                  <div className="bg-wine-light border border-wine-light-border rounded-2xl p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-wine tracking-widest">Demo Credentials Board Link</span>
                      <button
                        type="button"
                        onClick={handleFillDemo}
                        className="text-[9px] font-black uppercase text-white bg-wine hover:opacity-90 px-2 py-1 rounded transition-opacity"
                      >
                        Auto Fill Key
                      </button>
                    </div>
                    <div className="text-[11px] text-black/60 space-y-1 font-medium leading-relaxed">
                      <p><strong>Email:</strong> <span className="font-mono">admin@lotlite.edu</span></p>
                      <p><strong>Password:</strong> <span className="font-mono">lotlite2026</span></p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-wine hover:opacity-90 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-opacity shadow-lg shadow-wine/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Verifying credentials...</span>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Authorize & Enter Board</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
