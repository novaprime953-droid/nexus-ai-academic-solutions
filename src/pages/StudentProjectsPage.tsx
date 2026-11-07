import React from 'react';
import { PageRoute } from '../types';
import { PROJECTS } from '../data/mockData';
import { Sparkles, ArrowRight, Code, User } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface StudentProjectsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const StudentProjectsPage: React.FC<StudentProjectsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/30 text-purple-400 text-xs font-semibold">
            <Code className="w-3.5 h-3.5" /> Capstone Showcase
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Student Capstone Projects</h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Explore production-grade applications, autonomous agents, and full-stack platforms built by Nexus Academy graduates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((proj) => (
            <CardTilt key={proj.id} className="glass-panel rounded-3xl border border-[#4263FF]/30 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151F40] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#10172F]/80 backdrop-blur-md text-[11px] font-semibold text-cyan-400 rounded-lg border border-cyan-400/30">
                    {proj.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{proj.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{proj.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-between items-center text-xs border-t border-white/10 mt-4">
                <span className="text-slate-400">{proj.client}</span>
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  View Case Study <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardTilt>
          ))}
        </div>
      </div>
    </div>
  );
};
