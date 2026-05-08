import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, AlertCircle, X, Mic } from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_ACTIONS = [
  { label: 'Analyze My Taxes', query: 'Based on my data, give me a full tax analysis and regime comparison.' },
  { label: 'Save ₹50,000 More', query: 'How can I save an additional ₹50,000 in taxes this year?' },
  { label: '80C Breakdown', query: 'Show me my current 80C investments and how much headroom I have.' },
  { label: 'New vs Old Regime', query: 'Compare my tax liability under the New vs Old regime for FY 24-25.' },
];

export default function ChatBot({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am **Trio**, your holographic financial strategist. I have secure access to your ledger and the latest tax laws. \n\nHow can I optimize your wealth today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await axios.post('http://127.0.0.1:8000/chat', {
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
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 hover:rotate-90 rounded-full transition-all duration-300">
            <X size={20} />
          </button>
        )}
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

        {/* Quick Actions */}
        <div className="px-6 pb-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
          {QUICK_ACTIONS.map((action, idx) => (
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
