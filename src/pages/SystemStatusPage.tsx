import React from 'react';
import { PageRoute } from '../types';
import { Activity, CheckCircle2, Shield, Server, Cpu, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface SystemStatusPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SystemStatusPage: React.FC<SystemStatusPageProps> = ({ onNavigate }) => {
  const servicesStatus = [
    { name: 'Google Gemini 2.5 Flash Engine API', status: 'Operational', latency: '24ms', uptime: '100.0%' },
    { name: 'Vector Database & RAG Shards', status: 'Operational', latency: '12ms', uptime: '100.0%' },
    { name: 'Student LMS & Portal Engine', status: 'Operational', latency: '24ms', uptime: '99.98%' },
    { name: 'Enterprise API Gateway', status: 'Operational', latency: '19ms', uptime: '99.99%' },
    { name: 'Real-Time WebSocket Stream', status: 'Operational', latency: '8ms', uptime: '100.0%' },
  ];

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> All Systems Operational
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Nexus AI Infrastructure Status
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Real-time performance metrics, uptime tracking, and API cluster health across our global neural network nodes.
          </p>
        </div>

        {/* Global Uptime Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-emerald-400/30 bg-gradient-to-r from-emerald-950/30 via-[#151F40] to-[#10172F] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">99.99% Uptime Over Past 90 Days</h3>
              <p className="text-xs text-slate-300">No major incidents or latency degradations reported.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Last Checked</span>
            <span className="text-sm font-mono text-cyan-400">Just now (UTC)</span>
          </div>
        </div>

        {/* Services List */}
        <div className="glass-panel rounded-3xl border border-[#4263FF]/30 overflow-hidden bg-[#151F40]/90">
          <div className="px-6 py-4 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
            <span>Service Node</span>
            <span>Status / Latency / Uptime</span>
          </div>

          <div className="divide-y divide-white/5">
            {servicesStatus.map((service, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white">{service.name}</span>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono">
                  <span className="text-cyan-400">{service.latency}</span>
                  <span className="text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/25">
                    {service.status} ({service.uptime})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('contact')}
            className="text-xs text-cyan-400 hover:underline flex items-center justify-center gap-1.5 mx-auto"
          >
            Need dedicated enterprise SLA support? Contact our infrastructure team <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
