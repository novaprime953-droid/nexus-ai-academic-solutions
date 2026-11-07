import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/mockData';
import { PageRoute, Course } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  PlayCircle,
  MapPin,
  FileCheck,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCourse: (course: Course) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onSelectCourse,
}) => {
  const { user, enrolledCourseIds } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'schedule' | 'certificates' | 'assignments'>('courses');
  const [selectedCertificate, setSelectedCertificate] = useState<{
    courseName: string;
    studentName: string;
    issueDate: string;
    certId: string;
  } | null>(null);

  const enrolledCourses = COURSES.filter((c) => enrolledCourseIds.includes(c.id));

  const handleOpenCertificate = (courseTitle: string) => {
    setSelectedCertificate({
      courseName: courseTitle,
      studentName: user?.name || 'Alex Rivera',
      issueDate: 'November 2026',
      certId: `NEXUS-CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    });
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Header */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'Student'}
              className="w-16 h-16 rounded-2xl object-cover border border-white/15"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Student Academic Portal</span>
                <span>·</span>
                <span className="text-cyan-400 font-medium">Active Enrollee</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {user?.name || 'Alex'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Student ID: {user?.id} · Verified Cohort 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('courses')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Courses</span>
            </button>
            <button
              onClick={() => onNavigate('tools')}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Open AI Tools
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            My Enrolled Programs ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Campus Lab Schedules &amp; Attendance
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'certificates'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Certificates &amp; Credentials
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Assignments &amp; Quizzes
          </button>
        </div>

        {/* TAB 1: ENROLLED COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((c, idx) => {
                const progress = idx === 0 ? 78 : 100;
                return (
                  <div
                    key={c.id}
                    className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 space-y-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="text-cyan-400 font-semibold">{c.category}</span>
                        <span className="text-xs">{progress}% Completed</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{c.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.tagline}</p>

                      {/* Progress Bar */}
                      <div className="mt-4 w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      {progress === 100 ? (
                        <button
                          onClick={() => handleOpenCertificate(c.title)}
                          className="flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Official Certificate</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">Next: Lesson 14 · Tool Calling Loops</span>
                      )}

                      <button
                        onClick={() => onSelectCourse(c)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Continue Syllabus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {enrolledCourses.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <p>You have not enrolled in any programs yet.</p>
                <button
                  onClick={() => onNavigate('courses')}
                  className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Explore Course Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHEDULE & ATTENDANCE */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>On-Campus Lab Sessions &amp; Physical Workstation</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-cyan-400 font-semibold block">Upcoming Physical Lab Session</span>
                    <h4 className="text-sm font-bold text-white">Autonomous Agents: Real-time ReAct Pipelines</h4>
                    <p className="text-slate-400">Thursday, 6:00 PM – 9:00 PM</p>
                    <p className="text-slate-500">Location: Nexus Innovation Hub · Lab 4 · Pod B3</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-lg">
                    Seat Reserved
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold block">Online Live Mentor Office Hours</span>
                    <h4 className="text-sm font-bold text-white">1-on-1 Code Review with Dr. Evelyn Sterling</h4>
                    <p className="text-slate-400">Saturday, 11:30 AM – 12:15 PM</p>
                    <p className="text-slate-500">Nexus Live WebRTC Room · Link will activate 10m prior</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-800 text-blue-300 rounded-lg">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white">Attendance Telemetry</h3>
              <div className="p-4 rounded-xl bg-white/5 text-center space-y-1">
                <span className="text-3xl font-extrabold text-cyan-400">96.4%</span>
                <p className="text-xs text-slate-400">Overall Cohort Attendance</p>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 pt-2">
                <li className="flex items-center justify-between">
                  <span>Physical Lab Attendance</span>
                  <span className="text-white font-medium">11 / 12 Sessions</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Live Mentor Reviews</span>
                  <span className="text-white font-medium">4 / 4 Syncs</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Lab Workstation Safety</span>
                  <span className="text-emerald-400 font-medium">Passed</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Modern Next.js, React 19 &amp; Cloud Architecture
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Issued to {user?.name || 'Alex Rivera'} · Grade: 98%
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleOpenCertificate('Modern Next.js, React 19 & Cloud Architecture')
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>View &amp; Print Credential</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS & QUIZZES */}
        {activeTab === 'assignments' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white">Project Submissions &amp; Grading</h2>
            <div className="space-y-3 text-xs">
              {[
                {
                  title: 'Capstone: ReAct Agent with Tool-Calling Sandbox',
                  course: 'Autonomous AI Agents',
                  status: 'Under Review',
                  dueDate: 'Nov 12, 2026',
                  score: 'Pending',
                },
                {
                  title: 'React 19 Server Actions & Streaming SSR Application',
                  course: 'Web Development',
                  status: 'Graded (98/100)',
                  dueDate: 'Oct 28, 2026',
                  score: '98%',
                },
                {
                  title: 'Schema.org JSON-LD Entity Graph Implementation',
                  course: 'SEO & AEO',
                  status: 'Graded (100/100)',
                  dueDate: 'Oct 14, 2026',
                  score: '100%',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">{item.course} · Due: {item.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      item.score === 'Pending'
                        ? 'bg-amber-950/40 border border-amber-800 text-amber-300'
                        : 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A3B]/85 backdrop-blur-md">
            <div className="glass-panel max-w-2xl w-full p-8 sm:p-12 rounded-3xl border-2 border-cyan-400/40 bg-[#172554] space-y-8 text-center relative shadow-2xl">
              <div className="border border-white/10 p-8 rounded-2xl relative bg-gradient-to-b from-white/[0.03] to-transparent">
                <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-3">
                  Nexus AI Academic Institute · Certificate of Mastery
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  Certificate of Professional Achievement
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  This certifies that
                </p>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
                  {selectedCertificate.studentName}
                </div>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
                  Has successfully completed the comprehensive technical curriculum, laboratory assignments, and capstone deployment for:
                </p>
                <div className="text-base font-bold text-white mb-6">
                  {selectedCertificate.courseName}
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-500">
                  <span>ID: {selectedCertificate.certId}</span>
                  <span>Issued: {selectedCertificate.issueDate}</span>
                  <span>Verified by Nexus Academic Board</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert('Certificate downloaded in high-resolution PDF format.');
                    setSelectedCertificate(null);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Certificate</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
