import React, { useState } from 'react';
import { Mail, MapPin, Send, Loader2, CheckCircle2, Phone, Clock, MessageSquare, HelpCircle, ChevronDown } from 'lucide-react';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal } from '../components/ScrollReveal';
import { MagneticButton } from '../components/MagneticButton';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'General Consultation',
    budget: '$10,000 - $25,000',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        service: 'General Consultation',
        budget: '$10,000 - $25,000',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error submitting message.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How quickly can our team begin an enterprise AI solutions engagement?',
      a: 'Following technical scoping and requirements discovery (typically 48–72 hours), our engineering teams spin up dedicated sprint environments within one business week.',
    },
    {
      q: 'Are on-campus physical laboratory tours available for prospective students?',
      a: 'Yes. Physical tours of the Tech Innovation Corridor Cyber Lab occur every Tuesday and Thursday afternoon by appointment. Workstation evaluations can be requested during booking.',
    },
    {
      q: 'Do you offer custom corporate cohorts or bespoke internal training?',
      a: 'Yes. We deliver tailored internal masterclasses on custom LLM fine-tuning, agentic workflows, and secure enterprise RAG architectures for engineering organizations.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs text-slate-300 glass-panel px-3.5 py-1.5 rounded-full border border-[#4263FF]/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Direct Communication</span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-400 font-semibold">Global Support &amp; Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Connect With{' '}
            <span className="text-gradient-animated">Nexus AI</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Have questions about academic curricula, physical laboratory tours, or enterprise software solutions? Our senior team responds within 24 hours.
          </p>
        </ScrollReveal>

        {/* 2-Column Split: Contact Details & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Details Column */}
          <ScrollReveal direction="left" className="space-y-8">
            <CardTilt className="glass-panel p-8 rounded-3xl border border-[#4263FF]/25 space-y-6">
              <h2 className="text-xl font-bold text-white">Innovation Campus &amp; Labs</h2>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">CEO &amp; Leadership Contact (Musa Aswad):</strong>
                    <div className="space-y-0.5">
                      <p>Primary: <a href="tel:+923076159777" className="text-emerald-400 hover:underline font-mono">03076159777</a></p>
                      <p>Secondary: <a href="tel:+923170338486" className="text-emerald-400 hover:underline font-mono">03170338486</a></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Official Company Email:</strong>
                    <a href="mailto:onlinewow280@gmail.com" className="text-cyan-400 hover:underline font-mono">onlinewow280@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Physical Cyber Campus:</strong>
                    Nexus Tower 4, Tech Innovation Corridor, Cyber City Labs
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Operating Hours:</strong>
                    Monday – Friday: 8:00 AM – 10:00 PM EST (Physical Labs open Saturdays for enrolled cohorts)
                  </div>
                </div>
              </div>

              {/* Direct Quick Chat WhatsApp link button */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/923076159777?text=Hello%20CEO%20Musa%20Aswad%2C%20I%20would%20like%20to%20inquire%20about%20Nexus%20AI%20Academic%20%26%20Solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Primary (03076159777)</span>
                </a>
                <a
                  href="https://wa.me/923170338486?text=Hello%20CEO%20Musa%20Aswad%2C%20I%20would%20like%20to%20inquire%20about%20Nexus%20AI%20Academic%20%26%20Solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Secondary (03170338486)</span>
                </a>
              </div>
            </CardTilt>

            {/* Response SLA */}
            <div className="glass-panel p-6 rounded-2xl border border-[#4263FF]/20 space-y-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Guaranteed Dispatch SLA
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                All inquiries are triaged directly by software architects and academic advisors. Zero outsourced tier-1 support tickets.
              </p>
            </div>
          </ScrollReveal>

          {/* Form Column */}
          <ScrollReveal direction="right">
            <CardTilt className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#4263FF]/30 shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Inquiry Dispatched</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your message has been logged to the administrative review queue. A team member will reply shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Send a Direct Message</h3>
                    <p className="text-slate-400 text-xs mb-4">
                      Fill out the parameters below and submit.
                    </p>
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@organization.com"
                      className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Inquiry Type</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>General Consultation</option>
                        <option>Academy Enrollment</option>
                        <option>Physical Lab Tour</option>
                        <option>AI Automation &amp; Agents</option>
                        <option>Website &amp; App Development</option>
                        <option>Enterprise Software Solutions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Budget</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>$5,000 - $10,000</option>
                        <option>$10,000 - $25,000</option>
                        <option>$25,000 - $50,000</option>
                        <option>$50,000+</option>
                        <option>Academic Tuition ($500 - $1,000)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Message Details</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can Nexus AI assist your project or education goals?"
                      className="w-full px-3 py-2.5 bg-[#172554] border border-[#4263FF]/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Dispatch Inquiry</span>
                  </button>
                </form>
              )}
            </CardTilt>
          </ScrollReveal>

        </div>

        {/* FAQ Accordion */}
        <ScrollReveal className="space-y-6 pt-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400">Common questions about consultation and laboratory access.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-panel rounded-2xl border border-[#4263FF]/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180 text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
