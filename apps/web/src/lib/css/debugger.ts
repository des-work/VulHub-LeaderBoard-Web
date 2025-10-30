/**
 * CSS Debugger System
 * Provides comprehensive debugging and error handling for CSS issues
 */

export interface CSSDebugInfo {
  isLoaded: boolean;
  hasTailwind: boolean;
  hasCustomCSS: boolean;
  errors: string[];
  warnings: string[];
  loadedStylesheets: string[];
  missingClasses: string[];
  performance: {
    loadTime: number;
    parseTime: number;
  };
}

export class CSSDebugger {
  private static instance: CSSDebugger;
  private debugInfo: CSSDebugInfo;
  private observers: ((info: CSSDebugInfo) => void)[] = [];

  private constructor() {
    this.debugInfo = {
      isLoaded: false,
      hasTailwind: false,
      hasCustomCSS: false,
      errors: [],
      warnings: [],
      loadedStylesheets: [],
      missingClasses: [],
      performance: {
        loadTime: 0,
        parseTime: 0,
      },
    };
  }

  public static getInstance(): CSSDebugger {
    if (!CSSDebugger.instance) {
      CSSDebugger.instance = new CSSDebugger();
    }
    return CSSDebugger.instance;
  }

  public async diagnose(): Promise<CSSDebugInfo> {
    const startTime = performance.now();
    
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        this.addError('CSS Debugger: Not in browser environment');
        return this.debugInfo;
      }

      // Check for loaded stylesheets
      this.checkStylesheets();
      
      // Check for Tailwind CSS
      this.checkTailwindCSS();
      
      // Check for custom CSS
      this.checkCustomCSS();
      
      // Check for missing classes
      this.checkMissingClasses();
      
      // Check performance
      this.debugInfo.performance.loadTime = performance.now() - startTime;
      this.debugInfo.isLoaded = true;
      
      // Notify observers
      this.notifyObservers();
      
    } catch (error) {
      this.addError(`CSS Debugger Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return this.debugInfo;
  }

  private checkStylesheets(): void {
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    this.debugInfo.loadedStylesheets = stylesheets.map(link => link.getAttribute('href') || '');
    
    if (this.debugInfo.loadedStylesheets.length === 0) {
      this.addError('No stylesheets found');
    }
  }

  private checkTailwindCSS(): void {
    // Check if Tailwind base styles are present
    const testElement = document.createElement('div');
    testElement.className = 'min-h-screen bg-black text-green-400';
    testElement.style.visibility = 'hidden';
    testElement.style.position = 'absolute';
    testElement.style.top = '-9999px';
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const hasMinHeight = computedStyle.minHeight !== '0px';
    const hasBackground = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
    const hasColor = computedStyle.color !== 'rgb(0, 0, 0)';

    document.body.removeChild(testElement);

    this.debugInfo.hasTailwind = hasMinHeight && hasBackground && hasColor;
    
    if (!this.debugInfo.hasTailwind) {
      this.addError('Tailwind CSS not properly loaded or configured');
    }
  }

  private checkCustomCSS(): void {
    // Check for custom CSS variables
    const root = document.documentElement;
    const hasCustomVars = root.style.getPropertyValue('--color-primary-500') !== '';
    this.debugInfo.hasCustomCSS = hasCustomVars;
    
    if (!hasCustomVars) {
      this.addWarning('Custom CSS variables not found');
    }
  }

  private checkMissingClasses(): void {
    // Check for commonly used classes that should be present
    const commonClasses = [
      'min-h-screen', 'bg-black', 'text-green-400', 'font-mono',
      'flex', 'items-center', 'justify-center', 'container',
      'mx-auto', 'px-4', 'py-4', 'rounded-lg', 'border'
    ];

    const missingClasses: string[] = [];
    
    commonClasses.forEach(className => {
      const testElement = document.createElement('div');
      testElement.className = className;
      testElement.style.visibility = 'hidden';
      testElement.style.position = 'absolute';
      testElement.style.top = '-9999px';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const hasStyle = computedStyle.cssText !== '';
      
      document.body.removeChild(testElement);
      
      if (!hasStyle) {
        missingClasses.push(className);
      }
    });

    this.debugInfo.missingClasses = missingClasses;
    
    if (missingClasses.length > 0) {
      this.addWarning(`Missing Tailwind classes: ${missingClasses.join(', ')}`);
    }
  }

  private addError(message: string): void {
    this.debugInfo.errors.push(`[${new Date().toISOString()}] ${message}`);
    console.error(`CSS Debugger: ${message}`);
  }

  private addWarning(message: string): void {
    this.debugInfo.warnings.push(`[${new Date().toISOString()}] ${message}`);
    console.warn(`CSS Debugger: ${message}`);
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer(this.debugInfo));
  }

  public subscribe(observer: (info: CSSDebugInfo) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  public getDebugInfo(): CSSDebugInfo {
    return { ...this.debugInfo };
  }

  public reset(): void {
    this.debugInfo = {
      isLoaded: false,
      hasTailwind: false,
      hasCustomCSS: false,
      errors: [],
      warnings: [],
      loadedStylesheets: [],
      missingClasses: [],
      performance: {
        loadTime: 0,
        parseTime: 0,
      },
    };
  }
}

// Export singleton instance
export const cssDebugger = CSSDebugger.getInstance();
