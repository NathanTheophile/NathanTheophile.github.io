import type { CSSProperties } from 'react';
import type { NodeSpec, StageFrame } from '../data/layoutTypes';
import type { Project } from '../data/projects';
import { stagePosition } from '../lib/geometry';
import { ArrowIcon } from './ArrowIcon';
import { Thumbnail } from './Thumbnail';

type Props = {
  node: NodeSpec;
  frame: StageFrame;
  project: Project;
  onActive: (id: string | null) => void;
};

/** DOM part of a project node: thumbnail disc, label and action, placed from the same stage data as the SVG. */
export function ProjectNode({ node, frame, project, onActive }: Props) {
  const style = {
    ...stagePosition(node.at, frame.width, frame.height),
    '--r': node.r,
    '--ring': node.ring,
  } as CSSProperties;

  return (
    <a
      className={`pnode pnode--${node.label}`}
      href={project.href}
      style={style}
      onPointerEnter={() => onActive(node.id)}
      onPointerLeave={() => onActive(null)}
      onFocus={() => onActive(node.id)}
      onBlur={() => onActive(null)}
    >
      <span className="pnode__disc">
        <Thumbnail project={project} />
      </span>
      <span className="pnode__label">
        <h3 className="pnode__title">{project.title}</h3>
        <span className="pnode__desc">{project.description}</span>
        <span className="action-dot" aria-hidden="true">
          <ArrowIcon />
        </span>
      </span>
    </a>
  );
}
