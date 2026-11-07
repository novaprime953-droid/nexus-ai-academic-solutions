import React from 'react';
import { PageRoute } from '../types';
import { Briefcase, Shield, CheckCircle2, Clock, FileText, ArrowRight, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface ClientPortalPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({ onNavigate }) => {
  const activeProjects = [
    { id: 'proj-1', title: 'Autonomous AI Support Agent Pipeline', client: 'InnovateCorp Global', status: 'In Production', progress: 85, dueDate: 'Next Week' },
    { id: 'proj-2', title: 'Next.js High-Performance Trading UI', client: 'Vance Capital', status: 'Phase 2 Testing', progress: 60, dueDate: 'In 2 Weeks' },
  ];

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Client Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Enterprise Client Dashboard</h1>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all"
          >
            Request New Consultation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeProjects.map((p) => (
            <CardTilt key={p.id} className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold rounded-full">
                  {p.status}
                </span>
                <span className="text-xs font-mono text-slate-400">Due: {p.dueDate}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                <p className="text-xs text-slate-400">Client: {p.client}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Milestone Progress</span>
                  <span className="font-bold text-cyan-400">{p.progress}%</span>
                </div>
                <div className="w-full bg-[#10172F] h-2.5 rounded-full overflow-hidden border border-white/10">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-slate-400">Secure File Vault: 4 Deliverables</span>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardTilt>
          ))}
        </div>
      </div>
    </div>
  );
};
