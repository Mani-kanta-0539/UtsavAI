/**
 * @file Custom React Hook for UtsavAI Celebration Planner
 * @module hooks/useCelebrationPlanner
 * Decouples state management, deterministic math orchestrations, and API effects
 * from dashboard presentation components to ensure pristine maintainability.
 */

import { useState, useEffect, useCallback } from 'react';
import { PRESET_WEDDING, PersonaPreset } from '@/engine/demoPresets';
import {
  allocateBudgetByPriority,
  calculateGuestSurgeRipple,
  recalculateTimelineDAG,
  applyTradeOffStrategy,
} from '@/engine/plannerEngine';
import {
  EventContext,
  CategoryBudget,
  PriorityCategory,
  ConsequenceDiff,
  TradeOffStrategy,
} from '@/types/planner';
import { EventTask, TaskStatus } from '@/types/timeline';
import { CelebrationPlannerState } from '@/types/dashboard';

/**
 * Custom Hook managing all celebration consequence planning state.
 * @returns {CelebrationPlannerState} Reactive planner state and action handlers
 */
export function useCelebrationPlanner(): CelebrationPlannerState {
  const [activePreset, setActivePreset] = useState<PersonaPreset>(PRESET_WEDDING);
  const [context, setContext] = useState<EventContext>(PRESET_WEDDING.context);
  const [categories, setCategories] = useState<CategoryBudget[]>(() =>
    allocateBudgetByPriority(
      PRESET_WEDDING.context.totalBudget,
      PRESET_WEDDING.context.priorities,
      PRESET_WEDDING.context.eventType
    )
  );
  const [tasks, setTasks] = useState<EventTask[]>(PRESET_WEDDING.tasks);
  const [dateShiftDays, setDateShiftDays] = useState<number>(0);
  const [consequence, setConsequence] = useState<ConsequenceDiff>({
    guestDelta: 0,
    budgetDelta: 0,
    daysDelta: 0,
    cateringDiff: 0,
    venueDiff: 0,
    totalEstimatedCost: PRESET_WEDDING.context.totalBudget,
    netDifference: 0,
    overBudgetAmount: 0,
    isOverBudget: false,
    summaryText: 'Baseline initial plan loaded.',
    priorityImpactDescription: 'Budget is fully balanced across categories.',
  });

  const [tradeOffStrategies, setTradeOffStrategies] = useState<TradeOffStrategy[]>([]);
  const [tradeOffSource, setTradeOffSource] = useState<'gemini' | 'smart_fallback'>('smart_fallback');
  const [isLoadingTradeOffs, setIsLoadingTradeOffs] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'vendors' | 'concept'>('budget');

  // Hydrate custom context from Onboarding Quiz if stored in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('utsav_custom_onboard');
    if (!stored) return;
    try {
      const p = JSON.parse(stored);
      const customCtx: EventContext = {
        id: 'custom-onboard',
        eventType: p.eventType || 'wedding',
        title: p.title || 'My Celebration',
        totalBudget: p.totalBudget || 800000,
        originalBudget: p.totalBudget || 800000,
        guestCount: p.guestCount || 200,
        originalGuestCount: p.guestCount || 200,
        eventDate: p.eventDate || '2026-04-15',
        originalEventDate: p.eventDate || '2026-04-15',
        venueType: 'indoor',
        mustHaves: ['Signature Live Counters'],
        accessibilityNeeds: p.accessibilityNeeds || ['Quiet Senior Zone'],
        priorities: p.priorities || ['catering', 'venue', 'decor'],
      };
      setContext(customCtx);
      setCategories(allocateBudgetByPriority(customCtx.totalBudget, customCtx.priorities, customCtx.eventType));
      localStorage.removeItem('utsav_custom_onboard');
    } catch {
      // Gracefully ignore corrupt local storage
    }
  }, []);

  const handleSelectPreset = useCallback((preset: PersonaPreset) => {
    setActivePreset(preset);
    setContext(preset.context);
    setTasks(preset.tasks);
    setDateShiftDays(0);
    setTradeOffStrategies([]);
    setCategories(allocateBudgetByPriority(preset.context.totalBudget, preset.context.priorities, preset.context.eventType));
    setConsequence({
      guestDelta: 0,
      budgetDelta: 0,
      daysDelta: 0,
      cateringDiff: 0,
      venueDiff: 0,
      totalEstimatedCost: preset.context.totalBudget,
      netDifference: 0,
      overBudgetAmount: 0,
      isOverBudget: false,
      summaryText: `${preset.badge} loaded.`,
      priorityImpactDescription: `Protecting: ${preset.context.priorities[0]?.toUpperCase()}.`,
    });
  }, []);

  const handleGuestChange = useCallback((newGuests: number) => {
    setContext((prevCtx) => {
      const updatedCtx = { ...prevCtx, guestCount: newGuests };
      setCategories((prevCats) => {
        const { updatedCategories, consequence: diff } = calculateGuestSurgeRipple(updatedCtx, prevCats, newGuests);
        setConsequence(diff);
        return updatedCategories;
      });
      return updatedCtx;
    });
  }, []);

  const handleBudgetChange = useCallback((newBudget: number) => {
    setContext((prevCtx) => {
      const updatedCtx = { ...prevCtx, totalBudget: newBudget };
      setCategories((prevCats) => {
        const totalCost = prevCats.reduce((sum, c) => sum + c.allocatedAmount, 0);
        const net = totalCost - newBudget;
        setConsequence((prevDiff) => ({
          ...prevDiff,
          netDifference: net,
          overBudgetAmount: Math.max(0, net),
          isOverBudget: net > 0,
          summaryText: `Budget adjusted to ₹${newBudget.toLocaleString('en-IN')}.`,
        }));
        return prevCats;
      });
      return updatedCtx;
    });
  }, []);

  const handleToggleItemStatus = useCallback((cat: PriorityCategory, itemId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.category === cat
          ? {
              ...c,
              items: c.items.map((it) =>
                it.id === itemId
                  ? { ...it, status: it.status === 'unverified_ai' ? 'confirmed_quote' : 'unverified_ai' }
                  : it
              ),
            }
          : c
      )
    );
  }, []);

  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus, delayDays?: number) => {
    setTasks((prevTasks) => recalculateTimelineDAG(prevTasks, taskId, newStatus, delayDays).tasks);
  }, []);

  const handleRequestTradeOffs = useCallback(async () => {
    setIsLoadingTradeOffs(true);
    try {
      const catMap: Record<string, number> = {};
      categories.forEach((c) => {
        catMap[c.category] = c.allocatedAmount;
      });
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TRADE_OFFS',
          eventType: context.eventType,
          totalBudget: context.totalBudget,
          currentEstimatedCost: consequence.totalEstimatedCost,
          guestCount: context.guestCount,
          priorities: context.priorities,
          categories: catMap,
        }),
      });
      const data = await res.json();
      if (data.success && data.strategies) {
        setTradeOffStrategies(data.strategies);
        setTradeOffSource(data.source);
      }
    } catch {
      // Gracefully retain current strategies
    } finally {
      setIsLoadingTradeOffs(false);
    }
  }, [categories, context, consequence.totalEstimatedCost]);

  const handleApplyStrategy = useCallback((strat: TradeOffStrategy) => {
    setCategories((prevCats) => {
      const updated = applyTradeOffStrategy(prevCats, strat);
      const newTotal = updated.reduce((sum, c) => sum + c.allocatedAmount, 0);
      const diff = newTotal - context.totalBudget;
      setConsequence((prev) => ({
        ...prev,
        totalEstimatedCost: newTotal,
        netDifference: diff,
        overBudgetAmount: Math.max(0, diff),
        isOverBudget: diff > 0,
        summaryText: `Applied "${strat.title}". Saved ₹${strat.savingsTotal.toLocaleString('en-IN')}.`,
        priorityImpactDescription: strat.tradeOffConsequence,
      }));
      return updated;
    });
    setTradeOffStrategies([]);
  }, [context.totalBudget]);

  const handleSimulateOverrun = useCallback(() => {
    handleGuestChange(context.guestCount + 50);
    setTimeout(() => {
      handleRequestTradeOffs();
    }, 100);
  }, [context.guestCount, handleGuestChange, handleRequestTradeOffs]);

  return {
    activePreset,
    context,
    categories,
    tasks,
    dateShiftDays,
    consequence,
    tradeOffStrategies,
    tradeOffSource,
    isLoadingTradeOffs,
    isPresetModalOpen,
    isHighContrast,
    activeTab,
    setContext,
    setActiveTab,
    setIsPresetModalOpen,
    toggleHighContrast: () => setIsHighContrast((prev) => !prev),
    handleSelectPreset,
    handleGuestChange,
    handleBudgetChange,
    handleDateShiftChange: setDateShiftDays,
    handleToggleItemStatus,
    handleUpdateTaskStatus,
    handleRequestTradeOffs,
    handleApplyStrategy,
    handleDismissTradeOffs: () => setTradeOffStrategies([]),
    handleSimulateOverrun,
    handleResetToBaseline: () => handleSelectPreset(activePreset),
  };
}
