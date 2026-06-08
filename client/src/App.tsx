import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import CounterStrip from './components/sections/CounterStrip';
import TrustMarquee from './components/sections/TrustMarquee';
import AcademicHub from './components/sections/AcademicHub';
import Footer from './components/layout/Footer';
import StickyBottomBar from './components/layout/StickyBottomBar';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminDashboard from './components/admin/AdminDashboard';
import Chatbot from './components/ui/Chatbot';
import InternshipPopup from './components/ui/InternshipPopup';
import OtpVerificationPage from './components/auth/OtpVerificationPage';
import { useApp } from './AppContext';
// Extend Window interface for AOS
declare global {
  interface Window {
    AOS: any;
  }
}

export default function App() {
  const {
    activeSection,
    activeSubTab,
    isMenuOpen,
    isInternshipOpen,
    isAdminLoggedIn,
    isAdminLoginOpen,
    toastMessage,
    setActiveSection,
    setActiveSubTab,
    setInternshipPanelOpen,
    clearToast,
    checkLocalAuth,
    setAdminLoginOpen,
    logoutUser,
  } = useApp();

  // Auto-open career internship popup on initial website load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInternshipPanelOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle auto close for incoming global toast notifications
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Dispatch local authentication setup when the website mounts
  useEffect(() => {
    checkLocalAuth();
  }, []);

  const handleLoginSuccess = () => {
    setActiveSection('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setActiveSection('programs');
  };

  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      const target = customEvent.detail;
      if (target === 'apply_form') {
        setActiveSection('programs');
        setActiveSubTab('brem-admission');
        const element = document.getElementById('workspace-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (target === 'fees') {
        setActiveSection('programs');
        setActiveSubTab('brem-fees');
        const element = document.getElementById('workspace-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('switch-tab', handleSwitchTab);
    return () => {
      window.removeEventListener('switch-tab', handleSwitchTab);
    };
  }, []);

  // Re-initialize and refresh AOS when sections change to handle unmounted/remounted elements
  useEffect(() => {
    if (window.AOS) {
      const timer = setTimeout(() => {
        try {
          window.AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-quad',
          });
          window.AOS.refresh();
        } catch (err) {
          console.error('Error refreshing AOS:', err);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeSection, activeSubTab]);

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-quad',
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-white antialiased selection:bg-wine/10 selection:text-black overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" id="app-background-glows">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="wine-glow w-[800px] h-[800px] -top-[300px] -left-[300px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="green-glow w-[600px] h-[600px] top-[40%] -right-[200px] opacity-10" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, 15, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="wine-glow w-[900px] h-[900px] -bottom-[400px] left-[10%] opacity-[0.1]" 
        />
      </div>

      <div className="relative z-10" id="application-container-hub">
        <Navbar />
        
        <main id="primary-view-body">
          {activeSection === 'dashboard' && isAdminLoggedIn ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <>
              <Hero />
              <CounterStrip />
              <TrustMarquee />
              <div id="workspace-section" className="scroll-mt-24">
                <AcademicHub 
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  activeSubTab={activeSubTab}
                  setActiveSubTab={setActiveSubTab}
                />
              </div>
            </>
          )}
        </main>

        <Footer 
          onOpenLogin={() => setAdminLoginOpen(true)} 
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={handleLogout}
          setActiveSection={setActiveSection}
          setActiveSubTab={setActiveSubTab}
        />
        
        {activeSection !== 'dashboard' && <StickyBottomBar isMenuOpen={isMenuOpen} />}
        {activeSection !== 'dashboard' && <Chatbot />}

        {/* Admin Login Modal */}
        <AdminLoginModal 
          isOpen={isAdminLoginOpen}
          onClose={() => setAdminLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Career & Internship Ad Popup */}
        <InternshipPopup 
          isOpen={isInternshipOpen}
          onClose={() => setInternshipPanelOpen(false)}
        />

        {/* Dynamic Redux Custom Toast Notification */}
        <AnimatePresence>
          {toastMessage && toastMessage.show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: -24, x: -24 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
              className="fixed bottom-0 right-0 z-[110] bg-white border border-wine/20 shadow-2xl rounded-2xl p-6 flex items-center gap-4 text-black max-w-sm mr-4"
              id="global-redux-toast-message"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                toastMessage.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-wine/10 text-wine'
              }`}>
                {toastMessage.type === 'error' ? '⚠️' : '📄'}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight text-neutral-800">{toastMessage.title}</p>
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                  {toastMessage.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
