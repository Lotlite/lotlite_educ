import { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, Lock, LogOut, ChevronDown } from 'lucide-react';
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
    setAdminLoginOpen,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

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
      name: 'Home',
      href: '#',
      section: 'home'
    },
    { 
      name: 'Programs', 
      href: '#workspace-section',
      section: 'programs',
      isMegaMenu: true,
      categories: [
        {
          title: 'UG Programs',
          items: [
            { label: 'BBA Programme', tab: 'bba-overview' }
          ]
        },
        {
          title: 'PG Programs',
          items: [
            { label: 'MBA Programme', tab: 'mba-overview' }
          ]
        }
      ]
    },
    {
      name: 'Incubation',
      href: '#workspace-section',
      section: 'incubation'
    },
    {
      name: 'Admissions',
      href: '#workspace-section',
      section: 'admissions'
    },
    { 
      name: 'About', 
      href: '#workspace-section',
      section: 'about',
      dropdown: [
        { label: 'Why Lotlite?', tab: 'why-ssi' },
        { label: 'Our Founders', tab: 'founders' },
        { label: 'Academic board and faculty', tab: 'all' },
        { label: 'Intellectual papers', tab: 'research' }
      ]
    },
    { 
      name: 'Blogs', 
      href: '#workspace-section',
      section: 'blogs'
    }
  ];

  const navLinks = [...baseLinks];
  // Admin panel option disabled for now
  /*
  navLinks.push({
    name: isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Panel',
    href: '#',
    section: 'dashboard',
    dropdown: []
  });
  */

  const handleLinkClick = (link: NavLink) => {
    if (link.section === 'dashboard') {
      if (isAdminLoggedIn) {
        setActiveSection('dashboard');
      } else {
        setAdminLoginOpen(true);
      }
      return;
    }
    if (link.section === 'home') {
      setActiveSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveSection(link.section);
    if (link.isMegaMenu && link.categories && link.categories.length > 0 && link.categories[0].items.length > 0) {
      setActiveSubTab(link.categories[0].items[0].tab);
    } else if (link.dropdown && link.dropdown.length > 0) {
      setActiveSubTab(link.dropdown[0].tab);
    } else if (link.section === 'blogs') {
      setActiveSubTab('insights');
    } else if (link.section === 'incubation') {
      setActiveSubTab('program');
    }
    const element = document.getElementById('workspace-section');
    if (element && link.section !== 'dashboard') {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubLinkClick = (section: string, tab: string) => {
    setActiveSection(section);
    setActiveSubTab(tab);
    
    // Manage routing state for specific program pages
    if (tab === 'bba-overview') {
      window.history.pushState({}, '', '/bba');
    } else if (tab === 'mba-overview') {
      window.history.pushState({}, '', '/mba');
    }
    
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
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:text-wine transition-colors relative pb-1 flex items-center gap-1.5 ${
                      isActive ? 'text-wine font-black' : 'text-black/60'
                    }`}
                    id={`nav-link-${link.section}`}
                  >
                    {(link.name === 'Admin Panel' || link.name === 'Admin Dashboard' || link.name === 'Dashboard') && <ShieldAlert size={11} className="mr-0.5 text-wine" />}
                    <span>{link.name}</span>
                    {((link.dropdown && link.dropdown.length > 0) || link.isMegaMenu) && (
                      <ChevronDown size={10} className="text-black/40 group-hover:text-wine group-hover:rotate-180 transition-transform duration-300" />
                    )}
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
                                  href={subItem.tab === 'bba-overview' ? '/bba' : subItem.tab === 'mba-overview' ? '/mba' : link.href}
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
                  setActiveSection('admissions');
                  setActiveSubTab('all-applications');
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
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[100005]"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-out professional drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-[100010] w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-950 flex flex-col p-6 sm:p-8 shadow-2xl border-l border-neutral-100 dark:border-zinc-800/80"
              id="mobile-nav-overlay"
            >
              {/* Header - Constant */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-zinc-900 shrink-0">
                <Logo className="h-10 w-auto" />
                <button
                  className="p-2 rounded-xl border border-neutral-100 dark:border-zinc-800 text-black dark:text-zinc-300 hover:text-wine dark:hover:text-wine hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    setExpandedMobileMenu(null);
                  }}
                  id="mobile-menu-close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Link list */}
              <div className="flex-1 overflow-y-auto py-5 pr-1 -mr-1" id="mobile-nav-links-scrollable">
                <div className="flex flex-col gap-1 text-left" id="mobile-nav-links">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.section;
                    const hasSubOptions = (link.dropdown && link.dropdown.length > 0) || link.isMegaMenu;
                    const isExpanded = expandedMobileMenu === link.name;

                    return (
                      <div 
                        key={link.name} 
                        className="border-b border-neutral-50/50 dark:border-zinc-900/40 last:border-0 pb-1.5" 
                        id={`mobile-link-wrapper-${link.section}`}
                      >
                        <div className="flex items-center justify-between py-1">
                          <button
                            onClick={() => {
                              if (hasSubOptions) {
                                setExpandedMobileMenu(isExpanded ? null : link.name);
                              } else {
                                handleLinkClick(link);
                                setMenuOpen(false);
                              }
                            }}
                            className={`text-xs font-bold uppercase tracking-[0.2em] py-2.5 transition-all text-left flex items-center gap-2 cursor-pointer flex-1 ${
                              isActive ? 'text-wine font-black' : 'text-black/80 dark:text-zinc-200 hover:text-wine'
                            }`}
                          >
                            {(link.name === 'Admin Panel' || link.name === 'Admin Dashboard' || link.name === 'Dashboard') && <ShieldAlert size={12} className="text-wine" />}
                            <span>{link.name}</span>
                          </button>

                          {hasSubOptions && (
                            <button
                              onClick={() => setExpandedMobileMenu(isExpanded ? null : link.name)}
                              className="p-2.5 text-black/40 hover:text-wine dark:text-zinc-500 cursor-pointer transition-colors"
                            >
                              <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-wine' : ''}`} />
                            </button>
                          )}
                        </div>

                        {/* Animated Expandable Sub-options */}
                        <AnimatePresence initial={false}>
                          {hasSubOptions && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden bg-neutral-50/50 dark:bg-zinc-900/20 rounded-xl px-4 py-3 mt-1.5 space-y-2 border border-neutral-100/50 dark:border-zinc-900/30"
                            >
                              {/* MegaMenu Style Categories */}
                              {link.isMegaMenu && link.categories ? (
                                link.categories.map((cat) => (
                                  <div key={cat.title} className="space-y-1 pb-1 last:pb-0">
                                    <span className="text-[8px] font-black tracking-widest text-[#a3a3a3] uppercase block border-b border-neutral-100/30 pb-1">
                                      {cat.title}
                                    </span>
                                    <div className="flex flex-col gap-1 pt-1">
                                      {cat.items.map((subItem) => (
                                        <button
                                          key={subItem.label}
                                          onClick={() => {
                                            handleSubLinkClick(link.section, subItem.tab);
                                            setMenuOpen(false);
                                            setExpandedMobileMenu(null);
                                          }}
                                          className={`w-full text-left py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-wine flex items-center justify-between ${
                                            activeSubTab === subItem.tab && isActive
                                              ? 'text-wine font-black'
                                              : 'text-black/70 dark:text-zinc-400'
                                          }`}
                                        >
                                          <span>{subItem.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                /* Regular Dropdown List */
                                <div className="flex flex-col gap-1">
                                  {link.dropdown?.map((subItem) => (
                                    <button
                                      key={subItem.label}
                                      onClick={() => {
                                        handleSubLinkClick(link.section, subItem.tab);
                                        setMenuOpen(false);
                                        setExpandedMobileMenu(null);
                                      }}
                                      className={`w-full text-left py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-wine flex items-center justify-between ${
                                        activeSubTab === subItem.tab && isActive
                                          ? 'text-wine font-black'
                                          : 'text-black/70 dark:text-zinc-400'
                                      }`}
                                    >
                                      <span>{subItem.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Actions - Constant */}
              <div className="pt-4 border-t border-neutral-100 dark:border-zinc-900 space-y-3 shrink-0">
                {isAdminLoggedIn && (
                  <button
                    onClick={() => {
                      logoutUser();
                      setMenuOpen(false);
                      setExpandedMobileMenu(null);
                    }}
                    className="w-full bg-neutral-100 dark:bg-zinc-900 hover:bg-neutral-200 dark:hover:bg-zinc-800 text-black dark:text-white font-bold border border-border dark:border-white/10 text-[10px] uppercase tracking-widest text-center py-3 rounded-xl cursor-pointer transition-colors"
                    id="mobile-nav-logout-btn"
                  >
                    Sign Out Portal
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveSection('admissions');
                    setActiveSubTab('all-applications');
                    setMenuOpen(false);
                    setExpandedMobileMenu(null);
                    const element = document.getElementById('workspace-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-wine hover:bg-black text-white font-bold text-[10px] uppercase tracking-widest text-center py-3.5 rounded-xl cursor-pointer shadow-md transition-colors"
                  id="mobile-nav-apply-btn"
                >
                  Apply Admission
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
