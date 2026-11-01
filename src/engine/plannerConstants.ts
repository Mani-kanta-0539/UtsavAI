/**
 * @file Planner Constants & Baseline Distribution Matrices for UtsavAI
 * Cultural and event-type baseline weightings.
 */

import { EventType, PriorityCategory } from '../types/planner';

export const BASELINE_WEIGHTS: Record<EventType, Record<PriorityCategory, number>> = {
  wedding: {
    catering: 0.35,
    venue: 0.25,
    decor: 0.15,
    photography: 0.10,
    entertainment: 0.05,
    logistics: 0.05,
    buffer: 0.05,
  },
  birthday: {
    catering: 0.32,
    venue: 0.22,
    entertainment: 0.18,
    decor: 0.14,
    photography: 0.06,
    logistics: 0.03,
    buffer: 0.05,
  },
  community: {
    venue: 0.30,
    logistics: 0.25,
    catering: 0.20,
    entertainment: 0.10,
    decor: 0.05,
    photography: 0.05,
    buffer: 0.05,
  },
};

export const CATEGORY_LABELS: Record<PriorityCategory, string> = {
  catering: 'Catering & Beverages',
  venue: 'Venue & Infrastructure',
  decor: 'Decor & Floral Styling',
  photography: 'Photo & Videography',
  entertainment: 'Music & Entertainment',
  logistics: 'Logistics & Permissions',
  buffer: 'Emergency Contingency Buffer',
};

export const FIXED_COST_CATEGORIES: PriorityCategory[] = [
  'venue',
  'photography',
  'entertainment',
  'decor',
  'logistics',
];

export const VARIABLE_COST_CATEGORIES: PriorityCategory[] = ['catering'];
