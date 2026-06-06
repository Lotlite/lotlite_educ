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
import DesktopSideMenu from './components/layout/DesktopSideMenu';
import OtpVerificationPage from './components/auth/OtpVerificationPage';

// Extend Window interface for AOS
declare global {
  interface Window {
    AOS: any;
  }
}

export default function App() {
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInternshipOpen, setIsInternshipOpen] = useState(false);
  
  // Section states driving dynamic replacement content under Hero
  const [activeSection, setActiveSection] = useState('programs');
  const [activeSubTab, setActiveSubTab] = useState('brem');

  // Admin Portal States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // OTP Verification State
  const [pendingOtpLead, setPendingOtpLead] = useState<any>(null);

  // Auto-open career internship popup on initial website load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInternshipOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isLogged = localStorage.getItem('lotlite_admin_logged') === 'true';
    setIsAdminLoggedIn(isLogged);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('lotlite_admin_logged', 'true');
    setActiveSection('dashboard');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('lotlite_admin_logged');
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

    const handleRequireOtp = (e: Event) => {
      const customEvent = e as CustomEvent;
      setPendingOtpLead(customEvent.detail);
    };

    window.addEventListener('switch-tab', handleSwitchTab);
    window.addEventListener('require-otp', handleRequireOtp);
    return () => {
      window.removeEventListener('switch-tab', handleSwitchTab);
      window.removeEventListener('require-otp', handleRequireOtp);
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
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
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

      <div className="relative z-10">
        <Navbar 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          onLogout={handleLogout}
        />
        
        <main>
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
        onOpenLogin={() => setIsAdminLoginOpen(true)} 
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        setActiveSection={setActiveSection}
        setActiveSubTab={setActiveSubTab}
      />
      {activeSection !== 'dashboard' && <StickyBottomBar isMenuOpen={isMenuOpen} />}
      {activeSection !== 'dashboard' && <Chatbot />}
      {activeSection !== 'dashboard' && <DesktopSideMenu />}

      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Career & Internship Ad Popup */}
      <InternshipPopup 
        isOpen={isInternshipOpen}
        onClose={() => setIsInternshipOpen(false)}
      />

      {/* OTP Verification Modal */}
      {pendingOtpLead && (
        <OtpVerificationPage
          pendingLead={pendingOtpLead}
          onSuccess={() => {
            setPendingOtpLead(null);
          }}
          onCancel={() => {
            setPendingOtpLead(null);
          }}
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: -24, x: -24 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className="fixed bottom-0 right-0 z-[110] bg-white border border-wine/20 shadow-2xl rounded-2xl p-6 flex items-center gap-4 text-black"
          >
            <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center text-wine text-xl">
              📄
            </div>
            <div>
              <p className="font-bold text-sm">Brochure download starting...</p>
              <p className="text-black/40 text-[10px] uppercase font-bold tracking-widest mt-1">Preparing your curriculum guide</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
