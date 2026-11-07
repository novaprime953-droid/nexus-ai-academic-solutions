import React, { useState } from 'react';
import { PageRoute } from '../types';
import { HelpCircle, Search, BookOpen, MessageSquare, ArrowRight, Shield, Cpu, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface HelpCenterPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { q: 'How do I access online and physical academy courses?', a: 'Once enrolled through the Academy or Course catalog, your classes appear immediately in your Student Dashboard. Physical courses list building and room numbers.' },
    { q: 'Are the AI tools using real Gemini API processing?', a: 'Yes. All AI tools in our directory connect directly via server-side Google GenAI SDK (Gemini 3.8 Flash) with zero simulated outputs.' },
    { q: 'How do I submit support tickets or request consulting?', a: 'You can reach out through our Contact Consultation page or open a support ticket directly in the Support Center.' },
    { q: 'What are the certificate requirements for courses?', a: 'Students must complete 100% of lessons, assignments, and achieve a passing score on course quizzes to automatically unlock verified digital certificates.' },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs;

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" /> Nexus Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">How can we assist your journey?</h1>
          <p className="text-slate-300 text-sm sm:text-base">Search our knowledge base or browse frequently asked questions below.</p>

          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles (e.g. certificates, API keys, enrollment)..."
              className="w-full bg-[#151F40] border border-cyan-400/30 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFaqs.map((faq, i) => (
            <CardTilt key={i} className="glass-panel p-6 rounded-2xl border border-[#4263FF]/30 space-y-3">
              <h3 className="text-base font-bold text-white flex items-start gap-2.5">
                <span className="text-cyan-400">Q:</span> {faq.q}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-5">
                {faq.a}
              </p>
            </CardTilt>
          ))}
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-cyan-400/30 text-center space-y-4 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white">Still need assistance?</h3>
          <p className="text-xs text-slate-300">Our engineering and support staff are available around the clock for students and enterprise partners.</p>
          <button
            onClick={() => onNavigate('support-center')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all inline-flex items-center gap-2"
          >
            Open Support Ticket <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
