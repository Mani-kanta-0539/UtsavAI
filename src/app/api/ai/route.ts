/**
 * @file Secure Next.js Server API Route for UtsavAI (/api/ai)
 * Validates with Zod, applies sliding-window rate limiting,
 * and executes AI reasoning with deterministic fallback.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIRequestSchema } from '@/types/api';
import { checkRateLimit } from '@/services/rateLimiter';
import {
  getTradeOffStrategies,
  parseVendorQuotes,
  generateEventConcept,
  getChatReply,
} from '@/services/geminiClient';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateStatus = checkRateLimit(clientIp);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please wait ${rateStatus.resetSeconds}s before retrying.`,
        },
        { status: 429, headers: { 'Retry-After': String(rateStatus.resetSeconds) } }
      );
    }

    const body = await req.json();
    const validationResult = AIRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: Invalid request payload structure.',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    switch (validData.action) {
      case 'TRADE_OFFS': {
        const result = await getTradeOffStrategies(validData);
        return NextResponse.json({ success: true, action: 'TRADE_OFFS', strategies: result.strategies, source: result.source });
      }

      case 'PARSE_VENDOR_QUOTES': {
        const result = await parseVendorQuotes(validData);
        return NextResponse.json({ success: true, action: 'PARSE_VENDOR_QUOTES', comparisons: result.comparisons, source: result.source });
      }

      case 'GENERATE_CONCEPTS': {
        const result = await generateEventConcept(validData);
        return NextResponse.json({ success: true, action: 'GENERATE_CONCEPTS', concept: result.concept, source: result.source });
      }

      case 'CHAT': {
        const result = await getChatReply(validData);
        return NextResponse.json({ success: true, action: 'CHAT', reply: result.reply, source: result.source });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unsupported action type.' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('[UtsavAI] API Route Uncaught Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error while processing celebration request.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
