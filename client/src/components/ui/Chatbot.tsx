import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const SAMPLE_FAQ = [
  {
    id: 'brem',
    question: 'Tell me about the B.REM Program 📊',
    reply: 'The Business & Real Estate Management (BREM) Program is our signature professional stream. It focuses on micro-market evaluation, advanced real estate valuation models, PropTech integration, and automated AI agents, preparing you for leadership in real estate investment & operations.'
  },
  {
    id: 'admission',
    question: 'Admission criteria & application? 📝',
    reply: 'Admissions require a completed online form, solid academic transcripts, and a brief interview. You can apply directly through our Admissions section inside the portal, or request a complete brochure.'
  },
  {
    id: 'fees',
    question: 'How much are the tuition fees? 💰',
    reply: 'Tuition fees are structured competitively with flexible 3-part installment plans. There is also a special 10% discount for upfront, lump-sum semester payment. Head to the Tuition Fees sub-section under Programs for full itemization.'
  },
  {
    id: 'exams',
    question: 'Exams & Grading system? 🎓',
    reply: 'We use a modern credit-based framework. 40% of evaluation is based on real-time micro-market case study completions and midterm group research, and 60% rests on your final pitch deck defense evaluated by professional industry mentors.'
  },
  {
    id: 'contact',
    question: 'How do I contact an advisor? 📞',
    reply: 'You can email admissions@lotlite.edu, call our 24/7 academic desk, or arrange a private consultation directly with our mentors listed in the Faculty section. We are here to help!'
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Greetings! Welcome to our Academic Help Desk. 🎓\n\nI am your Lotlite Support Assistant. How can I help you today? Please feel free to type a question or select an option below.',
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Notify the app/sticky bottom bar of the chatbot-open state
    const event = new CustomEvent('modal-state-change', {
      detail: { isOpen: isOpen }
    });
    window.dispatchEvent(event);
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let matchedReply = "I'm here to help! Could you please elaborate or rephrase your question? Alternatively, feel free to use one of our quick options below to get direct support on Admissions, Fees, Exams or Programs.";
      const cleanText = text.toLowerCase();

      if (cleanText.includes('brem') || cleanText.includes('program') || cleanText.includes('course') || cleanText.includes('syllabus') || cleanText.includes('curriculum')) {
        matchedReply = SAMPLE_FAQ.find(f => f.id === 'brem')?.reply || matchedReply;
      } else if (cleanText.includes('admission') || cleanText.includes('apply') || cleanText.includes('criteria') || cleanText.includes('enroll') || cleanText.includes('requirement')) {
        matchedReply = SAMPLE_FAQ.find(f => f.id === 'admission')?.reply || matchedReply;
      } else if (cleanText.includes('fee') || cleanText.includes('fees') || cleanText.includes('cost') || cleanText.includes('price') || cleanText.includes('tuition') || cleanText.includes(' installment')) {
        matchedReply = SAMPLE_FAQ.find(f => f.id === 'fees')?.reply || matchedReply;
      } else if (cleanText.includes('exam') || cleanText.includes('test') || cleanText.includes('grade') || cleanText.includes('grading') || cleanText.includes('credit') || cleanText.includes('evaluation')) {
        matchedReply = SAMPLE_FAQ.find(f => f.id === 'exams')?.reply || matchedReply;
      } else if (cleanText.includes('contact') || cleanText.includes('email') || cleanText.includes('phone') || cleanText.includes('call') || cleanText.includes('advisor') || cleanText.includes('support')) {
        matchedReply = SAMPLE_FAQ.find(f => f.id === 'contact')?.reply || matchedReply;
      } else if (cleanText.includes('hello') || cleanText.includes('hi') || cleanText.includes('hey') || cleanText.includes('greetings')) {
        matchedReply = "Hello there! I'm glad to assist. What can I clarify for you today concerning Lotlite's programs or academic procedures?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: matchedReply,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 850);
  };

  const handleSelectFAQ = (question: string, reply: string) => {
    // Add user message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Greetings! Welcome to our Academic Help Desk. 🎓\n\nI am your Lotlite Support Assistant. How can I help you today? Please feel free to type a question or select an option below.',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger button */}
      <div 
        className={`fixed ${isOpen ? 'bottom-4 sm:bottom-5 md:bottom-8' : 'bottom-20 md:bottom-8'} right-4 sm:right-5 md:right-8 z-[90] flex items-center gap-3 flex-row-reverse`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          id="chatbot-trigger"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all cursor-pointer ${
            isOpen 
              ? 'bg-card text-wine border border-border' 
              : 'bg-wine text-zinc-50 border border-wine/10'
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

      {/* Backdrop overlay on mobile view when chatbot is open */}
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

      {/* Expand Chatbot Modal Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-20 sm:bottom-20 md:bottom-24 right-4 left-4 sm:left-auto sm:right-5 md:right-8 w-[calc(100vw-2rem)] sm:w-[380px] h-[calc(100vh-110px)] max-h-[500px] sm:h-[520px] bg-card border border-border rounded-3xl shadow-3xl overflow-hidden flex flex-col z-[90]"
          >
            {/* Header section styled elegantly matching deep-wine or sleek theme */}
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

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-modal-scrollbar bg-offwhite/40">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'bot' 
                      ? 'bg-wine/10 text-wine dark:bg-wine/30 dark:text-rose-400' 
                      : 'bg-card border border-border text-muted shadow-xs'
                  }`}>
                    {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-wine text-zinc-50 rounded-tr-none shadow-sm font-semibold' 
                        : 'bg-card border border-border text-black rounded-tl-none shadow-xs font-semibold whitespace-pre-wrap'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[9px] text-muted font-semibold uppercase tracking-wider px-1 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Animation */}
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

            {/* Quick Actions FAQ selection panel */}
            <div className="border-t border-border p-3 bg-card flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide shrink-0">
              {SAMPLE_FAQ.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleSelectFAQ(faq.question, faq.reply)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-wine-light hover:text-wine text-black rounded-lg text-[10.5px] font-extrabold uppercase tracking-widest whitespace-nowrap transition-all border border-border select-none cursor-pointer shadow-xs"
                >
                  <HelpCircle size={10} className="text-wine shrink-0 text-wine" />
                  <span>{faq.id}</span>
                </button>
              ))}
            </div>

            {/* Text Input Panel */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="border-t border-border p-3 bg-offwhite flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about BREM syllabus, fees, admissions..."
                className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs text-black focus:outline-hidden focus:ring-1 focus:ring-wine focus:border-wine placeholder-muted"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="p-2 mb-0 bg-wine text-zinc-50 rounded-xl shadow-md shadow-wine/10 hover:brightness-110 active:scale-95 transition-all select-none cursor-pointer flex items-center justify-center shrink-0"
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
