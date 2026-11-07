import React from 'react';
import { PageRoute, Course } from '../types';
import { COURSES } from '../data/mockData';
import { BookOpen, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface LearningPathsPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCourse: (course: Course) => void;
}

export const LearningPathsPage: React.FC<LearningPathsPageProps> = ({ onNavigate, onSelectCourse }) => {
  const paths = [
    {
      title: 'Generative AI & Agent Architect',
      subtitle: 'From foundation neural prompts to autonomous enterprise multi-agent loops.',
      duration: '6 Months',
      coursesCount: 3,
      level: 'Advanced',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'Full-Stack Modern Web Engineer',
      subtitle: 'Master React 19, TypeScript, Tailwind v4, and resilient full-stack architectures.',
      duration: '4 Months',
      coursesCount: 2,
      level: 'Intermediate',
      color: 'from-purple-600 to-blue-600',
    },
    {
      title: 'Enterprise AI Automation Strategist',
      subtitle: 'Automate business workflows, CRM synchronization, and document OCR pipelines.',
      duration: '3 Months',
      coursesCount: 2,
      level: 'Beginner',
      color: 'from-indigo-600 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Curated Learning Paths
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Structured Career Accelerators</h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Expert-designed multi-course roadmaps tailored to take you from foundational concepts to elite industry proficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {paths.map((path, i) => (
            <CardTilt key={i} className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold rounded-full">
                  {path.level} • {path.duration}
                </div>
                <h3 className="text-2xl font-bold text-white">{path.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{path.subtitle}</p>

                <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {path.coursesCount} Comprehensive Courses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Real Projects &amp; Code Reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Verified Industry Certificate
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectCourse(COURSES[0])}
                className={`w-full py-3 bg-gradient-to-r ${path.color} text-white font-semibold text-xs rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
              >
                Start Learning Path <ArrowRight className="w-4 h-4" />
              </button>
            </CardTilt>
          ))}
        </div>
      </div>
    </div>
  );
};
