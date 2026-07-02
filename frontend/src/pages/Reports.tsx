import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Clock, Search, Filter } from 'lucide-react';

export default function Reports() {
  const reports = [
    { title: 'Tax Computation FY 2024-25', type: 'PDF', date: 'Oct 28, 2024', size: '2.4 MB' },
    { title: 'P&L Statement (Q2)', type: 'Excel', date: 'Oct 25, 2024', size: '1.8 MB' },
    { title: 'GST GSTR-3B Summary', type: 'PDF', date: 'Oct 20, 2024', size: '1.2 MB' },
    { title: 'Investment Proof Verification', type: 'PDF', date: 'Oct 15, 2024', size: '3.1 MB' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Financial Reports</h1>
          <p className="text-slate-400 font-sans">Generate and export your tax-ready financial statements.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-metallicGold transition-colors" size={18} />
            <input type="text" placeholder="Search reports..." className="bg-black/40 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-metallicGold/50 outline-none w-full sm:w-64 transition-all" />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-colors shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 bg-gradient-to-br from-metallicGold/10 to-transparent border-metallicGold/20 relative overflow-hidden"
        >
          <div className="absolute -right-8 -bottom-8 p-12 bg-metallicGold/5 blur-3xl rounded-full"></div>
          <h2 className="text-2xl font-display font-bold text-white mb-4">Quick Generation</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Trio AI has pre-calculated your latest tax liability. Generate your FY 2024-25 computation in one click.</p>
          <div className="flex gap-4">
            <button className="flex-1 bg-metallicGold text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
              <Download size={18} />
              Download PDF
            </button>
            <button className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 bg-gradient-to-br from-electricTeal/10 to-transparent border-electricTeal/20 relative overflow-hidden"
        >
          <div className="absolute -right-8 -bottom-8 p-12 bg-electricTeal/5 blur-3xl rounded-full"></div>
          <h2 className="text-2xl font-display font-bold text-white mb-4">P&L Analysis</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Generate detailed Profit and Loss statements for any custom duration with expense categorization.</p>
          <div className="flex gap-4">
            <select className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
              <option>Last Quarter (Q2)</option>
              <option>Full Financial Year</option>
              <option>Custom Range</option>
            </select>
            <button className="bg-electricTeal text-black font-bold px-6 py-3 rounded-xl hover:scale-[1.02] transition-transform">
              Generate
            </button>
          </div>
        </motion.div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <Clock size={20} className="text-metallicGold" />
            Report History
          </h3>
          <button className="text-xs font-bold text-metallicGold uppercase tracking-widest hover:underline">Clear All</button>
        </div>
        <div className="divide-y divide-white/5">
          {reports.map((report, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${report.type === 'PDF' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-bold text-white group-hover:text-metallicGold transition-colors">{report.title}</p>
                  <p className="text-xs text-slate-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-metallicGold hover:border-metallicGold hover:text-black transition-all">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
