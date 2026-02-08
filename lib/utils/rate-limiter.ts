interface RateLimiterConfig {
  tokensPerInterval: number;
  interval: number; // in milliseconds
  maxRetries?: number; // Max retry attempts to prevent infinite recursion
}

class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly config: RateLimiterConfig;
  private readonly maxRetries: number;

  constructor(config: RateLimiterConfig) {
    this.config = config;
    this.tokens = config.tokensPerInterval;
    this.lastRefill = Date.now();
    this.maxRetries = config.maxRetries ?? 10;
  }

  async acquire(): Promise<void> {
    return this.tryAcquire(0);
  }

  private async tryAcquire(attempt: number): Promise<void> {
    if (attempt >= this.maxRetries) {
      throw new Error(
        `Rate limiter: max retries (${this.maxRetries}) exceeded. API rate limit exhausted.`
      );
    }

    this.refill();

    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }

    // Wait until next token is available
    const waitTime = this.calculateWaitTime();
    await this.sleep(waitTime);
    return this.tryAcquire(attempt + 1);
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(
      (timePassed / this.config.interval) * this.config.tokensPerInterval
    );

    this.tokens = Math.min(
      this.config.tokensPerInterval,
      this.tokens + tokensToAdd
    );
    this.lastRefill = now;
  }

  private calculateWaitTime(): number {
    const tokensNeeded = 1 - this.tokens;
    return Math.ceil(
      (tokensNeeded / this.config.tokensPerInterval) * this.config.interval
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Finnhub free tier: 60 calls/minute
export const finnhubRateLimiter = new RateLimiter({
  tokensPerInterval: 60,
  interval: 60000, // 1 minute
});
