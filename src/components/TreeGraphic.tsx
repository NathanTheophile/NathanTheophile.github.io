import type { TreeLayout } from '../data/layoutTypes';
import { cubicPath, taperedPath } from '../lib/geometry';
import type { TreeGeometry } from '../lib/graph';
import { Decoration, NodeRing } from './Decoration';

type Props = {
  layout: TreeLayout;
  geometry: TreeGeometry;
  activeId: string | null;
};

export function TreeGraphic({ layout, geometry, activeId }: Props) {
  const { frame, scroll } = layout;
  const { detail } = frame;
  const branchByNode = new Map(geometry.branches.map((b) => [b.node, b]));

  return (
    <svg
      className="art art--tree"
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      overflow="visible"
      aria-hidden="true"
      focusable="false"
    >
      <Decoration decor={layout.decor} detail={detail} />

      {/* Level 3 — secondary branches */}
      <g className="l3">
        {geometry.twigs.map((twig, i) => (
          <g key={i}>
            <path className="l3-path" style={{ strokeWidth: `${twig.weight}px` }} d={cubicPath(twig.curve)} />
            {twig.dot && <circle className="l3-dot" cx={twig.curve.to.x} cy={twig.curve.to.y} r={2 * detail} />}
          </g>
        ))}
      </g>

      {/* Strands crossing into the roots screen, and the ones splitting from the trunk */}
      <g className="bundle">
        {geometry.bundle.map((s, i) => (
          <line key={i} x1={s.from.x} y1={s.from.y} x2={s.to.x} y2={s.to.y} />
        ))}
        {geometry.trunkStrands.map((s, i) => (
          <path key={`t${i}`} d={cubicPath(s)} />
        ))}
      </g>

      {/* Level 2 — project branches */}
      <g className="l2">
        {geometry.branches.map((b) => (
          <path
            key={b.node}
            className={b.node === activeId ? 'branch is-active' : 'branch'}
            d={taperedPath(b.curve, b.w0 * (b.node === activeId ? 1.25 : 1), b.w1)}
          />
        ))}
      </g>

      {/* Level 1 — trunk */}
      <g className="l1">
        <path d={taperedPath(geometry.trunk, layout.trunk.w0, layout.trunk.w1)} />
      </g>

      {layout.nodes.map((node) => (
        <NodeRing
          key={node.id}
          node={node}
          anchor={branchByNode.get(node.id)?.curve.to}
          detail={detail}
          active={node.id === activeId}
        />
      ))}

      {/* Scroll control rings (the button itself is a DOM element) */}
      <g className="scroll-rings">
        <circle className="scroll-rings__outer" cx={scroll.at.x} cy={scroll.at.y} r={scroll.r + 8 * detail} />
        <circle className="scroll-rings__main" cx={scroll.at.x} cy={scroll.at.y} r={scroll.r} />
        <path
          className="scroll-rings__ticks"
          d={`M${scroll.at.x - scroll.r - 14 * detail} ${scroll.at.y}h${6 * detail}M${scroll.at.x + scroll.r + 8 * detail} ${scroll.at.y}h${6 * detail}`}
        />
      </g>
    </svg>
  );
}
