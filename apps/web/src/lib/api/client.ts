/* Resilient API client with retry, timeout, and circuit breaker */

import { ApiError, NetworkError, TimeoutError, createApiError, parseApiError, logError } from './errors';

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
  private authToken: string | null = null;

  constructor(opts: ApiClientOptions = {}) {
    this.baseUrl = opts.baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    this.timeoutMs = opts.timeoutMs ?? 8000;
    this.retry = opts.retry ?? 2;
    
    // Load auth token from localStorage if available
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('auth_token');
    }
  }

  setBaseUrl(url: string) { this.baseUrl = url; }
  
  setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }
  
  getAuthToken(): string | null {
    return this.authToken;
  }
  
  private getHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...additionalHeaders
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  async health(): Promise<boolean> {
    try {
      const res = await this.get('/health');
      return !!res?.ok || res?.status === 'ok';
    } catch { return false; }
  }

  private async doFetch(path: string, init: RequestInit, attempt = 0): Promise<Response> {
    if (this.breaker.isOpen()) {
      const error = new ApiError(503, 'SERVICE_UNAVAILABLE', 'Service temporarily unavailable');
      logError(error, { path, attempt });
      throw error;
    }

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), this.timeoutMs);
    
    try {
      const res = await fetch(`${this.baseUrl}${path}`, { ...init, signal: controller.signal });
      clearTimeout(t);
      
      // Retry on server errors
      if (!res.ok && res.status >= 500 && attempt < this.retry) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000)); // Exponential backoff
        return this.doFetch(path, init, attempt + 1);
      }
      
      this.breaker.recordSuccess();
      return res;
    } catch (e: any) {
      clearTimeout(t);
      this.breaker.recordFailure();
      
      // Handle timeout
      if (e.name === 'AbortError') {
        const error = new TimeoutError();
        logError(error, { path, attempt });
        
        if (attempt < this.retry) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.doFetch(path, init, attempt + 1);
        }
        throw error;
      }
      
      // Handle network errors
      if (e.message?.includes('fetch') || e.message?.includes('network')) {
        const error = new NetworkError();
        logError(error, { path, attempt });
        
        if (attempt < this.retry) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.doFetch(path, init, attempt + 1);
        }
        throw error;
      }
      
      // Log and re-throw
      logError(e, { path, attempt });
      if (attempt < this.retry) return this.doFetch(path, init, attempt + 1);
      throw e;
    }
  }

  private async handleResponse(res: Response): Promise<any> {
    const contentType = res.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    if (!res.ok) {
      let errorData;
      try {
        errorData = isJson ? await res.json() : { message: await res.text() };
      } catch {
        errorData = {};
      }
      
      const error = createApiError(res.status, errorData);
      logError(error, { path: res.url });
      throw error;
    }
    
    // Handle no content
    if (res.status === 204 || !isJson) {
      return null;
    }
    
    try {
      return await res.json();
    } catch (e) {
      logError(e as Error, { context: 'JSON parse error', url: res.url });
      throw new ApiError(500, 'PARSE_ERROR', 'Failed to parse server response');
    }
  }

  async get(path: string) {
    const res = await this.doFetch(path, { 
      method: 'GET', 
      headers: this.getHeaders() 
    });
    return this.handleResponse(res);
  }

  async post(path: string, body: any) {
    const res = await this.doFetch(path, { 
      method: 'POST', 
      headers: this.getHeaders({ 'Content-Type': 'application/json' }), 
      body: JSON.stringify(body) 
    });
    return this.handleResponse(res);
  }

  async put(path: string, body: any) {
    const res = await this.doFetch(path, { 
      method: 'PUT', 
      headers: this.getHeaders({ 'Content-Type': 'application/json' }), 
      body: JSON.stringify(body) 
    });
    return this.handleResponse(res);
  }
  
  async delete(path: string) {
    const res = await this.doFetch(path, { 
      method: 'DELETE', 
      headers: this.getHeaders() 
    });
    return this.handleResponse(res);
  }
}

export const apiClient = new ApiClient();