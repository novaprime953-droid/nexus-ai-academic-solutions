import React from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

interface LegalPagesProps {
  type: 'privacy' | 'terms';
  onNavigate: (page: PageRoute) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Homepage</span>
        </button>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Nexus AI Governance &amp; Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </h1>

          <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {type === 'privacy' ? (
              <>
                <p>
                  Nexus AI Academic &amp; Solutions (&ldquo;Nexus&rdquo;) is committed to protecting the privacy, intellectual property, and confidential assets of our students, enterprise clients, and community members.
                </p>
                <h3 className="text-base font-bold text-white pt-2">1. Data Storage &amp; AI Processing Safeguards</h3>
                <p>
                  All generative AI interactions conducted through our platform utilize server-side proxy boundaries. Client prompts submitted to the Gemini API are processed in isolated runtime containers. We do not sell or monetize personal code snippets or student submission files.
                </p>
                <h3 className="text-base font-bold text-white pt-2">2. Client-Side Document Tools</h3>
                <p>
                  For PDF merging, PDF splitting, image compression, and format conversion tools, processing takes place entirely within your browser&apos;s local memory via WebAssembly and Canvas APIs. Files processed by these utilities never leave your machine.
                </p>
                <h3 className="text-base font-bold text-white pt-2">3. Physical Campus Security</h3>
                <p>
                  Access to our Cyber Innovation Labs is monitored for physical safety and equipment protection. Workstation access credentials are provided exclusively to enrolled students and authorized research faculty.
                </p>
              </>
            ) : (
              <>
                <p>
                  By accessing the Nexus AI Academic &amp; Solutions website, tools, or physical laboratory facilities, you agree to comply with the following operational terms.
                </p>
                <h3 className="text-base font-bold text-white pt-2">1. Academic Integrity &amp; Certification</h3>
                <p>
                  Certificates of Mastery are issued upon genuine completion of curriculum benchmarks, lab evaluations, and capstone code reviews. Plagiarism or deceptive submissions results in credential revocation.
                </p>
                <h3 className="text-base font-bold text-white pt-2">2. Commercial Solutions Delivery</h3>
                <p>
                  Custom engineering projects and AI automation contracts are governed by discrete Statements of Work (SOW). Intellectual property generated for client software solutions vests in the client upon final milestone settlement.
                </p>
                <h3 className="text-base font-bold text-white pt-2">3. AI Tool Acceptable Use</h3>
                <p>
                  Users may not utilize Nexus AI tools for malicious automation, security probing against unauthorized networks, or generation of deceptive content.
                </p>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-slate-500">
            Last Updated: November 2026 · Nexus Academic Governance Board
          </div>
        </div>

      </div>
    </div>
  );
};
