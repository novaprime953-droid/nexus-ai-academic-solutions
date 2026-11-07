import React from 'react';
import { PageRoute } from '../types';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { MagneticButton } from '../components/MagneticButton';
import {
  Award,
  Cpu,
  Users,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  Rocket,
  Compass,
  Layers,
  GraduationCap
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#101A3B]/50 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 text-xs text-slate-300 glass-panel px-3.5 py-1.5 rounded-full border border-[#4263FF]/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>About Nexus AI</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400 font-semibold">Institute &amp; Solutions Lab</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Advancing Human Potential Through{' '}
              <span className="text-gradient-animated">Applied Intelligence</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Founded by AI researchers and software architects, Nexus AI Academic &amp; Solutions exists to eliminate the chasm between theoretical artificial intelligence and real-world commercial execution.
            </p>
          </div>
        </ScrollReveal>

        {/* Story & Campus Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left" className="space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Our Genesis
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-snug">
              The Dual Mission: Education &amp; Engineering
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Traditional university curricula struggle to keep pace with the exponential velocity of AI models, agentic workflows, and cloud architecture. Meanwhile, enterprises struggle to hire engineers capable of architecting reliable, production-grade LLM systems.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Nexus bridges this gap. Our students build production software using modern SDKs and dedicated laboratory compute, while our solutions studio delivers bespoke autonomous software for high-growth enterprises worldwide.
            </p>

            <div className="pt-2 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Physical Innovation Campus located in the Tech Innovation Corridor</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Over 12,000 engineers trained across 34 countries</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Direct enterprise placement pipeline with tier-1 technology teams</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <CardTilt className="relative rounded-3xl overflow-hidden border border-[#4263FF]/30 shadow-2xl glass-panel group">
              <img
                src="/src/assets/images/hero_neural_nexus_1793986112010.jpg"
                alt="Nexus Headquarters"
                className="w-full h-88 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101A3B] via-[#101A3B]/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-5 glass-panel rounded-2xl border border-white/10 text-xs space-y-1">
                <span className="text-cyan-400 font-bold block text-sm">
                  Synapse HQ &amp; Cyber Innovation Campus
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Global headquarters, high-density neural clusters, and public research observatory.
                </p>
              </div>
            </CardTilt>
          </ScrollReveal>
        </div>

        {/* Core Values */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Our Core Principles</h2>
            <p className="text-xs text-slate-400">
              The foundational convictions that guide our teaching methodology and solution engineering.
            </p>
          </div>

          <ScrollReveal staggerChildren={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <CardTilt className="glass-panel p-6 rounded-2xl border border-[#4263FF]/25 space-y-4 h-full">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">Zero Toy Implementations</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We believe students and clients deserve production-grade architectures. Every assignment, tool, and service runs on real SDKs and deployment pipelines.
                </p>
              </CardTilt>
            </StaggerItem>

            <StaggerItem>
              <CardTilt className="glass-panel p-6 rounded-2xl border border-[#8B5CF6]/25 space-y-4 h-full">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">Principled Safety &amp; Ethics</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AI without safeguards is liability. We engineer robust guardrails, ground-truth verification systems, and deterministic fallback layers into every autonomous agent.
                </p>
              </CardTilt>
            </StaggerItem>

            <StaggerItem>
              <CardTilt className="glass-panel p-6 rounded-2xl border border-[#00D9FF]/25 space-y-4 h-full">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">Empowerment Through Mastery</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  True technological sovereignty comes from understanding neural representations, fine-tuning loss functions, and writing maintainable code rather than relying on brittle prompts.
                </p>
              </CardTilt>
            </StaggerItem>
          </ScrollReveal>
        </div>

        {/* Leadership Faculty */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Leadership &amp; Faculty</h2>
            <p className="text-xs text-slate-400">
              Guided by accomplished researchers, open source authors, and enterprise system architects.
            </p>
          </div>

          <ScrollReveal staggerChildren={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Evelyn Sterling',
                role: 'Dean of Academic Research & Principal AI Architect',
                bio: 'Former DeepMind research scholar specializing in multi-modal transformer topology and autonomous agent reasoning loops.',
                initials: 'ES',
                accent: 'from-blue-600 to-cyan-400',
              },
              {
                name: 'Kaelen Vance',
                role: 'Head of Solutions Engineering',
                bio: 'Staff architect with 14 years building high-frequency fintech platforms, distributed cloud microservices, and React design systems.',
                initials: 'KV',
                accent: 'from-purple-600 to-indigo-600',
              },
              {
                name: 'Julian Mercer',
                role: 'Creative Director & Design Systems Lead',
                bio: 'Award-winning digital designer obsessed with spatial math, dark mode contrast ergonomics, and human-computer micro-interactions.',
                initials: 'JM',
                accent: 'from-cyan-500 to-blue-600',
              },
            ].map((leader, i) => (
              <StaggerItem key={i}>
                <CardTilt className="glass-panel p-6 rounded-2xl border border-[#4263FF]/25 space-y-4 text-center h-full">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${leader.accent} flex items-center justify-center mx-auto text-xl font-bold text-white shadow-lg`}>
                    {leader.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{leader.name}</h3>
                    <p className="text-xs text-cyan-400 font-medium mt-0.5">{leader.role}</p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{leader.bio}</p>
                </CardTilt>
              </StaggerItem>
            ))}
          </ScrollReveal>
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#4263FF]/30 text-center space-y-5 bg-gradient-to-b from-[#172554]/60 to-[#101A3B]/80">
            <h3 className="text-3xl font-extrabold text-white">Join the Nexus Ecosystem</h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Discover our upcoming physical and online cohort schedules, or speak with our solutions engineering team for bespoke enterprise deployments.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-4">
              <MagneticButton
                onClick={() => onNavigate('courses')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25"
              >
                Explore All Courses
              </MagneticButton>
              <MagneticButton
                onClick={() => onNavigate('contact')}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold"
              >
                Request Enterprise Consultation
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
