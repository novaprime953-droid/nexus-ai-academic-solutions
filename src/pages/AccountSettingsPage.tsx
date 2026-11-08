import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageRoute } from '../types';
import { safeFetchJson } from '../utils/api';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Camera,
  Bell,
  LogOut,
  Loader2,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface AccountSettingsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ onNavigate }) => {
  const { user, firebaseUser, logout, resetPassword } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [passResetSent, setPassResetSent] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setSaving(true);
    setSaveSuccessMsg(null);

    const res = await safeFetchJson('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        email: user.email,
        name,
        avatar,
        phone
      })
    });

    if (res.success) {
      setSaveSuccessMsg('Profile information updated successfully.');
    }
    setSaving(false);
  };

  const handleTriggerPasswordReset = async () => {
    if (!user?.email) return;
    const res = await resetPassword(user.email);
    if (res.success) {
      setPassResetSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#151F40]/90">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'User Avatar'}
                className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-400 font-semibold uppercase">{user?.role || 'Member'} Account</span>
                <span>·</span>
                <span>ID: {user?.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-0.5">{user?.name || 'User Settings'}</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              onNavigate('home');
            }}
            className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {saveSuccessMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Profile Settings Form */}
          <div className="md:col-span-2 space-y-6">
            <CardTilt className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#151F40]/90 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <UserIcon className="w-4 h-4 text-cyan-400" /> Personal Identity &amp; Profile Information
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-slate-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 mb-1 block">Email Address (Primary Identity)</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full bg-[#10172F]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-slate-400 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-slate-400 mb-1 block">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 019 2831"
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 mb-1 block">Profile Avatar Image URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Profile Updates</span>
                </button>
              </form>
            </CardTilt>
          </div>

          {/* Security & Verification Card */}
          <div className="space-y-6 text-xs">
            <CardTilt className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-[#151F40]/90">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Shield className="w-4 h-4 text-purple-400" /> Account Security &amp; Credentials
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[#10172F] border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[11px] block">Firebase Email Verification</span>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Verified Authenticated Identity
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#10172F] border border-white/10 space-y-2">
                  <span className="text-slate-400 text-[11px] block">Password Security</span>
                  {passResetSent ? (
                    <span className="text-emerald-400 font-semibold text-[11px] block">
                      Password reset email sent to {user?.email}. Check your inbox.
                    </span>
                  ) : (
                    <button
                      onClick={handleTriggerPasswordReset}
                      className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 text-purple-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" /> Send Password Reset Email
                    </button>
                  )}
                </div>
              </div>
            </CardTilt>
          </div>
        </div>

      </div>
    </div>
  );
};
