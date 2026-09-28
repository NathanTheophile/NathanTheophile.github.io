import type { MouseEvent } from 'react';
import { identity, navItems, type NavItem } from '../data/site';

type Props = {
  activeScreen: number;
  onNavigate: (screen: number) => void;
};

export function handleNavClick(item: NavItem, onNavigate: (screen: number) => void) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (item.screen === undefined) return;
    e.preventDefault();
    onNavigate(item.screen);
  };
}

function Monogram() {
  return (
    <svg className="monogram" viewBox="0 0 40 28" aria-hidden="true">
      <path d="M2 26L11 2L15 12M15 26V2L27 26V2M31 2H39M35 2V26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="miter" />
    </svg>
  );
}

export function Header({ activeScreen, onNavigate }: Props) {
  const theme = activeScreen === 1 ? 'dark' : 'light';
  return (
    <header className="site-header" data-theme={theme}>
      <div className="site-header__inner">
        <a
          className="brand"
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(0);
          }}
        >
          <Monogram />
          <span className="brand__text">
            <span className="brand__name">{identity.name}</span>
            <span className="brand__role">{identity.role}</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {navItems.map((item) => {
              const current = item.screen === activeScreen;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={current ? 'is-current' : undefined}
                    aria-current={current ? 'true' : undefined}
                    onClick={handleNavClick(item, onNavigate)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** Vertical numbered index shown at the bottom-left of the projects screen. */
export function SectionIndex({ activeScreen, onNavigate }: Props) {
  return (
    <nav className="section-index" aria-label="Sections">
      <ol>
        {navItems.map((item, i) => (
          <li key={item.id} className={item.screen === activeScreen ? 'is-current' : undefined}>
            <a href={item.href} onClick={handleNavClick(item, onNavigate)}>
              <span className="section-index__num">{String(i + 1).padStart(2, '0')}</span>
              {item.indexLabel}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
