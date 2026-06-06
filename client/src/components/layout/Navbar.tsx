import { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, Lock, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ThemeToggle from '../ui/ThemeToggle';
import Logo from '../ui/Logo';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ 
  isMenuOpen, 
  setIsMenuOpen,
  activeSection,
  setActiveSection,
  activeSubTab,
  setActiveSubTab,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onLogout
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const baseLinks = [
    { 
      name: 'Programs', 
      href: '#workspace-section',
      section: 'programs',
      dropdown: [
        { label: 'B.REM Programme', tab: 'brem-overview' },
        { label: 'PG AI & PropTech', tab: 'pg-overview' }
      ]
    },
    { 
      name: 'About', 
      href: '#workspace-section',
      section: 'about',
      dropdown: [
        { label: 'Why SSI & Legacy', tab: 'why-ssi' },
        { label: 'Our Founders & Board', tab: 'founders' }
      ]
    },
    { 
      name: 'Faculty', 
      href: '#workspace-section',
      section: 'faculty',
      dropdown: [
        { label: 'Eminent Faculty Board', tab: 'all' },
        { label: 'Research & Syllabi', tab: 'research' }
      ]
    },
    { 
      name: 'Outcomes', 
      href: '#workspace-section',
      section: 'outcomes',
      dropdown: [
        { label: 'Placements & CTC Stats', tab: 'stats' },
        { label: 'Alumni Success Stories', tab: 'carousel' }
      ]
    },
    { 
      name: 'Incubation', 
      href: '#workspace-section',
      section: 'incubation',
      dropdown: [
        { label: 'Venture Labs Overview', tab: 'ventures' },
        { label: 'Student Case Projects', tab: 'cases' }
      ]
    },
    { 
      name: 'Blogs', 
      href: '#workspace-section',
      section: 'blogs',
      dropdown: [
        { label: 'Lotlite Sprints & Chronicle', tab: 'insights' }
      ]
    }
  ];

  const navLinks = [...baseLinks];
  if (isAdminLoggedIn) {
    navLinks.push({
      name: 'Dashboard',
      href: '#',
      section: 'dashboard',
      dropdown: []
    });
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[100000] transition-all duration-500 ${
          isScrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-6'
        }`}
      >
        <motion.div
          initial={false}
          animate={{ 
            opacity: isScrolled ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 glass-nav pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="h-10 sm:h-12 w-auto" />
          </div>

          <div className="hidden lg:flex items-center gap-3 lg:gap-5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.section;
              return (
                <div key={link.name} className="relative group py-2">
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(link.section);
                      if (link.dropdown && link.dropdown.length > 0) {
                        setActiveSubTab(link.dropdown[0].tab);
                      }
                      const element = document.getElementById('workspace-section');
                      if (element && link.section !== 'dashboard') {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:text-wine transition-colors relative pb-1 flex items-center gap-1 ${
                      isActive ? 'text-wine animate-pulse' : 'text-black/60'
                    }`}
                  >
                    {link.name === 'Dashboard' && <ShieldAlert size={11} className="mr-0.5 text-wine" />}
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-wine transition-all group-hover:w-full ${isActive ? 'w-full' : 'w-0'}`} />
                  </a>

                  {/* Desktop Dropdown Menu exactly aligned to SSI */}
                  {link.dropdown && link.dropdown.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card backdrop-blur-md border border-border rounded-xl shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-auto z-50">
                      <div className="flex flex-col">
                        {link.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveSection(link.section);
                              setActiveSubTab(subItem.tab);
                              const element = document.getElementById('workspace-section');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black/70 hover:text-wine hover:bg-wine-light transition-all text-left ${
                              activeSubTab === subItem.tab && isActive ? 'text-wine bg-wine-light' : ''
                            }`}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex items-center gap-2.5 lg:gap-3.5">
              <ThemeToggle />

              {isAdminLoggedIn ? (
                <button
                  onClick={onLogout}
                  title="Sign out of Board portal"
                  className="bg-transparent text-black/60 hover:text-wine border border-wine/25 dark:text-neutral-300 dark:border-white/10 px-3 py-2 rounded-md font-bold text-[9px] uppercase tracking-[0.15em] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <LogOut size={11} />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  title="Administrative access keys"
                  className="bg-transparent hover:text-wine text-black/50 dark:text-neutral-400 px-2.5 py-2 rounded-md font-bold text-[9px] uppercase tracking-[0.15em] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Lock size={11} />
                  <span>Admin Portal</span>
                </button>
              )}

              <button 
                onClick={() => {
                  setActiveSection('programs');
                  setActiveSubTab('brem-admission');
                  const element = document.getElementById('workspace-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-wine text-white px-4 lg:px-6 py-2.5 rounded-md font-bold text-[9px] uppercase tracking-[0.15em] hover:bg-black transition-all shadow-2xl shadow-wine/10 text-center flex items-center justify-center whitespace-nowrap"
              >
                Apply Now
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="text-black"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100010] bg-white flex flex-col items-center justify-start py-10 px-6 overflow-y-auto"
          >
            <button
              className="absolute top-6 right-6 text-black hover:text-wine transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            <div className="flex flex-col items-center gap-3.5 w-full max-w-sm mt-10 mb-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <div key={link.name} className="w-full text-center group border-b border-black/5 pb-2.5">
                    <button
                      onClick={() => {
                        setActiveSection(link.section);
                        if (link.dropdown && link.dropdown.length > 0) {
                          setActiveSubTab(link.dropdown[0].tab);
                        }
                        setIsMenuOpen(false);
                        const element = document.getElementById('workspace-section');
                        if (element && link.section !== 'dashboard') {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`text-base font-serif tracking-wide block mx-auto flex items-center justify-center gap-1.5 ${
                        isActive ? 'text-wine font-bold text-lg' : 'text-black'
                      }`}
                    >
                      {link.name === 'Dashboard' && <ShieldAlert size={14} className="text-wine" />}
                      {link.name}
                    </button>
                    {/* Render sub sections underneath main menu directly on mobile */}
                    {link.dropdown && link.dropdown.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1.5 mt-1.5">
                        {link.dropdown.map((subItem) => (
                          <button
                            key={subItem.label}
                            onClick={() => {
                              setActiveSection(link.section);
                              setActiveSubTab(subItem.tab);
                              setIsMenuOpen(false);
                              const element = document.getElementById('workspace-section');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              activeSubTab === subItem.tab && isActive
                                ? 'bg-wine text-white border-wine'
                                : 'bg-offwhite text-black/60 border-border'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isAdminLoggedIn ? (
              <button 
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="bg-transparent border border-wine/40 text-wine hover:bg-wine hover:text-white font-bold px-12 py-3 rounded-lg text-xs uppercase tracking-widest text-center flex items-center justify-center w-full max-w-xs mt-2 transition-colors cursor-pointer"
              >
                Logout Board portal
              </button>
            ) : (
              <button 
                onClick={() => {
                  onOpenAdminLogin();
                  setIsMenuOpen(false);
                }}
                className="bg-transparent border border-black/10 text-black/50 font-bold px-12 py-3 rounded-lg text-xs uppercase tracking-widest text-center flex items-center justify-center w-full max-w-xs mt-2 transition-colors cursor-pointer"
              >
                Board Admin Portal
              </button>
            )}

            <button 
              onClick={() => {
                setActiveSection('programs');
                setActiveSubTab('brem-admission');
                setIsMenuOpen(false);
                const element = document.getElementById('workspace-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-wine text-white px-12 py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest shadow-2xl shadow-wine/20 text-center flex items-center justify-center w-full max-w-xs shrink-0 mt-2 mb-12"
            >
              Apply Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
