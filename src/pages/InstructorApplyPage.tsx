import React, { useState } from 'react';
import { PageRoute } from '../types';
import { safeFetchJson } from '../utils/api';
import {
  GraduationCap,
  Send,
  CheckCircle2,
  Clock,
  Briefcase,
  UserCheck,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface InstructorApplyPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const InstructorApplyPage: React.FC<InstructorApplyPageProps> = ({ onNavigate }) => {
  const [submitting, setSubmitting] = useState(false);
  const [appliedApp, setAppliedApp] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    expertiseArea: 'Artificial Intelligence & Machine Learning',
    yearsOfExperience: '3-5 Years',
    portfolioUrl: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.expertiseArea) return;

    setSubmitting(true);
    const res = await safeFetchJson('/api/instructor/apply', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success && res.data) {
      setAppliedApp(res.data.application);
    } else {
      alert(res.error || 'Failed to submit instructor application.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-semibold">
            <UserCheck className="w-4 h-4" /> Faculty &amp; Instructor Recruitment
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Apply to Become an Instructor
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
            Join Nexus AI Academic faculty to teach professional computer engineering, AI automation, and technology courses.
          </p>
        </div>

        {appliedApp ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 rounded-3xl border border-emerald-400/40 text-center space-y-6 bg-[#151F40]/90 max-w-xl mx-auto text-xs"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs text-emerald-400 font-mono font-bold block">APPLICATION SUBMITTED</span>
              <h3 className="text-2xl font-bold text-white">Instructor Request #{appliedApp.id} Logged</h3>
              <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{appliedApp.fullName}</strong>. Your faculty application has been sent to Nexus AI Administration for credential verification.
              </p>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Return to Homepage
            </button>
          </motion.div>
        ) : (
          <CardTilt className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#151F40]/90 space-y-6 text-xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 mb-1 block font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Dr. Evelyn Sterling"
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-1 block font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="evelyn@nexusai.com"
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 mb-1 block font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555 019 2831"
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-1 block font-medium">Primary Area of Expertise *</label>
                  <input
                    type="text"
                    required
                    value={formData.expertiseArea}
                    onChange={(e) => setFormData({ ...formData, expertiseArea: e.target.value })}
                    placeholder="e.g. Full-Stack React & AI Agents"
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 mb-1 block font-medium">Years of Experience</label>
                  <select
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  >
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5-10 Years</option>
                    <option>10+ Years (Senior Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 mb-1 block font-medium">Portfolio / GitHub / LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 mb-1 block font-medium">Professional Bio &amp; Academic Background</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your teaching experience, research papers, software engineering background..."
                  className="w-full bg-[#10172F] border border-white/10 rounded-xl p-3 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Submit Faculty Application</span>
              </button>
            </form>
          </CardTilt>
        )}

      </div>
    </div>
  );
};
