/**
 * @file Sliding-Window In-Memory Rate Limiter for UtsavAI
 * Protects server-side AI endpoints from abuse and quota exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 30; // Max 30 requests per minute per IP

/**
 * Checks and updates rate limit for a client IP.
 */
export function checkRateLimit(clientIp: string = 'unknown'): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp) || { timestamps: [] };

  // Remove timestamps outside window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS) {
    const oldest = activeTimestamps[0] || now;
    const resetSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(clientIp, { timestamps: activeTimestamps });

  // Periodically clean up stale IPs (keep map under 10,000 items)
  if (rateLimitStore.size > 5000) {
    for (const [ip, rec] of rateLimitStore.entries()) {
      if (rec.timestamps.every((ts) => now - ts >= WINDOW_MS)) {
        rateLimitStore.delete(ip);
      }
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - activeTimestamps.length,
    resetSeconds: 60,
  };
}
