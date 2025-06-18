'use client';

import { useEffect } from 'react';

export function ThemeTransition() {
  useEffect(() => {
    // Remove no-transition class after initial load to enable smooth transitions
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
