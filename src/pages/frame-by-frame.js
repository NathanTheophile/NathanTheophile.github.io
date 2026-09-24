import projects from '../data/projects.js';
import trunkUrl from '../images/Trunk.svg';
import treeUpperUrl from '../images/tree_upper.svg';
import leafUrl from '../images/Leaf.svg';
import devButtonUrl from '../images/Btn_Dev_Normal.svg';
import devButtonActiveUrl from '../images/Btn_Dev_Clicked.svg';
import artButtonUrl from '../images/Btn_Art_Normal.svg';
import artButtonActiveUrl from '../images/Btn_Art_Clicked.svg';
import creativityButtonUrl from '../images/Btn_Crea_Normal.svg';
import creativityButtonActiveUrl from '../images/Btn_Crea_Clicked.svg';

const copy = {
  fr: {
    eyebrow: 'PORTFOLIO / FRAME BY FRAME', title: 'Je construis des jeux qui se lisent en mouvement.',
    intro: 'Une sélection de projets, de systèmes et de recherches visuelles. Chaque repère ouvre une capture existante.',
    projects: 'Voir les projets', contact: 'Me contacter', capture: 'Captures sélectionnées', sequence: 'Séquence',
    previous: 'Capture précédente', next: 'Capture suivante', mediaFallback: 'Média indisponible',
    systems: 'Systèmes et pratiques', systemsLead: 'Un arbre de compétences à parcourir : développement, direction créative et art.',
    treePrevious: 'Système précédent', treeNext: 'Système suivant',
    skills: { development: ['Développement', 'Unity, Godot, Unreal et les systèmes qui rendent une action lisible.'], creativity: ['Créativité', 'Piliers d’expérience, prototypes et direction d’un projet.'], art: ['Art', 'UI, cohérence visuelle et mise en mouvement des informations.'] },
  },
  en: {
    eyebrow: 'PORTFOLIO / FRAME BY FRAME', title: 'I build games that read in motion.',
    intro: 'A selection of projects, systems and visual research. Every marker opens an existing capture.',
    projects: 'View projects', contact: 'Get in touch', capture: 'Selected captures', sequence: 'Sequence',
    previous: 'Previous capture', next: 'Next capture', mediaFallback: 'Media unavailable',
    systems: 'Systems and practices', systemsLead: 'A skill tree to explore: development, creative direction and art.',
    treePrevious: 'Previous system', treeNext: 'Next system',
    skills: { development: ['Development', 'Unity, Godot, Unreal and the systems that make an action readable.'], creativity: ['Creativity', 'Experience pillars, prototypes and project direction.'], art: ['Art', 'UI, visual consistency and information in motion.'] },
  },
};

const sourceProjects = ['calaveroll', 'echo-grove', 'aether-raid'].map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean);
const imageSource = (source) => String(source ?? '').replace('://imgur.com/', '://i.imgur.com/');
const mediaFor = (language) => sourceProjects.map((project) => ({ project, source: imageSource(project.media?.images?.[0] || project.banner), title: project.title[language], role: project.role[language], year: project.year })).filter((item) => item.source);

function mediaMarkup(item, index, language) {
  return `<figure class="frame-shot${index === 0 ? ' is-active' : ''}" data-frame-shot="${index}">
    <img src="${item.source}" alt="${item.title}" data-media-fallback loading="${index ? 'lazy' : 'eager'}" />
    <figcaption><span>${item.year} · ${item.role}</span><strong>${item.title}</strong></figcaption>
    <span class="frame-shot__fallback" aria-hidden="true">${copy[language].mediaFallback}</span>
  </figure>`;
}

export const renderHomePage = {
  pageId: 'skills',
  createContent: ({ language }) => {
    const t = copy[language] ?? copy.fr;
    const items = mediaFor(language);
    return `<main class="frame-page frame-page--reworked">
      <section class="frame-hero" aria-labelledby="frame-title">
        <div class="frame-hero__copy"><p class="frame-eyebrow"><span></span>${t.eyebrow}</p><h1 id="frame-title">${t.title}</h1><p>${t.intro}</p><div class="frame-hero__actions"><a class="frame-action" href="/projects/" data-nav-link="projects">${t.projects} <span aria-hidden="true">→</span></a><a class="frame-text-action" href="mailto:ntheophilelb@gmail.com">${t.contact} <span aria-hidden="true">↗</span></a></div></div>
        <div class="frame-reel" aria-label="${t.capture}"><div class="frame-reel__top"><span>${t.capture}</span><span data-frame-counter>01 / ${String(items.length).padStart(2, '0')}</span></div><div class="frame-reel__stage" data-frame-stage>${items.map((item, index) => mediaMarkup(item, index, language)).join('')}</div><div class="frame-reel__controls"><button type="button" data-frame-step="-1" aria-label="${t.previous}">←</button><div class="frame-reel__markers" role="tablist" aria-label="${t.sequence}">${items.map((item, index) => `<button class="frame-marker${index === 0 ? ' is-active' : ''}" type="button" role="tab" data-frame-marker="${index}" aria-selected="${index === 0}" aria-label="${item.title}"><span>${String(index + 1).padStart(2, '0')}</span><b>${item.title}</b></button>`).join('')}</div><button type="button" data-frame-step="1" aria-label="${t.next}">→</button></div></div>
      </section>
      <section class="skill-timeline" aria-labelledby="systems-title"><div class="skill-timeline__head"><p class="frame-eyebrow"><span></span>${t.systems}</p><h2 id="systems-title">${t.systemsLead}</h2></div><div class="skill-tree" data-skill-tree><img class="skill-tree__upper" src="${treeUpperUrl}" alt="" aria-hidden="true" /><img class="skill-tree__trunk" src="${trunkUrl}" alt="" aria-hidden="true" /><img class="skill-tree__leaf skill-tree__leaf--one" src="${leafUrl}" alt="" aria-hidden="true" /><img class="skill-tree__leaf skill-tree__leaf--two" src="${leafUrl}" alt="" aria-hidden="true" /><div class="skill-tree__rail" aria-hidden="true"></div><div class="skill-tree__buttons" role="tablist" aria-label="${t.systems}">${[['development', devButtonUrl, devButtonActiveUrl], ['creativity', creativityButtonUrl, creativityButtonActiveUrl], ['art', artButtonUrl, artButtonActiveUrl]].map(([id, normal, active], index) => `<button class="skill-tree__button${index === 0 ? ' is-active' : ''}" type="button" role="tab" data-skill-tab="${id}" aria-selected="${index === 0}" aria-controls="skill-tree-copy"><img src="${normal}" data-normal="${normal}" data-active="${active}" alt="" /><span>${t.skills[id][0]}</span></button>`).join('')}</div><div class="skill-tree__copy" id="skill-tree-copy" role="tabpanel" tabindex="0"><span data-skill-count>01 / 03</span><h3 data-skill-title>${t.skills.development[0]}</h3><p data-skill-description>${t.skills.development[1]}</p></div><div class="skill-tree__nav"><button type="button" data-skill-step="-1" aria-label="${t.treePrevious}">←</button><button type="button" data-skill-step="1" aria-label="${t.treeNext}">→</button></div></div></section>
    </main>`;
  },
  enhance: ({ pageRoot, language }) => {
    const t = copy[language] ?? copy.fr;
    const shots = [...pageRoot.querySelectorAll('[data-frame-shot]')];
    const markers = [...pageRoot.querySelectorAll('[data-frame-marker]')];
    const counter = pageRoot.querySelector('[data-frame-counter]');
    let frameIndex = 0;
    const selectFrame = (next) => { frameIndex = (next + shots.length) % shots.length; shots.forEach((shot, index) => shot.classList.toggle('is-active', index === frameIndex)); markers.forEach((marker, index) => { marker.classList.toggle('is-active', index === frameIndex); marker.setAttribute('aria-selected', String(index === frameIndex)); }); if (counter) counter.textContent = `${String(frameIndex + 1).padStart(2, '0')} / ${String(shots.length).padStart(2, '0')}`; };
    markers.forEach((marker) => marker.addEventListener('click', () => selectFrame(Number(marker.dataset.frameMarker))));
    pageRoot.querySelectorAll('[data-frame-step]').forEach((button) => button.addEventListener('click', () => selectFrame(frameIndex + Number(button.dataset.frameStep))));
    const tabs = [...pageRoot.querySelectorAll('[data-skill-tab]')]; const title = pageRoot.querySelector('[data-skill-title]'); const description = pageRoot.querySelector('[data-skill-description]'); const count = pageRoot.querySelector('[data-skill-count]'); let skillIndex = 0;
    const selectSkill = (next, focus = false) => { skillIndex = (next + tabs.length) % tabs.length; tabs.forEach((tab, index) => { const active = index === skillIndex; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); const image = tab.querySelector('img'); if (image) image.src = active ? image.dataset.active : image.dataset.normal; }); const id = tabs[skillIndex].dataset.skillTab; title.textContent = t.skills[id][0]; description.textContent = t.skills[id][1]; count.textContent = `${String(skillIndex + 1).padStart(2, '0')} / 03`; if (focus) tabs[skillIndex].focus(); };
    tabs.forEach((tab, index) => tab.addEventListener('click', () => selectSkill(index)));
    pageRoot.querySelectorAll('[data-skill-step]').forEach((button) => button.addEventListener('click', () => selectSkill(skillIndex + Number(button.dataset.skillStep), true)));
    pageRoot.querySelector('[data-skill-tree]')?.addEventListener('keydown', (event) => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); if (event.key === 'Home') selectSkill(0, true); else if (event.key === 'End') selectSkill(tabs.length - 1, true); else selectSkill(skillIndex + (event.key === 'ArrowRight' ? 1 : -1), true); });
    pageRoot.querySelectorAll('[data-media-fallback]').forEach((image) => image.addEventListener('error', () => image.closest('.frame-shot')?.classList.add('has-error'), { once: true }));
    return () => {};
  },
};
