// Builds drawable geometry for the tree and roots from layout data.
// All endpoints are derived here (node rings, parent paths), never duplicated in data.

import type { NodeSpec, PathRef, RootsLayout, TreeLayout } from '../data/layoutTypes';
import { circleAnchor, cubicAt, pt, type Cubic, type Point } from './geometry';

type Registry = Map<string, Cubic>;

function resolve(ref: PathRef, paths: Registry): Point {
  if ('path' in ref) {
    const parent = paths.get(ref.path);
    if (!parent) throw new Error(`Unknown path "${ref.path}" (define it before referencing it)`);
    return cubicAt(parent, ref.t);
  }
  return ref;
}

function nodeMap(nodes: NodeSpec[]) {
  return new Map(nodes.map((n) => [n.id, n]));
}

function requireNode(nodes: Map<string, NodeSpec>, id: string): NodeSpec {
  const node = nodes.get(id);
  if (!node) throw new Error(`Unknown node "${id}"`);
  return node;
}

/** Where a curve leaving (or reaching) `node` through control point `control` meets its ring. */
export function ringAnchor(node: NodeSpec, control: Point): Point {
  return circleAnchor(node.at, node.ring, control);
}

// ---------------------------------------------------------------------------

export type TreeGeometry = {
  trunk: Cubic;
  trunkStrands: Cubic[];
  /** Vertical strands from the bottom of the scroll control down past the screen edge. */
  bundle: { from: Point; to: Point }[];
  branches: { node: string; curve: Cubic; w0: number; w1: number }[];
  twigs: { curve: Cubic; dot: boolean; weight: number }[];
};

/** Distance the boundary strands overshoot the stage so they always reach the screen edge. */
const OVERSHOOT = 1600;

export function buildTree(layout: TreeLayout): TreeGeometry {
  const { frame, scroll } = layout;
  const nodes = nodeMap(layout.nodes);
  const paths: Registry = new Map();

  const base = pt(frame.trunkX, scroll.at.y - scroll.r);
  const trunk: Cubic = { from: base, c1: layout.trunk.c1, c2: layout.trunk.c2, to: layout.trunk.top };
  paths.set('trunk', trunk);

  const trunkStrands = layout.trunkStrands.map(({ from, offset }) => {
    const start = resolve(from, paths);
    const end = pt(frame.trunkX + offset, base.y + 2);
    return { from: start, c1: pt(start.x, start.y + (end.y - start.y) * 0.45), c2: pt(end.x, end.y - (end.y - start.y) * 0.4), to: end };
  });

  const bundle = frame.bundle.map((offset) => ({
    from: pt(frame.trunkX + offset, scroll.at.y + scroll.r),
    to: pt(frame.trunkX + offset, frame.height + OVERSHOOT),
  }));

  const branches = layout.branches.map((b) => {
    const node = requireNode(nodes, b.node);
    const from = b.fromNode ? ringAnchor(requireNode(nodes, b.fromNode), b.c1) : resolve(b.from ?? pt(frame.trunkX, base.y), paths);
    const curve: Cubic = { from, c1: b.c1, c2: b.c2, to: ringAnchor(node, b.c2) };
    paths.set(b.node, curve);
    return { node: b.node, curve, w0: b.w0, w1: b.w1 };
  });

  const twigs = layout.twigs.map((t, i) => {
    const from = t.fromNode ? ringAnchor(requireNode(nodes, t.fromNode), t.c1) : t.from && resolve(t.from, paths);
    if (!from) throw new Error(`Twig ${i} has no origin`);
    const curve: Cubic = { from, c1: t.c1, c2: t.c2, to: t.to };
    paths.set(`twig-${i}`, curve);
    return { curve, dot: t.dot ?? false, weight: t.weight ?? 1 };
  });

  return { trunk, trunkStrands, bundle, branches, twigs };
}

// ---------------------------------------------------------------------------

export type RootGeometry = {
  /** Vertical bundle strands from above the screen edge down to their peel point. */
  strands: { from: Point; to: Point }[];
  roots: { id: string; node?: string; curve: Cubic; w0: number; w1: number; level: 2 | 3; dot: boolean }[];
  sparks: Point[];
};

export function buildRoots(layout: RootsLayout): RootGeometry {
  const { frame } = layout;
  const nodes = nodeMap(layout.nodes);
  const paths: Registry = new Map();
  const strands: RootGeometry['strands'] = [];

  const roots = layout.roots.map((r) => {
    let from: Point;
    if (r.strand !== undefined && r.peel !== undefined) {
      const x = frame.trunkX + frame.bundle[r.strand];
      from = pt(x, r.peel);
      strands.push({ from: pt(x, -OVERSHOOT), to: from });
    } else if (r.fromNode) {
      from = ringAnchor(requireNode(nodes, r.fromNode), r.c1);
    } else if (r.from) {
      from = resolve(r.from, paths);
    } else {
      throw new Error(`Root "${r.id}" has no origin`);
    }

    const to = r.node ? ringAnchor(requireNode(nodes, r.node), r.c2) : r.to;
    if (!to) throw new Error(`Root "${r.id}" has no end`);

    const curve: Cubic = { from, c1: r.c1, c2: r.c2, to };
    paths.set(r.id, curve);
    return { id: r.id, node: r.node, curve, w0: r.w0, w1: r.w1, level: r.level, dot: r.dot ?? false };
  });

  const sparks = layout.sparks.map((s) => resolve(s, paths));
  return { strands, roots, sparks };
}
