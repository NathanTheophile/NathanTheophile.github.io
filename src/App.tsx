import { useRef } from 'react';
import { Header } from './components/Header';
import { usePager } from './lib/usePager';
import { useLayoutMode } from './lib/useLayoutMode';
import { ProjectsScreen } from './sections/ProjectsScreen';
import { SkillsScreen } from './sections/SkillsScreen';

const SCREEN_COUNT = 2;

export default function App() {
  const scrollerRef = useRef<HTMLElement>(null);
  const { index, goTo } = usePager(scrollerRef, SCREEN_COUNT);
  const mode = useLayoutMode();

  return (
    <>
      <Header activeScreen={index} onNavigate={goTo} />
      <main ref={scrollerRef} className="viewport-scroller" data-mode={mode}>
        <ProjectsScreen mode={mode} activeScreen={index} onNavigate={goTo} />
        <SkillsScreen mode={mode} active={index === 1} />
      </main>
    </>
  );
}
