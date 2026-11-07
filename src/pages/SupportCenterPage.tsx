import React, { useState } from 'react';
import { PageRoute } from '../types';
import { MessageSquare, Send, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface SupportCenterPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', category: 'Technical Issue', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-400/30 text-blue-400 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" /> Support &amp; Ticketing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Enterprise Support Desk</h1>
          <p className="text-slate-300 text-sm sm:text-base">Submit a ticket and our expert engineering team will respond within 2 hours.</p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 rounded-3xl border border-emerald-400/40 text-center space-y-5 bg-[#151F40]"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Ticket #SUP-8492 Successfully Submitted</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Thank you, {formData.name}. Our support engineers have received your request and will contact you at {formData.email}.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', category: 'Technical Issue', subject: '', message: '' }); }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Submit Another Ticket
            </button>
          </motion.div>
        ) : (
          <CardTilt className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#4263FF]/30 space-y-6 bg-[#151F40]/90">
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 mb-1.5 block">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Rivera"
                    className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 mb-1.5 block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@nexusai.com"
                    className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 mb-1.5 block">Issue Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>Technical Issue / Bug</option>
                    <option>Academy Enrollment & Billing</option>
                    <option>API &amp; AI Tools Integration</option>
                    <option>Enterprise Custom Solution</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 mb-1.5 block">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of inquiry"
                    className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 mb-1.5 block">Detailed Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue, expected behavior, or custom requirement in detail..."
                  className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl p-3.5 text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Support Ticket
              </button>
            </form>
          </CardTilt>
        )}
      </div>
    </div>
  );
};
