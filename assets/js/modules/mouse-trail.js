const trailLifetime = 520;
const trailMaxWidth = 5;
const trailMinWidth = 0.3;

export function createMouseTrail({ trailCanvas, pageContainer, prefersReducedMotion }) {
  const trailContext = trailCanvas?.getContext('2d');
  let trailAnimationFrame = null;
  let trailPoints = [];

  const resize = () => {
    if (!trailCanvas || !trailContext) return;

    const dpr = window.devicePixelRatio || 1;
    trailCanvas.width = window.innerWidth * dpr;
    trailCanvas.height = window.innerHeight * dpr;
    trailCanvas.style.width = `${window.innerWidth}px`;
    trailCanvas.style.height = `${window.innerHeight}px`;
    trailContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const clearCanvas = () => {
    if (!trailCanvas || !trailContext) return;
    trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  };

  const animateTrail = () => {
    if (!trailCanvas || !trailContext) return;

    clearCanvas();

    const now = performance.now();
    trailPoints = trailPoints.filter((point) => now - point.timestamp <= trailLifetime);

    if (trailPoints.length < 2) {
      if (trailPoints.length === 0 && trailAnimationFrame) {
        cancelAnimationFrame(trailAnimationFrame);
        trailAnimationFrame = null;
      }
      return;
    }

    for (let index = 1; index < trailPoints.length; index += 1) {
      const previous = trailPoints[index - 1];
      const current = trailPoints[index];
      const age = now - current.timestamp;
      const lifeProgress = Math.min(age / trailLifetime, 1);
      const width = Math.max(trailMinWidth, trailMaxWidth * (1 - lifeProgress));
      const alpha = 0.65 * (1 - lifeProgress);

      trailContext.strokeStyle = `rgba(168, 157, 138, ${alpha.toFixed(3)})`;
      trailContext.lineWidth = width;
      trailContext.lineCap = 'round';
      trailContext.lineJoin = 'round';
      trailContext.beginPath();
      trailContext.moveTo(previous.x, previous.y);
      trailContext.lineTo(current.x, current.y);
      trailContext.stroke();
    }

    trailAnimationFrame = requestAnimationFrame(animateTrail);
  };

  const addTrailPoint = (event) => {
    if (!trailCanvas || !trailContext || prefersReducedMotion.matches) return;
    const timestamp = performance.now();
    const lastPoint = trailPoints[trailPoints.length - 1];
    const nextPoint = {
      x: event.clientX,
      y: event.clientY,
      timestamp,
    };

    if (!lastPoint) {
      trailPoints.push(nextPoint);
    } else {
      const dx = nextPoint.x - lastPoint.x;
      const dy = nextPoint.y - lastPoint.y;
      const distance = Math.hypot(dx, dy);
      const maxStep = 6;

      if (distance >= maxStep) {
        const steps = Math.floor(distance / maxStep);
        for (let step = 1; step <= steps; step += 1) {
          const progress = step / (steps + 1);
          trailPoints.push({
            x: lastPoint.x + dx * progress,
            y: lastPoint.y + dy * progress,
            timestamp,
          });
        }
      }

      trailPoints.push(nextPoint);
    }

    if (!trailAnimationFrame) {
      trailAnimationFrame = requestAnimationFrame(animateTrail);
    }
  };

  const trailTargets = [window, pageContainer].filter(Boolean);
  trailTargets.forEach((target) => {
    target.addEventListener('pointermove', addTrailPoint, { passive: true });
    target.addEventListener('pointerdown', addTrailPoint, { passive: true });
  });

  resize();

  return {
    resize,
    handleReducedMotionChange: () => {
      trailPoints = [];
      clearCanvas();
      if (trailAnimationFrame) {
        cancelAnimationFrame(trailAnimationFrame);
        trailAnimationFrame = null;
      }
    },
  };
}