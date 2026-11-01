'use client';

import React from 'react';
import { EventContext, PriorityCategory } from '@/types/planner';
import { CATEGORY_LABELS } from '@/engine/plannerConstants';
import { IndianRupee, Users, Calendar, HeartHandshake } from 'lucide-react';

interface ContextWizardProps {
  context: EventContext;
  onUpdateContext: (updated: EventContext) => void;
}

export const ContextWizard: React.FC<ContextWizardProps> = ({
  context,
  onUpdateContext,
}) => {
  const allPriorities: PriorityCategory[] = [
    'catering',
    'venue',
    'decor',
    'photography',
    'entertainment',
    'logistics',
    'buffer',
  ];

  const handlePrioritySelect = (cat: PriorityCategory) => {
    const without = context.priorities.filter((p) => p !== cat);
    onUpdateContext({ ...context, priorities: [cat, ...without] });
  };

  const commonAccessibility = [
    'Wheelchair Ramp Access',
    'Quiet Conversation Zone for Seniors',
    'Kids Entertainment & Play Area',
    'Diabetic & Low-Sodium Food Demarcation',
    'Elevator Access Near Main Dining',
  ];

  const toggleAccessibility = (need: string) => {
    const exists = context.accessibilityNeeds.includes(need);
    const updated = exists
      ? context.accessibilityNeeds.filter((n) => n !== need)
      : [...context.accessibilityNeeds, need];
    onUpdateContext({ ...context, accessibilityNeeds: updated });
  };

  return (
    <section aria-labelledby="wizard-heading" className="glass-panel rounded-2xl p-6 shadow-xl border border-amber-500/20 dark:border-white/10 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/15 dark:border-white/10">
        <div>
          <h2 id="wizard-heading" className="text-base font-bold text-slate-900 dark:text-white">
            Event Context & Priority Setup
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            UtsavAI weights every calculation by your specific top priorities and guest demographics.
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-md uppercase">
          {context.eventType}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="total-budget-input" className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
            Total Budget (₹)
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" />
            <input
              id="total-budget-input"
              type="number"
              min={10000}
              step={5000}
              value={context.totalBudget}
              onChange={(e) => onUpdateContext({ ...context, totalBudget: Math.max(10000, Number(e.target.value) || 0) })}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black/50 border border-amber-500/25 dark:border-white/15 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="guest-count-input" className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
            Guest Count (Pax)
          </label>
          <div className="relative">
            <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" />
            <input
              id="guest-count-input"
              type="number"
              min={10}
              max={5000}
              value={context.guestCount}
              onChange={(e) => onUpdateContext({ ...context, guestCount: Math.max(10, Number(e.target.value) || 0) })}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black/50 border border-amber-500/25 dark:border-white/15 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="event-date-input" className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" />
            <input
              id="event-date-input"
              type="date"
              value={context.eventDate}
              onChange={(e) => onUpdateContext({ ...context, eventDate: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black/50 border border-amber-500/25 dark:border-white/15 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-amber-500/15 dark:border-white/10">
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-2">
          Rank #1 Highest Priority (Protected from automatic cost-cutting cuts)
        </label>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select #1 Priority">
          {allPriorities.map((cat) => {
            const isTop = context.priorities[0] === cat;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={isTop}
                onClick={() => handlePrioritySelect(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isTop
                    ? 'btn-glow-amber text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-amber-500/20 dark:border-white/10 hover:bg-amber-500/5 dark:hover:bg-white/[0.08]'
                }`}
              >
                {CATEGORY_LABELS[cat]} {isTop && '★'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-amber-500/15 dark:border-white/10">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          Multi-Generational & Accessibility Requirements
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {commonAccessibility.map((need) => {
            const checked = context.accessibilityNeeds.includes(need);
            return (
              <label
                key={need}
                className={`flex items-center space-x-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                  checked
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'border-amber-500/15 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] hover:bg-white text-slate-700 dark:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAccessibility(need)}
                  className="rounded text-amber-500 focus:ring-amber-500 bg-white dark:bg-black/40 border-slate-300 dark:border-white/20"
                />
                <span className="truncate">{need}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
};
