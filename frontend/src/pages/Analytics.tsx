import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap, Sliders, Info, Check } from 'lucide-react';

const expenseData = [
  { name: 'Rent', value: 35000 },
  { name: 'Groceries', value: 12000 },
  { name: 'Lifestyle', value: 15000 },
  { name: 'Investment', value: 50000 },
  { name: 'Insurance', value: 8000 },
];

const monthlyComparison = [
  { month: 'Apr', income: 150000, tax: 15000 },
  { month: 'May', income: 150000, tax: 14000 },
  { month: 'Jun', income: 165000, tax: 18000 },
  { month: 'Jul', income: 150000, tax: 15000 },
  { month: 'Aug', income: 180000, tax: 22000 },
  { month: 'Sep', income: 150000, tax: 15000 },
];

export default function Analytics() {
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(() => document.documentElement.getAttribute('data-theme') === 'illuminate');

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute('data-theme') === 'illuminate');
  }, []);

  // Simulator States
  const [simIncome, setSimIncome] = useState(1200000);
  const [sim80C, setSim80C] = useState(150000);
  const [has80D, setHas80D] = useState(true);
  const [hasHRA, setHasHRA] = useState(false);

  const calculateTaxes = (income: number, c80: number, d80: number, hra: number) => {
    const stdOld = 50000;
    const stdNew = 75000;

    // New Regime
    const taxableNew = Math.max(0, income - stdNew);
    let taxNew = 0;
    if (taxableNew > 300000) {
      let temp = taxableNew - 300000;
      // 3L - 6L (5%)
      const s1 = Math.min(temp, 300000);
      taxNew += s1 * 0.05;
      temp -= s1;
      if (temp > 0) {
        // 6L - 9L (10%)
        const s2 = Math.min(temp, 300000);
        taxNew += s2 * 0.10;
        temp -= s2;
      }
      if (temp > 0) {
        // 9L - 12L (15%)
        const s3 = Math.min(temp, 300000);
        taxNew += s3 * 0.15;
        temp -= s3;
      }
      if (temp > 0) {
        // 12L - 15L (20%)
        const s4 = Math.min(temp, 300000);
        taxNew += s4 * 0.20;
        temp -= s4;
      }
      if (temp > 0) {
        // > 15L (30%)
        taxNew += temp * 0.30;
      }
    }
    // Rebate under 87A (New Regime tax is 0 if taxable income <= 7L)
    if (taxableNew <= 700000) {
      taxNew = 0;
    }
    const totalTaxNew = taxNew * 1.04;

    // Old Regime
    const deductionsOld = c80 + d80 + hra;
    const taxableOld = Math.max(0, income - stdOld - deductionsOld);
    let taxOld = 0;
    if (taxableOld > 250000) {
      let temp = taxableOld - 250000;
      // 2.5L - 5L (5%)
      const s1 = Math.min(temp, 250000);
      taxOld += s1 * 0.05;
      temp -= s1;
      if (temp > 0) {
        // 5L - 10L (20%)
        const s2 = Math.min(temp, 500000);
        taxOld += s2 * 0.20;
        temp -= s2;
      }
      if (temp > 0) {
        // > 10L (30%)
        taxOld += temp * 0.30;
      }
    }
    // Rebate under 87A (Old Regime tax is 0 if taxable income <= 5L)
    if (taxableOld <= 500000) {
      taxOld = 0;
    }
    const totalTaxOld = taxOld * 1.04;

    return {
      taxableNew,
      taxNew: Math.round(totalTaxNew),
      taxableOld,
      taxOld: Math.round(totalTaxOld),
      savings: Math.abs(Math.round(totalTaxNew - totalTaxOld)),
      better: totalTaxNew < totalTaxOld ? 'New Regime' : 'Old Regime'
    };
  };

  const simResults = calculateTaxes(simIncome, sim80C, has80D ? 25000 : 0, hasHRA ? 150000 : 0);

  const COLORS = ['#D4AF37', '#00E5FF', '#8B5CF6', '#4F46E5', isLight ? '#1C1917' : '#F8FAFC'];
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Financial Intelligence</h1>
        <p className="text-slate-400 font-sans text-lg">Deep analytics and AI-driven projections for your wealth.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Monthly Expense', value: '₹42,300', trend: '-8%', up: false },
          { label: 'Projected Annual Tax', value: '₹1.85L', trend: '+12%', up: true },
          { label: 'Savings Velocity', value: '45%', trend: '+5%', up: true },
          { label: 'Wealth Score', value: '782', trend: '+18', up: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-display font-bold text-white">{stat.value}</h3>
              <span className={`text-xs font-bold flex items-center gap-1 ${stat.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-4 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
            <h2 className="text-xl font-display font-bold">Income vs Tax Projection</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-metallicGold" />
                <span className="text-xs text-slate-400 uppercase">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-electricTeal" />
                <span className="text-xs text-slate-400 uppercase">Tax Paid</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyComparison}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)"} vertical={false} />
                <XAxis dataKey="month" stroke={isLight ? "#6B7280" : "rgba(255,255,255,0.3)"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isLight ? "#6B7280" : "rgba(255,255,255,0.3)"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={isLight ? { backgroundColor: '#FFFDF4', border: '1px solid rgba(141,110,99,0.2)', borderRadius: '12px', color: '#1C1917' } : { backgroundColor: '#0A0E17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FAF5FF' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="income" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="tax" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorTax)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-4 sm:p-8 flex flex-col"
        >
          <h2 className="text-xl font-display font-bold mb-8">Expense Distribution</h2>
          <div className="flex-1 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={isLight ? { backgroundColor: '#FFFDF4', border: '1px solid rgba(141,110,99,0.2)', borderRadius: '12px', color: '#1C1917' } : { backgroundColor: '#0A0E17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FAF5FF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {expenseData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 sm:p-8 bg-gradient-to-br from-indigo/10 to-transparent border-indigo/20 flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
        >
          <div className="p-4 rounded-2xl bg-indigo/10 text-indigo shrink-0">
            <Target size={32} />
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-xl font-display font-bold text-white mb-2">Goal: Tax Freedom</h3>
            <p className="text-slate-400 text-sm mb-4">Invest an additional ₹85,000 in ELSS/PPF by March 31st to achieve zero tax liability.</p>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-indigo w-[65%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 sm:p-8 bg-gradient-to-br from-metallicGold/10 to-transparent border-metallicGold/20 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:col-span-2"
        >
          <div className="p-4 rounded-2xl bg-metallicGold/10 text-metallicGold shrink-0">
            <Zap size={32} />
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-xl font-display font-bold text-white mb-2">Trio Insight: Regime Reversal</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Your current spending habits suggest that switching to the **Old Regime** could save you an estimated ₹24,500 more than the New Regime, provided you maximize Section 80C and 80D deductions. 
            </p>
            <button 
              onClick={() => navigate('/ai', { state: { autoPrompt: 'Can you provide a detailed comparison between the Old and New tax regimes based on my current spending habits? Which one is generally better for me?' } })}
              className="px-6 py-2 bg-metallicGold text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform"
            >
              Detailed Comparison
            </button>
          </div>
        </motion.div>
      </div>

      {/* What-If Tax Scenario Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 bg-gradient-to-br from-indigo/5 via-transparent to-cyan/5 border-white/10 mt-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo to-cyan rounded-2xl text-white shadow-[0_0_15px_rgba(0,217,255,0.4)]">
            <Sliders size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-white">What-If Tax Scenario Simulator</h2>
            <p className="text-slate-400 text-sm">Simulate tax brackets, investment changes, and exemptions in real-time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls - 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Gross Income */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Gross Annual Income</label>
                <span className="text-lg font-display font-bold text-white">₹{(simIncome / 100000).toFixed(2)}L</span>
              </div>
              <input
                type="range"
                min="500000"
                max="4000000"
                step="50000"
                value={simIncome}
                onChange={(e) => setSimIncome(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹5L</span>
                <span>₹20L</span>
                <span>₹40L</span>
              </div>
            </div>

            {/* Slider 2: 80C Investments */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  Section 80C Investments
                  <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-1.5 py-0.5 rounded font-mono">Max ₹1.5L</span>
                </label>
                <span className="text-lg font-display font-bold text-cyan">₹{(sim80C / 100000).toFixed(2)}L</span>
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                step="5000"
                value={sim80C}
                onChange={(e) => setSim80C(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹0</span>
                <span>₹75k</span>
                <span>₹1.5L</span>
              </div>
            </div>

            {/* Checkboxes & Extra Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer select-none" onClick={() => setHas80D(!has80D)}>
                <input
                  type="checkbox"
                  checked={has80D}
                  readOnly
                  className="mt-1 accent-cyan"
                />
                <div>
                  <p className="text-xs font-semibold text-white">Section 80D (Health Insurance)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Deduct up to ₹25,000 for self/family policies.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer select-none" onClick={() => setHasHRA(!hasHRA)}>
                <input
                  type="checkbox"
                  checked={hasHRA}
                  readOnly
                  className="mt-1 accent-cyan"
                />
                <div>
                  <p className="text-xs font-semibold text-white">HRA Exemption</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Rent house allowance up to ₹1,50,000 claim.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projections & Recommendations - 5 columns */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden group">
            {/* aurora backing */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 blur-3xl rounded-full"></div>
            
            <div className="space-y-6 relative z-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Regime Comparison</h3>
              
              <div className="space-y-4">
                {/* New Regime bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">New Tax Regime</span>
                    <span className="text-white font-bold">₹{simResults.taxNew.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(100, (simResults.taxNew / (simIncome || 1)) * 400)}%` }}
                      className="h-full bg-cyan rounded-full" 
                    />
                  </div>
                </div>

                {/* Old Regime bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Old Tax Regime</span>
                    <span className="text-white font-bold">₹{simResults.taxOld.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(100, (simResults.taxOld / (simIncome || 1)) * 400)}%` }}
                      className="h-full bg-indigo rounded-full" 
                    />
                  </div>
                </div>
              </div>

              {/* Savings Announcement */}
              <div className="p-4 rounded-xl bg-cyan/5 border border-cyan/20">
                {simResults.savings > 0 ? (
                  <div>
                    <p className="text-[10px] text-cyan uppercase font-mono tracking-widest">Recommended Choice</p>
                    <p className="text-base font-display font-bold text-white mt-1">
                      Switch to <span className="text-cyan">{simResults.better}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      You will save <span className="text-emerald-400 font-bold">₹{simResults.savings.toLocaleString('en-IN')}</span> annually.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">Recommended Choice</p>
                    <p className="text-base font-display font-bold text-white mt-1">Both Regimes are Equal</p>
                    <p className="text-xs text-slate-400 mt-1">Tax liability is identical in both configurations.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 relative z-10 flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>* FY 2026-27 Slabs</span>
              <span className="flex items-center gap-1"><Info size={12} /> Includes standard deductions</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
