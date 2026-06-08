// Shared TypeScript interfaces and types for LotLite Business School Platform

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'guest';
  token?: string;
}

export interface Applicant {
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

export interface Venture {
  id: string;
  name: string;
  founders: string;
  status: 'Audited & Certified' | 'Pending Audit';
  webApp: string;
  traction: number; // in Rupees
  description: string;
}

export interface ProgramSubTab {
  id: string;
  label: string;
}

export interface Course {
  id: 'brem' | 'bca' | 'mca' | 'mba';
  title: string;
  duration: string;
  description: string;
  focus: string;
  overview: string;
  curriculum: string[];
  fees: {
    tuition: string;
    security: string;
    total: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

// Redux Feature States

export interface DashboardState {
  activeSection: string;
  activeSubTab: string;
  isMenuOpen: boolean;
  isInternshipPanelOpen: boolean;
  toastMessage: {
    title: string;
    description: string;
    show: boolean;
    type?: 'success' | 'info' | 'warning' | 'error';
  } | null;
  statistics: {
    totalApplications: number;
    interviewCount: number;
    offeredCount: number;
    averageTraction: number;
  };
}

export interface UserState {
  currentUser: UserProfile | null;
  isAdminLoggedIn: boolean;
  isAdminLoginOpen: boolean;
  loading: boolean;
  error: string | null;
}

export interface AdmissionsState {
  applicants: Applicant[];
  ventures: Venture[];
  loading: boolean;
  error: string | null;
  submittingApplication: boolean;
  applicationSuccess: boolean;
}

export interface ProgramsState {
  courses: Record<'brem' | 'bca' | 'mca' | 'mba', Course>;
  loading: boolean;
  activeCourse: 'brem' | 'bca' | 'mca' | 'mba';
  downloadingBrochure: boolean;
  error: string | null;
}

export interface ChatbotState {
  messages: ChatMessage[];
  isBotTyping: boolean;
  isOpen: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  author?: string;
  image?: string;
}

export interface BlogsState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

export interface FaqItem {
  id: string;
  category: string;
  q: string;
  a: string;
}

export interface FaqState {
  faqs: FaqItem[];
  loading: boolean;
  error: string | null;
}

