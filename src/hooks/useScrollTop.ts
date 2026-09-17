import { useEffect } from 'react';

/** Scrolls window (and main scroll containers) to top on mount. */
export function useScrollTop() {
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  }, []);
}
