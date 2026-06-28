'use client';

import { useEffect, useRef } from 'react';
// NOTE: Lenis is dynamically imported inside useEffect to prevent SSR crash.
// Do NOT add a top-level `import Lenis from 'lenis'` here.

export function useLenisScroll(onScroll?: (scroll: number) => void) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const LenisClass = require('lenis').default;
    const lenis = new LenisClass({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    lenisRef.current = lenis;

    const scrollHandler = (e: any) => {
      if (onScroll) {
        onScroll(e.scroll);
      }
    };

    lenis.on('scroll', scrollHandler);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.off('scroll', scrollHandler);
      lenis.destroy();
    };
  }, [onScroll]);

  return lenisRef;
}
