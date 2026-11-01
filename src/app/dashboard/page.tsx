'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { PresetSelector } from '@/components/common/PresetSelector';
import { DashboardTabs, DashboardTabId } from '@/components/common/DashboardTabs';
import { ContextWizard } from '@/components/wizard/ContextWizard';
import { WhatIfSimulator } from '@/components/budget/WhatIfSimulator';
import { ConsequenceBanner } from '@/components/budget/ConsequenceBanner';
import { BudgetDashboard } from '@/components/budget/BudgetDashboard';
import { TradeOffCards } from '@/components/budget/TradeOffCards';
import { TimelineTracker } from '@/components/timeline/TimelineTracker';
import { CalendarExport } from '@/components/timeline/CalendarExport';
import { VendorComparator } from '@/components/vendors/VendorComparator';
import { VendorChecklist } from '@/components/vendors/VendorChecklist';
import { ConceptStudio } from '@/components/concept/ConceptStudio';
import { FloatingChatbot } from '@/components/common/FloatingChatbot';
import { Footer } from '@/components/common/Footer';
import { PRESET_WEDDING, PersonaPreset } from '@/engine/demoPresets';
import { allocateBudgetByPriority, calculateGuestSurgeRipple, recalculateTimelineDAG, applyTradeOffStrategy } from '@/engine/plannerEngine';
import { EventContext, CategoryBudget, PriorityCategory, ConsequenceDiff, TradeOffStrategy } from '@/types/planner';
import { EventTask } from '@/types/timeline';

export default function DashboardPage() {
  const [activePreset, setActivePreset] = useState<PersonaPreset>(PRESET_WEDDING);
  const [context, setContext] = useState<EventContext>(PRESET_WEDDING.context);
  const [categories, setCategories] = useState<CategoryBudget[]>(() =>
    allocateBudgetByPriority(PRESET_WEDDING.context.totalBudget, PRESET_WEDDING.context.priorities, PRESET_WEDDING.context.eventType)
  );
  const [tasks, setTasks] = useState<EventTask[]>(PRESET_WEDDING.tasks);
  const [dateShiftDays, setDateShiftDays] = useState<number>(0);
  const [consequence, setConsequence] = useState<ConsequenceDiff>({
    guestDelta: 0, budgetDelta: 0, daysDelta: 0, cateringDiff: 0, venueDiff: 0,
    totalEstimatedCost: PRESET_WEDDING.context.totalBudget, netDifference: 0, overBudgetAmount: 0,
    isOverBudget: false, summaryText: 'Baseline initial plan loaded.',
    priorityImpactDescription: 'Budget is fully balanced across categories.',
  });

  const [tradeOffStrategies, setTradeOffStrategies] = useState<TradeOffStrategy[]>([]);
  const [tradeOffSource, setTradeOffSource] = useState<'gemini' | 'smart_fallback'>('smart_fallback');
  const [isLoadingTradeOffs, setIsLoadingTradeOffs] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTabId>('budget');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('utsav_custom_onboard');
    if (!stored) return;
    try {
      const p = JSON.parse(stored);
      const customCtx: EventContext = {
        id: 'custom-onboard', eventType: p.eventType || 'wedding', title: p.title || 'My Celebration',
        totalBudget: p.totalBudget || 800000, originalBudget: p.totalBudget || 800000,
        guestCount: p.guestCount || 200, originalGuestCount: p.guestCount || 200,
        eventDate: p.eventDate || '2026-04-15', originalEventDate: p.eventDate || '2026-04-15',
        venueType: 'indoor', mustHaves: ['Signature Live Counters'],
        accessibilityNeeds: p.accessibilityNeeds || ['Quiet Senior Zone'],
        priorities: p.priorities || ['catering', 'venue', 'decor'],
      };
      setContext(customCtx);
      setCategories(allocateBudgetByPriority(customCtx.totalBudget, customCtx.priorities, customCtx.eventType));
      localStorage.removeItem('utsav_custom_onboard');
    } catch {}
  }, []);

  const handleSelectPreset = (preset: PersonaPreset) => {
    setActivePreset(preset);
    setContext(preset.context);
    setTasks(preset.tasks);
    setDateShiftDays(0);
    setTradeOffStrategies([]);
    setCategories(allocateBudgetByPriority(preset.context.totalBudget, preset.context.priorities, preset.context.eventType));
    setConsequence({
      guestDelta: 0, budgetDelta: 0, daysDelta: 0, cateringDiff: 0, venueDiff: 0,
      totalEstimatedCost: preset.context.totalBudget, netDifference: 0, overBudgetAmount: 0, isOverBudget: false,
      summaryText: `${preset.badge} loaded.`, priorityImpactDescription: `Protecting: ${preset.context.priorities[0]?.toUpperCase()}.`,
    });
  };

  const handleGuestChange = (newGuests: number) => {
    const updatedCtx = { ...context, guestCount: newGuests };
    setContext(updatedCtx);
    const { updatedCategories, consequence: diff } = calculateGuestSurgeRipple(updatedCtx, categories, newGuests);
    setCategories(updatedCategories);
    setConsequence(diff);
  };

  const handleBudgetChange = (newBudget: number) => {
    const updatedCtx = { ...context, totalBudget: newBudget };
    setContext(updatedCtx);
    const totalCost = categories.reduce((s, c) => s + c.allocatedAmount, 0);
    const net = totalCost - newBudget;
    setConsequence((prev) => ({
      ...prev, netDifference: net, overBudgetAmount: Math.max(0, net), isOverBudget: net > 0,
      summaryText: `Budget adjusted to ₹${newBudget.toLocaleString('en-IN')}.`,
    }));
  };

  const handleToggleItemStatus = (cat: PriorityCategory, itemId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.category === cat
          ? {
              ...c,
              items: c.items.map((it) => (it.id === itemId ? { ...it, status: it.status === 'unverified_ai' ? 'confirmed_quote' : 'unverified_ai' } : it)),
            }
          : c
      )
    );
  };

  const handleRequestTradeOffs = async () => {
    setIsLoadingTradeOffs(true);
    try {
      const catMap: Record<string, number> = {};
      categories.forEach((c) => { catMap[c.category] = c.allocatedAmount; });
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TRADE_OFFS', eventType: context.eventType, totalBudget: context.totalBudget, currentEstimatedCost: consequence.totalEstimatedCost, guestCount: context.guestCount, priorities: context.priorities, categories: catMap }),
      });
      const data = await res.json();
      if (data.success && data.strategies) {
        setTradeOffStrategies(data.strategies);
        setTradeOffSource(data.source);
      }
    } catch {
    } finally {
      setIsLoadingTradeOffs(false);
    }
  };

  const handleApplyStrategy = (strat: TradeOffStrategy) => {
    const updated = applyTradeOffStrategy(categories, strat);
    setCategories(updated);
    const newTotal = updated.reduce((s, c) => s + c.allocatedAmount, 0);
    const diff = newTotal - context.totalBudget;
    setConsequence((prev) => ({
      ...prev, totalEstimatedCost: newTotal, netDifference: diff, overBudgetAmount: Math.max(0, diff), isOverBudget: diff > 0,
      summaryText: `Applied "${strat.title}". Saved ₹${strat.savingsTotal.toLocaleString('en-IN')}.`, priorityImpactDescription: strat.tradeOffConsequence,
    }));
    setTradeOffStrategies([]);
  };

  return (
    <div className={`min-h-screen ${isHighContrast ? 'high-contrast' : ''} bg-[#0b0a12] text-white flex flex-col justify-between`}>
      <Navbar currentPersonaTitle={activePreset.badge} isHighContrast={isHighContrast} onToggleHighContrast={() => setIsHighContrast(!isHighContrast)} onOpenPresetModal={() => setIsPresetModalOpen(true)} />
      <PresetSelector isOpen={isPresetModalOpen} activePresetId={activePreset.id} onSelectPreset={handleSelectPreset} onClose={() => setIsPresetModalOpen(false)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        <ContextWizard context={context} onUpdateContext={setContext} />
        <WhatIfSimulator
          originalGuests={context.originalGuestCount} currentGuests={context.guestCount}
          originalBudget={context.originalBudget} currentBudget={context.totalBudget} dateShiftDays={dateShiftDays}
          onUpdateGuests={handleGuestChange} onUpdateBudget={handleBudgetChange} onUpdateDateShift={setDateShiftDays}
          onSimulateOverrun={() => { handleGuestChange(context.guestCount + 50); setTimeout(handleRequestTradeOffs, 100); }}
          onReset={() => handleSelectPreset(activePreset)}
        />
        <ConsequenceBanner consequence={consequence} onRequestTradeOffs={handleRequestTradeOffs} isLoadingTradeOffs={isLoadingTradeOffs} />
        {tradeOffStrategies.length > 0 && <TradeOffCards strategies={tradeOffStrategies} source={tradeOffSource} onApplyStrategy={handleApplyStrategy} onDismiss={() => setTradeOffStrategies([])} />}
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'budget' && <BudgetDashboard categories={categories} totalBudget={context.totalBudget} topPriority={context.priorities[0] || 'catering'} onToggleItemStatus={handleToggleItemStatus} />}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <TimelineTracker tasks={tasks} onUpdateTaskStatus={(id, s, d) => setTasks(recalculateTimelineDAG(tasks, id, s, d).tasks)} />
            <CalendarExport eventName={context.title} tasks={tasks} eventDate={context.eventDate} />
          </div>
        )}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <VendorComparator category={context.priorities[0] || 'catering'} guestCount={context.guestCount} sampleQuotes={activePreset.sampleVendorQuotes} />
            <VendorChecklist />
          </div>
        )}
        {activeTab === 'concept' && <ConceptStudio context={context} />}
      </main>
      <Footer />
      <FloatingChatbot />
    </div>
  );
}
