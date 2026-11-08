import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageRoute } from '../types';
import { Cpu, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, UserCheck, Briefcase } from 'lucide-react';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal } from '../components/ScrollReveal';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onNavigate: (page: PageRoute) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, onNavigate }) => {
  const { loginWithFirebase, registerWithFirebase, resetPassword, switchRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'student' | 'client'>('student');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isForgotPass, setIsForgotPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isForgotPass) {
      if (!email) {
        setErrorMsg('Please enter your email address to reset password.');
        return;
      }
      setLoading(true);
      const res = await resetPassword(email);
      if (res.success) {
        setSuccessMsg(`Password reset link sent to ${email}. Check your inbox.`);
      } else {
        setErrorMsg(res.error || 'Failed to send password reset email.');
      }
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }

      setLoading(true);
      const res = await registerWithFirebase(email, password, fullName, accountType);
      if (res.success) {
        setSuccessMsg('Account created successfully! Verification email sent. Redirecting...');
        setTimeout(() => {
          if (accountType === 'client') onNavigate('client-portal');
          else onNavigate('student-dashboard');
        }, 1200);
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
      setLoading(false);
    } else {
      if (!email || !password) {
        setErrorMsg('Email and password are required.');
        return;
      }

      setLoading(true);
      const res = await loginWithFirebase(email, password);
      if (res.success) {
        setSuccessMsg('Authentication successful! Redirecting...');
        setTimeout(() => {
          onNavigate('student-dashboard');
        }, 800);
      } else {
        setErrorMsg(res.error || 'Invalid credentials or account suspended.');
      }
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: 'student' | 'teacher') => {
    switchRole(demoRole);
    if (demoRole === 'teacher') onNavigate('student-dashboard');
    else onNavigate('student-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative selection:bg-cyan-400 selection:text-slate-900">
      <ScrollReveal className="max-w-md w-full">
        <CardTilt className="w-full space-y-6 glass-panel p-8 sm:p-10 rounded-3xl border border-[#4263FF]/30 shadow-2xl bg-gradient-to-b from-[#172554]/70 to-[#101A3B]/90 text-xs">

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white pt-2">
              {isForgotPass ? 'Reset Password' : mode === 'login' ? 'Sign In to Nexus' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-300">
              {isForgotPass
                ? 'Enter your registered email to receive a password recovery link.'
                : mode === 'login'
                ? 'Access your enrolled courses, projects, and certificates.'
                : 'Join Nexus AI platform for Student & Client services.'}
            </p>
          </div>

          {/* Quick Demo Access Switcher */}
          <div className="p-3 bg-[#172554] border border-[#4263FF]/30 rounded-xl space-y-1.5 text-xs">
            <span className="text-[10px] font-semibold text-cyan-400 block uppercase tracking-wider">
              Instant Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 rounded-lg text-blue-200 text-center font-medium transition-colors text-[11px]"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => onNavigate('client-portal')}
                className="py-1.5 px-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-lg text-purple-200 text-center font-medium transition-colors text-[11px]"
              >
                Client Portal Demo
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {mode === 'register' && !isForgotPass && (
              <>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Select Account Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('student')}
                      className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        accountType === 'student' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-[#10172F] border-white/10 text-slate-400'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('client')}
                      className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        accountType === 'client' ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-[#10172F] border-white/10 text-slate-400'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Client
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@nexusai.com"
                className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
              />
            </div>

            {!isForgotPass && (
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white absolute right-3 top-3"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && !isForgotPass && (
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            )}

            {mode === 'login' && !isForgotPass && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsForgotPass(true)}
                  className="text-cyan-400 text-[11px] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>
                {isForgotPass ? 'Send Reset Link' : mode === 'login' ? 'Sign In to Portal' : 'Create Account'}
              </span>
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-white/10 space-y-2">
            {isForgotPass ? (
              <button onClick={() => setIsForgotPass(false)} className="text-cyan-400 font-semibold hover:underline">
                Back to Sign In
              </button>
            ) : mode === 'login' ? (
              <div className="space-y-1">
                <p>
                  Do not have an account?{' '}
                  <button onClick={() => onNavigate('register')} className="text-cyan-400 font-semibold hover:underline">
                    Register as Student or Client
                  </button>
                </p>
                <p>
                  Want to teach at Nexus AI?{' '}
                  <button onClick={() => onNavigate('instructor-apply')} className="text-purple-400 font-semibold hover:underline">
                    Apply as Instructor
                  </button>
                </p>
              </div>
            ) : (
              <p>
                Already registered?{' '}
                <button onClick={() => onNavigate('login')} className="text-cyan-400 font-semibold hover:underline">
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
