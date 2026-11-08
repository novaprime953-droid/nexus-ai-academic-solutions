import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/mockData';
import { PageRoute, Course, CourseModule, Lesson, Quiz, QuizAttempt, Assignment, AssignmentSubmission, IssuedCertificate, AcademyAnnouncement } from '../types';
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
  AlertCircle,
  X,
  FileText,
  Send,
  Star,
  Check,
  Plus,
  Bot,
  UserCheck,
  Loader2,
  Shield,
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentDashboardProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCourse: (course: Course) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onSelectCourse,
}) => {
  const { user, enrolledCourseIds } = useAuth();
  const isInstructorOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'courses' | 'instructor' | 'assignments' | 'certificates' | 'announcements'>('courses');

  // Enrolled Courses Data
  const enrolledCourses = COURSES.filter((c) => enrolledCourseIds.includes(c.id));

  // Progress State
  const [courseProgress, setCourseProgress] = useState<Record<string, any>>({});

  // Active Lesson Player Modal State
  const [activeLessonModal, setActiveLessonModal] = useState<{
    course: Course;
    module: CourseModule;
    lesson: Lesson;
  } | null>(null);
  const [activeCourseModules, setActiveCourseModules] = useState<CourseModule[]>([]);

  // Active Quiz Modal State
  const [activeQuizModal, setActiveQuizModal] = useState<{
    courseId: string;
    quiz: Quiz;
  } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);

  // Active Assignment Submission Modal State
  const [activeAssignmentModal, setActiveAssignmentModal] = useState<{
    assignment: Assignment;
  } | null>(null);
  const [assignmentContent, setAssignmentContent] = useState('');
  const [assignmentFileName, setAssignmentFileName] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<AssignmentSubmission[]>([]);

  // Instructor Grading Modal State (for teacher role)
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradePoints, setGradePoints] = useState(95);
  const [gradeFeedback, setGradeFeedback] = useState('Great work! Clean execution loop.');
  const [gradingSubmitting, setGradingSubmitting] = useState(false);

  // Certificates State
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<IssuedCertificate | null>(null);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [certError, setCertError] = useState<string | null>(null);

  // Announcements State
  const [announcements, setAnnouncements] = useState<AcademyAnnouncement[]>([]);
  const [newAncTitle, setNewAncTitle] = useState('');
  const [newAncMessage, setNewAncMessage] = useState('');
  const [dispatchingAnc, setDispatchingAnc] = useState(false);

  const fetchProgress = async () => {
    try {
      const email = user?.email || 'alex.rivera@nexusai.com';
      const res = await fetch(`/api/lms/progress?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        const progMap: Record<string, any> = {};
        (data.progress || []).forEach((p: any) => {
          progMap[p.courseId] = p;
        });
        setCourseProgress(progMap);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCertificates = async () => {
    try {
      const email = user?.email || 'alex.rivera@nexusai.com';
      const res = await fetch(`/api/lms/certificates?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/lms/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const email = user?.email || 'alex.rivera@nexusai.com';
      const courseId = enrolledCourses[0]?.id || 'artificial-intelligence';
      const res = await fetch(`/api/lms/assignments/${courseId}?role=${user?.role || 'student'}&email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.assignments || []);
        setUserSubmissions(data.submissions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProgress();
    fetchCertificates();
    fetchAnnouncements();
    fetchSubmissions();
  }, []);

  const handleOpenLessonViewer = async (course: Course) => {
    try {
      const res = await fetch(`/api/lms/courses/${course.id}/modules`);
      if (res.ok) {
        const data = await res.json();
        const modules: CourseModule[] = data.modules || [];
        setActiveCourseModules(modules);
        if (modules.length > 0 && modules[0].lessons.length > 0) {
          setActiveLessonModal({
            course,
            module: modules[0],
            lesson: modules[0].lessons[0]
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLessonComplete = async (courseId: string, lessonId: string) => {
    try {
      const email = user?.email || 'alex.rivera@nexusai.com';
      const currentProg = courseProgress[courseId]?.completedLessonIds || [];
      const isCompleted = !currentProg.includes(lessonId);

      const res = await fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentEmail: email,
          courseId,
          lessonId,
          isCompleted
        })
      });

      if (res.ok) {
        fetchProgress();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenQuizModal = async (courseId: string) => {
    try {
      const res = await fetch(`/api/lms/quizzes/${courseId}?role=${user?.role || 'student'}`);
      if (res.ok) {
        const data = await res.json();
        setActiveQuizModal({ courseId, quiz: data.quiz });
        setQuizAnswers({});
        setQuizResult(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuizModal) return;
    setSubmittingQuiz(true);

    try {
      const res = await fetch(`/api/lms/quizzes/${activeQuizModal.quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: activeQuizModal.courseId,
          studentEmail: user?.email || 'alex.rivera@nexusai.com',
          studentName: user?.name || 'Alex Rivera',
          answers: quizAnswers
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResult(data.attempt);
        if (data.attempt.passed) {
          confetti({ particleCount: 80, spread: 60 });
        }
        fetchProgress();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!activeAssignmentModal || !assignmentContent.trim()) return;
    setSubmittingAssignment(true);

    try {
      const res = await fetch(`/api/lms/assignments/${activeAssignmentModal.assignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: activeAssignmentModal.assignment.courseId,
          studentEmail: user?.email || 'alex.rivera@nexusai.com',
          studentName: user?.name || 'Alex Rivera',
          content: assignmentContent,
          fileName: assignmentFileName || 'nexus_assignment_solution.zip'
        })
      });

      if (res.ok) {
        setAssignmentContent('');
        setAssignmentFileName('');
        setActiveAssignmentModal(null);
        fetchSubmissions();
        confetti({ particleCount: 50, spread: 50 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradingSubmission) return;
    setGradingSubmitting(true);

    try {
      const res = await fetch(`/api/lms/assignments/${gradingSubmission.id}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradePoints,
          instructorFeedback: gradeFeedback,
          gradedBy: user?.name || 'Dr. Evelyn Sterling'
        })
      });

      if (res.ok) {
        setGradingSubmission(null);
        fetchSubmissions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGradingSubmitting(false);
    }
  };

  const handleGenerateCertificate = async (course: Course) => {
    setGeneratingCert(true);
    setCertError(null);

    try {
      const res = await fetch('/api/lms/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentEmail: user?.email || 'alex.rivera@nexusai.com',
          studentName: user?.name || 'Alex Rivera',
          courseId: course.id,
          courseTitle: course.title,
          instructorName: course.instructor.name
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setCertError(data.error || 'Failed to generate certificate.');
      } else {
        fetchCertificates();
        setSelectedCertificate(data.certificate);
        confetti({ particleCount: 100, spread: 70 });
      }
    } catch (e: any) {
      setCertError(e.message || 'Error generating certificate.');
    } finally {
      setGeneratingCert(false);
    }
  };

  const handleDispatchAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAncTitle || !newAncMessage) return;
    setDispatchingAnc(true);

    try {
      const res = await fetch('/api/lms/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAncTitle,
          message: newAncMessage,
          postedBy: user?.name || 'Dr. Evelyn Sterling',
          targetCohort: 'Cohort 2026'
        })
      });

      if (res.ok) {
        setNewAncTitle('');
        setNewAncMessage('');
        fetchAnnouncements();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDispatchingAnc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Header */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#151F40]/90">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'Student'}
              className="w-16 h-16 rounded-2xl object-cover border border-white/15 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{isInstructorOrAdmin ? 'Academy Instructor Portal' : 'Student Academic Portal'}</span>
                <span>·</span>
                <span className="text-cyan-400 font-medium">{isInstructorOrAdmin ? 'Faculty Advisor' : 'Active Enrollee'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {user?.name || 'Alex'}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                ID: {user?.id} · Verified Cohort 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('courses')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Course Catalog</span>
            </button>
            <button
              onClick={() => onNavigate('support-center')}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Support Desk
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            My Enrolled Programs ({enrolledCourses.length})
          </button>

          {isInstructorOrAdmin && (
            <button
              onClick={() => setActiveTab('instructor')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'instructor' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              Instructor Grading &amp; Curriculum
            </button>
          )}

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'assignments' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Assignments &amp; Quizzes ({userSubmissions.length})
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'certificates' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Verified Certificates ({certificates.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'announcements' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Cohort Announcements ({announcements.length})
          </button>
        </div>

        {certError && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {certError}
          </div>
        )}

        {/* TAB 1: MY ENROLLED PROGRAMS & LESSON PLAYER */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((c) => {
                const prog = courseProgress[c.id] || { progressPercentage: c.id === 'web-development' ? 100 : 78, completedLessonIds: [] };
                return (
                  <div
                    key={c.id}
                    className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-5 flex flex-col justify-between bg-[#151F40]/90"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="text-cyan-400 font-semibold">{c.category}</span>
                        <span className="font-mono text-emerald-400 font-bold">{prog.progressPercentage}% Completed</span>
                      </div>

                      <h3 className="text-lg font-bold text-white leading-snug">{c.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{c.tagline}</p>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#10172F] rounded-full h-2 overflow-hidden border border-white/10">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-500"
                          style={{ width: `${prog.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenLessonViewer(c)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all"
                        >
                          <PlayCircle className="w-4 h-4" /> Continue Learning
                        </button>
                        <button
                          onClick={() => handleOpenQuizModal(c.id)}
                          className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 text-purple-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" /> Take Quiz
                        </button>
                      </div>

                      {prog.progressPercentage >= 100 ? (
                        <button
                          onClick={() => handleGenerateCertificate(c)}
                          disabled={generatingCert}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md transition-all"
                        >
                          <Award className="w-3.5 h-3.5" /> Certificate Ready
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">100% required for cert</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INSTRUCTOR GRADERS & CURRICULUM EDITOR */}
        {activeTab === 'instructor' && isInstructorOrAdmin && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-purple-400/30 space-y-1">
                <span className="text-xs text-slate-400">Total Enrolled Cohort Students</span>
                <div className="text-3xl font-extrabold text-white">2,840</div>
                <span className="text-[10px] text-cyan-400 font-semibold">Autonomous AI Cohort 2026</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-amber-400/30 space-y-1">
                <span className="text-xs text-slate-400">Submissions Pending Grading</span>
                <div className="text-3xl font-extrabold text-amber-400">
                  {userSubmissions.filter(s => s.status === 'Pending').length}
                </div>
                <span className="text-[10px] text-amber-400 font-semibold">Requires Instructor Action</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-400/30 space-y-1">
                <span className="text-xs text-slate-400">Average Program Rating</span>
                <div className="text-3xl font-extrabold text-emerald-400">4.96 ★</div>
                <span className="text-[10px] text-emerald-400 font-semibold">Verified Student Reviews</span>
              </div>
            </div>

            {/* Pending Submissions Queue */}
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-[#151F40]/90">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-400" /> Instructor Assignment Grading Queue
              </h3>

              <div className="space-y-3">
                {userSubmissions.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-[#10172F] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{sub.studentName} ({sub.studentEmail})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${sub.status === 'Graded' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-cyan-400 font-mono text-[11px]">{sub.content}</p>
                      <span className="text-[10px] text-slate-400 block">Submitted: {new Date(sub.submittedAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {sub.status === 'Graded' ? (
                        <div className="text-right font-mono">
                          <span className="text-emerald-400 font-bold block text-sm">{sub.gradePoints}/100 Points</span>
                          <span className="text-[10px] text-slate-400">Graded by {sub.gradedBy}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setGradingSubmission(sub)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl transition-all shadow-md"
                        >
                          Grade Submission
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS & QUIZZES */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-[#4263FF]/30 space-y-4 bg-[#151F40]/90">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" /> Course Capstone Assignments
              </h3>

              {assignments.map((asg) => (
                <div key={asg.id} className="p-5 rounded-2xl bg-[#10172F] border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{asg.title}</h4>
                    <span className="text-amber-400 font-mono">Max Points: {asg.maxPoints}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{asg.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-slate-400 text-[10px]">Deadline: {new Date(asg.deadline).toLocaleDateString()}</span>
                    <button
                      onClick={() => setActiveAssignmentModal({ assignment: asg })}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white rounded-xl text-xs font-semibold shadow-md"
                    >
                      Submit Solution
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VERIFIED CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCertificate(cert)}
                  className="glass-panel p-6 rounded-3xl border border-emerald-400/40 space-y-4 cursor-pointer hover:border-emerald-400 transition-all bg-[#151F40]/90"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold font-mono">{cert.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      {cert.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{cert.courseTitle}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                    <span>Issued to: <strong className="text-white">{cert.studentName}</strong></span>
                    <span>{new Date(cert.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COHORT ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {isInstructorOrAdmin && (
              <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-[#151F40]/90">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" /> Dispatch Cohort Announcement
                </h3>
                <form onSubmit={handleDispatchAnnouncement} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    value={newAncTitle}
                    onChange={(e) => setNewAncTitle(e.target.value)}
                    placeholder="Announcement Title"
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                  />
                  <textarea
                    required
                    rows={3}
                    value={newAncMessage}
                    onChange={(e) => setNewAncMessage(e.target.value)}
                    placeholder="Announcement Message for enrolled cohort..."
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl p-3.5 text-white resize-none"
                  />
                  <button
                    type="submit"
                    disabled={dispatchingAnc}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    Dispatch Announcement
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {announcements.map((anc) => (
                <div key={anc.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2 bg-[#151F40]/90 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="text-cyan-400 font-bold">{anc.postedBy} ({anc.targetCohort})</span>
                    <span>{new Date(anc.date).toLocaleString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{anc.title}</h4>
                  <p className="text-slate-300 leading-relaxed">{anc.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL 1: LESSON VIEWER MODAL */}
        <AnimatePresence>
          {activeLessonModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-cyan-400/40 bg-[#151F40] overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono">{activeLessonModal.course.title} · {activeLessonModal.module.week}</span>
                    <h3 className="text-base font-bold text-white">{activeLessonModal.lesson.title}</h3>
                  </div>
                  <button onClick={() => setActiveLessonModal(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                  {activeLessonModal.lesson.type === 'video' && activeLessonModal.lesson.videoUrl && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
                      <video src={activeLessonModal.lesson.videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-5 rounded-2xl bg-[#10172F] border border-white/10 space-y-3">
                    <div className="text-slate-200 leading-relaxed font-sans text-xs" dangerouslySetInnerHTML={{ __html: activeLessonModal.lesson.contentHtml || '<p>Lesson documentation content.</p>' }} />
                  </div>

                  {activeLessonModal.lesson.learningObjectives && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Learning Objectives</h4>
                      <ul className="space-y-1.5">
                        {activeLessonModal.lesson.learningObjectives.map((obj, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Type: <strong className="text-white uppercase">{activeLessonModal.lesson.type}</strong> ({activeLessonModal.lesson.duration})</span>
                  <button
                    onClick={() => handleToggleLessonComplete(activeLessonModal.course.id, activeLessonModal.lesson.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Lesson as Complete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 2: INTERACTIVE QUIZ MODAL */}
        <AnimatePresence>
          {activeQuizModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-purple-400/40 bg-[#151F40] overflow-hidden flex flex-col justify-between"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" /> {activeQuizModal.quiz.title}
                  </h3>
                  <button onClick={() => setActiveQuizModal(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                  {quizResult ? (
                    <div className="text-center space-y-4 py-6">
                      <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto text-2xl font-bold ${
                        quizResult.passed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400' : 'bg-red-500/20 text-red-400 border-red-400'
                      }`}>
                        {quizResult.scorePercentage}%
                      </div>
                      <h4 className="text-xl font-bold text-white">{quizResult.passed ? 'Assessment Passed!' : 'Assessment Retake Required'}</h4>
                      <p className="text-slate-300 max-w-md mx-auto">{quizResult.feedback}</p>
                    </div>
                  ) : (
                    activeQuizModal.quiz.questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-cyan-400 font-bold">Question {idx + 1} of {activeQuizModal.quiz.questions.length}</span>
                          <span className="text-amber-400">{q.points} Points</span>
                        </div>
                        <h4 className="font-semibold text-white text-xs leading-relaxed">{q.text}</h4>

                        {q.options ? (
                          <div className="space-y-2 pt-1">
                            {q.options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                                  quizAnswers[q.id] === optIdx ? 'bg-purple-600/30 border-purple-400 text-white' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            rows={3}
                            value={quizAnswers[q.id] || ''}
                            onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                            placeholder="Type short answer response..."
                            className="w-full bg-[#151F40] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-400 resize-none"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {!quizResult && (
                  <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submittingQuiz}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {submittingQuiz ? 'Evaluating...' : 'Submit Assessment'}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 3: ASSIGNMENT SUBMISSION MODAL */}
        <AnimatePresence>
          {activeAssignmentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-xl rounded-3xl border border-cyan-400/40 bg-[#151F40] p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white">{activeAssignmentModal.assignment.title}</h3>
                  <button onClick={() => setActiveAssignmentModal(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-400 mb-1 block">Solution Repository / Code Link *</label>
                    <input
                      type="text"
                      required
                      value={assignmentContent}
                      onChange={(e) => setAssignmentContent(e.target.value)}
                      placeholder="https://github.com/alexrivera/capstone-agent"
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Attachment File Name</label>
                    <input
                      type="text"
                      value={assignmentFileName}
                      onChange={(e) => setAssignmentFileName(e.target.value)}
                      placeholder="capstone_architecture_doc.zip"
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <button
                    onClick={handleSubmitAssignment}
                    disabled={submittingAssignment || !assignmentContent.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md disabled:opacity-40"
                  >
                    {submittingAssignment ? 'Submitting...' : 'Dispatch Assignment Solution'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 4: INSTRUCTOR GRADING MODAL */}
        <AnimatePresence>
          {gradingSubmission && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-md rounded-3xl border border-purple-400/40 bg-[#151F40] p-6 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white">Grade Student Submission</h3>
                  <button onClick={() => setGradingSubmission(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Student:</span>
                    <strong className="text-white">{gradingSubmission.studentName} ({gradingSubmission.studentEmail})</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Solution Link / Content:</span>
                    <p className="text-cyan-400 font-mono text-[11px] bg-[#10172F] p-2 rounded-xl">{gradingSubmission.content}</p>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Grade Points (0 - 100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={gradePoints}
                      onChange={(e) => setGradePoints(Number(e.target.value))}
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Instructor Feedback *</label>
                    <textarea
                      rows={3}
                      value={gradeFeedback}
                      onChange={(e) => setGradeFeedback(e.target.value)}
                      placeholder="Write constructive feedback for student..."
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl p-3 text-white resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGradeSubmission}
                    disabled={gradingSubmitting}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md"
                  >
                    {gradingSubmitting ? 'Saving Grade...' : 'Publish Grade & Feedback'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 5: VERIFIED CERTIFICATE DISPLAY & VERIFICATION */}
        <AnimatePresence>
          {selectedCertificate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-2xl rounded-3xl border border-emerald-400/50 bg-[#10172F] p-8 space-y-6 text-center text-white relative overflow-hidden"
              >
                <button onClick={() => setSelectedCertificate(null)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>

                <div className="border-4 border-double border-emerald-400/40 p-8 rounded-2xl space-y-6 bg-gradient-to-b from-[#151F40] to-[#10172F]">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                      <Award className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">NEXUS AI ACADEMIC &amp; SOLUTIONS</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">Certificate of Mastery</h2>
                    <p className="text-xs text-slate-300">This is to certify that</p>
                    <h3 className="text-xl font-bold text-cyan-400">{selectedCertificate.studentName}</h3>
                    <p className="text-xs text-slate-300">has successfully completed all coursework, assessments, and capstone requirements for</p>
                    <h4 className="text-base font-bold text-white">{selectedCertificate.courseTitle}</h4>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10 font-mono">
                    <div>
                      <span className="block text-[10px] text-slate-500">ISSUED DATE</span>
                      <strong className="text-slate-200">{new Date(selectedCertificate.issuedAt).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500">GRADE PERFORMANCE</span>
                      <strong className="text-emerald-400">{selectedCertificate.gradeScore}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500">FACULTY ADVISOR</span>
                      <strong className="text-slate-200">{selectedCertificate.instructorName}</strong>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] font-mono text-cyan-400 bg-black/40 p-2 rounded-xl flex items-center justify-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Verify: {selectedCertificate.verificationUrl}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
