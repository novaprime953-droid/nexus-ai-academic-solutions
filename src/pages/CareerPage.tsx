import React from 'react';
import { PageRoute } from '../types';
import { Briefcase, Sparkles, ArrowRight, Shield, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';

interface CareerPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const CareerPage: React.FC<CareerPageProps> = ({ onNavigate }) => {
  const jobs = [
    { title: 'Senior AI Systems Architect', dept: 'Research & Engineering', type: 'Full-Time', location: 'San Francisco / Remote' },
    { title: 'Full-Stack React 19 Engineer', dept: 'Platform Engineering', type: 'Full-Time', location: 'New York / Remote' },
    { title: 'Lead AI Academy Instructor', dept: 'Nexus Academy', type: 'Full-Time / Part-Time', location: 'Cyber Lab 4 / Remote' },
  ];

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" /> Careers at Nexus AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Shape the Future of Autonomous Intelligence</h1>
          <p className="text-slate-300 text-sm sm:text-base">Join an elite team of researchers, engineers, and educators pushing the boundaries of AI technology.</p>
        </div>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <CardTilt key={i} className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#4263FF]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-cyan-400">{job.dept} • {job.type}</span>
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                </p>
              </div>

              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all inline-flex items-center gap-2"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </CardTilt>
          ))}
        </div>
      </div>
    </div>
  );
};
