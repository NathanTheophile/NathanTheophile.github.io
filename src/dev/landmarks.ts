import { referenceAnchors } from "../artwork/anchors";
import type { Landmark } from "./analysis";

// Canonical reference coordinates. These are drawing landmarks, not inferred node centers.
export const referenceLandmarks: Landmark[] = [
  ...referenceAnchors.projects.map((point) => ({ name: `Jonction ${point.id}`, x: point.x, y: point.y, section: "projects" as const })),
  ...referenceAnchors.tools.map((point) => ({ name: `Jonction ${point.id}`, x: point.x, y: point.y, section: "tools" as const })),
  { name: "Tronc / shader", section: "projects", x: 505, y: 670 },
  { name: "Tronc / featured", section: "projects", x: 508, y: 698 },
  { name: "Couronne gauche", section: "projects", x: 407, y: 557 },
  { name: "Bifurcation haute", section: "projects", x: 526, y: 375 },
  { name: "Bifurcation gameplay", section: "projects", x: 656, y: 397 },
  { name: "Faisceau central", section: "tools", x: 505, y: 130 },
  { name: "Racines gauche / coude", section: "tools", x: 433, y: 270 },
  { name: "Racines droite / coude", section: "tools", x: 610, y: 290 },
];
