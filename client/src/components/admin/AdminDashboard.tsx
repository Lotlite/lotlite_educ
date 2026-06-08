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
  LogOut
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
import { useApp } from '../../AppContext';
import { Applicant, Venture } from '../../types';

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
    createVenture,
    updateVenture,
    triggerToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applicants' | 'sponsors' | 'simulation'>('applicants');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Interview Scheduled' | 'Offered' | 'Rejected'>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  
  // Local simulated log messages for the audit ticker feed
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "System Initialized: Synced admissions with Lotlite Board",
    "Pre-seeded professional academic leads using global Redux store",
    "Loaded dynamic student venture prototypes under incubation labs"
  ]);

  // Load applicants and ventures from the store once on mount
  useEffect(() => {
    fetchApplicants();
    fetchVentures();
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

      // If active modal is active, refresh the modal view
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
      
      // Update store model through context
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

  // Aggregated analytical variables
  const countByStatus = (status: Applicant['status']) => 
    applicants.filter(app => app.status === status).length;

  const totalTraction = ventures.reduce((acc, ven) => acc + ven.traction, 0);

  // Recharts Chart configurations
  const barChartData = [
    { name: 'Pending', count: countByStatus('Pending'), color: '#a3a3a3' },
    { name: 'Interviews', count: countByStatus('Interview Scheduled'), color: '#3b82f6' },
    { name: 'Offered', count: countByStatus('Offered'), color: '#10b981' },
    { name: 'Rejected', count: countByStatus('Rejected'), color: '#ef4444' }
  ];

  const areaChartData = [
    { day: '05-10', applications: 24, traction: 120000 },
    { day: '05-15', applications: 45, traction: 340000 },
    { day: '05-20', applications: 78, traction: 560000 },
    { day: '05-25', applications: 92, traction: 890000 },
    { day: '05-30', applications: 124, traction: 1140000 },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/80 mb-10" id="dashboard-header">
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
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Venture Pool</span>
              <div className="p-1 rounded-md bg-wine-light text-wine font-black"><TrendingUp size={14} /></div>
            </div>
            <p className="text-3xl font-serif font-bold text-black mt-3">{ventures.length}</p>
          </div>
          <p className="text-[9px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Studios Incubated</p>
        </div>
      </div>

      {/* Main Two-Column Panel (Charts + Data lists) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Grid Area: Recharts Visualization charts */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 bg-[#ffffff] border border-border rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-black mb-4 flex items-center justify-between w-full">
              <span>Applications & Dynamic Growth Ticker</span>
              <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-widest">real-time calculations</span>
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

          {/* Table filter and list widgets */}
          <div className="bg-[#ffffff] border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Lead Database Filter</span>
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
                <div className="flex items-center gap-1.5 border border-border rounded-xl p-1 bg-neutral-50">
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
                        <td className="py-4 px-5 text-right whitespace-nowrap">
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
                              className="p-1.5 rounded-lg border border-border bg-neutral-50 text-red-400 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer animate-pulse"
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
        </div>

        {/* Right Side Column (Audit Feeds & Incubated Labs ventures) */}
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

          {/* Student incubated ventures with secure certification action toggles */}
          <div className="p-6 bg-[#ffffff] border border-border rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
              <span className="text-xs font-serif font-black tracking-tight text-black">Incubated Startups</span>
              <span className="text-[8px] font-mono font-bold tracking-widest text-[#10b981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">VALUATION STREAM</span>
            </div>

            <div className="space-y-5">
              {ventures.map((ven) => (
                <div key={ven.id} className="p-4 bg-neutral-50/50 border border-neutral-200/60 hover:border-black/10 rounded-xl transition-all relative">
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

                  <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-neutral-200/60">
                    <div>
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-400 block">Traction Metrics</span>
                      <span className="text-xs font-mono font-black text-black">₹ {ven.traction.toLocaleString()}</span>
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddLiveTransaction(ven.id, 1000)}
                        title="Simulate secure transactional activity"
                        className="p-1 px-2.5 bg-[#ffffff] hover:bg-neutral-100 border border-neutral-200 text-zinc-600 hover:text-black font-semibold uppercase tracking-wider text-[8px] rounded-lg cursor-pointer transition-colors"
                      >
                        + ₹1K
                      </button>

                      {ven.status !== 'Audited & Certified' && (
                        <button
                          onClick={() => handleToggleVentureAudit(ven.id)}
                          title="Authorize land audit status"
                          className="px-2 py-1 bg-wine text-[#ffffff] hover:bg-black font-bold uppercase tracking-wider text-[8px] rounded-lg cursor-pointer transition-colors"
                        >
                          Verify Audit
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
