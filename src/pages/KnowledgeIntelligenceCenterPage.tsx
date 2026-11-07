import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Database, Activity, RefreshCw, CheckCircle2, Shield, Search, FileText, Cpu, ArrowRight, AlertCircle, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface KnowledgeIntelligenceCenterPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const KnowledgeIntelligenceCenterPage: React.FC<KnowledgeIntelligenceCenterPageProps> = ({ onNavigate }) => {
  const [overview, setOverview] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/intelligence/overview');
      if (res.ok) {
        setOverview(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const triggerScan = async () => {
    setScanning(true);
    setMessage(null);
    try {
      const res = await fetch('/api/intelligence/scan', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchOverview();
      }
    } catch (e) {
      setMessage('Scan failed due to network error.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Autonomous Learning &amp; Monitoring
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Nexus Knowledge Intelligence Center</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerScan}
              disabled={scanning}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Running Crawler Scan...' : 'Start Autonomous Scan'}</span>
            </button>
            <button
              onClick={() => onNavigate('knowledge-admin')}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all"
            >
              Knowledge Editor
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
          </div>
        )}

        {/* Overview Stats */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-cyan-400/30 space-y-2">
              <span className="text-xs text-slate-400">Total Discovered Pages</span>
              <div className="text-2xl font-bold text-white">{overview.totalPages}</div>
              <span className="text-[10px] text-cyan-400">{overview.indexedPages} fully indexed</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-emerald-400/30 space-y-2">
              <span className="text-xs text-slate-400">Crawler Status</span>
              <div className="text-lg font-bold text-emerald-400">{overview.crawlerStatus}</div>
              <span className="text-[10px] text-slate-400">Zero drift detected</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-purple-400/30 space-y-2">
              <span className="text-xs text-slate-400">Knowledge Gaps</span>
              <div className="text-2xl font-bold text-purple-400">{overview.gaps?.length || 0}</div>
              <span className="text-[10px] text-slate-400">Suggestions pending review</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-blue-400/30 space-y-2">
              <span className="text-xs text-slate-400">Audit Trail</span>
              <div className="text-2xl font-bold text-blue-400">{overview.auditLogs?.length || 0} Logs</div>
              <span className="text-[10px] text-slate-400">Immutable version history</span>
            </div>
          </div>
        )}

        {/* Discovered Pages & Knowledge Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CardTilt className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Discovered Website Pages
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {overview?.pages?.map((p: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{p.title}</div>
                    <span className="text-[10px] text-cyan-400 font-mono">{p.path}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px]">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </CardTilt>

          <CardTilt className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400" /> AI Knowledge Gap Reports &amp; Suggestions
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {overview?.gaps?.map((g: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">{g.topic}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-400/10 text-purple-300 border border-purple-400/20">{g.status}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{g.suggestion}</p>
                </div>
              ))}
            </div>
          </CardTilt>
        </div>

      </div>
    </div>
  );
};
