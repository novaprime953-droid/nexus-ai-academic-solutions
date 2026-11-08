import React, { useState, useEffect } from 'react';
import { safeFetchJson } from '../utils/api';
import { Lock, Mail, Eye, EyeOff, Shield, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string, admin: any) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic injection of noindex, nofollow for search engine protection
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg(null);

    const res = await safeFetchJson('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success && res.data?.token) {
      localStorage.setItem('nexus_admin_token', res.data.token);
      onLoginSuccess(res.data.token, res.data.admin);
    } else {
      setErrorMsg(res.error || 'Invalid administrator credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white flex items-center justify-center p-4 selection:bg-cyan-400 selection:text-slate-900 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#151F40]/90 space-y-8 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              RESTRICTED ACCESS
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Admin Portal Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized System Administrator Login Only
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="text-slate-300 mb-1.5 block font-medium">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexusai.com"
                className="w-full bg-[#10172F] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 mb-1.5 block font-medium">Administrator Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-[#10172F] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white absolute right-3.5 top-3.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            <span>Authenticate Administrator</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-[11px] text-slate-400 font-mono">
          <span>Nexus AI Security Audit · Session Encryption Active</span>
        </div>
      </motion.div>
    </div>
  );
};
