import { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, Lock, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../AppContext';
import ThemeToggle from '../ui/ThemeToggle';
import Logo from '../ui/Logo';

export default function Navbar() {
  const {
    activeSection,
    activeSubTab,
    isMenuOpen,
    isAdminLoggedIn,
    setActiveSection,
    setActiveSubTab,
    setMenuOpen,
    logoutUser,
  } = useApp();

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

  interface NavLink {
    name: string;
    href: string;
    section: string;
    isMegaMenu?: boolean;
    categories?: {
      title: string;
      items: { label: string; tab: string }[];
    }[];
    dropdown?: { label: string; tab: string }[];
  }

  const baseLinks: NavLink[] = [
    { 
      name: 'Programs', 
      href: '#workspace-section',
      section: 'programs',
      isMegaMenu: true,
      categories: [
        {
          title: 'UG Programs',
          items: [
            { label: 'B.REM Degree', tab: 'brem-overview' },
            { label: 'BCA Programme', tab: 'bca-overview' }
          ]
        },
        {
          title: 'PG Programs',
          items: [
            { label: 'MCA Programme', tab: 'mca-overview' },
            { label: 'MBA Programme', tab: 'mba-overview' }
          ]
        }
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

  const handleLinkClick = (link: NavLink) => {
    setActiveSection(link.section);
    if (link.isMegaMenu && link.categories && link.categories.length > 0 && link.categories[0].items.length > 0) {
      setActiveSubTab(link.categories[0].items[0].tab);
    } else if (link.dropdown && link.dropdown.length > 0) {
      setActiveSubTab(link.dropdown[0].tab);
    }
    const element = document.getElementById('workspace-section');
    if (element && link.section !== 'dashboard') {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubLinkClick = (section: string, tab: string) => {
    setActiveSection(section);
    setActiveSubTab(tab);
    const element = document.getElementById('workspace-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[100000] transition-all duration-500 ${
          isScrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-6'
        }`}
        id="navbar-root"
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
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="nav-brand-logo"
          >
            <Logo className="h-10 sm:h-12 w-auto" />
          </div>

          <div className="hidden lg:flex items-center gap-3 lg:gap-5" id="desktop-nav-menu">
            {navLinks.map((link) => {
              const isActive = activeSection === link.section;
              return (
                <div key={link.name} className="relative group py-2" id={`nav-wrapper-${link.section}`}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link);
                    }}
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:text-wine transition-colors relative pb-1 flex items-center gap-1 ${
                      isActive ? 'text-wine font-black' : 'text-black/60'
                    }`}
                    id={`nav-link-${link.section}`}
                  >
                    {link.name === 'Dashboard' && <ShieldAlert size={11} className="mr-0.5 text-wine" />}
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-wine transition-all group-hover:w-full ${isActive ? 'w-full' : 'w-0'}`} />
                  </a>

                  {/* Desktop Dropdown Menu */}
                  {link.dropdown && link.dropdown.length > 0 && (
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card backdrop-blur-md border border-border rounded-xl shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-auto z-50"
                      id={`dropdown-menu-${link.section}`}
                    >
                      <div className="flex flex-col">
                        {link.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubLinkClick(link.section, subItem.tab);
                            }}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black/70 hover:text-wine hover:bg-wine-light transition-all text-left ${
                              activeSubTab === subItem.tab && isActive ? 'text-wine bg-wine-light font-black' : ''
                            }`}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {link.isMegaMenu && link.categories && (
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[440px] bg-card backdrop-blur-md border border-border rounded-2xl shadow-xl p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-auto z-[100050]"
                      id={`megamenu-${link.section}`}
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {link.categories.map((category) => (
                          <div key={category.title} className="space-y-3">
                            <span className="text-[9px] font-black tracking-widest text-[#a3a3a3] uppercase border-b border-border/40 pb-1.5 block">
                              {category.title}
                            </span>
                            <div className="flex flex-col gap-1">
                              {category.items.map((subItem) => (
                                <a
                                  key={subItem.label}
                                  href={link.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSubLinkClick(link.section, subItem.tab);
                                  }}
                                  className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-black/70 hover:text-wine hover:bg-wine-light rounded-lg transition-all text-left block ${
                                    activeSubTab === subItem.tab && isActive ? 'text-wine bg-wine-light font-black' : ''
                                  }`}
                                >
                                  {subItem.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex items-center gap-2.5 lg:gap-3.5" id="nav-actions-container">
              <ThemeToggle />

              {isAdminLoggedIn && (
                <button
                  onClick={() => logoutUser()}
                  title="Sign out of Board portal"
                  className="bg-transparent text-black/60 hover:text-wine border border-wine/25 dark:text-neutral-300 dark:border-white/10 px-3 py-2 rounded-md font-bold text-[9px] uppercase tracking-[0.15em] transition-all flex items-center gap-1 cursor-pointer"
                  id="nav-logout-btn"
                >
                  <LogOut size={11} />
                  <span>Logout</span>
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
                className="bg-wine text-white px-4 lg:px-6 py-2.5 rounded-md font-bold text-[9px] uppercase tracking-[0.15em] hover:bg-black transition-all shadow-2xl shadow-wine/10 text-center flex items-center justify-center whitespace-nowrap cursor-pointer"
                id="nav-apply-now-btn"
              >
                Apply Now
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3" id="mobile-nav-actions">
            <ThemeToggle />
            <button
              className="text-black cursor-pointer"
              onClick={() => setMenuOpen(true)}
              id="mobile-menu-trigger-btn"
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
            className="fixed inset-0 z-[100010] bg-white dark:bg-zinc-950 flex flex-col items-center justify-start py-10 px-6 overflow-y-auto"
            id="mobile-nav-overlay"
          >
            <button
              className="absolute top-6 right-6 text-black dark:text-zinc-300 hover:text-wine dark:hover:text-wine transition-colors cursor-pointer"
              onClick={() => setMenuOpen(false)}
              id="mobile-menu-close-btn"
            >
              <X size={28} />
            </button>

            <Logo className="h-12 w-auto mb-10" />

            <div className="flex flex-col items-center gap-6 w-full max-w-sm" id="mobile-nav-links">
              {navLinks.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <div key={link.name} className="w-full text-center" id={`mobile-link-wrapper-${link.section}`}>
                    <button
                      onClick={() => {
                        handleLinkClick(link);
                        setMenuOpen(false);
                      }}
                      className={`text-[13px] font-black uppercase tracking-[0.25em] py-2 transition-all cursor-pointer ${
                        isActive ? 'text-wine scale-105' : 'text-black/60 dark:text-zinc-400'
                      }`}
                    >
                      {link.name}
                    </button>

                    {link.dropdown && link.dropdown.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
                        {link.dropdown.map((subItem) => (
                          <button
                            key={subItem.label}
                            onClick={() => {
                              handleSubLinkClick(link.section, subItem.tab);
                              setMenuOpen(false);
                            }}
                            className={`text-[8px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                              activeSubTab === subItem.tab && isActive
                                ? 'bg-wine text-white border-wine'
                                : 'bg-neutral-50 dark:bg-zinc-900 text-black/60 dark:text-zinc-300 border-border dark:border-white/10 hover:border-black/20'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {link.isMegaMenu && link.categories && (
                      <div className="mt-2.5 space-y-3">
                        {link.categories.map((category) => (
                          <div key={category.title} className="space-y-1">
                            <span className="text-[8px] font-black tracking-widest text-[#737373] uppercase block">
                              {category.title}
                            </span>
                            <div className="flex flex-wrap justify-center gap-1">
                              {category.items.map((subItem) => (
                                <button
                                  key={subItem.label}
                                  onClick={() => {
                                    handleSubLinkClick(link.section, subItem.tab);
                                    setMenuOpen(false);
                                  }}
                                  className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    activeSubTab === subItem.tab && isActive
                                      ? 'bg-wine text-white border-wine'
                                      : 'bg-neutral-50 dark:bg-zinc-900 text-black/60 dark:text-zinc-300 border-border dark:border-white/10 hover:border-black/20'
                                  }`}
                                >
                                  {subItem.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="h-px bg-border dark:bg-white/10 w-full my-4" />

              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    logoutUser();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-neutral-100 dark:bg-zinc-900 hover:bg-neutral-200 dark:hover:bg-zinc-800 text-black dark:text-white font-bold border border-border dark:border-white/10 text-[10px] uppercase tracking-widest text-center py-3.5 rounded-xl cursor-pointer"
                  id="mobile-nav-logout-btn"
                >
                  Sign Out Portal
                </button>
              )}

              <button
                onClick={() => {
                  setActiveSection('programs');
                  setActiveSubTab('brem-admission');
                  setMenuOpen(false);
                  const element = document.getElementById('workspace-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-wine text-white font-bold text-[10px] uppercase tracking-widest text-center py-4 rounded-xl cursor-pointer"
                id="mobile-nav-apply-btn"
              >
                Apply Admission
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
