// Tool / skill content. Placement on the roots lives in `rootsLayout.ts`, keyed by `id`.
// Placeholder descriptions: adjust to your actual stack.

export type SkillIconId =
  | 'unity'
  | 'unreal'
  | 'glsl'
  | 'csharp'
  | 'cpp'
  | 'hlsl'
  | 'git'
  | 'blueprint'
  | 'workflow'
  | 'tools'
  | 'experiments';

export type Skill = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: SkillIconId;
};

export const skills: Skill[] = [
  { id: 'unity', title: 'Unity', description: 'Real-time development and tooling.', href: '#skill-unity', icon: 'unity' },
  { id: 'unreal', title: 'Unreal', description: 'High-fidelity real-time experiences.', href: '#skill-unreal', icon: 'unreal' },
  { id: 'glsl', title: 'GLSL', description: 'Rendering, shaders and visual effects.', href: '#skill-glsl', icon: 'glsl' },
  { id: 'csharp', title: 'C#', description: 'Gameplay systems and tools.', href: '#skill-csharp', icon: 'csharp' },
  { id: 'cpp', title: 'C++', description: 'Engine-level systems and performance.', href: '#skill-cpp', icon: 'cpp' },
  { id: 'hlsl', title: 'HLSL', description: 'Real-time graphics on modern pipelines.', href: '#skill-hlsl', icon: 'hlsl' },
  { id: 'git', title: 'Git', description: 'Version control and collaboration.', href: '#skill-git', icon: 'git' },
  { id: 'blueprint', title: 'Blueprints', description: 'Visual scripting and fast iteration.', href: '#skill-blueprint', icon: 'blueprint' },
  { id: 'workflow', title: 'Workflow', description: 'Iteration, organization and project structure.', href: '#skill-workflow', icon: 'workflow' },
  { id: 'tools', title: 'Tools', description: 'DCC, debugging and productivity.', href: '#skill-tools', icon: 'tools' },
  { id: 'experiments', title: 'Experiments', description: 'Ongoing research and side projects.', href: '#skill-experiments', icon: 'experiments' },
];

export const skillById = new Map(skills.map((s) => [s.id, s]));
