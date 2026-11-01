'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center overflow-hidden">
      {/* Top Floating Badge matching image */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-md text-slate-300 text-xs font-semibold mb-6 shadow-lg shadow-purple-500/10 animate-fade-in">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="text-white">Smart Event Architecture</span>
        <span className="w-1 h-1 rounded-full bg-purple-400" />
        <span className="text-slate-400">PromptWars Challenge 5</span>
      </div>

      {/* Large Glowing Gradient Headline */}
      <h1 className="max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
        Smart Scheduler Effortless{' '}
        <span className="bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
          Celebration Architecture!
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
        Imagine event budgets, per-plate scaling, dependency timelines, and 20% over-budget trade-offs calculating automatically in &lt;2ms.
      </p>

      {/* Glowing CTA Buttons matching image */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/onboard"
          className="px-7 py-3.5 rounded-full text-sm font-bold text-white btn-glow-purple flex items-center space-x-2 shadow-2xl"
        >
          <span>Plan Your Celebration</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/dashboard"
          className="px-6 py-3.5 rounded-full text-sm font-semibold text-slate-200 bg-white/[0.06] hover:bg-white/10 border border-white/15 backdrop-blur-md flex items-center space-x-2 transition-colors"
        >
          <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Launch Interactive Demo</span>
        </Link>
      </div>

      {/* Trust Tags */}
      <div className="mt-14 pt-8 border-t border-white/10 w-full max-w-4xl flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-400 tracking-wider uppercase">
        <span className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real Indian Weddings
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-amber-400" /> Milestone Birthdays
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-purple-400" /> Community Festivals
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-blue-400" /> WCAG AA Accessible
        </span>
      </div>
    </section>
  );
};
