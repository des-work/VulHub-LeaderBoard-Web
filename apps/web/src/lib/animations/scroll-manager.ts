/**
 * Sophisticated Scroll Animation Manager
 * Handles staged scrolling animations with professional effects
 */

import { 
  AnimationConfig, 
  ScrollStage, 
  AnimationElement, 
  ScrollAnimationState,
  EasingFunction 
} from './types';

export class ScrollAnimationManager {
  private state: ScrollAnimationState;
  private elements: Map<string, AnimationElement> = new Map();
  private rafId: number | null = null;
  private scrollTimeout: number | null = null;

  constructor() {
    this.state = {
      scrollY: 0,
      scrollPercent: 0,
      currentStage: null,
      elements: [],
      isScrolling: false
    };
  }

  /**
   * Initialize scroll animations
   */
  init(scrollStages: ScrollStage[]) {
    this.setupScrollListener();
    this.setupResizeListener();
    this.updateScrollStages(scrollStages);
    this.startAnimationLoop();
  }

  /**
   * Add element to animation system
   */
  addElement(selector: string, config: AnimationConfig): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    const animationElement: AnimationElement = {
      element,
      config,
      isVisible: false,
      hasAnimated: false
    };

    this.elements.set(selector, animationElement);
    this.state.elements.push(animationElement);
  }

  /**
   * Update scroll stages
   */
  updateScrollStages(stages: ScrollStage[]): void {
    // Sort stages by start position
    stages.sort((a, b) => a.start - b.start);
    
    // Update current stage
    this.updateCurrentStage(stages);
  }

  /**
   * Setup scroll event listener with throttling
   */
  private setupScrollListener(): void {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Setup resize listener
   */
  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      this.updateScrollPosition();
    });
  }

  /**
   * Update scroll position and trigger animations
   */
  private updateScrollPosition(): void {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollY / maxScroll, 1);

    this.state.scrollY = scrollY;
    this.state.scrollPercent = scrollPercent;
    this.state.isScrolling = true;

    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set timeout to mark scrolling as stopped
    this.scrollTimeout = window.setTimeout(() => {
      this.state.isScrolling = false;
    }, 150);

    this.updateCurrentStage();
    this.updateElementVisibility();
  }

  /**
   * Update current scroll stage
   */
  private updateCurrentStage(stages?: ScrollStage[]): void {
    const stagesToCheck = stages || [];
    
    for (const stage of stagesToCheck) {
      if (this.state.scrollPercent >= stage.start && this.state.scrollPercent <= stage.end) {
        this.state.currentStage = stage;
        return;
      }
    }
    
    this.state.currentStage = null;
  }

  /**
   * Update element visibility and trigger animations
   */
  private updateElementVisibility(): void {
    this.elements.forEach((animationElement, selector) => {
      const rect = animationElement.element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible !== animationElement.isVisible) {
        animationElement.isVisible = isVisible;
        
        if (isVisible && !animationElement.hasAnimated) {
          this.triggerElementAnimation(animationElement);
        }
      }
    });
  }

  /**
   * Trigger animation for specific element
   */
  private triggerElementAnimation(animationElement: AnimationElement): void {
    const { element, config } = animationElement;
    
    if (config.entrance.enabled) {
      this.applyEntranceAnimation(element, config.entrance);
    }
    
    if (config.text.enabled) {
      this.applyTextAnimation(element, config.text);
    }
    
    animationElement.hasAnimated = true;
  }

  /**
   * Apply entrance animation
   */
  private applyEntranceAnimation(element: HTMLElement, config: AnimationConfig['entrance']): void {
    const { type, direction, duration, delay, easing } = config;
    
    // Set initial state
    element.style.transition = `all ${duration}ms ${easing}`;
    element.style.transitionDelay = `${delay}ms`;
    
    switch (type) {
      case 'fade':
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.opacity = '1';
        }, delay);
        break;
        
      case 'slide':
        const slideDistance = '50px';
        const slideProps = this.getSlideProperties(direction, slideDistance);
        element.style.transform = slideProps.initial;
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.transform = slideProps.final;
          element.style.opacity = '1';
        }, delay);
        break;
        
      case 'scale':
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
          element.style.opacity = '1';
        }, delay);
        break;
        
      case 'blur':
        element.style.filter = 'blur(10px)';
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.filter = 'blur(0px)';
          element.style.opacity = '1';
        }, delay);
        break;
    }
  }

  /**
   * Apply text animation
   */
  private applyTextAnimation(element: HTMLElement, config: AnimationConfig['text']): void {
    const { type, duration, delay, stagger } = config;
    
    if (type === 'typewriter') {
      this.applyTypewriterEffect(element, duration, delay);
    } else if (type === 'glow') {
      this.applyGlowEffect(element, duration, delay);
    }
  }

  /**
   * Apply typewriter effect
   */
  private applyTypewriterEffect(element: HTMLElement, duration: number, delay: number): void {
    const text = element.textContent || '';
    element.textContent = '';
    element.style.opacity = '1';
    
    const chars = text.split('');
    const charDelay = duration / chars.length;
    
    setTimeout(() => {
      chars.forEach((char, index) => {
        setTimeout(() => {
          element.textContent += char;
        }, index * charDelay);
      });
    }, delay);
  }

  /**
   * Apply glow effect
   */
  private applyGlowEffect(element: HTMLElement, duration: number, delay: number): void {
    element.style.textShadow = '0 0 10px currentColor';
    element.style.transition = `text-shadow ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.textShadow = '0 0 20px currentColor, 0 0 40px currentColor';
    }, delay);
  }

  /**
   * Get slide properties based on direction
   */
  private getSlideProperties(direction: string, distance: string) {
    switch (direction) {
      case 'up':
        return { initial: `translateY(${distance})`, final: 'translateY(0)' };
      case 'down':
        return { initial: `translateY(-${distance})`, final: 'translateY(0)' };
      case 'left':
        return { initial: `translateX(${distance})`, final: 'translateX(0)' };
      case 'right':
        return { initial: `translateX(-${distance})`, final: 'translateX(0)' };
      default:
        return { initial: 'translateY(0)', final: 'translateY(0)' };
    }
  }

  /**
   * Start animation loop
   */
  private startAnimationLoop(): void {
    const animate = () => {
      this.updateScrollPosition();
      this.rafId = requestAnimationFrame(animate);
    };
    
    this.rafId = requestAnimationFrame(animate);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    window.removeEventListener('scroll', this.updateScrollPosition);
    window.removeEventListener('resize', this.updateScrollPosition);
  }

  /**
   * Get current state
   */
  getState(): ScrollAnimationState {
    return { ...this.state };
  }
}

// Singleton instance
export const scrollAnimationManager = new ScrollAnimationManager();
