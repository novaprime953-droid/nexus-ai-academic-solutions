import React, { useState, useEffect } from 'react';
import { PageRoute, Course, Service, AIToolItem, BlogPost, ProjectItem } from '../types';
import { COURSES, SERVICES, AI_TOOLS, BLOG_POSTS, PROJECTS } from '../data/mockData';
import { Search, X, BookOpen, Wrench, Briefcase, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  onSelectCourse: (course: Course) => void;
  onSelectService: (service: Service) => void;
  onSelectTool: (tool: AIToolItem) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectCourse,
  onSelectService,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingCourses = q
    ? COURSES.filter((c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
    : COURSES.slice(0, 3);

  const matchingTools = q
    ? AI_TOOLS.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    : AI_TOOLS.slice(0, 3);

  const matchingServices = q
    ? SERVICES.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    : SERVICES.slice(0, 2);

  const matchingBlogs = q
    ? BLOG_POSTS.filter((b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#10172F]/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="glass-panel max-w-2xl w-full rounded-3xl border border-cyan-400/30 overflow-hidden shadow-2xl bg-[#151F40]/95"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, AI tools, services, articles, or command shortcuts..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-white">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {/* Courses */}
          {matchingCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Academy Courses
              </div>
              <div className="space-y-1.5">
                {matchingCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCourse(c);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-400/30 flex items-center justify-between group transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-300">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-400">{c.category} • {c.duration}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Tools */}
          {matchingTools.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-purple-400" /> AI Productivity Tools
              </div>
              <div className="space-y-1.5">
                {matchingTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTool(t);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-400/30 flex items-center justify-between group transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-purple-300">
                        {t.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-md">{t.description}</div>
                    </div>
                    <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {matchingServices.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Enterprise Services
              </div>
              <div className="space-y-1.5">
                {matchingServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectService(s);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-400/30 flex items-center justify-between group transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-blue-300">
                        {s.title}
                      </div>
                      <div className="text-xs text-slate-400">{s.subtitle}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="text-slate-500 py-1">Quick Links:</span>
            <button
              onClick={() => { onNavigate('ai-lab'); onClose(); }}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
            >
              AI Lab
            </button>
            <button
              onClick={() => { onNavigate('tech-stack'); onClose(); }}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
            >
              Tech Stack
            </button>
            <button
              onClick={() => { onNavigate('system-status'); onClose(); }}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
            >
              System Status
            </button>
            <button
              onClick={() => { onNavigate('contact'); onClose(); }}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
            >
              Contact
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
