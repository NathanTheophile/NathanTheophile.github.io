// Global identity, navigation and editorial copy.
// Placeholder copy: edit freely, nothing else depends on the wording.

export type NavItem = {
  id: string;
  label: string;
  /** Long label used in the vertical section index. */
  indexLabel: string;
  /** Screen index for in-page targets; absent for external / placeholder anchors. */
  screen?: number;
  href: string;
};

export const identity = {
  name: 'Nathan Theophile',
  role: 'Gameplay Programming & Technical Development',
};

export const navItems: NavItem[] = [
  { id: 'projects', label: 'Projects', indexLabel: 'Projects', screen: 0, href: '#projects' },
  { id: 'tools', label: 'Tools', indexLabel: 'Tools & Skills', screen: 1, href: '#tools' },
  // TODO: point to the real About / Contact pages once they exist.
  { id: 'about', label: 'About', indexLabel: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', indexLabel: 'Contact', href: '#contact' },
];

export type ScreenCopy = {
  number: string;
  marker: string;
  title: [string, string];
  text: string[];
  cta: { label: string; href: string };
  tags: string[];
};

export const projectsCopy: ScreenCopy = {
  number: '01',
  marker: 'Projects',
  title: ['Ideas', 'in Motion.'],
  text: [
    'Real-time graphics, gameplay systems, and interactive experiments.',
    'A selection of recent work exploring play, tech, and visual systems.',
  ],
  cta: { label: 'Explore projects', href: '#projects' },
  tags: ['Games', 'Real-time graphics', 'Interactive systems', 'Technical art'],
};

export const skillsCopy: ScreenCopy = {
  number: '02',
  marker: 'Tools & Skills',
  title: ['Built on', 'a Solid System.'],
  text: [
    'Engines, tools, and technical skills that power the work above.',
    'A foundation for creating, experimenting, and shipping interactive experiences.',
  ],
  cta: { label: 'Explore tools', href: '#tools' },
  tags: ['Engines', 'Programming', 'Graphics', 'Tools', 'Workflow', 'And more'],
};
