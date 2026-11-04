import { useState, useEffect } from 'react';

// Checks system prefers-reduced-motion preference
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return reducedMotion;
}

// Smooth animated counting from current to targetValue (e.g. 0 -> 92)
export function useAnimatedCounter(
  targetValue: number,
  durationMs: number = 850
): number {
  const [current, setCurrent] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCurrent(targetValue);
      return;
    }

    let startTime: number | null = null;
    let frameId: number;
    const startValue = current;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);

      // Ease-out cubic curve: 1 - pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + (targetValue - startValue) * easeProgress);

      setCurrent(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, durationMs, reducedMotion]);

  return current;
}
