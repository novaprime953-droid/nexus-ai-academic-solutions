import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Cpu, Sparkles, Terminal, Shield, ArrowRight, Activity, Zap, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal } from '../components/ScrollReveal';

interface AiLabPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AiLabPage: React.FC<AiLabPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'vision' | 'llm'>('agents');
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  const runSimulation = () => {
    setIsRunningSim(true);
    setSimOutput(null);
    setTimeout(() => {
      setIsRunningSim(false);
      setSimOutput(
        '>>> Autonomous ReAct Agent Execution Complete.\n[Step 1] Analyzed prompt semantics & vector embeddings.\n[Step 2] Executed tool function: fetch_enterprise_analytics()\n[Step 3] Synthesized insights with 0% hallucination score.\n[Result] Execution time: 142ms. Token efficiency: 98.4%.'
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#10172F]/70 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Nexus Advanced AI Lab
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Experimental AI Research &amp; Neural Playgrounds
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore cutting-edge model topologies, multi-step autonomous agent loops, and real-time inference optimization developed by our research division.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3">
          {(['agents', 'vision', 'llm'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab === 'agents' ? 'Autonomous Agents' : tab === 'vision' ? 'Multi-Modal Vision' : 'LLM Fine-Tuning'}
            </button>
          ))}
        </div>

        {/* Interactive Lab Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardTilt className="glass-panel p-8 rounded-3xl border border-cyan-400/30 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Neural Sandbox</h3>
                <p className="text-xs text-slate-400">Test autonomous reasoning loops</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 mb-1.5 block">Target Task Objective</label>
                <input
                  type="text"
                  readOnly
                  value="Analyze enterprise Q3 earnings & synthesize executive summary"
                  className="w-full bg-[#151F40] border border-[#4263FF]/30 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1.5 block">Execution Engine</label>
                <div className="p-3 bg-[#151F40] border border-[#4263FF]/30 rounded-xl flex items-center justify-between text-white">
                  <span>Gemini 2.5 Flash ReAct</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={isRunningSim}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50"
              >
                {isRunningSim ? (
                  <>Running Neural Pipeline...</>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Run Autonomous Simulation
                  </>
                )}
              </button>
            </div>
          </CardTilt>

          <div className="glass-panel p-8 rounded-3xl border border-[#4263FF]/30 lg:col-span-2 space-y-6 flex flex-col justify-between bg-[#151F40]/80">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-sm font-mono text-cyan-400">
                <Terminal className="w-4 h-4" /> nexus-lab-terminal://live-stream
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Cluster Active
              </div>
            </div>

            <div className="flex-1 font-mono text-xs text-slate-300 bg-[#10172F] p-6 rounded-2xl border border-white/10 min-h-[220px] flex flex-col justify-center">
              {isRunningSim ? (
                <div className="text-center space-y-3 text-cyan-400">
                  <Activity className="w-6 h-6 animate-spin mx-auto" />
                  <p>Orchestrating multi-step tool calls and vector embeddings...</p>
                </div>
              ) : simOutput ? (
                <pre className="whitespace-pre-wrap text-cyan-300">{simOutput}</pre>
              ) : (
                <div className="text-center text-slate-500">
                  Click &quot;Run Autonomous Simulation&quot; to execute live model reasoning.
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
              <span>Security Level: Enterprise Zero-Trust</span>
              <button
                onClick={() => onNavigate('tools')}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Open Production Tools <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
