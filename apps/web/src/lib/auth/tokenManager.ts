/**
 * Token Management System
 * 
 * Handles JWT token lifecycle including expiration detection and automatic refresh
 */

import { AuthApi } from '../api/endpoints';
import { apiClient } from '../api/client';

interface TokenPayload {
  exp: number;  // Expiration timestamp
  iat: number;  // Issued at timestamp
  sub: string;  // Subject (user ID)
  [key: string]: any;
}

/**
 * Decode JWT token (without verification)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    // Silent fail - token decode errors should not expose details to console
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  // Token is expired if expiration time is in the past
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Check if token is expiring soon (within 5 minutes)
 */
export function isTokenExpiringSoon(token: string, bufferSeconds = 300): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now < bufferSeconds;
}

/**
 * Get time until token expires (in seconds)
 */
export function getTimeUntilExpiry(token: string): number {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

/**
 * Token Refresh Manager
 * Automatically refreshes tokens before they expire
 */
export class TokenRefreshManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshToken: string | null = null;
  private onTokenRefreshed?: (accessToken: string) => void;
  private onRefreshFailed?: () => void;

  constructor(
    refreshToken: string | null,
    onTokenRefreshed?: (accessToken: string) => void,
    onRefreshFailed?: () => void
  ) {
    this.refreshToken = refreshToken;
    this.onTokenRefreshed = onTokenRefreshed;
    this.onRefreshFailed = onRefreshFailed;
  }

  /**
   * Start automatic token refresh
   */
  start(): void {
    const accessToken = apiClient.getAuthToken();
    if (!accessToken) {
      // No access token - cannot start refresh manager
      return;
    }

    // Schedule refresh
    this.scheduleRefresh(accessToken);
  }

  /**
   * Stop automatic token refresh
   */
  stop(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Schedule token refresh before expiration
   */
  private scheduleRefresh(accessToken: string): void {
    this.stop(); // Clear any existing timer

    const timeUntilExpiry = getTimeUntilExpiry(accessToken);
    
    if (timeUntilExpiry <= 0) {
      // Token already expired, refresh immediately
      this.refreshNow();
      return;
    }

    // Refresh 5 minutes before expiry, or halfway through if token expires in less than 10 minutes
    const refreshInSeconds = Math.max(
      30, // Minimum 30 seconds
      Math.min(
        timeUntilExpiry - 300, // 5 minutes before expiry
        timeUntilExpiry / 2   // Or halfway through token lifespan
      )
    );

    this.refreshTimer = setTimeout(() => this.refreshNow(), refreshInSeconds * 1000);
  }

  /**
   * Refresh token immediately
   */
  private async refreshNow(): Promise<void> {
    const refreshToken = this.refreshToken;

    if (!refreshToken) {
      // Refresh token not available - silently fail
      return;
    }

    try {
      const response = await AuthApi.refreshToken(this.refreshToken);
      this.onTokenRefreshed?.(response.accessToken);
      this.scheduleRefresh(response.accessToken);
    } catch (error) {
      // Token refresh failed - silently fail, will require re-login
      this.onRefreshFailed?.();
    }
  }

  /**
   * Manually trigger token refresh (called by auth context on demand)
   */
  async manualRefresh(): Promise<boolean> {
    const refreshToken = this.refreshToken;

    if (!refreshToken) {
      // Cannot refresh without token
      return false;
    }

    try {
      const response = await AuthApi.refreshToken(refreshToken);
      this.onTokenRefreshed?.(response.accessToken);
      this.scheduleRefresh(response.accessToken);
      return true;
    } catch (error) {
      // Manual refresh failed
      return false;
    }
  }
}

/**
 * Store tokens in localStorage
 */
export function storeTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem('auth_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
}

/**
 * Get tokens from localStorage
 */
export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  return {
    accessToken: localStorage.getItem('auth_token'),
    refreshToken: localStorage.getItem('refresh_token')
  };
}

/**
 * Clear tokens from localStorage
 */
export function clearTokens(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Check if stored access token is valid
 */
export function hasValidToken(): boolean {
  const { accessToken } = getStoredTokens();
  if (!accessToken) return false;
  
  return !isTokenExpired(accessToken);
}

