import { motion } from 'framer-motion';
import { Calculator, FileText, CheckCircle, AlertCircle, Building2, CreditCard } from 'lucide-react';

export default function GST() {
  const gstDetails = [
    { label: 'GSTIN', value: '27AAAAA0000A1Z5', status: 'Active', icon: Building2 },
    { label: 'Tax Period', value: 'Monthly (GSTR-3B)', status: 'Compliant', icon: FileText },
    { label: 'Input Tax Credit', value: '₹45,200', status: 'Verified', icon: CreditCard },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-display font-bold tracking-tight mb-2">GST Compliance Hub</h1>
        <p className="text-slate-400 font-sans">Manage your GST registrations, returns, and input tax credits.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gstDetails.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-electricTeal/10 text-electricTeal">
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{item.label}</p>
                <p className="text-xl font-display font-bold text-white">{item.value}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 font-bold uppercase tracking-tighter">
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 space-y-6"
        >
          <h2 className="text-2xl font-display font-bold flex items-center gap-3">
            <Calculator className="text-metallicGold" />
            Quick GST Calculator
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount (Base Price)</label>
              <input type="number" placeholder="₹0.00" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-metallicGold/50 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tax Rate (%)</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-metallicGold/50 outline-none transition-all appearance-none">
                <option value="5">5% (Essentials)</option>
                <option value="12">12% (Standard)</option>
                <option value="18" selected>18% (Services/Goods)</option>
                <option value="28">28% (Luxury)</option>
              </select>
            </div>
            <div className="p-4 rounded-xl bg-metallicGold/5 border border-metallicGold/20">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">CGST (9%)</span>
                <span className="text-sm font-bold text-white">₹0.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">SGST (9%)</span>
                <span className="text-sm font-bold text-white">₹0.00</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-base font-display font-bold text-white">Total Amount</span>
                <span className="text-base font-display font-bold text-metallicGold">₹0.00</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-metallicGold to-yellow-600 text-black font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform">
              Generate GST Invoice Draft
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 space-y-6"
        >
          <h2 className="text-2xl font-display font-bold flex items-center gap-3">
            <CheckCircle className="text-electricTeal" />
            Upcoming Returns
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-sm font-bold text-white">GSTR-1 (Sales)</p>
                <p className="text-xs text-slate-400">Due: Oct 11, 2024</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-amber-400/10 text-amber-400 font-bold uppercase">Pending</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-sm font-bold text-white">GSTR-3B (Summary)</p>
                <p className="text-xs text-slate-400">Due: Oct 20, 2024</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 font-bold uppercase">Filed</span>
            </div>
            <div className="p-4 rounded-xl bg-electricTeal/5 border border-electricTeal/20 flex items-start gap-3">
              <AlertCircle size={18} className="text-electricTeal shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Trio AI has detected ₹4,200 in unclaimed ITC from your recent travel expenses. File GSTR-2B reconciliation to claim.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
