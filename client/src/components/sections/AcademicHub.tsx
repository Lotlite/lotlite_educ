import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  Cpu, 
  Rocket, 
  HandCoins, 
  Target, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Award, 
  BookOpen, 
  ClipboardList,
  GraduationCap,
  Briefcase,
  X,
  ExternalLink,
  ChevronLeft,
  Search,
  BookOpenCheck,
  ChevronDown,
  Mail,
  Phone,
  Building2,
  Share2,
  Bookmark,
  Check,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../AppContext';


interface AcademicHubProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

export default function AcademicHub({
  activeSection,
  setActiveSection,
  activeSubTab,
  setActiveSubTab
}: AcademicHubProps) {
  const {
    blogs,
    faqs: allFaqs,
    fetchBlogs,
    fetchFaqs,
    submitApplicant,
    triggerToast,
  } = useApp();

  useEffect(() => {
    fetchBlogs();
    fetchFaqs();
  }, []);

  // Local form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProgram, setFormProgram] = useState('B.REM in Real Estate Management & Investment');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Proposal form states
  const [proposalName, setProposalName] = useState('');
  const [proposalEmail, setProposalEmail] = useState('');
  const [proposalTopic, setProposalTopic] = useState('');
  const [proposalAbstract, setProposalAbstract] = useState('');
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  // Modal expanders
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  // FAQ States
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Alumni Carousel index
  const [alumniIndex, setAlumniIndex] = useState(0);

  // Blog filters
  const [blogFilter, setBlogFilter] = useState('All');

  // Course Selector States
  const [activeCourse, setActiveCourse] = useState<'brem' | 'bca' | 'mca' | 'mba'>('brem');
  const [ugOpen, setUgOpen] = useState(true);
  const [pgOpen, setPgOpen] = useState(false);

  // Mobile submenu scroll indicators
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);

  const handleMobileScroll = () => {
    const el = mobileScrollRef.current;
    if (el) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        setScrollRatio(el.scrollLeft / maxScroll);
      } else {
        setScrollRatio(0);
      }
    }
  };

  // Adjust scroll and keep selected option fully visible in mobile view
  useEffect(() => {
    setOpenFaq(null);
    const el = mobileScrollRef.current;
    if (el) {
      const timer = setTimeout(() => {
        const menus = sidebarMenus[activeSection as keyof typeof sidebarMenus] || [];
        
        let derivedOption = 'overview';
        if (activeSubTab.startsWith('pg-')) {
          derivedOption = activeSubTab.replace('pg-', '');
        } else if (activeSubTab.startsWith('brem-')) {
          derivedOption = activeSubTab.replace('brem-', '');
        }

        const activeItemIndex = menus.findIndex(item => {
          if (activeSection === 'programs') {
            return derivedOption === item.id;
          }
          return activeSubTab === item.id;
        });

        if (activeItemIndex !== -1) {
          const buttons = el.querySelectorAll('button');
          const activeButton = buttons[activeItemIndex];
          if (activeButton) {
            const containerWidth = el.clientWidth;
            const btnLeft = (activeButton as HTMLElement).offsetLeft;
            const btnWidth = (activeButton as HTMLElement).clientWidth;
            
            // Center the selected button smoothly inside the scrolling container
            const targetScrollLeft = btnLeft - (containerWidth / 2) + (btnWidth / 2);
            el.scrollTo({
              left: targetScrollLeft,
              behavior: 'smooth'
            });
          }
        }
        // Force calculation of scroll ratio
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          setScrollRatio(el.scrollLeft / maxScroll);
        } else {
          setScrollRatio(0);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeSection, activeSubTab]);

  // Lock body scroll when target modal is active to prevent background scrolling
  useEffect(() => {
    if (selectedCase || selectedBlog) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: true } }));
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: false } }));
    }
    return () => {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: false } }));
    };
  }, [selectedCase, selectedBlog]);

  // Static Data lists
  const founders = [
    {
      name: "Rohan Shah",
      role: "Director of Sales",
      company: "Hiranandani Group",
      bio: "Active Mentor · Avid real estate investor with 12+ years luxury portfolio experience. ROHAN translates property acquisition theory into practical sales masterclasses.",
      education: "Stanford GSB Alumnus",
      tags: ["Luxury Sales", "Investing", "Advisory"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Vikram Aatrey",
      role: "PropTiger Founder",
      company: "Ex-Magicbricks Architect",
      bio: "Urgently scaling Indian proptech. VIKRAM built multi-million dollar search engines and now trains students on algorithmic pricing and real estate tech funding.",
      education: "IIT Bombay Graduate",
      tags: ["Technology", "PropTech", "VC Pitching"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Anita Khanna",
      role: "Group Chief Financial Officer",
      company: "Hiranandani & Lodha alliances",
      bio: "Distinguished financial wizard. ANITA steers active capital deployment, liquidity frameworks, REIT setups, and private equity deals within Indian metros.",
      education: "Delhi School of Economics",
      tags: ["REITs", "Direct Mergers", "Finance"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Mihir M",
      role: "NoBroker Founder",
      company: "Ex-Flipkart Growth Director",
      bio: "Pioneered peer-to-peer digital listings. MIHIR guides zero-CAC frameworks, tech monetization, and brokerage agent workflows inside Lotlite's practical sprints.",
      education: "IIT Kanpur Alumnus",
      tags: ["Growth Marketing", "Automations", "P2P Systems"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Abhinav Bansal",
      role: "Square Yards Co-Founder",
      company: "Ex-CBRE Managing Director",
      bio: "Global real estate authority. ABHINAV leads the Property Strategy Lab on campus, connecting student project teams to critical institutional accounts.",
      education: "IIM Ahmedabad Alumnus",
      tags: ["Global Brokerage", "SaaS Markets", "Strategy"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Varun Khaitan",
      role: "Managing Director",
      company: "Knight Frank Advisory",
      bio: "Infrastructure masterplanner. VARUN brings corporate advisory algorithms, feasibility mapping, and portfolio valuation frameworks to our classrooms.",
      education: "IIT Kanpur | Ex-BCG Manager",
      tags: ["Consulting", "Feasibility", "Masterplanning"],
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=450&q=80"
    }
  ];

  const faculty = [
    {
      name: "Anil Bassamboo",
      course: "Real Estate Operations",
      title: "Professor of Decision Sciences & Operations, MIT Real Estate Center",
      overview: "Learn how massive real estate portfolios operate at scale — from process pipelines to asset analytics — utilising robust structures and live modeling.",
      tags: ["MIT Center", "Stanford", "RICS Expert"],
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Tim Calkins",
      course: "Brand & Marketing Strategy",
      title: "Kellogg School of Management, Northwestern University",
      overview: "Study how real estate brands command exceptional margins. Analyze Hiranandani's legacy positioning and the premium reputation architecture of global properties.",
      tags: ["Kellogg Professor", "Harvard", "Brand Author"],
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Siddarth Menon",
      course: "Digital PropTech & Marketing",
      title: "Marketing Strategy Lead, Ex-CMO Square Yards",
      overview: "Deploy live lead-generation campaigns using true developer metrics. Master paid and organic distribution channels that capture modern property buyers.",
      tags: ["Square Yards CMO", "PropTech Maven", "SaaS Builder"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Prof. Sundar Venkatesh",
      course: "Real Estate Valuation & Finance",
      title: "Distinguished learning advisor working with global REIT managers",
      overview: "Master the mechanics of capital budgeting, discounted cashflows, and tax calculations necessary to evaluate real estate assets accurately.",
      tags: ["ISB Faculty", "Valuation Jury", "REIT Advisor"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=450&q=80"
    }
  ];

  const alumni = [
    { name: "Sanchit Madhura", role: "Chief of Staff", company: "Epigamia", batch: "2025", package: "14.5 LPA", review: "The case study methods here are unmatched. Moving directly from student pitches to a Chief of Staff role at Epigamia was facilitated entirely by founder mentorship." },
    { name: "Arvind Girish", role: "Sales Lead", company: "Lodha Group", batch: "2025", package: "12.0 LPA", review: "Selling actual high-end luxury assets during practical labs gave me the commercial confidence to run high-volume portfolios at Lodha." },
    { name: "Harshit Maheshwari", role: "PropTech PM", company: "99acres", batch: "2024", package: "11.2 LPA", review: "The AI & PropTech Term gave me the programming logic and product vision to lead digital tools inside India's premier property marketplace." },
    { name: "Ruheen Singh", role: "Growth Manager", company: "NoBroker", batch: "2024", package: "10.8 LPA", review: "My zero-CAC model built in Lotlite's build sprint was acquired by NoBroker, land-marking my pathway directly into a full leadership role." }
  ];

  const cases = [
    {
      founder: "Utkarsh Gupta",
      company: "Cosmos Realty",
      problem: "Scale residential operations across the Mumbai Metropolitan Region (MMR) while preserving Cosmos' ultra-premium legacy branding.",
      tag: "Brand Strategy",
      solution: "Students deployed a spatial-filtering framework and built 100+ high-wealth buyer surveys. Result: selected 2 target MMR pockets and launched a local sales sprint generating 400 qualified leads.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Anil Goteti",
      company: "Scapia Living",
      problem: "Formulate user engagement vectors and co-living loyalty incentives to scale tenant retention beyond 18 months in tech parks.",
      tag: "Growth Loop",
      solution: "Engineered an offline-to-online community portal featuring workspace credits and regional real estate networking hubs. Tenant retention increased by 35% in early pilots.",
      image: "https://images.unsplash.com/photo-1504384308090-c89e1224ad8f?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Vibha Harish",
      company: "CoSmix Realty",
      problem: "Optimize top-of-funnel broker discovery and organic viral marketing channels for premium villa land plots in Outskirts of Bengaluru.",
      tag: "Growth Loop",
      solution: "Architected a WhatsApp-driven geographic referral engine and beautiful 3D drone land views. Resulted in a 4X raise in organic qualified plot visits within 60 days.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Shamika Haldipurkar",
      company: "d'you Spaces",
      problem: "Launch, market, and distribute d'you Spaces' flexible coworking slots through instant-access digital logistics.",
      tag: "Sales Framework",
      solution: "Integrated dynamic pricing models with popular quick-office channels, enabling local freelancers to book hotdesks within 90 seconds. Scaled bookings to 500+ weekly hours.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Varun Khaitan",
      company: "Urban Property",
      problem: "Improve Net Promoter Scores (NPS) of the high-volume lease property management division operating above ₹80Cr ARR.",
      tag: "Sales Framework",
      solution: "Built a mobile-first automated diagnostic portal matching local technicians to lease tenants, cutting ticket resolution from 5 days to 4 hours. Checked a rise in NPS by 35 points.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Vivek Sinha",
      company: "Emversity Properties",
      problem: "Bridge digital marketing efficiency to achieve customer acquisition cost (CAC) reduction below 12% across suburban developments.",
      tag: "Growth Loop",
      solution: "Developed highly targeted spatial brokerage ads paired with physical localized weekend property tea-clubs, reducing reliance on expensive listing hubs. CAC dropped by 22%.",
      image: "https://images.unsplash.com/photo-1512403754473-27855f33d0fc?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Blogs are now synchronized seamlessly from Redux blogs slice state and local storage API proxy
  
  // FAQs are now loaded dynamically from Redux faq slice and server-side REST API
  const faqs = allFaqs.filter(f => f.category === 'brem');
  const pgFaqs = allFaqs.filter(f => f.category === 'pg');
  const bcaFaqs = allFaqs.filter(f => f.category === 'bca');
  const mcaFaqs = allFaqs.filter(f => f.category === 'mca');
  const mbaFaqs = allFaqs.filter(f => f.category === 'mba');

  // Auto-switch outcomes carousel
  useEffect(() => {
    if (activeSection !== 'outcomes') return;
    const interval = setInterval(() => {
      setAlumniIndex((prev) => (prev + 1) % alumni.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeSection]);

  const filteredBlogs = blogFilter === 'All' ? blogs : blogs.filter(b => b.category === blogFilter);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) return;
    
    // Submit through central app context
    submitApplicant({
      name: formName,
      email: formEmail,
      phone: formPhone,
      program: formProgram,
      background: 'Admissions Inquiry Portal Lead',
      experience: 'Form submitted on lotlite.org under programs catalog'
    });
    
    triggerToast({
      title: "Application Received",
      description: `Logged application for ${formName} under ${formProgram}`,
      type: 'success'
    });

    setIsSubmitted(true);
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalName || !proposalEmail || !proposalTopic || !proposalAbstract) return;
    setProposalSubmitted(true);
  };

  // Synchronize Program and Option state mapping for consistent routing
  let currentOption = 'overview';

  if (activeSubTab.startsWith('pg-')) {
    currentOption = activeSubTab.replace('pg-', '');
  } else if (activeSubTab.startsWith('brem-')) {
    currentOption = activeSubTab.replace('brem-', '');
  } else if (activeSubTab.startsWith('bca-')) {
    currentOption = activeSubTab.replace('bca-', '');
  } else if (activeSubTab.startsWith('mca-')) {
    currentOption = activeSubTab.replace('mca-', '');
  } else if (activeSubTab.startsWith('mba-')) {
    currentOption = activeSubTab.replace('mba-', '');
  } else {
    // fallback or legacy mapping
    if (activeSubTab === 'pg') {
      currentOption = 'overview';
    } else {
      currentOption = 'overview';
    }
  }

  const selectProgramOption = (course: 'brem' | 'bca' | 'mca' | 'mba', option: string) => {
    setActiveSubTab(`${course}-${option}`);
  };

  useEffect(() => {
    if (activeSubTab.startsWith('pg-')) {
      if (activeCourse !== 'mca' && activeCourse !== 'mba') {
        setActiveCourse('mca');
      }
    } else if (activeSubTab.startsWith('brem-')) {
      if (activeCourse !== 'brem' && activeCourse !== 'bca') {
        setActiveCourse('brem');
      }
    } else if (activeSubTab.startsWith('bca-')) {
      setActiveCourse('bca');
    } else if (activeSubTab.startsWith('mca-')) {
      setActiveCourse('mca');
    } else if (activeSubTab.startsWith('mba-')) {
      setActiveCourse('mba');
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (activeCourse === 'brem' || activeCourse === 'bca') {
      setUgOpen(true);
      setPgOpen(false);
    } else {
      setPgOpen(true);
      setUgOpen(false);
    }
  }, [activeCourse]);

  // Define sidebars options
  const sidebarMenus = {
    programs: [
      { id: 'overview', label: 'Overview', icon: BookOpen },
      { id: 'objective', label: 'Programme Objective', icon: Target },
      { id: 'structure', label: 'Programme Structure', icon: ClipboardList },
      { id: 'admission', label: 'Admission Process', icon: GraduationCap },
      { id: 'fees', label: 'Fees Structure', icon: HandCoins },
      { id: 'exam', label: 'Examination', icon: Award },
      { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
      { id: 'contact', label: 'Contact Details', icon: MapPin },
    ],
    about: [
      { id: 'why-ssi', label: 'Why SSI & Legacy', icon: Sparkles },
      { id: 'founders', label: 'Our Founders & Board', icon: Users },
    ],
    faculty: [
      { id: 'all', label: 'Eminent Faculty Board', icon: Users },
      { id: 'research', label: 'Research & Syllabi', icon: BookOpenCheck },
    ],
    outcomes: [
      { id: 'stats', label: 'Placements & CTC Stats', icon: Briefcase },
      { id: 'carousel', label: 'Alumni Success Stories', icon: ChevronRight },
    ],
    incubation: [
      { id: 'ventures', label: 'Venture Labs Overview', icon: Cpu },
      { id: 'cases', label: 'Student Case Projects', icon: ClipboardList },
    ],
    blogs: [
      { id: 'insights', label: 'Sprints & Chronicle', icon: BookOpen },
      { id: 'propose', label: 'Proposals & Submissions', icon: ClipboardList },
    ]
  };

  // Helper title names for the outer section
  const sectionHeadings: Record<string, { tag: string; title: string; desc: string }> = {
    programs: {
      tag: "PROFESSIONAL REAL ESTATE CURRICULA",
      title: "Academic Programs",
      desc: "Choose your path. Taught in accordance with RICS guidelines, directed by seasoned developers and expert startup venture owners."
    },
    about: {
      tag: "FOUNDER LED PEDAGOGY",
      title: "About SSI & Legacy",
      desc: "Real industry leadership. We trace our legacy directly to pioneering developers, replacing classical textbook memorization with street-smart real deal-making."
    },
    faculty: {
      tag: "EMINENT ACADEMIC BOARD",
      title: "Faculty & Experts",
      desc: "Professors who have engineered actual landmarks. Browse profiles of active corporate chiefs, economists, and real estate researchers."
    },
    outcomes: {
      tag: "VERIFIED PLACEMENT RESULTS",
      title: "Alumni Outcomes",
      desc: "Track real CTC results, career trajectories, and placements analytics from our past three student cohorts."
    },
    incubation: {
      tag: "STUDENT VENTURE ACCELEROMETER",
      title: "Incubation & Projects",
      desc: "Access a robust ₹5Cr venture pool. Support student proptech prototypes moving cleanly from beta deployment to monetization."
    },
    blogs: {
      tag: "PERSPECTIVES & REAL ESTATE REVIEWS",
      title: "Sprints & Chronicle",
      desc: "Read the analytical studies on artificial intelligence, pricing mechanics, and spatial urban changes transforming Indian development."
    }
  };

  const currentMetadata = sectionHeadings[activeSection] || { tag: '', title: '', desc: '' };
  const currentSidebarOptions = sidebarMenus[activeSection as keyof typeof sidebarMenus] || [];

  const isModalViewActive = !!(selectedCase || selectedBlog);

  return (
    <div className={`py-6 pb-6 relative scroll-mt-24 ${isModalViewActive ? 'z-[99999]' : 'z-10'}`} id="academic-hub">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-12 bg-white/75 backdrop-blur-lg rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm border border-border">
        
        {/* ======================= GLOBAL HEADER ELEMENT FOR ACTIVE SECTION ======================= */}
        <div className="border-b border-black/5 dark:border-white/5 pb-8 mb-10 text-center md:text-left">
          <span className="text-wine text-xs font-bold uppercase tracking-[0.4em] block mb-3">
            {currentMetadata.tag}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-black font-serif leading-none">
            {currentMetadata.title}
          </h2>
          <p className="text-muted dark:text-neutral-400 text-sm mt-4 max-w-3xl font-medium leading-relaxed">
            {currentMetadata.desc}
          </p>
        </div>

               {/* ======================= TOP LEVEL PROGRAM SELECTOR (NEW HORIZONTAL LAYOUT) ======================= */}
        {activeSection === 'programs' && (
          <div className="mb-8 w-full" id="top-program-selector" data-aos="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border/40 dark:border-white/5 pb-6">
              {/* Undergraduate Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-wine"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                    Undergraduate Programs
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* B.REM Course Card */}
                  <button
                    onClick={() => {
                      setActiveCourse('brem');
                      selectProgramOption('brem', currentOption);
                    }}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group ${
                      activeCourse === 'brem'
                        ? 'border-wine dark:border-2 dark:border-white bg-wine/[0.03] dark:bg-white/[0.03] shadow-md shadow-wine/5 ring-1 ring-wine/20'
                        : 'border-border dark:border-white/10 bg-white dark:bg-zinc-900/40 hover:bg-neutral-50/75 dark:hover:bg-zinc-800/40'
                    }`}
                    id="course-selector-brem"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeCourse === 'brem' ? 'bg-wine-light dark:bg-red-950/40 text-wine dark:text-red-500 font-bold' : 'bg-neutral-100 dark:bg-white text-neutral-600 dark:text-zinc-600'
                      }`}>
                        <GraduationCap size={15} />
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${
                        activeCourse === 'brem' ? 'bg-wine/10 text-wine border-wine/20' : 'bg-neutral-50 dark:bg-zinc-800 text-neutral-450 border-neutral-150 dark:border-white/5'
                      }`}>
                        4 Years
                      </span>
                    </div>
                    
                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-black tracking-tight">
                        B.REM Degree
                      </h4>
                      <p className="text-[9px] text-muted leading-tight mt-0.5 font-medium group-hover:text-black transition-colors">
                        Real Estate Management
                      </p>
                    </div>

                    {activeCourse === 'brem' && (
                      <div className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-wine"></span>
                      </div>
                    )}
                  </button>

                  {/* BCA Course Card */}
                  <button
                    onClick={() => {
                      setActiveCourse('bca');
                      selectProgramOption('bca', currentOption);
                    }}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group ${
                      activeCourse === 'bca'
                        ? 'border-wine dark:border-2 dark:border-white bg-wine/[0.03] dark:bg-white/[0.03] shadow-md shadow-wine/5 ring-1 ring-wine/20'
                        : 'border-border dark:border-white/10 bg-white dark:bg-zinc-900/40 hover:bg-neutral-50/75 dark:hover:bg-zinc-800/40'
                    }`}
                    id="course-selector-bca"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeCourse === 'bca' ? 'bg-wine-light dark:bg-red-950/40 text-wine dark:text-red-500 font-bold' : 'bg-neutral-100 dark:bg-white text-neutral-600 dark:text-zinc-600'
                      }`}>
                        <Cpu size={15} />
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${
                        activeCourse === 'bca' ? 'bg-wine/10 text-wine border-wine/20' : 'bg-neutral-50 dark:bg-zinc-800 text-neutral-450 border-neutral-150 dark:border-white/5'
                      }`}>
                        3 Years
                      </span>
                    </div>
                    
                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-black tracking-tight">
                        BCA Program
                      </h4>
                      <p className="text-[9px] text-muted leading-tight mt-0.5 font-medium group-hover:text-black transition-colors">
                        PropTech AI & Systems
                      </p>
                    </div>

                    {activeCourse === 'bca' && (
                      <div className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-wine"></span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Postgraduate Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-wine"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                    Postgraduate Programs
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* MCA Course Card */}
                  <button
                    onClick={() => {
                      setActiveCourse('mca');
                      selectProgramOption('mca', currentOption);
                    }}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group ${
                      activeCourse === 'mca'
                        ? 'border-wine dark:border-2 dark:border-white bg-wine/[0.03] dark:bg-white/[0.03] shadow-md shadow-wine/5 ring-1 ring-wine/20'
                        : 'border-border dark:border-white/10 bg-white dark:bg-zinc-900/40 hover:bg-neutral-50/75 dark:hover:bg-zinc-800/40'
                    }`}
                    id="course-selector-mca"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeCourse === 'mca' ? 'bg-wine-light dark:bg-red-950/40 text-wine dark:text-red-500 font-bold' : 'bg-neutral-100 dark:bg-white text-neutral-600 dark:text-zinc-600'
                      }`}>
                        <Award size={15} />
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${
                        activeCourse === 'mca' ? 'bg-wine/10 text-wine border-wine/20' : 'bg-neutral-50 dark:bg-zinc-800 text-neutral-450 border-neutral-150 dark:border-white/5'
                      }`}>
                        2 Years
                      </span>
                    </div>
                    
                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-black tracking-tight">
                        MCA Program
                      </h4>
                      <p className="text-[9px] text-muted leading-tight mt-0.5 font-medium group-hover:text-black transition-colors">
                        PropTech Deep Systems
                      </p>
                    </div>

                    {activeCourse === 'mca' && (
                      <div className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-wine"></span>
                      </div>
                    )}
                  </button>

                  {/* MBA Course Card */}
                  <button
                    onClick={() => {
                      setActiveCourse('mba');
                      selectProgramOption('mba', currentOption);
                    }}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group ${
                      activeCourse === 'mba'
                        ? 'border-wine dark:border-2 dark:border-white bg-wine/[0.03] dark:bg-white/[0.03] shadow-md shadow-wine/5 ring-1 ring-wine/20'
                        : 'border-border dark:border-white/10 bg-white dark:bg-zinc-900/40 hover:bg-neutral-50/75 dark:hover:bg-zinc-800/40'
                    }`}
                    id="course-selector-mba"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeCourse === 'mba' ? 'bg-wine-light dark:bg-red-950/40 text-wine dark:text-red-500 font-bold' : 'bg-neutral-100 dark:bg-white text-neutral-600 dark:text-zinc-600'
                      }`}>
                        <Briefcase size={15} />
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${
                        activeCourse === 'mba' ? 'bg-wine/10 text-wine border-wine/20' : 'bg-neutral-50 dark:bg-zinc-800 text-neutral-450 border-neutral-150 dark:border-white/5'
                      }`}>
                        2 Years
                      </span>
                    </div>
                    
                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-black tracking-tight">
                        MBA Program
                      </h4>
                      <p className="text-[9px] text-muted leading-tight mt-0.5 font-medium group-hover:text-black transition-colors">
                        REIT Strategy & Finance
                      </p>
                    </div>

                    {activeCourse === 'mba' && (
                      <div className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-wine"></span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= DETAILS LAYOUT FRAMEWORK ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* SINGLE FULL-WIDTH AREA FOR DETAIL PANELS */}
          <div className="lg:col-span-12 w-full" id="side-content-pane">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${activeCourse}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs"
              >
                
                {/* ======================================================== */}
                {/* 1. SECTIONS CORRESPONDING TO PROGRAMS                    */}
                {/* ======================================================== */}
                {activeSection === 'programs' && (
                  <div className="space-y-8">
                    {/* 1.1 B.REM PROGRAM DETAILS */}
                    {activeCourse === 'brem' && (
                      <>
                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">PREMIER 4-YEAR BACHELOR DEGREE</span>
                          <h3 className="text-3xl md:text-4xl text-black font-serif tracking-tight">Bachelor of Real Estate Management (B.REM)</h3>
                          <p className="text-muted text-sm md:text-base leading-relaxed font-semibold">
                            Our flagship four-year professional undergraduate degree program is designed explicitly for prospective real estate developers, investors, and elite capital consultants. Aligned with global Royal Institution of Chartered Surveyors (RICS) guidelines, students bypass archaic management modules to focus purely on high-velocity asset modeling and active deal-closing.
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-6 pt-4">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-bold text-black mb-2 text-sm tracking-tight flex items-center gap-2">
                                <Sparkles size={16} className="text-wine" /> Professional Academics
                              </h4>
                              <p className="text-xs text-muted leading-relaxed font-medium">
                                Master property valuation protocols, capital stacking, urban planning regulations, land legal systems (RERA, registry procedures), and property asset allocation strategies.
                              </p>
                            </div>
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-bold text-black mb-2 text-sm tracking-tight flex items-center gap-2">
                                <Target size={16} className="text-wine" /> Active Masterclasses
                              </h4>
                              <p className="text-xs text-muted leading-relaxed font-medium">
                                Gain deep hands-on expertise. Students partner directly with developers to conduct actual physical transaction briefs and client engagement loops.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-12 md:pt-16" />

                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">AIMS & PHILOSOPHY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">B.REM Program Objectives</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Our primary mission is to create highly-skilled, operational professionals who understand the physical, digital, and regulatory dimensions of property portfolios. Through structured masterclasses, graduates will achieve the following core competencies:
                          </p>
                          <div className="space-y-4 pt-2">
                            {[
                              { title: "Commercial Competence", desc: "Gain professional confidence by closing actual mock-listing valuations, completing live broker internships, and negotiating mock asset terms during early terms." },
                              { title: "Financial Modeling Mastery", desc: "Build institutional-grade cashflow models, calculate exact capitalization rates, understand NPV/IRR metrics, and structure joint-venture terms." },
                              { title: "RICS Standards Compliance", desc: "Attain high-caliber academic mastery that is fully aligned under Royal Institution of Chartered Surveyors templates, giving you instant global recruitment credentials." }
                            ].map((obj, i) => (
                              <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                                <div className="w-6 h-6 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  0{i+1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-black text-xs uppercase tracking-wide">{obj.title}</h5>
                                  <p className="text-[11px] text-muted leading-normal font-medium mt-1">{obj.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-12 md:pt-16" />

                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">4-YEAR INTEGRATED PATHWAY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">B.REM Programme Structure</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            A comprehensive, eight-semester modular itinerary. Traditional management theory is compressed to make room for active design, development, and capital-placement modules.
                          </p>
                          <div className="space-y-4 pt-2">
                            {[
                              { year: "Academic Year 1", title: "Real Estate Core & Basics", desc: "Valuation Mathematics, Urban Topography & Geography, Principles of Real Estate Law, Spatial Architecture Foundations." },
                              { year: "Academic Year 2", title: "Asset Analytics & Capital Stacking", desc: "Discounted Cash Flows, Joint-Venture Structuring, REIT Modeling, Retail & Corporate Leasing frameworks." },
                              { year: "Academic Year 3", title: "Operations & Digital Distribution", desc: "Construction Project Management, Local Zoning & Approvals, Marketing CAC Optimizations, Broker Network Mechanics." },
                              { year: "Academic Year 4", title: "Full-Year Corporate Integration", desc: "Spend two full semesters embedded active on-desk with premier developers or private equity analysts for direct graduation credits." }
                            ].map((track, idx) => (
                              <div key={idx} className="relative pl-6 border-l-2 border-wine-light-border">
                                <div className="absolute top-1.5 -left-[5px] w-2.5 h-2.5 rounded-full bg-wine shadow-sm" />
                                <span className="text-wine font-extrabold text-[9px] uppercase tracking-wider">{track.year}</span>
                                <h4 className="text-sm font-bold text-black mt-1 leading-snug">{track.title}</h4>
                                <p className="text-xs text-muted mt-1 leading-relaxed font-semibold">{track.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-12 md:pt-16" />

                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ENROLLMENT PORTAL</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">B.REM Admission Process</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Selection is highly selective, evaluating raw competence, general analytical acumen, and entrepreneurial intent. Follow this 4-step pathway.
                          </p>

                          <div className="grid sm:grid-cols-4 gap-4 py-4">
                            {[
                              { step: "01", label: "Online Inquiry", desc: "Submit current 12th scores and baseline academic records and resume." },
                              { step: "02", label: "Aptitude Test", desc: "Attempt the analytical logic and numeric evaluations." },
                              { step: "03", label: "Panel Talk", desc: "Fireside interview with founders to verify drive and portfolio fit." },
                              { step: "04", label: "Direct Offer", desc: "Receive formal invitation and process tuition enrollment." }
                            ].map((step, idx) => (
                              <div key={idx} className="bg-card border border-border p-4 rounded-xl shadow-xs">
                                <span className="text-wine text-2xl font-serif font-black">{step.step}</span>
                                <h5 className="font-extrabold text-black text-[10px] uppercase tracking-wider mt-2 mb-1 leading-tight">{step.label}</h5>
                                <p className="text-[10px] text-muted leading-normal font-medium">{step.desc}</p>
                              </div>
                            ))}
                          </div>

                          {/* Dynamic interactive application form built-in directly as instructed */}
                          <div className="bg-card border border-border p-6 rounded-2xl">
                            <h4 className="font-serif text-black text-lg mb-4 border-b border-border pb-2">Apply for B.REM Program</h4>
                            <AnimatePresence mode="wait">
                              {!isSubmitted ? (
                                <form className="space-y-4" onSubmit={handleFormSubmit}>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Full Name</label>
                                      <input 
                                        required 
                                        type="text" 
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                        placeholder="Rahul Verma" 
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Email address</label>
                                      <input 
                                        required 
                                        type="email" 
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                        placeholder="rahul@domain.com" 
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Phone Vector</label>
                                    <input 
                                      required 
                                      type="tel" 
                                      value={formPhone}
                                      onChange={(e) => setFormPhone(e.target.value)}
                                      className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                      placeholder="+91 91111 22222" 
                                    />
                                  </div>
                                  <button 
                                    type="submit" 
                                    className="bg-wine hover:bg-wine-hover text-[#ffffff] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all w-full select-none cursor-pointer"
                                  >
                                    Submit Admissions Briefing Inquiry
                                  </button>
                                </form>
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-wine font-extrabold text-sm mb-1">🎉 Portfolio Inquiry Logged!</p>
                                  <p className="text-xs text-muted font-medium">An academic enrollment coordinator will contact your mobile coordinates within 24 working hours.</p>
                                  <button onClick={() => setIsSubmitted(false)} className="text-[10px] uppercase font-bold text-black border-b border-black mt-3 cursor-pointer">Register Another Student</button>
                                </div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-12 md:pt-16" />

                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">FEE TRANSPARENCY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">B.REM Tuition Structure</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Transparent funding structure with zero hidden levies. Lotlite maintains multiple financial aid layouts to keep education highly accessible.
                          </p>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Standard Semester Charges</span>
                              <h4 className="text-3xl font-serif text-black font-black">₹1,85,000 <span className="text-xs text-muted">/ Sem</span></h4>
                              <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Complete Tuition Coverage</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Digital PropTech Library & Data Keys</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Local Field-Valuation Logistics Fee</li>
                              </ul>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                                <div>
                                  <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Founders Merit Scholarships</span>
                                  <h4 className="text-2xl font-serif text-black font-bold">Up to 50% Aid</h4>
                                  <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                    Awarded selectively to applicants scoring high aggregates on standard analytical entrance formats or exhibiting extreme entrepreneurial skills.
                                  </p>
                                </div>
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Calculations audited under UGC matrices</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-12 md:pt-16" />

                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">APPLIED EVALUATION</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">B.REM Examination & Grading</h3>
                          <p className="text-muted text-sm leading-relaxed font-semibold">
                            We do not believe in standard rote classroom memory loops. Lotlite evaluates graduates based on continuous real-world execution capacity. Grading metrics are split strictly across three transparent vectors:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            {[
                              { pct: "40%", label: "Live Performance", desc: "Performance conducting mock real estate valuation briefs, field analysis surveys, and local sales metrics." },
                              { pct: "30%", label: "Venture Projects", desc: "Term project formulations audited directly by developer CFOs and expert board directors." },
                              { pct: "30%", label: "Theoretical Mastery", desc: "Written examinations checking grasp on real estate statutes, accounting codes, and RICS guidelines." }
                            ].map((exam, i) => (
                              <div key={i} className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-4xl font-serif font-black text-wine">{exam.pct}</span>
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-black my-2">{exam.label}</h5>
                                <p className="text-[10px] text-muted leading-normal font-medium">{exam.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-12 md:pt-16" />

                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ACADEMIC OFFICES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Admissions Contact details</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Get in touch with executive coordinators at our prime academic compound. We coordinate site tours on active request.
                          </p>

                          <div className="grid md:grid-cols-2 gap-6 pt-2">
                            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border dark:border-white/10 pb-2">Academic Coordination Desk</h4>
                              <div className="space-y-3 text-xs text-muted font-semibold">
                                <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>b.rem@lotlite-education.in</span></div>
                                <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3500</span></div>
                                <div className="flex items-center gap-3"><Building2 size={14} className="text-wine" /> <span>Dean of Students Office, Wing-A</span></div>
                              </div>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border dark:border-white/10 pb-2">Bengaluru Campus Location</h4>
                              <p className="text-[11px] text-muted leading-relaxed font-semibold">
                                Lotlite Tech Park Compound, Academic Buildings Wing 2, Outer Ring Road, Landmark Tech Park Sector, Bengaluru, Karnataka - 560103.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-12 md:pt-16" />

                        <div className="space-y-6">
                          <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Common queries about the B.REM program structure, global accreditations, and entry pathways.
                          </p>

                          <div className="space-y-4 pt-2">
                            {faqs.map((faq, idx) => (
                              <div 
                                key={idx}
                                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                              >
                                <button
                                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                  className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                >
                                  <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                  <motion.div
                                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                    className="text-wine shrink-0 ml-4"
                                  >
                                    <ChevronDown size={12} />
                                  </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                  {openFaq === idx && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                        {faq.a}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* 1.2 BCA PROGRAM DETAILS */}
                    {activeCourse === 'bca' && (
                      <>
                        <div className="space-y-12">
                          
                          {/* 1. OVERVIEW */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">FUTURISTIC 3-YEAR BACHELOR DEGREE</span>
                            <h3 className="text-3xl md:text-4xl text-black font-serif tracking-tight">Bachelor of Computer Applications (BCA) - AI & PropTech</h3>
                            <p className="text-muted text-sm md:text-base leading-relaxed font-semibold">
                              A modern, practical 3-year computational stream designed to engineer the software backbone of listing portals, automated evaluation algorithms, and geographic spatial trackers. We merge core Computer Science components with real-world app releases to prepare future spatial software managers.
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                              <div className="bg-card border border-border p-6 rounded-2xl">
                                <h4 className="font-bold text-black mb-2 text-sm tracking-tight flex items-center gap-2">
                                  <Sparkles size={16} className="text-wine" /> PropTech Tech Stack
                                </h4>
                                <p className="text-xs text-muted leading-relaxed font-medium">
                                  Learn HTML/CSS, Tailwind CSS, Javascript, TypeScript, React framework, spatial database queries, and Node.js APIs to build ultra-responsive listings dashboards.
                                </p>
                              </div>
                              <div className="bg-card border border-border p-6 rounded-2xl">
                                <h4 className="font-bold text-black mb-2 text-sm tracking-tight flex items-center gap-2">
                                  <Target size={16} className="text-wine" /> Applied AI Sprints
                                </h4>
                                <p className="text-xs text-muted leading-relaxed font-medium">
                                  Integrate large language model API services, machine learning classifiers, automated scrapers, and automated email/SMS distribution workflows directly.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 2. OBJECTIVES */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">COMPUTATIONAL SPRINTS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">BCA Program Objectives</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              To equip tomorrow's software developers with high-demand web development skills, data indexing expertise, and spatial analytics fluency. Below are our key operational goals:
                            </p>
                            <div className="space-y-4 pt-2">
                              {[
                                { title: "Full-Stack Development Focus", desc: "Build standard, highly responsive listing applets using React.js and SQL-managed databases safely without lag." },
                                { title: "Automations & API integrations", desc: "Construct web automation triggers, programmatic email/SMS templates, and dynamic CRM databases." },
                                { title: "Practical Incubator Labs", desc: "Deploy your tools directly on local testnets to collect real-world user metrics and transaction feedback." }
                              ].map((obj, i) => (
                                <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                                  <div className="w-6 h-6 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    0{i+1}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-black text-xs uppercase tracking-wide">{obj.title}</h5>
                                    <p className="text-[11px] text-muted leading-normal font-medium mt-1">{obj.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 3. STRUCTURE */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">3-YEAR DETAILED MATRIX</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">BCA Programme Structure</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              A robust, six-semester computational pathway centered heavily around hands-on development labs and modern tech-stack capabilities.
                            </p>
                            <div className="space-y-4 pt-2">
                              {[
                                { year: "Academic Year 1", title: "CS Core & Web Fundamentals", desc: "Introduction to HTML, CSS, Javascript, Relational Databases (SQL), UI Wireframing, and basic scraper logic." },
                                { year: "Academic Year 2", title: "React Infrastructures & Spatial Map APIs", desc: "React components, Node server layouts, RESTful designs, Map APIs, and complex client-side state managers." },
                                { year: "Academic Year 3", title: "Applied AI Engines & Team Capstone", desc: "LLM API configurations, machine learning models, cloud hosting, and building a final monetization project." }
                              ].map((track, idx) => (
                                <div key={idx} className="relative pl-6 border-l-2 border-wine-light-border">
                                  <div className="absolute top-1.5 -left-[5px] w-2.5 h-2.5 rounded-full bg-wine shadow-sm" />
                                  <span className="text-wine font-extrabold text-[9px] uppercase tracking-wider">{track.year}</span>
                                  <h4 className="text-sm font-bold text-black mt-1 leading-snug">{track.title}</h4>
                                  <p className="text-xs text-muted mt-1 leading-relaxed font-semibold">{track.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 4. ADMISSIONS */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ENROLL NOW</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">BCA Admission Process</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Requires general mathematical logic, elementary problem-solving abilities, and an energetic tech mindset.
                            </p>

                            <div className="grid sm:grid-cols-4 gap-4 py-4">
                              {[
                                { step: "01", label: "Submit Records", desc: "Provide 12th standard logical aggregates and basic profile info." },
                                { step: "02", label: "Logic Quiz", desc: "Attempt our custom diagnostic logical reasoning aptitude paper." },
                                { step: "03", label: "Tech Interview", desc: "Fireside discussion with academic tech leads to evaluate fit." },
                                { step: "04", label: "Get Admitted", desc: "Confirm your selection line and process initial fees." }
                              ].map((step, idx) => (
                                <div key={idx} className="bg-card border border-border p-4 rounded-xl shadow-xs">
                                  <span className="text-wine text-2xl font-serif font-black">{step.step}</span>
                                  <h5 className="font-extrabold text-black text-[10px] uppercase tracking-wider mt-2 mb-1 leading-tight">{step.label}</h5>
                                  <p className="text-[10px] text-muted leading-normal font-medium">{step.desc}</p>
                                </div>
                              ))}
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl" id="bca-admissions-desk">
                              <h4 className="font-serif text-black text-lg mb-4 border-b border-border pb-2">Apply for BCA Program</h4>
                              <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Full Name</label>
                                        <input 
                                          required 
                                          type="text" 
                                          value={formName}
                                          onChange={(e) => setFormName(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                          placeholder="Aman Joshi" 
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Email address</label>
                                        <input 
                                          required 
                                          type="email" 
                                          value={formEmail}
                                          onChange={(e) => setFormEmail(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                          placeholder="aman@domain.com" 
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Phone Vector</label>
                                      <input 
                                        required 
                                        type="tel" 
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                        placeholder="+91 97777 88888" 
                                      />
                                    </div>
                                    <button 
                                      type="submit" 
                                      className="bg-wine hover:bg-wine-hover text-[#ffffff] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all w-full select-none cursor-pointer"
                                    >
                                      Submit Admissions Briefing Inquiry
                                    </button>
                                  </form>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-wine font-extrabold text-sm mb-1">🎉 Tech Inquiry Logged!</p>
                                    <p className="text-xs text-muted font-medium">An academic enrollment coordinator will contact your mobile coordinates within 24 working hours.</p>
                                    <button onClick={() => setIsSubmitted(false)} className="text-[10px] uppercase font-bold text-black border-b border-black mt-3 cursor-pointer">Register Another Student</button>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 5. FEES */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">PRICING CLARITY</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">BCA Program Tuition</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Transparent fees for elite computer training paired with live server deploy assistance and maps API keys.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Semester Charges</span>
                                <h4 className="text-3xl font-serif text-black font-black">₹1,45,000 <span className="text-xs text-muted">/ Sem</span></h4>
                                <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Interactive Coding Labs Tuition</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Dynamic Database & Spatial Hosting Licenses</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Startup Incubation Mentoring Desk</li>
                                </ul>
                              </div>

                              <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Computational Scholarships</span>
                                    <h4 className="text-2xl font-serif text-black font-bold">Up to 40% Benefit</h4>
                                    <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                      Offered conditionally to applicants showing high performance on logical tests or boasting previous web development records.
                                    </p>
                                  </div>
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Audited strictly via UGC templates</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 6. EXAM & EVALUATION */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">DEV PROJECT DEMOS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">BCA Assessment Framework</h3>
                            <p className="text-muted text-sm leading-relaxed font-semibold">
                              Assessments are based on continuous web deployments, system diagnostic audits, and algorithmic portfolios.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                              {[
                                { pct: "50%", label: "Live Code Releases", desc: "Build, configure, and release interactive database directories and clean map search systems." },
                                { pct: "30%", label: "Written Algorithms", desc: "Written evaluative tests regarding network communications, database speeds, and logical paradigms." },
                                { pct: "20%", label: "Team Hackathons", desc: "Rapid group hackathons integrating third-party APIs to solve active partner problems." }
                              ].map((exam, i) => (
                                <div key={i} className="bg-card border border-border p-6 rounded-2xl">
                                  <span className="text-4xl font-serif font-black text-wine">{exam.pct}</span>
                                  <h5 className="font-extrabold text-xs uppercase tracking-wider text-black my-2">{exam.label}</h5>
                                  <p className="text-[10px] text-muted leading-normal font-medium">{exam.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 7. CONTACT */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">TECH LABS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">BCA Contact Details</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Connect directly to computing coordinators to schedule lab tours.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">PropTech Computational Desk</h4>
                                <div className="space-y-3 text-xs text-muted font-semibold">
                                  <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>bca@lotlite-education.in</span></div>
                                  <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3550</span></div>
                                  <div className="flex items-center gap-3"><Building2 size={14} className="text-wine" /> <span>Coordinator of Computing Units, Block 3</span></div>
                                </div>
                              </div>

                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">Physical Location</h4>
                                <p className="text-[11px] text-muted leading-relaxed font-semibold">
                                  Lotlite Academic Park Compound, Server Block Floor 3, Outer Ring Road, Bengaluru, Karnataka - 560103.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 8. Frequently Asked Questions */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Common queries about computational tracks, software modules, and developer paths.
                            </p>

                            <div className="space-y-4 pt-2">
                              {bcaFaqs.map((faq, idx) => (
                                <div 
                                  key={idx}
                                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                                >
                                  <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                  >
                                    <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                    <motion.div
                                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                      className="text-wine shrink-0 ml-4"
                                    >
                                      <ChevronDown size={12} />
                                    </motion.div>
                                  </button>
                                  <AnimatePresence initial={false}>
                                    {openFaq === idx && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                          {faq.a}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </>
                    )}

                    {/* 1.3 MCA PROGRAM DETAILS (PropTech Deep Systems) */}
                    {activeCourse === 'mca' && (
                      <>
                        <div className="space-y-12">

                          {/* 1. OVERVIEW */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">2-YEAR ADVANCED SPECIALIST TRACK</span>
                            <h3 className="text-3xl md:text-4xl text-black font-serif tracking-tight">Master of Computer Applications (MCA) - PropTech AI & Deep Systems</h3>
                            <p className="text-muted text-sm md:text-base leading-relaxed font-semibold">
                              Built explicitly for progressive software engineers, developers, and tech managers seeking to architect complex real-estate cloud solutions. Master spatial neural networks, high-frequency listing engines, predictive market databases, and Web3 land-token registries.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                              {[
                                { val: "300 Hours", sub: "Coding Sprints" },
                                { val: "40+", sub: "API Tools Taught" },
                                { val: "100%", sub: "Pragmatic Focus" },
                                { val: "₹5Cr", sub: "VC Incubator Pool" }
                              ].map((metric, idx) => (
                                <div key={idx} className="bg-card border border-border p-4 rounded-xl text-center">
                                  <span className="text-2xl font-serif text-wine font-extrabold block">{metric.val}</span>
                                  <span className="text-[8px] text-black/60 font-black uppercase tracking-widest mt-1 block">{metric.sub}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 2. OBJECTIVES */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">TARGET OUTCOMES</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MCA PropTech Core Objectives</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Bridge the software engineering and database gaps in classical developer frameworks. We enable advanced minds to achieve these digital targets:
                            </p>

                            <div className="space-y-4 pt-2">
                              {[
                                { title: "Deploy Autonomic AVM Engines", desc: "Build advanced machine-learning pricing models that evaluate property values within a 3% deviation margin from active records." },
                                { title: "Low-CAC Distribution Mastery", desc: "Deploy organic distribution databases, programmatic search sites, and automated communication webhooks bypassing traditional listing portals." },
                                { title: "Structure Venture-Scale Deals", desc: "Understand seed investments, API integration pipelines, and private equity platforms used inside elite proptech organizations." }
                              ].map((obj, i) => (
                                <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                                  <div className="w-6 h-6 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    0{i+1}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-black text-xs uppercase tracking-wide">{obj.title}</h5>
                                    <p className="text-[11px] text-muted leading-normal font-medium mt-1">{obj.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 3. STRUCTURE */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ADVANCED CURRICULUM</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MCA Term Structure</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              An intensive, 2-year postgraduate matrix designed for advanced software engineering and machine learning deployment in property ecosystems.
                            </p>

                            <div className="space-y-4 pt-2">
                              {[
                                { term: "Term 1: Advanced Cloud Architectures", title: "Enterprise Microservices & Datastores", desc: "Distributed server networks, spatial database indexing (PostgreSQL GIS), event messaging (Kafka), and automated data pipelines." },
                                { term: "Term 2: Neural Valuations & Spatial AI", title: "Automated Valuation Modeling (AVM)", desc: "Deep neural networks for price predictions, computer vision for structural property scans, and programmatic spatial maps." },
                                { term: "Term 3: SaaS Architectures & Enterprise Launch", title: "Venture Production Lab", desc: "Build, containerize, and deploy a complete real estate SaaS, run conversion funnel analyses, and defend before a venture board." }
                              ].map((track, idx) => (
                                <div key={idx} className="relative pl-6 border-l-2 border-wine-light-border">
                                  <div className="absolute top-1.5 -left-[5px] w-2.5 h-2.5 rounded-full bg-wine shadow-sm" />
                                  <span className="text-wine font-extrabold text-[9px] uppercase tracking-wider">{track.term}</span>
                                  <h4 className="text-sm font-bold text-black mt-1 leading-snug">{track.title}</h4>
                                  <p className="text-xs text-muted mt-1 leading-relaxed font-semibold">{track.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 4. ADMISSIONS */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ELIGIBILITY</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MCA Admission Process</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Evaluated strictly on logical capabilities, portfolio drive, and project execution interest.
                            </p>

                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2 mb-3">Entrance Requirements</h4>
                              <p className="text-xs text-muted leading-relaxed font-semibold">
                                Candidates must hold a completed Bachelor’s degree in Computer Science, IT, Engineering, Data Science, Math, or Physics. Baseline coding experience in Python, Javascript, or SQL is highly recommended.
                              </p>
                              <div className="flex gap-4 items-center pt-4 mt-4 border-t border-border text-[10px] font-extrabold uppercase tracking-widest text-wine">
                                <span>1. Submit Github Portfolio</span>
                                <span>2. Complete Coding Interview</span>
                                <span>3. Admission Decision</span>
                              </div>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl" id="mca-admissions-desk">
                              <h4 className="font-serif text-black text-lg mb-4 border-b border-border pb-2">Apply for MCA Program</h4>
                              <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Full Name</label>
                                        <input 
                                          required 
                                          type="text" 
                                          value={formName}
                                          onChange={(e) => setFormName(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                          placeholder="Ramesh Pillai" 
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Email address</label>
                                        <input 
                                          required 
                                          type="email" 
                                          value={formEmail}
                                          onChange={(e) => setFormEmail(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                          placeholder="ramesh@domain.com" 
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Phone Vector</label>
                                      <input 
                                        required 
                                        type="tel" 
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                        placeholder="+91 95555 66666" 
                                      />
                                    </div>
                                    <button 
                                      type="submit" 
                                      className="bg-wine hover:bg-wine-hover text-[#ffffff] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all w-full select-none cursor-pointer"
                                    >
                                      Submit Admissions Briefing Inquiry
                                    </button>
                                  </form>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-wine font-extrabold text-sm mb-1">🎉 MCA Application Logged!</p>
                                    <p className="text-xs text-muted font-medium">An academic enrollment coordinator will contact your mobile coordinates within 24 working hours.</p>
                                    <button onClick={() => setIsSubmitted(false)} className="text-[10px] uppercase font-bold text-black border-b border-black mt-3 cursor-pointer">Register Another Student</button>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 5. FEES */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EDUCATION INVESTMENT</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MCA AI & PropTech Fees</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Invest in your future. Covers server API credits, direct AWS clusters, and tech startup pitch support.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Semester Tuition</span>
                                <h4 className="text-3xl font-serif text-black font-black">₹2,60,000 <span className="text-xs text-muted">/ Sem</span></h4>
                                <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Complete Tuition and Lab Cover</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> OpenAI, GIS, and Cloud Platform Credits</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Venture Capital Seed Pitch support</li>
                                </ul>
                              </div>

                              <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Affiliated Student Loans</span>
                                    <h4 className="text-2xl font-serif text-black font-bold">0% EMI Layouts</h4>
                                    <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                      Approved instant education lines available via premier partner banks (HDFC, ICICI, Axis).
                                    </p>
                                  </div>
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Audited strictly via partner finance directors</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 6. EXAM & EVALUATION */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">LAUNCH THESIS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MCA Program Examination</h3>
                            <p className="text-muted text-sm leading-relaxed font-semibold">
                              To attain certification inside our modern tech lab, graduates are evaluated 100% on performance and launch execution. To clear graduation levels, candidates must fulfill this specific criteria:
                            </p>
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h5 className="font-extrabold text-sm text-wine uppercase tracking-wider mb-2">The Launch Threshold</h5>
                              <p className="text-xs text-muted leading-relaxed font-semibold">
                                "Students must deploy a fully responsive web application (SaaS interface, directory portal, or listings dashboard) and generate a minimum of ₹10,000 in transaction valuations, listing fees, or user activations from standard non-coerced baseline traffic."
                              </p>
                              <div className="mt-4 text-[10px] font-extrabold uppercase tracking-widest text-black/60">
                                This ensures absolute readiness for venture setups or core product roles instantly.
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 7. CONTACT */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">LOTLITE VENTURE LAB</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MCA Contact Details</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Talk directly to coordinators at the Tech Incubator wings. We respond instantly via email pipelines.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">PropTech Admissions Hub</h4>
                                <div className="space-y-3 text-xs text-muted font-semibold">
                                  <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>mca@lotlite-education.in</span></div>
                                  <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3700</span></div>
                                  <div className="flex items-center gap-3"><Building2 size={14} className="text-wine" /> <span>Incubator Liaison Officer Office, Floor 4</span></div>
                                </div>
                              </div>

                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">Physical Incubator Complex</h4>
                                <p className="text-[11px] text-muted leading-relaxed font-semibold">
                                  Lotlite Incubator Hub, Floor 4, Tower-B, PropTech Innovation Zone, Outer Ring Road, Bengaluru - 560103.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 8. Frequently Asked Questions */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Got questions regarding our postgraduate tech tracks, coding curriculums, or seed grant qualifications?
                            </p>

                            <div className="space-y-4 pt-2">
                              {mcaFaqs.map((faq, idx) => (
                                <div 
                                  key={idx}
                                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                                >
                                  <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                  >
                                    <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                    <motion.div
                                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                      className="text-wine shrink-0 ml-4"
                                    >
                                      <ChevronDown size={12} />
                                    </motion.div>
                                  </button>
                                  <AnimatePresence initial={false}>
                                    {openFaq === idx && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                          {faq.a}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </>
                    )}

                    {/* 1.4 MBA PROGRAM DETAILS (Finance & REIT Strategy) */}
                    {activeCourse === 'mba' && (
                      <>
                        <div className="space-y-12">

                          {/* 1. OVERVIEW */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">2-YEAR PREMIUM POSTGRADUATE PATHWAY</span>
                            <h3 className="text-3xl md:text-4xl text-black font-serif tracking-tight">Master of Business Administration (MBA) - Real Estate Finance & REIT Strategy</h3>
                            <p className="text-muted text-sm md:text-base leading-relaxed font-semibold">
                              Built for next-generation developer CFOs, estate advisory executives, and investment fund analysts. Command institutional property assets, manage public REIT conversions, negotiate private equity capital, and navigate macro urbanization trends with real-world developer boards.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                              {[
                                { val: "₹20Cr+", sub: "Deal Case Volume" },
                                { val: "50+", sub: "Developer Mentors" },
                                { val: "100%", sub: "Boardroom Focus" },
                                { val: "RICS", sub: "Modular Alignment" }
                              ].map((metric, idx) => (
                                <div key={idx} className="bg-card border border-border p-4 rounded-xl text-center">
                                  <span className="text-2xl font-serif text-wine font-extrabold block">{metric.val}</span>
                                  <span className="text-[8px] text-black/60 font-black uppercase tracking-widest mt-1 block">{metric.sub}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 2. OBJECTIVES */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE COMPETENCIES</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MBA Program Objectives</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Our goals focus on training young business leaders to balance capital leverage, risk compliance, and strategic real-estate scaling:
                            </p>

                            <div className="space-y-4 pt-2">
                              {[
                                { title: "Capital Stack Mastery", desc: "Build institutional-grade joint-venture debt frameworks, mezzanine structures, and project finance valuations." },
                                { title: "REIT Management & Liquidity", desc: "Formulate liquid strategies to convert static real-estate grids into public-market trust frameworks cleanly." },
                                { title: "Feasibility & Zoning Strategy", desc: "Evaluate macro-demographic transit lines, property statutes, and urban feasibility with actual land directors." }
                              ].map((obj, i) => (
                                <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                                  <div className="w-6 h-6 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    0{i+1}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-black text-xs uppercase tracking-wide">{obj.title}</h5>
                                    <p className="text-[11px] text-muted leading-normal font-medium mt-1">{obj.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 3. STRUCTURE */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">THE MBA ROADMAP</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MBA Programme Structure</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              A 2-year pathway split systematically between rigorous real-estate financial accounting, capital modeling, and courtroom thesis defense.
                            </p>

                            <div className="space-y-4 pt-2">
                              {[
                                { term: "Year 1: Corporate Real Estate Finance", title: "Feasibility & Valuation Core", desc: "DCF modeling, land legal frameworks (RERA, registry procedures), statutory approvals, and corporate accounting rules." },
                                { term: "Year 2: Capital Markets & REIT Listings", title: "Public Trusts & Global Fundraising", desc: "REIT launch modules, tax optimizations under Indian laws, private equity structures, and luxury portfolio management." }
                              ].map((track, idx) => (
                                <div key={idx} className="relative pl-6 border-l-2 border-wine-light-border">
                                  <div className="absolute top-1.5 -left-[5px] w-2.5 h-2.5 rounded-full bg-wine shadow-sm" />
                                  <span className="text-wine font-extrabold text-[9px] uppercase tracking-wider">{track.term}</span>
                                  <h4 className="text-sm font-bold text-black mt-1 leading-snug">{track.title}</h4>
                                  <p className="text-xs text-muted mt-1 leading-relaxed font-semibold">{track.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 4. ADMISSIONS */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE INTAKE</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MBA Admission Process</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Intends to assess strategic capabilities, past corporate backgrounds, and business leadership drive.
                            </p>

                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2 mb-3">Admission Criteria</h4>
                              <p className="text-xs text-muted leading-relaxed font-semibold">
                                Applicants should have a completed Bachelor’s degree in Business, Commerce, Architecture, or related fields with at least 50% average scores. Relevant work experiences inside developer organizations or finance represents a stellar advantage.
                              </p>
                              <div className="flex gap-4 items-center pt-4 mt-4 border-t border-border text-[10px] font-extrabold uppercase tracking-widest text-wine">
                                <span>1. Submit Profile Records</span>
                                <span>2. Management Aptitude Quiz</span>
                                <span>3. Executive Team Panel Talk</span>
                              </div>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl" id="mba-admissions-desk">
                              <h4 className="font-serif text-black text-lg mb-4 border-b border-border pb-2">Apply for MBA Program</h4>
                              <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Full Name</label>
                                        <input 
                                          required 
                                          type="text" 
                                          value={formName}
                                          onChange={(e) => setFormName(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                          placeholder="Karan Malhotra" 
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Email address</label>
                                        <input 
                                          required 
                                          type="email" 
                                          value={formEmail}
                                          onChange={(e) => setFormEmail(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                          placeholder="karan@domain.com" 
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Phone Vector</label>
                                      <input 
                                        required 
                                        type="tel" 
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                        placeholder="+91 96666 77777" 
                                      />
                                    </div>
                                    <button 
                                      type="submit" 
                                      className="bg-wine hover:bg-wine-hover text-[#ffffff] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all w-full select-none cursor-pointer"
                                    >
                                      Submit Admissions Briefing Inquiry
                                    </button>
                                  </form>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-wine font-extrabold text-sm mb-1">🎉 MBA Application Logged!</p>
                                    <p className="text-xs text-muted font-medium">An academic enrollment coordinator will contact your mobile coordinates within 24 working hours.</p>
                                    <button onClick={() => setIsSubmitted(false)} className="text-[10px] uppercase font-bold text-black border-b border-black mt-3 cursor-pointer">Register Another Student</button>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 5. FEES */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EDUCATION INVESTMENT</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MBA Program Fees</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Invest in your executive credentials. Includes direct access to developer CFO groups and site modeling tools.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Tuition Layout</span>
                                <h4 className="text-3xl font-serif text-black font-black">₹2,85,000 <span className="text-xs text-muted">/ Sem</span></h4>
                                <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Premium Business Strategy Sprints</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Regional developer site tours and logistics</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Institutional mock financial terminal licenses</li>
                                </ul>
                              </div>

                              <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Financial Partnerships</span>
                                    <h4 className="text-2xl font-serif text-black font-bold">0% EMI Financing</h4>
                                    <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                      Education credit lines through leading banks to support progressive professionals seamlessly.
                                    </p>
                                  </div>
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Audited strictly via finance directors</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 6. ASSESSMENT & EVALUATION */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">APPLIED GRADING</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MBA Assessment & Evaluation</h3>
                            <p className="text-muted text-sm leading-relaxed font-semibold">
                              Graduates are evaluated directly on courtroom case defenses, joint-venture structural modeling audits, and core written macro-economics papers.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                              {[
                                { pct: "40%", label: "Boardroom Case Defense", desc: "Defend your commercial planning, feasibility strategies, and regulatory models before active developer CFOs." },
                                { pct: "35%", label: "Financial Model Audits", desc: "Complete rigorous DCF audits, yield modeling simulations, and REIT prospectus formations." },
                                { pct: "25%", label: "Written Papers", desc: "Written evaluative papers checking macroeconomic, regulatory (RERA), and urban statutory planning grasp." }
                              ].map((exam, i) => (
                                <div key={i} className="bg-card border border-border p-6 rounded-2xl">
                                  <span className="text-4xl font-serif font-black text-wine">{exam.pct}</span>
                                  <h5 className="font-extrabold text-xs uppercase tracking-wider text-black my-2">{exam.label}</h5>
                                  <p className="text-[10px] text-muted leading-normal font-medium">{exam.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 7. CONTACT */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE OFFICES</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">MBA Contact Details</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Speak with advisors at our premium office compounds.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">MBA Executive Admissions Hub</h4>
                                <div className="space-y-3 text-xs text-muted font-semibold">
                                  <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>mba@lotlite-education.in</span></div>
                                  <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3705</span></div>
                                  <div className="flex items-center gap-3"><Building2 size={14} className="text-wine" /> <span>Executive Admissions Director office, Floor 2</span></div>
                                </div>
                              </div>

                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">Physical Location</h4>
                                <p className="text-[11px] text-muted leading-relaxed font-semibold">
                                  Lotlite Corporate Compound, Tower-A, Floby Administrative Area, Outer Ring Road, Bengaluru - 560103.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/10 my-8" />

                          {/* 8. Frequently Asked Questions */}
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Common queries about real-estate business scaling and developer recruitment.
                            </p>

                            <div className="space-y-4 pt-2">
                              {mbaFaqs.map((faq, idx) => (
                                <div 
                                  key={idx}
                                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                                >
                                  <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                  >
                                    <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                    <motion.div
                                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                      className="text-wine shrink-0 ml-4"
                                    >
                                      <ChevronDown size={12} />
                                    </motion.div>
                                  </button>
                                  <AnimatePresence initial={false}>
                                    {openFaq === idx && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                          {faq.a}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </>
                    )}
                  </div>
                )}


                {/* ======================================================== */}
                {/* 2. SECTIONS CORRESPONDING TO ABOUT                       */}
                {/* ======================================================== */}
                {activeSection === 'about' && (
                  <div className="space-y-6">
                    {activeSubTab === 'why-ssi' && (
                      <div className="space-y-6">
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">OUR ADULT LEGACY</span>
                        <h3 className="text-3xl md:text-4xl text-black font-serif tracking-tight">Why Lotlite & SSI</h3>
                        <p className="text-muted text-sm leading-relaxed font-semibold">
                          Lotlite Education represents India's leading center dedicated completely of Real Estate Study and development. We operate strictly in accordance under global Royal Institution of Chartered Surveyors templates.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 pt-4">
                          {[
                            { title: "Founder Classroom", desc: "No generic theoretical coaches. Meet real CFOS, builders, and active tech operators every week." },
                            { title: "RICS Standard Grading", desc: "Our syllabus satisfies requirements recognized across 140+ countries worldwide." },
                            { title: "Active Capital Support", desc: "Deploy products directly while studying using our dedicated ₹5Cr startup pool." }
                          ].map((adv, i) => (
                            <div key={i} className="bg-card border border-border p-5 rounded-2xl shadow-xs">
                              <CheckCircle2 size={18} className="text-wine mb-3" />
                              <h5 className="font-bold text-black text-xs uppercase tracking-wider mb-2">{adv.title}</h5>
                              <p className="text-[10px] text-muted leading-normal font-medium">{adv.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'founders' && (
                      <div className="space-y-6">
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">BOARD OF TRUSTEES</span>
                        <h3 className="text-3xl text-black font-serif tracking-tight">Our Founders & Board</h3>
                        <p className="text-muted text-xs md:text-sm font-semibold">
                          Instructing daily, reviewing term portfolios, and connecting graduates directly to primary employer groups.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                          {founders.map((item, idx) => (
                            <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:border-wine/20 transition-all">
                              <div className="h-44 relative overflow-hidden bg-neutral-200">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-0" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                                <span className="absolute top-2.5 right-2.5 bg-badge-bg text-badge-text text-[8.5px] font-black uppercase px-2 py-0.5 rounded border border-badge-border shadow-xs transition-colors duration-300">
                                  {item.education}
                                </span>
                                <div className="absolute bottom-3 left-4">
                                  <h4 className="text-sm font-bold text-[#111111] dark:text-[#ffffff]">{item.name}</h4>
                                  <p className="text-[9px] uppercase tracking-wider text-wine font-black">{item.role}</p>
                                </div>
                              </div>
                              <div className="p-4 space-y-2">
                                <p className="text-[8px] text-muted uppercase tracking-wider font-extrabold">Company: {item.company}</p>
                                <p className="text-[10px] text-black/70 italic leading-snug font-medium">"{item.bio}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {/* ======================================================== */}
                {/* 3. SECTIONS CORRESPONDING TO FACULTY                     */}
                {/* ======================================================== */}
                {activeSection === 'faculty' && (
                  <div className="space-y-6">
                    {activeSubTab === 'all' && (
                      <div className="space-y-6">
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">RICS CERTIFIED MENTORS</span>
                        <h3 className="text-3xl text-black font-serif tracking-tight">Eminent Faculty Board</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {faculty.map((prof, idx) => (
                            <div key={idx} className="bg-card border border-border p-6 rounded-2xl flex gap-4 shadow-xs">
                              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border">
                                <img src={prof.image} alt={prof.name} className="w-full h-full object-cover grayscale-0" referrerPolicy="no-referrer" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] font-extrabold uppercase text-wine tracking-wider bg-wine-light px-2 py-0.5 rounded">{prof.course}</span>
                                <h4 className="font-serif font-black text-black text-base pt-1">{prof.name}</h4>
                                <p className="text-[9px] text-black/65 leading-tight font-extrabold uppercase tracking-wide">{prof.title}</p>
                                <p className="text-[10px] text-muted dark:text-neutral-300 italic font-semibold leading-relaxed pt-1">"{prof.overview}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'research' && (
                      <div className="space-y-6">
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">RESEARCH CORPUS</span>
                        <h3 className="text-3xl font-serif text-black leading-tight">Syllabi & Active Studies</h3>
                        <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                          We push the limits of traditional spatial economics. Our active study group tracks critical housing anomalies.
                        </p>

                        <div className="space-y-4 pt-2">
                          {[
                            { title: "Metropolitan Real Estate Pricing Anomalies", author: "Dr. Sundar Venkatesh", journal: "Global Journal of Spatial Finance", year: "2026", desc: "Constructing algorithmic models to isolate land tax distortions inside emerging smart cities." },
                            { title: "SaaS Multi-Listing Protocols in Indian MMR", autor: "Siddarth Menon", journal: "Proptech Sprints Review", year: "2025", desc: "A detailed breakdown of brokerage CAC reductions using serverless automation networks." }
                          ].map((paper, idx) => (
                            <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs">
                              <span className="text-[9px] text-wine uppercase tracking-widest font-black block">{paper.journal} (Year {paper.year})</span>
                              <h4 className="font-serif text-black text-base font-bold mt-1 leading-tight">{paper.title}</h4>
                              <p className="text-[10px] text-muted font-extrabold uppercase tracking-widest mt-1">Lead Researcher: {paper.author}</p>
                              <p className="text-xs text-muted leading-relaxed font-semibold mt-2">{paper.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ======================================================== */}
                {/* 4. SECTIONS CORRESPONDING TO OUTCOMES                    */}
                {/* ======================================================== */}
                {activeSection === 'outcomes' && (
                  <div className="space-y-12">
                    {/* Placements Metrics */}
                    <div className="space-y-6">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">RECRUITMENT SUMMARY</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Placements Metrics</h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                        {[
                          { value: "₹9L+", label: "Average CTC Placement" },
                          { value: "₹14.5L", label: "Peak Package Cleared" },
                          { value: "100%", label: "Total Cohort Placement" },
                          { value: "40+", label: "Developer Employers" },
                          { value: "3.2X", label: "Average CTC Multiplier" },
                          { value: "62%", label: "Client-Facing Leadership" }
                        ].map((stat, idx) => (
                          <div key={idx} className="bg-card border border-border p-5 rounded-xl block text-left">
                            <span className="text-3xl font-serif text-wine font-black block">{stat.value}</span>
                            <span className="text-[9px] text-black/65 font-black uppercase tracking-widest mt-1 block">{stat.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row gap-5 items-center">
                        <span className="text-3xl">🤝</span>
                        <div className="text-left">
                          <h5 className="font-extrabold text-black text-xs uppercase tracking-wider mb-1">Corporate Placement Board Partners</h5>
                          <p className="text-[11px] text-muted dark:text-neutral-400 font-semibold leading-relaxed">
                            Graduates from our real estate program undergo instant selection interviews from partners including CBRE, Lodha Alliance, NoBroker, JLL corporate advisory, and Knight Frank.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-black/5 dark:border-white/5 pt-8" />

                    {/* Alumni Success Stories */}
                    <div className="space-y-6">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ALUMNI VOICES</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Student Success Stories</h3>

                      <div className="bg-card border border-border p-6 rounded-2xl min-h-[140px] flex flex-col justify-between">
                        <p className="text-sm font-serif italic text-black/80 leading-relaxed">
                          "{alumni[alumniIndex].review}"
                        </p>
                        <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-black text-xs">{alumni[alumniIndex].name}</h4>
                            <p className="text-[9px] font-bold text-wine uppercase tracking-widest">{alumni[alumniIndex].role} @ {alumni[alumniIndex].company} (CTC: {alumni[alumniIndex].package})</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => setAlumniIndex((p) => (p - 1 + alumni.length) % alumni.length)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-black/65 hover:bg-wine hover:text-[#ffffff] transition-all cursor-pointer"><ChevronLeft size={12} /></button>
                            <button onClick={() => setAlumniIndex((p) => (p + 1) % alumni.length)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-black/65 hover:bg-wine hover:text-[#ffffff] transition-all cursor-pointer"><ChevronRight size={12} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* ======================================================== */}
                {/* 5. SECTIONS CORRESPONDING TO INCUBATION                 */}
                {/* ======================================================== */}
                {activeSection === 'incubation' && (
                  <div className="space-y-12">
                    {/* Venture Labs Overview */}
                    <div className="space-y-6">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">SEED PLATFORM</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Venture Labs Overview</h3>
                      <p className="text-muted dark:text-neutral-400 text-xs md:text-sm font-semibold leading-relaxed">
                        We fuel actual builders. Our incubator program supports live student startups with dedicated office complexes and baseline seed funding.
                      </p>

                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                          <div className="p-5 space-y-3">
                            <span className="bg-wine-light border border-wine-light-border px-2 py-0.5 rounded text-[8px] font-extrabold uppercase text-wine tracking-wider">REVENUE-FIRST DIRECTORY</span>
                            <h4 className="text-lg font-bold text-black">Vihaan Realty</h4>
                            <p className="text-xs text-muted dark:text-neutral-400 leading-relaxed font-semibold">
                              Vihaan Realty enables middle-income plot buyers to purchase secure, layout-mapped plots layout without brokerage overlays.
                            </p>
                            <div className="bg-input p-3 rounded-lg text-[10px] text-muted">
                              <strong>Outcome:</strong> Reached ₹6L+ in monthly property transaction commissions inside its initial launch phase.
                            </div>
                          </div>
                          <span className="p-3 bg-input text-center text-[8px] font-extrabold text-black/55 uppercase tracking-widest border-t border-border">Founded by Lakshay Soni, Cohort 2</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                          <div className="p-5 space-y-3">
                            <span className="bg-wine-light border border-wine-light-border px-2 py-0.5 rounded text-[8px] font-extrabold uppercase text-wine tracking-wider">A.I. ALGORITHMIC MAPS</span>
                            <h4 className="text-lg font-bold text-black">Aura Insights</h4>
                            <p className="text-xs text-muted dark:text-neutral-400 leading-relaxed font-semibold">
                              Aura Insights harnesses spatial analytics databases to notify retail buyers of localized micro-market pricing variances.
                            </p>
                            <div className="bg-input p-3 rounded-lg text-[10px] text-muted">
                              <strong>Outcome:</strong> Awarded ₹10L in seed capital during deep VC evaluations inside the PropTech Lab.
                            </div>
                          </div>
                          <span className="p-3 bg-input text-center text-[8px] font-extrabold text-black/55 uppercase tracking-widest border-t border-border">Founded by Neha Gupta, Cohort 3</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-black/5 dark:border-white/5 pt-8" />

                    {/* Student Case Projects */}
                    <div className="space-y-6">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">APPLIED STRATEGY CODES</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Student Case Projects</h3>
                      <p className="text-muted dark:text-neutral-400 text-xs md:text-sm font-semibold">
                        Click any card block to browse the exact client founder challenge and student-engineered strategy.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {cases.map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedCase(item)}
                            className="bg-card border border-border p-5 rounded-2xl hover:border-wine/25 transition-all cursor-pointer shadow-xs group"
                          >
                            <span className="bg-input text-wine text-[8px] font-extrabold px-2.5 py-0.5 rounded">
                              {item.tag}
                            </span>
                            <h4 className="font-serif text-black text-base font-black mt-2 leading-tight group-hover:text-wine transition-colors">{item.company} Case</h4>
                            <p className="text-[10px] text-muted dark:text-neutral-400 mt-1 uppercase font-bold tracking-wider">Brief by Founder: {item.founder}</p>
                            <p className="text-[11px] text-muted dark:text-neutral-400 leading-normal line-clamp-2 mt-2 font-medium"><strong>Challenge:</strong> {item.problem}</p>
                            <span className="text-[9px] font-black uppercase text-wine tracking-wider block text-right pt-3 border-t border-border mt-3 group-hover:underline">Read Case File →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}


                {/* ======================================================== */}
                {/* 6. SECTIONS CORRESPONDING TO BLOGS                       */}
                {/* ======================================================== */}
                {activeSection === 'blogs' && (
                  <div className="space-y-6">
                    {activeSubTab === 'insights' && (
                      <div className="space-y-6">
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">LOTLITE CHRONICLES</span>
                        <h3 className="text-3xl text-black font-serif tracking-tight">Sprints & Chronicle Insights</h3>
 
                        {/* Category filtering bar */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {["All", "PropTech", "Education", "Growth"].map(cat => (
                            <button
                              key={cat}
                              onClick={() => setBlogFilter(cat)}
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                                blogFilter === cat 
                                  ? 'bg-wine border-wine text-[#ffffff]' 
                                  : 'bg-card text-muted border-border hover:border-wine/20'
                              }`}
                            >
                                {cat}
                            </button>
                          ))}
                        </div>
 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {filteredBlogs.map((post, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedBlog(post)}
                              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/25 cursor-pointer shadow-xs transition-all group"
                            >
                              <div className="h-40 relative bg-neutral-200">
                                <img src={post.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'} alt={post.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                                <span className="absolute top-2.5 left-2.5 bg-wine text-[#ffffff] text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded">{post.category}</span>
                              </div>
                              <div className="p-4 space-y-2">
                                <span className="text-[8px] text-muted uppercase tracking-widest font-bold">{post.date}</span>
                                <h4 className="font-serif font-black text-black text-sm group-hover:text-wine transition-colors leading-tight">{post.title}</h4>
                                <p className="text-[11px] text-muted leading-normal line-clamp-2 font-medium">{post.excerpt}</p>
                                <span className="text-[9px] font-black uppercase tracking-widest text-wine text-right block pt-2">Read complete article →</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
 
                    {activeSubTab === 'propose' && (
                      <div className="space-y-6">
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">PROPOSALS PORTAL</span>
                        <h3 className="text-3xl font-serif text-black leading-tight">Sprints Submission Desk</h3>
                        <p className="text-muted text-xs md:text-sm font-semibold leading-relaxed">
                          Submit your custom real estate research proposal or draft your PropTech growth studies. We publish approved student analysis papers directly on our main regional dashboards.
                        </p>
 
                        <div className="bg-card border border-border p-6 rounded-2xl">
                          <AnimatePresence mode="wait">
                            {!proposalSubmitted ? (
                              <form className="space-y-4" onSubmit={handleProposalSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Your Name</label>
                                    <input 
                                      required 
                                      type="text" 
                                      value={proposalName}
                                      onChange={(e) => setProposalName(e.target.value)}
                                      className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                      placeholder="Siddharth Roy" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Email address</label>
                                    <input 
                                      required 
                                      type="email" 
                                      value={proposalEmail}
                                      onChange={(e) => setProposalEmail(e.target.value)}
                                      className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                      placeholder="siddharth@domain.com" 
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Research Topic Title</label>
                                  <input 
                                    required 
                                    type="text" 
                                    value={proposalTopic}
                                    onChange={(e) => setProposalTopic(e.target.value)}
                                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                    placeholder="e.g. Smart-contract based escrow integrations" 
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Proposal Brief Abstract (Min 100 words)</label>
                                  <textarea 
                                    required 
                                    value={proposalAbstract}
                                    onChange={(e) => setProposalAbstract(e.target.value)}
                                    rows={4}
                                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                    placeholder="Describe your research methodology, regional study limits, and target outcomes..."
                                  />
                                </div>
                                <button 
                                  type="submit" 
                                  className="bg-wine hover:bg-wine-hover text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all w-full select-none cursor-pointer"
                                >
                                  Submit Proposal Draft
                                </button>
                              </form>
                            ) : (
                              <div className="text-center py-6 space-y-3">
                                <span className="text-3xl">📝</span>
                                <h4 className="font-serif text-black text-lg">Proposal Draft Confirmed</h4>
                                <p className="text-xs text-muted font-medium">Your draft research metrics are queued securely. Our Editorial Hub committee will respond within 4 working days.</p>
                                <button onClick={() => setProposalSubmitted(false)} className="text-[10px] uppercase font-bold text-wine border-b border-wine/25 cursor-pointer">Submit Another Proposal</button>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* Spacious padding above footer as instructed by user */}
      <div className="h-16 sm:h-28" />

      {/* ======================= CASE STUDIES EXPANSION MODAL ======================= */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100020] flex items-center justify-center p-4 pt-20 pb-6 md:p-6 md:pt-24 md:pb-8 bg-white/80 backdrop-blur-md dark:bg-[#000000]/80 dark:backdrop-blur-md"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900/90 dark:backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl w-full max-w-2xl p-6 md:p-10 relative rounded-3xl max-h-[85vh] md:max-h-[80vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-neutral-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer z-10 bg-black/5 dark:bg-white/5 p-1.5 rounded-full"
                onClick={() => setSelectedCase(null)}
              >
                <X size={20} />
              </button>

              {/* Fixed Header */}
              <div className="pb-4 mb-4 border-b border-black/10 dark:border-white/15 pr-8">
                <span className="inline-block px-3 py-1 bg-wine text-[#ffffff] rounded text-[9px] font-bold uppercase tracking-widest mb-3">
                  {selectedCase.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-neutral-950 dark:text-zinc-100 leading-tight">{selectedCase.company} Project</h3>
                <p className="text-wine dark:text-rose-400 text-xs font-bold uppercase tracking-widest mt-1">Instructed by Founder: {selectedCase.founder}</p>
              </div>

              {/* Scrollable Body Content - smaller padding-right to reduce space beside scrollbar */}
              <div className="overflow-y-auto custom-modal-scrollbar pr-1.5 md:pr-2.5 flex-1 my-2">
                <div className="space-y-6 text-xs text-neutral-950 dark:text-zinc-200 leading-relaxed font-semibold">
                  <div>
                    <h5 className="font-bold text-wine dark:text-rose-400 text-sm uppercase tracking-widest mb-1">The Problem Statement</h5>
                    <p className="italic text-neutral-800 dark:text-zinc-300">"{selectedCase.problem}"</p>
                  </div>
                  <div className="border-t border-black/10 dark:border-white/15 pt-4">
                    <h5 className="font-bold text-wine dark:text-rose-400 text-sm uppercase tracking-widest mb-1">Our Student Solution</h5>
                    <p className="text-neutral-950 dark:text-zinc-100 font-semibold">{selectedCase.solution}</p>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="pt-4 border-t border-black/10 dark:border-white/15 flex justify-end mt-4">
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="bg-wine hover:bg-zinc-900 dark:hover:bg-rose-500 text-[#ffffff] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest select-none cursor-pointer transition-colors"
                >
                  Close Case file
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================= BLOG POST ADMISSIONS MODAL ======================= */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100020] flex items-center justify-center p-4 pt-20 pb-6 md:p-6 md:pt-24 md:pb-8 bg-white/80 backdrop-blur-md dark:bg-[#000000]/80 dark:backdrop-blur-md"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900/90 dark:backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl w-full max-w-3xl pl-6 pr-3 py-6 md:pl-10 md:pr-4 md:py-10 relative rounded-3xl max-h-[85vh] md:max-h-[80vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-neutral-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer z-10 bg-black/5 dark:bg-white/5 p-1.5 rounded-full"
                onClick={() => setSelectedBlog(null)}
              >
                <X size={20} />
              </button>

              {/* Fixed Header */}
              <div className="pb-4 mb-4 border-b border-black/10 dark:border-white/10 pr-8">
                <span className="inline-block px-3 py-1 bg-wine text-[#ffffff] rounded text-[9px] font-bold uppercase tracking-widest mb-3">
                  {selectedBlog.category} · {selectedBlog.date}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-neutral-950 dark:text-zinc-50 leading-tight">{selectedBlog.title}</h3>
              </div>

              {/* Scrollable Body Content - smaller padding-right to reduce space beside scrollbar */}
              <div className="overflow-y-auto custom-modal-scrollbar pr-1.5 md:pr-2.5 flex-1 my-2">
                <div className="space-y-6 text-sm text-neutral-900 dark:text-zinc-200 leading-relaxed font-medium">
                  <p className="font-bold text-neutral-950 dark:text-zinc-50 text-base leading-relaxed italic border-l-2 border-l-wine pl-4 bg-neutral-50/70 dark:bg-zinc-800/40 p-3 rounded-r-lg animate-pulse-subtle">
                    "{selectedBlog.excerpt}"
                  </p>
                  <p className="pt-2 text-neutral-950 dark:text-zinc-300">
                    {selectedBlog.content}
                  </p>
                  <p className="pt-4 border-t border-black/5 dark:border-white/10 text-xs text-neutral-600 dark:text-zinc-400 leading-normal">
                    Our comprehensive, structured case curriculum guides students to evaluate micro-markets like real-life operators. Want to build real automated agents? Check our Programs tab under AI & Proptech.
                  </p>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-end mt-4">
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="bg-wine hover:bg-zinc-950 dark:hover:bg-rose-500 text-[#ffffff] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest select-none cursor-pointer transition-colors"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
