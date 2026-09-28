import { useSyncExternalStore } from 'react';

// Keep in sync with the matching @media block in src/styles/global.css.
export const MOBILE_QUERY = '(max-width: 720px), (max-aspect-ratio: 3/4)';

export type LayoutMode = 'desktop' | 'mobile';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function useLayoutMode(): LayoutMode {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop'),
    () => 'desktop',
  );
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
