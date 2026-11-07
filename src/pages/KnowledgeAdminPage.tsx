import React, { useState, useEffect } from 'react';
import { PageRoute, KnowledgeCategoryType, KnowledgeStatus, KnowledgeVisibility, KnowledgeDocument } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Database,
  FileText,
  Shield,
  Activity,
  Plus,
  Upload,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Cpu,
  Globe,
  Search,
  Play,
  Lock,
  Eye,
  Trash2,
  Edit,
  Check,
  AlertTriangle,
  Loader2,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface KnowledgeAdminPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const KnowledgeAdminPage: React.FC<KnowledgeAdminPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'documents' | 'search-test' | 'crawler'>('documents');

  const [health, setHealth] = useState<any>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [intelligence, setIntelligence] = useState<any>(null);

  // New Document Upload State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeCategoryType>('Company');
  const [newType, setNewType] = useState<'Markdown' | 'PDF' | 'TXT' | 'DOCX' | 'JSON'>('Markdown');
  const [newVisibility, setNewVisibility] = useState<KnowledgeVisibility>('public');
  const [newStatus, setNewStatus] = useState<KnowledgeStatus>('approved');
  const [newContent, setNewContent] = useState('');
  const [uploading, setUploading] = useState(false);

  // RAG Search Test State
  const [testQuery, setTestQuery] = useState('What are the fees for Autonomous AI Agents course?');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [testingSearch, setTestingSearch] = useState(false);

  // Crawler Scan State
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const role = user?.role || 'admin';
      const hRes = await fetch('/api/rag/health');
      if (hRes.ok) setHealth(await hRes.json());

      const kRes = await fetch(`/api/knowledge?role=${role}`);
      if (kRes.ok) {
        const data = await kRes.json();
        setKnowledge(data.knowledge || []);
      }

      const dRes = await fetch(`/api/documents?role=${role}`);
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

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    setUploading(true);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          type: newType,
          visibility: newVisibility,
          status: newStatus,
          content: newContent,
          tags: [newCategory.toLowerCase(), newType.toLowerCase()],
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateDocument = async (id: string, updates: Partial<KnowledgeDocument>) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document from the Knowledge Brain?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestSearch = async () => {
    if (!testQuery.trim()) return;
    setTestingSearch(true);
    try {
      const res = await fetch('/api/rag/test-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, userRole: user?.role || 'admin' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTestingSearch(false);
    }
  };

  const togglePageExclusion = async (path: string, currentExcluded?: boolean) => {
    try {
      const res = await fetch(`/api/intelligence/pages${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isExcluded: !currentExcluded }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
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
              <Database className="w-3.5 h-3.5" /> Nexus Master Knowledge Brain
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Knowledge Management &amp; RAG Controls</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              Back to Command Console
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'documents'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4" /> Document Ingestion &amp; Approval ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('search-test')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'search-test'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Search className="w-4 h-4" /> RAG Vector Search Tester
          </button>
          <button
            onClick={() => setActiveTab('crawler')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'crawler'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Globe className="w-4 h-4" /> Website Sync &amp; Crawler
          </button>
        </div>

        {/* TAB 1: DOCUMENTS INGESTION & APPROVAL */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload / Ingest Form */}
            <CardTilt className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 lg:col-span-1 space-y-6 bg-[#151F40]/90">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" /> Ingest Knowledge Document
              </h3>

              <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 mb-1 block">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Nexus_AI_Security_Policy_v3.md"
                    className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 mb-1 block">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as KnowledgeCategoryType)}
                      className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option>Company</option>
                      <option>Academy</option>
                      <option>Services</option>
                      <option>AI Tools</option>
                      <option>FAQs</option>
                      <option>Policies</option>
                      <option>Support</option>
                      <option>Technical Documentation</option>
                      <option>Internal Knowledge</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Format Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option>Markdown</option>
                      <option>PDF</option>
                      <option>TXT</option>
                      <option>DOCX</option>
                      <option>JSON</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 mb-1 block">Visibility</label>
                    <select
                      value={newVisibility}
                      onChange={(e) => setNewVisibility(e.target.value as KnowledgeVisibility)}
                      className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="public">Public Customer-Facing</option>
                      <option value="internal_only">Internal Staff Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Approval State</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as KnowledgeStatus)}
                      className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="approved">Approved &amp; Published</option>
                      <option value="draft">Draft (Pending Review)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 mb-1 block">Document Content / Text *</label>
                  <textarea
                    required
                    rows={6}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste Markdown, text, or policy document content here..."
                    className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 resize-none font-mono text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>Ingest &amp; Index Document</span>
                </button>
              </form>
            </CardTilt>

            {/* Documents Library Table */}
            <div className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 lg:col-span-2 space-y-6 bg-[#151F40]/80">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" /> Document Library &amp; Approval Matrix
                </h3>
                <button onClick={fetchData} className="p-1 text-slate-400 hover:text-white">
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">v{doc.version}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{doc.category} · {doc.type} ({doc.size})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Visibility Toggle */}
                        <button
                          onClick={() => handleUpdateDocument(doc.id, { visibility: doc.visibility === 'public' ? 'internal_only' : 'public' })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${
                            doc.visibility === 'internal_only'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {doc.visibility === 'internal_only' ? <Lock className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {doc.visibility === 'internal_only' ? 'INTERNAL ONLY' : 'PUBLIC'}
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() => handleUpdateDocument(doc.id, { status: doc.status === 'approved' ? 'draft' : 'approved' })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${
                            doc.status === 'approved'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                          }`}
                        >
                          {doc.status === 'approved' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {doc.status.toUpperCase()}
                        </button>

                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-300 text-[11px] font-mono leading-relaxed bg-[#151F40] p-2.5 rounded-xl border border-white/5 line-clamp-3">
                      {doc.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Chunks: <strong className="text-cyan-400">{doc.chunksCount}</strong> | Approved By: <strong className="text-slate-300">{doc.approvedBy || 'Pending'}</strong></span>
                      <span>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RAG SEARCH TESTER */}
        {activeTab === 'search-test' && (
          <div className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 space-y-6 bg-[#151F40]/90 max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" /> RAG Knowledge Search &amp; Retrieval Tester
            </h3>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Type query to test knowledge search retrieval..."
                className="flex-1 bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleTestSearch}
                disabled={testingSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {testingSearch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Test Retrieval</span>
              </button>
            </div>

            {searchResults && (
              <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Matched Search Chunks: <strong className="text-cyan-400">{searchResults.resultsCount}</strong></span>
                  <span className="font-mono">Role Filter: {user?.role || 'admin'}</span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {searchResults.results.map((res: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-cyan-400">{res.title} ({res.category})</span>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">Score: {res.score}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            res.visibility === 'internal_only' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {res.visibility.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">{res.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WEBSITE CRAWLER & SYNC */}
        {activeTab === 'crawler' && intelligence && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-cyan-400/30 space-y-1">
                <span className="text-xs text-slate-400">Total Website Pages</span>
                <div className="text-2xl font-bold text-white">{intelligence.totalPages}</div>
                <span className="text-[10px] text-cyan-400">{intelligence.indexedPages} active &amp; synced</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-amber-400/30 space-y-1">
                <span className="text-xs text-slate-400">Excluded Pages</span>
                <div className="text-2xl font-bold text-amber-400">{intelligence.excludedPages || 0}</div>
                <span className="text-[10px] text-slate-400">Protected / Restricted</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-400/30 space-y-1">
                <span className="text-xs text-slate-400">Manual Sync Status</span>
                <button
                  onClick={triggerAutonomousScan}
                  disabled={scanning}
                  className="w-full mt-2 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" /> {scanning ? 'Crawling...' : 'Run Website Crawler'}
                </button>
              </div>
            </div>

            {scanMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {scanMessage}
              </div>
            )}

            {/* Discovered Pages Control Table */}
            <div className="glass-panel rounded-3xl border border-[#4263FF]/30 overflow-hidden bg-[#151F40]/90">
              <div className="px-6 py-4 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                <span>Website Route</span>
                <span>Crawler Status &amp; Ingestion Control</span>
              </div>

              <div className="divide-y divide-white/5">
                {intelligence.pages.map((p: any, i: number) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white">{p.title}</span>
                      <span className="text-cyan-400 font-mono text-[11px] block">{p.path}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-mono text-[11px]">{p.contentHash}</span>
                      <button
                        onClick={() => togglePageExclusion(p.path, p.isExcluded)}
                        className={`px-3 py-1 rounded-xl font-bold text-[11px] border transition-all ${
                          p.isExcluded
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {p.isExcluded ? 'EXCLUDED' : 'INDEXED'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
