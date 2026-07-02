import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Bot, PieChart, Calculator, Activity, Settings, LogOut, Search, Mic, User, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import DataEntry from './pages/DataEntry';
import ChatBot from './pages/ChatBot';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import GST from './pages/GST';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import { useState, useEffect } from 'react';

const HeaderTab = ({ icon: Icon, label, path, active, color }: { icon: any, label: string, path: string, active: boolean, color: string }) => (
  <Link to={path}>
    <div
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm border select-none hover:scale-[1.02]",
        active
          ? "text-[#1C1917] border-white/10 shadow-sm font-semibold"
          : "text-slate-300 hover:text-white border-transparent"
      )}
      style={{
        backgroundColor: active ? color : `${color}59`,
      }}
    >
      <Icon size={18} className="shrink-0" />
      <span>{label}</span>
    </div>
  </Link>
);

const SubNavTab = ({ label, path, active }: { label: string, path: string, active: boolean }) => (
  <Link to={path}>
    <div className={clsx(
      "px-4 py-3.5 border-b-2 text-sm font-medium transition-all duration-200 select-none",
      active
        ? "border-[var(--indigo-color)] text-[var(--foreground)] font-semibold"
        : "border-transparent text-slate-400 hover:text-[var(--foreground)]"
    )}>
      <span>{label}</span>
    </div>
  </Link>
);

export default function App() {
  const location = useLocation();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('taxai-token'));
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(() => {
    const stored = localStorage.getItem('taxai-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('taxai-theme') || 'illuminate';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const getActiveMainTab = () => {
    const p = location.pathname;
    if (p === '/' || p === '/analytics') return 'overview';
    if (p === '/entry') return 'ledger';
    if (p === '/reports' || p === '/gst') return 'reports';
    if (p === '/ai') return 'ai';
    if (p.startsWith('/settings')) return 'preferences';
    return 'overview';
  };

  const activeMainTab = getActiveMainTab();

  const searchItems = [
    { label: 'Overview Dashboard Summary', path: '/' },
    { label: 'Smart Analytics & Trends', path: '/analytics' },
    { label: 'Transactions Ledger (Record log)', path: '/entry' },
    { label: 'GST Returns (GSTR-1 & 3B)', path: '/gst' },
    { label: 'P&L Analysis Report', path: '/reports' },
    { label: 'Trio AI Assistant Chat', path: '/ai' },
    { label: 'Appearance & Themes (Settings)', path: '/settings?tab=appearance' },
    { label: 'User Profile & Settings', path: '/settings?tab=profile' },
    { label: 'Security & Access Control', path: '/settings?tab=security' },
    { label: 'Notifications & Alerts Config', path: '/settings?tab=notifications' },
    { label: 'AI Model Engine Calibration', path: '/settings?tab=ai-engine' }
  ];

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={(user) => { setCurrentUser(user); setIsAuthenticated(true); }} />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-softWhite overflow-hidden">
      {/* Top Header Bar */}
      <header className="top-header z-30 px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 100 106" className="w-9 h-9 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="8,40 20,43 20,73 8,70" fill="#E44A22" />
            <polygon points="26,28 38,31 38,65 26,62" fill="#248A4E" />
            <polygon points="44,42 56,45 56,83 44,80" fill="#E44A22" />
            <polygon points="62,52 74,55 74,101 62,98" fill="#E44A22" />
            <polygon points="80,18 92,21 92,81 80,78" fill="#248A4E" />
          </svg>
          <span className="text-4xl font-display font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[var(--heading-from)] to-[var(--heading-to)] select-none">ᴀʟᴘʜᴀ</span>
        </div>

        {/* Center: Main Navigation Header Tabs (Hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-2 bg-black/45 backdrop-blur-md px-2.5 py-2 rounded-2xl border border-white/5">
          <HeaderTab icon={LayoutDashboard} label="Overview" path="/" active={activeMainTab === 'overview'} color="#8EDAD0" />
          <HeaderTab icon={FileText} label="Transactions" path="/entry" active={activeMainTab === 'ledger'} color="#FCD782" />
          <HeaderTab icon={PieChart} label="Reports & GST" path="/reports" active={activeMainTab === 'reports'} color="#FF9A9A" />
          <HeaderTab icon={Bot} label="AI Assistant" path="/ai" active={activeMainTab === 'ai'} color="#FF7575" />
          <HeaderTab icon={Settings} label="Preferences" path="/settings" active={activeMainTab === 'preferences'} color="#A3CEF1" />
        </nav>

        {/* Right: Search and Profile Actions (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search bar */}
          <div className="relative w-56 md:w-72">
            <div className="flex items-center bg-black/20 focus-within:bg-black/30 border border-white/10 rounded-full px-3.5 py-1.5 gap-2 text-slate-400 focus-within:text-white transition-all">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-500 text-white"
              />
              <Mic size={14} className="cursor-pointer hover:text-white transition-colors" />
            </div>

            {showSearchDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 glass-card p-2 border border-white/15 shadow-2xl z-50 max-h-60 overflow-y-auto">
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 px-3 py-1.5">Quick Navigation</p>
                {searchItems
                  .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, idx) => (
                    <Link key={idx} to={item.path} onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}>
                      <div className="px-3 py-2 rounded-xl text-xs hover:bg-white/10 cursor-pointer transition-colors text-slate-300 hover:text-white">
                        {item.label}
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="User"
                className="w-7 h-7 rounded-full object-cover border border-white/20"
              />
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 glass-card p-2 border border-white/15 shadow-2xl z-50 flex flex-col gap-1">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white">{currentUser?.name || 'User'}</p>
                    <p className="text-[10px] text-slate-400">{currentUser?.email || ''}</p>
                  </div>
                  <Link to="/settings?tab=profile" onClick={() => setIsProfileOpen(false)}>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                      <User size={13} />
                      <span>Workspace Profile</span>
                    </div>
                  </Link>
                  <Link to="/settings?tab=appearance" onClick={() => setIsProfileOpen(false)}>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                      <Settings size={13} />
                      <span>Workspace Settings</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      localStorage.removeItem('taxai-token');
                      localStorage.removeItem('taxai-user');
                      setCurrentUser(null);
                      setIsAuthenticated(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left"
                  >
                    <LogOut size={13} />
                    <span>Secure Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Action Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-lg overflow-hidden z-20 flex flex-col px-6 py-6 gap-6"
          >
            {/* Search bar */}
            <div className="relative w-full">
              <div className="flex items-center bg-black/20 focus-within:bg-black/30 border border-[var(--border-color)] rounded-full px-3.5 py-2.5 gap-2 text-slate-400 focus-within:text-white transition-all">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search portal..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-500 text-white"
                />
                <Mic size={15} className="cursor-pointer hover:text-white transition-colors" />
              </div>

              {showSearchDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 glass-card p-2 border border-white/15 shadow-2xl z-50 max-h-60 overflow-y-auto">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 px-3 py-1.5">Quick Navigation</p>
                  {searchItems
                    .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
                      <Link key={idx} to={item.path} onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); setIsMobileMenuOpen(false); }}>
                        <div className="px-3 py-2 rounded-xl text-xs hover:bg-white/10 cursor-pointer transition-colors text-slate-300 hover:text-white">
                          {item.label}
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2.5">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border",
                  activeMainTab === 'overview'
                    ? "text-[#1C1917] bg-[#8EDAD0] border-[var(--border-color)] font-semibold"
                    : "text-slate-300 hover:text-white border-transparent bg-white/5"
                )}>
                  <LayoutDashboard size={18} />
                  <span>Overview</span>
                </div>
              </Link>
              <Link to="/entry" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border",
                  activeMainTab === 'ledger'
                    ? "text-[#1C1917] bg-[#FCD782] border-[var(--border-color)] font-semibold"
                    : "text-slate-300 hover:text-white border-transparent bg-white/5"
                )}>
                  <FileText size={18} />
                  <span>Transactions</span>
                </div>
              </Link>
              <Link to="/reports" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border",
                  activeMainTab === 'reports'
                    ? "text-[#1C1917] bg-[#FF9A9A] border-[var(--border-color)] font-semibold"
                    : "text-slate-300 hover:text-white border-transparent bg-white/5"
                )}>
                  <PieChart size={18} />
                  <span>Reports & GST</span>
                </div>
              </Link>
              <Link to="/ai" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border",
                  activeMainTab === 'ai'
                    ? "text-[#1C1917] bg-[#FF7575] border-[var(--border-color)] font-semibold"
                    : "text-slate-300 hover:text-white border-transparent bg-white/5"
                )}>
                  <Bot size={18} />
                  <span>AI Assistant</span>
                </div>
              </Link>
              <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border",
                  activeMainTab === 'preferences'
                    ? "text-[#1C1917] bg-[#A3CEF1] border-[var(--border-color)] font-semibold"
                    : "text-slate-300 hover:text-white border-transparent bg-white/5"
                )}>
                  <Settings size={18} />
                  <span>Preferences</span>
                </div>
              </Link>
            </nav>

            {/* Profile actions */}
            <div className="border-t border-[var(--border-color)] pt-4 flex flex-col gap-2">
              <div className="px-4 py-2 mb-2 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-slate-400">{currentUser?.email || ''}</p>
                </div>
              </div>
              <Link to="/settings?tab=profile" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white bg-white/5 transition-colors">
                  <User size={16} />
                  <span>Workspace Profile</span>
                </div>
              </Link>
              <Link to="/settings?tab=appearance" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white bg-white/5 transition-colors">
                  <Settings size={16} />
                  <span>Workspace Settings</span>
                </div>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  localStorage.removeItem('taxai-token');
                  localStorage.removeItem('taxai-user');
                  setCurrentUser(null);
                  setIsAuthenticated(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left bg-rose-500/5 border border-rose-500/10"
              >
                <LogOut size={16} />
                <span>Secure Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-Navigation Bar */}
      <div className="sub-nav px-4 sm:px-8 flex items-center gap-1.5 z-20 overflow-x-auto whitespace-nowrap scrollbar-none">
        {activeMainTab === 'overview' && (
          <>
            <SubNavTab label="Basics Summary" path="/" active={location.pathname === '/'} />
            <SubNavTab label="Detailed Analytics" path="/analytics" active={location.pathname === '/analytics'} />
          </>
        )}
        {activeMainTab === 'ledger' && (
          <>
            <SubNavTab label="Transactions Log" path="/entry" active={location.pathname === '/entry'} />
          </>
        )}
        {activeMainTab === 'reports' && (
          <>
            <SubNavTab label="Tax Reports (P&L)" path="/reports" active={location.pathname === '/reports'} />
            <SubNavTab label="GST Settings & Filings" path="/gst" active={location.pathname === '/gst'} />
          </>
        )}
        {activeMainTab === 'ai' && (
          <>
            <SubNavTab label="Chat with Trio" path="/ai" active={location.pathname === '/ai'} />
          </>
        )}
        {activeMainTab === 'preferences' && (
          <>
            <SubNavTab label="Appearance & Theme" path="/settings?tab=appearance" active={location.search.includes('tab=appearance') || location.search === ''} />
            <SubNavTab label="User Profile" path="/settings?tab=profile" active={location.search.includes('tab=profile')} />
            <SubNavTab label="Security & Access" path="/settings?tab=security" active={location.search.includes('tab=security')} />
            <SubNavTab label="Notifications" path="/settings?tab=notifications" active={location.search.includes('tab=notifications')} />
            <SubNavTab label="AI Model Engine" path="/settings?tab=ai-engine" active={location.search.includes('tab=ai-engine')} />
          </>
        )}
      </div>

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
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/ai" element={
              <div className="p-8 h-[calc(100vh-8rem)]">
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
      <div className="fixed bottom-4 right-4 sm:fixed sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isAiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
              className="mb-4 shadow-cardGlow rounded-2xl overflow-hidden flex flex-col glass-card border border-white/10 ring-1 ring-cyan/30 w-[calc(100vw-2rem)] sm:w-[420px] h-[70vh] sm:h-[650px]"
            >
              <ChatBot onClose={() => setIsAiOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="trio-aurora-btn flex items-center gap-3 px-6 py-4 rounded-full transition-all hover:scale-105 hover:brightness-105 relative group overflow-hidden shadow-lg"
        >
          <div className="absolute inset-0 bg-white/25 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
          <Bot size={24} className="relative z-10 text-[#2d1f3d]" />
          <span className="font-display font-bold text-lg relative z-10 text-[#2d1f3d]">Trio</span>
        </button>
      </div>
    </div>
  );
}
