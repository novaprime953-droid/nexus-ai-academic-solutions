import React from 'react';
import { PageRoute } from '../types';
import { Users, MessageSquare, Sparkles, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface CommunityPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  const channels = [
    { name: '#ai-architects', members: '4,820 active', desc: 'Discussing LLM topologies, KV caching, and agentic reasoning loops.' },
    { name: '#react-19-devs', members: '6,150 active', desc: 'Full-stack React, server actions, and Tailwind v4 optimization.' },
    { name: '#automation-hub', members: '3,290 active', desc: 'Zapier, Make, n8n, and custom webhook pipeline integrations.' },
  ];

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-400/30 text-blue-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" /> Nexus Global Community
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Connect with 14,000+ AI Engineers</h1>
          <p className="text-slate-300 text-sm sm:text-base">Collaborate on open-source projects, share research breakthroughs, and get peer mentorship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((c, i) => (
            <CardTilt key={i} className="glass-panel p-6 rounded-3xl border border-[#4263FF]/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-cyan-400">{c.name}</span>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 border border-white/10">{c.members}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
              </div>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                Join Channel <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </CardTilt>
          ))}
        </div>
      </div>
    </div>
  );
};
