import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  followUpIds?: string[];
  status?: 'success' | 'error';
  isContactForm?: boolean;
}

type ConversationFlow = null | 'submitting';

const SAMPLE_FAQ = [
  {
    id: 'about',
    label: 'About the Programs',
    question: 'Tell me about the Programs 🏫',
    reply: 'Lotlite offers two flagship real estate Programs:\n\n• Bachelor of Business Administration (BBA) in Real Estate & Marketing (3 Years)\n• Master of Business Administration (MBA) in Real Estate, Business & PropTech (2 Years)\n\nBoth programs integrate micro-market evaluation, PropTech, and AI automation to prepare graduates for industry leadership.',
    followUpIds: ['curriculum', 'admission', 'fees']
  },
  {
    id: 'admission',
    label: 'Admissions & Eligibility',
    question: 'What are the admissions & eligibility criteria? 📝',
    reply: 'BBA Eligibility: 12th grade completion (or equivalent) in any stream.\nMBA Eligibility: Completed Bachelor’s degree in any recognized field.\n\nApplicants undergo profile screening, a diagnostic entrance test, and an executive interview. Applications are open year-round via our Admissions portal.',
    followUpIds: ['apply', 'fees', 'contact']
  },
  {
    id: 'curriculum',
    label: 'Curriculum',
    question: 'What does the curriculum cover? 📚',
    reply: 'Our curriculum bridges traditional business logic with modern PropTech:\n\n• Real Estate Valuation & Urban Infrastructure\n• Digital CRM & Lead Generation Automation\n• PropTech Integration & AI/ML Tools\n• Strategic Brand Positioning & Portfolio Management\n\nModules blend theory with live case studies and internships.',
    followUpIds: ['about', 'exams', 'fees']
  },
  {
    id: 'fees',
    label: 'Fees & Scholarships',
    question: 'What are the fees & scholarship options? 💰',
    reply: 'Tuition Fees:\n• BBA: ₹1,50,000 per Semester\n• MBA: ₹2,25,000 per Semester\n\nWe offer transparent funding with 0% EMI financing options and Founders Merit Scholarships (up to 50% aid) for outstanding applicants.',
    followUpIds: ['admission', 'apply', 'contact']
  },
  {
    id: 'career',
    label: 'Career Outcomes',
    question: 'What are the career outcomes? 🚀',
    reply: 'Graduates enter high-growth roles such as:\n\n• Real Estate Investment Analyst\n• Property Portfolio Manager\n• PropTech Strategy Head\n• Real Estate Developer / Entrepreneur\n\nOur placement cell partners with leading developers and REITs for direct campus recruitment.',
    followUpIds: ['about', 'curriculum', 'apply']
  },
  {
    id: 'apply',
    label: 'Apply Now',
    question: 'How do I apply? ✍️',
    reply: 'Applying is simple:\n\n1. Fill out the online application form in our Admissions portal\n2. Submit your academic transcripts (12th for BBA, Degree for MBA)\n3. Attempt the diagnostic test\n4. Complete a brief interview with our directors\n\nNeed help? Our advisors are happy to walk you through it!',
    followUpIds: ['admission', 'fees', 'contact']
  },
  {
    id: 'contact',
    label: 'Talk to an Advisor',
    question: 'I want to talk to an advisor 📞',
    reply: null,
    followUpIds: []
  }
];

const getFAQById = (id: string) => SAMPLE_FAQ.find(f => f.id === id);

const matchKeywords = (text: string): string => {
  const t = text.toLowerCase();
  const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup', 'howdy'];
  if (greetings.some(g => t.includes(g))) return 'greeting';
  if (t.includes('career') || t.includes('placement') || t.includes('job') || t.includes('outcome') || t.includes('salary') || t.includes('opportunity') || t.includes('reit') || t.includes('intern') || t.includes('hire') || t.includes('recruit')) return 'career';
  if (t.includes('curriculum') || t.includes('syllabus') || t.includes('subject') || t.includes('module') || t.includes('topic') || t.includes('what do you teach') || t.includes('course content')) return 'curriculum';
  if (t.includes('apply') || t.includes('application') || t.includes('how to join') || t.includes('sign up') || t.includes('register') || t.includes('enroll') || t.includes('start')) return 'apply';
  if (t.includes('admission') || t.includes('criteria') || t.includes('requirement') || t.includes('eligibility') || t.includes('qualify') || t.includes('eligible')) return 'admission';
  if (t.includes('fee') || t.includes('cost') || t.includes('price') || t.includes('tuition') || t.includes('installment') || t.includes('payment') || t.includes('discount') || t.includes('scholarship') || t.includes('afford') || t.includes('expensive') || t.includes('financial')) return 'fees';
  if (t.includes('bba') || t.includes('mba') || t.includes('brem') || t.includes('program') || t.includes('Program') || t.includes('course') || t.includes('real estate') || t.includes('proptech') || t.includes('duration') || t.includes('how long') || t.includes('about')) return 'about';
  if (t.includes('contact') || t.includes('email') || t.includes('phone') || t.includes('call') || t.includes('advisor') || t.includes('support') || t.includes('reach') || t.includes('talk') || t.includes('speak') || t.includes('mentor') || t.includes('faculty') || t.includes('chat')) return 'contact';
  return 'fallback';
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function ContactFormCard({ onSubmit }: { onSubmit: (name: string, phone: string, otp: string) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length >= 10) {
      setIsSendingOtp(true);
      try {
        const res = await fetch(`${API_BASE}/api/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: `${countryCode}${phone}` })
        });
        const data = await res.json();
        if (data.success) {
          setOtpSent(true);
        } else {
          alert('Failed to send OTP: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error(err);
        alert('Network error while sending OTP.');
      } finally {
        setIsSendingOtp(false);
      }
    }
  };

  const handleSubmit = () => {
    if (name && phone && otpSent && otp) {
      onSubmit(name, `${countryCode}${phone}`, otp);
    }
  };

  return (
    <div className="bg-card p-4 rounded-2xl shadow-sm border border-border max-w-[280px] space-y-4">
      <div>
        <h4 className="font-bold text-sm text-black font-sans">Request a Callback</h4>
        <p className="text-[10px] text-muted mt-0.5">Share your details to continue the conversation</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] text-muted uppercase font-bold tracking-wider">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your full name"
          autoComplete="off"
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-wine/50 transition-colors text-black placeholder-muted [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--color-bg-input)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text)]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] text-muted uppercase font-bold tracking-wider">Phone</label>
        <div className="flex gap-1.5">
          <div className="relative shrink-0">
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="appearance-none bg-input border border-border rounded-lg pl-2 pr-5 py-2 text-xs focus:outline-none focus:border-wine/50 transition-colors text-black w-[60px]"
            >
              <option value="+91" className="bg-input text-black">(+91)</option>
              <option value="+1" className="bg-input text-black">(+1)</option>
              <option value="+44" className="bg-input text-black">(+44)</option>
            </select>
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="9876543210"
            autoComplete="off"
            className="flex-1 min-w-0 bg-input border border-border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-wine/50 transition-colors text-black placeholder-muted [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--color-bg-input)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text)]"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isSendingOtp}
            className="bg-wine hover:bg-wine-hover true-text-white px-2 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
          >
            {isSendingOtp ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
          </button>
        </div>
      </div>

      {otpSent && (
        <div className="space-y-1.5">
          <label className="text-[9px] text-muted uppercase font-bold tracking-wider">Enter OTP (WhatsApp)</label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            autoComplete="off"
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-wine/50 transition-colors text-black placeholder-muted [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--color-bg-input)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text)]"
          />
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSubmit}
          disabled={!name || !phone || (otpSent && !otp)}
          className="bg-wine hover:bg-wine-hover true-text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Callback
        </button>
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(true);

  useEffect(() => {
    const handleStickyBarVisibility = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isVisible === 'boolean') {
        setIsStickyBarVisible(customEvent.detail.isVisible);
      }
    };

    window.addEventListener('sticky-bar-visibility-change', handleStickyBarVisibility);
    return () => {
      window.removeEventListener('sticky-bar-visibility-change', handleStickyBarVisibility);
    };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Greetings! Welcome to our Academic Help Desk. 🎓\n\nI am your Lotlite Support Assistant. How can I help you today? Select a topic below or type your question.',
      timestamp: new Date(),
      followUpIds: ['about', 'admission', 'curriculum', 'fees', 'career', 'apply', 'contact']
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [flow, setFlow] = useState<ConversationFlow>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(`sess-${Date.now()}-${Math.floor(Math.random() * 10000)}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const event = new CustomEvent('modal-state-change', { detail: { isOpen } });
    window.dispatchEvent(event);
  }, [isOpen]);

  useEffect(() => {
    const syncChat = async () => {
      try {
        await fetch(`${API_BASE}/api/chat/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            messages
          })
        });
      } catch (err) {
        console.error('Failed to sync chat logs:', err);
      }
    };

    const timeout = setTimeout(syncChat, 1000);
    return () => clearTimeout(timeout);
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const pushBotMessage = (text: string, followUpIds?: string[], status?: 'success' | 'error') => {
    setMessages((prev) => [
      ...prev,
      { id: `bot-${Date.now()}`, sender: 'bot', text, timestamp: new Date(), followUpIds, status }
    ]);
    setIsTyping(false);
  };

  const pushUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'user', text, timestamp: new Date() }
    ]);
  };

  const startContactFlow = () => {
    pushUserMessage('How do I contact an advisor? 📞');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', text: '', isContactForm: true, timestamp: new Date() }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const submitToCallyzer = async (name: string, phone: string, otp: string) => {
    setFlow('submitting');
    setIsTyping(true);
    try {
      const res = await fetch(`${API_BASE}/api/otp/verify-and-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp,
          leadData: {
            fullName: name,
            phone,
            source: 'Chatbot',
            lead_tags: ['Lotlite Edu', 'Chatbot']
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Request failed');

      const leadId = data.data?._id;
      if (leadId) {
        fetch(`${API_BASE}/api/chat/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            messages,
            leadId
          })
        }).catch(console.error);
      }

      pushBotMessage(
        `Thank you, ${name}! ✅\n\nOur advisor will call you at ${phone} shortly. Is there anything else I can help you with?`,
        ['about', 'admission', 'fees', 'career'],
        'success'
      );
    } catch {
      pushBotMessage(
        "Sorry, something went wrong while sending your details. 😔\n\nPlease email us directly at admissions@lotlitestartup.com or call our 24/7 academic desk.",
        ['contact'],
        'error'
      );
    } finally {
      setFlow(null);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setInputVal('');

    // --- Normal keyword flow ---
    pushUserMessage(text);
    setIsTyping(true);

    setTimeout(() => {
      const match = matchKeywords(text);
      if (match === 'contact') {
        startContactFlow();
        return;
      }
      if (match === 'greeting') {
        pushBotMessage(
          "Hello! Great to have you here. 😊 I can help you with our Program, curriculum, admissions, fees, career outcomes, or connecting with an advisor. What would you like to know?",
          ['about', 'admission', 'fees', 'career', 'contact']
        );
      } else if (match === 'fallback') {
        pushBotMessage(
          "I'm not sure I caught that — could you rephrase or pick one of the quick topics below?",
          ['about', 'admission', 'curriculum', 'fees', 'career', 'apply', 'contact']
        );
      } else {
        const faq = getFAQById(match);
        if (faq) pushBotMessage(faq.reply!, faq.followUpIds);
      }
    }, 850);
  };

  const handleSelectFAQ = (faqId: string) => {
    if (faqId === 'contact') {
      startContactFlow();
      return;
    }
    const faq = getFAQById(faqId);
    if (!faq || !faq.reply) return;
    pushUserMessage(faq.question);
    setIsTyping(true);
    setTimeout(() => pushBotMessage(faq.reply!, faq.followUpIds), 600);
  };

  const handleReset = () => {
    setFlow(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Greetings! Welcome to our Academic Help Desk. 🎓\n\nI am your Lotlite Support Assistant. How can I help you today? Select a topic below or type your question.',
        timestamp: new Date(),
        followUpIds: ['about', 'admission', 'curriculum', 'fees', 'career', 'apply', 'contact']
      }
    ]);
  };

  const inputPlaceholder = 'Ask about admissions, fees, curriculum...';

  return (
    <>
      {/* Floating trigger */}
      <div
        className={`fixed ${
          isOpen
            ? 'bottom-4 sm:bottom-5 md:bottom-8'
            : isStickyBarVisible
            ? 'bottom-20 md:bottom-8'
            : 'bottom-4 sm:bottom-5 md:bottom-8'
        } right-4 sm:right-5 md:right-8 z-[90] flex items-center gap-3 flex-row-reverse transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          id="chatbot-trigger"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all cursor-pointer ${isOpen ? 'bg-card text-wine border border-border' : 'bg-wine text-zinc-50 border border-wine/10'
            }`}
          aria-label="Academic chatbot support"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} className="animate-pulse" />}
        </motion.button>

        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="px-4 py-2 bg-wine text-zinc-50 font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl pointer-events-none select-none border border-wine/10"
            >
              Need Help?
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbot-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[85] cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`fixed ${
              isStickyBarVisible
                ? 'bottom-20 sm:bottom-20 md:bottom-24'
                : 'bottom-4 sm:bottom-5 md:bottom-24'
            } right-4 left-4 sm:left-auto sm:right-5 md:right-8 w-[calc(100vw-2rem)] sm:w-[380px] h-[calc(100vh-110px)] max-h-[500px] sm:h-[520px] bg-card border border-border rounded-3xl shadow-3xl overflow-hidden flex flex-col z-[90] transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-wine p-4 flex items-center justify-between border-b border-wine/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white relative">
                  <Bot size={20} className="text-zinc-50" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-wine" />
                </div>
                <div>
                  <h4 className="text-zinc-50 font-bold text-sm tracking-wide flex items-center gap-1.5 font-serif">
                    Lotlite Support <Sparkles size={12} className="text-zinc-50/80" />
                  </h4>
                  <p className="text-[#ffffff]/70 text-[10px] uppercase font-semibold tracking-widest leading-none">Online &middot; Academic Desk</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1 px-2 rounded-lg text-[#ffffff]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1"
                  title="Reset Conversation"
                >
                  <RefreshCw size={12} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[#ffffff]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-modal-scrollbar bg-offwhite/40">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot'
                        ? msg.status === 'success'
                          ? 'bg-green-100 text-green-600'
                          : msg.status === 'error'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-wine/10 text-wine dark:bg-wine/30 dark:text-rose-400'
                        : 'bg-card border border-border text-muted shadow-xs'
                      }`}>
                      {msg.sender === 'bot'
                        ? msg.status === 'success'
                          ? <CheckCircle size={14} />
                          : msg.status === 'error'
                            ? <AlertCircle size={14} />
                            : <Bot size={14} />
                        : <User size={14} />}
                    </div>

                    <div className="space-y-1">
                      {msg.isContactForm ? (
                        <ContactFormCard onSubmit={submitToCallyzer} />
                      ) : (
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                            ? 'bg-wine text-zinc-50 rounded-tr-none shadow-sm font-semibold'
                            : msg.status === 'success'
                              ? 'bg-green-50 border border-green-200 text-green-800 rounded-tl-none shadow-xs font-semibold whitespace-pre-wrap'
                              : msg.status === 'error'
                                ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none shadow-xs font-semibold whitespace-pre-wrap'
                                : 'bg-card border border-border text-black rounded-tl-none shadow-xs font-semibold whitespace-pre-wrap'
                          }`}>
                          {msg.text}
                        </div>
                      )}
                      <p className={`text-[9px] text-muted font-semibold uppercase tracking-wider px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Contextual follow-up chips */}
                  {msg.sender === 'bot' && msg.followUpIds && msg.followUpIds.length > 0 && (
                    <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                      {msg.followUpIds.map((fid) => {
                        const faq = getFAQById(fid);
                        if (!faq) return null;
                        return (
                          <button
                            key={fid}
                            onClick={() => handleSelectFAQ(fid)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-card hover:bg-wine hover:text-zinc-50 text-black border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                          >
                            <HelpCircle size={9} className="shrink-0" />
                            {faq.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-wine/10 text-wine dark:bg-wine/30 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-card border border-border p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 text-muted">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-muted rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-muted rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-muted rounded-full" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
              className="border-t border-border p-3 bg-offwhite flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={inputPlaceholder}
                disabled={flow === 'submitting'}
                className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs text-black focus:outline-hidden focus:ring-1 focus:ring-wine focus:border-wine placeholder-muted disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={flow === 'submitting'}
                className="p-2 mb-0 bg-wine text-zinc-50 rounded-xl shadow-md shadow-wine/10 hover:brightness-110 active:scale-95 transition-all select-none cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={15} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
