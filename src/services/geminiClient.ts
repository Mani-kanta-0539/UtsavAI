/**
 * @file Gemini API Client & Integration Layer for UtsavAI
 * Calls Google Gemini (gemini-2.5-flash / gemini-3.8-flash) via @google/genai,
 * with zero client-side key leakage and seamless graceful fallback.
 */

import { GoogleGenAI } from '@google/genai';
import {
  generateFallbackTradeOffs,
  generateFallbackVendorComparisons,
  generateFallbackConcept,
} from './fallbackEngine';
import { TradeOffStrategy } from '../types/planner';
import { ParsedVendorQuote } from '../types/vendor';
import { ConceptStudioResponse, AIRequest } from '../types/api';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey.trim().length > 10) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[UtsavAI] Failed to initialize GoogleGenAI client, will use Smart Fallback:', err);
  }
}

/**
 * Executes Trade-Off Generation using Gemini, falling back gracefully if necessary.
 */
export async function getTradeOffStrategies(
  req: Extract<AIRequest, { action: 'TRADE_OFFS' }>
): Promise<{ strategies: TradeOffStrategy[]; source: 'gemini' | 'smart_fallback' }> {
  if (!aiClient) {
    return {
      strategies: generateFallbackTradeOffs(
        req.eventType,
        req.totalBudget,
        req.currentEstimatedCost,
        req.guestCount,
        req.priorities,
        req.categories
      ),
      source: 'smart_fallback',
    };
  }

  try {
    const prompt = `You are an expert event architect for UtsavAI.
Event Type: ${req.eventType}
Budget: ₹${req.totalBudget}
Current Estimated Cost: ₹${req.currentEstimatedCost} (Over budget by ₹${req.currentEstimatedCost - req.totalBudget})
Guest Count: ${req.guestCount}
User Priorities in order: ${req.priorities.join(' > ')}
Category allocations: ${JSON.stringify(req.categories)}

Generate exactly 3 distinct trade-off strategies to bring the cost back under budget.
Return ONLY valid JSON matching this schema:
[
  {
    "id": "strat-1",
    "title": "Short title",
    "tagline": "One-line hook",
    "description": "2-3 sentences explaining exactly how to rebalance",
    "categoryAdjustments": { "decor": -20000, "photography": -15000 },
    "savingsTotal": 35000,
    "tradeOffConsequence": "Honest explanation of what changes visually or operationally",
    "badge": "Priority Shield" | "Balanced" | "Aggressive"
  }
]`;

    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text) as TradeOffStrategy[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return { strategies: parsed, source: 'gemini' };
    }
    throw new Error('Invalid format received from Gemini');
  } catch (error) {
    console.warn('[UtsavAI] Gemini Trade-Off API error, serving Smart Fallback:', error);
    return {
      strategies: generateFallbackTradeOffs(
        req.eventType,
        req.totalBudget,
        req.currentEstimatedCost,
        req.guestCount,
        req.priorities,
        req.categories
      ),
      source: 'smart_fallback',
    };
  }
}

/**
 * Parses unstructured messy vendor quotes into structured comparisons.
 */
export async function parseVendorQuotes(
  req: Extract<AIRequest, { action: 'PARSE_VENDOR_QUOTES' }>
): Promise<{ comparisons: ParsedVendorQuote[]; source: 'gemini' | 'smart_fallback' }> {
  if (!aiClient) {
    return {
      comparisons: generateFallbackVendorComparisons(req.category, req.guestCount, req.quotes),
      source: 'smart_fallback',
    };
  }

  try {
    const prompt = `You are an expert vendor contract negotiator for UtsavAI.
Category: ${req.category}
Guest Count: ${req.guestCount}
Analyze these raw quotes:
${JSON.stringify(req.quotes)}

Extract true costs, identify hidden fees (+18% GST extra, diesel generators, cleaning), pros, cons, and calculate priority fit (0-100).
Return ONLY valid JSON array matching this schema:
[
  {
    "id": "quote-id",
    "vendorName": "Vendor Name",
    "category": "${req.category}",
    "baseCost": 150000,
    "taxesAndFees": 27000,
    "grandTotal": 177000,
    "perPersonEquivalent": 885,
    "includedPerks": ["Perk 1"],
    "hiddenCharges": ["18% GST extra"],
    "redFlags": ["Open ended electricity fee"],
    "priorityFitScore": 85,
    "pros": ["Pro 1"],
    "cons": ["Con 1"],
    "verdict": "Clear summary recommendation"
  }
]`;

    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '') as ParsedVendorQuote[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return { comparisons: parsed, source: 'gemini' };
    }
    throw new Error('Invalid JSON format from Gemini');
  } catch (error) {
    console.warn('[UtsavAI] Gemini Quote API error, serving Smart Fallback:', error);
    return {
      comparisons: generateFallbackVendorComparisons(req.category, req.guestCount, req.quotes),
      source: 'smart_fallback',
    };
  }
}

/**
 * Generates cultural, multi-generational concepts and layouts.
 */
export async function generateEventConcept(
  req: Extract<AIRequest, { action: 'GENERATE_CONCEPTS' }>
): Promise<{ concept: ConceptStudioResponse; source: 'gemini' | 'smart_fallback' }> {
  if (!aiClient) {
    return {
      concept: generateFallbackConcept(
        req.eventType,
        req.guestCount,
        req.totalBudget,
        req.accessibilityNeeds,
        req.priorities,
        req.mustHaves,
        req.refinePrompt
      ),
      source: 'smart_fallback',
    };
  }

  try {
    const prompt = `You are an expert celebratory concept designer for UtsavAI.
Event Type: ${req.eventType}
Guest Count: ${req.guestCount}
Budget: ₹${req.totalBudget}
Accessibility / Age Needs: ${req.accessibilityNeeds.join(', ')}
Top Priorities: ${req.priorities.join(', ')}
Must Haves: ${req.mustHaves.join(', ')}
${req.refinePrompt ? `Refinement Instruction: "${req.refinePrompt}"` : ''}

Generate an inclusive multi-generational theme and layout with dedicated zones (seniors, kids, main).
Return ONLY valid JSON matching this schema:
{
  "themeName": "Creative Theme Name",
  "tagline": "Theme tagline",
  "culturalRationale": "Explanation of cultural and demographic balance",
  "demographicZones": [
    { "zoneName": "Senior Comfort Zone", "targetAudience": "Elders", "features": ["Feature 1", "Feature 2"] }
  ],
  "menuHighlights": [
    { "category": "Live Counters", "items": ["Item 1"], "dietaryNotes": "Jain / Diabetic notes" }
  ],
  "costSavingIdea": "Actionable high-impact cost saving idea"
}`;

    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '') as ConceptStudioResponse;
    if (parsed.themeName && parsed.demographicZones) {
      return { concept: parsed, source: 'gemini' };
    }
    throw new Error('Invalid concept schema from Gemini');
  } catch (error) {
    console.warn('[UtsavAI] Gemini Concept API error, serving Smart Fallback:', error);
    return {
      concept: generateFallbackConcept(
        req.eventType,
        req.guestCount,
        req.totalBudget,
        req.accessibilityNeeds,
        req.priorities,
        req.mustHaves,
        req.refinePrompt
      ),
      source: 'smart_fallback',
    };
  }
}
