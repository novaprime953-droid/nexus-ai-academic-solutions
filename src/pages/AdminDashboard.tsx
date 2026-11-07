import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES, AI_TOOLS } from '../data/mockData';
import { PageRoute } from '../types';
import {
  Users,
  BookOpen,
  Mail,
  Cpu,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertCircle,
  Database
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'inquiries' | 'students' | 'courses' | 'tools' | 'analytics'
  >('overview');

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalStudents: 12480,
    activeLearners: 3820,
    coursesPublished: 24,
    enterpriseClients: 185,
    aiInvocationsToday: 1420,
  });
  const [loading, setLoading] = useState(false);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchStats();
  }, []);

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-purple-400 font-semibold uppercase tracking-wider">
                Nexus Administration Core
              </span>
              <span>·</span>
              <span>RBAC Tier: Super Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Command &amp; Academic Console
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Session: {user?.name} ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('knowledge-admin')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-600/25 transition-all"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Knowledge Brain (RAG)</span>
            </button>
            <button
              onClick={() => {
                fetchInquiries();
                fetchStats();
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview Metrics' },
            { id: 'inquiries', label: `Client Inquiries (${inquiries.length})` },
            { id: 'students', label: 'Enrolled Students' },
            { id: 'courses', label: 'Academic Programs (9)' },
            { id: 'tools', label: 'AI Tools Telemetry' },
            { id: 'analytics', label: 'Platform Performance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Students Registered',
                  value: stats.totalStudents.toLocaleString(),
                  delta: '+12.4% this month',
                  icon: <Users className="w-5 h-5 text-blue-400" />,
                },
                {
                  label: 'Active AI Invocations',
                  value: stats.aiInvocationsToday.toLocaleString(),
                  delta: 'Sub-second Gemini 3.8',
                  icon: <Cpu className="w-5 h-5 text-cyan-400" />,
                },
                {
                  label: 'Enterprise Proposals',
                  value: inquiries.length,
                  delta: 'High-intent pipeline',
                  icon: <Mail className="w-5 h-5 text-purple-400" />,
                },
                {
                  label: 'Active Programs',
                  value: '9 Masterclasses',
                  delta: 'Physical & Online',
                  icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{stat.label}</span>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stat.value}
                  </div>
                  <p className="text-[11px] text-cyan-400 font-medium">{stat.delta}</p>
                </div>
              ))}
            </div>

            {/* Recent Inquiries Preview */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Latest Enterprise Inquiries</h3>
                <button
                  onClick={() => setActiveSection('inquiries')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View All ({inquiries.length})
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {inquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{inq.name}</span>
                        <span className="text-slate-400">({inq.email})</span>
                      </div>
                      <p className="text-slate-300 mt-0.5">
                        {inq.service} · Budget: {inq.budget}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium self-start sm:self-auto capitalize ${
                        inq.status === 'completed'
                          ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                          : inq.status === 'in_progress'
                          ? 'bg-blue-950/40 border border-blue-800 text-blue-300'
                          : 'bg-amber-950/40 border border-amber-800 text-amber-300'
                      }`}
                    >
                      {inq.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: INQUIRIES MANAGEMENT */}
        {activeSection === 'inquiries' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Enterprise Inquiries &amp; Discovery Requests</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage commercial leads submitted through service pages and discovery consultations.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{inq.name}</h4>
                      <p className="text-xs text-cyan-400">{inq.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                        className="bg-[#172554] border border-[#4263FF]/30 text-xs text-white rounded-lg p-1.5 focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <p>
                      <strong className="text-slate-400">Service:</strong> {inq.service}
                    </p>
                    <p>
                      <strong className="text-slate-400">Budget Range:</strong> {inq.budget}
                    </p>
                  </div>

                  {inq.message && (
                    <div className="p-3 bg-[#101A3B]/60 border border-[#4263FF]/20 rounded-xl text-xs text-slate-300 leading-relaxed font-sans">
                      {inq.message}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500">
                    Received: {new Date(inq.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}

              {inquiries.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No inquiries recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: STUDENTS & ENROLLMENTS */}
        {activeSection === 'students' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white">Student Roster &amp; Cohort Progress</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Enrolled Program</th>
                    <th className="py-3 px-4">Modality</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    {
                      name: 'Alex Rivera',
                      email: 'alex.rivera@nexusai.com',
                      course: 'Autonomous AI Agents & LLMs',
                      modality: 'Online Digital',
                      progress: 78,
                      cert: false,
                    },
                    {
                      name: 'Alex Rivera',
                      email: 'alex.rivera@nexusai.com',
                      course: 'Modern Next.js & React 19',
                      modality: 'Online Digital',
                      progress: 100,
                      cert: true,
                    },
                    {
                      name: 'Jordan Lee',
                      email: 'jordan@nexusai.com',
                      course: 'Enterprise AI Automation',
                      modality: 'Physical Lab 4',
                      progress: 45,
                      cert: false,
                    },
                    {
                      name: 'Elena Rostova',
                      email: 'elena@biomedx.org',
                      course: 'Futuristic UI/UX & Brand Systems',
                      modality: 'Online Digital',
                      progress: 60,
                      cert: false,
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{row.name}</p>
                        <p className="text-[11px] text-slate-500">{row.email}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-200">{row.course}</td>
                      <td className="py-3 px-4">{row.modality}</td>
                      <td className="py-3 px-4 font-mono font-medium text-cyan-400">
                        {row.progress}%
                      </td>
                      <td className="py-3 px-4">
                        {row.cert ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Issued
                          </span>
                        ) : (
                          <span className="text-slate-500">In Progress</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 4: COURSES MANAGEMENT */}
        {activeSection === 'courses' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white">Course Catalog &amp; Physical Lab Capacity</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COURSES.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">{course.category}</span>
                    <span>{course.price}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2">{course.title}</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Instructor: {course.instructor.name}</p>
                    <p>Duration: {course.duration}</p>
                    <p>Students Enrolled: {course.studentsCount}</p>
                    {course.isPhysicalAvailable && (
                      <p className="text-emerald-400">Physical Lab: Enabled</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: AI TOOLS TELEMETRY */}
        {activeSection === 'tools' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white">AI Tools Performance &amp; Usage</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-white">{tool.title}</h4>
                    <p className="text-slate-400 text-[11px]">{tool.badge}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400 font-mono font-semibold">Operational</span>
                    <p className="text-[11px] text-slate-500">Latency: ~280ms</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: ANALYTICS */}
        {activeSection === 'analytics' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white">System Health &amp; Enterprise Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-slate-400">Gemini 3.8 Flash Engine</span>
                <div className="text-xl font-bold text-white">Connected</div>
                <p className="text-emerald-400">Server-Side Proxy Active</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-slate-400">Client Security Rules</span>
                <div className="text-xl font-bold text-white">Enforced</div>
                <p className="text-emerald-400">No Keys Exposed in Bundle</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-slate-400">Vite Dev Middleware</span>
                <div className="text-xl font-bold text-white">Sub-50ms</div>
                <p className="text-emerald-400">HMR Disabled per Studio Spec</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
