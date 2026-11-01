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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-amber-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 id="preset-modal-title" className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              1-Click Demo Presets for Evaluators
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Instantly test consequence-aware calculations across 3 distinct real-world celebration domains.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preset switcher"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                className={`cursor-pointer rounded-xl p-4 border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/20'
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
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {preset.context.title}
                  </span>
                  {isSelected && (
                    <span className="flex items-center text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5 mr-1" /> Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold">₹{preset.context.totalBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{preset.context.guestCount} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>{preset.context.eventDate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-1 italic">
                  {preset.context.culturalNotes}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    #1 {preset.context.priorities[0]?.toUpperCase()}
                  </span>
                  {preset.context.accessibilityNeeds.slice(0, 2).map((acc, i) => (
                    <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
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
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
