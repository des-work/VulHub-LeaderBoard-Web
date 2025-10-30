/**
 * CSS Manager System
 * Manages CSS loading, fallbacks, and error handling
 */

import { injectFallbackCSS, removeFallbackCSS } from './fallback';
import { cssDebugger } from './debugger';

export interface CSSManagerConfig {
  enableFallback: boolean;
  enableDebugging: boolean;
  fallbackTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export class CSSManager {
  private static instance: CSSManager;
  private config: CSSManagerConfig;
  private isInitialized: boolean = false;
  private fallbackInjected: boolean = false;
  private retryCount: number = 0;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor(config: Partial<CSSManagerConfig> = {}) {
    this.config = {
      enableFallback: true,
      enableDebugging: true,
      fallbackTimeout: 3000, // 3 seconds
      retryAttempts: 3,
      retryDelay: 1000, // 1 second
      ...config,
    };
  }

  public static getInstance(config?: Partial<CSSManagerConfig>): CSSManager {
    if (!CSSManager.instance) {
      CSSManager.instance = new CSSManager(config);
    }
    return CSSManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Start health monitoring
      this.startHealthMonitoring();

      // Wait for CSS to load
      await this.waitForCSS();

      // Check if CSS is working
      const isHealthy = await this.checkCSSHealth();

      if (!isHealthy && this.config.enableFallback) {
        this.injectFallback();
      }

      this.isInitialized = true;
      console.log('CSS Manager initialized successfully');

    } catch (error) {
      console.error('CSS Manager initialization failed:', error);
      
      if (this.config.enableFallback) {
        this.injectFallback();
      }
    }
  }

  private async waitForCSS(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('CSS loading timeout'));
      }, this.config.fallbackTimeout);

      const checkCSS = () => {
        if (typeof window === 'undefined') {
          clearTimeout(timeout);
          resolve();
          return;
        }

        // Check if stylesheets are loaded
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        if (stylesheets.length > 0) {
          clearTimeout(timeout);
          resolve();
        } else {
          setTimeout(checkCSS, 100);
        }
      };

      checkCSS();
    });
  }

  private async checkCSSHealth(): Promise<boolean> {
    if (typeof window === 'undefined') return true;

    try {
      const debugInfo = await cssDebugger.diagnose();
      return debugInfo.hasTailwind && debugInfo.errors.length === 0;
    } catch (error) {
      console.error('CSS health check failed:', error);
      return false;
    }
  }

  private injectFallback(): void {
    if (this.fallbackInjected) return;

    try {
      injectFallbackCSS();
      this.fallbackInjected = true;
      console.log('Fallback CSS injected due to Tailwind failure');
    } catch (error) {
      console.error('Failed to inject fallback CSS:', error);
    }
  }

  private removeFallback(): void {
    if (!this.fallbackInjected) return;

    try {
      removeFallbackCSS();
      this.fallbackInjected = false;
      console.log('Fallback CSS removed');
    } catch (error) {
      console.error('Failed to remove fallback CSS:', error);
    }
  }

  private startHealthMonitoring(): void {
    if (!this.config.enableDebugging) return;

    this.healthCheckInterval = setInterval(async () => {
      try {
        const isHealthy = await this.checkCSSHealth();
        
        if (isHealthy && this.fallbackInjected) {
          // CSS is now working, remove fallback
          this.removeFallback();
        } else if (!isHealthy && !this.fallbackInjected && this.config.enableFallback) {
          // CSS is not working, inject fallback
          this.injectFallback();
        }
      } catch (error) {
        console.error('Health monitoring error:', error);
      }
    }, 5000); // Check every 5 seconds
  }

  public subscribe(callback: (info: CSSDebugInfo) => void): () => void {
    return cssDebugger.subscribe(callback);
  }

  private stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  public async retryCSS(): Promise<void> {
    if (this.retryCount >= this.config.retryAttempts) {
      console.error('Maximum retry attempts reached');
      return;
    }

    this.retryCount++;
    console.log(`Retrying CSS loading (attempt ${this.retryCount}/${this.config.retryAttempts})`);

    // Remove fallback temporarily
    if (this.fallbackInjected) {
      this.removeFallback();
    }

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));

    // Re-initialize
    await this.initialize();
  }

  public getStatus(): {
    isInitialized: boolean;
    fallbackInjected: boolean;
    retryCount: number;
    config: CSSManagerConfig;
  } {
    return {
      isInitialized: this.isInitialized,
      fallbackInjected: this.fallbackInjected,
      retryCount: this.retryCount,
      config: this.config,
    };
  }

  public updateConfig(newConfig: Partial<CSSManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public destroy(): void {
    this.stopHealthMonitoring();
    this.removeFallback();
    this.isInitialized = false;
    this.fallbackInjected = false;
    this.retryCount = 0;
  }
}

// Export singleton instance
export const cssManager = CSSManager.getInstance();
