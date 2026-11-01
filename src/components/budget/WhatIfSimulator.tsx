'use client';

import React from 'react';
import { Sliders, RefreshCw, AlertTriangle, Users, IndianRupee, Calendar } from 'lucide-react';

interface WhatIfSimulatorProps {
  originalGuests: number;
  currentGuests: number;
  originalBudget: number;
  currentBudget: number;
  dateShiftDays: number;
  onUpdateGuests: (guests: number) => void;
  onUpdateBudget: (budget: number) => void;
  onUpdateDateShift: (days: number) => void;
  onSimulateOverrun: () => void;
  onReset: () => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  originalGuests,
  currentGuests,
  originalBudget,
  currentBudget,
  dateShiftDays,
  onUpdateGuests,
  onUpdateBudget,
  onUpdateDateShift,
  onSimulateOverrun,
  onReset,
}) => {
  return (
    <section
      aria-labelledby="whatif-heading"
      className="glass-panel-amber rounded-2xl p-6 shadow-xl border border-amber-500/30 text-slate-900 dark:text-white"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-500/15 dark:border-white/10 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-600 text-white rounded-xl shadow-md">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 id="whatif-heading" className="text-base font-bold text-slate-900 dark:text-white">
              Interactive &quot;What-If&quot; Ripple Simulator
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Instant &lt;2ms deterministic recalculations without burning LLM tokens.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onSimulateOverrun}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 hover:bg-rose-500/25 border border-rose-500/40 dark:border-rose-500/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>Simulate +20% Overrun</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-amber-500/20 dark:border-white/15 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center space-x-1 transition-colors shadow-xs"
            title="Reset to baseline"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        {/* Guest Slider */}
        <div className="bg-white dark:bg-black/60 p-4 rounded-xl border border-amber-500/20 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="guest-slider" className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Guest Count
            </label>
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 bg-blue-500/15 dark:bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
              {currentGuests} Pax{' '}
              {currentGuests !== originalGuests && (
                <span className="text-[10px] ml-1 font-normal">
                  ({currentGuests > originalGuests ? '+' : ''}{currentGuests - originalGuests})
                </span>
              )}
            </span>
          </div>
          <input
            id="guest-slider"
            type="range"
            min={Math.max(20, originalGuests - 100)}
            max={originalGuests + 150}
            step={5}
            value={currentGuests}
            aria-valuemin={Math.max(20, originalGuests - 100)}
            aria-valuemax={originalGuests + 150}
            aria-valuenow={currentGuests}
            aria-valuetext={`${currentGuests} Guests`}
            aria-label="Adjust Guest Count"
            onChange={(e) => onUpdateGuests(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            <span>{Math.max(20, originalGuests - 100)}</span>
            <span>Baseline: {originalGuests}</span>
            <span>{originalGuests + 150}</span>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="bg-white dark:bg-black/60 p-4 rounded-xl border border-amber-500/20 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="budget-slider" className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Budget Ceiling
            </label>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              ₹{currentBudget.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            id="budget-slider"
            type="range"
            min={Math.round(originalBudget * 0.7)}
            max={Math.round(originalBudget * 1.3)}
            step={10000}
            value={currentBudget}
            aria-valuemin={Math.round(originalBudget * 0.7)}
            aria-valuemax={Math.round(originalBudget * 1.3)}
            aria-valuenow={currentBudget}
            aria-valuetext={`₹${currentBudget.toLocaleString('en-IN')}`}
            aria-label="Adjust Budget Ceiling"
            onChange={(e) => onUpdateBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            <span>-30%</span>
            <span>₹{originalBudget.toLocaleString('en-IN')}</span>
            <span>+30%</span>
          </div>
        </div>

        {/* Date Shift Slider */}
        <div className="bg-white dark:bg-black/60 p-4 rounded-xl border border-amber-500/20 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="date-slider" className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Timeline Shift
            </label>
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-500/15 dark:bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
              {dateShiftDays === 0 ? 'On Schedule' : `${dateShiftDays > 0 ? '+' : ''}${dateShiftDays}d`}
            </span>
          </div>
          <input
            id="date-slider"
            type="range"
            min={-30}
            max={30}
            step={2}
            value={dateShiftDays}
            aria-valuemin={-30}
            aria-valuemax={30}
            aria-valuenow={dateShiftDays}
            aria-valuetext={`${dateShiftDays} days shift`}
            aria-label="Adjust Timeline Shift in Days"
            onChange={(e) => onUpdateDateShift(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            <span>-30d (Earlier)</span>
            <span>0</span>
            <span>+30d (Later)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
