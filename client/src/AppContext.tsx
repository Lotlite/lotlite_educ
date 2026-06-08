import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Applicant, 
  Venture, 
  BlogPost, 
  FaqItem, 
  ChatMessage, 
  Course 
} from './types';

// Let's create types for toast messages
export interface Toast {
  title: string;
  description: string;
  show: boolean;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & UI state
  activeSection: string;
  activeSubTab: string;
  isMenuOpen: boolean;
  isInternshipOpen: boolean;
  toastMessage: Toast | null;
  statistics: {
    totalApplications: number;
    interviewCount: number;
    offeredCount: number;
    averageTraction: number;
  };
  
  setActiveSection: (sec: string) => void;
  setActiveSubTab: (tab: string) => void;
  setMenuOpen: (open: boolean) => void;
  setInternshipPanelOpen: (open: boolean) => void;
  triggerToast: (toast: { title: string; description: string; type?: 'success' | 'info' | 'warning' | 'error' }) => void;
  clearToast: () => void;
  fetchSystemStats: () => Promise<void>;

  // User Auth State
  currentUser: UserProfile | null;
  isAdminLoggedIn: boolean;
  isAdminLoginOpen: boolean;
  authLoading: boolean;
  authError: string | null;
  
  setAdminLoginOpen: (open: boolean) => void;
  authenticateAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutUser: () => void;
  checkLocalAuth: () => void;
  clearAuthError: () => void;

  // FAQ State
  faqs: FaqItem[];
  faqsLoading: boolean;
  fetchFaqs: (category?: string) => Promise<void>;

  // Blogs State
  blogs: BlogPost[];
  blogsLoading: boolean;
  fetchBlogs: () => Promise<void>;
  addNewBlogPost: (blog: Omit<BlogPost, 'id' | 'date'>) => Promise<BlogPost>;

  // Chatbot State
  chatMessages: ChatMessage[];
  isBotTyping: boolean;
  isChatbotOpen: boolean;
  
  toggleChatbot: () => void;
  setChatbotOpen: (open: boolean) => void;
  clearChatHistory: () => void;
  addMessage: (msg: ChatMessage) => void;
  sendMessageToBot: (text: string) => Promise<void>;

  // Admissions & Ventures State
  applicants: Applicant[];
  ventures: Venture[];
  admissionsLoading: boolean;
  admissionsError: string | null;
  submittingApplication: boolean;
  applicationSuccess: boolean;

  fetchApplicants: () => Promise<void>;
  fetchVentures: () => Promise<void>;
  submitApplicant: (applicant: Omit<Applicant, 'id' | 'appliedDate' | 'status'>) => Promise<Applicant>;
  updateApplicantStatus: (id: string, status: Applicant['status']) => Promise<void>;
  deleteApplicant: (id: string) => Promise<void>;
  auditVenture: (id: string) => Promise<void>;
  createVenture: (venture: Omit<Venture, 'id' | 'status'>) => Promise<Venture>;
  updateVenture: (updatedVenture: Venture) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI States
  const [activeSection, setActiveSection] = useState<string>('programs');
  const [activeSubTab, setActiveSubTab] = useState<string>('brem');
  const [isMenuOpen, setMenuOpenState] = useState<boolean>(false);
  const [isInternshipOpen, setInternshipOpenState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<Toast | null>(null);
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    interviewCount: 0,
    offeredCount: 0,
    averageTraction: 0,
  });

  const setMenuOpen = (open: boolean) => setMenuOpenState(open);
  const setInternshipPanelOpen = (open: boolean) => setInternshipOpenState(open);

  const triggerToast = (toast: { title: string; description: string; type?: 'success' | 'info' | 'warning' | 'error' }) => {
    setToastMessage({
      ...toast,
      show: true
    });
  };

  const clearToast = () => {
    if (toastMessage) {
      setToastMessage({
        ...toastMessage,
        show: false
      });
    }
  };

  const fetchSystemStats = async () => {
    try {
      const statsRes = await fetch('/api/applicants');
      const apps: Applicant[] = await statsRes.json();
      const venturesRes = await fetch('/api/ventures');
      const vens: Venture[] = await venturesRes.json();

      const interviewCount = apps.filter(a => a.status === 'Interview Scheduled').length;
      const offeredCount = apps.filter(a => a.status === 'Offered').length;
      const auditedVens = vens.filter(v => v.status === 'Audited & Certified');
      const averageTraction = auditedVens.length > 0 
        ? Math.round(auditedVens.reduce((sum, v) => sum + v.traction, 0) / auditedVens.length)
        : 0;

      setStatistics({
        totalApplications: apps.length,
        interviewCount,
        offeredCount,
        averageTraction,
      });
    } catch (err) {
      console.error('Failed to calculate stats:', err);
    }
  };

  // User Auth States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const checkLocalAuth = () => {
    const isLogged = localStorage.getItem('lotlite_admin_logged') === 'true';
    const storedUser = localStorage.getItem('lotlite_admin_user');
    
    if (isLogged && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setIsAdminLoggedIn(true);
      } catch {
        setCurrentUser(null);
        setIsAdminLoggedIn(false);
      }
    }
  };

  const authenticateAdmin = async (email: string, pass: string): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Simulate network interaction
      await new Promise(resolve => setTimeout(resolve, 850));
      
      if ((email === 'admin@lotlite.org' && pass === 'Admin994#') || (email === 'admin@lotlite.edu' && pass === 'lotlite2026')) {
        const user: UserProfile = {
          id: 'lotlite-usr-994',
          name: 'LotLite Principal Admin',
          email: email,
          role: 'admin',
          token: 'jwt-mock-header-token-8921-9942',
        };
        localStorage.setItem('lotlite_admin_logged', 'true');
        localStorage.setItem('lotlite_admin_user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAdminLoggedIn(true);
        setAdminLoginOpen(false);
        setAuthLoading(false);
        return true;
      } else {
        setAuthError('Invalid administrator credentials. Please check and try again.');
        setIsAdminLoggedIn(false);
        setAuthLoading(false);
        return false;
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error');
      setIsAdminLoggedIn(false);
      setAuthLoading(false);
      return false;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setAuthError(null);
    localStorage.removeItem('lotlite_admin_logged');
    localStorage.removeItem('lotlite_admin_user');
  };

  // FAQ States
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState<boolean>(false);

  const fetchFaqs = async (category?: string) => {
    setFaqsLoading(true);
    const url = category ? `/api/faqs?category=${category}` : '/api/faqs';
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (e) {
      console.error('Failed to fetch faqs:', e);
    } finally {
      setFaqsLoading(false);
    }
  };

  // Blogs States
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState<boolean>(false);

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (e) {
      console.error('Failed to fetch blogs:', e);
    } finally {
      setBlogsLoading(false);
    }
  };

  const addNewBlogPost = async (blog: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> => {
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    });
    if (!res.ok) {
      throw new Error('Failed to create new blog post');
    }
    const newBlog = await res.json();
    setBlogs(prev => [newBlog, ...prev]);
    return newBlog;
  };

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: "Greetings! I am LotLite's integrated Academic AI Assistant. Ask me anything about our Bachelor of Real Estate Management (B.REM), MCA/BCA in PropTech, or MBA in REIT Strategy & Finance. I can guide your admission process too!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [isChatbotOpen, setChatbotOpenState] = useState<boolean>(false);

  const toggleChatbot = () => setChatbotOpenState(prev => !prev);
  const setChatbotOpen = (open: boolean) => setChatbotOpenState(open);
  
  const clearChatHistory = () => {
    setChatMessages([
      {
        id: 'msg-init',
        sender: 'bot',
        text: "Chat cleared. I am ready for new queries! What would you like to know about our PropTech degrees?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const addMessage = (msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  };

  const sendMessageToBot = async (text: string) => {
    setIsBotTyping(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: data.reply || "System is online. Let me check.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Server returned error status');
      }
    } catch (e: any) {
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'bot',
          text: e.message || 'AI engine is currently rebooting...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Admissions & Ventures States
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [admissionsLoading, setAdmissionsLoading] = useState<boolean>(false);
  const [admissionsError, setAdmissionsError] = useState<string | null>(null);
  const [submittingApplication, setSubmittingApplication] = useState<boolean>(false);
  const [applicationSuccess, setApplicationSuccess] = useState<boolean>(false);

  const fetchApplicants = async () => {
    setAdmissionsLoading(true);
    try {
      const res = await fetch('/api/applicants');
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
      }
    } catch (e: any) {
      setAdmissionsError(e.message || 'Failed to load applicants');
    } finally {
      setAdmissionsLoading(false);
    }
  };

  const fetchVentures = async () => {
    setAdmissionsLoading(true);
    try {
      const res = await fetch('/api/ventures');
      if (res.ok) {
        const data = await res.json();
        setVentures(data);
      }
    } catch (e: any) {
      setAdmissionsError(e.message || 'Failed to load ventures');
    } finally {
      setAdmissionsLoading(false);
    }
  };

  const submitApplicant = async (applicant: Omit<Applicant, 'id' | 'appliedDate' | 'status'>): Promise<Applicant> => {
    setSubmittingApplication(true);
    setApplicationSuccess(false);
    try {
      const res = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicant)
      });
      if (!res.ok) {
        throw new Error('Failed to submit application');
      }
      const data = await res.json();
      setApplicants(prev => [data, ...prev]);
      setApplicationSuccess(true);
      return data;
    } catch (e: any) {
      setAdmissionsError(e.message || 'Submission failed');
      throw e;
    } finally {
      setSubmittingApplication(false);
    }
  };

  const updateApplicantStatus = async (id: string, status: Applicant['status']) => {
    try {
      const res = await fetch(`/api/applicants/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (e: any) {
      console.error('Failed to change status:', e);
    }
  };

  const deleteApplicant = async (id: string) => {
    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setApplicants(prev => prev.filter(a => a.id !== id));
      }
    } catch (e: any) {
      console.error('Failed to delete applicant:', e);
    }
  };

  const auditVenture = async (id: string) => {
    try {
      const res = await fetch(`/api/ventures/${id}/audit`, {
        method: 'PUT'
      });
      if (res.ok) {
        setVentures(prev => prev.map(v => v.id === id ? { ...v, status: 'Audited & Certified' } : v));
      }
    } catch (e: any) {
      console.error('Failed to audit venture:', e);
    }
  };

  const createVenture = async (venture: Omit<Venture, 'id' | 'status'>): Promise<Venture> => {
    const res = await fetch('/api/ventures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venture)
    });
    if (!res.ok) {
      throw new Error('Failed to create venture');
    }
    const data = await res.json();
    setVentures(prev => [...prev, data]);
    return data;
  };

  const updateVenture = (updatedVenture: Venture) => {
    setVentures(prev => prev.map(v => v.id === updatedVenture.id ? updatedVenture : v));
  };

  // Run on startup
  useEffect(() => {
    checkLocalAuth();
  }, []);

  return (
    <AppContext.Provider value={{
      activeSection,
      activeSubTab,
      isMenuOpen,
      isInternshipOpen,
      toastMessage,
      statistics,
      setActiveSection,
      setActiveSubTab,
      setMenuOpen,
      setInternshipPanelOpen,
      triggerToast,
      clearToast,
      fetchSystemStats,

      // Authentication
      currentUser,
      isAdminLoggedIn,
      isAdminLoginOpen,
      authLoading,
      authError,
      setAdminLoginOpen,
      authenticateAdmin,
      logoutUser,
      checkLocalAuth,
      clearAuthError,

      // FAQ
      faqs,
      faqsLoading,
      fetchFaqs,

      // Blogs
      blogs,
      blogsLoading,
      fetchBlogs,
      addNewBlogPost,

      // Chatbot
      chatMessages,
      isBotTyping,
      isChatbotOpen,
      toggleChatbot,
      setChatbotOpen,
      clearChatHistory,
      addMessage,
      sendMessageToBot,

      // Admissions
      applicants,
      ventures,
      admissionsLoading,
      admissionsError,
      submittingApplication,
      applicationSuccess,
      fetchApplicants,
      fetchVentures,
      submitApplicant,
      updateApplicantStatus,
      deleteApplicant,
      auditVenture,
      createVenture,
      updateVenture
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
