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
} from '@/services/geminiClient';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. In-memory Rate Limiting
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
        {
          status: 429,
          headers: {
            'Retry-After': String(rateStatus.resetSeconds),
          },
        }
      );
    }

    // 2. Parse & Zod Validation
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

    // 3. Dispatch to AI Action Handlers
    switch (validData.action) {
      case 'TRADE_OFFS': {
        const result = await getTradeOffStrategies(validData);
        return NextResponse.json({
          success: true,
          action: 'TRADE_OFFS',
          strategies: result.strategies,
          source: result.source,
        });
      }

      case 'PARSE_VENDOR_QUOTES': {
        const result = await parseVendorQuotes(validData);
        return NextResponse.json({
          success: true,
          action: 'PARSE_VENDOR_QUOTES',
          comparisons: result.comparisons,
          source: result.source,
        });
      }

      case 'GENERATE_CONCEPTS': {
        const result = await generateEventConcept(validData);
        return NextResponse.json({
          success: true,
          action: 'GENERATE_CONCEPTS',
          concept: result.concept,
          source: result.source,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported action type.' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[UtsavAI] API Route Uncaught Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error while processing celebration request.',
      },
      { status: 500 }
    );
  }
}
