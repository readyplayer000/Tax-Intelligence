import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, AlertCircle, X, Mic, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FAQ_ITEMS = [
  { 
    label: 'Analyze My Taxes', 
    query: 'Based on my data, give me a full tax analysis and regime comparison.',
    category: 'Analysis'
  },
  { 
    label: 'New vs Old Regime', 
    query: 'Explain the key differences between the New and Old tax regimes for FY 2024-25. Which one is generally better?',
    category: 'Regime'
  },
  { 
    label: '80C Limits', 
    query: 'What are the current limits for Section 80C and what investments qualify?',
    category: 'Deductions'
  },
  { 
    label: 'HRA Calculation', 
    query: 'How do I calculate my HRA exemption? What are the conditions?',
    category: 'Deductions'
  },
  { 
    label: 'Standard Deduction', 
    query: 'What is the standard deduction for FY 24-25 in both regimes?',
    category: 'General'
  },
  { 
    label: 'Section 80D', 
    query: 'What are the tax benefits for health insurance under Section 80D?',
    category: 'Deductions'
  },
  {
    label: 'Crypto & NFT Tax 2026',
    query: 'What are the new 2026 rules for Virtual Digital Assets like Crypto and NFTs? Can I set off losses?',
    category: 'Advanced Rules'
  },
  {
    label: 'GST Hard Compliance',
    query: 'Explain the new 2026 GST Hard Compliance Rules including the 3-Year Bar and IRN Window.',
    category: 'Business'
  },
  {
    label: 'Capital Gains 2026',
    query: 'How are Capital Gains taxed under the new 2026 rules? What happened to indexation?',
    category: 'Investments'
  },
];

export default function ChatBot({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am **Trio**, your holographic financial strategist. I have secure access to your ledger and the latest tax laws. \n\nHow can I optimize your wealth today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customQuery?: string) => {
    const queryToSend = customQuery || input;
    if (!queryToSend.trim() || isLoading) return;

    const userMessage = queryToSend.trim();
    if (!customQuery) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post('/agent/chat', {
        user_id: 'user_123',
        financial_year: '2024-25',
        message: userMessage
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'System Error: Neural link to Trio engine failed. Please try again.' }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-midnight/60 backdrop-blur-3xl relative overflow-hidden">
      {/* Hologram Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-electricTeal to-transparent opacity-50"></div>
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-electricTeal/10 blur-[100px] rounded-full mix-blend-screen animate-pulse-soft"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-metallicGold/10 blur-[100px] rounded-full mix-blend-screen animate-pulse-soft"></div>

      <header className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan/50 blur-md rounded-full animate-pulse"></div>
            <div className="relative p-2 bg-gradient-to-br from-indigo to-cyan rounded-full text-white shadow-[0_0_15px_rgba(0,217,255,0.6)] border border-white/20">
              <Bot size={20} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-display font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan">Trio</h1>
            <p className="text-[10px] text-cyan font-mono uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
              Neural Link Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFaq(!showFaq)}
            className={clsx(
              "p-2 rounded-full transition-all duration-300",
              showFaq ? "bg-cyan/20 text-cyan" : "text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            <HelpCircle size={20} />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 hover:rotate-90 rounded-full transition-all duration-300">
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={clsx(
                  "flex gap-4 max-w-[90%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 relative group",
                  msg.role === 'assistant' 
                    ? "bg-black/50 text-cyan border border-cyan/30 shadow-[0_0_10px_rgba(0,217,255,0.3)]" 
                    : "bg-gradient-to-r from-indigo to-neonPurple text-white"
                )}>
                  {msg.role === 'assistant' && <div className="absolute inset-0 bg-cyan/20 blur-sm rounded-full"></div>}
                  {msg.role === 'assistant' ? <Bot size={16} className="relative z-10" /> : <User size={16} />}
                </div>
                <div className={clsx(
                  "p-4 rounded-2xl text-sm leading-relaxed prose prose-invert max-w-none relative",
                  msg.role === 'assistant' 
                    ? "bg-white/5 border border-white/10 rounded-tl-none text-slate-300" 
                    : "bg-gradient-to-r from-indigo/20 to-neonPurple/20 border border-indigo/30 rounded-tr-none text-white"
                )}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 max-w-[90%]"
              >
                <div className="w-8 h-8 rounded-full bg-black/50 text-cyan border border-cyan/30 flex items-center justify-center relative mt-1">
                  <div className="absolute inset-0 bg-cyan/30 blur-md rounded-full animate-pulse"></div>
                  <Bot size={16} className="relative z-10" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-cyan/30 shadow-[0_0_15px_rgba(0,217,255,0.1)] flex items-center gap-3">
                  <span className="text-xs font-mono text-cyan uppercase tracking-widest">Processing</span>
                  <div className="flex gap-1 h-3 items-center">
                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-cyan rounded-full"></motion.div>
                    <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-cyan rounded-full"></motion.div>
                    <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-cyan rounded-full"></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FAQ Overlay */}
        <AnimatePresence>
          {showFaq && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="absolute inset-y-0 right-0 w-full bg-black/90 backdrop-blur-2xl z-50 p-6 border-l border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <HelpCircle className="text-cyan" />
                  Frequently Asked Questions
                </h3>
                <button onClick={() => setShowFaq(false)} className="p-2 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[calc(100%-4rem)] pr-2 custom-scrollbar">
                {FAQ_ITEMS.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSend(faq.query);
                      setShowFaq(false);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/5 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-cyan font-mono uppercase tracking-widest block mb-1">{faq.category}</span>
                        <p className="text-sm font-medium text-white group-hover:text-cyan transition-colors">{faq.label}</p>
                      </div>
                      <Send size={14} className="text-slate-600 group-hover:text-cyan mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions (Bottom Scroll) */}
        <div className="px-6 pb-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
          {FAQ_ITEMS.slice(0, 4).map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.query)}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium bg-black/40 border border-white/10 rounded-full hover:border-cyan/50 hover:bg-cyan/10 hover:text-cyan hover:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all text-slate-400 whitespace-nowrap glow-hover"
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl relative">
          <div className="relative group flex items-center gap-2">
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-cyan hover:border-cyan/50 hover:bg-cyan/10 transition-all glow-hover">
              <Mic size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Trio..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all placeholder:text-slate-500 text-white shadow-inner"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-cyber-gradient text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-glow flex items-center justify-center hover:scale-105"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-mono tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles size={10} className="text-neonPurple" />
            Trio Secure Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
