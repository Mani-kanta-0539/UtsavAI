/**
 * @file Unit Test Suite for UtsavAI Deterministic Planner Engine
 * Tests priority weighting, guest ripples, DAG delay propagation,
 * calendar formatting, and input validation.
 */

import { describe, it, expect } from 'vitest';
import {
  allocateBudgetByPriority,
  calculateGuestSurgeRipple,
  recalculateTimelineDAG,
  applyTradeOffStrategy,
} from '../src/engine/plannerEngine';
import {
  formatGoogleCalendarUrl,
  generateICSContent,
  calculateDateShift,
} from '../src/engine/calendarEngine';
import {
  TradeOffRequestSchema,
  VendorQuoteRequestSchema,
} from '../src/types/api';
import { PRESET_WEDDING } from '../src/engine/demoPresets';
import { TradeOffStrategy } from '../src/types/planner';
import { EventTask } from '../src/types/timeline';

describe('UtsavAI Deterministic Engine Tests', () => {
  // Test 1: Priority Weighted Allocation Sum
  it('1. should allocate total budget such that category sum approximates total budget', () => {
    const total = 800000;
    const categories = allocateBudgetByPriority(
      total,
      ['catering', 'venue', 'decor'],
      'wedding'
    );
    const sum = categories.reduce((acc, c) => acc + c.allocatedAmount, 0);
    expect(sum).toBeGreaterThanOrEqual(total * 0.98);
    expect(sum).toBeLessThanOrEqual(total * 1.02);
  });

  // Test 2: Priority Bias Verification
  it('2. should skew higher weight to user top priority', () => {
    const total = 1000000;
    const catCateringFirst = allocateBudgetByPriority(
      total,
      ['catering', 'venue'],
      'wedding'
    );
    const catVenueFirst = allocateBudgetByPriority(
      total,
      ['venue', 'catering'],
      'wedding'
    );

    const cateringWhenFirst = catCateringFirst.find((c) => c.category === 'catering')!
      .allocatedAmount;
    const cateringWhenSecond = catVenueFirst.find((c) => c.category === 'catering')!
      .allocatedAmount;

    expect(cateringWhenFirst).toBeGreaterThan(cateringWhenSecond);
  });

  // Test 3: Guest Surge Scaling
  it('3. should scale variable catering costs when guest count increases (+50 guests)', () => {
    const ctx = { ...PRESET_WEDDING.context };
    const categories = allocateBudgetByPriority(ctx.totalBudget, ctx.priorities, ctx.eventType);
    const originalCatering = categories.find((c) => c.category === 'catering')!.allocatedAmount;

    const { updatedCategories, consequence } = calculateGuestSurgeRipple(
      ctx,
      categories,
      250 // +50 guests (25% increase)
    );

    const newCatering = updatedCategories.find((c) => c.category === 'catering')!.allocatedAmount;
    expect(newCatering).toBeGreaterThan(originalCatering);
    expect(consequence.guestDelta).toBe(50);
    expect(consequence.cateringDiff).toBeGreaterThan(0);
    expect(consequence.isOverBudget).toBe(true);
  });

  // Test 4: Fixed Costs Remain Fixed on Guest Count Change
  it('4. should keep fixed costs like photography unchanged during minor guest surge', () => {
    const ctx = { ...PRESET_WEDDING.context };
    const categories = allocateBudgetByPriority(ctx.totalBudget, ctx.priorities, ctx.eventType);
    const originalPhoto = categories.find((c) => c.category === 'photography')!.allocatedAmount;

    const { updatedCategories } = calculateGuestSurgeRipple(
      ctx,
      categories,
      220 // minor surge
    );

    const newPhoto = updatedCategories.find((c) => c.category === 'photography')!.allocatedAmount;
    expect(newPhoto).toBe(originalPhoto);
  });

  // Test 5: Negative Guest Surge (Guest Trim)
  it('5. should reduce catering costs when guest count is trimmed', () => {
    const ctx = { ...PRESET_WEDDING.context };
    const categories = allocateBudgetByPriority(ctx.totalBudget, ctx.priorities, ctx.eventType);
    const originalCatering = categories.find((c) => c.category === 'catering')!.allocatedAmount;

    const { updatedCategories, consequence } = calculateGuestSurgeRipple(
      ctx,
      categories,
      170 // -30 guests
    );

    const newCatering = updatedCategories.find((c) => c.category === 'catering')!.allocatedAmount;
    expect(newCatering).toBeLessThan(originalCatering);
    expect(consequence.guestDelta).toBe(-30);
    expect(consequence.cateringDiff).toBeLessThan(0);
  });

  // Test 6: Capacity Tier Surcharge on Extreme Surge (>25%)
  it('6. should trigger venue expansion fee on large guest jump (>25%)', () => {
    const ctx = { ...PRESET_WEDDING.context };
    const categories = allocateBudgetByPriority(ctx.totalBudget, ctx.priorities, ctx.eventType);
    const origVenue = categories.find((c) => c.category === 'venue')!.allocatedAmount;

    const { updatedCategories, consequence } = calculateGuestSurgeRipple(
      ctx,
      categories,
      280 // +80 guests (>25% jump)
    );

    const newVenue = updatedCategories.find((c) => c.category === 'venue')!.allocatedAmount;
    expect(newVenue).toBeGreaterThan(origVenue);
    expect(consequence.venueDiff).toBeGreaterThan(0);
  });

  // Test 7: Trade-off Strategy Application
  it('7. should rebalance budget categories according to trade-off strategy', () => {
    const categories = allocateBudgetByPriority(800000, ['catering', 'venue'], 'wedding');
    const origDecor = categories.find((c) => c.category === 'decor')!.allocatedAmount;

    const strategy: TradeOffStrategy = {
      id: 'strat-1',
      title: 'Protect Catering, Cut Decor',
      tagline: 'Save 30k from decor',
      description: 'Switch to minimalist floral',
      categoryAdjustments: { decor: -30000 },
      savingsTotal: 30000,
      tradeOffConsequence: 'Simpler stage floral arrangement',
      badge: 'Priority Shield',
    };

    const updated = applyTradeOffStrategy(categories, strategy);
    const newDecor = updated.find((c) => c.category === 'decor')!.allocatedAmount;
    expect(newDecor).toBe(origDecor - 30000);
  });

  // Test 8: DAG Propagation Shifts Dependent Tasks
  it('8. should push downstream task due dates when a prerequisite is delayed', () => {
    const tasks: EventTask[] = [
      {
        id: 't-1',
        title: 'Lock Venue',
        description: 'Deposit',
        phase: 'phase_1_concept',
        dueDate: '2026-01-10',
        originalDueDate: '2026-01-10',
        status: 'pending',
        category: 'venue',
        dependsOn: [],
        isCriticalPath: true,
      },
      {
        id: 't-2',
        title: 'Finalize Catering',
        description: 'Tasting',
        phase: 'phase_2_core_vendors',
        dueDate: '2026-01-20',
        originalDueDate: '2026-01-20',
        status: 'pending',
        category: 'catering',
        dependsOn: ['t-1'],
        isCriticalPath: true,
      },
    ];

    const result = recalculateTimelineDAG(tasks, 't-1', 'delayed', 5);
    const updatedCatering = result.tasks.find((t) => t.id === 't-2')!;

    expect(result.impactedDownstreamIds).toContain('t-2');
    expect(updatedCatering.dueDate).toBe('2026-01-25');
    expect(updatedCatering.mitigationNote).toContain('Prerequisite "Lock Venue" delayed');
  });

  // Test 9: Independent Tasks Not Impacted by DAG Delay
  it('9. should not alter independent tasks not connected in DAG', () => {
    const tasks: EventTask[] = [
      {
        id: 't-1',
        title: 'Lock Venue',
        description: 'Deposit',
        phase: 'phase_1_concept',
        dueDate: '2026-01-10',
        originalDueDate: '2026-01-10',
        status: 'pending',
        category: 'venue',
        dependsOn: [],
        isCriticalPath: true,
      },
      {
        id: 't-indep',
        title: 'Create Playlist',
        description: 'Music track',
        phase: 'phase_2_core_vendors',
        dueDate: '2026-01-15',
        originalDueDate: '2026-01-15',
        status: 'pending',
        category: 'entertainment',
        dependsOn: [],
        isCriticalPath: false,
      },
    ];

    const result = recalculateTimelineDAG(tasks, 't-1', 'delayed', 4);
    const indepTask = result.tasks.find((t) => t.id === 't-indep')!;
    expect(indepTask.dueDate).toBe('2026-01-15');
    expect(result.impactedDownstreamIds).not.toContain('t-indep');
  });

  // Test 10: Multi-hop Transit Delay Propagation
  it('10. should propagate delays transitively across multiple hops (A -> B -> C)', () => {
    const tasks: EventTask[] = [
      {
        id: 'a',
        title: 'Step A',
        description: '',
        phase: 'phase_1_concept',
        dueDate: '2026-01-01',
        originalDueDate: '2026-01-01',
        status: 'pending',
        category: 'venue',
        dependsOn: [],
        isCriticalPath: true,
      },
      {
        id: 'b',
        title: 'Step B',
        description: '',
        phase: 'phase_2_core_vendors',
        dueDate: '2026-01-10',
        originalDueDate: '2026-01-10',
        status: 'pending',
        category: 'catering',
        dependsOn: ['a'],
        isCriticalPath: true,
      },
      {
        id: 'c',
        title: 'Step C',
        description: '',
        phase: 'phase_3_invitations_decor',
        dueDate: '2026-01-20',
        originalDueDate: '2026-01-20',
        status: 'pending',
        category: 'decor',
        dependsOn: ['b'],
        isCriticalPath: true,
      },
    ];

    const result = recalculateTimelineDAG(tasks, 'a', 'delayed', 3);
    expect(result.impactedDownstreamIds).toContain('b');
    expect(result.impactedDownstreamIds).toContain('c');

    const taskC = result.tasks.find((t) => t.id === 'c')!;
    expect(taskC.dueDate).toBe('2026-01-23');
  });

  // Test 11: Google Calendar URL Formatting
  it('11. should generate valid RFC compliant Google Calendar render links', () => {
    const url = formatGoogleCalendarUrl('Lock Caterer', 'Review menu', '2026-03-15');
    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('20260315T090000Z');
    expect(url).toContain('Lock+Caterer');
  });

  // Test 12: iCalendar (.ics) Generator Format
  it('12. should output valid VCALENDAR and VEVENT fields in .ics generation', () => {
    const tasks = PRESET_WEDDING.tasks;
    const ics = generateICSContent('Aarav & Meera Wedding', tasks);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('PRODID:-//UtsavAI//Consequence-Aware Event Planner//EN');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('Aarav & Meera Wedding');
  });

  // Test 13: Date Shift Urgency Detection
  it('13. should flag compressed deadlines with appropriate urgency rating', () => {
    const normal = calculateDateShift('2026-05-01', '2026-05-10');
    expect(normal.isCompressed).toBe(false);
    expect(normal.urgencyRating).toBe('normal');

    const tight = calculateDateShift('2026-05-15', '2026-05-05'); // -10 days
    expect(tight.isCompressed).toBe(true);
    expect(tight.urgencyRating).toBe('tight');

    const critical = calculateDateShift('2026-06-01', '2026-05-10'); // -22 days
    expect(critical.isCompressed).toBe(true);
    expect(critical.urgencyRating).toBe('critical');
  });

  // Test 14: Input Sanitization - Rejects Negative Budget
  it('14. should reject negative or zero budget in TradeOffRequestSchema', () => {
    const invalidPayload = {
      action: 'TRADE_OFFS',
      eventType: 'wedding',
      totalBudget: -50000,
      currentEstimatedCost: 600000,
      guestCount: 100,
      priorities: ['catering'],
      categories: { catering: 400000 },
    };

    const parsed = TradeOffRequestSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });

  // Test 15: Input Sanitization - Rejects Excessively Large Text in Vendor Quotes
  it('15. should reject raw quotes exceeding safe length limit', () => {
    const massiveText = 'A'.repeat(6000); // Max allowed is 5000
    const payload = {
      action: 'PARSE_VENDOR_QUOTES',
      category: 'catering',
      guestCount: 200,
      quotes: [{ id: 'q1', vendorName: 'BigVendor', rawText: massiveText }],
    };

    const parsed = VendorQuoteRequestSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });

  // Test 16: Input Validation - Valid Trade-Off Payload Succeeds
  it('16. should accept valid trade-off request payload', () => {
    const validPayload = {
      action: 'TRADE_OFFS',
      eventType: 'wedding',
      totalBudget: 800000,
      currentEstimatedCost: 950000,
      guestCount: 200,
      priorities: ['catering', 'venue'],
      categories: { catering: 350000, venue: 250000 },
    };

    const parsed = TradeOffRequestSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  // Test 17: Consequence diff priority warning for top priority
  it('17. should specifically protect and mention user #1 priority in diff note', () => {
    const ctx = { ...PRESET_WEDDING.context, priorities: ['catering', 'decor'] as any };
    const categories = allocateBudgetByPriority(ctx.totalBudget, ctx.priorities, ctx.eventType);
    const { consequence } = calculateGuestSurgeRipple(ctx, categories, 260);

    expect(consequence.priorityImpactDescription).toContain('Catering is your #1 Priority');
  });
});
