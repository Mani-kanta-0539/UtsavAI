'use client';

import React from 'react';
import { ConsequenceDiff } from '@/types/planner';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface ConsequenceBannerProps {
  consequence: ConsequenceDiff;
  onRequestTradeOffs: () => void;
  isLoadingTradeOffs: boolean;
}

export const ConsequenceBanner: React.FC<ConsequenceBannerProps> = ({
  consequence,
  onRequestTradeOffs,
  isLoadingTradeOffs,
}) => {
  const isOver = consequence.isOverBudget;

  return (
    <aside
      aria-live="polite"
      className={`rounded-2xl p-5 border transition-all ${
        isOver
          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-500/50 text-rose-950 dark:text-rose-100 shadow-md'
          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-xs'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2 rounded-xl mt-0.5 ${
              isOver ? 'bg-rose-600 text-white shadow-sm' : 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-sm'
            }`}
          >
            {isOver ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 font-bold" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-extrabold text-sm tracking-tight ${isOver ? 'text-rose-900 dark:text-white' : 'text-emerald-900 dark:text-white'}`}>
                {isOver
                  ? `Cost Overrun Alert: Exceeded by ₹${consequence.overBudgetAmount.toLocaleString('en-IN')}`
                  : 'Budget Healthy & Aligned'}
              </span>
              {consequence.guestDelta !== 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-800 dark:text-white">
                  {consequence.guestDelta > 0 ? '+' : ''}{consequence.guestDelta} Pax Ripple
                </span>
              )}
            </div>

            <p className="text-xs mt-1 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {consequence.summaryText}
            </p>

            <p className="text-xs mt-1 text-slate-600 dark:text-slate-400 italic">
              {consequence.priorityImpactDescription}
            </p>
          </div>
        </div>

        {isOver && (
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={onRequestTradeOffs}
              disabled={isLoadingTradeOffs}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl btn-glow-purple text-white text-xs font-bold shadow-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>
                {isLoadingTradeOffs
                  ? 'Analyzing Trade-Offs...'
                  : 'Resolve Over-Budget with AI'}
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
