import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Bot, PieChart, Calculator, Activity, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import DataEntry from './pages/DataEntry';
import ChatBot from './pages/ChatBot';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import GST from './pages/GST';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import { useState } from 'react';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link to={path}>
    <div className={clsx(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
      active ? "bg-white/10 text-metallicGold border border-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
    )}>
      <Icon size={20} className={active ? "text-metallicGold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" : "group-hover:text-white"} />
      <span className="font-medium">{label}</span>
      {active && (
        <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1 bg-metallicGold shadow-[0_0_10px_rgba(212,175,55,1)]" />
      )}
    </div>
  </Link>
);

export default function App() {
  const location = useLocation();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent text-softWhite overflow-hidden">
      {/* Elegant Sidebar */}
      <aside className="w-72 border-r border-white/10 glass flex flex-col p-6 gap-8 z-20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-cyber-gradient flex items-center justify-center shadow-glow">
            <span className="text-xl font-display font-bold italic text-white">TN</span>
          </div>
          <span className="text-2xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Alpha</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" active={location.pathname === '/'} />
          <SidebarItem icon={FileText} label="Transactions" path="/entry" active={location.pathname === '/entry'} />
          <SidebarItem icon={Bot} label="AI Tax Assistant" path="/ai" active={location.pathname === '/ai'} />
          <SidebarItem icon={PieChart} label="Reports" path="/reports" active={location.pathname === '/reports'} />
          <SidebarItem icon={Calculator} label="GST Settings" path="/gst" active={location.pathname === '/gst'} />
          <SidebarItem icon={Activity} label="Analytics" path="/analytics" active={location.pathname === '/analytics'} />
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-6">
          <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === '/settings'} />
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Futuristic Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electricTeal/5 blur-[120px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-metallicGold/10 blur-[100px] -z-10 rounded-full" />
        
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entry" element={<DataEntry />} />
            <Route path="/gst" element={<GST />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai" element={
              <div className="p-8 h-[calc(100vh-2rem)]">
                <div className="h-full w-full rounded-3xl overflow-hidden shadow-cardGlow border border-cyan/30 relative">
                  <ChatBot />
                </div>
              </div>
            } />
            <Route path="*" element={
              <div className="p-8 flex items-center justify-center h-full">
                <div className="glass-card p-12 text-center max-w-md w-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan/10 to-transparent opacity-50"></div>
                  <div className="w-20 h-20 mx-auto bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-cyan/20 blur-xl rounded-full animate-pulse"></div>
                    <Activity size={32} className="text-cyan relative z-10" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Module Initializing</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">This module is currently being calibrated by the Alpha AI engine. It will be available shortly.</p>
                  
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_10px_rgba(0,217,255,0.8)]"
                    />
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Trio Hologram Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isAiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
              className="mb-4 shadow-cardGlow rounded-2xl overflow-hidden flex flex-col glass-card border border-white/10 ring-1 ring-cyan/30"
              style={{ width: '420px', height: '650px' }}
            >
              <ChatBot onClose={() => setIsAiOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="flex items-center gap-3 bg-gradient-to-r from-electricTeal to-metallicGold text-white px-6 py-4 rounded-full shadow-glow transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.8)] relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Bot size={24} className="relative z-10" />
          <span className="font-display font-bold text-lg relative z-10">Trio</span>
        </button>
      </div>
    </div>
  );
}
