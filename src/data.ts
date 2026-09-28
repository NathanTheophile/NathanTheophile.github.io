export type Point = { x: number; y: number };
export type Placement = Point & { r: number; label: Point; width: number };
export type Item = {
  id: string;
  title: string;
  description: string;
  mark: string;
  desktop: Placement;
  mobile: Placement;
};

// Content and positions live here. Replace these placeholders one at a time.
export const identity = {
  name: "Alex Park",
  role: "Technical Art & Game Development",
  email: "hello@example.com",
};
export const projects: Item[] = [
  {
    id: "recent",
    title: "Recent Project",
    description: "Real-time environment\nand lighting exploration.",
    mark: "hall",
    desktop: { x: 508, y: 170, r: 57, label: { x: 578, y: 132 }, width: 180 },
    mobile: { x: 285, y: 327, r: 37, label: { x: 237, y: 372 }, width: 145 },
  },
  {
    id: "prototype",
    title: "Game Prototype",
    description: "Core mechanics\nand systems design.",
    mark: "landscape",
    desktop: { x: 350, y: 288, r: 54, label: { x: 346, y: 347 }, width: 175 },
    mobile: { x: 89, y: 391, r: 38, label: { x: 27, y: 438 }, width: 152 },
  },
  {
    id: "gameplay",
    title: "Gameplay System",
    description: "Tools, AI, and\nplayer interaction.",
    mark: "grid",
    desktop: { x: 742, y: 288, r: 58, label: { x: 816, y: 254 }, width: 164 },
    mobile: { x: 290, y: 512, r: 39, label: { x: 227, y: 560 }, width: 158 },
  },
  {
    id: "shader",
    title: "Shader Experiment",
    description: "Real-time rendering\nand visual research.",
    mark: "shader",
    desktop: { x: 242, y: 534, r: 57, label: { x: 239, y: 601 }, width: 180 },
    mobile: { x: 90, y: 615, r: 40, label: { x: 25, y: 665 }, width: 172 },
  },
  {
    id: "featured",
    title: "Featured Work",
    description: "A closer look at\na selected project.",
    mark: "room",
    desktop: { x: 746, y: 542, r: 64, label: { x: 830, y: 508 }, width: 159 },
    mobile: { x: 288, y: 697, r: 41, label: { x: 233, y: 747 }, width: 149 },
  },
];

// Technology names mirror the concept; descriptions are editable placeholders.
export const skills: Item[] = [
  {
    id: "unity",
    title: "Unity",
    description: "Real-time systems\nand tooling.",
    mark: "unity",
    desktop: { x: 105, y: 442, r: 33, label: { x: 153, y: 423 }, width: 170 },
    mobile: { x: 40, y: 321, r: 23, label: { x: 72, y: 305 }, width: 113 },
  },
  {
    id: "unreal",
    title: "Unreal",
    description: "High-fidelity real-time\nexperiences.",
    mark: "unreal",
    desktop: { x: 355, y: 442, r: 33, label: { x: 402, y: 415 }, width: 165 },
    mobile: { x: 232, y: 321, r: 23, label: { x: 265, y: 305 }, width: 115 },
  },
  {
    id: "glsl",
    title: "GLSL",
    description: "Rendering, shaders\nand visual effects.",
    mark: "glsl",
    desktop: { x: 704, y: 378, r: 33, label: { x: 751, y: 348 }, width: 165 },
    mobile: { x: 40, y: 402, r: 23, label: { x: 72, y: 386 }, width: 113 },
  },
  {
    id: "csharp",
    title: "C#",
    description: "Gameplay systems\nand tools.",
    mark: "csharp",
    desktop: { x: 123, y: 581, r: 32, label: { x: 168, y: 555 }, width: 151 },
    mobile: { x: 232, y: 402, r: 23, label: { x: 265, y: 386 }, width: 115 },
  },
  {
    id: "cpp",
    title: "C++",
    description: "Engine-level systems\nand performance.",
    mark: "cpp",
    desktop: { x: 369, y: 597, r: 34, label: { x: 416, y: 569 }, width: 168 },
    mobile: { x: 40, y: 483, r: 23, label: { x: 72, y: 467 }, width: 113 },
  },
  {
    id: "hlsl",
    title: "HLSL",
    description: "Real-time graphics\non modern pipelines.",
    mark: "hlsl",
    desktop: { x: 655, y: 541, r: 33, label: { x: 701, y: 514 }, width: 168 },
    mobile: { x: 232, y: 483, r: 23, label: { x: 265, y: 467 }, width: 115 },
  },
  {
    id: "git",
    title: "Git",
    description: "Version control\nand collaboration.",
    mark: "git",
    desktop: { x: 842, y: 617, r: 32, label: { x: 887, y: 591 }, width: 109 },
    mobile: { x: 40, y: 564, r: 23, label: { x: 72, y: 548 }, width: 113 },
  },
  {
    id: "webgl",
    title: "WebGL",
    description: "Browser-based\nexperiments.",
    mark: "webgl",
    desktop: { x: 156, y: 724, r: 34, label: { x: 207, y: 697 }, width: 159 },
    mobile: { x: 232, y: 564, r: 23, label: { x: 265, y: 548 }, width: 115 },
  },
  {
    id: "tools",
    title: "Tools",
    description: "DCC, debugging\nand productivity.",
    mark: "tools",
    desktop: { x: 399, y: 765, r: 34, label: { x: 446, y: 739 }, width: 145 },
    mobile: { x: 40, y: 645, r: 23, label: { x: 72, y: 629 }, width: 113 },
  },
  {
    id: "workflow",
    title: "Workflow",
    description: "Iteration, organization\nand project structure.",
    mark: "workflow",
    desktop: { x: 625, y: 711, r: 33, label: { x: 670, y: 684 }, width: 177 },
    mobile: { x: 232, y: 645, r: 23, label: { x: 265, y: 629 }, width: 115 },
  },
  {
    id: "experiments",
    title: "Experiments",
    description: "Ongoing research\nand side projects.",
    mark: "experiments",
    desktop: { x: 841, y: 783, r: 33, label: { x: 888, y: 756 }, width: 109 },
    mobile: { x: 40, y: 726, r: 23, label: { x: 72, y: 710 }, width: 135 },
  },
];

// Compact phones keep the same readable type and touch targets, with shorter spacing.
export function mobileProjects(height: number): Item[] {
  const spacing = Math.min(1, (height - 300) / 544);
  return projects.map((item) => {
    const p = item.mobile;
    const y = 300 + (p.y - 300) * spacing;
    const r = height < 780 ? 32 : p.r;
    return {
      ...item,
      mobile: { ...p, y, r, label: { ...p.label, y: y + r + 8 } },
    };
  });
}

export function mobileSkills(height: number): Item[] {
  const first = 321 - Math.min(9, Math.max(0, 844 - height) * 0.05);
  const spacing = Math.min(81, (height - 53 - first) / 5);
  return skills.map((item, i) => {
    const y = first + Math.floor(i / 2) * spacing;
    return {
      ...item,
      mobile: { ...item.mobile, y, label: { ...item.mobile.label, y: y - 16 } },
    };
  });
}
