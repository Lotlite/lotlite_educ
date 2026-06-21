import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Video, MapPin } from 'lucide-react';
import { useApp } from '../../AppContext';

export default function DesktopSideMenu() {
  const { setAdvisorPopupOpen } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="hidden md:flex fixed bottom-[112px] right-8 z-[85] items-center bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border border-neutral-200/50 dark:border-zinc-800/50 shadow-[0_10px_30px_rgba(128,0,32,0.12)] rounded-full h-16 p-1 gap-2 transition-all duration-300"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-wine text-white rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-md shadow-wine/25 active:scale-95"
        aria-label="Toggle quick menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`}
        >
          <line x1="4" y1="7" x2="12" y2="7"></line>
          <line x1="4" y1="12" x2="12" y2="12"></line>
          <line x1="4" y1="17" x2="12" y2="17"></line>
          <polyline points="18 7 13 12 18 17"></polyline>
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 184, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center h-14"
            style={{ overflow: 'hidden' }}
          >
            <div className="flex items-center gap-2 h-full w-[184px]">
              {/* Phone */}
              <button
                onClick={() => setAdvisorPopupOpen(true)}
                title="Talk to an Advisor"
                className="w-14 h-14 rounded-full bg-neutral-50 dark:bg-zinc-900 hover:bg-wine dark:hover:bg-wine hover:text-white dark:hover:text-white dark:text-zinc-300 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs border border-neutral-200/40 dark:border-zinc-800/40 active:scale-90"
              >
                <Phone size={20} fill="currentColor" stroke="none" className="transition-transform hover:scale-110" />
              </button>

              {/* WhatsApp */}
              <a
                href="https://wa.me/917219877473?text=Hii"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="w-14 h-14 rounded-full bg-neutral-50 dark:bg-zinc-900 hover:bg-[#25D366] hover:text-white dark:text-zinc-300 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs border border-neutral-200/40 dark:border-zinc-800/40 active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform hover:scale-110">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>

              {/* Map Pin */}
              <a
                href="https://maps.app.goo.gl/HfDLvejmHQTizR1v7"
                target="_blank"
                rel="noopener noreferrer"
                title="Location"
                className="w-14 h-14 rounded-full bg-neutral-50 dark:bg-zinc-900 hover:bg-wine dark:hover:bg-wine hover:text-white dark:hover:text-white dark:text-zinc-300 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs border border-neutral-200/40 dark:border-zinc-800/40 active:scale-90"
              >
                <MapPin size={22} className="transition-transform hover:scale-110" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
