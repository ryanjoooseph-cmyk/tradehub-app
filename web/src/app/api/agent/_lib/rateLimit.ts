import { NextRequest, NextResponse } from 'next/server';

type Bucket = {
  tokens: number;
  lastRefill: number;
};

// In-memory token bucket storage
const buckets = new Map<string, Bucket>();

const MAX_TOKENS = 10;
const REFILL_RATE = 1; // tokens per second
const WINDOW_MS = 60000; // 1 minute

export function checkRateLimit(req: NextRequest, agentName: string): NextResponse | null {
  // Get identifier (IP + agent name)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
  const key = `${ip}:${agentName}`;

  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefill: now };
    buckets.set(key, bucket);
  }

  // Refill tokens based on time elapsed
  const elapsed = (now - bucket.lastRefill) / 1000;
  const tokensToAdd = Math.floor(elapsed * REFILL_RATE);
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  // Check if tokens available
  if (bucket.tokens < 1) {
    return NextResponse.json(
      { ok: false, error: 'Rate limit exceeded', code: 'RATE_LIMIT', retryAfter: Math.ceil((1 - bucket.tokens) / REFILL_RATE) },
      { status: 429 }
    );
  }

  // Consume a token
  bucket.tokens -= 1;

  return null; // Rate limit passed
}

// Cleanup old buckets periodically (simple memory management)
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.lastRefill > WINDOW_MS * 2) {
      buckets.delete(key);
    }
  }
}, WINDOW_MS);
