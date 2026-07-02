import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Sparkles, AlertCircle, CheckCircle2, Play } from 'lucide-react';
import { DEMO_USER } from '../lib/demoData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface AuthPageProps {
  onLogin: (user: { id: string; name: string; email: string }) => void;
}

function InputField({
  label, icon: Icon, type, placeholder, value, onChange, error,
}: {
  label: string; icon: any; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--foreground)] opacity-55 pl-1">
        {label}
      </label>
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200
        ${error
          ? 'border-rose-400/60 bg-rose-50/40'
          : 'border-[var(--border-color)] bg-[var(--input-color)] focus-within:border-[var(--indigo-color)] focus-within:bg-white/60'
        }`}>
        <Icon size={15} className="text-[var(--foreground)] opacity-40 shrink-0" />
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-[var(--foreground)] placeholder-[var(--foreground)]/30"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="text-[var(--foreground)] opacity-40 hover:opacity-70 transition-opacity">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1 pl-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError, setSiError] = useState('');
  const [siLoading, setSiLoading] = useState(false);

  const handleDemoLogin = () => {
    localStorage.setItem('taxai-token', 'demo-token');
    localStorage.setItem('taxai-user', JSON.stringify(DEMO_USER));
    onLogin(DEMO_USER);
    navigate('/');
  };

  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [suErrors, setSuErrors] = useState<Record<string, string>>({});
  const [suLoading, setSuLoading] = useState(false);
  const [suSuccess, setSuSuccess] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiError('');
    setSiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('taxai-token', data.token);
      localStorage.setItem('taxai-user', JSON.stringify(data.user));
      onLogin(data.user);
      navigate('/');
    } catch (err: any) {
      setSiError(err.message);
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!suName.trim()) errs.name = 'Full name is required.';
    if (!suEmail.trim()) errs.email = 'Email is required.';
    if (suPassword.length < 6) errs.password = 'Minimum 6 characters.';
    if (suPassword !== suConfirm) errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length > 0) { setSuErrors(errs); return; }
    setSuErrors({});
    setSuLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: suName, email: suEmail, password: suPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      localStorage.setItem('taxai-token', data.token);
      localStorage.setItem('taxai-user', JSON.stringify(data.user));
      setSuSuccess(true);
      setTimeout(() => { onLogin(data.user); navigate('/'); }, 1200);
    } catch (err: any) {
      setSuErrors({ general: err.message });
    } finally {
      setSuLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-x-hidden gap-4 py-8"
      style={{ background: 'var(--background)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-40 pointer-events-none"
        style={{ background: 'var(--cyber-g-1)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full blur-[110px] opacity-30 pointer-events-none"
        style={{ background: 'var(--cyber-g-2)' }} />


      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="rounded-3xl border shadow-2xl overflow-hidden"
          style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)' }}>

          {/* Header */}
          <div className="px-10 pt-8 pb-5 text-center border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="w-[70px] h-[70px] mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-md bg-white border border-slate-100">
              <svg viewBox="0 0 120 120" className="w-[44px] h-[44px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Bar 1 - Red */}
                <polygon points="15,55 27,52 27,87 15,90" fill="#E24A1F" />
                {/* Bar 2 - Green */}
                <polygon points="33,35 45,32 45,77 33,80" fill="#1CA34D" />
                {/* Bar 3 - Red */}
                <polygon points="51,50 63,47 63,97 51,100" fill="#E24A1F" />
                {/* Bar 4 - Red */}
                <polygon points="69,62 81,59 81,107 69,110" fill="#E24A1F" />
                {/* Bar 5 - Green */}
                <polygon points="87,25 99,22 99,92 87,95" fill="#1CA34D" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>
              Alpha TaxAI
            </h1>
            <p className="text-sm mt-1 opacity-50" style={{ color: 'var(--foreground)' }}>
              Your intelligent financial workspace
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex mx-7 mt-5 rounded-2xl p-1.5 gap-1.5"
            style={{ background: 'var(--secondary-color)' }}>
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSiError(''); setSuErrors({}); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
                style={{
                  background: tab === t ? 'var(--card-color)' : 'transparent',
                  color: 'var(--foreground)',
                  opacity: tab === t ? 1 : 0.38,
                  boxShadow: tab === t ? '0 2px 10px var(--shadow-color)' : 'none',
                  border: tab === t ? '1px solid var(--glass-border)' : '1px solid transparent',
                }}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="px-10 py-5">
            <AnimatePresence mode="wait">
              {tab === 'signin' ? (
                <motion.form key="signin"
                  initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.2 }}
                  onSubmit={handleSignIn} className="space-y-4">
                  <InputField label="Email" icon={Mail} type="email" placeholder="you@example.com"
                    value={siEmail} onChange={setSiEmail} />
                  <InputField label="Password" icon={Lock} type="password" placeholder="Your password"
                    value={siPassword} onChange={setSiPassword} />

                  {siError && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                      <AlertCircle size={14} className="shrink-0" /> {siError}
                    </div>
                  )}

                  <button type="submit" disabled={siLoading}
                    className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, var(--indigo-color), var(--purple-color))', color: '#fff', opacity: siLoading ? 0.7 : 1 }}>
                    {siLoading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><span>Sign In</span><ArrowRight size={17} /></>}
                  </button>

                  <p className="text-center text-xs opacity-50" style={{ color: 'var(--foreground)' }}>
                    No account?{' '}
                    <button type="button" onClick={() => setTab('signup')}
                      className="font-semibold underline underline-offset-2"
                      style={{ color: 'var(--indigo-color)' }}>Sign up free</button>
                  </p>
                </motion.form>
              ) : (
                <motion.form key="signup"
                  initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.2 }}
                  onSubmit={handleSignUp} className="space-y-3">
                  <InputField label="Full Name" icon={User} type="text" placeholder="Your name"
                    value={suName} onChange={setSuName} error={suErrors.name} />
                  <InputField label="Email" icon={Mail} type="email" placeholder="you@example.com"
                    value={suEmail} onChange={setSuEmail} error={suErrors.email} />
                  <InputField label="Password" icon={Lock} type="password" placeholder="Min. 6 characters"
                    value={suPassword} onChange={setSuPassword} error={suErrors.password} />
                  <InputField label="Confirm Password" icon={Lock} type="password" placeholder="Repeat password"
                    value={suConfirm} onChange={setSuConfirm} error={suErrors.confirm} />

                  {suErrors.general && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                      <AlertCircle size={14} className="shrink-0" /> {suErrors.general}
                    </div>
                  )}
                  {suSuccess && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                      <CheckCircle2 size={14} className="shrink-0" /> Account created! Redirecting…
                    </div>
                  )}

                  <button type="submit" disabled={suLoading || suSuccess}
                    className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, var(--teal-color), var(--indigo-color))', color: '#fff', opacity: (suLoading || suSuccess) ? 0.7 : 1 }}>
                    {suLoading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><span>Create Account</span><ArrowRight size={17} /></>}
                  </button>

                  <p className="text-center text-xs opacity-50" style={{ color: 'var(--foreground)' }}>
                    Have an account?{' '}
                    <button type="button" onClick={() => setTab('signin')}
                      className="font-semibold underline underline-offset-2"
                      style={{ color: 'var(--indigo-color)' }}>Sign in</button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-10 pb-5 text-center">
            <p className="text-[11px] opacity-30" style={{ color: 'var(--foreground)' }}>
              Your data is encrypted and stored securely.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Demo banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="rounded-2xl border px-6 py-4 flex items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(249,178,215,0.18), rgba(207,236,243,0.18))',
            borderColor: 'var(--glass-border)',
            backdropFilter: 'blur(12px)',
          }}>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>👋 Just exploring?</p>
            <p className="text-xs opacity-50 mt-0.5" style={{ color: 'var(--foreground)' }}>
              Pre-loaded with real transactions, charts & analytics.
            </p>
          </div>
          <button onClick={handleDemoLogin}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shrink-0 transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--cyber-g-1), var(--cyber-g-2))',
              color: 'var(--foreground)',
              border: '1px solid var(--glass-border)',
            }}>
            <Play size={14} fill="currentColor" />
            Try Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
