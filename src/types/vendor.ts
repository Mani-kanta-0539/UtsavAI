/**
 * @file Vendor Types for UtsavAI
 * Data models for vendor checklists, raw quotes, and structured AI quote comparisons.
 */

import { PriorityCategory } from './planner';

export interface RawQuoteInput {
  id: string;
  vendorName: string;
  category: PriorityCategory;
  rawText: string;
}

export interface ParsedVendorQuote {
  id: string;
  vendorName: string;
  category: PriorityCategory;
  baseCost: number;
  taxesAndFees: number;
  grandTotal: number;
  perPersonEquivalent: number;
  includedPerks: string[];
  hiddenCharges: string[];
  redFlags: string[];
  priorityFitScore: number; // 0 to 100
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface VendorChecklistItem {
  id: string;
  category: PriorityCategory;
  vendorRole: string;
  recommendedQuestions: string[];
  status: 'not_contacted' | 'shortlisted' | 'quote_received' | 'booked';
  assignedVendorName?: string;
  confirmedCost?: number;
}
