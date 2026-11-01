'use client';

import React, { useState } from 'react';
import { EventContext } from '@/types/planner';
import { ConceptStudioResponse } from '@/types/api';
import { Sparkles, Users, Utensils, HeartHandshake, ArrowRight, Lightbulb } from 'lucide-react';

interface ConceptStudioProps {
  context: EventContext;
}

export const ConceptStudio: React.FC<ConceptStudioProps> = ({ context }) => {
  const [concept, setConcept] = useState<ConceptStudioResponse | null>(null);
  const [refinePrompt, setRefinePrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [source, setSource] = useState<'gemini' | 'smart_fallback' | null>(null);

  const handleGenerate = async (customPrompt?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'GENERATE_CONCEPTS',
          eventType: context.eventType,
          guestCount: context.guestCount,
          totalBudget: context.totalBudget,
          accessibilityNeeds: context.accessibilityNeeds,
          priorities: context.priorities,
          mustHaves: context.mustHaves,
          refinePrompt: customPrompt || refinePrompt || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.concept) {
        setConcept(data.concept);
        setSource(data.source);
      }
    } catch (err) {
      console.error('Failed to generate concept:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="concept-heading" className="bg-white rounded-2xl border border-amber-200/70 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 id="concept-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Cultural & Multi-Generational Concept Studio
          </h2>
          <p className="text-xs text-slate-500">
            Tailored themes, spatial demographic layouts, and menu curation that balance elder comfort with kids enthusiasm.
          </p>
        </div>

        {!concept && (
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center space-x-1.5 disabled:opacity-50 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Designing Concept...' : 'Generate Theme & Layout'}</span>
          </button>
        )}
      </div>

      {concept && (
        <div className="mt-5 space-y-6 animate-fade-in">
          {/* Theme Banner */}
          <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 p-5 rounded-2xl border border-amber-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                Curated Theme
              </span>
              {source && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {source === 'gemini' ? 'Gemini 2.5 Flash' : 'Smart Heuristic'}
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-2">{concept.themeName}</h3>
            <p className="text-xs font-semibold text-amber-900 mt-0.5">{concept.tagline}</p>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">{concept.culturalRationale}</p>
          </div>

          {/* Demographic Zones */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              Multi-Generational Spatial Zones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {concept.demographicZones.map((zone, idx) => (
                <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                  <div className="font-bold text-sm text-slate-900">{zone.zoneName}</div>
                  <div className="text-[11px] font-medium text-amber-700 mt-0.5">{zone.targetAudience}</div>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    {zone.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Highlights */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-amber-600" />
              Inclusive Cultural Menu Highlights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {concept.menuHighlights.map((menu, mi) => (
                <div key={mi} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <div className="font-bold text-xs text-slate-900">{menu.category}</div>
                  <div className="text-xs text-slate-700 mt-1 font-medium">{menu.items.join(' • ')}</div>
                  <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    {menu.dietaryNotes}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Cost Saving Tip */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold">Architect Cost-Saving Tip: </span>
              {concept.costSavingIdea}
            </div>
          </div>

          {/* Refine Idea Box */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Refine idea: e.g. 'Make it 20% cheaper', 'More traditional Gujarati royal style'..."
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => handleGenerate(refinePrompt)}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 disabled:opacity-50 transition-colors"
            >
              <span>{isLoading ? 'Refining...' : 'Refine Idea'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
