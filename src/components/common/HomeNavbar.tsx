'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const HomeNavbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      {/* Brand */}
      <Link href="/" className="flex items-center space-x-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
            Utsav<span className="text-amber-400">AI</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:inline">
            PromptWars #1
          </span>
        </div>
      </Link>

      {/* Floating Center Pill Navigation */}
      <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-2xl">
        <Link
          href="/"
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 shadow-inner transition-colors"
        >
          Home
        </Link>
        <Link
          href="#features"
          className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          Features
        </Link>
        <Link
          href="/onboard"
          className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          Discovery Quiz
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          Live Dashboard
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Log In</span>
        </Link>

        <Link
          href="/onboard"
          className="px-4 py-2 rounded-full text-xs font-bold text-white btn-glow-purple flex items-center space-x-1.5"
        >
          <span>Plan Event</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
};
