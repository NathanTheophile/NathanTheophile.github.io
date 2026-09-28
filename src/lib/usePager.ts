import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from './useLayoutMode';

/** Minimum pause in wheel input before another page turn is accepted (trackpad inertia). */
const WHEEL_QUIET_MS = 180;
/** Upper bound for a smooth page transition, in case `scrollend` never fires. */
const TRANSITION_MS = 900;
const WHEEL_THRESHOLD = 6;
const SWIPE_THRESHOLD = 40;

/**
 * Full-screen paging on top of a CSS scroll-snap container.
 * Wheel and keyboard input move exactly one screen per gesture; touch keeps the
 * native snap behaviour (mandatory + snap-stop). The container always settles on a screen.
 */
export function usePager(scrollerRef: RefObject<HTMLElement | null>, count: number) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const busy = useRef(false);
  const lastWheel = useRef(0);

  const goTo = useCallback(
    (target: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const next = Math.max(0, Math.min(count - 1, target));
      indexRef.current = next;
      setIndex(next);
      el.scrollTo({ top: next * el.clientHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    [scrollerRef, count],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let releaseTimer = 0;
    let settled = false;

    // Unlock once the transition has settled AND wheel input has gone quiet,
    // so trailing trackpad inertia cannot trigger a second page turn.
    const tryRelease = () => {
      window.clearTimeout(releaseTimer);
      if (!busy.current) return;
      if (settled && Date.now() - lastWheel.current >= WHEEL_QUIET_MS) busy.current = false;
      else releaseTimer = window.setTimeout(tryRelease, 60);
    };

    const turn = (direction: number) => {
      const next = indexRef.current + direction;
      if (next < 0 || next >= count) return;
      busy.current = true;
      settled = false;
      goTo(next);
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        settled = true;
        tryRelease();
      }, TRANSITION_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch / browser zoom
      e.preventDefault();
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : 0;
      lastWheel.current = Date.now();
      if (busy.current || Math.abs(delta) < WHEEL_THRESHOLD) return;
      turn(Math.sign(delta));
    };

    const onScrollEnd = () => {
      if (!busy.current) return;
      settled = true;
      tryRelease();
    };

    const onScroll = () => {
      const current = Math.round(el.scrollTop / el.clientHeight);
      if (!busy.current && current !== indexRef.current) {
        indexRef.current = current;
        setIndex(current);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      let direction = 0;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') direction = 1;
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') direction = -1;
      else if (e.key === ' ' && !target?.closest('button')) direction = e.shiftKey ? -1 : 1;
      else if (e.key === 'Home') direction = -indexRef.current;
      else if (e.key === 'End') direction = count - 1 - indexRef.current;
      if (!direction) return;
      e.preventDefault();
      if (!busy.current) turn(direction);
    };

    // Touch: native panning is disabled in CSS (touch-action: pinch-zoom), so one swipe = one page.
    let touchStart: { x: number; y: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchStart = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart || busy.current) return;
      const t = e.changedTouches[0];
      const dy = touchStart.y - t.clientY;
      const dx = touchStart.x - t.clientX;
      touchStart = null;
      if (Math.abs(dy) >= SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) turn(Math.sign(dy));
    };

    // Keep the active screen aligned when the viewport is resized.
    const onResize = () => {
      el.scrollTo({ top: indexRef.current * el.clientHeight, behavior: 'auto' });
    };

    // On window so the fixed header (outside the scroller) also turns pages.
    window.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.clearTimeout(releaseTimer);
      window.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [scrollerRef, count, goTo]);

  return { index, goTo };
}
