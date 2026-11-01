'use client';

import React from 'react';
import { ALL_PRESETS, PersonaPreset } from '@/engine/demoPresets';
import { Sparkles, Users, IndianRupee, Calendar, Check, X } from 'lucide-react';

interface PresetSelectorProps {
  isOpen: boolean;
  activePresetId: string;
  onSelectPreset: (preset: PersonaPreset) => void;
  onClose: () => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  isOpen,
  activePresetId,
  onSelectPreset,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-modal-title"
    >
      <div className="bg-white dark:bg-[#0f0d1a] border border-amber-500/20 dark:border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white">
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/15 dark:border-white/10">
          <div>
            <h2 id="preset-modal-title" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              1-Click Demo Presets for Evaluators
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Instantly test consequence-aware calculations across 3 distinct real-world celebration domains.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preset switcher"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {ALL_PRESETS.map((preset) => {
            const isSelected = preset.id === activePresetId;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? 'border-amber-500 dark:border-amber-400 bg-amber-500/10 ring-1 ring-amber-500 dark:ring-amber-400'
                    : 'border-amber-500/15 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] hover:border-amber-500/30 dark:hover:border-white/20 hover:bg-amber-500/5 dark:hover:bg-white/[0.05]'
                }`}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectPreset(preset);
                    onClose();
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {preset.context.title}
                  </span>
                  {isSelected && (
                    <span className="flex items-center text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Check className="w-3.5 h-3.5 mr-1" /> Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span className="font-bold">₹{preset.context.totalBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    <span>{preset.context.guestCount} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                    <span>{preset.context.eventDate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1 italic">
                  {preset.context.culturalNotes}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    #1 {preset.context.priorities[0]?.toUpperCase()}
                  </span>
                  {preset.context.accessibilityNeeds.slice(0, 2).map((acc, i) => (
                    <span key={i} className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
