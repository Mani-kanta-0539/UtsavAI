'use client';

import React from 'react';
import { IndianRupee, Sliders, Clock, Users, Sparkles, ShieldCheck } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: IndianRupee,
      glowColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      title: 'Priority-Weighted Budget Engine',
      desc: 'Weights every rupee by your #1 priority. Explicitly distinguishes between [AI Estimate - Unverified] and [Confirmed Vendor Quote].',
    },
    {
      icon: Sliders,
      glowColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      title: 'What-If & Crisis Recalculator',
      desc: 'Simulate +50 guests or a 15% budget cut. Offloads pure math to an O(n) engine in <2ms with zero wasted LLM tokens.',
    },
    {
      icon: Clock,
      glowColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      title: 'DAG Dependency Timeline',
      desc: 'Marking "Lock Venue" as delayed automatically ripples downstream to caterer tasting and floral design with AI mitigation steps.',
    },
    {
      icon: Users,
      glowColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      title: 'Vendor Quote Comparator',
      desc: 'Paste messy WhatsApp and email quotes. Gemini extracts base rates, per-plate costs, and flags hidden fees like 18% GST extra.',
    },
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xs uppercase tracking-widest font-bold text-amber-400 mb-2">
          Architecture & Engineering
        </h2>
        <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Not a Chatbot Wrapper.{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            A Consequence Engine.
          </span>
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-3">
          Engineered for real-world celebrations with mathematical guarantees, zero token waste, and 100% resilient smart fallbacks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="glass-panel p-6 sm:p-7 rounded-2xl hover:border-white/20 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.glowColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
