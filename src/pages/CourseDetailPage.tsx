import React, { useState } from 'react';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Award,
  PlayCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface CourseDetailPageProps {
  course: Course;
  onBack: () => void;
  onNavigateToDashboard: () => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course,
  onBack,
  onNavigateToDashboard,
}) => {
  const { user, enrolledCourseIds, enrollInCourse } = useAuth();
  const [openWeek, setOpenWeek] = useState<number | null>(0);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollType, setEnrollType] = useState<'online' | 'physical'>('online');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  // Sample Interactive Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const isEnrolled = enrolledCourseIds.includes(course.id);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnrolling(true);

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: user?.name || 'Alex Rivera',
          studentEmail: user?.email || 'student@nexusai.com',
          courseId: course.id,
          courseTitle: course.title,
          type: enrollType,
          schedule:
            enrollType === 'physical'
              ? course.physicalSchedule || 'Lab Schedule Pending'
              : course.onlineSchedule || 'Self-Paced with Weekly Mentor Syncs',
        }),
      });

      if (res.ok) {
        enrollInCourse(course.id);
        setEnrolledSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === 1) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumb Back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Courses</span>
        </button>

        {/* Hero Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold">{course.category}</span>
              <span>·</span>
              <span>{course.level} Level</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {course.rating} Rating
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.overview}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                {course.duration} Intensive
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                {course.studentsCount} Active Students
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                Accredited Certification
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {isEnrolled ? (
                <button
                  onClick={onNavigateToDashboard}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrolled — Open in Student Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => setEnrollModalOpen(true)}
                  className="px-7 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25"
                >
                  <span>Enroll in Program ({course.price})</span>
                </button>
              )}

              {course.isPhysicalAvailable && (
                <div className="text-xs text-slate-400 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Campus Lab Seats Available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Split: Curriculum & Sidebar Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Curriculum & Practice Quiz */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Detailed Curriculum Modules</span>
              </h2>

              <div className="space-y-4">
                {course.curriculum.map((module, idx) => (
                  <div
                    key={idx}
                    className="border border-white/8 rounded-xl bg-white/[0.02] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenWeek(openWeek === idx ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <span className="text-xs text-cyan-400 font-semibold block mb-0.5">
                          {module.week}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{module.title}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">
                          {module.lessonsCount} Lessons
                        </span>
                        {openWeek === idx ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {openWeek === idx && (
                      <div className="px-5 pb-4 pt-2 border-t border-white/5 space-y-2">
                        {module.topics.map((topic, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-center gap-2 text-xs text-slate-300 py-1"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Concept Quiz */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Module Knowledge Check Sample</span>
                </h3>
                <span className="text-xs text-slate-500">Interactive Quiz</span>
              </div>

              <p className="text-xs text-slate-300">
                Question: In enterprise autonomous agent design, what is the primary role of the
                ReAct (Reason + Act) loop?
              </p>

              <div className="space-y-2">
                {[
                  'To format database queries into raw HTML markup',
                  'To decompose multi-step tasks into discrete thought-action cycles and self-correct',
                  'To reduce token usage by disabling attention matrices completely',
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!quizSubmitted) setQuizAnswer(i);
                    }}
                    className={`w-full p-3 text-left text-xs rounded-xl border transition-all ${
                      quizAnswer === i
                        ? 'border-cyan-400 bg-cyan-950/40 text-white'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswer === null}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                >
                  Submit Answer
                </button>
              ) : (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    quizAnswer === 1
                      ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                      : 'bg-amber-950/40 border border-amber-800 text-amber-300'
                  }`}
                >
                  {quizAnswer === 1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct! ReAct alternates between internal reasoning and external tool calls.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Option 2 is the correct answer: ReAct alternates reasoning and actions.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column: Instructor & Schedules */}
          <div className="space-y-6">
            {/* Instructor Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Lead Instructor
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/15"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{course.instructor.name}</h4>
                  <p className="text-xs text-slate-400">{course.instructor.role}</p>
                </div>
              </div>
            </div>

            {/* Physical Schedule */}
            {course.isPhysicalAvailable && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Physical Class Information</span>
                </h3>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <p className="font-semibold text-white">{course.physicalLocation}</p>
                  <p className="text-slate-400">{course.physicalSchedule}</p>
                  <p className="text-slate-500 pt-1">
                    Equipped with high-performance computing clusters and direct mentor desks.
                  </p>
                </div>
              </div>
            )}

            {/* Skills Acquired */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Competencies Mastered
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {course.skillsAcquired.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Prerequisites
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {course.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enrollment Modal */}
        {enrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A3B]/80 backdrop-blur-md">
            <div className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 max-w-lg w-full space-y-6 bg-[#172554]">
              {enrolledSuccess ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Enrollment Confirmed</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have successfully registered for {course.title}. Your curriculum access and workspace environments are active.
                  </p>
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        setEnrollModalOpen(false);
                        onNavigateToDashboard();
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Go to Student Portal
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Select Enrollment Format</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose whether you prefer remote interactive access or physical lab attendance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setEnrollType('online')}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between ${
                        enrollType === 'online'
                          ? 'border-cyan-400 bg-cyan-950/30'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">Online Digital Access</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          24/7 video lessons, lab sandbox, code reviews, and community syncs.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-cyan-400">{course.price}</span>
                    </button>

                    {course.isPhysicalAvailable && (
                      <button
                        type="button"
                        onClick={() => setEnrollType('physical')}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between ${
                          enrollType === 'physical'
                            ? 'border-cyan-400 bg-cyan-950/30'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">Physical Campus Lab</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            In-person workstation at {course.physicalLocation}.
                          </p>
                        </div>
                        <span className="text-xs font-bold text-cyan-400">{course.price}</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEnrollModalOpen(false)}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isEnrolling}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
                    >
                      {isEnrolling ? 'Processing...' : 'Confirm Enrollment'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
