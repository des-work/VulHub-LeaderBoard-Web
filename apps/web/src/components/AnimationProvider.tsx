'use client';

import React, { useEffect } from 'react';
import { customizationManager } from '../lib/animations/customization-manager';

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize the customization system
    customizationManager.init();
    
    // Add scroll animations to common elements
    const addScrollAnimations = () => {
      // Add animations to headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        heading.classList.add('scroll-animate');
        heading.setAttribute('data-delay', (index * 100).toString());
      });
      
      // Add animations to cards
      const cards = document.querySelectorAll('.card, .card-professional');
      cards.forEach((card, index) => {
        card.classList.add('scroll-animate');
        card.setAttribute('data-delay', (index * 150).toString());
      });
      
      // Add animations to buttons
      const buttons = document.querySelectorAll('.btn-professional, button');
      buttons.forEach((button, index) => {
        button.classList.add('scroll-animate');
        button.setAttribute('data-delay', (index * 50).toString());
      });
    };
    
    // Add animations after a short delay to ensure DOM is ready
    setTimeout(addScrollAnimations, 100);
    
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all scroll animate elements
    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach((element) => observer.observe(element));
    
    // Cleanup
    return () => {
      observer.disconnect();
      customizationManager.destroy();
    };
  }, []);
  
  return <>{children}</>;
};
