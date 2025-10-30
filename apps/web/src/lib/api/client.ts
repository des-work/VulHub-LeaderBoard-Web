/* Resilient API client with retry, timeout, and circuit breaker */

export interface ApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  retry?: number;
}

class CircuitBreaker {
  private failures = 0;
  private openedAt = 0;
  constructor(private readonly threshold = 3, private readonly cooldownMs = 15000) {}
  isOpen() {
    if (this.failures < this.threshold) return false;
    return Date.now() - this.openedAt < this.cooldownMs;
  }
  recordSuccess() {
    this.failures = 0;
    this.openedAt = 0;
  }
  recordFailure() {
    this.failures += 1;
    if (this.failures >= this.threshold) this.openedAt = Date.now();
  }
}

export class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;
  private retry: number;
  private breaker = new CircuitBreaker();

  constructor(opts: ApiClientOptions = {}) {
    this.baseUrl = opts.baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    this.timeoutMs = opts.timeoutMs ?? 8000;
    this.retry = opts.retry ?? 2;
  }

  setBaseUrl(url: string) { this.baseUrl = url; }

  async health(): Promise<boolean> {
    try {
      const res = await this.get('/health');
      return !!res?.ok || res?.status === 'ok';
    } catch { return false; }
  }

  private async doFetch(path: string, init: RequestInit, attempt = 0): Promise<Response> {
    if (this.breaker.isOpen()) throw new Error('circuit_open');

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, { ...init, signal: controller.signal });
      clearTimeout(t);
      if (!res.ok && res.status >= 500 && attempt < this.retry) {
        return this.doFetch(path, init, attempt + 1);
      }
      this.breaker.recordSuccess();
      return res;
    } catch (e) {
      clearTimeout(t);
      this.breaker.recordFailure();
      if (attempt < this.retry) return this.doFetch(path, init, attempt + 1);
      throw e;
    }
  }

  async get(path: string) {
    const res = await this.doFetch(path, { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`server_${res.status}`);
    return res.json();
  }

  async post(path: string, body: any) {
    const res = await this.doFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`server_${res.status}`);
    return res.json();
  }

  async put(path: string, body: any) {
    const res = await this.doFetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`server_${res.status}`);
    return res.json();
  }
}

export const apiClient = new ApiClient();