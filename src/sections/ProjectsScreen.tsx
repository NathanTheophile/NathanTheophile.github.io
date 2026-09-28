import { useMemo, useState, type CSSProperties } from 'react';
import { Editorial, TagList } from '../components/Editorial';
import { SectionIndex } from '../components/Header';
import { ProjectNode } from '../components/ProjectNode';
import { ScrollControl } from '../components/ScrollControl';
import { TreeGraphic } from '../components/TreeGraphic';
import { projectById } from '../data/projects';
import { projectsCopy } from '../data/site';
import { desktopTree, mobileTree } from '../data/treeLayout';
import { buildTree } from '../lib/graph';
import type { LayoutMode } from '../lib/useLayoutMode';
import { useReveal } from '../lib/useReveal';

type Props = {
  mode: LayoutMode;
  activeScreen: number;
  onNavigate: (screen: number) => void;
};

export function ProjectsScreen({ mode, activeScreen, onNavigate }: Props) {
  const layout = mode === 'mobile' ? mobileTree : desktopTree;
  const geometry = useMemo(() => buildTree(layout), [layout]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const revealed = useReveal(activeScreen === 0);

  return (
    <section id="projects" className={revealed ? 'screen screen--light is-revealed' : 'screen screen--light'} aria-labelledby="projects-title">
      <div className="stage">
        <TreeGraphic layout={layout} geometry={geometry} activeId={activeId} />
        <Editorial copy={projectsCopy} headingId="projects-title" headingLevel={1} />
        <div className="nodes" role="list" aria-label="Projects">
          {layout.nodes.map((node, i) => {
            const project = projectById.get(node.id);
            if (!project) return null;
            return (
              <div role="listitem" key={node.id} className="reveal" style={{ '--i': i } as CSSProperties}>
                <ProjectNode node={node} frame={layout.frame} project={project} onActive={setActiveId} />
              </div>
            );
          })}
        </div>
        <ScrollControl at={layout.scroll.at} r={layout.scroll.r} frame={layout.frame} onClick={() => onNavigate(1)} />
        <SectionIndex activeScreen={activeScreen} onNavigate={onNavigate} />
        <TagList tags={projectsCopy.tags} className="tags--projects" />
      </div>
    </section>
  );
}
