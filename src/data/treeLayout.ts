import { pt } from '../lib/geometry';
import type { StageFrame, TreeLayout } from './layoutTypes';

// Stage frames shared by both screens of a layout: the trunk on screen 1 and the
// root bundle on screen 2 use the same trunkX and strand offsets, so they line up.
export const desktopFrame: StageFrame = {
  width: 1000,
  height: 880,
  trunkX: 505,
  bundle: [-16, -13, -10, -7, -4, -1, 2, 5, 8, 11, 14],
  detail: 1,
};

export const mobileFrame: StageFrame = {
  width: 1000,
  height: 2100,
  trunkX: 500,
  bundle: [-30, -24, -18, -12, -6, 0, 6, 12, 18, 24, 30],
  detail: 2.4,
};

// ---------------------------------------------------------------------------
// Desktop — composition matched to the reference artboard.
// ---------------------------------------------------------------------------
export const desktopTree: TreeLayout = {
  frame: desktopFrame,
  nodes: [
    { id: 'recent', at: pt(507, 168), r: 48, ring: 58, label: 'right' },
    { id: 'prototype', at: pt(349, 287), r: 39, ring: 50, label: 'below' },
    { id: 'gameplay', at: pt(741, 289), r: 44, ring: 55, label: 'right' },
    { id: 'shader', at: pt(242, 535), r: 42, ring: 53, label: 'below' },
    { id: 'featured', at: pt(747, 542), r: 47, ring: 58, label: 'right' },
  ],
  trunk: { top: pt(505, 470), c1: pt(503, 690), c2: pt(507, 580), w0: 6.4, w1: 4.6 },
  trunkStrands: [
    { from: { path: 'trunk', t: 0.45 }, offset: -7 },
    { from: { path: 'trunk', t: 0.6 }, offset: -13 },
    { from: { path: 'trunk', t: 0.5 }, offset: 5 },
    { from: { path: 'trunk', t: 0.68 }, offset: 11 },
  ],
  branches: [
    { node: 'recent', from: pt(505, 474), c1: pt(505, 400), c2: pt(508, 300), w0: 4.6, w1: 2.2 },
    { node: 'prototype', from: { path: 'recent', t: 0.22 }, c1: pt(498, 360), c2: pt(470, 296), w0: 3, w1: 1.5 },
    { node: 'gameplay', from: { path: 'trunk', t: 0.8 }, c1: pt(520, 440), c2: pt(590, 330), w0: 3.2, w1: 1.5 },
    { node: 'shader', from: { path: 'trunk', t: 0.56 }, c1: pt(482, 575), c2: pt(385, 522), w0: 3.2, w1: 1.5 },
    { node: 'featured', from: { path: 'trunk', t: 0.38 }, c1: pt(522, 610), c2: pt(610, 548), w0: 3.2, w1: 1.5 },
  ],
  twigs: [
    { from: { path: 'recent', t: 0.35 }, c1: pt(522, 380), c2: pt(546, 330), to: pt(566, 262), dot: true },
    { from: { path: 'twig-0', t: 0.62 }, c1: pt(566, 318), c2: pt(586, 302), to: pt(604, 298), dot: true, weight: 0.8 },
    { from: { path: 'recent', t: 0.72 }, c1: pt(496, 280), c2: pt(476, 252), to: pt(456, 238), dot: true, weight: 0.8 },
    { from: { path: 'trunk', t: 0.72 }, c1: pt(468, 505), c2: pt(418, 478), to: pt(360, 466), dot: true },
    { from: { path: 'twig-3', t: 0.62 }, c1: pt(410, 455), c2: pt(402, 432), to: pt(398, 412), dot: true, weight: 0.8 },
    { from: { path: 'trunk', t: 0.66 }, c1: pt(540, 532), c2: pt(580, 500), to: pt(622, 486), dot: true },
    { from: { path: 'gameplay', t: 0.55 }, c1: pt(640, 440), c2: pt(662, 428), to: pt(688, 424), dot: true, weight: 0.8 },
    { from: { path: 'shader', t: 0.5 }, c1: pt(426, 572), c2: pt(420, 600), to: pt(424, 630), dot: true, weight: 0.8 },
    { from: { path: 'featured', t: 0.55 }, c1: pt(622, 606), c2: pt(652, 622), to: pt(690, 628), dot: true, weight: 0.8 },
    { from: { path: 'trunk', t: 0.25 }, c1: pt(540, 690), c2: pt(566, 676), to: pt(596, 672), dot: true, weight: 0.8 },
    { fromNode: 'gameplay', c1: pt(702, 224), c2: pt(716, 206), to: pt(738, 200), dot: true, weight: 0.9 },
    { fromNode: 'recent', c1: pt(440, 128), c2: pt(430, 112), to: pt(432, 92), dot: true, weight: 0.9 },
    { fromNode: 'shader', c1: pt(262, 470), c2: pt(250, 452), to: pt(232, 440), dot: true, weight: 0.8 },
  ],
  decor: {
    rings: [
      { at: pt(410, 150), r: 82 },
      { at: pt(330, 655), r: 58, dashed: true },
      { at: pt(626, 486), r: 6 },
    ],
    traces: [
      [pt(566, 262), pt(582, 246), pt(632, 246)],
      [pt(360, 466), pt(344, 450), pt(300, 450)],
      [pt(690, 628), pt(706, 644), pt(760, 644)],
    ],
    dots: [
      pt(450, 106), pt(603, 132), pt(282, 210), pt(640, 226), pt(830, 380), pt(784, 410),
      pt(300, 400), pt(585, 400), pt(452, 692), pt(642, 700), pt(218, 440), pt(860, 460),
      pt(622, 780), pt(395, 790),
    ],
    crosses: [pt(262, 225), pt(826, 440), pt(430, 760), pt(640, 330)],
    guides: [
      [pt(792, 360), pt(792, 460)],
      [pt(560, 648), pt(610, 648)],
      [pt(200, 250), pt(200, 330)],
    ],
  },
  scroll: { at: pt(505, 827), r: 33 },
};

// ---------------------------------------------------------------------------
// Mobile — recomposed vertically: nodes alternate around a central spine.
// ---------------------------------------------------------------------------
export const mobileTree: TreeLayout = {
  frame: mobileFrame,
  nodes: [
    { id: 'recent', at: pt(500, 965), r: 86, ring: 102, label: 'right' },
    { id: 'prototype', at: pt(165, 1120), r: 70, ring: 84, label: 'below' },
    { id: 'gameplay', at: pt(820, 1255), r: 74, ring: 88, label: 'below-end' },
    { id: 'shader', at: pt(165, 1500), r: 70, ring: 84, label: 'below' },
    { id: 'featured', at: pt(820, 1640), r: 74, ring: 88, label: 'below-end' },
  ],
  trunk: { top: pt(500, 1180), c1: pt(496, 1700), c2: pt(504, 1450), w0: 16, w1: 11 },
  trunkStrands: [
    { from: { path: 'trunk', t: 0.35 }, offset: -18 },
    { from: { path: 'trunk', t: 0.45 }, offset: 18 },
  ],
  branches: [
    { node: 'recent', from: pt(500, 1186), c1: pt(500, 1130), c2: pt(500, 1100), w0: 11, w1: 5 },
    { node: 'prototype', from: { path: 'trunk', t: 0.94 }, c1: pt(470, 1150), c2: pt(330, 1110), w0: 7, w1: 3.5 },
    { node: 'gameplay', from: { path: 'trunk', t: 0.8 }, c1: pt(540, 1290), c2: pt(640, 1250), w0: 7, w1: 3.5 },
    { node: 'shader', from: { path: 'trunk', t: 0.45 }, c1: pt(450, 1530), c2: pt(330, 1495), w0: 7, w1: 3.5 },
    { node: 'featured', from: { path: 'trunk', t: 0.28 }, c1: pt(545, 1680), c2: pt(640, 1640), w0: 7, w1: 3.5 },
  ],
  twigs: [
    { from: { path: 'recent', t: 0.4 }, c1: pt(460, 1110), c2: pt(420, 1060), to: pt(390, 1010), dot: true },
    { from: { path: 'trunk', t: 0.1 }, c1: pt(450, 1840), c2: pt(400, 1850), to: pt(350, 1880), dot: true },
  ],
  decor: {
    rings: [{ at: pt(270, 950), r: 80 }],
    traces: [[pt(350, 1880), pt(330, 1900), pt(260, 1900)]],
    dots: [pt(120, 900), pt(900, 1080), pt(380, 1380), pt(640, 1520), pt(880, 1900)],
    crosses: [pt(900, 1150)],
    guides: [],
  },
  scroll: { at: pt(500, 1960), r: 62 },
};
