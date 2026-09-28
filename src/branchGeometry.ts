import type { Item, Placement, Point } from "./data";

export const TRUNK_X = 505;
export const MOBILE_TRUNK_X = 197;

type Step =
  | ["C", number, number, number, number, number, number]
  | ["L", number, number]
  | ["V", number];
type Segment = { from: Point; c1: Point; c2: Point; to: Point };
export type Trace = {
  id: string;
  start: Point;
  segments: Segment[];
  width: number;
  opacity: number;
  parent?: { id: string; segment: number; t: number };
  nodeId?: string;
  secondary?: boolean;
};

function between(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// Forks use a point on the actual parent curve, rather than a second guessed coordinate.
function anchor(trace: Trace, segment: number, t: number): Point {
  const s = trace.segments[segment]!;
  const a = between(s.from, s.c1, t),
    b = between(s.c1, s.c2, t),
    c = between(s.c2, s.to, t);
  return between(between(a, b, t), between(b, c, t), t);
}

function route(
  id: string,
  start: Point,
  steps: Step[],
  width: number,
  opacity = 1,
): Trace {
  let from = start;
  const segments = steps.map((step) => {
    const to =
      step[0] === "C"
        ? { x: step[5], y: step[6] }
        : step[0] === "L"
          ? { x: step[1], y: step[2] }
          : { x: from.x, y: step[1] };
    const segment = {
      from,
      c1:
        step[0] === "C" ? { x: step[1], y: step[2] } : between(from, to, 1 / 3),
      c2:
        step[0] === "C" ? { x: step[3], y: step[4] } : between(from, to, 2 / 3),
      to,
    };
    from = to;
    return segment;
  });
  return { id, start, segments, width, opacity };
}

function fork(
  id: string,
  parent: Trace,
  segment: number,
  t: number,
  steps: Step[],
  width = 0.75,
  opacity = 0.85,
): Trace {
  return {
    ...route(id, anchor(parent, segment, t), steps, width, opacity),
    parent: { id: parent.id, segment, t },
    secondary: true,
  };
}

function connect(
  trace: Trace,
  node: Placement,
  c1: Point,
  c2: Point,
  nodeId: string,
): Trace {
  const dx = c2.x - node.x,
    dy = c2.y - node.y,
    length = Math.hypot(dx, dy);
  const to = {
    x: node.x + (dx / length) * node.r,
    y: node.y + (dy / length) * node.r,
  };
  trace.segments.push({ from: trace.segments.at(-1)?.to ?? trace.start, c1, c2, to });
  return { ...trace, nodeId };
}

export function tracePath(trace: Trace): string {
  const start = trace.start;
  return (
    `M${start.x} ${start.y}` +
    trace.segments
      .map(
        (s) => `C${s.c1.x} ${s.c1.y} ${s.c2.x} ${s.c2.y} ${s.to.x} ${s.to.y}`,
      )
      .join("")
  );
}

type ProjectPlan = {
  segment: number;
  t: number;
  steps: Step[];
  c1: Point;
  c2: Point;
};
const projectPlans: Record<string, ProjectPlan> = {
  recent: {
    segment: 5,
    t: 1,
    steps: [],
    c1: { x: 595, y: 279 },
    c2: { x: 514, y: 274 },
  },
  prototype: {
    segment: 5,
    t: 0.3,
    steps: [],
    c1: { x: 526, y: 281 },
    c2: { x: 433, y: 325 },
  },
  gameplay: {
    segment: 1,
    t: 1,
    steps: [
      ["C", 522, 551, 550, 540, 571, 515],
      ["C", 579, 503, 574, 489, 574, 471],
      ["C", 574, 449, 628, 430, 646, 408],
      ["C", 659, 391, 658, 363, 658, 347],
    ],
    c1: { x: 658, y: 328 },
    c2: { x: 677, y: 321 },
  },
  shader: {
    segment: 0,
    t: 1,
    steps: [
      ["C", 505, 638, 469, 620, 447, 600],
      ["C", 432, 584, 413, 564, 407, 557],
      ["C", 387, 555, 361, 559, 338, 558],
    ],
    c1: { x: 323, y: 558 },
    c2: { x: 317, y: 557 },
  },
  featured: {
    segment: 0,
    t: 0.85,
    steps: [],
    c1: { x: 531, y: 653 },
    c2: { x: 627, y: 566 },
  },
};

export function treeTraces(
  items: Item[],
  mobile: boolean,
  height: number,
): Trace[] {
  const x = mobile ? MOBILE_TRUNK_X : TRUNK_X;
  const trunk = route(
    "trunk",
    { x, y: mobile ? height : 870 },
    mobile
      ? [["V", 292]]
      : [
          ["V", 669],
          ["C", 505, 625, 506, 602, 508, 575],
          ["C", 512, 554, 551, 535, 553, 503],
          ["V", 460],
          ["C", 553, 435, 539, 430, 526, 412],
          ["V", 382],
        ],
    mobile ? 2.6 : 3.3,
  );
  const traces: Trace[] = [trunk];
  for (const item of items) {
    const node = mobile ? item.mobile : item.desktop;
    const plan = projectPlans[item.id]!;
    const segment = mobile ? 0 : plan.segment;
    const t = mobile
      ? (height - Math.min(node.y + 95, height - 8)) / (height - 292)
      : plan.t;
    const branch = fork(
      item.id,
      trunk,
      segment,
      t,
      mobile ? [] : plan.steps,
      mobile ? 1.4 : 1.9,
      1,
    );
    traces.push({
      ...connect(
        branch,
        node,
        mobile ? { x, y: node.y + 36 } : plan.c1,
        mobile
          ? { x: node.x < x ? node.x + 60 : node.x - 60, y: node.y + 36 }
          : plan.c2,
        item.id,
      ),
      secondary: false,
    });
  }
  const byId = Object.fromEntries(traces.map((trace) => [trace.id, trace]));
  const add = (
    id: string,
    parent: string,
    segment: number,
    t: number,
    steps: Step[],
    width?: number,
    opacity?: number,
  ) => {
    const trace = fork(id, byId[parent]!, segment, t, steps, width, opacity);
    traces.push(trace);
    byId[id] = trace;
  };
  if (mobile) {
    for (const [id, offset] of [["stem-left", -5], ["stem-right", 5]] as const) {
      add(id, "trunk", 0, 70 / (height - 292), [
        ["C", x, height - 45, x + offset, height - 30, x + offset, height],
      ], .85, .8);
    }
    if (height >= 780) {
      add(
        "shoot-left",
        "shader",
        0,
        0.2,
        [
          ["C", 173, 571, 174, 535, 174, 521],
          ["V", 500],
        ],
        0.65,
        0.65,
      );
      add(
        "shoot-right",
        "gameplay",
        0,
        0.3,
        [
          ["C", 222, 555, 220, 512, 220, 496],
          ["L", 230, 485],
        ],
        0.65,
        0.65,
      );
    }
    return traces;
  }
  add(
    "shader-crown",
    "shader",
    1,
    1,
    [
      ["C", 403, 545, 406, 535, 397, 523],
      ["L", 389, 513],
      ["C", 384, 506, 388, 494, 386, 489],
      ["L", 355, 460],
      ["L", 348, 451],
    ],
    0.9,
  );
  add(
    "shader-crown-right",
    "shader-crown",
    0,
    0.75,
    [
      ["L", 431, 511],
      ["L", 450, 496],
    ],
    0.7,
  );
  add(
    "shader-crown-tip",
    "shader-crown-right",
    0,
    0.7,
    [
      ["V", 493],
      ["L", 447, 483],
    ],
    0.55,
    0.7,
  );
  add(
    "shader-left",
    "shader",
    0,
    1,
    [
      ["C", 434, 604, 420, 595, 415, 596],
      ["L", 403, 580],
    ],
    1.8,
  );
  add(
    "shader-small",
    "shader",
    2,
    0.6,
    [
      ["L", 353, 546],
      ["L", 329, 538],
    ],
    0.65,
    0.65,
  );
  add(
    "gameplay-shoot",
    "gameplay",
    1,
    0.75,
    [
      ["C", 581, 478, 607, 479, 628, 480],
      ["L", 646, 462],
    ],
    0.95,
  );
  add(
    "gameplay-shoot-tip",
    "gameplay-shoot",
    0,
    1,
    [
      ["L", 643, 477],
      ["L", 650, 466],
    ],
    0.55,
    0.7,
  );
  add(
    "gameplay-upper",
    "gameplay",
    2,
    0.68,
    [
      ["C", 660, 385, 675, 370, 687, 365],
      ["L", 708, 350],
    ],
    0.65,
    0.7,
  );
  add(
    "recent-right",
    "recent",
    0,
    0.4,
    [
      ["C", 568, 294, 570, 284, 570, 281],
      ["L", 590, 271],
      ["L", 604, 270],
    ],
    0.8,
  );
  add(
    "recent-tip",
    "recent-right",
    0,
    0.7,
    [
      ["L", 581, 259],
      ["L", 588, 251],
    ],
    0.55,
    0.7,
  );
  add(
    "prototype-upper",
    "prototype",
    0,
    0.5,
    [
      ["C", 480, 326, 481, 307, 476, 299],
      ["L", 464, 286],
    ],
    0.6,
    0.65,
  );
  add(
    "prototype-inner",
    "prototype",
    0,
    0.16,
    [
      ["L", 509, 374],
      ["V", 354],
    ],
    0.8,
    0.8,
  );
  add(
    "featured-shoot",
    "featured",
    0,
    0.48,
    [
      ["C", 578, 629, 590, 619, 602, 617],
      ["L", 625, 617],
      ["L", 661, 602],
    ],
    0.8,
  );
  add(
    "featured-shoot-tip",
    "featured-shoot",
    0,
    0.65,
    [
      ["L", 581, 606],
      ["L", 573, 599],
    ],
    0.55,
    0.65,
  );
  add(
    "trunk-left",
    "trunk",
    0,
    0.22,
    [
      ["C", 498, 810, 498, 794, 498, 770],
      ["V", 717],
      ["L", 473, 697],
      ["V", 667],
    ],
    0.65,
    0.7,
  );
  add(
    "trunk-right",
    "trunk",
    0,
    0.05,
    [
      ["C", 518, 834, 519, 808, 519, 778],
      ["V", 734],
      ["L", 536, 712],
      ["V", 691],
    ],
    0.65,
    0.7,
  );
  add(
    "trunk-crown",
    "trunk",
    2,
    0.55,
    [
      ["C", 513, 529, 509, 508, 510, 490],
      ["V", 474],
      ["L", 488, 451],
      ["V", 426],
    ],
    0.6,
    0.55,
  );
  add(
    "trunk-left-inner",
    "trunk",
    0,
    0.03,
    [
      ["C", 493, 851, 491, 836, 491, 812],
      ["V", 711],
      ["C", 491, 679, 478, 655, 478, 628],
      ["L", 460, 614],
    ],
    0.55,
    0.5,
  );
  add(
    "trunk-right-inner",
    "trunk",
    0,
    0.08,
    [
      ["C", 512, 842, 512, 820, 512, 793],
      ["V", 690],
      ["C", 512, 659, 546, 639, 546, 620],
      ["V", 604],
      ["L", 559, 590],
    ],
    0.55,
    0.5,
  );
  return traces;
}

type RootPlan = { start: Point; steps: Step[]; c1: Point; c2: Point };
const rootPlans: Record<string, RootPlan> = {
  unity: {
    start: { x: 492, y: 0 },
    steps: [
      ["V", 133],
      ["C", 492, 173, 461, 182, 433, 218],
      ["C", 405, 249, 404, 267, 399, 287],
      ["C", 392, 325, 320, 315, 285, 333],
      ["C", 260, 346, 271, 379, 229, 383],
      ["L", 189, 383],
    ],
    c1: { x: 145, y: 383 },
    c2: { x: 110, y: 401 },
  },
  unreal: {
    start: { x: 501, y: 0 },
    steps: [
      ["V", 194],
      ["C", 501, 230, 487, 257, 462, 283],
      ["C", 441, 304, 453, 336, 430, 356],
      ["C", 412, 373, 385, 372, 376, 388],
    ],
    c1: { x: 363, y: 398 },
    c2: { x: 355, y: 395 },
  },
  glsl: {
    start: { x: 516, y: 0 },
    steps: [
      ["V", 124],
      ["C", 516, 173, 536, 183, 555, 199],
      ["C", 598, 233, 621, 248, 638, 276],
      ["C", 655, 296, 681, 301, 696, 319],
    ],
    c1: { x: 714, y: 332 },
    c2: { x: 704, y: 336 },
  },
  csharp: {
    start: { x: 495, y: 0 },
    steps: [
      ["V", 165],
      ["C", 495, 192, 409, 221, 415, 267],
      ["V", 310],
      ["C", 415, 351, 378, 374, 348, 392],
      ["C", 330, 407, 330, 430, 330, 469],
      ["V", 497],
      ["C", 330, 536, 250, 539, 229, 548],
    ],
    c1: { x: 190, y: 560 },
    c2: { x: 123, y: 535 },
  },
  cpp: {
    start: { x: 506, y: 0 },
    steps: [
      ["V", 264],
      ["C", 506, 305, 564, 340, 580, 370],
      ["V", 440],
      ["C", 580, 477, 507, 493, 482, 511],
      ["C", 459, 529, 460, 550, 438, 550],
    ],
    c1: { x: 414, y: 550 },
    c2: { x: 405, y: 581 },
  },
  hlsl: {
    start: { x: 511, y: 0 },
    steps: [
      ["V", 206],
      ["C", 511, 260, 552, 286, 575, 324],
      ["C", 591, 349, 589, 380, 590, 414],
      ["V", 445],
      ["C", 590, 475, 618, 491, 643, 496],
    ],
    c1: { x: 657, y: 497 },
    c2: { x: 655, y: 504 },
  },
  git: {
    start: { x: 519, y: 0 },
    steps: [
      ["V", 181],
      ["C", 526, 214, 570, 241, 597, 270],
      ["C", 639, 320, 661, 338, 693, 335],
      ["C", 714, 336, 742, 333, 746, 348],
      ["V", 453],
      ["C", 746, 475, 803, 466, 824, 489],
      ["C", 852, 509, 873, 510, 873, 541],
      ["V", 564],
    ],
    c1: { x: 873, y: 576 },
    c2: { x: 842, y: 575 },
  },
  webgl: {
    start: { x: 496, y: 0 },
    steps: [
      ["V", 244],
      ["C", 496, 294, 449, 313, 450, 351],
      ["C", 451, 377, 390, 381, 390, 407],
      ["V", 490],
      ["C", 390, 514, 335, 512, 335, 545],
      ["C", 335, 585, 313, 610, 282, 644],
      ["C", 266, 666, 239, 665, 218, 678],
    ],
    c1: { x: 198, y: 689 },
    c2: { x: 170, y: 688 },
  },
  tools: {
    start: { x: 508, y: 0 },
    steps: [
      ["V", 279],
      ["C", 508, 320, 563, 344, 603, 382],
      ["V", 457],
      ["C", 603, 488, 613, 509, 613, 540],
      ["V", 576],
      ["C", 613, 616, 566, 654, 534, 681],
      ["C", 508, 704, 454, 691, 435, 704],
    ],
    c1: { x: 416, y: 718 },
    c2: { x: 400, y: 717 },
  },
  workflow: {
    start: { x: 511, y: 0 },
    steps: [
      ["V", 292],
      ["C", 511, 340, 558, 359, 568, 394],
      ["C", 579, 434, 607, 451, 608, 505],
      ["V", 582],
      ["C", 609, 612, 585, 627, 591, 649],
    ],
    c1: { x: 593, y: 667 },
    c2: { x: 616, y: 671 },
  },
  experiments: {
    start: { x: 516, y: 0 },
    steps: [
      ["V", 291],
      ["C", 516, 348, 560, 350, 580, 388],
      ["C", 600, 426, 634, 433, 653, 462],
      ["C", 676, 485, 694, 491, 694, 514],
      ["V", 578],
      ["C", 694, 606, 742, 613, 795, 625],
      ["C", 838, 640, 859, 665, 859, 700],
    ],
    c1: { x: 859, y: 734 },
    c2: { x: 841, y: 736 },
  },
};

export function rootTraces(items: Item[], mobile: boolean): Trace[] {
  const traces = items.map((item, i) => {
    const node = mobile ? item.mobile : item.desktop;
    const plan = rootPlans[item.id]!;
    const start = mobile
      ? { x: MOBILE_TRUNK_X + ((i % 3) - 1) * 5, y: 0 }
      : plan.start;
    const trace = route(
      item.id,
      start,
      mobile ? [["V", node.y - node.r - 12]] : plan.steps,
      mobile ? 0.85 : 1.35,
      i % 3 === 0 ? 0.88 : 0.72,
    );
    return connect(
      trace,
      node,
      mobile ? { x: MOBILE_TRUNK_X, y: node.y - node.r } : plan.c1,
      mobile ? { x: node.x, y: node.y - node.r } : plan.c2,
      item.id,
    );
  });
  if (mobile) return traces;
  const byId = Object.fromEntries(traces.map((trace) => [trace.id, trace]));
  const add = (
    id: string,
    parent: string,
    segment: number,
    t: number,
    steps: Step[],
    opacity = 0.38,
  ) => {
    const trace = fork(id, byId[parent]!, segment, t, steps, 0.6, opacity);
    traces.push(trace);
    byId[id] = trace;
  };
  add("unity-fine", "unity", 2, 0.55, [
    ["C", 395, 292, 358, 302, 332, 315],
    ["C", 308, 329, 310, 345, 291, 357],
  ]);
  add("unity-tip", "unity", 5, 0.2, [["C", 160, 386, 158, 394, 146, 400]], 0.5);
  add("unreal-fine", "unreal", 2, 0.65, [
    ["C", 421, 351, 364, 358, 348, 370],
    ["L", 318, 393],
  ]);
  add("csharp-fine", "csharp", 3, 0.35, [
    ["C", 350, 355, 315, 369, 302, 399],
    ["C", 295, 432, 292, 444, 292, 464],
    ["V", 500],
    ["C", 292, 522, 270, 529, 260, 544],
  ]);
  add(
    "csharp-tip",
    "csharp-fine",
    2,
    0.8,
    [
      ["L", 280, 500],
      ["L", 265, 514],
    ],
    0.28,
  );
  add("cpp-fine", "cpp", 1, 0.65, [
    ["C", 581, 352, 578, 405, 582, 440],
    ["L", 575, 463],
    ["C", 574, 475, 549, 480, 542, 499],
  ]);
  add("cpp-deep", "cpp", 3, 0.5, [
    ["C", 553, 522, 556, 531, 555, 557],
    ["V", 628],
    ["C", 555, 663, 525, 673, 512, 684],
  ]);
  add(
    "glsl-fine",
    "glsl",
    2,
    0.65,
    [
      ["C", 641, 292, 670, 315, 682, 326],
      ["L", 681, 341],
    ],
    0.45,
  );
  add(
    "git-fine",
    "git",
    2,
    0.45,
    [
      ["C", 746, 307, 889, 303, 889, 344],
      ["V", 383],
      ["C", 889, 409, 896, 428, 902, 446],
    ],
    0.27,
  );
  add(
    "git-tip",
    "git-fine",
    2,
    0.4,
    [
      ["L", 923, 393],
      ["L", 944, 401],
    ],
    0.25,
  );
  add("webgl-fine", "webgl", 5, 0.3, [
    ["C", 334, 606, 326, 620, 311, 636],
    ["L", 299, 652],
    ["L", 271, 657],
    ["L", 245, 672],
  ]);
  add("tools-fine", "tools", 5, 0.3, [
    ["C", 580, 643, 553, 671, 541, 687],
    ["L", 537, 714],
    ["L", 540, 727],
  ]);
  add("workflow-fine", "workflow", 3, 0.6, [
    ["C", 587, 578, 573, 620, 568, 645],
    ["V", 694],
    ["C", 565, 710, 552, 719, 552, 745],
    ["V", 802],
  ]);
  add(
    "workflow-tip",
    "workflow-fine",
    2,
    0.65,
    [
      ["C", 579, 743, 606, 744, 606, 765],
      ["V", 800],
    ],
    0.25,
  );
  add(
    "experiments-fine",
    "experiments",
    5,
    0.65,
    [["C", 785, 652, 794, 668, 825, 679]],
    0.35,
  );
  add(
    "experiments-tip",
    "experiments",
    6,
    0.8,
    [
      ["C", 879, 705, 884, 733, 884, 751],
      ["L", 874, 764],
    ],
    0.3,
  );
  return traces;
}
