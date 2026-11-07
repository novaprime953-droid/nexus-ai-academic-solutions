import React from 'react';
import { PageRoute } from '../types';
import { Code, Server, Database, Cpu, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface TechStackPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const TechStackPage: React.FC<TechStackPageProps> = ({ onNavigate }) => {
  const stackCategories = [
    {
      title: 'Frontend Architecture',
      icon: Code,
      color: 'text-cyan-400',
      border: 'border-cyan-400/30',
      technologies: ['React 19 & TypeScript', 'Tailwind CSS v4', 'Framer Motion & GSAP', 'Three.js & React Three Fiber', 'Lucide React Icons'],
    },
    {
      title: 'Backend & API Gateway',
      icon: Server,
      color: 'text-blue-400',
      border: 'border-blue-400/30',
      technologies: ['Node.js & Express', 'Google GenAI SDK & Gemini 2.5 Flash API', 'REST & WebSocket Protocols', 'JWT & Secure Cookie Auth', 'Rate Limiting & CORS Shield'],
    },
    {
      title: 'Vector Storage & Data',
      icon: Database,
      color: 'text-purple-400',
      border: 'border-purple-400/30',
      technologies: ['High-Performance Vector Embeddings', 'In-Memory Enterprise Shards', 'PostgreSQL & SQL Connect Ready', 'Redis Caching Layer', 'Automated Audit Logs'],
    },
    {
      title: 'Infrastructure & Security',
      icon: Shield,
      color: 'text-emerald-400',
      border: 'border-emerald-400/30',
      technologies: ['Zero-Trust RBAC Permissions', 'Docker Containerization', 'Cloud Run & Edge Deployments', 'Lighthouse 100 Performance Optimization', 'Enterprise SOC2 Compliance'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-400/30 text-blue-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Enterprise Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Built on World-Class Modern Technology
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover the high-performance stack powering Nexus AI Academic &amp; Solutions—engineered for sub-millisecond response times, absolute data security, and unmatched visual fidelity.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stackCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <CardTilt key={i} className={`glass-panel p-8 rounded-3xl border ${cat.border} space-y-6`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                    <p className="text-xs text-slate-400">Production-grade specification</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {cat.technologies.map((tech, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </CardTilt>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="glass-panel p-10 rounded-3xl border border-cyan-400/30 text-center space-y-6 max-w-4xl mx-auto bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40">
          <h3 className="text-2xl font-bold text-white">Ready to Integrate Nexus AI into Your Enterprise?</h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Our engineering consultants can review your existing architecture and deploy custom AI agent pipelines within days.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onNavigate('services')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition-all flex items-center gap-2"
            >
              Explore Services <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all"
            >
              Schedule Architecture Review
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
