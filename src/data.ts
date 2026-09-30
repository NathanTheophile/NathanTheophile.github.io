import { savedContent } from "./content";
import type { PortfolioContent, Media } from "./content";

export type Point = { x: number; y: number };
export type Placement = Point & { r: number; label: Point; width: number };
export type Item = {
  id: string;
  title: string;
  description: string;
  mark: string;
  thumbnailMedia?: Media;
  previewMedia?: Media;
  desktop: Placement;
  mobile: Placement;
};

// Layout stays in code; editable content is loaded from content.json.
export const identity = savedContent.identity;
const projectLayout: Omit<Item, "title" | "description">[] = [
  {
    id: "recent",
    mark: "hall",
    desktop: { x: 508, y: 170, r: 57, label: { x: 578, y: 132 }, width: 180 },
    mobile: { x: 285, y: 327, r: 37, label: { x: 237, y: 372 }, width: 145 },
  },
  {
    id: "prototype",
    mark: "landscape",
    desktop: { x: 350, y: 288, r: 54, label: { x: 346, y: 347 }, width: 175 },
    mobile: { x: 89, y: 391, r: 38, label: { x: 27, y: 438 }, width: 152 },
  },
  {
    id: "gameplay",
    mark: "grid",
    desktop: { x: 742, y: 288, r: 58, label: { x: 816, y: 254 }, width: 164 },
    mobile: { x: 290, y: 512, r: 39, label: { x: 227, y: 560 }, width: 158 },
  },
  {
    id: "shader",
    mark: "shader",
    desktop: { x: 242, y: 534, r: 57, label: { x: 239, y: 601 }, width: 180 },
    mobile: { x: 90, y: 615, r: 40, label: { x: 25, y: 665 }, width: 172 },
  },
  {
    id: "featured",
    mark: "room",
    desktop: { x: 746, y: 542, r: 64, label: { x: 830, y: 508 }, width: 159 },
    mobile: { x: 288, y: 697, r: 41, label: { x: 233, y: 747 }, width: 149 },
  },
];

// Technology names mirror the concept; descriptions are editable placeholders.
const skillLayout: Omit<Item, "title" | "description">[] = [
  {
    id: "unity",
    mark: "unity",
    desktop: { x: 105, y: 442, r: 33, label: { x: 153, y: 423 }, width: 170 },
    mobile: { x: 40, y: 321, r: 23, label: { x: 72, y: 305 }, width: 113 },
  },
  {
    id: "unreal",
    mark: "unreal",
    desktop: { x: 355, y: 442, r: 33, label: { x: 402, y: 415 }, width: 165 },
    mobile: { x: 232, y: 321, r: 23, label: { x: 265, y: 305 }, width: 115 },
  },
  {
    id: "glsl",
    mark: "glsl",
    desktop: { x: 704, y: 378, r: 33, label: { x: 751, y: 348 }, width: 165 },
    mobile: { x: 40, y: 402, r: 23, label: { x: 72, y: 386 }, width: 113 },
  },
  {
    id: "csharp",
    mark: "csharp",
    desktop: { x: 123, y: 581, r: 32, label: { x: 168, y: 555 }, width: 151 },
    mobile: { x: 232, y: 402, r: 23, label: { x: 265, y: 386 }, width: 115 },
  },
  {
    id: "cpp",
    mark: "cpp",
    desktop: { x: 369, y: 597, r: 34, label: { x: 416, y: 569 }, width: 168 },
    mobile: { x: 40, y: 483, r: 23, label: { x: 72, y: 467 }, width: 113 },
  },
  {
    id: "hlsl",
    mark: "hlsl",
    desktop: { x: 655, y: 541, r: 33, label: { x: 701, y: 514 }, width: 168 },
    mobile: { x: 232, y: 483, r: 23, label: { x: 265, y: 467 }, width: 115 },
  },
  {
    id: "git",
    mark: "git",
    desktop: { x: 842, y: 617, r: 32, label: { x: 887, y: 591 }, width: 109 },
    mobile: { x: 40, y: 564, r: 23, label: { x: 72, y: 548 }, width: 113 },
  },
  {
    id: "webgl",
    mark: "webgl",
    desktop: { x: 156, y: 724, r: 34, label: { x: 207, y: 697 }, width: 159 },
    mobile: { x: 232, y: 564, r: 23, label: { x: 265, y: 548 }, width: 115 },
  },
  {
    id: "tools",
    mark: "tools",
    desktop: { x: 399, y: 765, r: 34, label: { x: 446, y: 739 }, width: 145 },
    mobile: { x: 40, y: 645, r: 23, label: { x: 72, y: 629 }, width: 113 },
  },
  {
    id: "workflow",
    mark: "workflow",
    desktop: { x: 625, y: 711, r: 33, label: { x: 670, y: 684 }, width: 177 },
    mobile: { x: 232, y: 645, r: 23, label: { x: 265, y: 629 }, width: 115 },
  },
  {
    id: "experiments",
    mark: "experiments",
    desktop: { x: 841, y: 783, r: 33, label: { x: 888, y: 756 }, width: 109 },
    mobile: { x: 40, y: 726, r: 23, label: { x: 72, y: 710 }, width: 135 },
  },
];

export function projectContent(content: PortfolioContent): Item[] {
  return projectLayout.map((item) => ({ ...item, ...content.projects[item.id],
    thumbnailMedia: content.projects[item.id].thumbnailMedia ?? item.thumbnailMedia,
    previewMedia: content.projects[item.id].previewMedia ?? item.previewMedia }));
}
export function skillContent(content: PortfolioContent): Item[] {
  return skillLayout.map((item) => ({ ...item, ...content.skills[item.id],
    thumbnailMedia: content.skills[item.id].thumbnailMedia ?? item.thumbnailMedia,
    previewMedia: content.skills[item.id].previewMedia ?? item.previewMedia }));
}
export const projects = projectContent(savedContent);
export const skills = skillContent(savedContent);

// Compact phones keep the same readable type and touch targets, with shorter spacing.
export function mobileProjects(height: number, items = projects): Item[] {
  const spacing = Math.min(1, (height - 300) / 544);
  return items.map((item) => {
    const p = item.mobile;
    const y = 300 + (p.y - 300) * spacing;
    const r = height < 780 ? 32 : p.r;
    return {
      ...item,
      mobile: { ...p, y, r, label: { ...p.label, y: y + r + 8 } },
    };
  });
}

export function mobileSkills(height: number, items = skills): Item[] {
  const first = 321 - Math.min(9, Math.max(0, 844 - height) * 0.05);
  const spacing = Math.min(81, (height - 53 - first) / 5);
  return items.map((item, i) => {
    const y = first + Math.floor(i / 2) * spacing;
    return {
      ...item,
      mobile: { ...item.mobile, y, label: { ...item.mobile.label, y: y - 16 } },
    };
  });
}
