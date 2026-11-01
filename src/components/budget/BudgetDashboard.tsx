'use client';

import React from 'react';
import { CategoryBudget, PriorityCategory, VerificationStatus } from '@/types/planner';
import { ShieldAlert, CheckCircle2, Info } from 'lucide-react';

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
    <section aria-labelledby="budget-summary-heading" className="bg-white rounded-2xl border border-amber-200/70 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 id="budget-summary-heading" className="text-lg font-bold text-slate-900">
            Priority-Weighted Budget Allocation
          </h2>
          <p className="text-xs text-slate-500">
            Transparent breakdown badging estimated vs verified vendor quotes.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-600">
            Total Allocated:{' '}
            <span className={`text-base font-extrabold ${isOver ? 'text-rose-600' : 'text-slate-900'}`}>
              ₹{currentTotal.toLocaleString('en-IN')}
            </span>{' '}
            / ₹{totalBudget.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500">
            Capacity:{' '}
            <span className={`font-bold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
              {percentUsed}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden" role="progressbar" aria-valuenow={percentUsed} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full transition-all duration-300 ${
            percentUsed > 100
              ? 'bg-rose-500'
              : percentUsed > 90
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {categories.map((cat) => {
          const isTopPriority = cat.category === topPriority;
          return (
            <div
              key={cat.category}
              className={`rounded-xl p-4 border transition-all ${
                isTopPriority
                  ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-300 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  {cat.label}
                  {isTopPriority && (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                      #1 Priority
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  ₹{cat.allocatedAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Line items with Transparency Guardrail */}
              <div className="mt-3 space-y-2">
                {cat.items.map((item) => {
                  const isVerified = item.status === 'confirmed_quote';
                  return (
                    <div
                      key={item.id}
                      className="text-xs bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium text-slate-800 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.isFixedCost ? 'Fixed Expense' : 'Scales per Guest'}
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-semibold text-slate-900 text-xs">
                          ₹{item.estimatedCost.toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleItemStatus(cat.category, item.id)}
                          aria-label={`Toggle verification status for ${item.name}`}
                          className={`mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              Confirmed Quote
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-2.5 h-2.5 text-amber-600" />
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
