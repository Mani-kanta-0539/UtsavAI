'use client';

import React, { useState } from 'react';
import { PriorityCategory } from '@/types/planner';
import { CATEGORY_LABELS } from '@/engine/plannerConstants';
import { CheckSquare, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const QUESTIONS_DATABASE: Record<PriorityCategory, string[]> = {
  catering: [
    'Is a pre-booking menu tasting session included in this quotation?',
    'What is your staff-to-guest ratio for live counters vs buffet replenishment?',
    'Are heating equipment (chafing fuel) and mineral water included or billed on actual consumption?',
    'What is the precise overtime charge per hour if the dinner extends past midnight?',
  ],
  venue: [
    'What is the exact sound limit curfew (e.g. 10:00 PM for outdoor lawns)?',
    'Is power backup (diesel generator) included in rental or billed separately per unit/hour?',
    'Do you have a strict empanelled vendor list or can we bring our preferred caterer/decorator?',
    'Are green rooms, bridal suites, and guest parking valet included in this cost?',
  ],
  decor: [
    'How many hours prior to the event will our team be granted access for stage floral setup?',
    'Are the quoted stage flowers fresh local marigolds or imported varieties?',
    'Is venue teardown and waste removal included, or does the venue charge a cleaning penalty?',
  ],
  photography: [
    'How many shooters will be on-site (traditional + candid + drone)?',
    'What is the guaranteed turnaround time for the teaser reel and full cinematic film?',
    'Do we get all raw high-res unedited footage on a portable hard drive?',
  ],
  entertainment: [
    'Does your package include standard wireless cordless mics and audio mixer sound engineer?',
    'What are your power voltage requirements to prevent circuit trips with the venue?',
  ],
  logistics: [
    'Are local municipal noise permissions and police NOCs managed by your team?',
    'What is the cancellation and force-majeure weather refund policy?',
  ],
  buffer: [
    'What reserve cash buffer is held for unexpected day-of tips, overtime, or extra guest plates?',
  ],
};

export const VendorChecklist: React.FC = () => {
  const [expandedCat, setExpandedCat] = useState<PriorityCategory | null>('catering');

  return (
    <section aria-labelledby="checklist-heading" className="glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl text-white">
      <div className="pb-4 border-b border-white/10">
        <h2 id="checklist-heading" className="text-base font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-amber-400" />
          Vendor Negotiation Checklist & Critical Questions
        </h2>
        <p className="text-xs text-slate-400">
          Essential questions to ask each vendor category before signing contracts to protect your budget from surprise fees.
        </p>
      </div>

      <div className="space-y-3 mt-4">
        {(Object.keys(QUESTIONS_DATABASE) as PriorityCategory[]).map((cat) => {
          const isExpanded = expandedCat === cat;
          const questions = QUESTIONS_DATABASE[cat] || [];

          return (
            <div key={cat} className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
              <button
                type="button"
                onClick={() => setExpandedCat(isExpanded ? null : cat)}
                className="w-full flex items-center justify-between p-3.5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
                aria-expanded={isExpanded}
              >
                <span className="font-bold text-xs text-slate-200 flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  {CATEGORY_LABELS[cat]} ({questions.length} Essential Questions)
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 bg-black/60 space-y-2 border-t border-white/10">
                  {questions.map((q, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                      <span className="font-bold text-amber-400 shrink-0">Q{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
