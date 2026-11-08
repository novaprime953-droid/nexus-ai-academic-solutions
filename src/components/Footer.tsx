import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Cpu, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="w-full border-t border-[#4263FF]/20 bg-[#101A3B]/90 backdrop-blur-md text-slate-300 text-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                NEXUS <span className="text-cyan-400 font-medium">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering individuals and enterprise organizations through world-class AI education, practical intelligent tools, and high-performance digital software solutions.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5 pt-2 font-sans">
              <p className="text-white font-semibold">CEO &amp; Founder: Musa Aswad</p>
              <p>Physical Innovation Campus: Tech Corridor Lab 4, Cyber City</p>
              <p>Official Email: <a href="mailto:onlinewow280@gmail.com" className="text-cyan-400 hover:underline">onlinewow280@gmail.com</a></p>
              <p>Contacts: <a href="tel:+923076159777" className="text-emerald-400 hover:underline">03076159777</a> · <a href="tel:+923170338486" className="text-emerald-400 hover:underline">03170338486</a></p>
            </div>
          </div>

          {/* Column 2: Academy */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Academy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  All 9 Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academy')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Physical Labs &amp; Campus
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('student-dashboard')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Student Portal &amp; Grades
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Enterprise Certification
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions & Tools */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Solutions &amp; Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Digital &amp; AI Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  16 Live AI Utilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Enterprise Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Request Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Nexus Intelligence
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Bi-weekly engineering briefs on autonomous agent topologies and AI architectures.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscription verified.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    required
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} NEXUS AI ACADEMIC &amp; SOLUTIONS. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-slate-300 transition-colors"
            >
              Support Center
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
