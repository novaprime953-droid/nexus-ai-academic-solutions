import React, { useState } from 'react';
import { PROJECTS } from '../data/mockData';
import { PageRoute } from '../types';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { FloatingParticles } from '../components/FloatingParticles';
import { ExternalLink } from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'AI & Automation', 'Platform Development', 'Education & Research'];

  const filtered = PROJECTS.filter((p) => (filter === 'All' ? true : p.category === filter));

  return (
    <div className="relative min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <FloatingParticles count={25} />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Engineering Showcase</span>
            <span>·</span>
            <span className="text-cyan-400 font-medium">Enterprise Track Record</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Projects &amp; Deployed Architectures
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Case studies of autonomous multi-agent clusters, mission-critical telemetry portals, and applied laboratory systems engineered by Nexus AI.
          </p>
        </ScrollReveal>

        {/* Filter Bar */}
        <ScrollReveal delay={0.1} className="flex justify-center">
          <div className="flex flex-wrap gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Grid with 3D Tilt */}
        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((proj) => (
            <StaggerItem key={proj.id}>
              <CardTilt className="glass-panel rounded-2xl border border-white/10 glass-panel-hover overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172554] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold bg-[#101A3B]/80 backdrop-blur-md rounded-lg text-cyan-400 border border-[#4263FF]/30">
                      {proj.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="text-xs text-slate-400 font-medium">{proj.client}</div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/8 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-extrabold text-cyan-400">{proj.metric}</span>
                    <span className="text-xs text-slate-500 block">{proj.metricLabel}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    <span>Inquire Similar Scope</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>

      </div>
    </div>
  );
};
