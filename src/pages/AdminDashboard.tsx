import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES, AI_TOOLS } from '../data/mockData';
import { GNRC_COURSES } from '../data/gnrcData';
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
  SystemAuditLog,
  GNRCAdmissionApplication
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
  ToggleRight,
  GraduationCap,
  Building,
  LogOut,
  Trash2,
  Layers,
  Crown
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageRoute) => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'gnrc' | 'services' | 'users' | 'analytics' | 'settings' | 'health' | 'audit' | 'leads' | 'clients' | 'proposals' | 'projects' | 'tickets' | 'inquiries'
  >('overview');

  // Command Center Overview State
  const [commandData, setCommandData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [usersList, setUsersList] = useState<SystemUserRecord[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Services State
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvCategory, setNewSrvCategory] = useState('AI Solutions');
  const [newSrvPricing, setNewSrvPricing] = useState('$5,000 – $25,000');
  const [newSrvDesc, setNewSrvDesc] = useState('');
  const [creatingSrv, setCreatingSrv] = useState(false);

  // GNRC Admissions State
  const [gnrcAdmissions, setGnrcAdmissions] = useState<GNRCAdmissionApplication[]>([]);
  const [selectedGnrcApp, setSelectedGnrcApp] = useState<GNRCAdmissionApplication | null>(null);
  const [gnrcFilterStatus, setGnrcFilterStatus] = useState<string>('All');
  const [gnrcAdminNoteInput, setGnrcAdminNoteInput] = useState<string>('');

  // Users Filter & Edit State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<SystemUserRecord | null>(null);
  const [selectedUserNewRole, setSelectedUserNewRole] = useState<SystemRole>('Student');

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // CRM State
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);

  // Settings Save State
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);

  const fetchCommandCenterData = async () => {
    const [cmdRes, anaRes, usrRes, setRes, audRes, hltRes, lRes, cRes, pRes, prjRes, tRes, gnrcRes, srvRes] = await Promise.all([
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
      safeFetchJson('/api/tickets?role=admin'),
      safeFetchJson('/api/gnrc/admissions'),
      safeFetchJson('/api/admin/services')
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
    if (tRes.success) setTickets(tRes.data?.tickets || []);
    if (gnrcRes.success) setGnrcAdmissions(gnrcRes.data?.admissions || []);
    if (srvRes.success) setServicesList(srvRes.data?.services || []);
  };

  useEffect(() => {
    fetchCommandCenterData();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvTitle || !newSrvDesc) return;
    setCreatingSrv(true);

    const res = await safeFetchJson('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify({
        title: newSrvTitle,
        category: newSrvCategory,
        pricingRange: newSrvPricing,
        description: newSrvDesc
      })
    });

    if (res.success) {
      setNewSrvTitle('');
      setNewSrvDesc('');
      fetchCommandCenterData();
    }
    setCreatingSrv(false);
  };

  const handleDeleteService = async (srvId: string) => {
    const res = await safeFetchJson(`/api/admin/services/${srvId}`, { method: 'DELETE' });
    if (res.success) {
      fetchCommandCenterData();
    }
  };

  const handleUpdateGnrcStatus = async (appId: string, status: string, assignedInstructor?: string, feeStatus?: string) => {
    const res = await safeFetchJson(`/api/gnrc/admissions/${appId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes: gnrcAdminNoteInput, assignedInstructor, feeStatus })
    });
    if (res.success) {
      setGnrcAdminNoteInput('');
      fetchCommandCenterData();
    }
  };

  const handleConvertGnrcAdmission = async (appId: string) => {
    const res = await safeFetchJson(`/api/gnrc/admissions/${appId}/convert`, { method: 'POST' });
    if (res.success) {
      fetchCommandCenterData();
    }
  };

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

  const handleAdminLogout = async () => {
    await safeFetchJson('/api/admin/auth/logout', { method: 'POST' });
    localStorage.removeItem('nexus_admin_token');
    if (onLogout) onLogout();
    else onNavigate('admin');
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredGnrcApps = gnrcAdmissions.filter(a => gnrcFilterStatus === 'All' || a.status === gnrcFilterStatus);

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
              onClick={() => onNavigate('gnrc')}
              className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <GraduationCap className="w-4 h-4" />
              <span>GNRC Institute</span>
            </button>
            <button
              onClick={() => handleExportCSV('leads')}
              className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchCommandCenterData}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh Metrics</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Session</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Owner Command Center' },
            { id: 'services', label: `Services Management (${servicesList.length})` },
            { id: 'gnrc', label: `GNRC Institute Admissions (${gnrcAdmissions.length})` },
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

        {/* TAB: SERVICES MANAGEMENT CRUD */}
        {activeSection === 'services' && (
          <div className="space-y-8 text-xs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Create Service Form */}
              <div className="glass-panel p-6 rounded-3xl border border-cyan-400/30 space-y-4 bg-[#151F40] lg:col-span-1">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                  <Layers className="w-4 h-4 text-cyan-400" /> Create New Digital Service
                </h3>

                <form onSubmit={handleCreateService} className="space-y-3">
                  <div>
                    <label className="text-slate-400 mb-1 block">Service Title *</label>
                    <input
                      type="text"
                      required
                      value={newSrvTitle}
                      onChange={(e) => setNewSrvTitle(e.target.value)}
                      placeholder="e.g. AI Automation & Custom Agents"
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Service Category</label>
                    <input
                      type="text"
                      value={newSrvCategory}
                      onChange={(e) => setNewSrvCategory(e.target.value)}
                      placeholder="e.g. Software Engineering"
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Pricing Range</label>
                    <input
                      type="text"
                      value={newSrvPricing}
                      onChange={(e) => setNewSrvPricing(e.target.value)}
                      placeholder="e.g. $5,000 – $25,000"
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Service Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={newSrvDesc}
                      onChange={(e) => setNewSrvDesc(e.target.value)}
                      placeholder="Enterprise AI agent workflows and custom web engineering..."
                      className="w-full bg-[#10172F] border border-white/10 rounded-xl p-3 text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingSrv}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {creatingSrv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Publish Digital Service</span>
                  </button>
                </form>
              </div>

              {/* Published Services Grid */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Published Digital Services Directory</span>
                  <span className="text-slate-400 font-mono">{servicesList.length} Active Services</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {servicesList.map((srv) => (
                    <div key={srv.id} className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3 bg-[#151F40]/90 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-cyan-400 font-bold">{srv.id}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded">{srv.status || 'Published'}</span>
                        </div>
                        <strong className="text-white block text-sm">{srv.title}</strong>
                        <p className="text-slate-300 leading-relaxed text-[11px] line-clamp-3">{srv.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-amber-400 font-bold">{srv.pricingRange}</span>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: GNRC INSTITUTE MANAGEMENT */}
        {activeSection === 'gnrc' && (
          <div className="space-y-8 text-xs">
            {/* Overview Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-yellow-400/30 space-y-2 bg-[#151F40]/90">
                <span className="text-slate-400">GNRC Admission Applications</span>
                <div className="text-3xl font-extrabold text-yellow-400">{gnrcAdmissions.length}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">{gnrcAdmissions.filter(a => a.status === 'Approved').length} Approved Candidates</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-cyan-400/30 space-y-2 bg-[#151F40]/90">
                <span className="text-slate-400">GNRC 44 Programs Catalog</span>
                <div className="text-3xl font-extrabold text-cyan-400">{GNRC_COURSES.length} Courses</div>
                <span className="text-[10px] text-slate-400">8 Computer Education Categories</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-400/30 space-y-2 bg-[#151F40]/90">
                <span className="text-slate-400">Enrolled Students</span>
                <div className="text-3xl font-extrabold text-emerald-400">{gnrcAdmissions.filter(a => a.status === 'Enrolled').length}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">Active Lab Cohort 2026</span>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-purple-400/30 space-y-2 bg-[#151F40]/90">
                <span className="text-slate-400">Fee Status Summary</span>
                <div className="text-3xl font-extrabold text-purple-300">
                  {gnrcAdmissions.filter(a => a.feeStatus === 'Installment 1 Paid' || a.feeStatus === 'Fully Paid').length} Paid
                </div>
                <span className="text-[10px] text-amber-400 font-semibold">{gnrcAdmissions.filter(a => a.feeStatus === 'Unpaid').length} Pending Fee</span>
              </div>
            </div>

            {/* Split Screen Applications Queue & Action Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Queue List */}
              <div className="glass-panel p-6 rounded-3xl border border-yellow-400/30 space-y-3 lg:col-span-1 bg-[#151F40] max-h-[550px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Admission Queue</h3>
                  <select
                    value={gnrcFilterStatus}
                    onChange={(e) => setGnrcFilterStatus(e.target.value)}
                    className="bg-[#10172F] border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white"
                  >
                    <option>All</option>
                    <option>Submitted</option>
                    <option>Under Review</option>
                    <option>Approved</option>
                    <option>Enrolled</option>
                  </select>
                </div>

                {filteredGnrcApps.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedGnrcApp(a)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      selectedGnrcApp?.id === a.id ? 'bg-yellow-400/20 border-yellow-400 shadow-md' : 'bg-[#10172F] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-yellow-400 font-bold">{a.id}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        a.status === 'Enrolled' ? 'bg-emerald-500/20 text-emerald-300' :
                        a.status === 'Approved' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                    <strong className="text-white text-xs block truncate">{a.fullName}</strong>
                    <span className="text-slate-300 text-[11px] truncate block">{a.selectedCourseTitle}</span>
                    <span className="text-slate-400 text-[10px] block">{a.preferredClassType} · {a.phone}</span>
                  </div>
                ))}
              </div>

              {/* Action Panel */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-yellow-400/30 lg:col-span-2 space-y-6 bg-[#151F40]/90 flex flex-col justify-between min-h-[550px]">
                {selectedGnrcApp ? (
                  <>
                    <div className="border-b border-white/10 pb-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-yellow-400 font-mono text-xs font-bold">{selectedGnrcApp.id}</span>
                          <h2 className="text-lg font-bold text-white">{selectedGnrcApp.fullName} (S/D of {selectedGnrcApp.fatherGuardianName})</h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={selectedGnrcApp.status}
                            onChange={(e) => handleUpdateGnrcStatus(selectedGnrcApp.id, e.target.value)}
                            className="bg-[#10172F] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          >
                            <option>Submitted</option>
                            <option>Under Review</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                            <option>Enrolled</option>
                          </select>

                          <button
                            onClick={() => handleConvertGnrcAdmission(selectedGnrcApp.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1 text-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Convert to Student Enrollment
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#10172F] p-3.5 rounded-2xl border border-white/10 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Contact Phone / WhatsApp:</span>
                          <span className="text-white font-mono">{selectedGnrcApp.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Selected Course:</span>
                          <span className="text-yellow-400 font-bold">{selectedGnrcApp.selectedCourseTitle}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Delivery &amp; Timing:</span>
                          <span className="text-cyan-400">{selectedGnrcApp.preferredClassType} ({selectedGnrcApp.preferredSchedule})</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 mb-1 block">Assign Lab Instructor</label>
                        <select
                          value={selectedGnrcApp.assignedInstructor || ''}
                          onChange={(e) => handleUpdateGnrcStatus(selectedGnrcApp.id, selectedGnrcApp.status, e.target.value)}
                          className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="">Unassigned</option>
                          <option value="Engr. Shahzaib Khan">Engr. Shahzaib Khan (Web &amp; React)</option>
                          <option value="Sir Rashid Ahmed">Sir Rashid Ahmed (Office Productivity)</option>
                          <option value="Engr. Muhammad Hamza">Engr. Muhammad Hamza (Hardware &amp; Troubleshooting)</option>
                          <option value="Engr. Hassan Ali">Engr. Hassan Ali (Mobile Apps)</option>
                          <option value="Sir Ali Raza">Sir Ali Raza (Game Dev)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 mb-1 block">Admin Admission Notes</label>
                        <textarea
                          rows={3}
                          value={gnrcAdminNoteInput || selectedGnrcApp.adminNotes || ''}
                          onChange={(e) => setGnrcAdminNoteInput(e.target.value)}
                          placeholder="Record admission interview notes, document verification status..."
                          className="w-full bg-[#10172F] border border-white/10 rounded-xl p-3 text-white resize-none"
                        />
                      </div>

                      <button
                        onClick={() => handleUpdateGnrcStatus(selectedGnrcApp.id, selectedGnrcApp.status)}
                        className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold rounded-xl text-xs shadow-md"
                      >
                        Save Application Record
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                    <GraduationCap className="w-10 h-10 text-yellow-400/40" />
                    <p className="text-xs">Select a GNRC admission application from the queue on the left to review, assign an instructor, or approve student enrollment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

            {/* CEO & Company Leadership Settings */}
            <CardTilt className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/30 space-y-4 bg-[#151F40]/90">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Crown className="w-4 h-4 text-amber-400" /> CEO &amp; Leadership Profile Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 mb-1 block">CEO Name</label>
                  <input
                    type="text"
                    value={systemSettings.companyLeadership?.ceoName || 'Musa Aswad'}
                    onChange={(e) => setSystemSettings({ ...systemSettings, companyLeadership: { ...systemSettings.companyLeadership, ceoName: e.target.value } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 mb-1 block">Official Email</label>
                  <input
                    type="email"
                    value={systemSettings.companyLeadership?.officialEmail || 'onlinewow280@gmail.com'}
                    onChange={(e) => setSystemSettings({ ...systemSettings, companyLeadership: { ...systemSettings.companyLeadership, officialEmail: e.target.value } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 mb-1 block">Primary Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={systemSettings.companyLeadership?.primaryContact || '03076159777'}
                    onChange={(e) => setSystemSettings({ ...systemSettings, companyLeadership: { ...systemSettings.companyLeadership, primaryContact: e.target.value } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 mb-1 block">Secondary Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={systemSettings.companyLeadership?.secondaryContact || '03170338486'}
                    onChange={(e) => setSystemSettings({ ...systemSettings, companyLeadership: { ...systemSettings.companyLeadership, secondaryContact: e.target.value } })}
                    className="w-full bg-[#10172F] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveSettingsCategory('companyLeadership', systemSettings.companyLeadership)}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-900 font-bold rounded-xl"
              >
                Save Leadership Settings
              </button>
            </CardTilt>

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
