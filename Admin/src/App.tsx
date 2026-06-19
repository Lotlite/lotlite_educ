import { useState } from 'react';
import LeadDashboard from './components/LeadDashboard'
import OverviewDashboard from './components/OverviewDashboard'
import BlogGeneration from './components/BlogGeneration'
import WebsiteDataDashboard from './components/WebsiteDataDashboard'
import ChatbotLogsDashboard from './components/ChatbotLogsDashboard'
import DograhCallLogsDashboard from './components/DograhCallLogsDashboard'
import { LayoutDashboard, Users, LogOut, Menu, X, FileText, Globe, MessageSquare, Phone } from 'lucide-react';

type ViewState = 'overview' | 'leads' | 'blog' | 'website-data' | 'chatbot-logs' | 'dograh-call-logs';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleNavClick = (view: ViewState) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
        <div className="w-8 h-8 bg-wine rounded-lg flex items-center justify-center mr-3 text-white font-bold text-lg">
          L
        </div>
        <h1 className="text-xl font-bold text-gray-900">Lotlite Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <button 
          onClick={() => handleNavClick('overview')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${activeView === 'overview' ? 'bg-wine/10 text-wine' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <LayoutDashboard size={20} className={activeView === 'overview' ? 'text-wine' : 'text-gray-400 group-hover:text-gray-600'} />
          <span className="font-medium text-sm">Overview</span>
        </button>

        <button 
          onClick={() => handleNavClick('leads')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${activeView === 'leads' ? 'bg-wine/10 text-wine' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <Users size={20} className={activeView === 'leads' ? 'text-wine' : 'text-gray-400 group-hover:text-gray-600'} />
          <span className="font-medium text-sm">Leads</span>
        </button>

        <button 
          onClick={() => handleNavClick('blog')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${activeView === 'blog' ? 'bg-wine/10 text-wine' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <FileText size={20} className={activeView === 'blog' ? 'text-wine' : 'text-gray-400 group-hover:text-gray-600'} />
          <span className="font-medium text-sm">Blog Generation</span>
        </button>

        <button 
          onClick={() => handleNavClick('website-data')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${activeView === 'website-data' ? 'bg-wine/10 text-wine' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <Globe size={20} className={activeView === 'website-data' ? 'text-wine' : 'text-gray-400 group-hover:text-gray-600'} />
          <span className="font-medium text-sm">Website Data</span>
        </button>

        <button 
          onClick={() => handleNavClick('chatbot-logs')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${activeView === 'chatbot-logs' ? 'bg-wine/10 text-wine' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <MessageSquare size={20} className={activeView === 'chatbot-logs' ? 'text-wine' : 'text-gray-400 group-hover:text-gray-600'} />
          <span className="font-medium text-sm">Chatbot Logs</span>
        </button>

        <button 
          onClick={() => handleNavClick('dograh-call-logs')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${activeView === 'dograh-call-logs' ? 'bg-wine/10 text-wine' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <Phone size={20} className={activeView === 'dograh-call-logs' ? 'text-wine' : 'text-gray-400 group-hover:text-gray-600'} />
          <span className="font-medium text-sm">Voice Agent Logs</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200 shrink-0">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors group">
          <LogOut size={20} className="text-gray-400 group-hover:text-red-500" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
            onClick={toggleMobileMenu}
          ></div>
          
          {/* Sliding panel */}
          <aside className="relative w-64 bg-white shadow-xl h-full flex flex-col transform transition-transform">
            <button 
              onClick={toggleMobileMenu} 
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-md"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-wine rounded-lg flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <span className="font-bold text-gray-900">Lotlite Admin</span>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 relative overflow-auto">
          {activeView === 'overview' && <OverviewDashboard />}
          {activeView === 'leads' && <LeadDashboard />}
          {activeView === 'blog' && <BlogGeneration />}
          {activeView === 'website-data' && <WebsiteDataDashboard />}
          {activeView === 'chatbot-logs' && <ChatbotLogsDashboard />}
          {activeView === 'dograh-call-logs' && <DograhCallLogsDashboard />}
        </div>
      </main>
    </div>
  )
}

export default App
