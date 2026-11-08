import React, { useState, useEffect } from 'react';
import { PageRoute, ClientProject, ProposalRecord, ClientRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Shield,
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
  Upload,
  Download,
  Check,
  X,
  MessageSquare,
  DollarSign,
  Loader2,
  RefreshCw,
  Award,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface ClientPortalPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'proposals' | 'documents'>('projects');
  const [clientData, setClientData] = useState<{ client: ClientRecord; projects: ClientProject[]; proposals: ProposalRecord[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<ProposalRecord | null>(null);
  const [proposalActioning, setProposalActioning] = useState(false);

  const fetchClientPortalData = async () => {
    setLoading(true);
    try {
      const email = user?.email || 'elena@biomedx.org';
      const res = await fetch(`/api/client-portal/dashboard?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setClientData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientPortalData();
  }, []);

  const handleRespondProposal = async (propId: string, status: 'Accepted' | 'Rejected') => {
    setProposalActioning(true);
    try {
      const res = await fetch(`/api/crm/proposals/${propId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, clientFeedback: feedbackText })
      });
      if (res.ok) {
        setFeedbackText('');
        setSelectedProposal(null);
        fetchClientPortalData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProposalActioning(false);
    }
  };

  const handleSendProjectFeedback = async (projectId: string) => {
    if (!feedbackText.trim()) return;
    try {
      const res = await fetch(`/api/crm/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientFeedback: feedbackText })
      });
      if (res.ok) {
        setFeedbackText('');
        fetchClientPortalData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Client Portal &amp; Deliverables Vault
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Enterprise Client Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Logged in as: <strong className="text-white">{user?.name || 'Elena Rostova'}</strong> ({user?.email || 'elena@biomedx.org'})</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('support-center')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
            >
              Open Support Ticket
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Request New Consultation
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Active Projects ({clientData?.projects.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'proposals'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4" /> Proposals &amp; Quotations ({clientData?.proposals.length || 0})
          </button>
        </div>

        {/* TAB 1: ACTIVE PROJECTS & MILESTONES */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> Loading client projects...
              </div>
            ) : !clientData || clientData.projects.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active projects found for your account.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {clientData.projects.map((p) => (
                  <CardTilt key={p.id} className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 space-y-6 bg-[#151F40]/90">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold rounded-full">
                        {p.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Target: {new Date(p.expectedCompletionDate).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">{p.id}</span>
                      <h3 className="text-xl font-bold text-white">{p.title}</h3>
                      <p className="text-xs text-slate-300">{p.description}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Milestones Progress</span>
                        <span className="font-bold text-cyan-400 font-mono">{p.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-[#10172F] h-2.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${p.progressPercentage}%` }} />
                      </div>
                    </div>

                    {/* Milestones List */}
                    <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Milestones</h4>
                      <div className="space-y-1.5">
                        {p.milestones.map((m) => (
                          <div key={m.id} className="p-2.5 rounded-xl bg-[#10172F] border border-white/5 flex items-center justify-between">
                            <span className={`font-semibold ${m.completed ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>
                              {m.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] ${m.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                              {m.completed ? 'Completed ✓' : 'In Progress'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {p.clientFeedback && (
                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                        <strong className="block text-[10px] text-cyan-400">Approved Feedback:</strong>
                        {p.clientFeedback}
                      </div>
                    )}

                    <div className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Leave feedback on current milestone..."
                        className="flex-1 bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        onClick={() => handleSendProjectFeedback(p.id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl hover:from-blue-500 transition-all shadow-md"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </CardTilt>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROPOSALS & QUOTATIONS */}
        {activeTab === 'proposals' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {!clientData || clientData.proposals.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No proposals or formal quotations sent yet.
              </div>
            ) : (
              clientData.proposals.map((prop) => (
                <div key={prop.id} className="glass-panel p-8 rounded-3xl border border-purple-500/30 space-y-6 bg-[#151F40]/90">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-cyan-400 font-mono text-xs font-bold">{prop.id}</span>
                      <h3 className="text-xl font-bold text-white">{prop.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      prop.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                      prop.status === 'Sent' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">{prop.scopeSummary}</p>

                  {/* Scope Items */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Itemized Deliverables &amp; Quotation</h4>
                    {prop.items.map((item) => (
                      <div key={item.id} className="p-3.5 rounded-2xl bg-[#10172F] border border-white/5 flex items-center justify-between">
                        <div>
                          <strong className="text-white block">{item.serviceTitle}</strong>
                          <span className="text-slate-400 text-[11px]">{item.description}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-amber-400 font-bold block">${item.priceUSD.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500">{item.estimatedDays} Days</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">TOTAL QUOTATION VALUE</span>
                      <strong className="text-2xl font-extrabold text-amber-400 font-mono">${prop.totalAmountUSD.toLocaleString()} USD</strong>
                    </div>

                    {prop.status === 'Sent' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespondProposal(prop.id, 'Accepted')}
                          disabled={proposalActioning}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Accept Proposal
                        </button>
                        <button
                          onClick={() => handleRespondProposal(prop.id, 'Rejected')}
                          disabled={proposalActioning}
                          className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
