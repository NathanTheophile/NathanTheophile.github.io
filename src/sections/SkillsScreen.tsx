import { useMemo, useState, type CSSProperties } from 'react';
import { Editorial, TagList } from '../components/Editorial';
import { RootsGraphic } from '../components/RootsGraphic';
import { SkillNode } from '../components/SkillNode';
import { desktopRoots, mobileRoots } from '../data/rootsLayout';
import { skillsCopy } from '../data/site';
import { skillById } from '../data/skills';
import { buildRoots } from '../lib/graph';
import type { LayoutMode } from '../lib/useLayoutMode';
import { useReveal } from '../lib/useReveal';

export function SkillsScreen({ mode, active }: { mode: LayoutMode; active: boolean }) {
  const layout = mode === 'mobile' ? mobileRoots : desktopRoots;
  const geometry = useMemo(() => buildRoots(layout), [layout]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const revealed = useReveal(active);

  return (
    <section id="tools" className={revealed ? 'screen screen--dark is-revealed' : 'screen screen--dark'} aria-labelledby="tools-title">
      <div className="stage">
        <RootsGraphic layout={layout} geometry={geometry} activeId={activeId} />
        <Editorial copy={skillsCopy} headingId="tools-title" headingLevel={2} />
        <div className="nodes" role="list" aria-label="Tools and skills">
          {layout.nodes.map((node, i) => {
            const skill = skillById.get(node.id);
            if (!skill) return null;
            return (
              <div role="listitem" key={node.id} className="reveal" style={{ '--i': i } as CSSProperties}>
                <SkillNode node={node} frame={layout.frame} skill={skill} onActive={setActiveId} />
              </div>
            );
          })}
        </div>
        <TagList tags={skillsCopy.tags} className="tags--skills" />
      </div>
    </section>
  );
}
