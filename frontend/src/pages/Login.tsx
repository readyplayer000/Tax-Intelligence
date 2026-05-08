import { motion } from 'framer-motion';
import { Fingerprint, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-transparent text-softWhite">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-electricTeal/10 blur-[120px] rounded-full -z-10 animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-metallicGold/10 blur-[100px] rounded-full -z-10 animate-float"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-electricTeal/20 to-transparent"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 glass-card border border-white/10 flex flex-col items-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electricTeal to-metallicGold flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
          <Fingerprint size={40} className="text-white" />
        </motion.div>

        <h1 className="text-3xl font-display font-bold text-center mb-2 tracking-tight">Secure AI Financial Workspace</h1>
        <p className="text-sm text-slate-400 text-center mb-10">Authenticate to access Alpha Intelligence</p>

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold pl-1">Access ID</label>
            <input 
              type="text" 
              placeholder="Username or Email"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold pl-1">Passkey</label>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full mt-8 bg-cyber-gradient text-white font-semibold py-4 rounded-xl shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Initialize Workspace</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </motion.div>
    </div>
  );
}
