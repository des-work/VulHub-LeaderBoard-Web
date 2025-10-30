/**
 * Spectacular Leaderboard Animation System
 * Eye-catching, flexible, and stable animations for the live leaderboard
 */

export interface LeaderboardAnimationConfig {
  // Entry animations
  entry: {
    enabled: boolean;
    type: 'slide' | 'fade' | 'scale' | 'bounce' | 'flip' | 'glow' | 'custom';
    direction: 'up' | 'down' | 'left' | 'right' | 'center';
    duration: number;
    delay: number;
    stagger: number;
    easing: string;
  };
  
  // Hover animations
  hover: {
    enabled: boolean;
    scale: number;
    glow: boolean;
    glowIntensity: number;
    duration: number;
    easing: string;
  };
  
  // Progress bar animations
  progress: {
    enabled: boolean;
    type: 'fill' | 'pulse' | 'wave' | 'glow' | 'custom';
    duration: number;
    delay: number;
    easing: string;
  };
  
  // Ranking animations
  ranking: {
    enabled: boolean;
    type: 'pulse' | 'glow' | 'bounce' | 'rotate' | 'custom';
    duration: number;
    delay: number;
    easing: string;
  };
  
  // Live updates
  liveUpdate: {
    enabled: boolean;
    type: 'flash' | 'glow' | 'pulse' | 'shake' | 'custom';
    duration: number;
    easing: string;
  };
  
  // Continuous animations
  continuous: {
    enabled: boolean;
    type: 'float' | 'pulse' | 'glow' | 'wave' | 'custom';
    duration: number;
    easing: string;
  };
}

export class LeaderboardAnimationManager {
  private config: LeaderboardAnimationConfig;
  private elements: Map<string, HTMLElement> = new Map();
  private animationIds: Map<string, number> = new Map();
  private isAnimating = false;

  constructor(config: LeaderboardAnimationConfig) {
    this.config = config;
    this.initializeStyles();
  }

  /**
   * Initialize CSS animations and styles
   */
  private initializeStyles(): void {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.id = 'leaderboard-animations';
    style.textContent = `
      /* Leaderboard Animation Keyframes */
      @keyframes leaderboard-slide-up {
        from { 
          opacity: 0; 
          transform: translateY(50px) scale(0.9);
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1);
        }
      }

      @keyframes leaderboard-slide-down {
        from { 
          opacity: 0; 
          transform: translateY(-50px) scale(0.9);
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1);
        }
      }

      @keyframes leaderboard-bounce {
        0%, 20%, 50%, 80%, 100% { 
          transform: translateY(0) scale(1);
        }
        40% { 
          transform: translateY(-20px) scale(1.05);
        }
        60% { 
          transform: translateY(-10px) scale(1.02);
        }
      }

      @keyframes leaderboard-flip {
        from { 
          opacity: 0; 
          transform: rotateY(90deg) scale(0.8);
        }
        to { 
          opacity: 1; 
          transform: rotateY(0deg) scale(1);
        }
      }

      @keyframes leaderboard-glow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
        }
        50% { 
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4);
        }
      }

      @keyframes leaderboard-pulse {
        0%, 100% { 
          transform: scale(1);
          opacity: 1;
        }
        50% { 
          transform: scale(1.05);
          opacity: 0.9;
        }
      }

      @keyframes leaderboard-float {
        0%, 100% { 
          transform: translateY(0px);
        }
        50% { 
          transform: translateY(-5px);
        }
      }

      @keyframes leaderboard-wave {
        0%, 100% { 
          transform: translateX(0px);
        }
        25% { 
          transform: translateX(5px);
        }
        75% { 
          transform: translateX(-5px);
        }
      }

      @keyframes leaderboard-progress-fill {
        from { 
          width: 0%;
        }
        to { 
          width: var(--progress-width);
        }
      }

      @keyframes leaderboard-progress-pulse {
        0%, 100% { 
          box-shadow: 0 0 10px currentColor;
        }
        50% { 
          box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
        }
      }

      @keyframes leaderboard-progress-wave {
        0% { 
          background-position: 0% 50%;
        }
        50% { 
          background-position: 100% 50%;
        }
        100% { 
          background-position: 0% 50%;
        }
      }

      @keyframes leaderboard-ranking-pulse {
        0%, 100% { 
          transform: scale(1);
          filter: brightness(1);
        }
        50% { 
          transform: scale(1.1);
          filter: brightness(1.2);
        }
      }

      @keyframes leaderboard-ranking-glow {
        0%, 100% { 
          text-shadow: 0 0 10px currentColor;
        }
        50% { 
          text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
        }
      }

      @keyframes leaderboard-live-flash {
        0%, 100% { 
          background-color: transparent;
        }
        50% { 
          background-color: rgba(34, 197, 94, 0.2);
        }
      }

      @keyframes leaderboard-live-glow {
        0%, 100% { 
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
        }
        50% { 
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
        }
      }

      @keyframes leaderboard-shake {
        0%, 100% { 
          transform: translateX(0);
        }
        25% { 
          transform: translateX(-5px);
        }
        75% { 
          transform: translateX(5px);
        }
      }

      /* Leaderboard Animation Classes */
      .leaderboard-entry {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .leaderboard-entry:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      }

      .leaderboard-progress {
        position: relative;
        overflow: hidden;
      }

      .leaderboard-progress::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 255, 255, 0.2), 
          transparent
        );
        transform: translateX(-100%);
        animation: leaderboard-progress-wave 2s infinite;
      }

      .leaderboard-ranking {
        transition: all 0.3s ease;
      }

      .leaderboard-ranking:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
      }

      .leaderboard-live {
        animation: leaderboard-live-glow 2s infinite;
      }

      .leaderboard-avatar {
        transition: all 0.3s ease;
      }

      .leaderboard-avatar:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 0 20px currentColor;
      }

      .leaderboard-score {
        transition: all 0.3s ease;
      }

      .leaderboard-score:hover {
        transform: scale(1.05);
        text-shadow: 0 0 10px currentColor;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Add element to animation system
   */
  addElement(id: string, element: HTMLElement): void {
    this.elements.set(id, element);
    element.classList.add('leaderboard-entry');
  }

  /**
   * Animate element entry
   */
  animateEntry(id: string, delay: number = 0): void {
    const element = this.elements.get(id);
    if (!element || !this.config.entry.enabled) return;

    const { type, direction, duration, easing } = this.config.entry;
    
    setTimeout(() => {
      element.style.animation = `${this.getEntryAnimationName(type, direction)} ${duration}ms ${easing}`;
      
      // Add continuous animation if enabled
      if (this.config.continuous.enabled) {
        this.addContinuousAnimation(id);
      }
    }, delay);
  }

  /**
   * Animate progress bar
   */
  animateProgress(id: string, progress: number, delay: number = 0): void {
    const element = this.elements.get(id);
    if (!element || !this.config.progress.enabled) return;

    const progressBar = element.querySelector('.progress-bar') as HTMLElement;
    if (!progressBar) return;

    const { type, duration, easing } = this.config.progress;
    
    setTimeout(() => {
      progressBar.style.setProperty('--progress-width', `${progress}%`);
      progressBar.style.animation = `${this.getProgressAnimationName(type)} ${duration}ms ${easing}`;
    }, delay);
  }

  /**
   * Animate ranking change
   */
  animateRankingChange(id: string, newRank: number): void {
    const element = this.elements.get(id);
    if (!element || !this.config.ranking.enabled) return;

    const rankingElement = element.querySelector('.ranking') as HTMLElement;
    if (!rankingElement) return;

    const { type, duration, easing } = this.config.ranking;
    
    rankingElement.style.animation = `${this.getRankingAnimationName(type)} ${duration}ms ${easing}`;
  }

  /**
   * Animate live update
   */
  animateLiveUpdate(id: string): void {
    const element = this.elements.get(id);
    if (!element || !this.config.liveUpdate.enabled) return;

    const { type, duration, easing } = this.config.liveUpdate;
    
    element.style.animation = `${this.getLiveUpdateAnimationName(type)} ${duration}ms ${easing}`;
  }

  /**
   * Add continuous animation
   */
  private addContinuousAnimation(id: string): void {
    const element = this.elements.get(id);
    if (!element) return;

    const { type, duration, easing } = this.config.continuous;
    
    const animationId = setInterval(() => {
      element.style.animation = `${this.getContinuousAnimationName(type)} ${duration}ms ${easing}`;
    }, duration + 1000);

    this.animationIds.set(id, animationId);
  }

  /**
   * Get animation name for entry
   */
  private getEntryAnimationName(type: string, direction: string): string {
    switch (type) {
      case 'slide':
        return direction === 'up' ? 'leaderboard-slide-up' : 'leaderboard-slide-down';
      case 'bounce':
        return 'leaderboard-bounce';
      case 'flip':
        return 'leaderboard-flip';
      case 'glow':
        return 'leaderboard-glow';
      case 'pulse':
        return 'leaderboard-pulse';
      default:
        return 'leaderboard-slide-up';
    }
  }

  /**
   * Get animation name for progress
   */
  private getProgressAnimationName(type: string): string {
    switch (type) {
      case 'fill':
        return 'leaderboard-progress-fill';
      case 'pulse':
        return 'leaderboard-progress-pulse';
      case 'wave':
        return 'leaderboard-progress-wave';
      case 'glow':
        return 'leaderboard-progress-pulse';
      default:
        return 'leaderboard-progress-fill';
    }
  }

  /**
   * Get animation name for ranking
   */
  private getRankingAnimationName(type: string): string {
    switch (type) {
      case 'pulse':
        return 'leaderboard-ranking-pulse';
      case 'glow':
        return 'leaderboard-ranking-glow';
      case 'bounce':
        return 'leaderboard-bounce';
      case 'rotate':
        return 'leaderboard-flip';
      default:
        return 'leaderboard-ranking-pulse';
    }
  }

  /**
   * Get animation name for live update
   */
  private getLiveUpdateAnimationName(type: string): string {
    switch (type) {
      case 'flash':
        return 'leaderboard-live-flash';
      case 'glow':
        return 'leaderboard-live-glow';
      case 'pulse':
        return 'leaderboard-pulse';
      case 'shake':
        return 'leaderboard-shake';
      default:
        return 'leaderboard-live-flash';
    }
  }

  /**
   * Get animation name for continuous
   */
  private getContinuousAnimationName(type: string): string {
    switch (type) {
      case 'float':
        return 'leaderboard-float';
      case 'pulse':
        return 'leaderboard-pulse';
      case 'glow':
        return 'leaderboard-glow';
      case 'wave':
        return 'leaderboard-wave';
      default:
        return 'leaderboard-float';
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LeaderboardAnimationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Start animation sequence
   */
  startAnimationSequence(elements: string[]): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    elements.forEach((id, index) => {
      const delay = index * this.config.entry.stagger;
      this.animateEntry(id, delay);
    });

    setTimeout(() => {
      this.isAnimating = false;
    }, elements.length * this.config.entry.stagger + this.config.entry.duration);
  }

  /**
   * Cleanup animations
   */
  cleanup(): void {
    this.animationIds.forEach((id) => clearInterval(id));
    this.animationIds.clear();
    this.elements.clear();
  }
}

// Default configuration for spectacular leaderboard
export const defaultLeaderboardAnimationConfig: LeaderboardAnimationConfig = {
  entry: {
    enabled: true,
    type: 'slide',
    direction: 'up',
    duration: 800,
    delay: 0,
    stagger: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  hover: {
    enabled: true,
    scale: 1.05,
    glow: true,
    glowIntensity: 0.6,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  progress: {
    enabled: true,
    type: 'fill',
    duration: 1200,
    delay: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  ranking: {
    enabled: true,
    type: 'pulse',
    duration: 600,
    delay: 0,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  liveUpdate: {
    enabled: true,
    type: 'glow',
    duration: 1000,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  continuous: {
    enabled: true,
    type: 'float',
    duration: 3000,
    easing: 'ease-in-out'
  }
};

// Singleton instance
export const leaderboardAnimationManager = new LeaderboardAnimationManager(defaultLeaderboardAnimationConfig);
