import React from 'react';
import { PageRoute } from '../types';
import { Sparkles, BookOpen, ArrowRight, Shield, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface ResearchPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ onNavigate }) => {
  const papers = [
    { title: 'Autonomous Multi-Agent Reasoning Loops in Enterprise Environments', date: 'October 2026', readTime: '18 min read', category: 'Agentic AI' },
    { title: 'Zero-Latency KV Caching & Transformer Memory Optimization', date: 'September 2026', readTime: '14 min read', category: 'Neural Architecture' },
    { title: 'Hybrid Dense-Sparse Vector Retrieval with Sub-Millisecond Precision', date: 'August 2026', readTime: '12 min read', category: 'RAG Systems' },
  ];

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Nexus Research Division
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">AI Research &amp; Innovation</h1>
          <p className="text-slate-300 text-sm sm:text-base">Publishing whitepapers and pioneering novel algorithms in neural network efficiency and autonomous agents.</p>
        </div>

        <div className="space-y-4">
          {papers.map((p, i) => (
            <CardTilt key={i} className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#4263FF]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-cyan-400">{p.category} • {p.date} • {p.readTime}</span>
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
              </div>

              <button
                onClick={() => onNavigate('blog')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all inline-flex items-center gap-2"
              >
                Read Whitepaper <ArrowRight className="w-4 h-4" />
              </button>
            </CardTilt>
          ))}
        </div>
      </div>
    </div>
  );
};
