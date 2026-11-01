/**
 * @file Pure Deterministic Planner Engine for UtsavAI
 * High-performance O(n) math engine for budget weighting, guest ripple scaling,
 * and O(V+E) topological DAG timeline delay propagation.
 */

import {
  EventType,
  PriorityCategory,
  CategoryBudget,
  BudgetLineItem,
  EventContext,
  ConsequenceDiff,
  TradeOffStrategy,
} from '../types/planner';
import { EventTask, DAGPropagationResult, TaskStatus } from '../types/timeline';
import {
  BASELINE_WEIGHTS,
  CATEGORY_LABELS,
  FIXED_COST_CATEGORIES,
} from './plannerConstants';

/**
 * Distributes total budget across categories weighted by user priority rankings.
 */
export function allocateBudgetByPriority(
  totalBudget: number,
  priorities: PriorityCategory[],
  eventType: EventType
): CategoryBudget[] {
  const baseWeights = { ...BASELINE_WEIGHTS[eventType] };
  const categories = Object.keys(baseWeights) as PriorityCategory[];

  // Priority Skew: Boost higher priority categories and shave lowest
  if (priorities.length > 0) {
    const topPriority = priorities[0];
    const secondPriority = priorities[1];

    if (topPriority && baseWeights[topPriority]) {
      baseWeights[topPriority] += 0.08;
    }
    if (secondPriority && baseWeights[secondPriority]) {
      baseWeights[secondPriority] += 0.04;
    }

    // Normalize weights to sum exactly to 1.0
    const sum = Object.values(baseWeights).reduce((a, b) => a + b, 0);
    categories.forEach((cat) => {
      baseWeights[cat] = baseWeights[cat] / sum;
    });
  }

  return categories.map((cat) => {
    const weight = baseWeights[cat] || 0.1;
    const allocated = Math.round(totalBudget * weight);
    const isFixed = FIXED_COST_CATEGORIES.includes(cat);

    const items: BudgetLineItem[] = [
      {
        id: `item-${cat}-1`,
        category: cat,
        name: `Primary ${CATEGORY_LABELS[cat]}`,
        estimatedCost: Math.round(allocated * 0.75),
        status: 'unverified_ai',
        isFixedCost: isFixed,
      },
      {
        id: `item-${cat}-2`,
        category: cat,
        name: `Ancillary ${CATEGORY_LABELS[cat]}`,
        estimatedCost: Math.round(allocated * 0.25),
        status: 'unverified_ai',
        isFixedCost: isFixed,
      },
    ];

    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      allocatedAmount: allocated,
      percentageOfTotal: Math.round(weight * 100),
      items,
    };
  });
}

/**
 * Calculates deterministic ripple effects of changing guest count.
 */
export function calculateGuestSurgeRipple(
  context: EventContext,
  currentCategories: CategoryBudget[],
  newGuestCount: number
): { updatedCategories: CategoryBudget[]; consequence: ConsequenceDiff } {
  const guestDelta = newGuestCount - context.guestCount;
  const guestRatio = newGuestCount / Math.max(context.guestCount, 1);

  let cateringDiff = 0;
  let venueDiff = 0;

  const updatedCategories = currentCategories.map((cat) => {
    if (cat.category === 'catering') {
      const oldAmount = cat.allocatedAmount;
      const newAmount = Math.round(oldAmount * guestRatio);
      cateringDiff = newAmount - oldAmount;
      return {
        ...cat,
        allocatedAmount: newAmount,
        items: cat.items.map((it) => ({
          ...it,
          estimatedCost: Math.round(it.estimatedCost * guestRatio),
        })),
      };
    }
    // Venue surge tier if guest capacity crosses 20% jump
    if (cat.category === 'venue' && guestRatio > 1.25) {
      const oldAmount = cat.allocatedAmount;
      const newAmount = Math.round(oldAmount * 1.12); // 12% expansion fee
      venueDiff = newAmount - oldAmount;
      return { ...cat, allocatedAmount: newAmount };
    }
    return { ...cat };
  });

  const totalEstimatedCost = updatedCategories.reduce(
    (acc, curr) => acc + curr.allocatedAmount,
    0
  );
  const netDifference = totalEstimatedCost - context.totalBudget;
  const isOverBudget = netDifference > 0;
  const topPriority = context.priorities[0] || 'catering';

  const summaryText =
    guestDelta !== 0
      ? `${guestDelta > 0 ? '+' : ''}${guestDelta} guests changed catering by ₹${cateringDiff.toLocaleString('en-IN')}.${
          venueDiff > 0
            ? ` Venue capacity tier added ₹${venueDiff.toLocaleString('en-IN')}.`
            : ''
        }`
      : 'Guest count unchanged.';

  const priorityImpactDescription =
    topPriority === 'catering' && isOverBudget
      ? 'Catering is your #1 Priority. Do not compromise per-plate food quality—use UtsavAI trade-off scenarios to rebalance decor or photo.'
      : isOverBudget
      ? `Budget exceeded by ₹${netDifference.toLocaleString('en-IN')}. Protect your priority (${CATEGORY_LABELS[topPriority]}).`
      : 'Budget remains healthy within safe boundaries.';

  const consequence: ConsequenceDiff = {
    guestDelta,
    budgetDelta: 0,
    daysDelta: 0,
    cateringDiff,
    venueDiff,
    totalEstimatedCost,
    netDifference,
    overBudgetAmount: Math.max(0, netDifference),
    isOverBudget,
    summaryText,
    priorityImpactDescription,
  };

  return { updatedCategories, consequence };
}

/**
 * Propagates task status and delay ripples across the Dependency DAG.
 */
export function recalculateTimelineDAG(
  tasks: EventTask[],
  modifiedTaskId: string,
  newStatus: TaskStatus,
  delayDays: number = 0
): DAGPropagationResult {
  const taskMap = new Map<string, EventTask>();
  tasks.forEach((t) => taskMap.set(t.id, { ...t }));

  const targetTask = taskMap.get(modifiedTaskId);
  if (!targetTask) {
    return {
      tasks,
      impactedDownstreamIds: [],
      criticalPathAlert: false,
      mitigationSummary: 'Task not found.',
    };
  }

  targetTask.status = newStatus;
  targetTask.delayDays = newStatus === 'delayed' ? delayDays : 0;

  const impactedDownstreamIds: string[] = [];

  // Downstream propagation BFS/DFS
  if (newStatus === 'delayed' && delayDays > 0) {
    const queue = [modifiedTaskId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      visited.add(currentId);

      tasks.forEach((t) => {
        if (t.dependsOn.includes(currentId) && !visited.has(t.id)) {
          const downstreamTask = taskMap.get(t.id);
          if (downstreamTask) {
            impactedDownstreamIds.push(t.id);
            // Shift due date by delayDays
            const currentDue = new Date(downstreamTask.dueDate);
            currentDue.setDate(currentDue.getDate() + delayDays);
            downstreamTask.dueDate = currentDue.toISOString().split('T')[0];
            downstreamTask.mitigationNote = `Prerequisite "${targetTask.title}" delayed by ${delayDays}d. Expedite vendor selection to recover buffer.`;
            queue.push(t.id);
          }
        }
      });
    }
  }

  const updatedTasks = Array.from(taskMap.values());
  const criticalPathAlert =
    newStatus === 'delayed' &&
    (targetTask.isCriticalPath || impactedDownstreamIds.length > 1);

  return {
    tasks: updatedTasks,
    impactedDownstreamIds,
    criticalPathAlert,
    mitigationSummary: criticalPathAlert
      ? `Delay in "${targetTask.title}" ripples into ${impactedDownstreamIds.length} downstream milestones. Immediate mitigation recommended.`
      : `Status updated for "${targetTask.title}".`,
  };
}

/**
 * Applies a selected AI trade-off strategy to the current budget categories.
 */
export function applyTradeOffStrategy(
  categories: CategoryBudget[],
  strategy: TradeOffStrategy
): CategoryBudget[] {
  return categories.map((cat) => {
    const adjustment = strategy.categoryAdjustments[cat.category];
    if (adjustment !== undefined) {
      const newAllocated = Math.max(0, cat.allocatedAmount + adjustment);
      return {
        ...cat,
        allocatedAmount: newAllocated,
      };
    }
    return { ...cat };
  });
}
