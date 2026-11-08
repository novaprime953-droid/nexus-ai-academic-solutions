import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES, AI_TOOLS } from '../data/mockData';
import { CardTilt } from '../components/CardTilt';
import { safeFetchJson } from '../utils/api';
import { motion, AnimatePresence } from 'motion/react';
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
  ProjectStatus,
  SystemUserRecord,
  SystemRole,
  SystemSettings,
  SystemAuditLog
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
  UserPlus,
  Download,
  Settings,
  Activity,
  Globe,
  UserX,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'users' | 'analytics' | 'settings' | 'health' | 'audit' | 'leads' | 'clients' | 'proposals' | 'projects' | 'tickets' | 'inquiries'
  >('overview');

  // Command Center Overview State
  const [commandData, setCommandData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [usersList, setUsersList] = useState<SystemUserRecord[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Users Filter & Edit State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<SystemUserRecord | null>(null);
  const [selectedUserNewRole, setSelectedUserNewRole] = useState<SystemRole>('Student');

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
  const [leadAiAnalysis, setLeadAiAnalysis] = useState<string | null>(null);
  const [qualifyingLead, setQualifyingLead] = useState(false);

  // New Lead Form
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadService, setNewLeadService] = useState('AI Automation & Custom Agent Pipelines');
  const [newLeadBudget, setNewLeadBudget] = useState('$10,000 - $25,000');
  const [newLeadDesc, setNewLeadDesc] = useState('');
  const [creatingLead, setCreatingLead] = useState(false);

  // Clients, Proposals, Projects
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Settings Save State
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);

  const fetchCommandCenterData = async () => {
    const [cmdRes, anaRes, usrRes, setRes, audRes, hltRes, lRes, cRes, pRes, prjRes, inqRes, tRes] = await Promise.all([
      safeFetchJson('/api/admin/command-center'),
      safeFetchJson('/api/admin/analytics?range=30d'),
      safeFetchJson('/api/admin/users'),
      safeFetchJson('/api/admin/settings'),
      safeFetchJson('/api/admin/audit-logs'),
      safeFetchJson('/api/admin/health'),
      safeFetchJson('/api/crm/leads'),
      safeFetchJson('/api/crm/clients'),
      safeFetchJson('/api/crm/proposals'),
      safeFetchJson('/api/crm/projects'),
      safeFetchJson('/api/inquiries'),
      safeFetchJson('/api/tickets?role=admin')
    ]);

    if (cmdRes.success) setCommandData(cmdRes.data);
    if (anaRes.success) setAnalyticsData(anaRes.data);
    if (usrRes.success) setUsersList(usrRes.data?.users || []);
    if (setRes.success) setSystemSettings(setRes.data?.settings);
    if (audRes.success) setAuditLogs(audRes.data?.auditLogs || []);
    if (hltRes.success) setSystemHealth(hltRes.data);
    if (lRes.success) setLeads(lRes.data?.leads || []);
    if (cRes.success) setClients(cRes.data?.clients || []);
    if (pRes.success) setProposals(pRes.data?.proposals || []);
    if (prjRes.success) setProjects(prjRes.data?.projects || []);
    if (inqRes.success) setInquiries(inqRes.data?.inquiries || []);
    if (tRes.success) setTickets(tRes.data?.tickets || []);
  };

  useEffect(() => {
    fetchCommandCenterData();
  }, []);

  const handleUpdateUserRole = async (userId: string, newRole: SystemRole, status?: 'Active' | 'Suspended') => {
    const res = await safeFetchJson(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole, status, actorRole: user?.role || 'admin' })
    });

    if (res.success) {
      setSelectedUserToEdit(null);
      fetchCommandCenterData();
    } else {
      alert(res.error || 'Permission denied: Cannot modify user role.');
    }
  };

  const handleSaveSettingsCategory = async (category: string, updates: any) => {
    setSettingsSaving(true);
    setSettingsSavedMsg(null);

    const res = await safeFetchJson('/api/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ category, updates })
    });

    if (res.success) {
      setSettingsSavedMsg(`Category ${category} updated successfully.`);
      fetchCommandCenterData();
    }
    setSettingsSaving(false);
  };

  const handleExportCSV = (type: string) => {
    window.open(`/api/admin/export/${type}`, '_blank');
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadContact || !newLeadEmail) return;
    setCreatingLead(true);

    const res = await safeFetchJson('/api/crm/leads', {
      method: 'POST',
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

    if (res.success) {
      setNewLeadContact('');
      setNewLeadCompany('');
      setNewLeadEmail('');
      setNewLeadDesc('');
      fetchCommandCenterData();
    }
    setCreatingLead(false);
  };

  const handleConvertLead = async (leadId: string) => {
    const res = await safeFetchJson(`/api/crm/leads/${leadId}/convert`, { method: 'POST' });
    if (res.success) {
      fetchCommandCenterData();
    }
  };

  const handleAiQualifyLead = async (lead: CRMLead) => {
    setQualifyingLead(true);
    const res = await safeFetchJson('/api/crm/ai/qualify-lead', {
      method: 'POST',
      body: JSON.stringify({
        contactName: lead.contactName,
        companyName: lead.companyName,
        requiredService: lead.requiredService,
        budgetRange: lead.budgetRange,
        description: lead.description
      })
    });

    if (res.success) {
      setLeadAiAnalysis(res.data?.analysis || 'Lead analysis completed.');
    }
    setQualifyingLead(false);
  };

  const handleUpdateTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
    const res = await safeFetchJson(`/api/tickets/${ticketId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (res.success) {
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(res.data.ticket);
      }
      fetchCommandCenterData();
    }
  };

  const handlePostStaffReply = async (ticketId: string, isInternalNote: boolean) => {
    const text = isInternalNote ? internalNoteText : staffReplyText;
    if (!text.trim()) return;

    setIsPostingReply(true);
    const res = await safeFetchJson(`/api/tickets/${ticketId}/replies`, {
      method: 'POST',
      body: JSON.stringify({
        senderName: user?.name || 'Marcus Thorne (Administrator)',
        senderEmail: user?.email || 'admin@nexusai.com',
        senderRole: 'staff',
        message: text,
        isInternalNote,
      }),
    });

    if (res.success) {
      if (isInternalNote) setInternalNoteText('');
      else setStaffReplyText('');

      const resTicket = await safeFetchJson(`/api/tickets/${ticketId}?role=admin`);
      if (resTicket.success) {
        setSelectedTicket(resTicket.data.ticket);
      }
      fetchCommandCenterData();
    }
    setIsPostingReply(false);
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-purple-400 font-semibold uppercase tracking-wider">
                Nexus Owner &amp; Super Admin Core
              </span>
              <span>·</span>
              <span>RBAC Role: {user?.role || 'Super Admin'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Owner Command Center &amp; System Settings
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Session: {user?.name} ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExportCSV('leads')}
              className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => onNavigate('knowledge-admin')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-600/25 transition-all"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Knowledge Brain</span>
            </button>
            <button
              onClick={fetchCommandCenterData}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Owner Command Center' },
            { id: 'users', label: `Users & Roles (${usersList.length})` },
            { id: 'analytics', label: 'Advanced Analytics' },
            { id: 'settings', label: 'System Settings' },
            { id: 'health', label: 'System Health & Monitoring' },
            { id: 'audit', label: `Security Audit Logs (${auditLogs.length})` },
            { id: 'leads', label: `CRM Leads (${leads.length})` },
            { id: 'projects', label: `Active Projects (${projects.length})` },
            { id: 'tickets', label: `Support Desk (${tickets.length})` },
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

        {/* TAB 1: OWNER COMMAND CENTER OVERVIEW */}
        {activeSection === 'overview' && commandData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Registered Users</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{commandData.metrics.registeredUsers}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">{commandData.metrics.activeUsers} Active Accounts</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Contract Value</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400">${commandData.metrics.totalRevenueUSD?.toLocaleString()} USD</div>
                <span className="text-[10px] text-amber-400 font-semibold">{commandData.metrics.activeProjectsCount} In-Flight Projects</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active CRM Leads</span>
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{commandData.metrics.crmLeadsCount}</div>
                <span className="text-[10px] text-cyan-400 font-semibold">{commandData.metrics.pendingProposalsCount} Sent Proposals</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Support Tickets Queue</span>
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{commandData.metrics.ticketsOpenCount} Open</div>
                <span className="text-[10px] text-red-400 font-semibold">{commandData.metrics.ticketsEscalatedCount} P1 Escalated</span>
              </div>
            </div>

            {/* Recent Operational Activity Stream */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 bg-[#151F40]/90 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Real-Time Operational System Activity
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {commandData.recentActivities?.map((act: any) => (
                  <div key={act.id} className="p-3 rounded-xl bg-[#10172F] border border-white/5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{act.action} — {act.targetEntity}</span>
                      <span className="text-slate-400 text-[10px]">{act.details}</span>
                    </div>
                    <div className="text-right font-mono text-[10px] text-slate-400">
                      <span className="text-cyan-400 block">{act.actorName}</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER & ROLE MANAGEMENT */}
        {activeSection === 'users' && (
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search user name or email..."
                    className="pl-9 pr-3 py-2 bg-[#10172F] border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-60"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option>All Roles</option>
                  <option>Owner</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Instructor</option>
                  <option>Student</option>
                  <option>Client</option>
                </select>
              </div>

              <div className="text-slate-400 font-mono text-[11px]">
                Showing {filteredUsers.length} of {usersList.length} registered accounts
              </div>
            </div>

            {/* Users Directory Table */}
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#151F40]/90 text-xs">
              <div className="px-6 py-4 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                <span>User Identity &amp; Email</span>
                <span>Role &amp; Account Status</span>
              </div>
              <div className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={u.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                      <div>
                        <strong className="text-white text-sm block">{u.name}</strong>
                        <span className="text-slate-400 font-mono text-[11px]">{u.email} · ID: {u.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono border ${
                        u.role === 'Owner' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                        u.role === 'Instructor' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                        'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        {u.role}
                      </span>

                      <button
                        onClick={() => handleUpdateUserRole(u.id, u.role, u.status === 'Active' ? 'Suspended' : 'Active')}
                        className={`px-3 py-1 rounded-xl font-semibold text-[11px] border transition-all ${
                          u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        {u.status}
                      </button>

                      <button
                        onClick={() => { setSelectedUserToEdit(u); setSelectedUserNewRole(u.role); }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-xl"
                      >
                        Edit Role
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADVANCED ANALYTICS & CSV REPORTS */}
        {activeSection === 'analytics' && analyticsData && (
          <div className="space-y-8 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-cyan-400/30 space-y-2">
                <span className="text-slate-400">CRM Lead Conversion Rate</span>
                <div className="text-3xl font-extrabold text-cyan-400">{analyticsData.conversionRate}</div>
                <span className="text-[10px] text-slate-400">Leads Converted to Active Clients</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-purple-400/30 space-y-2">
                <span className="text-slate-400">Proposal Acceptance Rate</span>
                <div className="text-3xl font-extrabold text-purple-400">{analyticsData.proposalAcceptanceRate}</div>
                <span className="text-[10px] text-slate-400">Quotations Accepted by Clients</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-400/30 space-y-2">
                <span className="text-slate-400">Academy Quiz Pass Rate</span>
                <div className="text-3xl font-extrabold text-emerald-400">{analyticsData.quizPassRate}</div>
                <span className="text-[10px] text-slate-400">Passed Assessment Attempts</span>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 bg-[#151F40]/90">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> Exportable Operational Reports
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleExportCSV('leads')}
                  className="p-4 rounded-2xl bg-[#10172F] border border-white/10 hover:border-cyan-400 text-left space-y-1 transition-all"
                >
                  <strong className="text-white block text-sm flex items-center justify-between">
                    Leads Pipeline CSV <Download className="w-4 h-4 text-cyan-400" />
                  </strong>
                  <span className="text-slate-400 text-[11px]">Export full CRM leads data.</span>
                </button>

                <button
                  onClick={() => handleExportCSV('tickets')}
                  className="p-4 rounded-2xl bg-[#10172F] border border-white/10 hover:border-purple-400 text-left space-y-1 transition-all"
                >
                  <strong className="text-white block text-sm flex items-center justify-between">
                    Support Tickets CSV <Download className="w-4 h-4 text-purple-400" />
                  </strong>
                  <span className="text-slate-400 text-[11px]">Export service desk ticket queue.</span>
                </button>

                <button
                  onClick={() => handleExportCSV('financials')}
                  className="p-4 rounded-2xl bg-[#10172F] border border-white/10 hover:border-amber-400 text-left space-y-1 transition-all"
                >
                  <strong className="text-white block text-sm flex items-center justify-between">
                    Project Financials CSV <Download className="w-4 h-4 text-amber-400" />
                  </strong>
                  <span className="text-slate-400 text-[11px]">Export contract budget values.</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CENTRALIZED SYSTEM SETTINGS */}
        {activeSection === 'settings' && systemSettings && (
          <div className="space-y-8 max-w-4xl mx-auto text-xs">
            {settingsSavedMsg && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {settingsSavedMsg}
              </div>
            )}

            {/* General Settings */}
            <CardTilt className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 bg-[#151F40]/90">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Settings className="w-4 h-4 text-cyan-400" /> General Platform Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 mb-1 block">Company Name</label>
                  <input
                    type="text"
                    value={systemSettings.general.companyName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, general: { ...systemSettings.general, companyName: e.target.value } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 mb-1 block">Website Title</label>
                  <input
                    type="text"
                    value={systemSettings.general.websiteTitle}
                    onChange={(e) => setSystemSettings({ ...systemSettings, general: { ...systemSettings.general, websiteTitle: e.target.value } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveSettingsCategory('general', systemSettings.general)}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl"
              >
                Save General Settings
              </button>
            </CardTilt>

            {/* AI Engine Settings */}
            <CardTilt className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-4 bg-[#151F40]/90">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Bot className="w-4 h-4 text-cyan-400" /> AI Engine &amp; Gemini Model Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 mb-1 block">Model Name</label>
                  <input
                    type="text"
                    readOnly
                    value={systemSettings.ai.modelName}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-cyan-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 mb-1 block">Max Output Tokens</label>
                  <input
                    type="number"
                    value={systemSettings.ai.maxTokens}
                    onChange={(e) => setSystemSettings({ ...systemSettings, ai: { ...systemSettings.ai, maxTokens: Number(e.target.value) } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 mb-1 block">Temperature</label>
                  <input
                    type="number"
                    step={0.1}
                    value={systemSettings.ai.temperature}
                    onChange={(e) => setSystemSettings({ ...systemSettings, ai: { ...systemSettings.ai, temperature: Number(e.target.value) } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveSettingsCategory('ai', systemSettings.ai)}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white font-semibold rounded-xl"
              >
                Save AI Settings
              </button>
            </CardTilt>
          </div>
        )}

        {/* TAB 5: SYSTEM HEALTH & MONITORING */}
        {activeSection === 'health' && systemHealth && (
          <div className="space-y-6 text-xs max-w-4xl mx-auto">
            <div className="glass-panel p-8 rounded-3xl border border-emerald-400/30 space-y-6 bg-[#151F40]/90">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" /> Operational System Health &amp; Monitoring
                </h3>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 rounded-full">
                  {systemHealth.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-1">
                  <span className="text-slate-400">API Gateway Status</span>
                  <strong className="text-white block text-sm">{systemHealth.apiGateway}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-1">
                  <span className="text-slate-400">Backend Uptime</span>
                  <strong className="text-white block text-sm">{systemHealth.backendUptime}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-1">
                  <span className="text-slate-400">Google Gemini 2.5 Flash API</span>
                  <strong className="text-cyan-400 block text-sm">{systemHealth.geminiApi?.status} ({systemHealth.geminiApi?.model})</strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-1">
                  <span className="text-slate-400">Vector Database</span>
                  <strong className="text-purple-400 block text-sm">{systemHealth.database}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY AUDIT LOGS */}
        {activeSection === 'audit' && (
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#151F40]/90 text-xs">
            <div className="px-6 py-4 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
              <span>Audit Action &amp; Target</span>
              <span>Actor &amp; Outcome</span>
            </div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="space-y-0.5">
                    <strong className="text-white text-sm block">{log.action} — {log.targetEntity}</strong>
                    <span className="text-slate-300 text-[11px]">{log.details}</span>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-cyan-400 block">{log.actorName} ({log.actorEmail})</span>
                    <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CRM LEADS */}
        {activeSection === 'leads' && (
          <div className="space-y-6 text-xs">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 bg-[#151F40]">
              <h3 className="text-sm font-bold text-white">Active CRM Leads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((l) => (
                  <div key={l.id} className="p-4 rounded-2xl bg-[#10172F] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-cyan-400 font-bold">{l.id}</span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold">{l.status}</span>
                    </div>
                    <strong className="text-white block text-sm">{l.contactName} ({l.companyName})</strong>
                    <p className="text-slate-300">{l.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-amber-400">
                      <span>{l.budgetRange}</span>
                      <button onClick={() => handleConvertLead(l.id)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
                        Convert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ACTIVE PROJECTS */}
        {activeSection === 'projects' && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 bg-[#151F40]/90">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-cyan-400 font-mono font-bold">{p.id}</span>
                    <span className="px-2.5 py-0.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-full font-bold text-[10px]">{p.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <p className="text-slate-300">{p.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-slate-400 font-mono">
                    <span>Manager: {p.projectManager}</span>
                    <span className="text-amber-400 font-bold">${p.budgetUSD?.toLocaleString()} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SUPPORT DESK */}
        {activeSection === 'tickets' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-[#151F40]/90 text-xs">
            <h3 className="text-sm font-bold text-white">Service Desk Queue ({tickets.length})</h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-[#10172F] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono font-bold">{t.id}</span>
                      <strong className="text-white">{t.subject}</strong>
                    </div>
                    <span className="text-slate-400 text-[11px]">{t.customerName} ({t.customerEmail})</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30 rounded-lg">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT USER ROLE MODAL */}
        <AnimatePresence>
          {selectedUserToEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="glass-panel w-full max-w-md rounded-3xl border border-purple-400/40 bg-[#151F40] p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white">Modify User Access Role</h3>
                  <button onClick={() => setSelectedUserToEdit(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">User Name:</span>
                    <strong className="text-white">{selectedUserToEdit.name} ({selectedUserToEdit.email})</strong>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Assign Role</label>
                    <select
                      value={selectedUserNewRole}
                      onChange={(e) => setSelectedUserNewRole(e.target.value as SystemRole)}
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      <option>Student</option>
                      <option>Instructor</option>
                      <option>Sales Representative</option>
                      <option>Sales Manager</option>
                      <option>Project Manager</option>
                      <option>Academy Admin</option>
                      <option>Admin</option>
                      <option>Super Admin</option>
                      <option>Owner</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleUpdateUserRole(selectedUserToEdit.id, selectedUserNewRole)}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold rounded-xl shadow-md transition-all"
                  >
                    Update User Role
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
