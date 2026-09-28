import type { ReactNode } from 'react';
import type { SkillIconId } from '../data/skills';

// Simplified symbolic marks (24x24), drawn inline to avoid an icon dependency.
const icons: Record<SkillIconId, ReactNode> = {
  unity: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 3.2L19.6 7.6V16.4L12 20.8L4.4 16.4V7.6Z" />
      <path d="M12 12L12 20.8M12 12L4.4 7.6M12 12L19.6 7.6" />
    </g>
  ),
  unreal: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M8.6 8.2V13.2Q8.6 16 11.4 16Q13.4 16 14.2 14.6M15.4 7.6V16.6" strokeLinecap="round" />
    </g>
  ),
  glsl: <path d="M4 6.5H20L12 19Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  csharp: (
    <>
      <path d="M12 2.6L20.2 7.3V16.7L12 21.4L3.8 16.7V7.3Z" fill="#f2f4f7" />
      <text x="11.6" y="15.2" textAnchor="middle" fontSize="8.4" fontWeight="800" fill="#1d2229">
        C#
      </text>
    </>
  ),
  cpp: (
    <>
      <path d="M12 2.6L20.2 7.3V16.7L12 21.4L3.8 16.7V7.3Z" fill="#3a78d4" />
      <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="800" fill="#ffffff">
        C++
      </text>
    </>
  ),
  hlsl: (
    <g fill="currentColor">
      <path d="M5 6.2L11.2 5.3V11.3H5ZM12.4 5.1L19 4.2V11.3H12.4ZM5 12.6H11.2V18.6L5 17.7ZM12.4 12.6H19V19.8L12.4 18.8Z" />
    </g>
  ),
  git: (
    <>
      <path d="M12 2.4L21.6 12L12 21.6L2.4 12Z" fill="#e4543a" />
      <g stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M9.2 7.8L14.8 13.4M11.6 10.2V16" />
      </g>
      <g fill="#fff">
        <circle cx="11.6" cy="16" r="1.4" />
        <circle cx="14.8" cy="13.4" r="1.4" />
      </g>
    </>
  ),
  blueprint: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <rect x="3.6" y="5" width="6.4" height="5" rx="1" />
      <rect x="14" y="13.6" width="6.4" height="5" rx="1" />
      <path d="M10 7.5H12.4Q13.6 7.5 13.6 8.7V14.8Q13.6 16.1 14 16.1" />
      <circle cx="17.2" cy="7.5" r="1.3" />
      <path d="M10 7.5H15.9" strokeDasharray="1.2 1.2" />
    </g>
  ),
  workflow: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 4L20 8L12 12L4 8Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 12L12 16L20 12" />
      <path d="M4 16L12 20L20 16" />
    </g>
  ),
  tools: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18L13.4 10.6M13.4 10.6A3.6 3.6 0 1 0 17.6 5.4L15.6 7.4L16.6 8.4L18.6 6.4A3.6 3.6 0 0 1 13.4 10.6" />
      <path d="M18 18L8.6 8.6M8.6 8.6L6.8 6.8L5 7.4L4.6 5.6L6.4 4.4L7.6 6" />
    </g>
  ),
  experiments: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M9.6 3.6H14.4M10.4 3.6V9.4L5.2 18.2Q4.6 19.6 6.2 19.6H17.8Q19.4 19.6 18.8 18.2L13.6 9.4V3.6" />
      <path d="M7.4 15H16.6L18.6 18.6H5.4Z" fill="currentColor" fillOpacity="0.25" stroke="none" />
    </g>
  ),
};

export function SkillIcon({ icon }: { icon: SkillIconId }) {
  return (
    <svg className="skill-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[icon]}
    </svg>
  );
}
