import type { CSSProperties } from 'react';
import type { StageFrame } from '../data/layoutTypes';
import type { Point } from '../lib/geometry';
import { stagePosition } from '../lib/geometry';
import { ArrowIcon } from './ArrowIcon';

type Props = {
  at: Point;
  r: number;
  frame: StageFrame;
  onClick: () => void;
};

/** Circular control sitting on the trunk; its rings are drawn by the tree SVG. */
export function ScrollControl({ at, r, frame, onClick }: Props) {
  const style = { ...stagePosition(at, frame.width, frame.height), '--r': r } as CSSProperties;
  return (
    <div className="scroll-control" style={style}>
      <button type="button" className="scroll-control__button" onClick={onClick} aria-label="Scroll to tools and skills">
        <ArrowIcon direction="down" />
      </button>
      <span className="scroll-control__label" aria-hidden="true">
        Scroll
        <br />
        to explore
      </span>
    </div>
  );
}
