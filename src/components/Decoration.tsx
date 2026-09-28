import type { Decor, NodeSpec } from '../data/layoutTypes';
import { circleAnchor, polylinePath, pt, type Point } from '../lib/geometry';

/** Level-4 construction geometry: faint rings, traces, dots, crosses and guides. */
export function Decoration({ decor, detail }: { decor: Decor; detail: number }) {
  const cross = 4 * detail;
  return (
    <g className="l4" aria-hidden="true">
      {decor.rings.map((ring, i) => (
        <circle
          key={`r${i}`}
          className={ring.dashed ? 'l4-ring l4-ring--dashed' : 'l4-ring'}
          cx={ring.at.x}
          cy={ring.at.y}
          r={ring.r}
        />
      ))}
      {decor.guides.map(([a, b], i) => (
        <line key={`g${i}`} className="l4-guide" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
      ))}
      {decor.traces.map((points, i) => (
        <g key={`t${i}`}>
          <path className="l4-trace" d={polylinePath(points)} />
          <circle className="l4-dot" cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={1.8 * detail} />
        </g>
      ))}
      {decor.crosses.map((c, i) => (
        <path
          key={`c${i}`}
          className="l4-cross"
          d={`M${c.x - cross} ${c.y}H${c.x + cross}M${c.x} ${c.y - cross}V${c.y + cross}`}
        />
      ))}
      {decor.dots.map((d, i) => (
        <circle key={`d${i}`} className="l4-dot" cx={d.x} cy={d.y} r={1.5 * detail} />
      ))}
    </g>
  );
}

/** Outer ring, faint secondary ring and small markers drawn around a node. */
export function NodeRing({
  node,
  anchor,
  detail,
  active,
}: {
  node: NodeSpec;
  anchor?: Point;
  detail: number;
  active: boolean;
}) {
  const { at, ring } = node;
  const outer = ring + 9 * detail;
  const markers = [200, 335].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return circleAnchor(at, ring, pt(at.x + Math.cos(rad), at.y + Math.sin(rad)));
  });
  return (
    <g className={active ? 'node-ring is-active' : 'node-ring'} aria-hidden="true">
      <circle className="node-ring__outer" cx={at.x} cy={at.y} r={outer} />
      <circle className="node-ring__main" cx={at.x} cy={at.y} r={ring} />
      {markers.map((m, i) => (
        <circle key={i} className="node-ring__marker" cx={m.x} cy={m.y} r={1.9 * detail} />
      ))}
      {anchor && <circle className="node-ring__anchor" cx={anchor.x} cy={anchor.y} r={2.4 * detail} />}
    </g>
  );
}
