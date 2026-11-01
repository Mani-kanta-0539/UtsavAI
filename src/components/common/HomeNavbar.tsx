'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const HomeNavbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      {/* Brand */}
      <Link href="/" className="flex items-center space-x-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            Utsav<span className="text-amber-500 dark:text-amber-400">AI</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:inline">
            PromptWars #1
          </span>
        </div>
      </Link>

      {/* Floating Center Pill Navigation */}
      <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-amber-500/20 dark:border-white/10 shadow-xl">
        <Link
          href="/"
          className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 dark:text-white bg-amber-500/15 dark:bg-white/10 transition-colors"
        >
          Home
        </Link>
        <Link
          href="#features"
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Features
        </Link>
        <Link
          href="/onboard"
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Discovery Quiz
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Live Dashboard
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center space-x-2.5">
        <ThemeToggle />

        <Link
          href="/login"
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Log In</span>
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
