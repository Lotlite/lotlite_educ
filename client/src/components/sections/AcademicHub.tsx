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
  Check
} from 'lucide-react';

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
  // Local form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProgram, setFormProgram] = useState('B.REM in Real Estate Management & Investment');
  const [formCategory, setFormCategory] = useState('Undergraduate');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const blogs = [
    {
      title: "The Future of PropTech in India: 2026 Outlook",
      excerpt: "How Artificial Intelligence, algorithmic pricing, and tokenised smart-contracts are transforming property valuations across major Indian metros.",
      content: "The landscape of Indian property markets is shifting at a record pace. Traditional methods depending solely on local broker sheets are yielding to algorithmic valuation modeling. By tracking micro-market parameters—such as nearby transit infrastructure, regional income gradients, and real-time transaction velocities—automated model engines can peg properties within a 3% error margin. Inside Lotlite's lab modules, students build these predictive streams directly to address broker challenges.",
      date: "May 10, 2026",
      category: "PropTech",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Why Founders are the Best Teachers",
      excerpt: "Real estate is an industry built on relationships, street-smarts, and active capital. Here is why the Lotlite school chose owner-taught models.",
      content: "Textbook real estate studies often look outdated the moment they hit print. The actual commercial game is defined in high-stakes strategy lobbies, zoning offices, and debt negotiations. By inviting active builders, CFOs, and tech owners directly to our campus, Lotlite strips away dry theoretical larping. Students hear directly about failed projects, market pivoting moves, and active term-sheet considerations.",
      date: "April 28, 2026",
      category: "Education",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "The Zero-CAC Playbook for Real Estate Developers",
      excerpt: "Building an organic distribution channel that translates local trust into home purchases without expensive listing commissions.",
      content: "As customer acquisition costs (CAC) climb to unsustainable levels across real estate developments, developers must build independent audience channels. In this paper, we details how local broker groups, digital content micro-communities, and interactive spatial maps can generate high-intent buyers organically. Read the complete study of how Vihaan Realty scaled to ₹6L monthly revenue by building regional plot directories.",
      date: "April 15, 2026",
      category: "Growth",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const faqs = [
    {
      q: "What is a B.REM degree, and is it globally recognized?",
      a: "B.REM stands for Bachelor of Real Estate Management. It is a premium professional degree designed specifically for real estate developers, investors, and startup operators. Our alignment with the Royal Institution of Chartered Surveyors (RICS) ensures global accreditation accepted in over 140 countries."
    },
    {
      q: "How does the founder-taught program work on campus?",
      a: "Over 100 founders, managing directors, and CFOs teach our cohorts directly. Instead of typical theoretical lectures, classes run like corporate board meetings. Students review real projects, solve active challenges, and receive direct executive mentorship."
    },
    {
      q: "Are there scholarships available under Lotlite?",
      a: "Yes! Financial assistance and merit-based grants are available covering up to 50% of tuition costs. Our selection process tracks standard analytical scores, high school grades, and personal interviews."
    },
    {
      q: "What kind of projects do students build inside the Incubator?",
      a: "Students build real digital proptech products, online property databases, or regional brokerage agencies. Backed by a ₹5Cr startup fund and dedicated mentoring, teams release live products on marketplaces and compile actual revenues before graduation."
    },
    {
      q: "Does the program offer guaranteed placements?",
      a: "Our dedicated placements team, led by industry recruiters, runs custom career coaching for each student. With a focus on real-world skills, graduates command an average compensation of ₹9L+ CTC, with leading performers scoring above ₹14L."
    }
  ];

  // Auto-switch outcomes carousel
  useEffect(() => {
    if (activeSection !== 'outcomes') return;
    const interval = setInterval(() => {
      setAlumniIndex((prev) => (prev + 1) % alumni.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeSection]);

  const filteredBlogs = blogFilter === 'All' ? blogs : blogs.filter(b => b.category === blogFilter);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) return;
    setIsSubmitting(true);
    setSubmitError('');
    
    // Sync option to figure out context
    let curProg = 'brem';
    if (activeSubTab.startsWith('pg-') || activeSubTab === 'pg') {
      curProg = 'pg';
    }

    const programCategory = formCategory;
    const programSpecialization = curProg === 'brem' ? 'B.REM Program' : 'PG AI & PropTech';

    const newApp = {
      id: `app-${Date.now()}`,
      name: formName,
      email: formEmail,
      phone: formPhone,
      program: `${programCategory} - ${programSpecialization}`,
      background: 'Inquiry via Academic Hub',
      status: 'Pending',
      experience: 'Submitted via Academic Hub',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formName,
          email: formEmail,
          phone: formPhone,
          programCategory: programCategory,
          programSpecialization: programSpecialization,
        })
      });

      if (!response.ok) {
        console.error('Failed to submit to backend');
        setSubmitError('Failed to submit application. Please check your connection and try again.');
        return;
      }

      const stored = localStorage.getItem('lotlite_applicants');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('lotlite_applicants', JSON.stringify([newApp, ...list]));
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalName || !proposalEmail || !proposalTopic || !proposalAbstract) return;
    setProposalSubmitted(true);
  };

  // Synchronize Program and Option state mapping for consistent routing
  let currentProgram = 'brem';
  let currentOption = 'overview';

  if (activeSubTab.startsWith('pg-')) {
    currentProgram = 'pg';
    currentOption = activeSubTab.replace('pg-', '');
  } else if (activeSubTab.startsWith('brem-')) {
    currentProgram = 'brem';
    currentOption = activeSubTab.replace('brem-', '');
  } else {
    // fallback or legacy mapping
    if (activeSubTab === 'pg') {
      currentProgram = 'pg';
      currentOption = 'overview';
    } else {
      currentProgram = 'brem';
      currentOption = 'overview';
    }
  }

  const selectProgramOption = (program: string, option: string) => {
    setActiveSubTab(`${program}-${option}`);
  };

  // Define sidebars options
  const sidebarMenus = {
    programs: [
      { id: 'overview', label: 'Overview', icon: BookOpen },
      { id: 'objective', label: 'Programme Objective', icon: Target },
      { id: 'structure', label: 'Programme Structure', icon: ClipboardList },
      { id: 'admission', label: 'Admission Process', icon: GraduationCap },
      { id: 'fees', label: 'Fees Structure', icon: HandCoins },
      { id: 'exam', label: 'Examination', icon: Award },
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

        {/* ======================= SIDEBAR LAYOUT FRAMEWORK ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: NAVIGATION (Desktop Sidebar / Mobile Pills Bar) */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 space-y-4">
            
            {/* If checking programs, render UG/PG Primary Selector inside sidebar region for absolute compactness */}
            {activeSection === 'programs' && (
              <div className="bg-input border border-border p-1 rounded-2xl flex w-full mb-4">
                <button 
                  onClick={() => selectProgramOption('brem', currentOption)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    currentProgram === 'brem' 
                      ? 'bg-wine text-[#ffffff] shadow-sm' 
                      : 'text-black/60 hover:text-red-600 dark:hover:text-wine'
                  }`}
                >
                  B.REM Degree
                </button>
                <button 
                  onClick={() => selectProgramOption('pg', currentOption)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    currentProgram === 'pg' 
                      ? 'bg-wine text-[#ffffff] shadow-sm' 
                      : 'text-black/60 hover:text-red-600 dark:hover:text-wine'
                  }`}
                >
                  PG PropTech
                </button>
              </div>
            )}

            {/* Desktop Side Menu (Vertical list) */}
            <div className="hidden lg:flex flex-col gap-2 border-r border-border pr-4">
              <span className="text-[9px] font-bold text-black/55 uppercase tracking-widest pl-3 mb-1">
                Sub Menu Navigator
              </span>
              {currentSidebarOptions.map((item) => {
                // Determine active status
                let isActive = false;
                if (activeSection === 'programs') {
                  isActive = currentOption === item.id;
                } else {
                  isActive = activeSubTab === item.id;
                }
                
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (activeSection === 'programs') {
                        selectProgramOption(currentProgram, item.id);
                      } else {
                        setActiveSubTab(item.id);
                      }
                    }}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                      isActive
                        ? 'bg-wine-light border-wine-light-border text-wine font-extrabold shadow-sm'
                        : 'bg-transparent border-transparent text-neutral-800 dark:text-zinc-400 hover:text-red-600 dark:hover:text-wine hover:bg-offwhite'
                    }`}
                  >
                    <IconComponent size={15} className={`shrink-0 transition-colors ${
                      isActive ? 'text-wine' : 'text-neutral-600 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-wine'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Horizontal Pill Bar with Elegant Progress Bar Below */}
            <div className="relative flex lg:hidden flex-col w-full mb-6">
              {/* Inner Scrolling Area */}
              <div 
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="flex overflow-x-auto gap-2 py-1 px-2 no-scrollbar scrollbar-none snap-x font-sans scroll-smooth w-full"
              >
                {currentSidebarOptions.map((item) => {
                  let isActive = false;
                  if (activeSection === 'programs') {
                    isActive = currentOption === item.id;
                  } else {
                    isActive = activeSubTab === item.id;
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (activeSection === 'programs') {
                          selectProgramOption(currentProgram, item.id);
                        } else {
                          setActiveSubTab(item.id);
                        }
                        // Smooth scroll target
                        document.getElementById('side-content-pane')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all cursor-pointer snap-start ${
                        isActive
                          ? 'bg-wine text-[#ffffff] border-wine shadow-md'
                          : 'bg-input text-neutral-500 border-border dark:border-neutral-800 dark:text-neutral-300 hover:text-wine! dark:hover:text-neutral-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Progress bar track centered below */}
              <div className="flex justify-center mt-2.5 w-full">
                <div className="w-24 h-1 bg-black/5 dark:bg-white/10 rounded-full relative overflow-hidden">
                  <div 
                    className="h-full bg-wine rounded-full transition-all duration-75 absolute left-0"
                    style={{ 
                      width: '40%', 
                      left: `${scrollRatio * 60}%` 
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Sticky contact widget inside static desktop Left boundary (for layout value) */}
            <div className="hidden lg:block p-5 bg-card border border-border rounded-2xl">
              <span className="text-[8px] tracking-widest font-black uppercase text-wine block mb-1">Lotlite Support</span>
              <p className="text-[10px] text-muted duration-300 font-medium leading-relaxed">
                Need details regarding current active enrollments? Talk directly to academic counselors.
              </p>
              <button 
                onClick={() => {
                  if (activeSection === 'programs') {
                    selectProgramOption(currentProgram, 'contact');
                  } else {
                    setActiveSection('programs');
                    selectProgramOption('brem', 'contact');
                  }
                }}
                className="mt-3 text-[9px] font-bold text-wine hover:text-black uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                Direct Admissions Desk <ChevronRight size={10} />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAIL AREA */}
          <div className="lg:col-span-9" id="side-content-pane">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${activeSubTab}`}
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
                    {/* B.REM options */}
                    {currentProgram === 'brem' && (
                      <>
                        {currentOption === 'overview' && (
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
                        )}

                        {currentOption === 'objective' && (
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
                        )}

                        {currentOption === 'structure' && (
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
                        )}

                        {currentOption === 'admission' && (
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Program Category</label>
                                        <select 
                                          required 
                                          value={formCategory}
                                          onChange={(e) => setFormCategory(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors appearance-none" 
                                        >
                                          <option value="Undergraduate">Undergraduate</option>
                                          <option value="Postgraduate">Postgraduate</option>
                                          <option value="Certification">Certification</option>
                                        </select>
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
                                    </div>
                                    {submitError && (
                                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold mb-4 border border-red-100 text-center">
                                        {submitError}
                                      </div>
                                    )}
                                    <button 
                                      type="submit" 
                                      disabled={isSubmitting}
                                      className="bg-wine hover:bg-wine-hover text-[#ffffff] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all w-full select-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                      {isSubmitting ? 'Submitting...' : 'Submit Admissions Briefing Inquiry'}
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
                        )}

                        {currentOption === 'fees' && (
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
                        )}

                        {currentOption === 'exam' && (
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
                        )}

                        {currentOption === 'contact' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ACADEMIC OFFICES</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">Admissions Contact details</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Get in touch with executive coordinators at our prime academic compound. We coordinate site tours on active request.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">Academic Coordination Desk</h4>
                                <div className="space-y-3 text-xs text-muted font-semibold">
                                  <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>b.rem@lotlite-education.in</span></div>
                                  <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3500</span></div>
                                  <div className="flex items-center gap-3"><Building2 size={14} className="text-wine" /> <span>Dean of Students Office, Wing-A</span></div>
                                </div>
                              </div>

                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">Bengaluru Campus Location</h4>
                                <p className="text-[11px] text-muted leading-relaxed font-semibold">
                                  Lotlite Tech Park Compound, Academic Buildings Wing 2, Outer Ring Road, Landmark Tech Park Sector, Bengaluru, Karnataka - 560103.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* PG Programme options */}
                    {currentProgram === 'pg' && (
                      <>
                        {currentOption === 'overview' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">1-YEAR ADVANCED SPECIALIST TRACK</span>
                            <h3 className="text-3xl md:text-4xl text-black font-serif tracking-tight">Postgraduate Program in AI & PropTech</h3>
                            <p className="text-muted text-sm md:text-base leading-relaxed font-semibold">
                              Built explicitly for progressive developers, real estate brokers seeking digital leverage, and software PMs looking to dominate modern property pipelines. Learn to write custom spatial valuation scripts (AVM), deploy AI lead-scraping databases, and understand venture-backed tokenized assets.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                              {[
                                { val: "150 Hours", sub: "Coding Sprints" },
                                { val: "25+", sub: "API Tools Taught" },
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
                        )}

                        {currentOption === 'objective' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">TARGET OUTCOMES</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">PG PropTech core Objectives</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Bridge the massive software gap in classical developer frameworks. We enable young engineering minds and MBA operators to achieve these core digital targets:
                            </p>

                            <div className="space-y-4 pt-2">
                              {[
                                { title: "Deploy Autonomic AVM Engines", desc: "Build machine-learning pricing models that evaluate property land values within a 3% deviation margin from active records." },
                                { title: "Low-CAC Distribution Mastery", desc: "Deploy organic distribution databases, programmatic search sites, and automated communication web hooks bypassing heavy traditional listing portals." },
                                { title: "Structure Venture-Scale Deals", desc: "Understand standard seed investments, code integration pipelines, and private equity APIs used inside elite proptech organizations." }
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
                        )}

                        {currentOption === 'structure' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">TERM-BY-TERM CURRICULUM</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">PG Program Term Structure</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              A intensive 3-term layout designed for speedy real-world project development and technical deployment.
                            </p>

                            <div className="space-y-4 pt-2">
                              {[
                                { term: "Term 1: No-Code & Automation Sprints", title: "Scale with Zero Coding Overhead", desc: "Bubble application design, Make.com triggers, HubSpot automated systems, WhatsApp dynamic brokerage pipelines." },
                                { term: "Term 2: Spatial AI Modeling & ML Data", title: "Automated Valuation Modeling (AVM)", desc: "OpenAI API integrations, Python data libraries, predictive real estate algorithms, GIS topographic integrations." },
                                { term: "Term 3: Venture Prototyping & Launch", title: "Release Live MVPs into Cold Traffic", desc: "Deploy your PropTech SaaS model, test conversion funnels, validate with mock buyers, pitch to VC panel for ₹10L grants." }
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
                        )}

                        {currentOption === 'admission' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ELIGIBILITY & PATHWAYS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">PG Admission Process</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Evaluated strictly on logical capabilities, portfolio drive, and project execution interest.
                            </p>

                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2 mb-3">Entrance Requirements</h4>
                              <p className="text-xs text-muted leading-relaxed font-semibold">
                                Candidates must hold a completed Bachelor’s degree in Engineering, Data Science, Economics, Business, or Architecture with a baseline 50% passing aggregate. While baseline coding experience is valuable, it is absolutely NOT mandatory—we teach the complete toolstack.
                              </p>
                              <div className="flex gap-4 items-center pt-4 mt-4 border-t border-border text-[10px] font-extrabold uppercase tracking-widest text-wine">
                                <span>1. Submit Resume Portfolio</span>
                                <span>2. Complete Portfolio Interview</span>
                                <span>3. Admission Decision</span>
                              </div>
                            </div>

                            {/* Dynamic interactive application form built-in directly as instructed */}
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-serif text-black text-lg mb-4 border-b border-border pb-2">Apply for PG AI & PropTech</h4>
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
                                          placeholder="Ayesha Khan" 
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
                                          placeholder="ayesha@domain.com" 
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Program Category</label>
                                        <select 
                                          required 
                                          value={formCategory}
                                          onChange={(e) => setFormCategory(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors appearance-none" 
                                        >
                                          <option value="Undergraduate">Undergraduate</option>
                                          <option value="Postgraduate">Postgraduate</option>
                                          <option value="Certification">Certification</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">Phone Vector</label>
                                        <input 
                                          required 
                                          type="tel" 
                                          value={formPhone}
                                          onChange={(e) => setFormPhone(e.target.value)}
                                          className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors" 
                                          placeholder="+91 93333 44444" 
                                        />
                                      </div>
                                    </div>
                                    {submitError && (
                                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold mb-4 border border-red-100 text-center">
                                        {submitError}
                                      </div>
                                    )}
                                    <button 
                                      type="submit" 
                                      disabled={isSubmitting}
                                      className="bg-wine hover:bg-wine-hover text-[#ffffff] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all w-full select-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                      {isSubmitting ? 'Submitting...' : 'Submit Admissions Briefing Inquiry'}
                                    </button>
                                  </form>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-wine font-extrabold text-sm mb-1">🎉 Enrollment Inquiry Logged!</p>
                                    <p className="text-xs text-muted font-medium">An academic enrollment coordinator will contact your mobile coordinates within 24 working hours.</p>
                                    <button onClick={() => setIsSubmitted(false)} className="text-[10px] uppercase font-bold text-black border-b border-black mt-3 cursor-pointer">Register Another Student</button>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}

                        {currentOption === 'fees' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EDUCATION INVESTMENT</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">PG AI & PropTech Fees</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              1-year investment covering server API hosting credits, direct AWS pipelines, and VC incubator pitch support.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Full 1-Year Program Tuition</span>
                                <h4 className="text-3xl font-serif text-black font-black">₹2,60,000</h4>
                                <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Complete Tuition Cover</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> OpenAI and GIS Platform Api balance</li>
                                  <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Seed pitch preparation material</li>
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
                        )}

                        {currentOption === 'exam' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">LAUNCH THESIS</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">PG Program Examination</h3>
                            <p className="text-muted text-sm leading-relaxed font-semibold">
                              To attain certification inside our modern tech lab, students are evaluated 100% on performance and launch execution. To clear graduation levels, candidates must fulfill this specific criteria:
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
                        )}

                        {currentOption === 'contact' && (
                          <div className="space-y-6">
                            <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">LOTLITE VENTURE LAB</span>
                            <h3 className="text-3xl font-serif text-black leading-tight">PG Contact details</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                              Talk directly to coordinators at the Tech Incubator wings. We respond instantly via email pipelines.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                                <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">PropTech Admissions Hub</h4>
                                <div className="space-y-3 text-xs text-muted font-semibold">
                                  <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>proptech@lotlite-education.in</span></div>
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
                        )}
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
                  <div className="space-y-6">
                    {activeSubTab === 'stats' && (
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
                    )}

                    {activeSubTab === 'carousel' && (
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
                    )}
                  </div>
                )}


                {/* ======================================================== */}
                {/* 5. SECTIONS CORRESPONDING TO INCUBATION                 */}
                {/* ======================================================== */}
                {activeSection === 'incubation' && (
                  <div className="space-y-6">
                    {activeSubTab === 'ventures' && (
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
                    )}

                    {activeSubTab === 'cases' && (
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
                    )}
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
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
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
