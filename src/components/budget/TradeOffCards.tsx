'use client';

import React from 'react';
import { TradeOffStrategy } from '@/types/planner';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface TradeOffCardsProps {
  strategies: TradeOffStrategy[];
  source: 'gemini' | 'smart_fallback';
  onApplyStrategy: (strategy: TradeOffStrategy) => void;
  onDismiss: () => void;
}

export const TradeOffCards: React.FC<TradeOffCardsProps> = ({
  strategies,
  source,
  onApplyStrategy,
  onDismiss,
}) => {
  if (!strategies || strategies.length === 0) return null;

  return (
    <section
      aria-labelledby="tradeoffs-heading"
      className="bg-white rounded-2xl border-2 border-amber-400 p-6 shadow-xl relative animate-fade-in"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 id="tradeoffs-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              AI Over-Budget Trade-Off Resolver
            </h2>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                source === 'gemini'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {source === 'gemini' ? 'Gemini 2.5 Flash' : 'Smart Heuristic'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Select one of 3 mathematically vetted compromise scenarios to rebalance your budget.
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="text-xs text-slate-400 hover:text-slate-700 underline self-start sm:self-auto"
        >
          Dismiss
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {strategies.map((strat) => {
          const badgeColor =
            strat.badge === 'Priority Shield'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : strat.badge === 'Balanced'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : 'bg-amber-100 text-amber-800 border-amber-300';

          return (
            <div
              key={strat.id}
              className="rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                    {strat.badge}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    Saves ₹{strat.savingsTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  {strat.title}
                </h3>
                <p className="text-xs font-semibold text-amber-800 mt-0.5">
                  {strat.tagline}
                </p>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {strat.description}
                </p>

                {/* Adjustments */}
                <div className="mt-3 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Adjustments:
                  </div>
                  {Object.entries(strat.categoryAdjustments).map(([cat, delta]) => (
                    <div key={cat} className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-slate-700">{cat}</span>
                      <span className="text-rose-600 font-bold">
                        {delta! > 0 ? '+' : ''}₹{delta!.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded border border-amber-200/50">
                  <span className="font-semibold text-slate-700">Impact: </span>
                  {strat.tradeOffConsequence}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApplyStrategy(strat)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
              >
                <span>Apply This Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
