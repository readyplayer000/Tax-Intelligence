import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entrySchema, type TaxEntryInput } from 'shared';
import { motion } from 'framer-motion';
import { Plus, Receipt, Landmark, Wallet, HelpCircle, Sparkles, Pencil, Trash2, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CATEGORIES = [
  { id: 'INCOME', label: 'Income', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'EXPENSE', label: 'Expense', icon: Receipt, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'INVESTMENT', label: 'Investment', icon: Landmark, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'DEDUCTION', label: 'Deduction', icon: HelpCircle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
] as const;

const SUB_CATEGORIES: Record<typeof CATEGORIES[number]['id'], string[]> = {
  INCOME: ['Salary', 'Freelance', 'Rental Income', 'Interest', 'Dividends', 'Business'],
  EXPENSE: ['Rent', 'Groceries', 'Travel', 'Healthcare', 'Education', 'Utility Bills'],
  INVESTMENT: ['ELSS (80C)', 'PPF (80C)', 'NPS (80CCD)', 'LIC (80C)', 'Fixed Deposit (5yr)', 'Mutual Funds'],
  DEDUCTION: ['Health Insurance (80D)', 'Home Loan Interest (24b)', 'Education Loan (80E)', 'Standard Deduction', 'Charity (80G)'],
};

export default function DataEntry() {
  const [activeTab, setActiveTab] = useState<typeof CATEGORIES[number]['id']>('INCOME');
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<TaxEntryInput>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      category: 'INCOME',
      financialYear: '2024-25',
      date: new Date().toISOString().split('T')[0],
      mode: 'CASH',
      tags: [],
      subCategory: '',
      note: ''
    }
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

  const onSubmit = async (data: TaxEntryInput) => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:4000/api/entries/${editingId}`, data);
      } else {
        await axios.post('http://localhost:4000/api/entries', data);
      }
      
      setSuccess(true);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      
      reset({
        category: activeTab,
        financialYear: '2024-25',
        date: new Date().toISOString().split('T')[0],
        mode: 'CASH',
        tags: [],
        subCategory: '',
        description: '',
        amount: 0,
        note: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  const handleEdit = (entry: any) => {
    setEditingId(entry.id);
    setActiveTab(entry.category);
    reset({
      category: entry.category,
      subCategory: entry.subCategory,
      description: entry.description,
      amount: entry.amount,
      date: entry.date.split('T')[0],
      financialYear: entry.financialYear,
      mode: entry.mode,
      note: entry.note || '',
      tags: entry.tags || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadSampleData = async () => {
    const samples = [
      { category: 'INCOME', subCategory: 'Salary', description: 'Monthly Salary', amount: 150000, date: '2024-11-01', financialYear: '2024-25', mode: 'BANK', note: 'Primary income source' },
      { category: 'EXPENSE', subCategory: 'Rent', description: 'Monthly House Rent', amount: 35000, date: '2024-11-05', financialYear: '2024-25', mode: 'BANK', note: 'HRA claimable' },
      { category: 'INVESTMENT', subCategory: 'ELSS', description: 'Mutual Fund Investment', amount: 50000, date: '2024-11-10', financialYear: '2024-25', mode: 'BANK', note: 'Under Section 80C' },
      { category: 'DEDUCTION', subCategory: '80D', description: 'Health Insurance Premium', amount: 25000, date: '2024-11-12', financialYear: '2024-25', mode: 'BANK', note: 'Self & Spouse' },
      { category: 'INCOME', subCategory: 'Freelance', description: 'Consulting Project', amount: 45000, date: '2024-11-15', financialYear: '2024-25', mode: 'BANK', note: 'Secondary income' },
    ];

    try {
      for (const sample of samples) {
        await axios.post('http://localhost:4000/api/entries', sample);
      }
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      alert('Sample dataset loaded successfully! Head over to the Analytics for analysis.');
    } catch (error) {
      console.error('Failed to load sample data:', error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Transactions</h1>
          <p className="text-slate-400">Record and manage your financial activities securely.</p>
        </div>
        <div className="flex gap-4">
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                reset();
              }}
              className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-full text-sm font-medium text-rose-400 hover:bg-rose-500/20 transition-all flex items-center gap-2"
            >
              Cancel Edit
            </button>
          )}
          <button
            onClick={loadSampleData}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 glow-hover"
          >
            <Sparkles size={16} className="text-metallicGold" />
            Load Sample Data
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.id);
              if (!editingId) {
                reset({
                  category: cat.id,
                  description: '',
                  amount: 0,
                  date: new Date().toISOString().split('T')[0],
                  financialYear: '2024-25',
                  mode: 'CASH',
                  tags: [],
                  subCategory: '',
                  note: ''
                });
              }
            }}
            className={clsx(
              "p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 border glass-card",
              activeTab === cat.id
                ? "bg-white/10 border-metallicGold ring-1 ring-metallicGold/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                : "bg-transparent border-white/10 hover:border-white/30"
            )}
          >
            <div className={clsx("p-3 rounded-xl", cat.bg, cat.color)}>
              <cat.icon size={24} />
            </div>
            <span className={clsx("font-display font-bold tracking-wide", activeTab === cat.id ? "text-white" : "text-slate-400")}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Category / Sub-Category</label>
              <input
                {...register('subCategory')}
                placeholder="e.g. Salary, Groceries, Rent"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-metallicGold/50 focus:ring-1 focus:ring-metallicGold/50 transition-all"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {SUB_CATEGORIES[activeTab].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setValue('subCategory', sub)}
                    className="px-3 py-1.5 text-[11px] font-medium bg-white/5 hover:bg-metallicGold/20 hover:text-metallicGold border border-white/10 hover:border-metallicGold/50 rounded-full transition-all text-slate-400"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Description</label>
              <input
                {...register('description')}
                placeholder="e.g. November Salary from ABC Corp"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-metallicGold/50 focus:ring-1 focus:ring-metallicGold/50 transition-all"
              />
              {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Amount (₹)</label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                placeholder="0.00"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-metallicGold/50 focus:ring-1 focus:ring-metallicGold/50 transition-all"
              />
              {errors.amount && <p className="text-rose-400 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Date</label>
              <input
                {...register('date')}
                type="date"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-metallicGold/50 focus:ring-1 focus:ring-metallicGold/50 transition-all [color-scheme:dark]"
              />
              {errors.date && <p className="text-rose-400 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Financial Year</label>
              <select
                {...register('financialYear')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-metallicGold/50 focus:ring-1 focus:ring-metallicGold/50 transition-all appearance-none"
              >
                <option value="2024-25" className="bg-slate-900">FY 2024-25</option>
                <option value="2023-24" className="bg-slate-900">FY 2023-24</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Payment Mode</label>
              <select
                {...register('mode')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-metallicGold/50 focus:ring-1 focus:ring-metallicGold/50 transition-all appearance-none"
              >
                <option value="CASH" className="bg-slate-900">Cash</option>
                <option value="BANK" className="bg-slate-900">Bank Transfer</option>
                <option value="CREDIT_CARD" className="bg-slate-900">Credit Card</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-metallicGold to-yellow-600 text-black font-bold py-4 rounded-xl shadow-glow hover:scale-[1.01] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin relative z-10" />
            ) : success ? (
              <span className="flex items-center gap-2 relative z-10">Record Updated Securely!</span>
            ) : (
              <span className="flex items-center gap-2 relative z-10">
                <Plus size={20} />
                {editingId ? 'Update Record' : `Save ${activeTab.toLowerCase()} record`}
              </span>
            )}
          </button>
        </form>
      </motion.div>

      {/* Elegant Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Activity size={24} className="text-metallicGold" />
            Recent Ledger
          </h2>
          <button 
            onClick={toggleAll}
            className="text-xs font-bold text-metallicGold uppercase tracking-widest border border-metallicGold/30 px-4 py-2 rounded-full hover:bg-metallicGold/10 transition-all"
          >
            Toggle All Impact
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.slice().reverse().slice(0, 6).map((entry: any) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "glass-card p-6 flex flex-col relative group overflow-hidden transition-all duration-500",
                editingId === entry.id ? "ring-2 ring-metallicGold border-metallicGold/50 bg-metallicGold/5 scale-[1.02]" : "border-white/5 hover:border-metallicGold/20",
                entry.status === 'EXCLUDED' && "opacity-60 grayscale-[0.5]"
              )}
            >
              <div className={clsx(
                "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity",
                entry.status === 'EXCLUDED' ? "from-slate-500 to-slate-700" : "from-metallicGold to-indigo"
              )}></div>
              
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-slate-500 font-mono tracking-widest">━━━━━━━━━━━━━━━━━━━━</div>
                <button 
                  onClick={() => toggleMutation.mutate(entry)}
                  title={entry.status === 'EXCLUDED' ? "Include in Dashboard" : "Exclude from Dashboard"}
                  className={clsx(
                    "p-1.5 rounded-md transition-all",
                    entry.status === 'EXCLUDED' ? "bg-slate-800 text-slate-400" : "bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                  )}
                >
                  <Sparkles size={14} />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2 mb-1">
                  {quickEditId === entry.id ? (
                    <input 
                      type="text"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="bg-black/40 border border-metallicGold/30 rounded px-2 py-1 text-sm text-white w-full outline-none"
                    />
                  ) : (
                    <p className="font-display font-bold text-lg text-white truncate">{entry.description || entry.subCategory}</p>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                  Invoice #{entry.id.substring(0,6).toUpperCase()}
                  {entry.status === 'EXCLUDED' && <span className="text-[10px] text-rose-400 font-bold uppercase tracking-tighter">[Excluded]</span>}
                </p>
                
                <div className="space-y-1 mb-4">
                  <p className="flex justify-between items-center">
                    <span className="text-slate-400">Amount:</span>
                    {quickEditId === entry.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-metallicGold text-xs">₹</span>
                        <input 
                          type="number"
                          value={editData.amount}
                          onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                          className="bg-black/40 border border-metallicGold/30 rounded px-2 py-0.5 text-sm font-bold text-metallicGold w-20 outline-none text-right"
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-metallicGold">₹{entry.amount.toLocaleString('en-IN')}</span>
                    )}
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-white text-xs uppercase font-bold tracking-widest">{entry.category}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white">{new Date(entry.date).toLocaleDateString('en-IN')}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono tracking-widest mb-4">━━━━━━━━━━━━━━━━━━━━</div>

              <div className="flex gap-3">
                {quickEditId === entry.id ? (
                  <>
                    <button 
                      onClick={handleQuickSave}
                      className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-black text-sm font-bold transition-all hover:scale-105"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setQuickEditId(null)}
                      className="flex-1 py-2.5 rounded-lg bg-white/10 text-white text-sm font-bold transition-all hover:bg-white/20"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleQuickEdit(entry)}
                      className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-electricTeal hover:to-cyan text-slate-300 hover:text-black text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    >
                      <Pencil size={14} /> Modify
                    </button>
                    <button 
                      onClick={() => deleteMutation.mutate(entry.id)}
                      className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-600 text-slate-300 hover:text-white text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {entries.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 font-display">
              No transactions found. Initialize your ledger above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

