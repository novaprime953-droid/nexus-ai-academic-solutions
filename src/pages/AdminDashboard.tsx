import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES, AI_TOOLS } from '../data/mockData';
import { PageRoute, SupportTicket, TicketStatus, TicketPriority, TicketCategory } from '../types';
import {
  Users,
  BookOpen,
  Mail,
  Cpu,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertCircle,
  Database,
  MessageSquare,
  Shield,
  Bot,
  Send,
  UserCheck,
  Zap,
  Lock,
  Loader2
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'tickets' | 'inquiries' | 'students' | 'courses' | 'tools' | 'analytics'
  >('overview');

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketFilterStatus, setTicketFilterStatus] = useState<string>('All');
  const [ticketFilterCategory, setTicketFilterCategory] = useState<string>('All');
  const [ticketFilterPriority, setTicketFilterPriority] = useState<string>('All');
  const [ticketSearch, setTicketSearch] = useState<string>('');

  const [staffReplyText, setStaffReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState(false);

  const [stats, setStats] = useState<any>({
    totalStudents: 12480,
    activeLearners: 3820,
    coursesPublished: 24,
    enterpriseClients: 185,
    aiInvocationsToday: 1420,
  });

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/tickets?role=admin`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchTickets();
    fetchStats();
  }, []);

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(data.ticket);
        }
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostStaffReply = async (ticketId: string, isInternalNote: boolean) => {
    const text = isInternalNote ? internalNoteText : staffReplyText;
    if (!text.trim()) return;

    setIsPostingReply(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: user?.name || 'Marcus Thorne (Administrator)',
          senderEmail: user?.email || 'admin@nexusai.com',
          senderRole: 'staff',
          message: text,
          isInternalNote,
        }),
      });

      if (res.ok) {
        if (isInternalNote) setInternalNoteText('');
        else setStaffReplyText('');

        const resTicket = await fetch(`/api/tickets/${ticketId}?role=admin`);
        if (resTicket.ok) {
          const data = await resTicket.json();
          setSelectedTicket(data.ticket);
        }
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPostingReply(false);
    }
  };

  const handleGenerateAiDraftReply = async (ticketId: string) => {
    setIsGeneratingAiDraft(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/ai-draft`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStaffReplyText(data.aiDraftReply || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAiDraft(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = ticketFilterStatus === 'All' || t.status === ticketFilterStatus;
    const matchesCategory = ticketFilterCategory === 'All' || t.category === ticketFilterCategory;
    const matchesPriority = ticketFilterPriority === 'All' || t.priority === ticketFilterPriority;
    const matchesSearch =
      !ticketSearch ||
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.customerName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(ticketSearch.toLowerCase());
    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-purple-400 font-semibold uppercase tracking-wider">
                Nexus Administration Core
              </span>
              <span>·</span>
              <span>RBAC Tier: Super Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Command &amp; Academic Console
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Session: {user?.name} ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('knowledge-admin')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-600/25 transition-all"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Knowledge Brain (RAG)</span>
            </button>
            <button
              onClick={() => {
                fetchInquiries();
                fetchTickets();
                fetchStats();
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview Metrics' },
            { id: 'tickets', label: `Support Desk Queue (${tickets.length})` },
            { id: 'inquiries', label: `Client Inquiries (${inquiries.length})` },
            { id: 'students', label: 'Enrolled Students' },
            { id: 'courses', label: 'Academic Programs (9)' },
            { id: 'tools', label: 'AI Tools Telemetry' },
            { id: 'analytics', label: 'Platform Performance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Enrolled Students</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats.totalStudents?.toLocaleString() || '12,480'}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">+14% month-over-month</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Support Tickets Queue</span>
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{tickets.length}</div>
                <span className="text-[10px] text-cyan-400 font-semibold">
                  {tickets.filter(t => t.status === 'Open').length} Open / Unassigned
                </span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Client Inquiries</span>
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{inquiries.length}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {inquiries.filter((i) => i.status === 'new').length} New Pending Action
                </span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>AI Invocations Today</span>
                  <Cpu className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white tabular-nums">
                  {stats.aiInvocationsToday || 1420}
                </div>
                <span className="text-[10px] text-amber-400 font-semibold">Gemini 2.5 Flash Engine</span>
              </div>
            </div>
          </div>
        )}

        {/* SUPPORT DESK QUEUE COMMAND CENTER */}
        {activeSection === 'tickets' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    placeholder="Search ticket ID, name, subject..."
                    className="pl-9 pr-3 py-2 bg-[#10172F] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56"
                  />
                </div>

                <select
                  value={ticketFilterStatus}
                  onChange={(e) => setTicketFilterStatus(e.target.value)}
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option>All Statuses</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Assigned</option>
                  <option>Waiting for Customer</option>
                  <option>Escalated</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>

                <select
                  value={ticketFilterPriority}
                  onChange={(e) => setTicketFilterPriority(e.target.value)}
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option>All Priorities</option>
                  <option>P1 (Critical)</option>
                  <option>P2 (High)</option>
                  <option>P3 (Normal)</option>
                  <option>P4 (Low)</option>
                </select>

                <select
                  value={ticketFilterCategory}
                  onChange={(e) => setTicketFilterCategory(e.target.value)}
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option>All Categories</option>
                  <option>Technical Support</option>
                  <option>Academy</option>
                  <option>Services</option>
                  <option>Billing</option>
                  <option>Account</option>
                  <option>Privacy</option>
                  <option>Complaint</option>
                </select>
              </div>

              <div className="text-slate-400 font-mono text-[11px]">
                Showing {filteredTickets.length} of {tickets.length} tickets
              </div>
            </div>

            {/* Split Screen Queue & Ticket Detail Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Queue List */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 lg:col-span-1 bg-[#151F40] max-h-[600px] overflow-y-auto pr-1">
                {filteredTickets.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No matching support tickets found.
                  </div>
                ) : (
                  filteredTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                        selectedTicket?.id === t.id
                          ? 'bg-purple-600/20 border-purple-400/50 shadow-md'
                          : 'bg-[#10172F] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${
                          t.priority.includes('P1') ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          t.priority.includes('P2') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white truncate">{t.subject}</h4>
                      <p className="text-[11px] text-slate-300 truncate">{t.customerName} ({t.customerEmail})</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{t.status}</span>
                        <span>{new Date(t.updatedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selected Ticket Action Command Center */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 lg:col-span-2 space-y-6 bg-[#151F40]/90 flex flex-col justify-between min-h-[600px]">
                {selectedTicket ? (
                  <>
                    {/* Header Controls */}
                    <div className="border-b border-white/10 pb-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-mono text-base font-bold">{selectedTicket.id}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs font-semibold text-white">{selectedTicket.category}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quick Escalation Button */}
                          <button
                            onClick={() => handleUpdateTicket(selectedTicket.id, { status: 'Escalated', priority: 'P1 (Critical)' })}
                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Escalate to P1
                          </button>

                          <select
                            value={selectedTicket.status}
                            onChange={(e) => handleUpdateTicket(selectedTicket.id, { status: e.target.value as TicketStatus })}
                            className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Assigned</option>
                            <option>Waiting for Customer</option>
                            <option>Escalated</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                          </select>
                        </div>
                      </div>

                      <h2 className="text-lg font-bold text-white">{selectedTicket.subject}</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#10172F] p-3 rounded-2xl border border-white/10">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Customer:</span>
                          <span className="text-white font-semibold">{selectedTicket.customerName} ({selectedTicket.customerEmail})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Assigned Staff:</span>
                          <select
                            value={selectedTicket.assignedStaff || ''}
                            onChange={(e) => handleUpdateTicket(selectedTicket.id, { assignedStaff: e.target.value, status: 'Assigned' })}
                            className="bg-transparent border-none text-cyan-400 font-semibold focus:outline-none"
                          >
                            <option value="">Unassigned Queue</option>
                            <option value="Marcus Thorne (Administrator)">Marcus Thorne (Admin)</option>
                            <option value="Dr. Evelyn Sterling">Dr. Evelyn Sterling</option>
                            <option value="Kaelen Vance">Kaelen Vance</option>
                            <option value="Sarah Chen">Sarah Chen (CISO)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Replies Thread */}
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] p-2 text-xs">
                      {selectedTicket.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                            rep.isInternalNote
                              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                              : rep.senderRole === 'staff'
                              ? 'bg-purple-900/20 border-purple-400/30 text-slate-200'
                              : 'bg-[#10172F] border-white/10 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                            <span className="font-semibold text-cyan-400 flex items-center gap-1">
                              {rep.isInternalNote && <Lock className="w-3 h-3 text-amber-400" />}
                              {rep.senderName} ({rep.isInternalNote ? 'INTERNAL NOTE' : rep.senderRole.toUpperCase()})
                            </span>
                            <span>{new Date(rep.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed">{rep.message}</p>
                        </div>
                      ))}
                    </div>

                    {/* AI Copilot Draft Response Generator */}
                    <div className="p-3 rounded-2xl bg-[#10172F] border border-cyan-400/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-[11px]">
                          <Bot className="w-4 h-4" /> AI Support Copilot Draft
                        </span>
                        <button
                          onClick={() => handleGenerateAiDraftReply(selectedTicket.id)}
                          disabled={isGeneratingAiDraft}
                          className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                        >
                          {isGeneratingAiDraft ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                          <span>Generate Copilot Reply</span>
                        </button>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {selectedTicket.aiDraftReply || 'Click Generate Copilot Reply to synthesize response via Master Knowledge Base.'}
                      </p>
                    </div>

                    {/* Staff Reply & Internal Note Controls */}
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Public Staff Reply */}
                        <div className="space-y-2">
                          <label className="text-slate-400 text-[10px] uppercase font-semibold block">Public Staff Reply (Customer Visible)</label>
                          <textarea
                            rows={3}
                            value={staffReplyText}
                            onChange={(e) => setStaffReplyText(e.target.value)}
                            placeholder="Type customer reply..."
                            className="w-full bg-[#10172F] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                          />
                          <button
                            onClick={() => handlePostStaffReply(selectedTicket.id, false)}
                            disabled={isPostingReply || !staffReplyText.trim()}
                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
                          >
                            <Send className="w-3.5 h-3.5" /> Send Public Reply
                          </button>
                        </div>

                        {/* Internal Note */}
                        <div className="space-y-2">
                          <label className="text-amber-400 text-[10px] uppercase font-semibold block flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Internal Note (Staff Only)
                          </label>
                          <textarea
                            rows={3}
                            value={internalNoteText}
                            onChange={(e) => setInternalNoteText(e.target.value)}
                            placeholder="Add private staff note..."
                            className="w-full bg-amber-950/20 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-200 focus:outline-none focus:border-amber-400 resize-none"
                          />
                          <button
                            onClick={() => handlePostStaffReply(selectedTicket.id, true)}
                            disabled={isPostingReply || !internalNoteText.trim()}
                            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
                          >
                            <Lock className="w-3.5 h-3.5" /> Add Internal Note
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                    <Shield className="w-10 h-10 text-purple-400/40" />
                    <p className="text-xs">Select a support ticket from the queue on the left to review, assign staff, post replies, or add internal notes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* INQUIRIES SECTION */}
        {activeSection === 'inquiries' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#151F40]">
              <div className="px-6 py-4 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                <span>Inquirer &amp; Scope</span>
                <span>Budget &amp; Status</span>
              </div>
              <div className="divide-y divide-white/5">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm">{inq.name} ({inq.email})</div>
                      <div className="text-cyan-400 font-semibold">{inq.service}</div>
                      <p className="text-slate-300 leading-relaxed max-w-xl">{inq.message}</p>
                    </div>

                    <div className="space-y-2 text-right">
                      <div className="font-mono text-amber-400">{inq.budget}</div>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                        className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      >
                        <option value="new">New Inquiry</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
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
