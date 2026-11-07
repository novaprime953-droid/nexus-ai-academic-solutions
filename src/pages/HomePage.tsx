import React, { useState } from 'react';
import { ThreeNeuralOrb } from '../components/ThreeNeuralOrb';
import { CardTilt } from '../components/CardTilt';
import { MagneticButton } from '../components/MagneticButton';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { FloatingParticles } from '../components/FloatingParticles';
import { COURSES, SERVICES, AI_TOOLS, PROJECTS } from '../data/mockData';
import { PageRoute, Course, Service, AIToolItem } from '../types';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Cpu,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Globe,
  TrendingUp,
  MapPin,
  Star,
  Clock,
  Activity,
  Zap,
  Eye,
  ExternalLink
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCourse: (course: Course) => void;
  onSelectService: (service: Service) => void;
  onSelectTool: (tool: AIToolItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCourse,
  onSelectService,
  onSelectTool,
}) => {
  const [pulseKey, setPulseKey] = useState(0);
  const [orbViewMode, setOrbViewMode] = useState<'standard' | 'focused'>('standard');

  const triggerEnergyPulse = () => {
    setPulseKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#101A3B]/70 text-white overflow-hidden">
      
      {/* ==================================================
          A & B. EXTRAORDINARY CINEMATIC 3D AI HERO SECTION
          ================================================== */}
      <section className="relative min-h-[96vh] flex items-center justify-center overflow-hidden border-b border-[#4263FF]/20">
        
        {/* Full-screen Interactive 3D Three.js Neural AI Orb */}
        <div className="absolute inset-0 z-0">
          <ThreeNeuralOrb key={pulseKey} className="w-full h-full" />
        </div>

        {/* Ambient volumetric lighting scrims and gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101A3B] via-transparent to-transparent pointer-events-none z-1" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#101A3B]/30 to-[#101A3B]/80 pointer-events-none z-1" />

        {/* Hero Content with Staggered Entrance Animations & Elegant Typography */}
        <div
          className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 transition-all duration-700 ${
            orbViewMode === 'focused' ? 'opacity-20 pointer-events-none scale-95' : 'opacity-100'
          }`}
        >
          
          {/* Stagger 1: Ambient Kicker */}
          <div className="animate-entrance-1 inline-flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 font-medium glass-panel px-4 py-1.5 rounded-full border border-white/10 shadow-lg shadow-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-semibold text-white">Nexus AI Academic &amp; Solutions</span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-300">Autonomous Neural Systems</span>
          </div>

          {/* Stagger 2: Animated Gradient Headline */}
          <div className="animate-entrance-2 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Learn Skills.{' '}
              <span className="text-gradient-animated block sm:inline">
                Build Technology.
              </span>{' '}
              Shape the Future.
            </h1>
          </div>

          {/* Stagger 3: Supporting Statement */}
          <div className="animate-entrance-3 max-w-2xl mx-auto">
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
              Empowering individuals and enterprises through cutting-edge generative AI education, intelligent tools, and production software solutions.
            </p>
          </div>

          {/* Stagger 4: Magnetic Action CTAs */}
          <div className="animate-entrance-4 pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              onClick={() => onNavigate('academy')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 group"
            >
              <span>Explore Academy</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <MagneticButton
              onClick={() => onNavigate('tools')}
              className="w-full sm:w-auto px-7 py-3.5 glass-panel glass-panel-hover text-white rounded-xl text-sm font-semibold border border-white/10 shadow-sm"
            >
              <span>Discover AI Tools</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </MagneticButton>

            <MagneticButton
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-sm font-semibold border border-white/10"
            >
              <span>Get Digital Solutions</span>
            </MagneticButton>
          </div>

          {/* Trust Strip & Quantitative Rigor */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-white/10 text-xs text-slate-400">
            <div>
              <p className="font-extrabold text-white text-lg tracking-tight">12,480+</p>
              <p className="text-slate-400 mt-0.5">Students Trained</p>
            </div>
            <div>
              <p className="font-extrabold text-white text-lg tracking-tight">185+</p>
              <p className="text-slate-400 mt-0.5">Enterprise Deployments</p>
            </div>
            <div>
              <p className="font-extrabold text-white text-lg tracking-tight">98.4%</p>
              <p className="text-slate-400 mt-0.5">Placement Rate</p>
            </div>
            <div>
              <p className="font-extrabold text-cyan-400 text-lg tracking-tight">Sub-50ms</p>
              <p className="text-slate-400 mt-0.5">Inference Latency</p>
            </div>
          </div>

        </div>

        {/* Unified Bottom Control Dock (Zero Viewport Occlusion) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[94vw] glass-panel px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 sm:gap-6 text-xs text-slate-300 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Three.js Neural Core Active</span>
            <span className="sm:hidden">3D Active</span>
          </div>

          <span className="text-white/20 hidden sm:inline">|</span>

          <button
            onClick={triggerEnergyPulse}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/15 rounded-lg border border-white/10 text-slate-200 transition-colors"
            title="Trigger harmonic energy burst through the 3D neural lattice"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap">Pulse Energy</span>
          </button>

          <button
            onClick={() => setOrbViewMode(orbViewMode === 'standard' ? 'focused' : 'standard')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/15 rounded-lg border border-white/10 text-slate-200 transition-colors"
            title="Toggle unobstructed view of the 3D Neural Orb"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="whitespace-nowrap">
              {orbViewMode === 'standard' ? 'Focus 3D Orb' : 'Show Headline'}
            </span>
          </button>
        </div>

      </section>

      {/* ==================================================
          C. TRUST & BRAND PILLARS (With ScrollReveal & 3D Tilt)
          ================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FloatingParticles count={25} />

        <ScrollReveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            {
              icon: <Cpu className="w-6 h-6 text-blue-400" />,
              title: 'Digital Innovation',
              desc: 'Architecting cutting-edge LLMs, autonomous agents, and low-latency cloud systems.',
            },
            {
              icon: <Users className="w-6 h-6 text-indigo-400" />,
              title: 'Practical Learning',
              desc: 'Physical labs & hands-on online curricula. Build real software, not toy demos.',
            },
            {
              icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
              title: 'Intelligent Automation',
              desc: 'Automating enterprise workflows, lead operations, and mission-critical pipelines.',
            },
            {
              icon: <Globe className="w-6 h-6 text-purple-400" />,
              title: 'Technology Solutions',
              desc: 'End-to-end full stack development, high-frequency apps, and modern design systems.',
            },
          ].map((item, idx) => (
            <StaggerItem key={idx}>
              <CardTilt className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>
      </section>

      {/* ==================================================
          D. ACADEMY SECTION (All 9 Courses with 3D Tilt Cards)
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="text-xs text-slate-400 font-medium">Academic Curricula</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Future-Ready Engineering Programs
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">
              Master the exact technical capabilities demanded by premier AI research companies and modern software startups.
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explore all 9 programs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>

        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <StaggerItem key={course.id}>
              <CardTilt
                onClick={() => onSelectCourse(course)}
                className="glass-panel rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                <div className="p-7 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">{course.category}</span>
                    <span>{course.level}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.tagline}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {course.studentsCount}
                    </span>
                  </div>

                  {course.isPhysicalAvailable && (
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/30 border border-cyan-800/30 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">Physical Lab Campus Workstation</span>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/8 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Tuition</span>
                    <span className="text-base font-bold text-white">{course.price}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>
      </section>

      {/* ==================================================
          E. AI TOOLS HIGHLIGHT SECTION (With Interactive Hover Tilt)
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="text-xs text-slate-400 font-medium">Real-Time Intelligence</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Nexus AI Production Tools
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">
              16 operational utilities powered by server-side Gemini 3.8 and client-side document processing engines.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tools')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open All 16 AI Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>

        <ScrollReveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_TOOLS.slice(0, 8).map((tool) => (
            <StaggerItem key={tool.id}>
              <CardTilt
                onClick={() => onSelectTool(tool)}
                className="glass-panel p-6 rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-cyan-400">{tool.category}</span>
                    <span className="text-[11px] text-slate-500">{tool.badge}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>
      </section>

      {/* ==================================================
          F. DIGITAL SERVICES SHOWCASE
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="text-xs text-slate-400 font-medium">Bespoke Engineering</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Enterprise Digital Solutions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">
              From autonomous AI agent pipelines to custom software platforms and brand systems.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All 8 Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>

        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.slice(0, 4).map((service) => (
            <StaggerItem key={service.id}>
              <CardTilt
                onClick={() => onSelectService(service)}
                className="glass-panel p-6 rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <span className="text-xs text-cyan-400 font-semibold">{service.category}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3">{service.subtitle}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{service.pricingRange}</span>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Explore Scope →
                  </span>
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>
      </section>

      {/* ==================================================
          G. WHY NEXUS FEATURE CARDS (With Floating Ambient Particles)
          ================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <FloatingParticles count={30} />

        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="text-xs text-slate-400">The Nexus Distinction</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Learn &amp; Build With Us</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            We bridge the gap between academic theory and high-frequency production systems.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          {[
            {
              title: 'Learn by Building',
              desc: 'Architect real software pipelines rather than watching static lectures.',
            },
            {
              title: 'Future-Ready Skills',
              desc: 'Master autonomous reasoning, tool-calling loops, and next-gen frameworks.',
            },
            {
              title: 'AI-Powered Innovation',
              desc: 'Integrated with the modern Gemini 3.8 SDK and server-side safety boundaries.',
            },
            {
              title: 'Practical Experience',
              desc: 'Physical labs equipped with real robotics clusters and mentor desks.',
            },
            {
              title: 'Professional Mentorship',
              desc: 'Direct code reviews and career coaching from staff software architects.',
            },
          ].map((item, idx) => (
            <StaggerItem key={idx}>
              <CardTilt className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2 text-center h-full">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center mx-auto text-xs font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-white pt-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>
      </section>

      {/* ==================================================
          H. PROJECTS / PORTFOLIO SHOWCASE
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="text-xs text-slate-400 font-medium">Proven Track Record</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Featured Enterprise Deployments
            </h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Full Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>

        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROJECTS.map((proj) => (
            <StaggerItem key={proj.id}>
              <CardTilt
                onClick={() => onNavigate('projects')}
                className="glass-panel rounded-2xl border border-white/10 glass-panel-hover overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172554] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold bg-[#101A3B]/80 backdrop-blur-md rounded-lg text-cyan-400 border border-[#4263FF]/30">
                    {proj.category}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-xs text-slate-400">{proj.client}</div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5">
                    <span className="text-cyan-400 font-extrabold text-sm">{proj.metric}</span>
                    <span className="text-slate-500">{proj.metricLabel}</span>
                  </div>
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>
      </section>

      {/* ==================================================
          I. CONVERSION CALL TO ACTION (CTA)
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-10 sm:p-16 text-center space-y-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Your Future Starts With Nexus.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whether you are preparing to master autonomous AI architectures or looking to deploy an enterprise-scale software system, we provide the tools, curriculum, and senior engineering horsepower.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <MagneticButton
                onClick={() => onNavigate('courses')}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25"
              >
                Enroll in a Master Program
              </MagneticButton>
              <MagneticButton
                onClick={() => onNavigate('contact')}
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold"
              >
                Schedule Enterprise Consultation
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
