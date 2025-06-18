'use client';

import { useEffect } from 'react';

/**
 * Module Theme Optimizer - Simplified approach
 * Focus on reducing the number of transitioning elements
 */
export function ModuleThemeOptimizer() {
  useEffect(() => {
    const handleThemeChange = () => {
      // Temporarily pause heavy animations
      const animations = document.querySelectorAll('.animate-pulse, .animate-spin');
      animations.forEach(el => {
        (el as HTMLElement).style.animationPlayState = 'paused';
      });
      
      // Resume animations after transition
      setTimeout(() => {
        animations.forEach(el => {
          (el as HTMLElement).style.animationPlayState = 'running';
        });
      }, 400);
    };

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
