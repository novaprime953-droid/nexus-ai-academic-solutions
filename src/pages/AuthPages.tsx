import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageRoute } from '../types';
import { Cpu, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal } from '../components/ScrollReveal';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onNavigate: (page: PageRoute) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, onNavigate }) => {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('student@nexusai.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    if (role === 'admin') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('student-dashboard');
    }
  };

  const handleQuickDemo = (demoRole: 'student' | 'teacher' | 'admin') => {
    switchRole(demoRole);
    if (demoRole === 'admin') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('student-dashboard');
    }
  };

  const handleGoogleAuth = () => {
    login('google.user@nexusai.com', 'student');
    onNavigate('student-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative">
      <ScrollReveal className="max-w-md w-full">
        <CardTilt className="w-full space-y-7 glass-panel p-8 sm:p-10 rounded-3xl border border-[#4263FF]/30 shadow-2xl bg-gradient-to-b from-[#172554]/70 to-[#101A3B]/90">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white pt-2">
              {mode === 'login' ? 'Sign In to Nexus Portal' : 'Create Student Account'}
            </h1>
            <p className="text-xs text-slate-300">
              {mode === 'login'
                ? 'Access enrolled courses, certificates, and laboratory sandboxes.'
                : 'Join over 12,000 engineers and leaders across the globe.'}
            </p>
          </div>

          {/* Quick Demo Access Switcher */}
          <div className="p-3.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-cyan-400 block uppercase tracking-wider">
              Instant Demo Role Access:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 rounded-lg text-blue-200 text-center font-medium transition-colors"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="py-1.5 px-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-lg text-purple-200 text-center font-medium transition-colors"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 rounded-lg text-cyan-200 text-center font-medium transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-slate-400">or with email credentials</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Select Desired Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="student">Student / Learner</option>
                  <option value="teacher">Instructor / Mentor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all mt-4"
            >
              <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/8">
            {mode === 'login' ? (
              <p>
                Do not have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Register as Student
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </CardTilt>
      </ScrollReveal>
    </div>
  );
};
