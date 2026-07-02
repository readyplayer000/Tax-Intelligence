import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { DEMO_ENTRIES, DEMO_SUMMARY, getDemoEntries, getDemoSummary, saveDemoEntries, updateDemoEntry, deleteDemoEntry, addDemoEntry } from '../lib/demoData';
import { Wallet, PiggyBank, Receipt, Sparkles, ScanLine, Activity, CheckCircle, AlertCircle, Pencil, Trash2, Camera, Upload, X, RefreshCw, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface SummaryData {
  income: number;
  expense: number;
  investment: number;
  deduction: number;
}

const fetchSummary = async (isDemo: boolean) => {
  if (isDemo) return getDemoSummary();
  const { data } = await api.get('/api/entries/summary');
  return data;
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [selectedFY, setSelectedFY] = useState('2024-25');
  const [demoNotice, setDemoNotice] = useState(false);
  const [isLight, setIsLight] = useState(() => document.documentElement.getAttribute('data-theme') === 'illuminate');

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute('data-theme') === 'illuminate');
  }, []);

  const storedUser = JSON.parse(localStorage.getItem('taxai-user') || '{}');
  const isDemo = storedUser?.id === 'demo';

  // Camera & Document Scanner States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async (mode: 'user' | 'environment' = 'environment') => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      const constraints = {
        video: { facingMode: mode }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access failed, fallback to file upload:', err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(dataUrl);
        stopCamera();
        triggerMockAnalysis();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedPhoto(event.target.result as string);
          stopCamera();
          triggerMockAnalysis();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerMockAnalysis = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      // Generate some nice realistic mock parsed data
      const mockAmount = Math.floor(Math.random() * 3500) + 250;
      setScanResult({
        description: 'Office Stationery and Printing Supplies Invoice',
        amount: mockAmount,
        category: 'EXPENSE',
        subCategory: 'Supplies',
        date: new Date().toISOString().split('T')[0],
        mode: 'BANK',
        note: 'Scanned from Receipt via Smart Document Scanner'
      });
    }, 2500);
  };

  const addMutation = useMutation({
    mutationFn: async (newEntry: any) => {
      if (isDemo) {
        addDemoEntry({
          ...newEntry,
          userId: 'demo',
          status: 'ACTIVE',
          tags: []
        });
        setDemoNotice(true);
        setTimeout(() => setDemoNotice(false), 2500);
        return;
      }
      await api.post('/api/entries', newEntry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary', isDemo],
    queryFn: () => fetchSummary(isDemo),
    refetchInterval: isDemo ? false : 5000,
  });

  const { data: entries = [] } = useQuery({
    queryKey: ['entries', isDemo],
    queryFn: async () => {
      if (isDemo) return getDemoEntries();
      const { data } = await api.get('/api/entries');
      return data;
    },
    refetchInterval: isDemo ? false : 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) {
        deleteDemoEntry(id);
        setDemoNotice(true);
        setTimeout(() => setDemoNotice(false), 2500);
        return;
      }
      await api.delete(`/api/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (entry: any) => {
      if (isDemo) {
        updateDemoEntry(entry.id, {
          status: entry.status === 'EXCLUDED' ? 'ACTIVE' : 'EXCLUDED'
        });
        setDemoNotice(true);
        setTimeout(() => setDemoNotice(false), 2500);
        return;
      }
      await api.put(`/api/entries/${entry.id}`, {
        ...entry,
        status: entry.status === 'EXCLUDED' ? 'ACTIVE' : 'EXCLUDED'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });

  const quickSaveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isDemo) {
        updateDemoEntry(data.id, data);
        setDemoNotice(true);
        setTimeout(() => setDemoNotice(false), 2500);
        return;
      }
      await api.put(`/api/entries/${data.id}`, data);
    },
    onSuccess: () => {
      setQuickEditId(null);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });

  const handleQuickEdit = (entry: any) => {
    setQuickEditId(entry.id);
    setEditData(entry);
  };

  const handleQuickSave = () => {
    if (editData) {
      quickSaveMutation.mutate(editData);
    }
  };

  const toggleAll = async () => {
    if (isDemo) {
      const currentEntries = getDemoEntries();
      const allExcluded = currentEntries.every((e: any) => e.status === 'EXCLUDED');
      const newStatus = allExcluded ? 'ACTIVE' : 'EXCLUDED';
      const updated = currentEntries.map((e: any) => ({ ...e, status: newStatus }));
      saveDemoEntries(updated);
      setDemoNotice(true);
      setTimeout(() => setDemoNotice(false), 2500);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      return;
    }
    const allExcluded = entries.every((e: any) => e.status === 'EXCLUDED');
    const newStatus = allExcluded ? 'ACTIVE' : 'EXCLUDED';
    try {
      await Promise.all(entries.map((e: any) => 
        api.put(`/api/entries/${e.id}`, { ...e, status: newStatus })
      ));
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    } catch (err) {
      console.error('Toggle all failed:', err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    { label: 'Total Income', value: summary?.income ?? 0, color: 'text-electricTeal', bg: 'bg-electricTeal/10', icon: Wallet },
    { label: 'Investments (80C)', value: summary?.investment ?? 0, color: 'text-indigo', bg: 'bg-indigo/10', icon: PiggyBank },
    { label: 'Total Deductions', value: summary?.deduction ?? 0, color: 'text-metallicGold', bg: 'bg-metallicGold/10', icon: Receipt },
  ];

  const chartData = (() => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const data = months.map(name => ({ name, income: 0, expense: 0 }));
    
    entries.forEach((entry: any) => {
      if (entry.financialYear === selectedFY && entry.status !== 'EXCLUDED') {
        const date = new Date(entry.date);
        const monthIndex = date.getMonth(); 
        const mappedIndex = monthIndex >= 3 ? monthIndex - 3 : monthIndex + 9;
        
        if (entry.category === 'INCOME') {
          data[mappedIndex].income += entry.amount;
        } else if (entry.category === 'EXPENSE') {
          data[mappedIndex].expense += entry.amount;
        }
      }
    });
    return data;
  })();

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--heading-from)] to-[var(--heading-to)]">Reinventing Tax Intelligence with AI</h1>
          <p className="text-slate-400">Real-time financial tracking and AI-powered tax optimization.</p>
        </div>
        <button 
          onClick={() => {
            setIsScannerOpen(true);
            setCapturedPhoto(null);
            setScanResult(null);
            setIsScanning(false);
            startCamera(facingMode);
          }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-full transition-all glow-hover text-sm font-medium shrink-0"
        >
          <ScanLine size={18} />
          Smart Document Scanner
        </button>
      </header>

      {/* Demo mode banner */}
      {isDemo && (
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl border text-sm"
          style={{ background: 'linear-gradient(135deg, rgba(249,178,215,0.2), rgba(207,236,243,0.2))', borderColor: 'var(--glass-border)', color: 'var(--foreground)' }}>
          <span>🎭 <strong>Demo Mode</strong> — You're viewing sample data. Sign up to track your own finances.</span>
          {demoNotice && <span className="text-xs font-semibold opacity-70 animate-pulse">✨ Saved locally (Demo Mode)</span>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 relative overflow-hidden group glow-hover"
          >
            <div className={twMerge("absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rounded-full", card.bg)}>
              <card.icon size={100} className={card.color} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{card.label}</p>
                <p className={twMerge("text-4xl font-display font-bold tracking-tight", card.color)}>
                  {isLoading ? '...' : formatCurrency(card.value)}
                </p>
              </div>
              <div className={twMerge("w-12 h-12 rounded-2xl flex items-center justify-center", card.bg, card.color)}>
                <card.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-card p-6 flex flex-col"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-display font-bold">Smart Analytics</h2>
              <div className="relative">
                <select 
                  value={selectedFY} 
                  onChange={(e) => setSelectedFY(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest outline-none cursor-pointer hover:bg-emerald-500/20 transition-colors"
                >
                  <option value="2023-24" className="bg-[var(--header-bg)] text-[var(--foreground)]">FY 2023-24</option>
                  <option value="2024-25" className="bg-[var(--header-bg)] text-[var(--foreground)]">FY 2024-25</option>
                  <option value="2025-26" className="bg-[var(--header-bg)] text-[var(--foreground)]">FY 2025-26 • Active</option>
                  <option value="2026-27" className="bg-[var(--header-bg)] text-[var(--foreground)]">FY 2026-27</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-cyan"></div> Income</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-indigo"></div> Expense</span>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={isLight ? "#6B7280" : "#475569"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isLight ? "#6B7280" : "#475569"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} domain={['dataMin - 5000', 'auto']} />
                <Tooltip contentStyle={isLight ? { backgroundColor: '#FFFDF4', border: '1px solid rgba(141,110,99,0.2)', borderRadius: '8px', color: '#1C1917' } : { backgroundColor: 'rgba(11,16,32,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC' }} />
                <Area type="monotone" dataKey="income" stroke="#00D9FF" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 ring-1 ring-cyan/30 bg-cyan/5 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan/20 blur-2xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan/20 rounded-lg text-cyan">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-display font-bold">AI Auto Suggestions</h2>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 glow-hover">
                <p className="text-sm font-medium text-white mb-1">Tax Savings Alert</p>
                <p className="text-xs text-slate-400 leading-relaxed">Based on your expenses, investing an additional ₹50,000 in ELSS can reduce your tax liability by ₹15,000 this quarter.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-metallicGold" />
              AI Financial Health Meter
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Tax Efficiency Score</span>
                  <span className="text-electricTeal font-bold">85%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo to-electricTeal w-[85%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Compliance Score</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-full rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Activity size={24} className="text-metallicGold" />
            Recent Ledger
          </h2>
          <button 
            onClick={toggleAll}
            className="text-[10px] font-bold text-metallicGold uppercase tracking-widest border border-metallicGold/30 px-3 py-1.5 rounded-full hover:bg-metallicGold/10 transition-all"
          >
            Toggle All Impact
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
          {entries.slice().reverse().slice(0, 4).map((entry: any) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "glass-card p-5 flex flex-col relative group overflow-hidden border-white/5 transition-all duration-500",
                entry.status === 'EXCLUDED' ? "opacity-50 grayscale" : "hover:border-metallicGold/20"
              )}
            >
              <div className={clsx(
                "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity",
                entry.status === 'EXCLUDED' ? "from-slate-500 to-slate-700" : "from-metallicGold to-indigo"
              )}></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  {quickEditId === entry.id ? (
                    <input 
                      type="text"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="bg-black/40 border border-metallicGold/30 rounded px-2 py-1 text-sm text-white w-full outline-none"
                    />
                  ) : (
                    <p className="font-display font-bold text-sm text-white truncate">{entry.description || entry.subCategory}</p>
                  )}
                  <button 
                    onClick={() => toggleMutation.mutate(entry)}
                    className={clsx(
                      "p-1 rounded-md transition-all shrink-0 ml-2",
                      entry.status === 'EXCLUDED' ? "bg-slate-800 text-slate-500" : "bg-emerald-500/20 text-emerald-400"
                    )}
                  >
                    <Sparkles size={12} />
                  </button>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                      {entry.category} {entry.status === 'EXCLUDED' && '[Hidden]'}
                    </p>
                    {quickEditId === entry.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-metallicGold text-sm">₹</span>
                        <input 
                          type="number"
                          value={editData.amount}
                          onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                          className="bg-black/40 border border-metallicGold/30 rounded px-2 py-1 text-lg font-display font-bold text-metallicGold w-24 outline-none"
                        />
                      </div>
                    ) : (
                      <p className="text-lg font-display font-bold text-metallicGold">₹{entry.amount.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {quickEditId === entry.id ? (
                      <>
                        <button onClick={handleQuickSave} className="px-3 py-1 bg-emerald-500 text-black rounded-lg text-[10px] font-bold uppercase hover:scale-105 transition-all">Save</button>
                        <button onClick={() => setQuickEditId(null)} className="px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-white/20 transition-all">X</button>
                      </>
                    ) : (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleQuickEdit(entry)} className="p-2 rounded-lg bg-white/5 hover:bg-metallicGold/20 text-slate-400 hover:text-metallicGold transition-all"><Pencil size={14} /></button>
                        <button onClick={() => deleteMutation.mutate(entry.id)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smart Document Scanner Modal */}
      <AnimatePresence>
        {isScannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { stopCamera(); setIsScannerOpen(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl glass-card overflow-hidden border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
              style={{ background: 'linear-gradient(135deg, rgba(22, 28, 45, 0.9), rgba(10, 14, 23, 0.95))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-metallicGold/10 text-metallicGold animate-pulse">
                    <ScanLine size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Smart Document Scanner</h3>
                    <p className="text-xs text-slate-400">Capture or upload invoice to automatically parse fields</p>
                  </div>
                </div>
                <button 
                  onClick={() => { stopCamera(); setIsScannerOpen(false); }}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!capturedPhoto ? (
                  /* Live Camera Feed View */
                  <div className="relative w-full aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center justify-center group">
                    {cameraStream ? (
                      <>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay frame lines */}
                        <div className="absolute inset-8 border-2 border-dashed border-metallicGold/30 pointer-events-none rounded-xl flex items-center justify-center">
                          <p className="text-[10px] text-metallicGold/50 uppercase tracking-widest font-bold">Align receipt here</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                          <Camera size={28} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Camera Access Required</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-xs">Please allow camera permissions or upload an image file from your device instead.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Snapshot and Scan State */
                  <div className="relative w-full aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                    <img 
                      src={capturedPhoto} 
                      alt="Captured Receipt" 
                      className="w-full h-full object-cover"
                    />
                    
                    {isScanning && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center">
                        {/* Scanning Laser Line */}
                        <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_rgba(52,211,153,1)] scanner-laser top-0" />
                        <div className="px-4 py-2 rounded-full bg-black/80 border border-emerald-500/20 backdrop-blur-md text-emerald-400 text-xs font-mono tracking-widest uppercase animate-pulse flex items-center gap-2">
                          <RefreshCw size={12} className="animate-spin" />
                          AI Parsing Receipt...
                        </div>
                      </div>
                    )}

                    {!isScanning && scanResult && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                        <Check size={14} /> Scan Completed
                      </div>
                    )}
                  </div>
                )}

                {/* Shutter & File Fallback controls */}
                {!capturedPhoto && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <button
                      onClick={() => {
                        const newMode = facingMode === 'environment' ? 'user' : 'environment';
                        setFacingMode(newMode);
                        startCamera(newMode);
                      }}
                      className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw size={14} />
                      Switch Camera ({facingMode})
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <Upload size={14} />
                        Upload File
                      </button>

                      {cameraStream && (
                        <button
                          onClick={capturePhoto}
                          className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-metallicGold text-black hover:scale-105 transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        >
                          <Camera size={15} />
                          Capture Photo
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* File Input Fallback */}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden"
                />

                {/* Extracted Fields Form */}
                {scanResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                  >
                    <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Extracted Transaction Details</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Description</label>
                        <input 
                          type="text" 
                          value={scanResult.description} 
                          onChange={(e) => setScanResult({ ...scanResult, description: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-metallicGold/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Amount (INR)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-metallicGold text-sm">₹</span>
                          <input 
                            type="number" 
                            value={scanResult.amount} 
                            onChange={(e) => setScanResult({ ...scanResult, amount: Number(e.target.value) })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-sm text-metallicGold font-bold outline-none focus:border-metallicGold/30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Category</label>
                        <select 
                          value={scanResult.category} 
                          onChange={(e) => setScanResult({ ...scanResult, category: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-metallicGold/30"
                        >
                          <option value="INCOME" className="bg-[var(--header-bg)] text-[var(--foreground)]">Income</option>
                          <option value="EXPENSE" className="bg-[var(--header-bg)] text-[var(--foreground)]">Expense</option>
                          <option value="INVESTMENT" className="bg-[var(--header-bg)] text-[var(--foreground)]">Investment</option>
                          <option value="DEDUCTION" className="bg-[var(--header-bg)] text-[var(--foreground)]">Deduction</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Subcategory</label>
                        <input 
                          type="text" 
                          value={scanResult.subCategory} 
                          onChange={(e) => setScanResult({ ...scanResult, subCategory: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-metallicGold/30"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        onClick={() => { setCapturedPhoto(null); setScanResult(null); startCamera(facingMode); }}
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} /> Retake
                      </button>
                      <button 
                        onClick={() => {
                          addMutation.mutate({
                            ...scanResult,
                            financialYear: '2024-25',
                            status: 'ACTIVE'
                          });
                          setIsScannerOpen(false);
                          stopCamera();
                          alert('Transaction successfully saved from scanned receipt!');
                        }}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-xl transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      >
                        Save to Transactions
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Canvas for snap capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
