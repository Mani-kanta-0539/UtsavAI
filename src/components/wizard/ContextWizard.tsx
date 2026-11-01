'use client';

import React from 'react';
import { EventContext, PriorityCategory } from '@/types/planner';
import { CATEGORY_LABELS } from '@/engine/plannerConstants';
import { IndianRupee, Users, Calendar, HeartHandshake, CheckCircle2 } from 'lucide-react';

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
    onUpdateContext({
      ...context,
      priorities: [cat, ...without],
    });
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
    <section
      aria-labelledby="wizard-heading"
      className="bg-white rounded-2xl border border-amber-200/70 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 id="wizard-heading" className="text-lg font-bold text-slate-900">
            Event Context & Priority Setup
          </h2>
          <p className="text-xs text-slate-500">
            UtsavAI weights every calculation by your specific top priorities and guest demographics.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md uppercase">
          {context.eventType}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Total Budget */}
        <div>
          <label htmlFor="total-budget-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Total Budget (₹)
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="total-budget-input"
              type="number"
              aria-label="Total Event Budget in Rupees"
              min={10000}
              step={5000}
              value={context.totalBudget}
              onChange={(e) =>
                onUpdateContext({
                  ...context,
                  totalBudget: Math.max(10000, Number(e.target.value) || 0),
                })
              }
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Guest Count */}
        <div>
          <label htmlFor="guest-count-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Guest Count (Pax)
          </label>
          <div className="relative">
            <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="guest-count-input"
              type="number"
              aria-label="Expected Guest Count"
              min={10}
              max={5000}
              value={context.guestCount}
              onChange={(e) =>
                onUpdateContext({
                  ...context,
                  guestCount: Math.max(10, Number(e.target.value) || 0),
                })
              }
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="event-date-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="event-date-input"
              type="date"
              aria-label="Event Date"
              value={context.eventDate}
              onChange={(e) =>
                onUpdateContext({
                  ...context,
                  eventDate: e.target.value,
                })
              }
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Priority Selector */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Rank #1 Highest Priority (Protected from cost-cutting cuts)
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isTop
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                }`}
              >
                {CATEGORY_LABELS[cat]} {isTop && '★'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility & Inclusivity */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-rose-500" />
          Multi-Generational & Accessibility Requirements
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {commonAccessibility.map((need) => {
            const checked = context.accessibilityNeeds.includes(need);
            return (
              <label
                key={need}
                className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                  checked
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAccessibility(need)}
                  className="rounded text-amber-600 focus:ring-amber-500"
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
