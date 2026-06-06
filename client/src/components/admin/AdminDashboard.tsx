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
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  background: string;
  status: 'Pending' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  experience: string;
  appliedDate: string;
}

interface Venture {
  id: string;
  name: string;
  founders: string;
  status: 'Audited & Certified' | 'Pending Audit';
  webApp: string;
  traction: number; // in Rupees
  description: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-1',
    name: "Aarav Mehta",
    email: "aarav.mehta@outlook.com",
    phone: "+91 98332 11094",
    program: "B.REM in Real Estate Management",
    background: "B.Tech Civil, IIT Bombay",
    status: "Interview Scheduled",
    experience: "Ex-Intern at DLF Luxury projects, 6 months writing site logs",
    appliedDate: "2026-05-18"
  },
  {
    id: 'app-2',
    name: "Ananya Sen",
    email: "ananya.sen@gmail.com",
    phone: "+91 94481 00234",
    program: "Advanced PG Program",
    background: "B.E. Computer Science, RVCE",
    status: "Pending",
    experience: "Full-Stack developer at NoBroker, built listing crawlers",
    appliedDate: "2026-05-24"
  },
  {
    id: 'app-3',
    name: "Kabir Malhotra",
    email: "kabir.m@stxaviers.res",
    phone: "+91 88795 24021",
    program: "B.REM in Real Estate Finance",
    background: "B.Com, St. Xavier's Mumbai",
    status: "Offered",
    experience: "3 years in corporate mortgage advisory at HDFC",
    appliedDate: "2026-05-12"
  },
  {
    id: 'app-4',
    name: "Pooja Hegde",
    email: "pooja.h@yahoo.com",
    phone: "+91 74011 88992",
    program: "Digital Certification",
    background: "B.Arch, SPA Delhi",
    status: "Pending",
    experience: "Consultant Architect at Gensler, drafted layouts for commercial zones",
    appliedDate: "2026-05-26"
  },
  {
    id: 'app-5',
    name: "Deepak Chawla",
    email: "d.chawla@iima.alumni",
    phone: "+91 99912 34567",
    program: "Advanced PG Program",
    background: "B.Com, SRCC + IIM Ahmedabad Intern",
    status: "Offered",
    experience: "Strategy intern at Square Yards corporate advisory",
    appliedDate: "2026-05-10"
  }
];

const INITIAL_VENTURES: Venture[] = [
  {
    id: 'ven-1',
    name: "LandTrack AI",
    founders: "Aarav Mehta, Pooja Hegde",
    status: "Audited & Certified",
    webApp: "https://landtrack.lotlite.dev",
    traction: 14500,
    description: "Automated plot verification & legal land boundaries analysis using state-level satellite AI models."
  },
  {
    id: 'ven-2',
    name: "ShareRE REITs",
    founders: "Kabir Malhotra",
    status: "Pending Audit",
    webApp: "https://sharere.lotlite.dev",
    traction: 9800,
    description: "Micro-fractional investment platform for co-working spaces in high-demand Bengaluru corridors."
  },
  {
    id: 'ven-3',
    name: "ZonalRentals",
    founders: "Ananya Sen",
    status: "Audited & Certified",
    webApp: "https://zonalrentals.lotlite.dev",
    traction: 12200,
    description: "Smart contract rental agreements with zero broker intervention and direct security escrow."
  }
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'applicants' | 'sponsors' | 'simulation'>('applicants');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Interview Scheduled' | 'Offered' | 'Rejected'>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  
  // Simulated logs
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "System Initialized: Synced admissions with Lotlite Board",
    "Pre-seeded 5 professional academic leads",
    "Loaded 3 student venture prototypes under incubation labs"
  ]);

  // Notifications
  const [notification, setNotification] = useState<{ id: string; message: string; type: 'success' | 'info' } | null>(null);

  // Load from local storage or set defaults
  useEffect(() => {
    const storedApps = localStorage.getItem('lotlite_applicants');
    const storedVens = localStorage.getItem('lotlite_ventures');

    if (storedApps) {
      setApplicants(JSON.parse(storedApps));
    } else {
      setApplicants(INITIAL_APPLICANTS);
      localStorage.setItem('lotlite_applicants', JSON.stringify(INITIAL_APPLICANTS));
    }

    if (storedVens) {
      setVentures(JSON.parse(storedVens));
    } else {
      setVentures(INITIAL_VENTURES);
      localStorage.setItem('lotlite_ventures', JSON.stringify(INITIAL_VENTURES));
    }
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ id: String(Date.now()), message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync back helper
  const syncApplicants = (newApps: Applicant[]) => {
    setApplicants(newApps);
    localStorage.setItem('lotlite_applicants', JSON.stringify(newApps));
  };

  const syncVentures = (newVens: Venture[]) => {
    setVentures(newVens);
    localStorage.setItem('lotlite_ventures', JSON.stringify(newVens));
  };

  // Actions
  const handleUpdateStatus = (id: string, newStatus: Applicant['status']) => {
    const updated = applicants.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    syncApplicants(updated);
    
    // Updates secondary modal selection context
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }

    // Append audit logs
    const candidateName = applicants.find(a => a.id === id)?.name || "Candidate";
    addAuditLog(`Updated candidate ${candidateName} status to ${newStatus}`);
    triggerToast(`Status changed to "${newStatus}" for ${candidateName}`);
  };

  const handleDeleteApplicant = (id: string) => {
    const candidateName = applicants.find(a => a.id === id)?.name || "Candidate";
    const filtered = applicants.filter(app => app.id !== id);
    syncApplicants(filtered);
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant(null);
    }
    addAuditLog(`Purged lead info for ${candidateName}`);
    triggerToast(`Removed applicant record: ${candidateName}`, 'info');
  };

  const handleToggleVentureAudit = (id: string) => {
    const updated = ventures.map(ven => {
      if (ven.id === id) {
        const nextStatus: Venture['status'] = ven.status === 'Audited & Certified' ? 'Pending Audit' : 'Audited & Certified';
        addAuditLog(`Transitioned ${ven.name} audit status to: ${nextStatus}`);
        triggerToast(`${ven.name} security audit: ${nextStatus}`);
        return { ...ven, status: nextStatus };
      }
      return ven;
    });
    syncVentures(updated);
  };

  const handleAddLiveTransaction = (vId: string, amount: number) => {
    const updated = ventures.map(ven => {
      if (ven.id === vId) {
        const nextTraction = ven.traction + amount;
        addAuditLog(`Detected micro-transaction on ${ven.name}: +₹${amount}. Aggregate valuation: ₹${nextTraction}`);
        return { ...ven, traction: nextTraction };
      }
      return ven;
    });
    syncVentures(updated);
    const venName = ventures.find(v => v.id === vId)?.name || "Student Venture";
    triggerToast(`Simulation: ₹${amount} transaction recorded on ${venName}!`);
  };

  const addAuditLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 39)]);
  };

  // Simulating events
  const handleSimulateRegistration = () => {
    const randomFirst = ["Pranav", "Riya", "Gaurav", "Siddharth", "Aisha", "Dhruv", "Neha"];
    const randomLast = ["Rao", "Kapoor", "Joshi", "Bose", "Nair", "Varma", "Patel"];
    const randomProgram = [
      "B.REM in Real Estate Management",
      "B.REM in Real Estate Finance",
      "Advanced PG Program",
      "Digital Certification"
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
    const experience = randomExp[Math.floor(Math.random() * randomExp.length)];
    const phone = `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newApp: Applicant = {
      id: `app-${Date.now()}`,
      name: fullName,
      email,
      phone,
      program,
      background,
      status: 'Pending',
      experience,
      appliedDate: new Date().toISOString().split('T')[0]
    };

    const nextApps = [newApp, ...applicants];
    syncApplicants(nextApps);
    addAuditLog(`Inbound Web Application received: ${fullName} (${program})`);
    triggerToast(`Simulation: Inbound Web Application from ${fullName}!`, 'success');
  };

  const handleSimulateVentureSaaS = () => {
    if (ventures.length === 0) return;
    const items = [200, 500, 1000, 2000, 3500];
    const amt = items[Math.floor(Math.random() * items.length)];
    const randVen = ventures[Math.floor(Math.random() * ventures.length)];
    handleAddLiveTransaction(randVen.id, amt);
  };

  const handleResetRegistries = () => {
    if (window.confirm("Restore demo database to pristine pre-set state?")) {
      setApplicants(INITIAL_APPLICANTS);
      localStorage.setItem('lotlite_applicants', JSON.stringify(INITIAL_APPLICANTS));
      setVentures(INITIAL_VENTURES);
      localStorage.setItem('lotlite_ventures', JSON.stringify(INITIAL_VENTURES));
      setAuditLogs([
        "Registries successfully reset to factory seeds.",
        "Pre-seeded 5 professional academic leads loaded.",
        "Incubator state normalized."
      ]);
      setSelectedApplicant(null);
      triggerToast("System cleared & seed databases deployed", "info");
    }
  };

  // Filter lists
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                          app.background.toLowerCase().includes(search.toLowerCase()) ||
                          app.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Recharts metric counts
  const totalApps = applicants.length;
  const pendingCount = applicants.filter(a => a.status === 'Pending').length;
  const offeredCount = applicants.filter(a => a.status === 'Offered').length;
  const scheduledCount = applicants.filter(a => a.status === 'Interview Scheduled').length;
  const acceptanceRate = totalApps > 0 ? Math.round((offeredCount / totalApps) * 100) : 0;
  const aggregateTraction = ventures.reduce((acc, v) => acc + v.traction, 0);

  // Compute Academic backgrounds pie stats
  const academicGroups = applicants.reduce((acc, item) => {
    const bg = item.background.toLowerCase();
    if (bg.includes('iit') || bg.includes('b.tech') || bg.includes('b.e.') || bg.includes('civil') || bg.includes('eng')) {
      acc.Tech += 1;
    } else if (bg.includes('com') || bg.includes('eco') || bg.includes('iim') || bg.includes('srcc') || bg.includes('finance')) {
      acc.Finance += 1;
    } else if (bg.includes('arch') || bg.includes('planning')) {
      acc.Design += 1;
    } else {
      acc.Others += 1;
    }
    return acc;
  }, { Tech: 0, Finance: 0, Design: 0, Others: 0 });

  const chartPieData = [
    { name: 'Tech & Civil Engg', value: academicGroups.Tech, color: '#800020' }, // Wine
    { name: 'Commerce & Finance', value: academicGroups.Finance, color: '#DE2943' }, // Rose/Red
    { name: 'Architecture & Design', value: academicGroups.Design, color: '#F59E0B' }, // Amber
    { name: 'Others', value: academicGroups.Others, color: '#6B7280' }, // Slate
  ].filter(group => group.value > 0);

  // Recharts: Chart for Weekly Applications over time
  // Group apps by date or generate static dates relative to this month
  const chartTimelineData = [
    { name: 'Week 1', B_REM: 2, PG_AI: 1 },
    { name: 'Week 2', B_REM: 3, PG_AI: 2 },
    { name: 'Week 3', B_REM: 5, PG_AI: 4 },
    { name: 'Week 4', B_REM: 6, PG_AI: 5 },
    { name: 'Week 5', B_REM: applicants.filter(a => a.program.includes('B.REM')).length, PG_AI: applicants.filter(a => !a.program.includes('B.REM')).length }
  ];

  // Recharts: Startup traction data
  const chartVentureData = ventures.map(v => ({
    name: v.name,
    Traction: v.traction
  }));

  return (
    <div className="bg-white text-black min-h-screen pt-16 sm:pt-24 lg:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 space-y-8 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Toast notifications overlay */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -40, x: '-50%' }}
            className={`fixed top-6 left-1/2 z-[200] transform -translate-x-1/2 px-6 py-4 rounded-full border shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              notification.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
              : 'bg-wine-light border-wine-light-border text-wine'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-wine'}`} />
            <span className="text-xs font-black uppercase tracking-wider">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-wine-light text-wine text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-wine-light-border">
                SYSTEM EXECUTIVE STATUS: LIVE
              </span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-black leading-tight">Board <span className="text-wine">Admissions Console</span></h1>
            <p className="text-xs text-muted font-medium font-mono">Lotlite Group Incubation, Admissions & Student Startup Audit System</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSimulateRegistration}
              className="px-4 py-2.5 bg-wine text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-lg shadow-wine/10"
            >
              <Plus size={14} />
              <span>Simulate Lead</span>
            </button>
            <button
              onClick={handleSimulateVentureSaaS}
              className="px-4 py-2.5 bg-bottle-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-lg shadow-bottle-green/10"
            >
              <Zap size={14} />
              <span>Simulate Pay</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-card hover:bg-offwhite border border-border rounded-xl text-[10px] font-black uppercase text-black/60 tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
            >
              <X size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Admissions Pipeline", 
              value: totalApps, 
              desc: `${pendingCount} Pending Triage, ${scheduledCount} Scheduled`, 
              icon: <Users className="text-wine" size={20} />, 
              bg: 'bg-wine/5 dark:bg-wine/10', 
              border: 'border-wine/10' 
            },
            { 
              title: "Offer Acceptances", 
              value: `${offeredCount} Offered`, 
              desc: `Acc. Rate: ${acceptanceRate}% (Cap: 40 Students)`, 
              icon: <UserCheck className="text-green-600" size={20} />, 
              bg: 'bg-green-600/5 dark:bg-green-600/10', 
              border: 'border-green-600/10' 
            },
            { 
              title: "Audited Startup Valuation", 
              value: `₹${(aggregateTraction / 1000).toFixed(1)}k`, 
              desc: `${ventures.filter(v => v.status === 'Audited & Certified').length} / ${ventures.length} Certified Spin-offs`, 
              icon: <Building2 className="text-yellow-600" size={20} />, 
              bg: 'bg-yellow-500/5 dark:bg-yellow-500/10', 
              border: 'border-yellow-500/10' 
            },
            { 
              title: "Avg Placement Anchor", 
              value: "₹18.4 LPA", 
              desc: "Highest CTC Recorded: ₹38.0 LPA", 
              icon: <Award className="text-blue-600" size={20} />, 
              bg: 'bg-blue-600/5 dark:bg-blue-600/10', 
              border: 'border-blue-600/10' 
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-xs relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bg} border ${card.border}`}>
                  {card.icon}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-black tracking-tight">{card.value}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted font-semibold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span>{card.desc}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Section - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-xs"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-black leading-tight">Registration Trends</h3>
                <p className="text-[10px] text-muted font-medium font-mono uppercase mt-0.5">Application intakes mapped weekly</p>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#800020]" />
                  <span className="text-black/50 dark:text-gray-400">B.REM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DE2943]" />
                  <span className="text-black/50 dark:text-gray-400">PG AI & PropTech</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBrem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#800020" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#800020" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DE2943" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#DE2943" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-neutral-800" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderColor: 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#000'
                    }} 
                  />
                  <Area type="monotone" dataKey="B_REM" stroke="#800020" strokeWidth={2} fillOpacity={1} fill="url(#colorBrem)" />
                  <Area type="monotone" dataKey="PG_AI" stroke="#DE2943" strokeWidth={2} fillOpacity={1} fill="url(#colorPg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Academic Profile Distribution Pie */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col"
          >
            <div>
              <h3 className="text-lg font-bold text-black leading-tight">Academic Pipeline Diversity</h3>
              <p className="text-[10px] text-muted font-medium font-mono uppercase mt-0.5">Background discipline share proportion</p>
            </div>

            <div className="flex-1 relative flex items-center justify-center min-h-[180px]">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      fontSize: '11px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#000'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {chartPieData.map((group, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
                    <span className="text-black/70">{group.name}</span>
                  </div>
                  <span className="font-mono font-bold text-black">
                    {group.value} ({Math.round(group.value / totalApps * 100) || 0}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-black/5 dark:border-white/5 gap-4 sm:gap-6 scrollbar-none overflow-x-auto pb-0.5">
          {[
            { id: 'applicants', label: 'Admissions & Leads Desk', badge: applicants.length },
            { id: 'sponsors', label: 'Student Seed Incubator', badge: ventures.length },
            { id: 'simulation', label: 'Sandbox simulation cockpit & Logs', badge: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-[10px] sm:text-xs font-black uppercase tracking-widest relative cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.id 
                ? 'text-wine dark:text-[#DE2943]' 
                : 'text-black/50 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.badge !== null && (
                  <span className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full px-2 py-0.5 text-[9px] font-mono">
                    {tab.badge}
                  </span>
                )}
              </span>
              {activeTab === tab.id && (
                <motion.div layoutId="dashboardActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-wine dark:bg-[#DE2943]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'applicants' && (
            <motion.div
              key="applicants-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filter and Search actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by candidate name or background..."
                    className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-3 text-xs focus:outline-none focus:border-wine font-medium text-black placeholder:text-muted/40"
                  />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <Filter size={14} className="text-muted shrink-0" />
                  <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-wine mr-2">Filter State: </span>
                  {(['All', 'Pending', 'Interview Scheduled', 'Offered', 'Rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                        statusFilter === f 
                        ? 'bg-wine border-wine text-white' 
                        : 'bg-card border-border hover:border-black/10 text-black/60'
                      }`}
                    >
                      {f === 'Interview Scheduled' ? 'Scheduled' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid split: Table at left / Selection details card right */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-4">
                  {filteredApplicants.length === 0 ? (
                    <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center text-muted">
                      <Users className="mx-auto text-muted/30 mb-4" size={40} />
                      <p className="font-serif font-bold text-lg text-black">No applicants match criteria</p>
                      <p className="text-xs font-medium max-w-sm mx-auto mt-1 leading-relaxed">Relax filter restrictions or use the Simulator to simulate inbound registrations instantly.</p>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-offwhite border-b border-border">
                              <th className="p-4 font-black uppercase text-muted">Applicant</th>
                              <th className="p-4 font-black uppercase text-muted hidden sm:table-cell">Program Preference</th>
                              <th className="p-4 font-black uppercase text-muted">Academics Background</th>
                              <th className="p-4 font-black uppercase text-muted text-center">Status</th>
                              <th className="p-4 font-black uppercase text-muted text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredApplicants.map(app => (
                              <tr 
                                key={app.id} 
                                onClick={() => setSelectedApplicant(app)}
                                className={`border-b border-border hover:bg-offwhite/50 transition-all cursor-pointer ${
                                  selectedApplicant?.id === app.id ? 'bg-wine-light' : ''
                                }`}
                              >
                                <td className="p-4">
                                  <div className="font-bold text-black text-sm leading-tight">{app.name}</div>
                                  <div className="text-[10px] font-semibold text-muted font-mono mt-1">{app.email}</div>
                                </td>
                                <td className="p-4 font-medium max-w-[160px] truncate hidden sm:table-cell text-black/70">
                                  {app.program}
                                </td>
                                <td className="p-4">
                                  <span className="px-2 py-0.5 bg-offwhite border border-border rounded-md font-mono text-[10px] text-black/85">
                                    {app.background}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    app.status === 'Offered' 
                                    ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-500/10' 
                                    : app.status === 'Interview Scheduled'
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-500/10'
                                    : app.status === 'Rejected'
                                    ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-500/10'
                                    : 'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 border border-yellow-500/10'
                                  }`}>
                                    {app.status === 'Interview Scheduled' ? 'Scheduled' : app.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-end gap-1">
                                    <button
                                      title="Offered Admission"
                                      onClick={() => handleUpdateStatus(app.id, 'Offered')}
                                      className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/50 rounded transition-colors"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                    <button
                                      title="Schedule Interview"
                                      onClick={() => handleUpdateStatus(app.id, 'Interview Scheduled')}
                                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded transition-colors"
                                    >
                                      <Clock size={16} />
                                    </button>
                                    <button
                                      title="Decline Application"
                                      onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded transition-colors"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                    <button
                                      title="Purge Record"
                                      onClick={() => handleDeleteApplicant(app.id)}
                                      className="p-1 text-black/45 hover:text-red-600 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate detail drawer layout */}
                <div className="xl:col-span-1">
                  {selectedApplicant ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-6 relative"
                    >
                      <button
                        onClick={() => setSelectedApplicant(null)}
                        className="absolute top-4 right-4 text-muted hover:text-black"
                      >
                        <X size={18} />
                      </button>

                      <div className="space-y-2">
                        <span className="bg-wine-light text-wine text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded border border-wine-light-border">
                          Applicant Dossier
                        </span>
                        <h3 className="text-xl font-serif text-black font-bold pt-2">{selectedApplicant.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 font-mono">
                          <Clock size={12} />
                          <span>Received Date: {selectedApplicant.appliedDate}</span>
                        </p>
                      </div>

                      <div className="border-t border-b border-border py-4 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-muted">Pref Program</label>
                          <p className="text-xs font-semibold text-black/80">{selectedApplicant.program}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-muted">Academics Background</label>
                          <p className="text-xs font-mono font-medium text-black bg-offwhite px-3 py-1 rounded-lg border border-border select-all">{selectedApplicant.background}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-muted">Past Professional Experience</label>
                          <p className="text-xs leading-relaxed text-black/70 font-medium">{selectedApplicant.experience}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-muted">Contact Email</label>
                            <p className="text-[11px] font-semibold text-wine break-all">{selectedApplicant.email}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-muted">Phone</label>
                            <p className="text-[11px] font-semibold text-black/60 font-mono">{selectedApplicant.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-3">Status Action Registry</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleUpdateStatus(selectedApplicant.id, 'Offered')}
                            className="text-center font-bold font-mono text-[9px] uppercase tracking-wider bg-green-500 text-white rounded-xl py-3 hover:opacity-90 transition-opacity"
                          >
                            Extend Offer
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedApplicant.id, 'Interview Scheduled')}
                            className="text-center font-bold font-mono text-[9px] uppercase tracking-wider bg-blue-500 text-white rounded-xl py-3 hover:opacity-90 transition-opacity"
                          >
                            Schedule Interview
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedApplicant.id, 'Pending')}
                            className="text-center font-bold font-mono text-[9px] uppercase tracking-wider bg-yellow-500 text-white rounded-xl py-3 hover:opacity-90 transition-opacity"
                          >
                            Mark Pending
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedApplicant.id, 'Rejected')}
                            className="text-center font-bold font-mono text-[9px] uppercase tracking-wider bg-red-500 text-white rounded-xl py-3 hover:opacity-90 transition-opacity"
                          >
                            Decline Admission
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-white dark:bg-input border border-dashed border-black/10 dark:border-white/10 rounded-3xl p-12 text-center text-muted dark:text-neutral-400 flex flex-col justify-center items-center h-full min-h-[300px]">
                      <FileCheck2 className="text-black/10 dark:text-white/15 mb-4" size={32} />
                      <p className="font-serif font-bold text-base text-black dark:text-white">Dossier Workspace</p>
                      <p className="text-[11px] font-medium leading-relaxed max-w-xs mx-auto mt-2 text-black/40 dark:text-neutral-400">
                        Select a candidate cell from the list to populate their application metadata, past experiences, and change status logs.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sponsors' && (
            <motion.div
              key="sponsors-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Student Ventures Chart */}
                <div className="lg:col-span-1 bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-black leading-tight">Venture Financial Traction</h3>
                    <p className="text-[10px] text-muted font-medium font-mono uppercase mt-0.5">Transactions processed in incubations</p>
                  </div>
                  
                  <div className="h-56 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartVentureData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '8px', 
                            fontSize: '11px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            color: '#000'
                          }} 
                        />
                        <Bar dataKey="Traction" fill="#800020" radius={[4, 4, 0, 0]}>
                          {chartVentureData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#800020' : '#1B8C68'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="border-t border-border pt-4 mt-2">
                    <div className="flex justify-between items-center text-xs text-muted font-mono font-bold uppercase">
                      <span>Total Venture Traction</span>
                      <span className="text-black font-bold text-sm">₹{aggregateTraction.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* List of Incubator Ventures */}
                <div className="lg:col-span-2 space-y-4">
                  {ventures.map(ven => (
                    <div
                      key={ven.id}
                      className="bg-card border border-border rounded-3xl p-6 shadow-xs hover:border-black/10 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <h4 className="text-lg font-serif text-black font-bold">{ven.name}</h4>
                            <span className="text-muted text-xs font-semibold">•</span>
                            <a href={ven.webApp} target="_blank" rel="noreferrer" className="text-[10px] text-wine hover:underline font-bold uppercase flex items-center gap-1">
                              <span>View Project Demo</span>
                              <ArrowUpRight size={12} />
                            </a>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ml-auto sm:ml-0 ${
                              ven.status === 'Audited & Certified'
                              ? 'bg-green-150/10 text-green-700 border-green-500/20 bg-green-50 dark:bg-green-950/20 dark:text-green-400'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-500/20 dark:bg-yellow-950/20 dark:text-yellow-400'
                            }`}>
                              {ven.status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-black/70 leading-relaxed font-medium">
                            {ven.description}
                          </p>

                          <div className="pt-2 text-[10px] text-muted flex flex-wrap items-center gap-x-4 gap-y-2 font-mono font-bold uppercase">
                            <span className="text-black">Founders: {ven.founders}</span>
                            <span>•</span>
                            <span className="text-bottle-green">Traction Collected: ₹{ven.traction.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Auditing and ledger tools inside card */}
                        <div className="flex sm:flex-col gap-2 shrink-0 justify-end sm:justify-start">
                          <button
                            onClick={() => handleToggleVentureAudit(ven.id)}
                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border font-mono transition-all cursor-pointer ${
                              ven.status === 'Audited & Certified'
                              ? 'bg-offwhite text-black/60 border-border'
                              : 'bg-wine text-white border-wine hover:opacity-90 shadow-lg shadow-wine/10'
                            }`}
                          >
                            {ven.status === 'Audited & Certified' ? 'De-certify' : 'Verify & Audit'}
                          </button>

                          <div className="flex gap-1">
                            <button
                              onClick={() => handleAddLiveTransaction(ven.id, 500)}
                              className="px-2 py-1.5 bg-offwhite hover:bg-neutral-200 text-[8px] font-black tracking-wider uppercase rounded-lg text-black/65 font-mono border border-border cursor-pointer animate-none"
                            >
                              +₹500
                            </button>
                            <button
                              onClick={() => handleAddLiveTransaction(ven.id, 2000)}
                              className="px-2 py-1.5 bg-offwhite hover:bg-neutral-200 text-[8px] font-black tracking-wider uppercase rounded-lg text-black/65 font-mono border border-border cursor-pointer animate-none"
                            >
                              +₹2k
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'simulation' && (
            <motion.div
              key="simulation-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Simulator cockpit triggers */}
              <div className="lg:col-span-1 bg-card border border-border rounded-3xl p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-black leading-tight">Simulation Cockpit</h3>
                  <p className="text-[10px] text-muted font-medium font-mono uppercase mt-0.5">Mock operations & registry sandbox metrics</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-yellow-600 tracking-wider mb-1 flex items-center gap-1.5">
                      <Lock size={12} className="shrink-0" />
                      <span>Sandbox Guidelines</span>
                    </p>
                    <p className="text-[11px] text-black/60 leading-normal font-medium">
                      Simulating entries allows demonstrating live-reporting capabilities without interfering with actual active server databases or security setups.
                    </p>
                  </div>

                  <button
                    onClick={handleSimulateRegistration}
                    className="w-full bg-wine text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-95 shadow-md shadow-wine/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Users size={14} />
                    <span>Inbound Student Register</span>
                  </button>

                  <button
                    onClick={handleSimulateVentureSaaS}
                    className="w-full bg-bottle-green text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-95 shadow-md shadow-bottle-green/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <DollarSign size={14} />
                    <span>Inbound Venture Payment</span>
                  </button>

                  <div className="pt-4 border-t border-border">
                    <button
                      onClick={handleResetRegistries}
                      className="w-full bg-card hover:bg-neutral-50 border border-red-500/20 dark:border-red-500/10 text-red-600 dark:text-red-400 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} className="animate-spin-slow" />
                      <span>Hard Reset Registries</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Console Logs terminal output */}
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col min-h-[360px]">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">admissions-desk.sys.log</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 text-[9px] font-mono font-extrabold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span>Telemetry Active</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400/90 space-y-2 max-h-[300px] scrollbar-thin scrollbar-thumb-neutral-800">
                  {auditLogs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-neutral-800/20 px-2 py-0.5 rounded leading-relaxed select-all"
                    >
                      <span className="text-neutral-500 mr-2 font-bold">&gt;</span> {log}
                    </motion.div>
                  ))}
                  <div className="opacity-40 animate-pulse text-white pl-2">&gt; Listening for system operations...</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
