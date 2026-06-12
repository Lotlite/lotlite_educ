import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Search, 
  RefreshCw, 
  Check, 
  X, 
  Building2, 
  Filter, 
  Activity, 
  Zap, 
  ArrowUpRight, 
  Trash2,
  Calendar,
  FileCheck2,
  Lock,
  UserCheck,
  LogOut,
  Sparkles,
  BookOpen,
  PlusCircle,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useApp } from '../../AppContext';
import { Applicant, Venture, BlogPost, Course, Faculty, AlumniStory, PlacementStats, PlacementPartner } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const {
    applicants,
    ventures,
    admissionsLoading: loading,
    currentUser,
    fetchApplicants,
    fetchVentures,
    submitApplicant,
    updateApplicantStatus,
    deleteApplicant,
    auditVenture,
    updateVenture,
    triggerToast,

    // NEW SYNCHRONIZED APP CONTEXT ELEMENTS
    blogs,
    blogsLoading,
    fetchBlogs,
    addNewBlogPost,
    deleteBlogPost,

    courses,
    coursesLoading,
    fetchCourses,
    saveCourse,
    deleteCourse,

    faculty,
    facultyLoading,
    fetchFaculty,
    saveFaculty,
    deleteFaculty,

    placementStats,
    placementPartners,
    placementsLoading,
    fetchPlacements,
    savePlacementStats,
    addPlacementPartner,
    deletePlacementPartner,

    alumniStories,
    alumniStoriesLoading,
    fetchAlumniStories,
    saveAlumniStory,
    deleteAlumniStory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'applicants' | 'blogs' | 'programs' | 'faculty' | 'placements' | 'stories'>('dashboard');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Interview Scheduled' | 'Offered' | 'Rejected'>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  
  // Local simulated log messages for the audit ticker feed
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "System Initialized: Synced admissions with Lotlite Board",
    "Pre-seeded professional academic leads using global database stores",
    "Loaded dynamic student venture prototypes under incubation labs"
  ]);

  // Load all components from database once on mount
  useEffect(() => {
    fetchApplicants();
    fetchVentures();
    fetchBlogs();
    fetchCourses();
    fetchFaculty();
    fetchPlacements();
    fetchAlumniStories();
  }, []);

  const addAuditLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 39)]);
  };

  // Status changer connecting to REST API
  const handleUpdateStatus = async (id: string, newStatus: Applicant['status']) => {
    try {
      await updateApplicantStatus(id, newStatus);
      const candidate = applicants.find(a => a.id === id);
      const candidateName = candidate?.name || "Candidate";
      
      addAuditLog(`Updated candidate ${candidateName} status to ${newStatus}`);
      triggerToast({ 
        title: "Status Updated", 
        description: `Successfully moved ${candidateName} to ${newStatus}`,
        type: 'success'
      });

      if (selectedApplicant && selectedApplicant.id === id) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Delete lead
  const handleDeleteApplicant = async (id: string) => {
    const candidate = applicants.find(a => a.id === id);
    const candidateName = candidate?.name || "Candidate";
    try {
      await deleteApplicant(id);
      if (selectedApplicant && selectedApplicant.id === id) {
        setSelectedApplicant(null);
      }
      addAuditLog(`Purged lead info for ${candidateName}`);
      triggerToast({
        title: "Record Deleted",
        description: `Purged lead profile for ${candidateName}`,
        type: 'info'
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  // Toggle security verification audit on student venture
  const handleToggleVentureAudit = (id: string) => {
    auditVenture(id);
    const ven = ventures.find(v => v.id === id);
    if (ven) {
      addAuditLog(`Transitioned ${ven.name} audit status to: Certified`);
      triggerToast({
        title: "Security Verified",
        description: `${ven.name} audit status updated!`,
        type: 'success'
      });
    }
  };

  // Simulated live API micro-transaction recorder updates
  const handleAddLiveTransaction = (vId: string, amount: number) => {
    const ven = ventures.find(v => v.id === vId);
    if (ven) {
      const nextTraction = ven.traction + amount;
      const updatedVenture = { ...ven, traction: nextTraction };
      updateVenture(updatedVenture);
      
      addAuditLog(`Detected micro-transaction on ${ven.name}: +₹${amount}. Aggregate valuation: ₹${nextTraction}`);
      triggerToast({
        title: "Simulation Recorded",
        description: `Recorded ₹${amount} investment transaction on ${ven.name}!`,
        type: 'success'
      });
    }
  };

  // Automatically trigger a test registration simulator event to preview real-time sync with database
  const handleSimulateRegistration = async () => {
    const randomFirst = ["Pranav", "Riya", "Gaurav", "Siddharth", "Aisha", "Dhruv", "Neha"];
    const randomLast = ["Rao", "Kapoor", "Joshi", "Bose", "Nair", "Varma", "Patel"];
    const randomProgram = [
      "B.REM degree",
      "BCA Program in PropTech",
      "MCA degree in Deep Systems",
      "MBA in REIT Strategy"
    ];
    const randomUni = ["IIT Delhi Civil", "BITS Pilani Mech", "SRCC Eco", "CEPT Ahmedabad Planning", "NALSAR Hyderabad Law"];
    const randomExp = [
      "Worked 1 year as real estate valuation apprentice",
      "Founded a local coliving brokerage utility in Pune",
      "Freelance architectural designer, made 15 custom CAD filings",
      "Junior investment associate dealing in mortgage analysis"
    ];

    const fName = randomFirst[Math.floor(Math.random() * randomFirst.length)];
    const lName = randomLast[Math.floor(Math.random() * randomLast.length)];
    const fullName = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@outlook.com`;
    const program = randomProgram[Math.floor(Math.random() * randomProgram.length)];
    const background = `${randomUni[Math.floor(Math.random() * randomUni.length)]}`;
    const experience = `${randomExp[Math.floor(Math.random() * randomExp.length)]}`;
    const phone = `+91 ${90000 + Math.floor(Math.random() * 9999)} ${10000 + Math.floor(Math.random() * 89999)}`;

    await submitApplicant({
      name: fullName,
      email,
      phone,
      program,
      background,
      experience
    });

    addAuditLog(`Inbound Form Simulation: Registered ${fullName} online.`);
    triggerToast({
      title: "New Student Leads Inbound",
      description: `Form submitted for ${fullName}`,
      type: 'success'
    });
  };

  // --- BLOG MANAGEMENT STATE & LOGIC ---
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Innovation',
    author: '',
    image: ''
  });

  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt) {
      triggerToast({ title: "Input Error", description: "Title and Excerpt are mandatory.", type: 'error' });
      return;
    }
    try {
      await addNewBlogPost({
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        author: blogForm.author || "Director of Media",
        image: blogForm.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80"
      });
      addAuditLog(`Published a new blog post: "${blogForm.title}"`);
      triggerToast({ title: "Blog Published", description: "Successfully added blog post!", type: 'success' });
      setBlogForm({ title: '', excerpt: '', content: '', category: 'Innovation', author: '', image: '' });
      fetchBlogs();
    } catch {
      triggerToast({ title: "Error", description: "Failed to create blog post", type: 'error' });
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    try {
      await deleteBlogPost(id);
      addAuditLog(`Archived blog post: "${title}"`);
      triggerToast({ title: "Blog Removed", description: "Successfully purged blog post.", type: 'info' });
      fetchBlogs();
    } catch {
      triggerToast({ title: "Error", description: "Failed to delete blog post", type: 'error' });
    }
  };

  // --- PROGRAM CURRICULUM MANAGEMENT ---
  const [selectedProgramId, setSelectedProgramId] = useState<string>('brem');
  const [programForm, setProgramForm] = useState({
    id: '',
    title: '',
    duration: '',
    description: '',
    focus: '',
    overview: '',
    curriculumRaw: '',
    tuition: '',
    security: '',
    total: ''
  });

  // Prepopulate form when program or course changes
  useEffect(() => {
    if (courses[selectedProgramId]) {
      const prog = courses[selectedProgramId];
      setProgramForm({
        id: prog.id,
        title: prog.title,
        duration: prog.duration,
        description: prog.description,
        focus: prog.focus,
        overview: prog.overview,
        curriculumRaw: Array.isArray(prog.curriculum) ? prog.curriculum.join('\n') : '',
        tuition: prog.fees?.tuition || '',
        security: prog.fees?.security || '',
        total: prog.fees?.total || ''
      });
    } else {
      setProgramForm({
        id: selectedProgramId === 'new' ? '' : selectedProgramId,
        title: '',
        duration: '',
        description: '',
        focus: '',
        overview: '',
        curriculumRaw: '',
        tuition: '',
        security: '',
        total: ''
      });
    }
  }, [selectedProgramId, courses]);

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.id || !programForm.title) {
      triggerToast({ title: "Input Error", description: "ID and Title are mandatory fields.", type: 'error' });
      return;
    }
    const idClean = programForm.id.toLowerCase().trim().replace(/\s+/g, '-');
    const curriculum = programForm.curriculumRaw.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const programObj: Course = {
      id: idClean,
      title: programForm.title,
      duration: programForm.duration,
      description: programForm.description,
      focus: programForm.focus,
      overview: programForm.overview,
      curriculum,
      fees: {
        tuition: programForm.tuition,
        security: programForm.security,
        total: programForm.total
      }
    };

    try {
      await saveCourse(programObj);
      addAuditLog(`Synchronized Academic Course Specs for ${programForm.title}`);
      triggerToast({ title: "Academic Specs Saved", description: `${programForm.title} successfully configured`, type: 'success' });
      fetchCourses();
      setSelectedProgramId(idClean);
    } catch {
      triggerToast({ title: "Error", description: "Failed to synchronize academic program", type: 'error' });
    }
  };

  const handleDeleteProgram = async (id: string, name: string) => {
    if (['brem', 'bca', 'mca', 'mba'].includes(id)) {
      triggerToast({ title: "Scope Restriction", description: "Core academic programmes cannot be deleted.", type: 'info' });
      return;
    }
    try {
      await deleteCourse(id);
      addAuditLog(`De-authorized extra academic programme: ${name}`);
      triggerToast({ title: "Programme Purged", description: `Deconfigured ${name} from core registry`, type: 'info' });
      setSelectedProgramId('brem');
      fetchCourses();
    } catch {
      triggerToast({ title: "Error", description: "Failed to purge program", type: 'error' });
    }
  };

  // --- FACULTY STATE & LOGIC ---
  const [facultyForm, setFacultyForm] = useState({
    id: '',
    name: '',
    course: '',
    title: '',
    overview: '',
    tagsRaw: '',
    image: ''
  });

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.course || !facultyForm.title) {
      triggerToast({ title: "Input Error", description: "Name, Course, and Academic Title are mandatory.", type: 'error' });
      return;
    }
    const tags = facultyForm.tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const facultyObj: Faculty = {
      id: facultyForm.id || `fac-${Date.now()}`,
      name: facultyForm.name,
      course: facultyForm.course,
      title: facultyForm.title,
      overview: facultyForm.overview,
      tags,
      image: facultyForm.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80"
    };

    try {
      await saveFaculty(facultyObj);
      addAuditLog(`Registered/Updated Lecturer Desk Coordinates for Prof. ${facultyForm.name}`);
      triggerToast({ title: "Faculty Desk Saved", description: `Profile for prof. ${facultyForm.name} written`, type: 'success' });
      setFacultyForm({ id: '', name: '', course: '', title: '', overview: '', tagsRaw: '', image: '' });
      fetchFaculty();
    } catch {
      triggerToast({ title: "Error", description: "Failed to save faculty desk", type: 'error' });
    }
  };

  const handleDeleteFaculty = async (id: string, name: string) => {
    try {
      await deleteFaculty(id);
      addAuditLog(`Dismissed faculty credentials from desk for Prof. ${name}`);
      triggerToast({ title: "Lecturer credentials removed", description: `De-allocated desk for Prof. ${name}`, type: 'info' });
      fetchFaculty();
    } catch {
      triggerToast({ title: "Error", description: "Failed to delete lecturer coordinates", type: 'error' });
    }
  };

  // --- PLACEMENT METRICS & LOGIC ---
  const [statsForm, setStatsForm] = useState({
    averageCTC: '',
    peakPackage: '',
    placementRate: '',
    activeCompaniesCount: 40,
    ctcMultiplier: ''
  });

  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    if (placementStats) {
      setStatsForm({
        averageCTC: placementStats.averageCTC || '',
        peakPackage: placementStats.peakPackage || '',
        placementRate: placementStats.placementRate || '',
        activeCompaniesCount: Number(placementStats.activeCompaniesCount) || 40,
        ctcMultiplier: placementStats.ctcMultiplier || ''
      });
    }
  }, [placementStats]);

  const handleSavePlacementStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savePlacementStats({
        averageCTC: statsForm.averageCTC,
        peakPackage: statsForm.peakPackage,
        placementRate: statsForm.placementRate,
        activeCompaniesCount: Number(statsForm.activeCompaniesCount) || 40,
        ctcMultiplier: statsForm.ctcMultiplier
      });
      addAuditLog(`Calibrated placements multiplier metric matrix.`);
      triggerToast({ title: "Placement KPIs Synced", description: "KPI statistics calibrated successfully", type: 'success' });
      fetchPlacements();
    } catch {
      triggerToast({ title: "Error", description: "Failed to update placements", type: 'error' });
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) return;
    try {
      await addPlacementPartner(partnerName.trim());
      addAuditLog(`Affiliated hiring corporation board partner: ${partnerName}`);
      triggerToast({ title: "Employer Affiliated", description: `Added Corporate partner: ${partnerName}`, type: 'success' });
      setPartnerName('');
      fetchPlacements();
    } catch {
      triggerToast({ title: "Error", description: "Failed to save hiring brand", type: 'error' });
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    try {
      await deletePlacementPartner(id);
      addAuditLog(`Revoked corporate recruiter affiliation: ${name}`);
      triggerToast({ title: "Brand Affiliation Revoked", description: `De-listed ${name} recruiter profile`, type: 'info' });
      fetchPlacements();
    } catch {
      triggerToast({ title: "Error", description: "Failed to revoke partner", type: 'error' });
    }
  };

  // --- SUCCESS STORIES STATE & LOGIC ---
  const [storyForm, setStoryForm] = useState({
    id: '',
    name: '',
    role: '',
    company: '',
    batch: '',
    package: '',
    review: ''
  });

  const handleSaveAlumniStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.name || !storyForm.role || !storyForm.company || !storyForm.review) {
      triggerToast({ title: "Input Error", description: "Name, Role, Company, and Review text are mandatory fields.", type: 'error' });
      return;
    }
    try {
      await saveAlumniStory({
        id: storyForm.id || `alum-${Date.now()}`,
        name: storyForm.name,
        role: storyForm.role,
        company: storyForm.company,
        batch: storyForm.batch || "2026",
        package: storyForm.package || "N/A",
        review: storyForm.review
      });
      addAuditLog(`Logged Alumnus success story testimonial: ${storyForm.name}`);
      triggerToast({ title: "Alumnus Review Saved", description: `Success profile published for ${storyForm.name}`, type: 'success' });
      setStoryForm({ id: '', name: '', role: '', company: '', batch: '', package: '', review: '' });
      fetchAlumniStories();
    } catch {
      triggerToast({ title: "Error", description: "Failed to save success review", type: 'error' });
    }
  };

  const handleDeleteAlumniStory = async (id: string, name: string) => {
    try {
      await deleteAlumniStory(id);
      addAuditLog(`Archived success story testimonial profile for Alumnus: ${name}`);
      triggerToast({ title: "Archive Confirmed", description: "Purged success stories testaments", type: 'info' });
      fetchAlumniStories();
    } catch {
      triggerToast({ title: "Error", description: "Failed to delete success story", type: 'error' });
    }
  };

  // Aggregated analytical variables
  const countByStatus = (status: Applicant['status']) => 
    applicants.filter(app => app.status === status).length;

  const totalTraction = ventures.reduce((acc, ven) => acc + ven.traction, 0);

  const barChartData = [
    { name: 'Pending', count: countByStatus('Pending'), color: '#a3a3a3' },
    { name: 'Interviews', count: countByStatus('Interview Scheduled'), color: '#3b82f6' },
    { name: 'Offered', count: countByStatus('Offered'), color: '#10b981' },
    { name: 'Rejected', count: countByStatus('Rejected'), color: '#ef4444' }
  ];

  const areaChartData = [
    { day: '05-10', applications: 24, traction: 120000 },
    { day: '05-15', applications: 35, traction: 340000 },
    { day: '05-20', applications: 58, traction: 560000 },
    { day: '05-25', applications: 78, traction: 890000 },
    { day: '05-30', applications: 94, traction: 1140000 },
    { day: '06-05', applications: applicants.length * 10, traction: totalTraction * 100 }
  ];

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) || 
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.program.toLowerCase().includes(search.toLowerCase()) ||
      app.background.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-24 sm:py-28 relative z-10" id="admin-dashboard-container">
      {/* Header boundary bar styled premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/80 mb-8" id="dashboard-header">
        <div>
          <div className="flex items-center gap-2 text-wine font-black text-[10px] uppercase tracking-widest">
            <Lock size={12} />
            <span>Administrative Board Cockpit</span>
          </div>
          <h1 className="text-3xl font-serif font-black tracking-tight text-black mt-2">
            Control Center
          </h1>
          <p className="text-sm text-neutral-500 mt-1 uppercase font-mono text-[10px] tracking-widest font-semibold flex items-center gap-1">
            <Activity size={12} className="text-[#22c55e] animate-pulse" />
            Active Session Context: {currentUser?.name || "Academic Secretary"} ({currentUser?.email || "internal-api"})
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSimulateRegistration}
            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-border rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-800 transition-colors cursor-pointer flex items-center gap-1.5"
            id="simulate-lead-btn"
          >
            <Zap size={13} className="text-amber-500 fill-amber-500" />
            Simulate Inbound Lead
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-wine hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5"
            id="dashboard-logout-btn"
          >
            <LogOut size={13} />
            Sign Out Securely
          </button>
        </div>
      </div>

      {/* HORIZONTAL BOARD TABS SELECTION STRIP */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-4 mb-8 w-full" id="admin-main-tabs-rail">
        {[
          { id: 'dashboard', label: 'View Dashboard', icon: <Activity size={13} /> },
          { id: 'applicants', label: `Admissions (${applicants.length})`, icon: <Users size={13} /> },
          { id: 'blogs', label: `Manage Blogs (${blogs.length})`, icon: <FileText size={13} /> },
          { id: 'programs', label: `Manage Programs (${Object.keys(courses).length})`, icon: <Building2 size={13} /> },
          { id: 'faculty', label: `Manage Faculty (${faculty.length})`, icon: <UserCheck size={13} /> },
          { id: 'placements', label: 'Manage Placements', icon: <Briefcase size={13} /> },
          { id: 'stories', label: `Success Stories (${alumniStories.length})`, icon: <Award size={13} /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-wine text-white shadow-md'
                : 'bg-neutral-50 border border-border/80 text-zinc-500 hover:text-black hover:bg-neutral-100'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of 4 Key Stats Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10" id="dashboard-metrics-grid">
        <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Applications</span>
              <div className="p-1 rounded-md bg-wine-light text-wine font-black"><Users size={14} /></div>
            </div>
            <p className="text-3xl font-serif font-bold text-black mt-3">{applicants.length}</p>
          </div>
          <p className="text-[9px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Total Active Leads</p>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Interviews</span>
              <div className="p-1 rounded-md bg-blue-50 text-blue-600"><Clock size={14} /></div>
            </div>
            <p className="text-3xl font-serif font-bold text-black mt-3">{countByStatus('Interview Scheduled')}</p>
          </div>
          <p className="text-[9px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Pending Evaluation</p>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Offered Tiers</span>
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600"><CheckCircle2 size={14} /></div>
            </div>
            <p className="text-3xl font-serif font-bold text-black mt-3">{countByStatus('Offered')}</p>
          </div>
          <p className="text-[9px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Admission Offers</p>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Placement Rate</span>
              <div className="p-1 rounded-md bg-wine-light text-wine font-black"><TrendingUp size={14} /></div>
            </div>
            <p className="text-3xl font-serif font-bold text-black mt-3">{placementStats?.placementRate || "100%"}</p>
          </div>
          <p className="text-[9px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Outcomes KPI</p>
        </div>
      </div>

      {/* RENDER ACTIVE TAB BODY */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full"
        >
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="dashboard-tab-view">
              {/* Left Grid Area: Recharts Visualization charts */}
              <div className="lg:col-span-8 space-y-8">
                <div className="p-6 bg-[#ffffff] border border-border rounded-2xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black mb-4 flex items-center justify-between w-full">
                    <span>Applications & Dynamic Growth Ticker</span>
                    <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-widest">Synced statistics engine</span>
                  </h3>
                  <div className="h-48 sm:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaChartData}>
                        <defs>
                          <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#800020" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#800020" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="day" stroke="#a3a3a3" fontSize={9} />
                        <YAxis stroke="#a3a3a3" fontSize={9} />
                        <Tooltip />
                        <Area type="monotone" dataKey="applications" stroke="#800020" strokeWidth={2} fillOpacity={1} fill="url(#colorApplications)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Micro bento stat panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-white border border-border rounded-2xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] block mb-2">Publishing Status</span>
                    <p className="text-xs font-medium text-neutral-500 leading-relaxed">
                      All system elements are active. We detected <span className="font-bold text-black font-mono">{blogs.length} analytical articles</span> currently published to public media feeds, and <span className="font-bold text-black font-mono">{faculty.length} allocated lecture chairs</span> available online.
                    </p>
                  </div>
                  <div className="p-6 bg-white border border-border rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] block mb-2">Corporate Engagement</span>
                    <p className="text-xs font-medium text-neutral-500 leading-relaxed">
                      Master board features <span className="font-bold text-black font-mono">{placementPartners.length} registered global brands</span> active in recruiting programs. Peak salary packages command up to <span className="font-bold text-black font-mono">{placementStats?.peakPackage || "₹14.5L"} CTC</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side Column (Audit feeds and Ventures) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Active Log ticker feed */}
                <div className="p-6 bg-[#ffffff] border border-border rounded-2xl">
                  <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Activity size={15} className="text-wine" />
                      <span className="text-xs font-serif font-black tracking-tight text-black">Audit Stream Feed</span>
                    </div>
                    <span className="text-[7.5px] font-bold uppercase tracking-widest font-mono text-zinc-400 py-0.5 px-1.5 bg-neutral-100 rounded border border-neutral-200">SYSTEM LIVE</span>
                  </div>
                  
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                    {auditLogs.map((log, index) => (
                      <div key={index} className="flex gap-2.5 items-start text-[9px] uppercase font-mono tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-wine mt-1 shrink-0" />
                        <p className="text-black/70 leading-normal hover:text-black font-semibold transition-colors">
                          {log}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incubations */}
                <div className="p-6 bg-[#ffffff] border border-border rounded-2xl">
                  <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
                    <span className="text-xs font-serif font-black tracking-tight text-black">Incubated Startups</span>
                    <span className="text-[8px] font-mono font-bold tracking-widest text-[#10b981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">VALUATION STREAM</span>
                  </div>

                  <div className="space-y-4">
                    {ventures.map((ven) => (
                      <div key={ven.id} className="p-4 bg-neutral-50/50 border border-neutral-200/60 rounded-xl hover:border-black/10 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-serif font-bold text-black flex items-center gap-1">
                              <Building2 size={13} className="text-wine shrink-0" />
                              {ven.name}
                            </h4>
                            <p className="text-[9px] text-[#737373] tracking-wide mt-0.5 uppercase font-bold font-mono">Founders: {ven.founders}</p>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${
                            ven.status === 'Audited & Certified'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-400/20'
                              : 'bg-amber-50 text-amber-600 border-amber-400/20'
                          }`}>
                            {ven.status === 'Audited & Certified' ? 'Audited' : 'No Audit'}
                          </span>
                        </div>

                        <p className="text-[10px] text-muted font-medium mt-2 leading-tight">
                          {ven.description}
                        </p>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200/60">
                          <div>
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-400 block">Traction Metrics</span>
                            <span className="text-xs font-mono font-black text-black">₹ {ven.traction.toLocaleString()}</span>
                          </div>
                          
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleAddLiveTransaction(ven.id, 1000)}
                              className="p-1 px-2.5 bg-[#ffffff] hover:bg-neutral-100 border border-neutral-200 text-zinc-600 font-semibold uppercase tracking-wider text-[8px] rounded-lg cursor-pointer"
                            >
                              + ₹1K
                            </button>
                            {ven.status !== 'Audited & Certified' && (
                              <button
                                onClick={() => handleToggleVentureAudit(ven.id)}
                                className="px-2 py-1 bg-wine text-[#ffffff] hover:bg-black font-bold uppercase tracking-wider text-[8px] rounded-lg cursor-pointer"
                              >
                                Certify
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applicants' && (
            <div className="bg-[#ffffff] border border-border rounded-2xl overflow-hidden" id="applicants-tab-view">
              <div className="p-6 border-b border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 font-mono">Lead Database Filter</span>
                  <span className="text-sm font-serif font-black tracking-tight text-black">Active Admissions Registry</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search applicant lists..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-[10px] uppercase font-bold tracking-wider bg-neutral-50/50 focus:border-wine outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 border border-border rounded-xl p-1 bg-neutral-50 bg-neutral-50">
                    {['All', 'Pending', 'Interview Scheduled', 'Offered', 'Rejected'].map((statusOption) => (
                      <button
                        key={statusOption}
                        onClick={() => setStatusFilter(statusOption as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          statusFilter === statusOption
                            ? 'bg-wine text-white shadow-sm font-black'
                            : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                        }`}
                      >
                        {statusOption === 'Interview Scheduled' ? 'Interviews' : statusOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={24} className="text-wine animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-neutral-400 animate-pulse">Syncing Admissions Ledger</span>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-center">
                  <p className="text-zinc-600 font-serif font-bold text-sm">No Applicants Found</p>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Try relaxing filters or search phrases. Click 'Simulate inbound lead' above to test.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/70 border-b border-border/60">
                        <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-[#a3a3a3]">Student Candidate</th>
                        <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-[#a3a3a3]">Subscribed Program</th>
                        <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-[#a3a3a3]">Status State</th>
                        <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplicants.map((app) => (
                        <tr key={app.id} className="border-b border-border/40 hover:bg-neutral-50/40 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex flex-col">
                              <span 
                                onClick={() => setSelectedApplicant(app)}
                                className="text-xs font-serif font-bold text-black hover:text-wine hover:underline cursor-pointer transition-colors"
                              >
                                {app.name}
                              </span>
                              <span className="text-[9px] text-zinc-400 font-medium font-mono mt-0.5">{app.email} | {app.phone}</span>
                              <span className="text-[8px] uppercase tracking-wider text-wine font-black mt-1 bg-wine-light/50 px-2 py-0.5 rounded border border-wine/10 w-max">{app.background}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-800">{app.program}</span>
                            <span className="text-[8px] text-zinc-400 block mt-0.5 font-sans">Applied Calendar Log: {app.appliedDate}</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-extrabold uppercase tracking-wider border ${
                              app.status === 'Offered' ? 'bg-emerald-50 text-emerald-700 border-emerald-400/20' :
                              app.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-400/20' :
                              app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-400/20' :
                              'bg-neutral-50 text-neutral-500 border-neutral-300/40'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                app.status === 'Offered' ? 'bg-emerald-500' :
                                app.status === 'Interview Scheduled' ? 'bg-blue-500' :
                                app.status === 'Rejected' ? 'bg-rose-500' :
                                'bg-zinc-400'
                              }`} />
                              {app.status === 'Interview Scheduled' ? 'Interview' : app.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right whitespace-nowrap animate-fade-in">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'Interview Scheduled')}
                                title="Schedule interview dialogue"
                                className="p-1.5 rounded-lg border border-border bg-white text-zinc-500 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer"
                              >
                                <Clock size={12} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'Offered')}
                                title="Accept & Offer admission certificate"
                                className="p-1.5 rounded-lg border border-border bg-white text-zinc-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 size={12} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                                title="Decline applicant"
                                className="p-1.5 rounded-lg border border-border bg-white text-zinc-500 hover:text-red-500 hover:border-rose-200 transition-colors cursor-pointer"
                              >
                                <XCircle size={12} />
                              </button>
                              <span className="w-px h-4 bg-border/60 mx-1 block" />
                              <button
                                onClick={() => handleDeleteApplicant(app.id)}
                                title="Permanently remove record"
                                className="p-1.5 rounded-lg border border-border bg-neutral-50 text-red-500 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="blogs-tab-view">
              <div className="lg:col-span-4 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <PlusCircle size={14} className="text-wine animate-pulse" />
                    <h3 className="text-xs font-serif font-black tracking-tight text-black">Compose New Blog</h3>
                  </div>
                  <span className="text-[7.5px] font-mono uppercase bg-neutral-100 rounded px-1.5 py-0.5 font-bold">In-memory Store</span>
                </div>
                <form onSubmit={handlePublishBlog} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Document Title</label>
                    <input
                      type="text"
                      required
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      placeholder="e.g. Unlocking REIT Value in 2026"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Author Name</label>
                      <input
                        type="text"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        placeholder="e.g. Dr. Anil Bassamboo"
                        className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Category Tag</label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="bg-neutral-50/50 border border-border rounded-xl px-3 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full"
                      >
                        <option value="PropTech">PropTech</option>
                        <option value="Academics">Academics</option>
                        <option value="Innovation">Innovation</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Growth">Growth</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Hero Image Address Url</label>
                    <input
                      type="text"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      placeholder="Paste unsplash or web image url"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Compact Excerpt (Text)</label>
                    <textarea
                      required
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      placeholder="Provide a 1-2 sentence preview description for card layout..."
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full min-h-[70px]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Full Content Markdown / Plain text</label>
                    <textarea
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      placeholder="Write extensive blog text details here..."
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full min-h-[140px]"
                    />
                  </div>
                  <button type="submit" className="w-full px-4 py-2.5 bg-wine hover:bg-black text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                    Publish Online Article
                  </button>
                </form>
              </div>

              <div className="lg:col-span-8 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5">
                  <h3 className="text-xs font-serif font-black tracking-tight text-black">Active Blog Ledger</h3>
                </div>
                {blogsLoading ? (
                  <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-wine" /></div>
                ) : blogs.length === 0 ? (
                  <p className="text-neutral-500 font-serif p-6 text-center text-sm">No blogs currently live.</p>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((b) => (
                      <div key={b.id} className="p-4 bg-neutral-50/40 border border-neutral-200/50 rounded-xl hover:border-black/5 flex gap-4 items-start justify-between">
                        <div className="flex gap-4 items-center">
                          <img src={b.image} alt={b.title} className="w-16 h-16 rounded-lg object-cover border shrink-0 bg-neutral-200" referrerPolicy="no-referrer" />
                          <div>
                            <span className="text-[7.5px] font-mono bg-wine-light font-black text-wine uppercase px-2 py-0.5 rounded mr-2 border border-wine/10">{b.category}</span>
                            <span className="text-[7.5px] font-mono text-zinc-400 font-bold">{b.date}</span>
                            <h4 className="text-xs font-serif font-bold text-black mt-1">{b.title}</h4>
                            <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">By {b.author || "Director"} • {b.excerpt}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteBlog(b.id, b.title)}
                          className="p-1 px-2.5 border border-rose-200 hover:bg-rose-50 rounded-lg text-red-500 hover:text-red-700 transition-colors shrink-0"
                          title="Purge article"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="programs-tab-view">
              <div className="lg:col-span-4 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5 flex items-center justify-between">
                  <h3 className="text-xs font-serif font-black tracking-tight text-black flex items-center gap-1.5">
                    <BookOpen size={14} className="text-wine" />
                    <span>Select Programme</span>
                  </h3>
                  <button
                    onClick={() => setSelectedProgramId('new')}
                    className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg border text-neutral-800 text-[8px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={11} />
                    Add program
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.values(courses).map((courseItem) => (
                    <button
                      key={courseItem.id}
                      onClick={() => setSelectedProgramId(courseItem.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between group transition-all cursor-pointer ${
                        selectedProgramId === courseItem.id
                          ? 'border-wine bg-wine/5 shadow-sm font-black'
                          : 'border-neutral-200 bg-neutral-50/30 hover:bg-neutral-50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-serif font-bold text-black">{courseItem.title}</p>
                        <span className="text-[8.5px] font-mono text-neutral-400 font-bold uppercase">{courseItem.duration}</span>
                      </div>
                      {!['brem', 'bca', 'mca', 'mba'].includes(courseItem.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProgram(courseItem.id, courseItem.title);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-rose-50 border border-rose-200 hover:text-red-600 rounded-lg text-zinc-400 transition-all cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </button>
                  ))}
                  {selectedProgramId === 'new' && (
                    <div className="w-full p-3 rounded-xl border border-dashed border-wine bg-wine/5 text-xs text-wine font-black">
                      Configuring a new program spec item...
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5 flex items-center justify-between">
                  <h3 className="text-xs font-serif font-black tracking-tight text-black">
                    {selectedProgramId === 'new' ? 'Configure New Academic Program' : `Syllabus Specs: ${courses[selectedProgramId]?.title || selectedProgramId.toUpperCase()}`}
                  </h3>
                  <span className="text-[8px] font-mono text-neutral-400 font-bold uppercase">Dynamic Syllabus Node</span>
                </div>
                <form onSubmit={handleSaveProgram} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Unique Key ID (No spaces)</label>
                      <input
                        type="text"
                        required
                        disabled={selectedProgramId !== 'new'}
                        value={programForm.id}
                        onChange={(e) => setProgramForm({ ...programForm, id: e.target.value })}
                        placeholder="e.g. bca, ms-prop"
                        className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black font-mono focus:border-wine focus:bg-white outline-none w-full disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Display Course Nomenclature</label>
                      <input
                        type="text"
                        required
                        value={programForm.title}
                        onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                        placeholder="e.g. Master of Science in Computational Real Estate"
                        className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Duration Description</label>
                      <input
                        type="text"
                        value={programForm.duration}
                        onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                        placeholder="e.g. 4 Years (Undergraduate)"
                        className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Focus Highlight Statement</label>
                      <input
                        type="text"
                        value={programForm.focus}
                        onChange={(e) => setProgramForm({ ...programForm, focus: e.target.value })}
                        placeholder="e.g. Real Estate Development, investment & land law"
                        className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Brief Description Excerpt</label>
                    <textarea
                      value={programForm.description}
                      onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                      placeholder="Brief card level preview of the course..."
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine focus:bg-white outline-none w-full min-h-[50px]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Detailed Program Overview</label>
                    <textarea
                      value={programForm.overview}
                      onChange={(e) => setProgramForm({ ...programForm, overview: e.target.value })}
                      placeholder="Write comprehensive objectives, core learning pillars, global standards..."
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2.5 text-xs text-black focus:border-wine focus:bg-white outline-none w-full min-h-[90px]"
                    />
                  </div>

                  <div className="p-4 border border-zinc-200/80 rounded-xl bg-zinc-50/30">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] block mb-3">Tuition Fees Structure metrics</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[8px] font-bold uppercase text-neutral-400 mb-1 block">Tuition Fee</label>
                        <input
                          type="text"
                          value={programForm.tuition}
                          onChange={(e) => setProgramForm({ ...programForm, tuition: e.target.value })}
                          placeholder="e.g. ₹ 2,90,000 / Sem"
                          className="bg-white border rounded-lg px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold uppercase text-neutral-400 mb-1 block">Security Deposit</label>
                        <input
                          type="text"
                          value={programForm.security}
                          onChange={(e) => setProgramForm({ ...programForm, security: e.target.value })}
                          placeholder="e.g. ₹ 50,000 (Refundable)"
                          className="bg-white border rounded-lg px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold uppercase text-neutral-400 mb-1 block">Total Estimates</label>
                        <input
                          type="text"
                          value={programForm.total}
                          onChange={(e) => setProgramForm({ ...programForm, total: e.target.value })}
                          placeholder="e.g. ₹ 24,20,000"
                          className="bg-white border rounded-lg px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Syllabus Program Structure (One Year/topic per line)</label>
                    <textarea
                      value={programForm.curriculumRaw}
                      onChange={(e) => setProgramForm({ ...programForm, curriculumRaw: e.target.value })}
                      placeholder="e.g. Year 1: Real Estate Fundamentals, Legal Systems&#10;Year 2: Geographic Information, Infrastructure economics&#10;Year 3: Real Estate Valuations, Advanced Modeling"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs font-mono text-black focus:border-wine focus:bg-white outline-none w-full min-h-[100px]"
                    />
                  </div>

                  <button type="submit" className="px-5 py-2.5 bg-wine hover:bg-black text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                    Commit Program Specification Node
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="faculty-tab-view">
              <div className="lg:col-span-4 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-wine shrink-0" />
                  <h3 className="text-xs font-serif font-black tracking-tight text-black">Assign Lecturer Desk</h3>
                </div>
                <form onSubmit={handleSaveFaculty} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Full Name of Staff Member</label>
                    <input
                      type="text"
                      required
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                      placeholder="e.g. Prof. Arvind Subramanian"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Designated Subject Course</label>
                    <input
                      type="text"
                      required
                      value={facultyForm.course}
                      onChange={(e) => setFacultyForm({ ...facultyForm, course: e.target.value })}
                      placeholder="e.g. Land Development Valuation"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Academic Title Credentials string</label>
                    <input
                      type="text"
                      required
                      value={facultyForm.title}
                      onChange={(e) => setFacultyForm({ ...facultyForm, title: e.target.value })}
                      placeholder="e.g. Kellogg School of Management Emeritus / ISB Advisor"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Credential Badges tags (Comma separated)</label>
                    <input
                      type="text"
                      value={facultyForm.tagsRaw}
                      onChange={(e) => setFacultyForm({ ...facultyForm, tagsRaw: e.target.value })}
                      placeholder="MIT Center, Harvard, REIT advisor"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Staff Profile Image Address Url</label>
                    <input
                      type="text"
                      value={facultyForm.image}
                      onChange={(e) => setFacultyForm({ ...facultyForm, image: e.target.value })}
                      placeholder="e.g. Paste profile link"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Academic Bios & Focus Overview</label>
                    <textarea
                      value={facultyForm.overview}
                      onChange={(e) => setFacultyForm({ ...facultyForm, overview: e.target.value })}
                      placeholder="Describe publications, professional tracks, and academic achievements..."
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full min-h-[90px]"
                    />
                  </div>
                  <button type="submit" className="w-full px-4 py-2.5 bg-wine hover:bg-black text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                    Commit Faculty Desk Node
                  </button>
                </form>
              </div>

              <div className="lg:col-span-8 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5">
                  <h3 className="text-xs font-serif font-black tracking-tight text-black">Academic Faculty Ledger</h3>
                </div>
                {facultyLoading ? (
                  <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-wine" /></div>
                ) : faculty.length === 0 ? (
                  <p className="text-neutral-500 font-serif p-6 text-center text-sm">No faculty members found in registry.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faculty.map((f) => (
                      <div key={f.id} className="p-4 bg-neutral-50/30 border border-neutral-200/60 rounded-xl relative hover:border-black/5 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-4 items-start mb-3">
                            <img src={f.image} alt={f.name} className="w-14 h-14 rounded-full object-cover border shrink-0 bg-neutral-200" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="text-xs font-serif font-black text-black">{f.name}</h4>
                              <p className="text-[9px] font-extrabold text-wine uppercase font-mono mt-0.5">{f.course}</p>
                              <p className="text-[8.5px] text-zinc-500 italic mt-0.5">{f.title}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-600 leading-normal mt-2 line-clamp-3">
                            {f.overview}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {f.tags?.map((t, i) => (
                              <span key={i} className="text-[7.5px] uppercase font-bold tracking-wide px-2 py-0.5 bg-white border border-border/80 text-neutral-400 rounded-full font-mono">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-dashed flex justify-end">
                          <button
                            onClick={() => handleDeleteFaculty(f.id, f.name)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-red-700 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 size={11} />
                            Purge Lecturer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'placements' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="placements-tab-view">
              <div className="lg:col-span-4 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-wine" />
                  <h3 className="text-xs font-serif font-black tracking-tight text-black">Calibrate Placements Stats</h3>
                </div>
                <form onSubmit={handleSavePlacementStats} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Average CTC Package Level</label>
                    <input
                      type="text"
                      required
                      value={statsForm.averageCTC}
                      onChange={(e) => setStatsForm({ ...statsForm, averageCTC: e.target.value })}
                      placeholder="e.g. ₹9L+"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Peak Package level</label>
                    <input
                      type="text"
                      required
                      value={statsForm.peakPackage}
                      onChange={(e) => setStatsForm({ ...statsForm, peakPackage: e.target.value })}
                      placeholder="e.g. ₹14.5L"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Aggregate Placement Percentage</label>
                    <input
                      type="text"
                      required
                      value={statsForm.placementRate}
                      onChange={(e) => setStatsForm({ ...statsForm, placementRate: e.target.value })}
                      placeholder="e.g. 100%"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Companies Count</label>
                      <input
                        type="number"
                        required
                        value={statsForm.activeCompaniesCount}
                        onChange={(e) => setStatsForm({ ...statsForm, activeCompaniesCount: Number(e.target.value) })}
                        placeholder="40"
                        className="bg-neutral-50/50 border border-border rounded-xl px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Average Multiplier</label>
                      <input
                        type="text"
                        required
                        value={statsForm.ctcMultiplier}
                        onChange={(e) => setStatsForm({ ...statsForm, ctcMultiplier: e.target.value })}
                        placeholder="3.2X"
                        className="bg-neutral-50/50 border border-border rounded-xl px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full px-4 py-2.5 bg-wine hover:bg-black text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                    Synchronize KPIs Board
                  </button>
                </form>
              </div>

              <div className="lg:col-span-8 space-y-8">
                {/* BRAND AFFILIATIONS SEGMENT */}
                <div className="p-6 bg-white border border-border rounded-2xl">
                  <div className="pb-3 border-b border-border/80 mb-5 flex items-center justify-between">
                    <h3 className="text-xs font-serif font-black tracking-tight text-black">Employers & Recruiter Alliances</h3>
                    <span className="text-[8px] font-mono font-bold uppercase text-neutral-400">Master Board Panel</span>
                  </div>

                  <form onSubmit={handleAddPartner} className="flex gap-3 mb-6">
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Enter hiring corporate brand name (e.g. CBRE, Knight Frank)"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2.5 text-xs text-black focus:border-wine focus:bg-white outline-none flex-1"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-wine hover:bg-black text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shrink-0 transition-all">
                      Affiliate Recruiter
                    </button>
                  </form>

                  {placementsLoading ? (
                    <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-wine" /></div>
                  ) : placementPartners.length === 0 ? (
                    <p className="text-neutral-500 font-serif p-4 text-center">No affiliated recruiting partners registered.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {placementPartners.map((p) => (
                        <div key={p.id} className="p-3 border border-neutral-200/70 bg-neutral-50/35 hover:bg-white rounded-xl flex items-center justify-between group transition-all">
                          <span className="text-xs font-mono font-black text-neutral-800">{p.name}</span>
                          <button
                            onClick={() => handleDeletePartner(p.id, p.name)}
                            className="p-1.5 opacity-0 group-hover:opacity-100 bg-rose-50 text-red-500 hover:text-red-700 hover:bg-rose-100 rounded border border-rose-200 cursor-pointer transition-all"
                            title="De-list brand"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="stories-tab-view">
              <div className="lg:col-span-4 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-wine shrink-0" />
                  <h3 className="text-xs font-serif font-black tracking-tight text-black">Log Alumni Success Milestone</h3>
                </div>
                <form onSubmit={handleSaveAlumniStory} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Graduated Alumnus Name</label>
                    <input
                      type="text"
                      required
                      value={storyForm.name}
                      onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })}
                      placeholder="e.g. Ruheen Singh"
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2 text-xs text-black focus:border-wine outline-none w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Job Designation / Role</label>
                      <input
                        type="text"
                        required
                        value={storyForm.role}
                        onChange={(e) => setStoryForm({ ...storyForm, role: e.target.value })}
                        placeholder="e.g. Chief of Staff"
                        className="bg-neutral-50/50 border border-border rounded-xl px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Hired Company Name</label>
                      <input
                        type="text"
                        required
                        value={storyForm.company}
                        onChange={(e) => setStoryForm({ ...storyForm, company: e.target.value })}
                        placeholder="e.g. Epigamia / Lodha"
                        className="bg-neutral-50/50 border border-border rounded-xl px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Graduation Batch Year</label>
                      <input
                        type="text"
                        value={storyForm.batch}
                        onChange={(e) => setStoryForm({ ...storyForm, batch: e.target.value })}
                        placeholder="2025"
                        className="bg-neutral-50/50 border border-border rounded-xl px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Secured Package (CTC)</label>
                      <input
                        type="text"
                        value={storyForm.package}
                        onChange={(e) => setStoryForm({ ...storyForm, package: e.target.value })}
                        placeholder="14.5 LPA"
                        className="bg-neutral-50/50 border border-border rounded-xl px-3 py-1.5 text-xs text-black focus:border-wine outline-none w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#a3a3a3] mb-1.5 block">Alumni Testimonial Statement</label>
                    <textarea
                      required
                      value={storyForm.review}
                      onChange={(e) => setStoryForm({ ...storyForm, review: e.target.value })}
                      placeholder="The case study method facilitated directly by founder workshops gave me unmatched confidence..."
                      className="bg-neutral-50/50 border border-border rounded-xl px-4 py-2.5 text-xs text-black focus:border-wine outline-none w-full min-h-[110px]"
                    />
                  </div>
                  <button type="submit" className="w-full px-4 py-2.5 bg-wine hover:bg-black text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                    Commit Milestone Story Node
                  </button>
                </form>
              </div>

              <div className="lg:col-span-8 p-6 bg-white border border-border rounded-2xl">
                <div className="pb-3 border-b border-border/80 mb-5">
                  <h3 className="text-xs font-serif font-black tracking-tight text-black">Registered Success Stories testaments</h3>
                </div>
                {alumniStoriesLoading ? (
                  <div className="p-10 flex justify-center"><RefreshCw className="animate-spin text-wine" /></div>
                ) : alumniStories.length === 0 ? (
                  <p className="text-neutral-500 font-serif p-6 text-center text-sm">No success milestones logged.</p>
                ) : (
                  <div className="space-y-4">
                    {alumniStories.map((alum) => (
                      <div key={alum.id} className="p-4 bg-neutral-50/30 border border-neutral-200/50 rounded-xl hover:border-black/5 flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-serif font-black text-black">{alum.name}</h4>
                            <span className="text-[7.5px] font-mono bg-neutral-100 text-neutral-500 border rounded px-1.5 py-0.5 font-bold">Class of {alum.batch}</span>
                            <span className="text-[7.5px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-400/20 rounded px-1.5 py-0.5 font-black">{alum.package}</span>
                          </div>
                          <p className="text-[9px] text-[#737373] tracking-wide mt-1 uppercase font-bold font-mono">Position: {alum.role} at {alum.company}</p>
                          <p className="text-[10px] text-zinc-500 italic mt-3 bg-white border p-3 rounded-xl">
                            "{alum.review}"
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAlumniStory(alum.id, alum.name)}
                          className="p-1 px-2.5 bg-rose-50 text-red-500 hover:text-red-700 hover:bg-rose-100 border border-rose-200 rounded-lg shrink-0 transition-colors"
                          title="Purge review"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Details sidebar dialog modal overlay for Candidate profiles */}
      <AnimatePresence>
        {selectedApplicant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden relative"
            >
              <div className="bg-neutral-50 p-6 border-b border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-black tracking-widest uppercase text-wine bg-wine/10 border border-wine/20 px-2 py-0.5 rounded-full">Candidate Profile dossier</span>
                  <h3 className="text-lg font-serif font-black tracking-tight text-black mt-1.5">{selectedApplicant.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="p-2 text-zinc-400 hover:text-black/80 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#a3a3a3] block">Academic Program Subscription</span>
                    <span className="text-[11px] font-bold text-zinc-800 uppercase mt-1 block">{selectedApplicant.program}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#a3a3a3] block">Status State</span>
                    <span className="inline-block mt-1 text-[9px] font-extrabold uppercase bg-neutral-100 border px-2.5 py-0.5 rounded-full">{selectedApplicant.status}</span>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#a3a3a3] block">Undergraduate Background</span>
                  <p className="text-xs font-semibold text-zinc-700 mt-1">{selectedApplicant.background}</p>
                </div>

                <div>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#a3a3a3] block">Recorded Professional Experience</span>
                  <p className="text-xs font-medium text-zinc-600 leading-relaxed bg-zinc-50 border p-3 rounded-xl mt-1.5 italic">
                    "{selectedApplicant.experience}"
                  </p>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-zinc-400">
                  <Calendar size={13} />
                  <span>Lead Logged: {selectedApplicant.appliedDate}</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-50/70 border-t border-border flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleDeleteApplicant(selectedApplicant.id);
                  }}
                  className="px-3 py-2 border border-rose-200 hover:border-red-500 hover:bg-rose-50 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                >
                  Purge Candidate
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Interview Scheduled')}
                    className="px-3.5 py-2.5 bg-neutral-100 hover:bg-[#ffffff] border border-border text-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Offered')}
                    className="px-3.5 py-2.5 bg-wine text-[#ffffff] hover:bg-black rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Send Offer Letter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}