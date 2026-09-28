import type { RootsLayout } from '../data/layoutTypes';
import { taperedPath } from '../lib/geometry';
import type { RootGeometry } from '../lib/graph';
import { Decoration, NodeRing } from './Decoration';

type Props = {
  layout: RootsLayout;
  geometry: RootGeometry;
  activeId: string | null;
};

export function RootsGraphic({ layout, geometry, activeId }: Props) {
  const { frame } = layout;
  const { detail } = frame;
  const fade = layout.bundleFade;
  // Mask regions cover the overshooting strands above / below the stage.
  const maskBox = { x: -200, y: -2000, width: frame.width + 400, height: frame.height + 4000 };
  const incoming = new Map(geometry.roots.filter((r) => r.node).map((r) => [r.node, r.curve.to]));
  const secondary = geometry.roots.filter((r) => r.level === 3);
  const major = geometry.roots.filter((r) => r.level === 2);

  return (
    <svg
      className="art art--roots"
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      overflow="visible"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Secondary roots and decoration fade out at the stage edges instead of stopping abruptly. */}
        <linearGradient id="roots-fade-x" gradientUnits="userSpaceOnUse" x1={-12} y1={0} x2={frame.width + 12} y2={0}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.08" stopColor="#fff" />
          <stop offset="0.92" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="roots-edge" maskUnits="userSpaceOnUse" {...maskBox}>
          <rect {...maskBox} fill="url(#roots-fade-x)" />
        </mask>
        {fade && (
          <>
            <linearGradient id="bundle-fade-y" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={fade[3]}>
              <stop offset={fade[0] / fade[3]} stopColor="#fff" />
              <stop offset={fade[1] / fade[3]} stopColor="#fff" stopOpacity="0" />
              <stop offset={fade[2] / fade[3]} stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id="bundle-fade" maskUnits="userSpaceOnUse" {...maskBox}>
              <rect {...maskBox} fill="url(#bundle-fade-y)" />
            </mask>
          </>
        )}
      </defs>

      <g mask="url(#roots-edge)">
        <Decoration decor={layout.decor} detail={detail} />
      </g>

      {/* Level 1 — vertical bundle entering from the trunk above */}
      <g className="bundle" mask={fade ? 'url(#bundle-fade)' : undefined}>
        {geometry.strands.map((s, i) => (
          <line key={i} x1={s.from.x} y1={s.from.y} x2={s.to.x} y2={s.to.y} />
        ))}
      </g>

      {/* Level 3 — secondary roots */}
      <g className="l3" mask="url(#roots-edge)">
        {secondary.map((r) => (
          <g key={r.id}>
            <path className="root" d={taperedPath(r.curve, r.w0 * detail, r.w1 * detail)} />
            {r.dot && <circle className="l3-dot" cx={r.curve.to.x} cy={r.curve.to.y} r={2 * detail} />}
          </g>
        ))}
      </g>

      {/* Level 2 — major roots leading to skills */}
      <g className="l2">
        {major.map((r) => (
          <path
            key={r.id}
            className={r.node === activeId ? 'root is-active' : 'root'}
            d={taperedPath(r.curve, r.w0 * detail, r.w1 * detail)}
          />
        ))}
      </g>

      <g className="sparks">
        {geometry.sparks.map((s, i) => (
          <g key={i}>
            <circle className="spark__halo" cx={s.x} cy={s.y} r={6 * detail} />
            <circle className="spark__core" cx={s.x} cy={s.y} r={1.8 * detail} />
          </g>
        ))}
      </g>

      {layout.nodes.map((node) => (
        <NodeRing key={node.id} node={node} anchor={incoming.get(node.id)} detail={detail} active={node.id === activeId} />
      ))}
    </svg>
  );
}
