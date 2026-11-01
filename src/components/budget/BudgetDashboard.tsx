'use client';

import React from 'react';
import { CategoryBudget, PriorityCategory } from '@/types/planner';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface BudgetDashboardProps {
  categories: CategoryBudget[];
  totalBudget: number;
  topPriority: PriorityCategory;
  onToggleItemStatus: (categoryId: PriorityCategory, itemId: string) => void;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  categories,
  totalBudget,
  topPriority,
  onToggleItemStatus,
}) => {
  const currentTotal = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const percentUsed = Math.round((currentTotal / Math.max(totalBudget, 1)) * 100);
  const isOver = currentTotal > totalBudget;

  return (
    <section aria-labelledby="budget-summary-heading" className="glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <h2 id="budget-summary-heading" className="text-base font-bold text-white">
            Priority-Weighted Budget Allocation
          </h2>
          <p className="text-xs text-slate-400">
            Transparent breakdown badging estimated vs verified vendor quotes.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-300">
            Total Allocated:{' '}
            <span className={`text-base font-extrabold ${isOver ? 'text-rose-400' : 'text-amber-400'}`}>
              ₹{currentTotal.toLocaleString('en-IN')}
            </span>{' '}
            / ₹{totalBudget.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400">
            Capacity:{' '}
            <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
              {percentUsed}%
            </span>
          </div>
        </div>
      </div>

      <div className="w-full bg-white/10 h-2.5 rounded-full mt-4 overflow-hidden" role="progressbar" aria-valuenow={percentUsed} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full transition-all duration-300 ${
            percentUsed > 100
              ? 'bg-rose-500'
              : percentUsed > 90
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          }`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {categories.map((cat) => {
          const isTopPriority = cat.category === topPriority;
          return (
            <div
              key={cat.category}
              className={`rounded-xl p-4 border transition-all ${
                isTopPriority
                  ? 'border-amber-400/50 bg-amber-500/10 ring-1 ring-amber-400/30'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1">
                  {cat.label}
                  {isTopPriority && (
                    <span className="text-[10px] text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded font-bold border border-amber-400/30">
                      #1 Priority
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-amber-300">
                  ₹{cat.allocatedAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {cat.items.map((item) => {
                  const isVerified = item.status === 'confirmed_quote';
                  return (
                    <div
                      key={item.id}
                      className="text-xs bg-black/50 p-2.5 rounded-xl border border-white/10 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium text-slate-200 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.isFixedCost ? 'Fixed Cost' : 'Scales per Guest'}
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-bold text-white text-xs">
                          ₹{item.estimatedCost.toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleItemStatus(cat.category, item.id)}
                          aria-label={`Toggle verification status for ${item.name}`}
                          className={`mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              Confirmed Quote
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-2.5 h-2.5 text-amber-400" />
                              AI Estimate - Unverified
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
