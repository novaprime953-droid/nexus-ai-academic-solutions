import React, { useState } from 'react';
import { AI_TOOLS } from '../data/mockData';
import { AIToolItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { CardTilt } from '../components/CardTilt';
import { MagneticButton } from '../components/MagneticButton';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Search,
  MessageSquare,
  FileText,
  BookOpen,
  Mail,
  Sparkles,
  TrendingUp,
  Code,
  Image as ImageIcon,
  Layers,
  Scissors,
  Minimize2,
  Sliders,
  Crop,
  RefreshCw,
  Type,
  ArrowRight,
  History,
  BarChart2,
  Settings,
  CreditCard,
  Bookmark,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Play,
  RotateCcw
} from 'lucide-react';

interface ToolsDirectoryPageProps {
  onSelectTool: (tool: AIToolItem) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-5 h-5 text-blue-400" />,
  FileText: <FileText className="w-5 h-5 text-indigo-400" />,
  BookOpen: <BookOpen className="w-5 h-5 text-cyan-400" />,
  Mail: <Mail className="w-5 h-5 text-purple-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Search: <Search className="w-5 h-5 text-emerald-400" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-cyan-400" />,
  Code: <Code className="w-5 h-5 text-blue-400" />,
  Image: <ImageIcon className="w-5 h-5 text-violet-400" />,
  Layers: <Layers className="w-5 h-5 text-blue-400" />,
  Scissors: <Scissors className="w-5 h-5 text-pink-400" />,
  Minimize2: <Minimize2 className="w-5 h-5 text-emerald-400" />,
  Sliders: <Sliders className="w-5 h-5 text-amber-400" />,
  Crop: <Crop className="w-5 h-5 text-cyan-400" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-indigo-400" />,
  Type: <Type className="w-5 h-5 text-purple-400" />,
};

interface ToolHistoryEntry {
  id: string;
  toolId: string;
  toolTitle: string;
  querySummary: string;
  timestamp: string;
  tokensUsed: number;
  status: 'completed' | 'optimized';
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({ onSelectTool }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'all' | 'text-ai' | 'seo-growth' | 'developer' | 'pdf-doc' | 'media-vision' | 'history' | 'analytics' | 'settings'
  >('all');
  const [search, setSearch] = useState('');
  const [credits, setCredits] = useState(4850);
  const maxCredits = 5000;
  const [favorites, setFavorites] = useState<string[]>(['ai-chat-assistant', 'code-assistant', 'ai-content-writer']);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Initial tool history
  const [history, setHistory] = useState<ToolHistoryEntry[]>([
    {
      id: 'hist-1',
      toolId: 'ai-chat-assistant',
      toolTitle: 'AI Chat Assistant',
      querySummary: 'Transformer KV Caching & Multi-agent latency optimization',
      timestamp: '12 mins ago',
      tokensUsed: 142,
      status: 'completed',
    },
    {
      id: 'hist-2',
      toolId: 'code-assistant',
      toolTitle: 'Code Assistant',
      querySummary: 'TypeScript React 19 useOptimistic caching hook with exponential backoff',
      timestamp: '45 mins ago',
      tokensUsed: 310,
      status: 'completed',
    },
    {
      id: 'hist-3',
      toolId: 'ai-content-writer',
      toolTitle: 'AI Content Writer',
      querySummary: 'Executive Brief: Multi-Modal LLM Infrastructure for FinTech Operations',
      timestamp: '2 hours ago',
      tokensUsed: 420,
      status: 'completed',
    },
    {
      id: 'hist-4',
      toolId: 'pdf-merger',
      toolTitle: 'PDF Merger',
      querySummary: 'Merged 3 research whitepapers into single compilation (12.4 MB)',
      timestamp: '4 hours ago',
      tokensUsed: 0,
      status: 'optimized',
    },
  ]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleTopUp = () => {
    setCredits(maxCredits);
    setShowTopUpModal(false);
    confetti({ particleCount: 70, spread: 60 });
  };

  // Filter tools based on search and active tab
  const filteredTools = AI_TOOLS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'text-ai') return t.category === 'Text & AI';
    if (activeTab === 'seo-growth') return t.category === 'SEO & Growth';
    if (activeTab === 'developer') return t.category === 'Developer';
    if (activeTab === 'pdf-doc') return t.category === 'PDF & Document';
    if (activeTab === 'media-vision') return t.category === 'Image & Media';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#101A3B]/50 text-white flex flex-col md:flex-row relative">
      
      {/* ==================================================
          1. RESPONSIVE SAAS SIDEBAR
          ================================================== */}
      <aside className="w-full md:w-68 lg:w-72 border-r border-[#4263FF]/20 bg-[#101A3B]/90 backdrop-blur-xl p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Workspace Brand / Tier Badge */}
          <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Nexus Intelligence Hub
              </span>
              <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                PRO SAAS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Gemini 3.8 Flash &amp; Client Media Engine
            </p>
          </div>

          {/* Navigation Category Groups */}
          <nav className="space-y-1 text-xs font-medium">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tool Suites
            </div>

            {[
              { id: 'all', label: 'All 16 Utilities', icon: <Layers className="w-4 h-4 text-cyan-400" />, count: 16 },
              { id: 'text-ai', label: 'Text & AI Writers', icon: <Sparkles className="w-4 h-4 text-blue-400" />, count: 5 },
              { id: 'seo-growth', label: 'SEO & Keywords', icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, count: 2 },
              { id: 'developer', label: 'Code & Dev Utilities', icon: <Code className="w-4 h-4 text-indigo-400" />, count: 2 },
              { id: 'pdf-doc', label: 'PDF Documents', icon: <FileText className="w-4 h-4 text-amber-400" />, count: 3 },
              { id: 'media-vision', label: 'Media & Canvas Vision', icon: <ImageIcon className="w-4 h-4 text-purple-400" />, count: 4 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === item.id ? 'bg-white/20' : 'bg-white/5 text-slate-500'}`}>
                  {item.count}
                </span>
              </button>
            ))}

            <div className="pt-4 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Workspace Telemetry
            </div>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Execution History</span>
              </div>
              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">
                {history.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                <span>Usage Analytics</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Preferences &amp; Engine</span>
              </div>
            </button>
          </nav>
        </div>

        {/* User Profile & Real-time Credits Bar */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Credits</span>
              </span>
              <span className="font-mono font-bold text-white tabular-nums">
                {credits.toLocaleString()} / {maxCredits.toLocaleString()}
              </span>
            </div>

            {/* Credit Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${(credits / maxCredits) * 100}%` }}
              />
            </div>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-cyan-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Replenish Tokens</span>
            </button>
          </div>

          {/* User Account Strip */}
          <div className="flex items-center gap-3 px-1">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-xl object-cover border border-white/15"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Alex Rivera'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'alex@nexusai.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================
          2. MAIN SAAS DASHBOARD VIEWPORT
          ================================================== */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* Top Header Bar with Search & Live Telemetry */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Nexus Hub</span>
              <span>/</span>
              <span>AI Tools SaaS</span>
              <span>/</span>
              <span className="text-cyan-400 capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {activeTab === 'all' && 'AI Intelligence Suite'}
              {activeTab === 'text-ai' && 'Generative Text & Content Studio'}
              {activeTab === 'seo-growth' && 'SEO & Answer Engine Intelligence'}
              {activeTab === 'developer' && 'Code Synthesis & Formatter'}
              {activeTab === 'pdf-doc' && 'Client-Side PDF Processing'}
              {activeTab === 'media-vision' && 'Visual Media & Synthesis'}
              {activeTab === 'history' && 'Workspace Execution Logs'}
              {activeTab === 'analytics' && 'Operational Usage & Telemetry'}
              {activeTab === 'settings' && 'Engine Preferences & API Settings'}
            </h1>
          </div>

          {/* Live AI Status and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono">Gemini 2.5 Flash</span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools, tags..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Top Metric Cards Strip (Claim-to-Proof Adjacency) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Available Tokens</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {credits.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">97% Remaining</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Total Invocations Today</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              1,420
            </div>
            <p className="text-[10px] text-cyan-400 font-medium">+18% vs yesterday</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Active Inference Engine</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              Gemini 2.5 Flash
            </div>
            <p className="text-[10px] text-slate-400">Server-Side Guardrails</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Average Latency</span>
              <Clock className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              248ms
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">Ultra-low latency</p>
          </div>
        </div>

        {/* TAB CONTENT: TOOLS GRID */}
        {['all', 'text-ai', 'seo-growth', 'developer', 'pdf-doc', 'media-vision'].includes(activeTab) && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredTools.length} operational utilities</span>
              {favorites.length > 0 && (
                <span className="text-amber-400 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 fill-amber-400" />
                  <span>{favorites.length} Pinned to Quick Access</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map((tool) => {
                const isFav = favorites.includes(tool.id);
                return (
                  <CardTilt
                    key={tool.id}
                    onClick={() => onSelectTool(tool)}
                    className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {iconMap[tool.iconName] || <Sparkles className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => toggleFavorite(tool.id, e)}
                            className="p-1 rounded-md text-slate-500 hover:text-amber-400 transition-colors"
                            title={isFav ? 'Remove from favorites' : 'Pin to favorites'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                          </button>
                          <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            {tool.badge}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Launch Interface</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardTilt>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Search className="w-8 h-8 opacity-40 mx-auto" />
                <p className="text-sm">No tools found matching &ldquo;{search}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: EXECUTION HISTORY */}
        {activeTab === 'history' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Workspace Execution Logs</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit trail of recent server-side Gemini prompts and client-side document processing tasks.
                </p>
              </div>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 bg-white/5"
              >
                Clear Log History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Tool</th>
                    <th className="py-3 px-4">Execution Query / Task</th>
                    <th className="py-3 px-4">Tokens Used</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((row) => {
                    const matchedTool = AI_TOOLS.find((t) => t.id === row.toolId) || AI_TOOLS[0];
                    return (
                      <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            {row.toolTitle}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-md truncate">
                          {row.querySummary}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-400">
                          {row.tokensUsed > 0 ? `${row.tokensUsed} tokens` : 'Client Local'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {row.timestamp}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectTool(matchedTool)}
                            className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-semibold"
                          >
                            <Play className="w-3 h-3" />
                            <span>Re-run</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {history.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Execution log is empty. Launch a tool to record activity.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: USAGE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Invocations Chart Simulation */}
              <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Daily AI Invocations (Past 7 Days)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Automated prompt and tool invocation volume</p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">Total: 9,840</span>
                </div>

                <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-white/10 px-2">
                  {[
                    { day: 'Mon', count: 1100, height: '55%' },
                    { day: 'Tue', count: 1350, height: '68%' },
                    { day: 'Wed', count: 1820, height: '90%' },
                    { day: 'Thu', count: 1540, height: '76%' },
                    { day: 'Fri', count: 2100, height: '100%' },
                    { day: 'Sat', count: 980, height: '48%' },
                    { day: 'Sun', count: 950, height: '45%' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] text-cyan-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.count}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 via-indigo-600 to-cyan-400 rounded-t-lg group-hover:brightness-125 transition-all"
                        style={{ height: bar.height }}
                      />
                      <span className="text-[11px] text-slate-400 pt-1">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white">Workload Distribution</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { name: 'Generative Text & Content', pct: '48%', color: 'bg-blue-500' },
                    { name: 'Code Generation & Refactoring', pct: '26%', color: 'bg-cyan-400' },
                    { name: 'Document & PDF Optimization', pct: '14%', color: 'bg-amber-400' },
                    { name: 'SEO & Search Analysis', pct: '12%', color: 'bg-purple-500' },
                  ].map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>{cat.name}</span>
                        <span className="font-mono font-bold text-white">{cat.pct}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB CONTENT: PREFERENCES & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-white">Workspace &amp; Model Engine Preferences</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure default inference configurations, formatting modes, and privacy guardrails.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Default Model Target</h4>
                  <p className="text-slate-400 mt-0.5">Gemini 2.5 Flash (Google GenAI API)</p>
                </div>
                <span className="text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/40 border border-emerald-800 rounded-lg">
                  Active Default
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Local Inference Shards</h4>
                  <p className="text-slate-400 mt-0.5">Zero external API keys required</p>
                </div>
                <span className="text-cyan-400 font-semibold">Enforced (100%)</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Output Formatting Mode</h4>
                  <p className="text-slate-400 mt-0.5">Render raw responses with syntax highlighted Markdown</p>
                </div>
                <span className="text-slate-300">Markdown + Code Blocks</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* TOP UP MODAL */}
      <AnimatePresence>
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A3B]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 max-w-md w-full space-y-6 bg-[#172554]"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-400 flex items-center justify-center mx-auto text-black">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-white">Replenish Token Quota</h3>
                <p className="text-xs text-slate-400">
                  Instant credit refill for your Nexus Pro workspace account.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="font-mono text-white">{credits} credits</span>
                </div>
                <div className="flex justify-between font-bold text-cyan-400">
                  <span>Replenish Target:</span>
                  <span className="font-mono">{maxCredits} credits (+{maxCredits - credits})</span>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                >
                  Confirm Refill
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
