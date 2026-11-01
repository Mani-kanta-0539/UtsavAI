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
      className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 rounded-2xl border border-amber-300 p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-200/60 gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 id="whatif-heading" className="text-base font-bold text-slate-900">
              Interactive &quot;What-If&quot; Ripple Simulator
            </h2>
            <p className="text-xs text-slate-600">
              Adjust sliders to trigger instant &lt;2ms deterministic recalculations with zero token waste.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Simulate +20% Overrun Crisis Button */}
          <button
            type="button"
            onClick={onSimulateOverrun}
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Simulate +20% Overrun</span>
          </button>

          {/* Reset Baseline */}
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium flex items-center space-x-1 transition-colors"
            title="Reset to initial values"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {/* Guest Slider */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="guest-slider" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Guest Count
            </label>
            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {currentGuests} Pax{' '}
              {currentGuests !== originalGuests && (
                <span className="text-[10px] ml-1 font-normal">
                  ({currentGuests > originalGuests ? '+' : ''}
                  {currentGuests - originalGuests})
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
            onChange={(e) => onUpdateGuests(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Adjust guest count"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{Math.max(20, originalGuests - 100)}</span>
            <span>Baseline: {originalGuests}</span>
            <span>{originalGuests + 150}</span>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="budget-slider" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              Budget Ceiling
            </label>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
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
            onChange={(e) => onUpdateBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            aria-label="Adjust budget ceiling"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-30%</span>
            <span>₹{originalBudget.toLocaleString('en-IN')}</span>
            <span>+30%</span>
          </div>
        </div>

        {/* Date Shift Slider */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="date-slider" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              Timeline Shift
            </label>
            <span className="text-xs font-extrabold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {dateShiftDays === 0
                ? 'On Schedule'
                : `${dateShiftDays > 0 ? '+' : ''}${dateShiftDays} Days`}
            </span>
          </div>
          <input
            id="date-slider"
            type="range"
            min={-30}
            max={30}
            step={2}
            value={dateShiftDays}
            onChange={(e) => onUpdateDateShift(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            aria-label="Adjust timeline date offset in days"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-30d (Earlier)</span>
            <span>0</span>
            <span>+30d (Later)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
