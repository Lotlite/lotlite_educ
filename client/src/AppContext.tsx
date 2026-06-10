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
  isAdvisorPopupOpen: boolean;
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
  setAdvisorPopupOpen: (open: boolean) => void;
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
  selectedBlog: BlogPost | null;
  fetchBlogs: () => Promise<void>;
  setSelectedBlog: (blog: BlogPost | null) => void;
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
  // Initialize state based on current URL path
  const getInitialSection = () => {
    const path = window.location.pathname;
    if (path === '/blog') return 'blogs';
    if (path.startsWith('/blog/')) return 'blog_article';
    return 'programs';
  };

  const getInitialSubTab = () => {
    const path = window.location.pathname;
    if (path.startsWith('/blog')) return 'insights';
    return 'brem';
  };

  const [activeSection, setActiveSectionState] = useState<string>(getInitialSection());
  const [activeSubTab, setActiveSubTab] = useState<string>(getInitialSubTab());
  const [isMenuOpen, setMenuOpenState] = useState<boolean>(false);
  const [isInternshipOpen, setInternshipOpenState] = useState<boolean>(false);
  const [isAdvisorPopupOpen, setAdvisorPopupOpenState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<Toast | null>(null);
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    interviewCount: 0,
    offeredCount: 0,
    averageTraction: 0,
  });

  const setMenuOpen = (open: boolean) => setMenuOpenState(open);
  const setInternshipPanelOpen = (open: boolean) => setInternshipOpenState(open);
  const setAdvisorPopupOpen = (open: boolean) => setAdvisorPopupOpenState(open);

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
  const [selectedBlog, setSelectedBlogState] = useState<BlogPost | null>(null);

  // Custom setter for activeSection to update URL
  const setActiveSection = (section: string) => {
    setActiveSectionState(section);
    if (section === 'programs') {
      window.history.pushState({}, '', '/');
    } else if (section === 'blogs') {
      window.history.pushState({}, '', '/blog');
      setSelectedBlogState(null);
      setActiveSubTab('insights');
    }
  };

  // Custom setter for selectedBlog to update URL
  const setSelectedBlog = (blog: BlogPost | null) => {
    setSelectedBlogState(blog);
    if (blog) {
      window.history.pushState({}, '', `/blog/${blog.id}`);
    } else if (activeSection === 'blog_article') {
      window.history.pushState({}, '', '/blog');
    }
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        // Map backend Blog schema to frontend BlogPost interface
        const mappedBlogs = data.map((b: any) => ({
          id: b._id,
          title: b.seoTitle || b.topic,
          excerpt: b.article ? b.article.replace(/<[^>]+>/g, '').substring(0, 130) + '...' : '',
          content: b.markdown || b.article || '',
          category: b.industry || 'PropTech',
          date: new Date(b.createdAt).toLocaleDateString(),
          author: 'AI Generator'
        }));
        setBlogs(mappedBlogs);
        
        // If we loaded initially on a specific blog URL, set it as selected
        const path = window.location.pathname;
        if (path.startsWith('/blog/') && path.length > 6) {
          const blogId = path.split('/')[2];
          const found = mappedBlogs.find((b: BlogPost) => b.id === blogId);
          if (found) {
            setSelectedBlogState(found);
            setActiveSectionState('blog_article');
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch blogs:', e);
    } finally {
      setBlogsLoading(false);
    }
  };

  const addNewBlogPost = async (blog: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> => {
    // For manual additions, save it matching the backend Blog schema structure
    const payload = {
      topic: blog.title,
      article: blog.content,
      markdown: blog.content,
      industry: blog.category,
      audience: 'General',
      isPublished: true
    };
    
    const res = await fetch('/api/blog/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('Failed to create new blog post');
    }
    const savedData = await res.json();
    const newBlog = {
      id: savedData.blog._id,
      title: savedData.blog.topic,
      excerpt: savedData.blog.article ? savedData.blog.article.substring(0, 130) + '...' : '',
      content: savedData.blog.article,
      category: savedData.blog.industry,
      date: new Date(savedData.blog.createdAt).toLocaleDateString(),
      author: blog.author || 'Author'
    };
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
    fetchBlogs(); // Ensure blogs are loaded so direct links to /blog/:id work
    
    // Handle back/forward browser navigation
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/blog') {
        setActiveSectionState('blogs');
        setActiveSubTab('insights');
        setSelectedBlogState(null);
      } else if (path.startsWith('/blog/')) {
        setActiveSectionState('blog_article');
        setActiveSubTab('insights');
        // The blog itself will be selected when fetchBlogs completes if it's a direct load,
        // or we need to find it from existing blogs if navigating back
        const blogId = path.split('/')[2];
        setBlogs(currentBlogs => {
          const found = currentBlogs.find(b => b.id === blogId);
          if (found) setSelectedBlogState(found);
          return currentBlogs;
        });
      } else {
        setActiveSectionState('programs');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <AppContext.Provider value={{
      activeSection,
      activeSubTab,
      isMenuOpen,
      isInternshipOpen,
      isAdvisorPopupOpen,
      toastMessage,
      statistics,
      setActiveSection,
      setActiveSubTab,
      setMenuOpen,
      setInternshipPanelOpen,
      setAdvisorPopupOpen,
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
      selectedBlog,
      fetchBlogs,
      setSelectedBlog,
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
