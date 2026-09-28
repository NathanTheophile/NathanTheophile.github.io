import { pt } from '../lib/geometry';
import type { RootsLayout } from './layoutTypes';
import { desktopFrame, mobileFrame } from './treeLayout';

// Roots peel off the vertical bundle (strand index into frame.bundle) at `peel`,
// or grow from another root / node. Every `node` endpoint is derived from that
// node's ring, so a root always lands on its skill.

// ---------------------------------------------------------------------------
// Desktop — four main roots descend through the skill columns.
// ---------------------------------------------------------------------------
export const desktopRoots: RootsLayout = {
  frame: desktopFrame,
  nodes: [
    { id: 'unity', at: pt(105, 453), r: 33, ring: 40, label: 'right' },
    { id: 'unreal', at: pt(355, 451), r: 33, ring: 40, label: 'right' },
    { id: 'glsl', at: pt(704, 391), r: 33, ring: 40, label: 'right' },
    { id: 'csharp', at: pt(121, 593), r: 33, ring: 40, label: 'right' },
    { id: 'cpp', at: pt(368, 608), r: 33, ring: 40, label: 'right' },
    { id: 'hlsl', at: pt(655, 554), r: 33, ring: 40, label: 'right' },
    { id: 'git', at: pt(846, 628), r: 33, ring: 40, label: 'right' },
    { id: 'blueprint', at: pt(157, 735), r: 33, ring: 40, label: 'right' },
    { id: 'workflow', at: pt(626, 722), r: 33, ring: 40, label: 'right' },
    { id: 'tools', at: pt(400, 777), r: 33, ring: 40, label: 'right' },
    { id: 'experiments', at: pt(837, 792), r: 33, ring: 40, label: 'right' },
  ],
  roots: [
    // Main roots from the bundle. They reach each column head from above so
    // they never cross a label (labels sit to the right of their node).
    { id: 'unity', strand: 0, peel: 150, c1: pt(482, 380), c2: pt(150, 360), node: 'unity', w0: 2.8, w1: 1.3, level: 2 },
    { id: 'unreal', strand: 2, peel: 190, c1: pt(495, 300), c2: pt(392, 340), node: 'unreal', w0: 2.6, w1: 1.3, level: 2 },
    { id: 'glsl', strand: 7, peel: 175, c1: pt(512, 290), c2: pt(640, 300), node: 'glsl', w0: 2.6, w1: 1.3, level: 2 },
    { id: 'git', strand: 9, peel: 140, c1: pt(600, 165), c2: pt(1040, 300), node: 'git', w0: 2.6, w1: 1.3, level: 2 },
    // Chains through the columns.
    { id: 'csharp', fromNode: 'unity', c1: pt(100, 517), c2: pt(126, 524), node: 'csharp', w0: 1.6, w1: 1.3, level: 2 },
    { id: 'blueprint', fromNode: 'csharp', c1: pt(118, 662), c2: pt(150, 667), node: 'blueprint', w0: 1.6, w1: 1.3, level: 2 },
    { id: 'cpp', fromNode: 'unreal', c1: pt(352, 517), c2: pt(366, 527), node: 'cpp', w0: 1.6, w1: 1.3, level: 2 },
    { id: 'tools', fromNode: 'cpp', c1: pt(372, 677), c2: pt(396, 687), node: 'tools', w0: 1.6, w1: 1.3, level: 2 },
    { id: 'hlsl', fromNode: 'glsl', c1: pt(698, 472), c2: pt(664, 480), node: 'hlsl', w0: 1.6, w1: 1.3, level: 2 },
    { id: 'workflow', fromNode: 'hlsl', c1: pt(648, 627), c2: pt(630, 642), node: 'workflow', w0: 1.6, w1: 1.3, level: 2 },
    { id: 'experiments', fromNode: 'git', c1: pt(846, 702), c2: pt(838, 718), node: 'experiments', w0: 1.6, w1: 1.3, level: 2 },
    // Central roots running down between the columns.
    { id: 'center-a', strand: 3, peel: 250, c1: pt(498, 400), c2: pt(560, 470), to: pt(592, 960), w0: 1.8, w1: 0.8, level: 3 },
    { id: 'center-b', strand: 4, peel: 280, c1: pt(502, 440), c2: pt(575, 560), to: pt(612, 960), w0: 1.6, w1: 0.8, level: 3 },
    { id: 'center-c', strand: 5, peel: 230, c1: pt(508, 330), c2: pt(560, 380), to: pt(596, 452), w0: 1.4, w1: 0.8, level: 3, dot: true },
    { id: 'center-d', strand: 6, peel: 300, c1: pt(510, 500), c2: pt(548, 620), to: pt(570, 720), w0: 1.2, w1: 0.7, level: 3, dot: true },
    // Secondary roots toward the edges.
    { id: 'left-mid', strand: 1, peel: 230, c1: pt(486, 330), c2: pt(330, 372), to: pt(296, 416), w0: 1.3, w1: 0.7, level: 3, dot: true },
    { id: 'right-mid', strand: 8, peel: 205, c1: pt(530, 255), c2: pt(610, 262), to: pt(652, 258), w0: 1.2, w1: 0.7, level: 3, dot: true },
    { id: 'right-edge', strand: 10, peel: 115, c1: pt(545, 160), c2: pt(800, 250), to: pt(1012, 300), w0: 1.4, w1: 0.6, level: 3 },
    { id: 'unity-out', fromNode: 'unity', c1: pt(40, 480), c2: pt(20, 505), to: pt(-12, 525), w0: 1.1, w1: 0.6, level: 3 },
    { id: 'csharp-out', fromNode: 'csharp', c1: pt(64, 622), c2: pt(30, 652), to: pt(-12, 676), w0: 1.1, w1: 0.6, level: 3 },
    { id: 'blueprint-out', fromNode: 'blueprint', c1: pt(160, 812), c2: pt(176, 852), to: pt(190, 960), w0: 1.1, w1: 0.6, level: 3 },
    { id: 'tools-out', fromNode: 'tools', c1: pt(402, 842), c2: pt(418, 872), to: pt(428, 960), w0: 1.1, w1: 0.6, level: 3 },
    { id: 'experiments-out', fromNode: 'experiments', c1: pt(830, 852), c2: pt(812, 882), to: pt(802, 960), w0: 1.1, w1: 0.6, level: 3 },
    { id: 'workflow-out', fromNode: 'workflow', c1: pt(618, 800), c2: pt(636, 850), to: pt(652, 960), w0: 1.1, w1: 0.6, level: 3 },
    { id: 'git-out', from: { path: 'git', t: 0.8 }, c1: pt(960, 380), c2: pt(990, 440), to: pt(1012, 490), w0: 1, w1: 0.6, level: 3 },
  ],
  decor: {
    rings: [
      { at: pt(935, 470), r: 14 },
      { at: pt(250, 572), r: 70, dashed: true },
    ],
    traces: [
      [pt(652, 258), pt(668, 242), pt(760, 242)],
      [pt(44, 540), pt(44, 620), pt(58, 634)],
      [pt(930, 712), pt(930, 772), pt(946, 788)],
    ],
    dots: [
      pt(565, 110), pt(640, 150), pt(720, 190), pt(380, 250), pt(935, 470),
      pt(245, 532), pt(470, 702), pt(760, 482), pt(520, 652), pt(965, 572),
      pt(30, 772), pt(700, 852), pt(300, 862),
    ],
    crosses: [pt(620, 330), pt(975, 545), pt(265, 415)],
    guides: [
      [pt(560, 250), pt(640, 250)],
      [pt(740, 792), pt(740, 872)],
    ],
  },
  sparks: [
    { path: 'unity', t: 0.3 },
    { path: 'glsl', t: 0.55 },
    { path: 'git', t: 0.62 },
    { path: 'center-b', t: 0.55 },
    { path: 'right-edge', t: 0.7 },
    { path: 'left-mid', t: 0.6 },
  ],
};

// ---------------------------------------------------------------------------
// Mobile — skills alternate left / right of the central bundle; each root peels
// off above its node and reaches the icon from above, clear of the title.
// ---------------------------------------------------------------------------
const mobileRow = (i: number) => 930 + i * 185;
const leftSkills = ['unity', 'unreal', 'csharp', 'cpp', 'blueprint', 'tools'] as const;
const rightSkills = ['glsl', 'hlsl', 'git', 'workflow', 'experiments'] as const;

export const mobileRoots: RootsLayout = {
  frame: mobileFrame,
  nodes: [
    ...leftSkills.map((id, i) => ({ id, at: pt(95, mobileRow(i)), r: 50, ring: 60, label: 'right' as const })),
    ...rightSkills.map((id, i) => ({ id, at: pt(612, mobileRow(i + 0.5)), r: 50, ring: 60, label: 'right' as const })),
  ],
  roots: [
    // Left column: outermost strands peel first.
    ...leftSkills.map((id, i) => ({
      id,
      strand: i,
      peel: mobileRow(i) - 135,
      c1: pt(mobileFrame.trunkX + mobileFrame.bundle[i], mobileRow(i) - 85),
      c2: pt(210, mobileRow(i) - 95),
      node: id,
      w0: 1.8,
      w1: 1.1,
      level: 2 as const,
    })),
    // Right column mirrors it with the right-hand strands.
    ...rightSkills.map((id, i) => ({
      id,
      strand: 10 - i,
      peel: mobileRow(i + 0.5) - 135,
      c1: pt(mobileFrame.trunkX + mobileFrame.bundle[10 - i], mobileRow(i + 0.5) - 85),
      c2: pt(555, mobileRow(i + 0.5) - 95),
      node: id,
      w0: 1.8,
      w1: 1.1,
      level: 2 as const,
    })),
    { id: 'tools-out', fromNode: 'tools', c1: pt(100, 1990), c2: pt(130, 2050), to: pt(150, 2160), w0: 1, w1: 0.5, level: 3 },
    { id: 'experiments-out', fromNode: 'experiments', c1: pt(612, 1880), c2: pt(560, 1980), to: pt(530, 2160), w0: 1, w1: 0.5, level: 3 },
    { id: 'right-edge', from: { path: 'glsl', t: 0.4 }, c1: pt(700, 840), c2: pt(860, 850), to: pt(1012, 880), w0: 1, w1: 0.5, level: 3 },
  ],
  decor: {
    rings: [{ at: pt(880, 1990), r: 28 }],
    traces: [[pt(40, 1060), pt(40, 1260), pt(60, 1280)]],
    dots: [pt(880, 1990), pt(930, 1300), pt(380, 2000), pt(300, 1045)],
    crosses: [pt(940, 1650)],
    guides: [],
  },
  sparks: [{ path: 'unity', t: 0.4 }, { path: 'git', t: 0.5 }, { path: 'right-edge', t: 0.6 }],
  bundleFade: [0, 90, 690, 790],
};
