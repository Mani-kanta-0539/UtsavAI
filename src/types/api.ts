/**
 * @file API Request and Response Schemas for UtsavAI
 * Strict Zod validation and TypeScript type definitions for /api/ai endpoints.
 */

import { z } from 'zod';
import { ParsedVendorQuote } from './vendor';
import { TradeOffStrategy } from './planner';

// Action types
export type AIAction = 'TRADE_OFFS' | 'PARSE_VENDOR_QUOTES' | 'GENERATE_CONCEPTS';

// Zod Request Schemas
export const TradeOffRequestSchema = z.object({
  action: z.literal('TRADE_OFFS'),
  eventType: z.enum(['wedding', 'birthday', 'community']),
  totalBudget: z.number().positive().max(100000000),
  currentEstimatedCost: z.number().positive().max(100000000),
  guestCount: z.number().int().positive().max(10000),
  priorities: z.array(z.string()).min(1).max(10),
  categories: z.record(z.string(), z.number()),
});

export const VendorQuoteRequestSchema = z.object({
  action: z.literal('PARSE_VENDOR_QUOTES'),
  category: z.string().max(50),
  guestCount: z.number().int().positive().max(10000),
  quotes: z
    .array(
      z.object({
        id: z.string().max(50),
        vendorName: z.string().max(100),
        rawText: z.string().max(5000),
      })
    )
    .min(1)
    .max(5),
});

export const ConceptRequestSchema = z.object({
  action: z.literal('GENERATE_CONCEPTS'),
  eventType: z.enum(['wedding', 'birthday', 'community']),
  guestCount: z.number().int().positive().max(10000),
  totalBudget: z.number().positive().max(100000000),
  accessibilityNeeds: z.array(z.string().max(100)).max(10),
  priorities: z.array(z.string()).max(10),
  mustHaves: z.array(z.string().max(200)).max(10),
  refinePrompt: z.string().max(500).optional(),
});

export const AIRequestSchema = z.discriminatedUnion('action', [
  TradeOffRequestSchema,
  VendorQuoteRequestSchema,
  ConceptRequestSchema,
]);

export type AIRequest = z.infer<typeof AIRequestSchema>;

export interface ConceptStudioResponse {
  themeName: string;
  tagline: string;
  culturalRationale: string;
  demographicZones: {
    zoneName: string;
    targetAudience: string;
    features: string[];
  }[];
  menuHighlights: {
    category: string;
    items: string[];
    dietaryNotes: string;
  }[];
  costSavingIdea: string;
}

export type AIResponse =
  | { success: true; action: 'TRADE_OFFS'; strategies: TradeOffStrategy[]; source: 'gemini' | 'smart_fallback' }
  | { success: true; action: 'PARSE_VENDOR_QUOTES'; comparisons: ParsedVendorQuote[]; source: 'gemini' | 'smart_fallback' }
  | { success: true; action: 'GENERATE_CONCEPTS'; concept: ConceptStudioResponse; source: 'gemini' | 'smart_fallback' }
  | { success: false; error: string };
