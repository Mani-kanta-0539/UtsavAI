/**
 * @file Dashboard & State Hook Type Definitions for UtsavAI
 * @module types/dashboard
 * Defines strict TypeScript interfaces for dashboard state management and hook actions.
 */

import { PersonaPreset } from '@/engine/demoPresets';
import {
  EventContext,
  CategoryBudget,
  PriorityCategory,
  ConsequenceDiff,
  TradeOffStrategy,
} from './planner';
import { EventTask, TaskStatus } from './timeline';
import { DashboardTabId } from '@/components/common/DashboardTabs';

/**
 * Return type definition for useCelebrationPlanner hook
 */
export interface CelebrationPlannerState {
  activePreset: PersonaPreset;
  context: EventContext;
  categories: CategoryBudget[];
  tasks: EventTask[];
  dateShiftDays: number;
  consequence: ConsequenceDiff;
  tradeOffStrategies: TradeOffStrategy[];
  tradeOffSource: 'gemini' | 'smart_fallback';
  isLoadingTradeOffs: boolean;
  isPresetModalOpen: boolean;
  isHighContrast: boolean;
  activeTab: DashboardTabId;

  setContext: (ctx: EventContext) => void;
  setActiveTab: (tab: DashboardTabId) => void;
  setIsPresetModalOpen: (open: boolean) => void;
  toggleHighContrast: () => void;
  handleSelectPreset: (preset: PersonaPreset) => void;
  handleGuestChange: (newGuests: number) => void;
  handleBudgetChange: (newBudget: number) => void;
  handleDateShiftChange: (days: number) => void;
  handleToggleItemStatus: (cat: PriorityCategory, itemId: string) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: TaskStatus, delayDays?: number) => void;
  handleRequestTradeOffs: () => Promise<void>;
  handleApplyStrategy: (strat: TradeOffStrategy) => void;
  handleDismissTradeOffs: () => void;
  handleSimulateOverrun: () => void;
  handleResetToBaseline: () => void;
}
