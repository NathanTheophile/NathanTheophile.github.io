import { useEffect, useState } from 'react';

/** Becomes true the first time `active` is true (one frame later, so CSS transitions run). */
export function useReveal(active: boolean) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!active || revealed) return;
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, [active, revealed]);
  return revealed;
}
