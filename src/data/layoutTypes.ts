import type { Point } from '../lib/geometry';

/** Normalized art-stage frame. Both screens of one layout share it (same trunk x). */
export type StageFrame = {
  width: number;
  height: number;
  trunkX: number;
  /** Horizontal offsets (from trunkX) of the strands crossing the screen boundary. */
  bundle: number[];
  /** Size multiplier for small details (dots, markers) so they keep a similar pixel size. */
  detail: number;
};

export type LabelPlacement = 'right' | 'below' | 'below-end';

export type NodeSpec = {
  id: string;
  at: Point;
  /** Radius of the image / icon disc. */
  r: number;
  /** Radius of the outer ring the branch connects to. */
  ring: number;
  label: LabelPlacement;
};

/** A point given directly, or as a parameter along another named path of the same graphic. */
export type PathRef = Point | { path: string; t: number };

export type BranchSpec = {
  /** Target node id; the endpoint is derived from that node's ring. */
  node: string;
  /** Optional node the branch starts from (ring anchor derived too). */
  fromNode?: string;
  from?: PathRef;
  c1: Point;
  c2: Point;
  w0: number;
  w1: number;
};

export type TwigSpec = {
  /** Start point, or omit and set `fromNode` to grow out of that node's ring. */
  from?: PathRef;
  fromNode?: string;
  c1: Point;
  c2: Point;
  to: Point;
  dot?: boolean;
  /** Stroke width multiplier (default 1). */
  weight?: number;
};

export type Decor = {
  rings: { at: Point; r: number; dashed?: boolean }[];
  traces: Point[][];
  dots: Point[];
  crosses: Point[];
  guides: [Point, Point][];
};

export type TreeLayout = {
  frame: StageFrame;
  nodes: NodeSpec[];
  trunk: { top: Point; c1: Point; c2: Point; w0: number; w1: number };
  /** Thin strands that split from the trunk and enter the scroll control. */
  trunkStrands: { from: PathRef; offset: number }[];
  branches: BranchSpec[];
  twigs: TwigSpec[];
  decor: Decor;
  scroll: { at: Point; r: number };
};

export type RootSpec = {
  id: string;
  /** Bundle strand index this root peels from (when not starting from a node or path). */
  strand?: number;
  /** y where the root leaves the vertical bundle. */
  peel?: number;
  from?: PathRef;
  fromNode?: string;
  /** Target node id (endpoint derived from its ring), or a free end point. */
  node?: string;
  to?: Point;
  c1: Point;
  c2: Point;
  w0: number;
  w1: number;
  level: 2 | 3;
  dot?: boolean;
};

export type RootsLayout = {
  frame: StageFrame;
  nodes: NodeSpec[];
  roots: RootSpec[];
  decor: Decor;
  /** Highlighted junction points (small glowing dots). */
  sparks: PathRef[];
  /**
   * Optional vertical fade of the bundle [visibleUntil, hiddenFrom, hiddenUntil, visibleFrom],
   * used on mobile where the editorial column spans the full width above the roots.
   */
  bundleFade?: [number, number, number, number];
};

