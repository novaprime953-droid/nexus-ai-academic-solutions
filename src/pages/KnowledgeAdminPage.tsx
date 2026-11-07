import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Database, FileText, Shield, Activity, Plus, Upload, CheckCircle2, ArrowRight, RefreshCw, Cpu, Globe, Search, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface KnowledgeAdminPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const KnowledgeAdminPage: React.FC<KnowledgeAdminPageProps> = ({ onNavigate }) => {
  const [health, setHealth] = useState<any>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Company Profile');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const hRes = await fetch('/api/rag/health');
      if (hRes.ok) setHealth(await hRes.json());

      const kRes = await fetch('/api/knowledge');
      if (kRes.ok) {
        const data = await kRes.json();
        setKnowledge(data.knowledge || []);
      }

      const dRes = await fetch('/api/documents');
      if (dRes.ok) {
        const data = await dRes.json();
        setDocuments(data.documents || []);
      }

      const iRes = await fetch('/api/intelligence/overview');
      if (iRes.ok) {
        setIntelligence(await iRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory, title: newTitle, content: newContent, tags: ['admin', 'manual'] }),
      });
      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutonomousScan = async () => {
    setScanning(true);
    setScanMessage(null);
    try {
      const res = await fetch('/api/intelligence/scan', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setScanMessage(data.message);
        fetchData();
      }
    } catch (e) {
      console.error(e);
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
              <Globe className="w-3.5 h-3.5" /> Nexus Knowledge Intelligence Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Autonomous Website Crawler &amp; RAG Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerAutonomousScan}
              disabled={scanning}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> {scanning ? 'Crawling Website...' : 'Start Autonomous Scan'}
            </button>
            <button
              onClick={() => onNavigate('knowledge-intelligence')}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-600/25 transition-all"
            >
              <Activity className="w-3.5 h-3.5" /> Intelligence Center
            </button>
          </div>
        </div>

        {scanMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {scanMessage}
          </div>
        )}

        {/* Intelligence Overview Stats */}
        {intelligence && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-cyan-400/30 space-y-2">
              <span className="text-xs text-slate-400">Discovered Website Pages</span>
              <div className="text-2xl font-bold text-white">{intelligence.totalPages}</div>
              <span className="text-[10px] text-cyan-400">{intelligence.indexedPages} fully indexed</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-purple-400/30 space-y-2">
              <span className="text-xs text-slate-400">Knowledge Gap Reports</span>
              <div className="text-2xl font-bold text-white">{intelligence.gaps.length}</div>
              <span className="text-[10px] text-purple-400">AI improvement suggestions</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-blue-400/30 space-y-2">
              <span className="text-xs text-slate-400">Crawler Scheduler</span>
              <div className="text-sm font-bold text-blue-400">{intelligence.crawlerStatus}</div>
              <span className="text-[10px] text-slate-400">Automatic diff detection</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-emerald-400/30 space-y-2">
              <span className="text-xs text-slate-400">Audit Logs</span>
              <div className="text-2xl font-bold text-emerald-400">{intelligence.auditLogs.length}</div>
              <span className="text-[10px] text-slate-400">Zero drift recorded</span>
            </div>
          </div>
        )}

        {/* Discovered Pages Table */}
        {intelligence && (
          <div className="glass-panel rounded-3xl border border-[#4263FF]/30 overflow-hidden bg-[#151F40]/90">
            <div className="px-6 py-4 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
              <span>Website Page / Route</span>
              <span>Status &amp; Content Hash</span>
            </div>
            <div className="divide-y divide-white/5">
              {intelligence.pages.map((p: any, i: number) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-white">{p.title}</span>
                    <span className="text-xs text-cyan-400 font-mono block">{p.path}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{p.contentHash}</span>
                    <span className="px-2.5 py-1 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 rounded-lg">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge Base Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardTilt className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Add Knowledge Entry
            </h3>

            <form onSubmit={handleAddKnowledge} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 mb-1.5 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Company Profile</option>
                  <option>Academy</option>
                  <option>Digital Services</option>
                  <option>Nexus AI Tools</option>
                  <option>Business Operations</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 mb-1.5 block">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. New AI Policy"
                  className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1.5 block">Content / Fact</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detailed company knowledge..."
                  className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all shadow-md shadow-blue-500/25"
              >
                {loading ? 'Ingesting...' : 'Ingest into Knowledge Brain'}
              </button>
            </form>
          </CardTilt>

          <div className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 lg:col-span-2 space-y-6 bg-[#151F40]/80">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Indexed Knowledge Library
            </h3>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {knowledge.map((cat, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{cat.category}</h4>
                  <div className="space-y-2">
                    {cat.items.map((item: any, j: number) => (
                      <div key={j} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
