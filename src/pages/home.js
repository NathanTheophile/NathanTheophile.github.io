import { getAllProjects, rememberActiveProjectSlug } from '../data/project-store.js';
import { siteCopy } from '../data/site.js';

const copy = {
  fr: {
    eyebrow: 'Cartographie des possibles · 01—03',
    role: 'Gameplay Programmer',
    intro: 'Je transforme une intention de jeu en comportements lisibles, testables et sensibles.',
    location: 'Unity · C# · Prototypage gameplay',
    proofLink: 'Preuve projet · Calaveroll',
    proof: 'Une preuve, tout de suite',
    mapTitle: 'Partir du comportement.',
    mapHint: 'Choisis un point pour lire sa trace.',
    inspect: 'Trace sélectionnée',
    open: 'Voir l’étude du projet',
    projects: 'Parcourir les projets',
    contact: 'Parlons gameplay',
    selected: 'Point actif',
    all: 'Trois portes vers le jeu',
    branches: [
      { slug: 'calaveroll', title: 'Déduire pour avancer', trace: 'Puzzle 3D · Déduction', color: 'mint' },
      { slug: 'go-duck-duck', title: 'Une touche, une course', trace: 'One button · 1v1 local', color: 'amber' },
      { slug: 'echo-grove', title: 'Rendre l’action lisible', trace: 'Shoot’em up · Lisibilité système', color: 'lilac' },
    ],
    roleLabel: 'Rôle au projet',
    stackLabel: 'Outils documentés',
    empty: 'Aucun outil renseigné',
    noProject: 'Projet indisponible dans les données.',
    evidence: 'SOURCE · FICHE PROJET',
    index: 'ENTRÉE',
    scroll: 'Continuer la lecture',
    footer: 'Une carte de comportements, reliée à des projets réels.',
  },
  en: {
    eyebrow: 'Map of possibilities · 01—03',
    role: 'Gameplay Programmer',
    intro: 'I turn a game intention into behaviours that feel clear, testable and alive.',
    location: 'Unity · C# · Gameplay prototyping',
    proofLink: 'Project proof · Calaveroll',
    proof: 'Proof, at a glance',
    mapTitle: 'Start with behaviour.',
    mapHint: 'Choose a point to read its trace.',
    inspect: 'Selected trace',
    open: 'View project study',
    projects: 'Browse projects',
    contact: 'Let’s talk gameplay',
    selected: 'Active point',
    all: 'Three ways into play',
    branches: [
      { slug: 'calaveroll', title: 'Think your way forward', trace: '3D puzzle · Deduction', color: 'mint' },
      { slug: 'go-duck-duck', title: 'One button, one race', trace: 'One button · Local 1v1', color: 'amber' },
      { slug: 'echo-grove', title: 'Make action readable', trace: 'Shoot’em up · System readability', color: 'lilac' },
    ],
    roleLabel: 'Project role',
    stackLabel: 'Documented tools',
    empty: 'No tools listed',
    noProject: 'Project unavailable in the data.',
    evidence: 'SOURCE · PROJECT RECORD',
    index: 'ENTRY',
    scroll: 'Continue reading',
    footer: 'A map of behaviours, connected to real projects.',
  },
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function text(value, language) {
  return value?.[language] ?? value?.fr ?? '';
}

function branchMarkup(branch, index, project, language, selected) {
  const title = project ? text(project.title, language) : branch.title;
  const summary = project ? text(project.summary, language) : '';
  const active = selected ? ' is-active' : '';
  return `
    <button class="atlas-point atlas-point--${branch.color}${active}" type="button"
      data-atlas-point="${escapeHtml(branch.slug)}" data-atlas-index="${index}"
      aria-pressed="${selected}" aria-controls="atlas-trace" aria-label="${index + 1}. ${escapeHtml(branch.title)} — ${escapeHtml(title)}">
      <span class="atlas-point__index">${String(index + 1).padStart(2, '0')}</span>
      <span class="atlas-point__copy"><strong>${escapeHtml(branch.title)}</strong><span>${escapeHtml(branch.trace)}</span></span>
      <span class="atlas-point__signal" aria-hidden="true"></span>
    </button>
  `;
}

function traceMarkup(branch, project, language, ui) {
  if (!project) return `<p class="atlas-trace__summary">${escapeHtml(ui.noProject)}</p>`;
  const roles = project.roles?.[language]?.length ? project.roles[language] : [text(project.role, language)].filter(Boolean);
  const stack = Array.isArray(project.stack) ? project.stack : [];
  return `
    <div class="atlas-trace__topline"><span>${escapeHtml(ui.evidence)}</span><span>${escapeHtml(project.year ?? '')}</span></div>
    <p class="atlas-trace__kind">${escapeHtml(branch.trace)}</p>
    <h2 class="atlas-trace__title">${escapeHtml(text(project.title, language))}</h2>
    <p class="atlas-trace__summary">${escapeHtml(text(project.summary, language))}</p>
    <dl class="atlas-trace__facts">
      <div><dt>${escapeHtml(ui.roleLabel)}</dt><dd>${escapeHtml(roles.join(' · ') || '—')}</dd></div>
      <div><dt>${escapeHtml(ui.stackLabel)}</dt><dd>${escapeHtml(stack.join(' · ') || ui.empty)}</dd></div>
    </dl>
    <button class="atlas-trace__open" type="button" data-atlas-open-project="${escapeHtml(project.slug)}">
      <span>${escapeHtml(ui.open)}</span><span aria-hidden="true">↗</span>
    </button>
  `;
}

export const renderHomePage = {
  pageId: 'skills',
  createContent: ({ language }) => {
    const ui = copy[language] ?? copy.fr;
    const allProjects = getAllProjects();
    const entries = ui.branches.map((branch) => ({ branch, project: allProjects.find((project) => project.slug === branch.slug) }));
    const selectedIndex = Math.max(0, entries.findIndex(({ project }) => project?.slug === 'calaveroll'));
    const selected = entries[selectedIndex];
    return `
      <div class="atlas-home">
        <section class="atlas-hero" aria-labelledby="atlas-name">
          <div class="atlas-hero__identity">
            <p class="atlas-eyebrow"><span></span>${escapeHtml(ui.eyebrow)}</p>
            <h1 id="atlas-name">Nathan<br /><em>Theophile</em></h1>
            <p class="atlas-role">${escapeHtml(ui.role)}</p>
            <p class="atlas-intro">${escapeHtml(ui.intro)}</p>
            <p class="atlas-stack"><span class="atlas-stack__mark" aria-hidden="true">✳</span>${escapeHtml(ui.location)}</p>
            <a class="atlas-proof-link" href="#atlas-evidence-title">${escapeHtml(ui.proofLink)} <span aria-hidden="true">↓</span></a>
            <a class="atlas-contact" href="/contact/" data-nav-link="contact">${escapeHtml(ui.contact)} <span aria-hidden="true">↗</span></a>
          </div>
          <div class="atlas-map-wrap">
            <div class="atlas-map__heading"><div><span>${escapeHtml(ui.selected)} / 0${selectedIndex + 1}</span><h2>${escapeHtml(ui.mapTitle)}</h2></div><p>${escapeHtml(ui.mapHint)}</p></div>
            <div class="atlas-map" data-atlas-map>
              <div class="atlas-map__grid" aria-hidden="true"></div>
              <svg class="atlas-map__lines" viewBox="0 0 720 430" preserveAspectRatio="none" aria-hidden="true">
                <path class="atlas-line atlas-line--main" d="M355 215 C270 215 250 110 142 104" />
                <path class="atlas-line atlas-line--main" d="M355 215 C450 215 488 114 584 105" />
                <path class="atlas-line atlas-line--main" d="M355 215 C270 215 242 322 142 328" />
                <path class="atlas-line atlas-line--fine" d="M142 104 C264 132 262 269 142 328" />
                <path class="atlas-line atlas-line--fine" d="M584 105 C472 146 467 284 584 328" />
                <circle class="atlas-origin" cx="355" cy="215" r="27" />
                <circle class="atlas-origin__core" cx="355" cy="215" r="5" />
              </svg>
              <div class="atlas-map__origin"><span>PLAYER</span><b>?</b><span>INTENTION</span></div>
              <div class="atlas-map__points">
                ${entries.map(({ branch, project }, index) => branchMarkup(branch, index, project, language, index === selectedIndex)).join('')}
              </div>
              <span class="atlas-map__coordinate atlas-map__coordinate--a" aria-hidden="true">48°51′N</span>
              <span class="atlas-map__coordinate atlas-map__coordinate--b" aria-hidden="true">02°21′E</span>
              <span class="atlas-map__north" aria-hidden="true">N <i>↑</i></span>
            </div>
            <p class="atlas-map__mobile-hint">${escapeHtml(ui.mapHint)} <span>↕</span></p>
          </div>
        </section>
        <section class="atlas-evidence" aria-labelledby="atlas-evidence-title">
          <div class="atlas-evidence__heading"><div><span>${escapeHtml(ui.proof)}</span><h2 id="atlas-evidence-title">${escapeHtml(ui.all)}</h2></div><a href="/projects/" data-nav-link="projects">${escapeHtml(ui.projects)} <span aria-hidden="true">↗</span></a></div>
          <div class="atlas-evidence__layout">
            <div class="atlas-evidence__index" aria-label="${escapeHtml(ui.inspect)}">${entries.map(({ branch }, index) => `<span data-atlas-index-label="${index}" class="${index === selectedIndex ? 'is-active' : ''}">0${index + 1}<i>${escapeHtml(branch.title)}</i></span>`).join('')}</div>
            <article class="atlas-trace" id="atlas-trace" aria-live="polite" aria-atomic="true">${traceMarkup(selected.branch, selected.project, language, ui)}</article>
          </div>
        </section>
        <footer class="atlas-footer"><span>NT / GAMEPLAY</span><p>${escapeHtml(ui.footer)}</p><a href="/contact/" data-nav-link="contact">${escapeHtml(ui.contact)} ↗</a></footer>
      </div>
    `;
  },
  enhance: ({ root, language, navigateTo }) => {
    const ui = copy[language] ?? copy.fr;
    const allProjects = getAllProjects();
    const entries = ui.branches.map((branch) => ({ branch, project: allProjects.find((project) => project.slug === branch.slug) }));
    const points = Array.from(root.querySelectorAll('[data-atlas-point]'));
    const trace = root.querySelector('#atlas-trace');
    const selectPoint = (index) => {
      const selectedIndex = Math.max(0, Math.min(index, entries.length - 1));
      const entry = entries[selectedIndex];
      points.forEach((point, pointIndex) => {
        const active = pointIndex === selectedIndex;
        point.classList.toggle('is-active', active);
        point.setAttribute('aria-pressed', String(active));
        root.querySelector(`[data-atlas-index-label="${pointIndex}"]`)?.classList.toggle('is-active', active);
      });
      const selected = root.querySelector('.atlas-map__heading > div > span');
      if (selected) selected.textContent = `${ui.selected} / 0${selectedIndex + 1}`;
      if (trace) trace.innerHTML = traceMarkup(entry.branch, entry.project, language, ui);
    };
    points.forEach((point) => point.addEventListener('click', () => selectPoint(Number(point.dataset.atlasIndex))));
    root.querySelector('[data-atlas-map]')?.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
      const current = Number(event.target.closest('[data-atlas-point]')?.dataset.atlasIndex);
      if (!Number.isInteger(current)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      const next = (current + direction + points.length) % points.length;
      selectPoint(next);
      points[next]?.focus();
    });
    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-atlas-open-project]');
      if (!button) return;
      rememberActiveProjectSlug(button.dataset.atlasOpenProject);
      navigateTo('projects', { pushUrl: new URL('projects/', window.location.href).href });
    });
    return () => {};
  },
};
