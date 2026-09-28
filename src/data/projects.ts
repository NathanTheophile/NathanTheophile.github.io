// Project content. Placement on the tree lives in `treeLayout.ts`, keyed by `id`.
// Placeholder entries: replace title / description / href, and set `image`
// (e.g. '/projects/my-shot.webp' from /public) to swap the generated thumbnail.

export type ThumbnailVariant = 'corridor' | 'landscape' | 'grid' | 'nebula' | 'interior';

export type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  imageAlt?: string;
  placeholder: ThumbnailVariant;
};

export const projects: Project[] = [
  {
    id: 'recent',
    title: 'Recent Project',
    description: 'Real-time environment and lighting exploration.',
    href: '#project-recent',
    placeholder: 'corridor',
  },
  {
    id: 'prototype',
    title: 'Game Prototype',
    description: 'Core mechanics and systems design.',
    href: '#project-prototype',
    placeholder: 'landscape',
  },
  {
    id: 'gameplay',
    title: 'Gameplay System',
    description: 'Tools, AI, and player interaction.',
    href: '#project-gameplay',
    placeholder: 'grid',
  },
  {
    id: 'shader',
    title: 'Shader Experiment',
    description: 'Real-time rendering and visual research.',
    href: '#project-shader',
    placeholder: 'nebula',
  },
  {
    id: 'featured',
    title: 'Featured Work',
    description: 'A closer look at a selected project.',
    href: '#project-featured',
    placeholder: 'interior',
  },
];

export const projectById = new Map(projects.map((p) => [p.id, p]));
