import React, { useState } from 'react';
import { PageRoute } from '../types';
import { GNRC_COURSES } from '../data/gnrcData';
import { safeFetchJson } from '../utils/api';
import {
  GraduationCap,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Loader2,
  ArrowRight,
  Shield,
  Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface GNRCApplyPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const GNRCApplyPage: React.FC<GNRCApplyPageProps> = ({ onNavigate }) => {
  const [submitting, setSubmitting] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    fatherGuardianName: '',
    phone: '',
    whatsApp: '',
    email: '',
    address: 'Hasilpur, Punjab, Pakistan',
    educationLevel: 'Matriculation',
    selectedCourseId: GNRC_COURSES[0].id,
    selectedCourseTitle: GNRC_COURSES[0].title,
    preferredDuration: '3 Months',
    preferredClassType: 'Physical (On-Campus)' as 'Physical (On-Campus)' | 'Online' | 'Hybrid',
    preferredSchedule: 'Evening (6 PM - 9 PM)' as any,
    previousExperience: 'Beginner',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) return;

    setSubmitting(true);
    const res = await safeFetchJson('/api/gnrc/apply', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success && res.data) {
      setTrackingResult(res.data.application);
    } else {
      alert(res.error || 'Failed to submit admission application.');
    }
    setSubmitting(false);
  };

  const selectedCourseObj = GNRC_COURSES.find(c => c.id === formData.selectedCourseId);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 relative selection:bg-yellow-400 selection:text-slate-900">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" /> Global Nexus Research Center Admissions
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Online Admission Application Form
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Fill in your details below to register for physical campus computer lab or online training programs.
          </p>
        </div>

        {trackingResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 rounded-3xl border border-emerald-400/40 text-center space-y-6 bg-slate-900/90 max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs text-emerald-400 font-mono font-bold block">ADMISSION APPLICATION SUBMITTED</span>
              <h3 className="text-2xl font-bold text-white">Application #{trackingResult.id} Logged</h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{trackingResult.fullName}</strong>. Your admission application for <strong className="text-yellow-400">{trackingResult.selectedCourseTitle}</strong> has been received by GNRC Admissions Office.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Tracking Number:</span>
                <strong className="text-yellow-400">{trackingResult.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-bold">{trackingResult.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Preferred Class Type:</span>
                <span className="text-cyan-400">{trackingResult.preferredClassType}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('gnrc-student-portal')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                Go to GNRC Student Portal
              </button>
              <button
                onClick={() => setTrackingResult(null)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </motion.div>
        ) : (
          <CardTilt className="glass-panel p-8 sm:p-10 rounded-3xl border border-yellow-400/30 bg-slate-900/90 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">

              {/* Applicant Personal Details */}
              <div className="space-y-3 border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">1. Applicant Personal Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Full Student Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Muhammad Usama"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Father / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fatherGuardianName}
                      onChange={(e) => setFormData({ ...formData, fatherGuardianName: e.target.value })}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Mobile Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">WhatsApp Number</label>
                    <input
                      type="text"
                      value={formData.whatsApp}
                      onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="usama@gnrc.edu.pk"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 mb-1 block font-medium">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Circular Road, Hasilpur, Punjab, Pakistan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Course Selection & Preferences */}
              <div className="space-y-3 border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">2. Course Selection &amp; Class Preferences</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Select GNRC Course *</label>
                    <select
                      value={formData.selectedCourseId}
                      onChange={(e) => {
                        const courseObj = GNRC_COURSES.find(c => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          selectedCourseId: e.target.value,
                          selectedCourseTitle: courseObj?.title || 'GNRC Course'
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    >
                      {GNRC_COURSES.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.category}] {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Preferred Class Delivery Mode</label>
                    <select
                      value={formData.preferredClassType}
                      onChange={(e) => setFormData({ ...formData, preferredClassType: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="Physical (On-Campus)">Physical (On-Campus Cyber Lab)</option>
                      <option value="Online">Online Self-Paced + Live Mentor</option>
                      <option value="Hybrid">Hybrid (On-Campus + Online Access)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Preferred Class Schedule</label>
                    <select
                      value={formData.preferredSchedule}
                      onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (2 PM - 5 PM)</option>
                      <option>Evening (6 PM - 9 PM)</option>
                      <option>Weekend (Sat &amp; Sun)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 mb-1 block font-medium">Education Qualification Level</label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option>Matriculation</option>
                      <option>Intermediate (FSc / ICS / FA / ICom)</option>
                      <option>Bachelors (BS / BSc / BCom)</option>
                      <option>Masters / Post-Graduate</option>
                    </select>
                  </div>
                </div>
              </div>

              {selectedCourseObj && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-yellow-400 font-bold">
                    <span>Course Fee:</span>
                    <span>{selectedCourseObj.feePKR ? `PKR ${selectedCourseObj.feePKR.toLocaleString()}` : 'Contact GNRC for current fee'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Duration:</span>
                    <span>{selectedCourseObj.duration}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-red-500 hover:from-yellow-300 text-slate-900 font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>Submit Admission Application</span>
              </button>
            </form>
          </CardTilt>
        )}

      </div>
    </div>
  );
};
