'use client';

import React from 'react';
import { TradeOffStrategy } from '@/types/planner';
import { Sparkles, ArrowRight } from 'lucide-react';

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
    <section aria-labelledby="tradeoffs-heading" className="glass-panel rounded-2xl border-2 border-amber-400/60 p-6 shadow-2xl relative text-white animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 id="tradeoffs-heading" className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              AI Over-Budget Trade-Off Resolver
            </h2>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                source === 'gemini'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {source === 'gemini' ? 'Gemini 2.5 Flash' : 'Smart Heuristic'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Select one of 3 mathematically vetted compromise scenarios to rebalance your budget.
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="text-xs text-slate-400 hover:text-white underline self-start sm:self-auto"
        >
          Dismiss
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {strategies.map((strat) => {
          const badgeColor =
            strat.badge === 'Priority Shield'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : strat.badge === 'Balanced'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

          return (
            <div
              key={strat.id}
              className="rounded-xl p-4 border border-white/10 hover:border-amber-400/50 transition-all flex flex-col justify-between bg-black/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                    {strat.badge}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    Saves ₹{strat.savingsTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">
                  {strat.title}
                </h3>
                <p className="text-xs font-semibold text-amber-300 mt-0.5">
                  {strat.tagline}
                </p>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {strat.description}
                </p>

                <div className="mt-3 bg-white/[0.04] p-2.5 rounded-lg border border-white/10 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Adjustments:
                  </div>
                  {Object.entries(strat.categoryAdjustments).map(([cat, delta]) => (
                    <div key={cat} className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-slate-300">{cat}</span>
                      <span className="text-rose-400 font-bold">
                        {delta! > 0 ? '+' : ''}₹{delta!.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-[11px] text-slate-300 italic bg-amber-500/10 p-2 rounded border border-amber-500/20">
                  <span className="font-semibold text-amber-300">Impact: </span>
                  {strat.tradeOffConsequence}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApplyStrategy(strat)}
                className="mt-4 w-full py-2 px-3 rounded-xl btn-glow-amber text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Apply Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
