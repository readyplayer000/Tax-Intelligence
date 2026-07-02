import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Shield, User, Bell, Cpu, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const themes = [
  {
    id: 'illuminate',
    name: 'Illuminate',
    description: 'Gorgeous warm cream background with soft organic green and golden-yellow accents.',
    colors: ['#FFE8CD', '#F9B2D7', '#CFECF3'],
    bg: '#FFF9E8',
  },
  {
    id: 'cyber-gold',
    name: 'Cyber Gold',
    description: 'Accents of metallic gold, cyan, and glowing violet on space blue.',
    colors: ['#D4AF37', '#00E5FF', '#8B5CF6'],
    bg: '#0A0E17',
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    description: 'Vibrant neon purple, deep violet, and electric blue.',
    colors: ['#A855F7', '#D946EF', '#3B82F6'],
    bg: '#070412',
  },
  {
    id: 'glacier-frost',
    name: 'Glacier Frost',
    description: 'Sleek polar theme with arctic ice blue, cyan, and deep glacier.',
    colors: ['#38BDF8', '#06B6D4', '#1E3A8A'],
    bg: '#030a14',
  },
];

export default function Settings() {
  const [activeTheme, setActiveTheme] = useState('illuminate');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  // Find active tab from URL query param, default to 'appearance'
  const activeTab = searchParams.get('tab') || 'appearance';

  useEffect(() => {
    const savedTheme = localStorage.getItem('taxai-theme') || 'illuminate';
    setActiveTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('taxai-theme', themeId);
    
    // Briefly display save success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1000px] mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-display font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--heading-from)] to-[var(--heading-to)]">
          Settings & Configuration
        </h1>
        <p className="text-slate-400">Customize your AI-powered financial environment and workspaces.</p>
      </header>

      <div className="w-full space-y-6">
        {/* Theme Selector Section */}
        {(activeTab === 'appearance' || activeTab === 'basics') && (
          <div className="glass-card p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-metallicGold/5 blur-3xl -z-10 rounded-full" />
            
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-2 mb-1">
                <Palette className="text-metallicGold" />
                <span>Workspace Themes</span>
              </h2>
              <p className="text-sm text-slate-400">Select a premium color palette for your entire dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => {
                const isActive = activeTheme === theme.id;
                return (
                  <motion.div
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                      isActive
                        ? 'border-metallicGold bg-white/10 ring-1 ring-metallicGold/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-display font-bold text-white text-lg">{theme.name}</span>
                      <div className="flex gap-1.5 p-1 rounded-lg bg-black/40 border border-white/5">
                        {theme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border border-black/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{theme.description}</p>
                    <div 
                      className="w-full h-8 rounded-lg overflow-hidden flex"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <div className="w-[30%] h-full opacity-10 border-r border-white/5" style={{ backgroundColor: theme.colors[0] }} />
                      <div className="flex-1 h-full p-2 flex flex-col gap-1 justify-center">
                        <div className="w-12 h-1 rounded-full opacity-60" style={{ backgroundColor: theme.colors[0] }} />
                        <div className="w-8 h-1 rounded-full opacity-30" style={{ backgroundColor: theme.colors[1] }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Notification alert */}
            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl text-sm"
              >
                <CheckCircle size={16} />
                <span>Theme updated and calibrated successfully.</span>
              </motion.div>
            )}
          </div>
        )}

        {/* Profile Mock Section */}
        {activeTab === 'profile' && (
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <User className="text-metallicGold" />
              <span>Workspace Profile</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">User Role</label>
                <input 
                  type="text" 
                  disabled 
                  value="Lead Tax Consultant / Auditor" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Workspace Access ID</label>
                <input 
                  type="text" 
                  disabled 
                  value="ALPHA-9981-SECURE" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Mock Section */}
        {activeTab === 'security' && (
          <div className="glass-card p-8 space-y-6 relative overflow-hidden">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-2 mb-1">
                <Shield className="text-metallicGold" />
                <span>Security & Access Control</span>
              </h2>
              <p className="text-sm text-slate-400">Manage credentials, session tokens, and multifactor auditing authorizations.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="font-semibold text-sm">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-slate-400">Require automated code approval for high-value tax filing submissions.</p>
                </div>
                <button className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all">
                  Enabled
                </button>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="font-semibold text-sm">Consulting Access Key (API Token)</p>
                  <p className="text-xs text-slate-400">Generate encrypted security tokens to sync with corporate ERP databases.</p>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-xs font-bold transition-all">
                  Create API Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Mock Section */}
        {activeTab === 'notifications' && (
          <div className="glass-card p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-2 mb-1">
                <Bell className="text-metallicGold" />
                <span>Notification Parameters</span>
              </h2>
              <p className="text-sm text-slate-400">Set thresholds for tax liability warnings and financial deadline alerts.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">GSTR Filing Reminders</p>
                  <p className="text-xs text-slate-400">Trigger warnings 7 days prior to GSTR-1 and GSTR-3B filings.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-metallicGold bg-white/5 border-white/10 rounded focus:ring-metallicGold" />
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div>
                  <p className="font-semibold text-sm">Auditing Discrepancy Alerts</p>
                  <p className="text-xs text-slate-400">Send an immediate priority trigger when Trio detects a tax deduction anomaly.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-metallicGold bg-white/5 border-white/10 rounded focus:ring-metallicGold" />
              </div>
            </div>
          </div>
        )}

        {/* AI Engine Calibration Section */}
        {activeTab === 'ai-engine' && (
          <div className="glass-card p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-2 mb-1">
                <Cpu className="text-metallicGold" />
                <span>Neural Tax Engine Calibration</span>
              </h2>
              <p className="text-sm text-slate-400">Tune the intelligence and compliance algorithms of the Trio AI advisor.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Model Temperature (Creativity vs. Auditing Strictness)</span>
                  <span className="font-mono text-metallicGold font-bold">0.15 (High Compliance / Auditing Safe)</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" defaultValue="0.15" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-metallicGold" />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Regulatory Reference Context Protocol</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none">
                  <option>Standard Auditing Standard (V2.5-C)</option>
                  <option>Strict Optimization Model (Aggressive Deductions)</option>
                  <option>Regulatory Compliance Only (Audit-Safe)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
