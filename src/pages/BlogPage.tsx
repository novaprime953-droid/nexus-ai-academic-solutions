import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';
import { CardTilt } from '../components/CardTilt';
import { ScrollReveal, StaggerItem } from '../components/ScrollReveal';
import { BookOpen, Clock, User, ArrowRight, X, Sparkles } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="min-h-screen bg-[#101A3B]/60 text-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs text-slate-300 glass-panel px-3.5 py-1.5 rounded-full border border-[#4263FF]/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Nexus Publications</span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-400 font-semibold">Research &amp; Engineering Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Architectural Insights &amp;{' '}
            <span className="text-gradient-animated">AI Research</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            In-depth analysis of autonomous agent loops, prompt topology, dark-mode design systems, and answer engine optimization.
          </p>
        </ScrollReveal>

        {/* Blog Posts Grid */}
        <ScrollReveal staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <StaggerItem key={post.id}>
              <CardTilt
                onClick={() => setSelectedPost(post)}
                className="glass-panel p-7 rounded-2xl border border-[#4263FF]/25 glass-panel-hover flex flex-col justify-between cursor-pointer group transition-all h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <p className="font-semibold text-slate-200">{post.author}</p>
                    <p className="text-[11px] text-slate-400">{post.role}</p>
                  </div>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </span>
                </div>
              </CardTilt>
            </StaggerItem>
          ))}
        </ScrollReveal>

        {/* Article Reader Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A3B]/85 backdrop-blur-md">
            <div className="glass-panel max-w-3xl w-full p-8 sm:p-12 rounded-3xl border border-[#4263FF]/35 bg-[#172554] max-h-[85vh] overflow-y-auto space-y-6 relative shadow-2xl">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-cyan-400 font-semibold">{selectedPost.category}</span>
                  <span>·</span>
                  <span>{selectedPost.date}</span>
                  <span>·</span>
                  <span>{selectedPost.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="text-xs text-slate-400 pt-1">
                  By <strong className="text-slate-200">{selectedPost.author}</strong>, {selectedPost.role}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
                {selectedPost.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
