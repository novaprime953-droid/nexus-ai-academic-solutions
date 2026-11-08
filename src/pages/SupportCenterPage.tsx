import React, { useState, useEffect } from 'react';
import { PageRoute, SupportTicket, TicketCategory, TicketPriority } from '../types';
import { useAuth } from '../context/AuthContext';
import { safeFetchJson } from '../utils/api';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Star,
  ChevronRight,
  Bot,
  User as UserIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface SupportCenterPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'my-tickets'>('create');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@nexusai.com',
    category: 'Technical Support' as TicketCategory,
    priority: 'P3 (Normal)' as TicketPriority,
    subject: '',
    description: '',
  });

  // CSAT Rating State
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [csatSubmitted, setCsatSubmitted] = useState(false);

  const fetchUserTickets = async () => {
    setLoading(true);
    const email = user?.email || 'alex.rivera@nexusai.com';
    const res = await safeFetchJson(`/api/tickets?email=${encodeURIComponent(email)}&role=${user?.role || 'student'}`);
    if (res.success && res.data) {
      setTickets(res.data.tickets || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'my-tickets') {
      fetchUserTickets();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.description) return;

    setSubmitting(true);
    const res = await safeFetchJson('/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        category: formData.category,
        priority: formData.priority,
        subject: formData.subject,
        description: formData.description,
      }),
    });

    if (res.success && res.data) {
      setSubmittedTicket(res.data.ticket);
      setFormData({
        name: user?.name || 'Alex Rivera',
        email: user?.email || 'alex.rivera@nexusai.com',
        category: 'Technical Support',
        priority: 'P3 (Normal)',
        subject: '',
        description: '',
      });
    }
    setSubmitting(false);
  };

  const handlePostReply = async (ticketId: string) => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);

    const res = await safeFetchJson(`/api/tickets/${ticketId}/replies`, {
      method: 'POST',
      body: JSON.stringify({
        senderName: user?.name || 'Alex Rivera',
        senderEmail: user?.email || 'alex.rivera@nexusai.com',
        senderRole: 'customer',
        message: replyMessage,
      }),
    });

    if (res.success) {
      setReplyMessage('');
      // Refresh ticket
      const resTicket = await safeFetchJson(`/api/tickets/${ticketId}?role=${user?.role || 'student'}`);
      if (resTicket.success && resTicket.data) {
        setSelectedTicket(resTicket.data.ticket);
      }
      fetchUserTickets();
    }
    setSendingReply(false);
  };

  const handleCSATSubmit = async (ticketId: string) => {
    const res = await safeFetchJson(`/api/tickets/${ticketId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
    if (res.success) {
      setCsatSubmitted(true);
      fetchUserTickets();
    }
  };

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-400/30 text-blue-400 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" /> Customer Support Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Enterprise Service Desk</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Submit support tickets, track resolutions, and converse with certified software architects and AI support copilots.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => { setActiveTab('create'); setSubmittedTicket(null); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Plus className="w-4 h-4" /> Submit Support Ticket
          </button>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'my-tickets'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Clock className="w-4 h-4" /> My Support Tickets ({tickets.length})
          </button>
        </div>

        {/* TAB 1: CREATE TICKET */}
        {activeTab === 'create' && (
          <div>
            {submittedTicket ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-10 rounded-3xl border border-emerald-400/40 text-center space-y-5 bg-[#151F40] max-w-2xl mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Ticket #{submittedTicket.id} Created</h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, {submittedTicket.customerName}. Your support ticket has been logged with backend ID <span className="font-mono text-cyan-400 font-bold">{submittedTicket.id}</span> and assigned priority <span className="text-amber-400 font-bold">{submittedTicket.priority}</span>.
                </p>

                {submittedTicket.aiDraftReply && (
                  <div className="p-4 rounded-2xl bg-[#10172F] border border-cyan-400/30 text-left text-xs space-y-2">
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> AI Support Copilot Initial Response
                    </span>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{submittedTicket.aiDraftReply}</p>
                  </div>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => { setSelectedTicket(submittedTicket); setActiveTab('my-tickets'); }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/25"
                  >
                    View Ticket Conversation
                  </button>
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              </motion.div>
            ) : (
              <CardTilt className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#4263FF]/30 space-y-6 bg-[#151F40]/90 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 mb-1.5 block font-medium">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Rivera"
                        className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1.5 block font-medium">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@nexusai.com"
                        className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 mb-1.5 block font-medium">Support Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                        className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>Technical Support</option>
                        <option>Academy</option>
                        <option>Enrollment</option>
                        <option>AI Tools</option>
                        <option>Services</option>
                        <option>Billing</option>
                        <option>Account</option>
                        <option>Privacy</option>
                        <option>Complaint</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1.5 block font-medium">Urgency Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                        className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>P4 (Low)</option>
                        <option>P3 (Normal)</option>
                        <option>P2 (High)</option>
                        <option>P1 (Critical)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1.5 block font-medium">Issue Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g., Accessing Cyber Lab 4 Workstation GPU Environment"
                      className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1.5 block font-medium">Detailed Issue Description *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your issue, expected behavior, steps attempted, or custom requirements in detail..."
                      className="w-full bg-[#10172F] border border-[#4263FF]/30 rounded-xl p-3.5 text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Ticket to Service Desk</span>
                  </button>
                </form>
              </CardTilt>
            )}
          </div>
        )}

        {/* TAB 2: MY TICKETS & CONVERSATION */}
        {activeTab === 'my-tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 lg:col-span-1 bg-[#151F40]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">Your Tickets Queue</h3>
                <button onClick={fetchUserTickets} className="p-1 text-slate-400 hover:text-white">
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> Loading tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No active support tickets found for your account.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                        selectedTicket?.id === t.id
                          ? 'bg-blue-600/20 border-cyan-400/50 shadow-md'
                          : 'bg-[#10172F] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded-md border ${
                          t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          t.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                          'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white truncate">{t.subject}</h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{t.category}</span>
                        <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Ticket Conversation View */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#4263FF]/30 lg:col-span-2 space-y-6 bg-[#151F40]/90 flex flex-col justify-between min-h-[500px]">
              {selectedTicket ? (
                <>
                  {/* Header */}
                  <div className="border-b border-white/10 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono text-sm font-bold">{selectedTicket.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs font-semibold text-white">{selectedTicket.category}</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400 font-semibold px-2.5 py-1 bg-amber-400/10 border border-amber-400/30 rounded-lg">
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white">{selectedTicket.subject}</h2>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Assigned Staff: <strong className="text-slate-200">{selectedTicket.assignedStaff || 'Queue Dispatch'}</strong></span>
                      <span>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Thread Replies */}
                  <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] p-2 text-xs">
                    {selectedTicket.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className={`flex flex-col gap-1 p-3.5 rounded-2xl border ${
                          rep.senderRole === 'customer'
                            ? 'bg-blue-600/20 border-blue-400/30 ml-6 text-slate-200'
                            : 'bg-[#10172F] border-white/10 mr-6 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-semibold text-cyan-400 flex items-center gap-1">
                            {rep.senderRole === 'customer' ? <UserIcon className="w-3 h-3" /> : <Bot className="w-3 h-3 text-purple-400" />}
                            {rep.senderName} ({rep.senderRole.toUpperCase()})
                          </span>
                          <span>{new Date(rep.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{rep.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Satisfaction Feedback (if resolved) */}
                  {selectedTicket.status === 'Resolved' && (
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-3">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span>Ticket Resolved — Customer Satisfaction Survey</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setRating(star)}>
                              <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Leave feedback on our support resolution..."
                        className="w-full bg-[#10172F] border border-emerald-500/30 rounded-xl px-3 py-2 text-white text-xs"
                      />
                      <button
                        onClick={() => handleCSATSubmit(selectedTicket.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                      >
                        {csatSubmitted ? 'Feedback Submitted ✓' : 'Submit CSAT Rating'}
                      </button>
                    </div>
                  )}

                  {/* Post Reply Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handlePostReply(selectedTicket.id);
                    }}
                    className="pt-3 border-t border-white/10 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply to support staff..."
                      className="flex-1 bg-[#10172F] border border-[#4263FF]/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !replyMessage.trim()}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 transition-all shadow-md flex items-center gap-1.5"
                    >
                      {sendingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                  <MessageSquare className="w-10 h-10 text-cyan-400/40" />
                  <p className="text-xs">Select a support ticket from the queue on the left to view conversation details.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
