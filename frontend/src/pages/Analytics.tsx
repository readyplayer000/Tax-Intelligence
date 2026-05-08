import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

const expenseData = [
  { name: 'Rent', value: 35000 },
  { name: 'Groceries', value: 12000 },
  { name: 'Lifestyle', value: 15000 },
  { name: 'Investment', value: 50000 },
  { name: 'Insurance', value: 8000 },
];

const COLORS = ['#D4AF37', '#00E5FF', '#8B5CF6', '#4F46E5', '#F8FAFC'];

const monthlyComparison = [
  { month: 'Apr', income: 150000, tax: 15000 },
  { month: 'May', income: 150000, tax: 14000 },
  { month: 'Jun', income: 165000, tax: 18000 },
  { month: 'Jul', income: 150000, tax: 15000 },
  { month: 'Aug', income: 180000, tax: 22000 },
  { month: 'Sep', income: 150000, tax: 15000 },
];

export default function Analytics() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
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
          className="lg:col-span-2 glass-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0E17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
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
          className="glass-card p-8 flex flex-col"
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
                   contentStyle={{ backgroundColor: '#0A0E17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
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
          className="glass-card p-8 bg-gradient-to-br from-indigo/10 to-transparent border-indigo/20 flex items-start gap-6"
        >
          <div className="p-4 rounded-2xl bg-indigo/10 text-indigo">
            <Target size={32} />
          </div>
          <div>
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
          className="glass-card p-8 bg-gradient-to-br from-metallicGold/10 to-transparent border-metallicGold/20 flex items-start gap-6 lg:col-span-2"
        >
          <div className="p-4 rounded-2xl bg-metallicGold/10 text-metallicGold">
            <Zap size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold text-white mb-2">Trio Insight: Regime Reversal</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Your current spending habits suggest that switching to the **Old Regime** could save you an estimated ₹24,500 more than the New Regime, provided you maximize Section 80C and 80D deductions. 
            </p>
            <button className="px-6 py-2 bg-metallicGold text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform">
              Detailed Comparison
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
