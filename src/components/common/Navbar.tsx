'use client';

import React from 'react';
import { Sparkles, Eye, ShieldCheck, CalendarCheck2 } from 'lucide-react';

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
    <header className="border-b border-amber-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Utsav<span className="text-amber-600">AI</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 border border-amber-300">
                PromptWars #1
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Consequence-Aware Celebration & Event Architecture
            </p>
          </div>
        </div>

        {/* Status Pill & Controls */}
        <div className="flex items-center space-x-3">
          {/* Active Preset Tag */}
          <button
            onClick={onOpenPresetModal}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-semibold text-amber-900 transition-colors"
            title="Click to switch demo persona"
            aria-label={`Current preset: ${currentPersonaTitle}. Click to change preset.`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {currentPersonaTitle}
            </span>
            <span className="text-[10px] text-amber-700 underline font-normal">
              Switch
            </span>
          </button>

          {/* WCAG High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            aria-pressed={isHighContrast}
            aria-label="Toggle High Contrast Accessible Display Mode"
            className={`p-2 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              isHighContrast
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">
              {isHighContrast ? 'High Contrast On' : 'Contrast'}
            </span>
          </button>

          {/* Engine Status Guardrail */}
          <div className="hidden lg:flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic Engine Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
