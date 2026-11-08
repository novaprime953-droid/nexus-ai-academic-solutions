import React, { useState } from 'react';
import { PageRoute } from '../types';
import { GNRC_COURSES } from '../data/gnrcData';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Send,
  Sparkles,
  ArrowRight,
  Search,
  Shield,
  Zap,
  Users,
  Building,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface GNRCPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectGNRCCourse?: (courseId: string) => void;
}

export const GNRCPage: React.FC<GNRCPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Computer Fundamentals',
    'Office Productivity',
    'Typing & Communication',
    'Web Development',
    'App Development',
    'Game Development',
    'AI & Automation',
    'Trading & FinTech'
  ];

  const filteredCourses = GNRC_COURSES.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-yellow-400 selection:text-slate-900">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* GNRC Poster Hero Header */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-yellow-400/40 bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badge & Urdu Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center font-extrabold text-2xl shadow-lg">
                GNRC
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-yellow-400 tracking-wider uppercase block">
                  REGISTRATION OPEN — ADMISSIONS COHORT 2026
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  GLOBAL NEXUS RESEARCH CENTER
                </h1>
                <span className="text-xs text-slate-300 font-sans block mt-0.5">
                  An Elite Professional Computer Training Institute &amp; Research Center
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-yellow-400 block font-serif">
                گلوبل نیکسس ریسرچ سینٹر
              </span>
              <span className="text-xs text-slate-300">پیشہ ورانہ کمپیوٹر کورسز اور آئی ٹی ٹریننگ</span>
            </div>
          </div>

          {/* Hero Tagline & Main Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Learn Skills. Build Technology.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-red-500">
                  Shape the Future.
                </span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                GNRC delivers 44 career-oriented diploma programs across Computer Fundamentals, Office Productivity, Full-Stack Web &amp; Mobile Engineering, AI Automation, Unity Game Development, and FinTech Trading.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('gnrc-apply')}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-red-500 hover:from-yellow-300 hover:to-red-400 text-slate-900 font-extrabold rounded-2xl text-sm shadow-xl shadow-yellow-400/20 transition-all flex items-center gap-2 group"
                >
                  <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Apply for Online / Campus Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('gnrc-courses')}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold rounded-2xl text-sm transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-yellow-400" />
                  <span>View 44 Programs Catalog</span>
                </button>
              </div>
            </div>

            {/* Poster Admission Highlights Box */}
            <CardTilt className="p-6 rounded-3xl bg-slate-900/90 border border-yellow-400/40 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Building className="w-4 h-4 text-yellow-400" /> Physical Lab &amp; Online Cohorts
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-200">
                  <span>Course Duration:</span>
                  <strong className="text-white font-mono">3 Months / 6 Months</strong>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>Indicative Fee Range:</span>
                  <strong className="text-yellow-400 font-mono">PKR 15,000 – 45,000</strong>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>Installments Available:</span>
                  <strong className="text-emerald-400 font-semibold">Yes (Easy Monthly)</strong>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>Class Delivery:</span>
                  <strong className="text-cyan-400">Physical / Online / Hybrid</strong>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>Campus Location:</span>
                  <strong className="text-white">Circular Road, Hasilpur</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => onNavigate('gnrc-apply')}
                  className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Submit Admission Form</span>
                </button>
              </div>
            </CardTilt>
          </div>
        </div>

        {/* Course Catalog Search & Category Filter */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">GNRC Professional Programs Catalog</h2>
              <p className="text-xs text-slate-400">Select a skill track below or search for specific computer courses.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses, software, languages..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-yellow-400 text-slate-900 shadow-md shadow-yellow-400/20 font-extrabold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <CardTilt key={c.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-yellow-400/50 space-y-4 flex flex-col justify-between transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-400 font-semibold">{c.category}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">
                      {c.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{c.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-3">{c.description}</p>

                  {c.riskWarning && (
                    <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-[10px] text-red-300 space-y-1">
                      <strong className="text-red-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Risk Warning:
                      </strong>
                      <p className="leading-tight">{c.riskWarning}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400 text-[11px]">Course Fee:</span>
                    <strong className="text-yellow-400 text-sm">
                      {c.feePKR ? `PKR ${c.feePKR.toLocaleString()}` : 'Contact GNRC for fee'}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Mode: <strong className="text-slate-200">{c.classType}</strong></span>
                    <span>Instructor: <strong className="text-slate-200">{c.instructorName.split(' ')[0]} {c.instructorName.split(' ')[1]}</strong></span>
                  </div>

                  <button
                    onClick={() => onNavigate('gnrc-apply')}
                    className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-yellow-400/10 text-xs"
                  >
                    <span>Apply for Admission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardTilt>
            ))}
          </div>
        </div>

        {/* Campus & Local Contact Information for Hasilpur */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-yellow-400/30 bg-slate-900/90 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-xs">
          <div className="space-y-4">
            <span className="text-yellow-400 font-mono uppercase font-bold tracking-wider block">
              PHYSICAL CAMPUS &amp; COMPUTER LABS
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Global Nexus Research Center — Hasilpur Campus
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Equipped with high-performance workstation PCs, high-speed fiber internet, projector lecture halls, and dedicated lab instructors for hands-on computer education.
            </p>

            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Circular Road, Opposite City Park, Hasilpur, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Admission Inquiry Phone / WhatsApp: +92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Official Admissions Email: admissions@gnrc.edu.pk</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              GNRC Admission Information Desk
            </h4>
            <div className="space-y-2 text-slate-300">
              <p>• Morning Cohort: 9:00 AM – 12:00 PM</p>
              <p>• Afternoon Cohort: 2:00 PM – 5:00 PM</p>
              <p>• Evening Cohort: 6:00 PM – 9:00 PM</p>
              <p>• Weekend Cohort: Saturdays &amp; Sundays 10:00 AM – 2:00 PM</p>
            </div>
            <button
              onClick={() => onNavigate('gnrc-apply')}
              className="w-full mt-2 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold rounded-xl transition-all shadow-md"
            >
              Fill Online Admission Application
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
