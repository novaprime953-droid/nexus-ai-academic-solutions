import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES, AI_TOOLS } from '../data/mockData';
import { CardTilt } from '../components/CardTilt';
import {
  PageRoute,
  SupportTicket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  CRMLead,
  ClientRecord,
  ProposalRecord,
  ClientProject,
  LeadStatus,
  LeadPriority,
  ProjectStatus
} from '../types';
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
  Loader2,
  Briefcase,
  FileText,
  Plus,
  ArrowRight,
  Check,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'leads' | 'clients' | 'proposals' | 'projects' | 'tickets' | 'inquiries'
  >('overview');

  // Support Tickets State
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

  // CRM State
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterStatus, setLeadFilterStatus] = useState('All');
  const [leadNoteInput, setLeadNoteInput] = useState('');
  const [qualifyingLead, setQualifyingLead] = useState(false);
  const [leadAiAnalysis, setLeadAiAnalysis] = useState<string | null>(null);

  // New Lead Form State
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadService, setNewLeadService] = useState('AI Automation & Custom Agent Pipelines');
  const [newLeadBudget, setNewLeadBudget] = useState('$10,000 - $25,000');
  const [newLeadDesc, setNewLeadDesc] = useState('');
  const [creatingLead, setCreatingLead] = useState(false);

  // Clients & Proposals & Projects State
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);

  // New Proposal Form State
  const [newPropClient, setNewPropClient] = useState('');
  const [newPropEmail, setNewPropEmail] = useState('');
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropAmount, setNewPropAmount] = useState(15000);
  const [creatingProp, setCreatingProp] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalStudents: 12480,
    activeLearners: 3820,
    coursesPublished: 24,
    enterpriseClients: 185,
    aiInvocationsToday: 1420,
  });

  const fetchCRMData = async () => {
    try {
      const [lRes, cRes, pRes, prjRes, inqRes, tRes, stRes] = await Promise.all([
        fetch('/api/crm/leads'),
        fetch('/api/crm/clients'),
        fetch('/api/crm/proposals'),
        fetch('/api/crm/projects'),
        fetch('/api/inquiries'),
        fetch('/api/tickets?role=admin'),
        fetch('/api/stats')
      ]);

      if (lRes.ok) setLeads((await lRes.json()).leads || []);
      if (cRes.ok) setClients((await cRes.json()).clients || []);
      if (pRes.ok) setProposals((await pRes.json()).proposals || []);
      if (prjRes.ok) setProjects((await prjRes.json()).projects || []);
      if (inqRes.ok) setInquiries((await inqRes.json()).inquiries || []);
      if (tRes.ok) setTickets((await tRes.json()).tickets || []);
      if (stRes.ok) setStats(await stRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCRMData();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadContact || !newLeadEmail) return;
    setCreatingLead(true);

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: newLeadContact,
          companyName: newLeadCompany,
          email: newLeadEmail,
          requiredService: newLeadService,
          budgetRange: newLeadBudget,
          description: newLeadDesc,
          assignedSalesRep: user?.name || 'Marcus Thorne'
        })
      });

      if (res.ok) {
        setNewLeadContact('');
        setNewLeadCompany('');
        setNewLeadEmail('');
        setNewLeadDesc('');
        fetchCRMData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingLead(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchCRMData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvertLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/convert`, { method: 'POST' });
      if (res.ok) {
        fetchCRMData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAiQualifyLead = async (lead: CRMLead) => {
    setQualifyingLead(true);
    try {
      const res = await fetch('/api/crm/ai/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: lead.contactName,
          companyName: lead.companyName,
          requiredService: lead.requiredService,
          budgetRange: lead.budgetRange,
          description: lead.description
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLeadAiAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQualifyingLead(false);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropClient || !newPropTitle) return;
    setCreatingProp(true);

    try {
      const res = await fetch('/api/crm/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: newPropClient,
          clientEmail: newPropEmail,
          title: newPropTitle,
          totalAmountUSD: Number(newPropAmount),
          scopeSummary: 'Enterprise custom software deliverables and milestone architecture.',
          items: [
            { id: 'i1', serviceTitle: newPropTitle, description: 'Core deliverables execution.', deliverables: ['Source Code', 'Architecture Doc'], estimatedDays: 14, priceUSD: Number(newPropAmount) }
          ]
        })
      });

      if (res.ok) {
        setNewPropClient('');
        setNewPropEmail('');
        setNewPropTitle('');
        fetchCRMData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingProp(false);
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
        fetchCRMData();
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
        fetchCRMData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPostingReply(false);
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
              <span>Services CRM &amp; Command Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Enterprise Command &amp; Client Console
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
              onClick={fetchCRMData}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh All Pipeline Data</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview Metrics' },
            { id: 'leads', label: `CRM Leads (${leads.length})` },
            { id: 'clients', label: `Client Directory (${clients.length})` },
            { id: 'proposals', label: `Proposals (${proposals.length})` },
            { id: 'projects', label: `Active Projects (${projects.length})` },
            { id: 'tickets', label: `Support Desk (${tickets.length})` },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})` },
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

        {/* OVERVIEW METRICS */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>CRM Active Pipeline</span>
                  <Briefcase className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{leads.length} Leads</div>
                <span className="text-[10px] text-cyan-400 font-semibold">{leads.filter(l => l.status === 'Qualified').length} Qualified Opportunities</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active Client Projects</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400">${projects.reduce((acc, p) => acc + p.budgetUSD, 0).toLocaleString()} USD</div>
                <span className="text-[10px] text-amber-400 font-semibold">{projects.length} In-Flight Deliverables</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Support Tickets Queue</span>
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{tickets.length}</div>
                <span className="text-[10px] text-cyan-400 font-semibold">{tickets.filter(t => t.status === 'Open').length} Open Tickets</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Client Directory</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{clients.length} Accounts</div>
                <span className="text-[10px] text-emerald-400 font-semibold">100% Active Relationships</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CRM LEADS & SALES PIPELINE */}
        {activeSection === 'leads' && (
          <div className="space-y-8">
            {/* Create Lead Form */}
            <CardTilt className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-4 bg-[#151F40]/90 max-w-4xl mx-auto">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" /> Add New Sales Lead to CRM Pipeline
              </h3>
              <form onSubmit={handleCreateLead} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <input
                  type="text"
                  required
                  value={newLeadContact}
                  onChange={(e) => setNewLeadContact(e.target.value)}
                  placeholder="Contact Name *"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
                <input
                  type="text"
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="Company Name"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
                <input
                  type="email"
                  required
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
                <select
                  value={newLeadService}
                  onChange={(e) => setNewLeadService(e.target.value)}
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option>AI Automation &amp; Custom Agent Pipelines</option>
                  <option>Full-Stack Web &amp; Mobile Software Engineering</option>
                  <option>Cloud Infrastructure &amp; DevOps</option>
                  <option>Security Audit &amp; LLM Vulnerability Defense</option>
                </select>
                <input
                  type="text"
                  value={newLeadBudget}
                  onChange={(e) => setNewLeadBudget(e.target.value)}
                  placeholder="Budget Range"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
                <button
                  type="submit"
                  disabled={creatingLead}
                  className="py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {creatingLead ? 'Adding Lead...' : 'Add Lead to CRM'}
                </button>
              </form>
            </CardTilt>

            {/* Pipeline Table & Conversion */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 lg:col-span-1 bg-[#151F40] max-h-[550px] overflow-y-auto pr-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leads Pipeline Queue</h3>
                {leads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLead(l)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                      selectedLead?.id === l.id ? 'bg-purple-600/20 border-cyan-400/50 shadow-md' : 'bg-[#10172F] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400 font-bold">{l.id}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">{l.status}</span>
                    </div>
                    <h4 className="font-bold text-white">{l.contactName} ({l.companyName})</h4>
                    <span className="text-slate-400 text-[11px] block">{l.requiredService}</span>
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono pt-1">
                      <span>{l.budgetRange}</span>
                      <span>{l.priority} Priority</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 lg:col-span-2 space-y-6 bg-[#151F40]/90 text-xs flex flex-col justify-between min-h-[550px]">
                {selectedLead ? (
                  <>
                    <div className="border-b border-white/10 pb-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-cyan-400 font-mono text-sm font-bold">{selectedLead.id}</span>
                          <h2 className="text-lg font-bold text-white">{selectedLead.contactName} — {selectedLead.companyName}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedLead.status}
                            onChange={(e) => handleUpdateLeadStatus(selectedLead.id, e.target.value as LeadStatus)}
                            className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          >
                            <option>New</option>
                            <option>Contacted</option>
                            <option>Qualified</option>
                            <option>Proposal Sent</option>
                            <option>Negotiation</option>
                            <option>Converted</option>
                            <option>Lost</option>
                          </select>

                          <button
                            onClick={() => handleConvertLead(selectedLead.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1 text-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Convert to Client &amp; Project
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#10172F] p-3 rounded-2xl border border-white/10 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Email:</span>
                          <span className="text-white font-mono">{selectedLead.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Required Service:</span>
                          <span className="text-cyan-400 font-semibold">{selectedLead.requiredService}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Budget &amp; Timeline:</span>
                          <span className="text-amber-400 font-mono">{selectedLead.budgetRange} ({selectedLead.timeline})</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Copilot Lead Qualification Analysis */}
                    <div className="p-4 rounded-2xl bg-[#10172F] border border-cyan-400/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                          <Bot className="w-4 h-4" /> AI Sales Copilot Qualification Analysis
                        </span>
                        <button
                          onClick={() => handleAiQualifyLead(selectedLead)}
                          disabled={qualifyingLead}
                          className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                        >
                          {qualifyingLead ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                          <span>Qualify Lead</span>
                        </button>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap">
                        {leadAiAnalysis || 'Click Qualify Lead to analyze lead requirements and generate discovery questions.'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Internal Notes &amp; Communication History</h4>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {selectedLead.internalNotes.map((note, i) => (
                          <p key={i} className="p-2.5 rounded-xl bg-[#10172F] border border-white/5 text-[11px] text-slate-300">{note}</p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                    <Briefcase className="w-10 h-10 text-purple-400/40" />
                    <p className="text-xs">Select a sales lead from the queue on the left to view details, qualify with AI, or convert to client &amp; project.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: CLIENT DIRECTORY */}
        {activeSection === 'clients' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#151F40]/90 text-xs">
              <div className="px-6 py-4 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                <span>Client &amp; Organization</span>
                <span>Account Manager &amp; Contract Value</span>
              </div>
              <div className="divide-y divide-white/5">
                {clients.map((cli) => (
                  <div key={cli.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono font-bold">{cli.id}</span>
                        <strong className="text-white text-sm">{cli.name} ({cli.companyName})</strong>
                      </div>
                      <span className="text-slate-400 block font-mono">{cli.email} · {cli.country || 'Global'}</span>
                    </div>

                    <div className="space-y-1 text-right font-mono">
                      <span className="text-amber-400 font-bold block text-sm">${cli.totalValueUSD.toLocaleString()} USD</span>
                      <span className="text-slate-400 text-[10px]">Manager: {cli.assignedAccountManager}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROPOSALS & QUOTATIONS */}
        {activeSection === 'proposals' && (
          <div className="space-y-8">
            <CardTilt className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-[#151F40]/90 max-w-4xl mx-auto text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Create Proposal &amp; Formal Quotation
              </h3>
              <form onSubmit={handleCreateProposal} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newPropClient}
                  onChange={(e) => setNewPropClient(e.target.value)}
                  placeholder="Client Name *"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="email"
                  required
                  value={newPropEmail}
                  onChange={(e) => setNewPropEmail(e.target.value)}
                  placeholder="Client Email *"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="text"
                  required
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  placeholder="Proposal Title *"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="number"
                  required
                  value={newPropAmount}
                  onChange={(e) => setNewPropAmount(Number(e.target.value))}
                  placeholder="Quotation Amount ($)"
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
                <button
                  type="submit"
                  disabled={creatingProp}
                  className="sm:col-span-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {creatingProp ? 'Generating...' : 'Dispatch Proposal & Quotation'}
                </button>
              </form>
            </CardTilt>

            <div className="space-y-4 max-w-4xl mx-auto">
              {proposals.map((prop) => (
                <div key={prop.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 bg-[#151F40]/90 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-cyan-400 font-mono font-bold text-xs">{prop.id}</span>
                      <h4 className="text-base font-bold text-white">{prop.title}</h4>
                      <span className="text-slate-400 text-[11px]">{prop.clientName} ({prop.clientEmail})</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-amber-400 font-extrabold text-base block">${prop.totalAmountUSD.toLocaleString()} USD</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-[10px]">{prop.status}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{prop.scopeSummary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ACTIVE PROJECTS */}
        {activeSection === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4 bg-[#151F40]/90 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-cyan-400 font-mono text-xs font-bold">{p.id}</span>
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-bold text-[10px]">
                      {p.status}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{p.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Milestones Completion</span>
                      <span className="font-bold text-cyan-400 font-mono">{p.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-[#10172F] h-2 rounded-full overflow-hidden border border-white/10">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full" style={{ width: `${p.progressPercentage}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10 font-mono">
                    <span>Manager: <strong className="text-slate-200">{p.projectManager}</strong></span>
                    <span className="text-amber-400 font-bold">${p.budgetUSD.toLocaleString()} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
