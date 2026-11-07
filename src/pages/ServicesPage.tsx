import React from 'react';
import { SERVICES } from '../data/mockData';
import { Service, PageRoute } from '../types';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { FloatingParticles } from '../components/FloatingParticles';
import { MagneticButton } from '../components/MagneticButton';
import {
  Globe,
  Smartphone,
  Cpu,
  TrendingUp,
  Palette,
  Search,
  ShoppingCart,
  Server,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ServicesPageProps {
  onSelectService: (service: Service) => void;
  onNavigate: (page: PageRoute) => void;
}

const serviceIconMap: Record<string, React.ReactNode> = {
  'website-development': <Globe className="w-5 h-5 text-blue-400" />,
  'application-development': <Smartphone className="w-5 h-5 text-indigo-400" />,
  'ai-automation': <Cpu className="w-5 h-5 text-cyan-400" />,
  'digital-marketing': <TrendingUp className="w-5 h-5 text-purple-400" />,
  'branding-design': <Palette className="w-5 h-5 text-amber-400" />,
  'seo-aeo': <Search className="w-5 h-5 text-emerald-400" />,
  'ecommerce': <ShoppingCart className="w-5 h-5 text-pink-400" />,
  'software-solutions': <Server className="w-5 h-5 text-cyan-400" />,
};

export const ServicesPage: React.FC<ServicesPageProps> = ({ onSelectService, onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <FloatingParticles count={25} />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Enterprise Solutions</span>
            <span>·</span>
            <span className="text-cyan-400 font-medium">8 High-Impact Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Digital Engineering &amp; AI Solutions
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            We partner with ambitious startups and global enterprises to design, engineer, and deploy high-performance software systems and autonomous AI solutions.
          </p>
        </ScrollReveal>

        {/* Services Bento Grid with 3D CardTilt */}
        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <StaggerItem key={service.id}>
              <CardTilt
                onClick={() => onSelectService(service)}
                className="glass-panel p-7 rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {serviceIconMap[service.id] || <Cpu className="w-5 h-5 text-cyan-400" />}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {service.timeline}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {service.subtitle}
                  </p>

                  <div className="pt-2 space-y-1.5 border-t border-white/5">
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{service.pricingRange}</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>

        {/* Bottom Banner with MagneticButton */}
        <ScrollReveal>
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Need a Bespoke Architecture Consultation?</h3>
              <p className="text-xs text-slate-400">
                Speak directly with our senior system architects to evaluate technical requirements, security boundaries, and project timelines.
              </p>
            </div>
            <MagneticButton
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shrink-0 shadow-lg shadow-blue-600/20"
            >
              Schedule Technical Discovery
            </MagneticButton>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
