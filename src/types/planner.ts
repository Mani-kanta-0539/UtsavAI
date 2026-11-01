/**
 * @file Core Planner Type Definitions for UtsavAI
 * Strict TypeScript models for events, budgets, priorities, and what-if consequence models.
 */

export type EventType = 'wedding' | 'birthday' | 'community';

export type PriorityCategory =
  | 'catering'
  | 'venue'
  | 'decor'
  | 'photography'
  | 'entertainment'
  | 'logistics'
  | 'buffer';

export type VerificationStatus = 'unverified_ai' | 'confirmed_quote';

export type VenueType = 'indoor' | 'outdoor' | 'intimate' | 'hybrid';

export interface BudgetLineItem {
  id: string;
  category: PriorityCategory;
  name: string;
  estimatedCost: number;
  status: VerificationStatus;
  isFixedCost: boolean;
  notes?: string;
}

export interface CategoryBudget {
  category: PriorityCategory;
  label: string;
  allocatedAmount: number;
  percentageOfTotal: number;
  items: BudgetLineItem[];
}

export interface EventContext {
  id: string;
  eventType: EventType;
  title: string;
  totalBudget: number;
  originalBudget: number;
  guestCount: number;
  originalGuestCount: number;
  eventDate: string; // ISO YYYY-MM-DD
  originalEventDate: string;
  venueType: VenueType;
  mustHaves: string[];
  accessibilityNeeds: string[];
  priorities: PriorityCategory[];
  culturalNotes?: string;
}

export interface ConsequenceDiff {
  guestDelta: number;
  budgetDelta: number;
  daysDelta: number;
  cateringDiff: number;
  venueDiff: number;
  totalEstimatedCost: number;
  netDifference: number;
  overBudgetAmount: number;
  isOverBudget: boolean;
  summaryText: string;
  priorityImpactDescription: string;
}

export interface TradeOffStrategy {
  id: string;
  title: string;
  tagline: string;
  description: string;
  categoryAdjustments: Partial<Record<PriorityCategory, number>>;
  savingsTotal: number;
  tradeOffConsequence: string;
  badge: 'Aggressive' | 'Balanced' | 'Priority Shield';
}
