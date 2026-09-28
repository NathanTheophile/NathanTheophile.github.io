export function ArrowIcon({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  return (
    <svg className={`arrow-icon arrow-icon--${direction}`} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 8H13M9 4L13 8L9 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
