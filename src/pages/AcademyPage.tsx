import React from 'react';
import { PageRoute, Course } from '../types';
import { COURSES } from '../data/mockData';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { FloatingParticles } from '../components/FloatingParticles';
import { MagneticButton } from '../components/MagneticButton';
import {
  Cpu,
  MapPin,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AcademyPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCourse: (course: Course) => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ onNavigate, onSelectCourse }) => {
  return (
    <div className="relative min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <FloatingParticles count={25} />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Hero Section */}
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>The Future of Tech Education</span>
                  <span>·</span>
                  <span className="text-cyan-400 font-medium">Physical Labs &amp; Online Mastery</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Nexus AI Academic Institute
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Where theoretical computer science meets cutting-edge generative AI, full-stack systems engineering, and commercial deployment. Learn by building real systems under senior engineering mentorship.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <MagneticButton
                    onClick={() => onNavigate('courses')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25"
                  >
                    <span>Explore All 9 Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                  <MagneticButton
                    onClick={() => onNavigate('student-dashboard')}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold"
                  >
                    Student Portal
                  </MagneticButton>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/src/assets/images/academy_ai_lab_1793986112845.jpg"
                  alt="Nexus Academic AI Lab"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101A3B] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-xl border border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Physical Cyber Lab Campus · Tech Corridor Hub</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    State-of-the-art workstations with dedicated GPU compute, robotics testbeds, and collaborative engineering pods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Pillars of Learning */}
        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Cpu className="w-5 h-5 text-blue-400" />,
              title: 'Learn by Building',
              desc: 'No theoretical lectures without direct implementation. Every module builds production-grade software.',
            },
            {
              icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
              title: 'Autonomous AI Focus',
              desc: 'Master multi-agent loops, tool-calling pipelines, RAG, and multimodal reasoning with modern SDKs.',
            },
            {
              icon: <Award className="w-5 h-5 text-purple-400" />,
              title: 'Accredited Certification',
              desc: 'Cryptographically verifiable certificates endorsed by leading technology companies and startups.',
            },
            {
              icon: <Users className="w-5 h-5 text-emerald-400" />,
              title: '1-on-1 Mentorship',
              desc: 'Weekly direct code reviews, architecture consultations, and portfolio polish from senior engineers.',
            },
          ].map((pillar, i) => (
            <StaggerItem key={i}>
              <CardTilt className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 h-full">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>

        {/* Featured Curriculum Programs */}
        <div className="space-y-8">
          <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Curriculum Pathways</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Featured Engineering Masterclasses
              </h2>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View all 9 course categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </ScrollReveal>

          <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.slice(0, 3).map((c) => (
              <StaggerItem key={c.id}>
                <CardTilt
                  onClick={() => onSelectCourse(c)}
                  className="glass-panel p-6 rounded-2xl border border-white/10 glass-panel-hover cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="text-cyan-400 font-semibold">{c.category}</span>
                      <span>{c.duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{c.tagline}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{c.price}</span>
                    <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                      View Syllabus →
                    </span>
                  </div>
                </CardTilt>
              </StaggerItem>
            ))}
          </ScrollReveal>
        </div>

        {/* Physical Campus & Schedules */}
        <ScrollReveal>
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8">
            <div className="max-w-2xl">
              <div className="text-xs text-cyan-400 font-semibold">Physical Class Registration</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                On-Campus Lab Sessions &amp; Schedules
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                For learners seeking hands-on hardware, robotics, high-bandwidth compute rigs, and immersive collaborative peer groups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-cyan-400 font-semibold">Lab 4 · AI &amp; LLMs</span>
                <h4 className="text-sm font-bold text-white">Autonomous Agents &amp; ML</h4>
                <p className="text-slate-400">Tuesdays &amp; Thursdays: 6:00 PM – 9:00 PM</p>
                <p className="text-slate-500 pt-1">Capacity: 24 developer workstations</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-cyan-400 font-semibold">Lab 1 · Software Studio</span>
                <h4 className="text-sm font-bold text-white">Modern Full-Stack React</h4>
                <p className="text-slate-400">Mondays &amp; Wednesdays: 6:30 PM – 9:30 PM</p>
                <p className="text-slate-500 pt-1">Capacity: 30 developer workstations</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-cyan-400 font-semibold">Suite 2 · Executive Automation</span>
                <h4 className="text-sm font-bold text-white">Enterprise Automation Pipelines</h4>
                <p className="text-slate-400">Saturdays: 10:00 AM – 2:00 PM</p>
                <p className="text-slate-500 pt-1">Capacity: 18 executive seats</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
