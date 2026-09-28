// Shared 2D geometry for the tree / roots artwork.
// Every screen uses one normalized coordinate space (the "stage"): x in [0, 1000],
// y in [0, stage height]. SVG paths and DOM nodes are both placed from these values.

export type Point = { x: number; y: number };

export type Cubic = {
  from: Point;
  c1: Point;
  c2: Point;
  to: Point;
};

export const pt = (x: number, y: number): Point => ({ x, y });

const fmt = (n: number) => Math.round(n * 100) / 100;

export function cubicAt(b: Cubic, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const c = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return {
    x: a * b.from.x + c * b.c1.x + d * b.c2.x + e * b.to.x,
    y: a * b.from.y + c * b.c1.y + d * b.c2.y + e * b.to.y,
  };
}

function cubicTangent(b: Cubic, t: number): Point {
  const u = 1 - t;
  const x =
    3 * u * u * (b.c1.x - b.from.x) + 6 * u * t * (b.c2.x - b.c1.x) + 3 * t * t * (b.to.x - b.c2.x);
  const y =
    3 * u * u * (b.c1.y - b.from.y) + 6 * u * t * (b.c2.y - b.c1.y) + 3 * t * t * (b.to.y - b.c2.y);
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

export function cubicPath(b: Cubic): string {
  return `M${fmt(b.from.x)} ${fmt(b.from.y)}C${fmt(b.c1.x)} ${fmt(b.c1.y)} ${fmt(b.c2.x)} ${fmt(b.c2.y)} ${fmt(b.to.x)} ${fmt(b.to.y)}`;
}

export function polylinePath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${fmt(p.x)} ${fmt(p.y)}`).join('');
}

/**
 * Closed, filled outline following a cubic curve whose width eases from `w0` to `w1`.
 * Used for the trunk and the major branches / roots so they taper toward their node.
 */
export function taperedPath(b: Cubic, w0: number, w1: number, samples = 28): string {
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = cubicAt(b, t);
    const tan = cubicTangent(b, t);
    const eased = t * t * (3 - 2 * t);
    const half = (w0 + (w1 - w0) * eased) / 2;
    left.push({ x: p.x - tan.y * half, y: p.y + tan.x * half });
    right.push({ x: p.x + tan.y * half, y: p.y - tan.x * half });
  }
  return `${polylinePath([...left, ...right.reverse()])}Z`;
}

/** Point on a circle of radius `r` around `center`, facing `toward`. */
export function circleAnchor(center: Point, r: number, toward: Point): Point {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: center.x + (dx / len) * r, y: center.y + (dy / len) * r };
}

/** Percent position of a stage point, for absolutely positioned DOM elements. */
export function stagePosition(p: Point, width: number, height: number) {
  return { left: `${(p.x / width) * 100}%`, top: `${(p.y / height) * 100}%` };
}
