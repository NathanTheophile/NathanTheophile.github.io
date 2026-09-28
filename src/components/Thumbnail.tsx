import type { ReactNode } from 'react';
import type { Project, ThumbnailVariant } from '../data/projects';

// Lightweight vector placeholders shown until a project provides a real `image`.
const placeholders: Record<ThumbnailVariant, ReactNode> = {
  corridor: (
    <>
      <defs>
        <radialGradient id="th-corridor" cx="50%" cy="52%" r="60%">
          <stop offset="0" stopColor="#b9c2cc" />
          <stop offset="0.25" stopColor="#4c535c" />
          <stop offset="1" stopColor="#101317" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#th-corridor)" />
      <path d="M0 0L38 38V66L0 100ZM100 0L62 38V66L100 100Z" fill="#0d1014" opacity="0.55" />
      <path d="M38 38H62V66H38Z" fill="#d9e1e8" opacity="0.35" />
      <path d="M44 44H56V60H44Z" fill="#eef3f7" opacity="0.7" />
      <path d="M0 100L38 66H62L100 100Z" fill="#23282e" />
    </>
  ),
  landscape: (
    <>
      <defs>
        <linearGradient id="th-landscape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa6ba" />
          <stop offset="0.55" stopColor="#c9d3da" />
          <stop offset="0.56" stopColor="#56634f" />
          <stop offset="1" stopColor="#2c3528" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#th-landscape)" />
      <path d="M0 58L22 46L40 54L60 40L80 50L100 44V60H0Z" fill="#6f7d87" opacity="0.7" />
      <path d="M44 38H56V56H44ZM48 30H52V38H48Z" fill="#3a4148" />
      <path d="M0 70Q50 62 100 72V100H0Z" fill="#3b4636" />
    </>
  ),
  grid: (
    <>
      <defs>
        <radialGradient id="th-grid" cx="50%" cy="45%" r="65%">
          <stop offset="0" stopColor="#2c4260" />
          <stop offset="1" stopColor="#0a0f18" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#th-grid)" />
      <path
        d="M10 60L50 40L90 60M20 70L50 55L80 70M50 40V90M30 50L70 80M70 50L30 80"
        stroke="#7fa3d1"
        strokeWidth="0.6"
        fill="none"
        opacity="0.6"
      />
      <circle cx="50" cy="40" r="2" fill="#cfe2ff" />
      <circle cx="62" cy="47" r="1.2" fill="#9cc0ef" />
    </>
  ),
  nebula: (
    <>
      <defs>
        <linearGradient id="th-nebula" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#10103a" />
          <stop offset="0.5" stopColor="#3b3fb0" />
          <stop offset="1" stopColor="#0d0f2a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#th-nebula)" />
      <path d="M-5 72Q40 50 105 30L105 42Q45 58 -5 80Z" fill="#8a7bff" opacity="0.55" />
      <path d="M-5 70Q45 52 105 34" stroke="#e3dcff" strokeWidth="1.4" fill="none" opacity="0.9" />
      <path d="M10 88Q50 70 100 60" stroke="#6ec4ff" strokeWidth="0.8" fill="none" opacity="0.6" />
    </>
  ),
  interior: (
    <>
      <defs>
        <linearGradient id="th-interior" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d4148" />
          <stop offset="1" stopColor="#15181c" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#th-interior)" />
      <path d="M58 18H86V56H58Z" fill="#c8d0d6" opacity="0.55" />
      <path d="M72 18V56M58 37H86" stroke="#2a2e33" strokeWidth="1" />
      <path d="M8 66H64V74H8Z" fill="#6d6a66" />
      <path d="M14 58H44V66H14Z" fill="#8a857e" />
      <path d="M0 80H100V100H0Z" fill="#221f1c" />
    </>
  ),
};

export function Thumbnail({ project }: { project: Project }) {
  if (project.image) {
    return <img className="thumb" src={project.image} alt={project.imageAlt ?? ''} loading="lazy" decoding="async" />;
  }
  return (
    <svg className="thumb" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {placeholders[project.placeholder]}
    </svg>
  );
}
