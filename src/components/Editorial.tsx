import type { ScreenCopy } from '../data/site';
import { ArrowIcon } from './ArrowIcon';

type Props = {
  copy: ScreenCopy;
  headingId: string;
  headingLevel: 1 | 2;
};

/** Left editorial column: section marker, headline, intro text and CTA. */
export function Editorial({ copy, headingId, headingLevel }: Props) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="editorial">
      <p className="marker">
        <span className="marker__number">{copy.number}</span>
        <span className="marker__rule" aria-hidden="true" />
        <span>{copy.marker}</span>
      </p>
      <Heading id={headingId} className="headline">
        {copy.title[0]}
        <br />
        {copy.title[1]}
      </Heading>
      <p className="intro">
        {copy.text.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      <a className="cta" href={copy.cta.href}>
        <span>{copy.cta.label}</span>
        <ArrowIcon />
      </a>
    </div>
  );
}

export function TagList({ tags, className }: { tags: string[]; className: string }) {
  return (
    <ul className={`tags ${className}`} aria-label="Focus areas">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
