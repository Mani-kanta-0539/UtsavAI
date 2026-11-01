'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Eye, CalendarCheck2, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentPersonaTitle: string;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenPresetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersonaTitle,
  isHighContrast,
  onToggleHighContrast,
  onOpenPresetModal,
}) => {
  return (
    <header className="border-b border-amber-500/20 dark:border-white/10 bg-white/80 dark:bg-[#0a0814]/80 backdrop-blur-xl sticky top-0 z-40 shadow-xl text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/" className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white hover:text-amber-500 transition-colors">
                Utsav<span className="text-amber-500 dark:text-amber-400">AI</span>
              </Link>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                Live Planner
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Consequence-Aware Celebration & Event Architecture
            </p>
          </div>
        </div>

        {/* Status Pill & Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Active Preset Tag */}
          <button
            onClick={onOpenPresetModal}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/[0.1] border border-amber-500/20 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-white transition-colors"
            title="Click to switch demo persona"
            aria-label={`Current preset: ${currentPersonaTitle}. Click to change preset.`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="truncate max-w-[130px] sm:max-w-[180px]">
              {currentPersonaTitle}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 underline font-normal">
              Switch
            </span>
          </button>

          {/* Theme Toggle (Bright / Dark) */}
          <ThemeToggle />

          {/* WCAG High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            aria-pressed={isHighContrast}
            aria-label="Toggle High Contrast Accessible Display Mode"
            className={`p-2 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              isHighContrast
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-black/5 dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border-amber-500/20 dark:border-white/15'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">
              {isHighContrast ? 'Contrast High' : 'Contrast'}
            </span>
          </button>

          {/* Home Link */}
          <Link
            href="/"
            className="hidden sm:flex items-center space-x-1 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-black/5 dark:bg-white/[0.04] px-3 py-1.5 rounded-xl border border-amber-500/20 dark:border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
