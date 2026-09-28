import type { CSSProperties } from 'react';
import type { NodeSpec, StageFrame } from '../data/layoutTypes';
import type { Skill } from '../data/skills';
import { stagePosition } from '../lib/geometry';
import { ArrowIcon } from './ArrowIcon';
import { SkillIcon } from './SkillIcon';

type Props = {
  node: NodeSpec;
  frame: StageFrame;
  skill: Skill;
  onActive: (id: string | null) => void;
};

export function SkillNode({ node, frame, skill, onActive }: Props) {
  const style = {
    ...stagePosition(node.at, frame.width, frame.height),
    '--r': node.r,
    '--ring': node.ring,
  } as CSSProperties;

  return (
    <a
      className={`snode snode--${node.label}`}
      href={skill.href}
      style={style}
      onPointerEnter={() => onActive(node.id)}
      onPointerLeave={() => onActive(null)}
      onFocus={() => onActive(node.id)}
      onBlur={() => onActive(null)}
    >
      <span className="snode__disc">
        <SkillIcon icon={skill.icon} />
      </span>
      <span className="snode__label">
        <h3 className="snode__title">{skill.title}</h3>
        <span className="snode__desc">{skill.description}</span>
        <span className="action-dot" aria-hidden="true">
          <ArrowIcon />
        </span>
      </span>
    </a>
  );
}
