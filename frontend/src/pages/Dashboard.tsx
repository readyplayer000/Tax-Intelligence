import { useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Wallet, PiggyBank, Receipt, Sparkles, ScanLine, Activity, CheckCircle, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface SummaryData {
  income: number;
  expense: number;
  investment: number;
  deduction: number;
}

const fetchSummary = async (): Promise<SummaryData> => {
  const { data } = await axios.get('http://localhost:4000/api/entries/summary');
  return data;
};

const monthlyData = [
  { name: 'Apr', income: 150000, expense: 40000 },
  { name: 'May', income: 150000, expense: 45000 },
  { name: 'Jun', income: 150000, expense: 35000 },
  { name: 'Jul', income: 180000, expense: 50000 },
  { name: 'Aug', income: 150000, expense: 40000 },
  { name: 'Sep', income: 150000, expense: 60000 },
];

export default function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
    refetchInterval: 5000,
  });

  const { data: entries = [] } = useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:4000/api/entries?userId=user_123');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`http://localhost:4000/api/entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (entry: any) => 
      axios.put(`http://localhost:4000/api/entries/${entry.id}`, {
        ...entry,
        status: entry.status === 'EXCLUDED' ? 'ACTIVE' : 'EXCLUDED'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });

  const quickSaveMutation = useMutation({
    mutationFn: (data: any) => axios.put(`http://localhost:4000/api/entries/${data.id}`, data),
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
    const allExcluded = entries.every((e: any) => e.status === 'EXCLUDED');
    const newStatus = allExcluded ? 'ACTIVE' : 'EXCLUDED';
    try {
      await Promise.all(entries.map((e: any) => 
        axios.put(`http://localhost:4000/api/entries/${e.id}`, { ...e, status: newStatus })
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

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Reinventing Tax Intelligence with AI</h1>
          <p className="text-slate-400">Real-time financial tracking and AI-powered tax optimization.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-full transition-all glow-hover text-sm font-medium">
          <ScanLine size={18} />
          Smart Document Scanner
        </button>
      </header>

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold">Smart Analytics</h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-cyan"></div> Income</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-indigo"></div> Expense</span>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
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
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(11,16,32,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
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
    </div>
  );
}
