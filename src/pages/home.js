import { getAllProjects, rememberActiveProjectSlug } from '../data/project-store.js';
import trunkUrl from '../images/Trunk.svg';
import treeUpperUrl from '../images/tree_upper.svg';
import leafUrl from '../images/Leaf.svg';
import devButtonUrl from '../images/Btn_Dev_Normal.svg';
import creaButtonUrl from '../images/Btn_Crea_Normal.svg';
import artButtonUrl from '../images/Btn_Art_Normal.svg';

const copy = {
  fr: {
    eyebrow: 'Cartographie des possibles', role: 'Gameplay programmer',
    intro: 'Je construis des comportements de jeu clairs, testables et sensibles.',
    contact: 'Parlons gameplay', projects: 'Voir tous les projets', treeLabel: 'Arbre des compétences', treeHint: 'Choisir une branche de l’atlas',
    lenses: [{ label: 'Développement', index: 0, asset: devButtonUrl }, { label: 'Création', index: 1, asset: creaButtonUrl }, { label: 'Direction artistique', index: 2, asset: artButtonUrl }],
    projectsLabel: 'Repères de projet', projectHint: 'Choisir une étude', open: 'Ouvrir la fiche', roleLabel: 'Rôle', noProject: 'Projet indisponible dans les données.', fallback: 'Image indisponible',
    branches: [{ slug: 'calaveroll', trace: 'Déduction et puzzle 3D' }, { slug: 'go-duck-duck', trace: 'One button et course locale' }, { slug: 'echo-grove', trace: 'Lisibilité de l’action' }],
  },
  en: {
    eyebrow: 'Map of possibilities', role: 'Gameplay programmer', intro: 'I build game behaviours that are clear, testable and alive.',
    contact: 'Let’s talk gameplay', projects: 'See every project', treeLabel: 'Skill tree', treeHint: 'Choose an atlas branch',
    lenses: [{ label: 'Development', index: 0, asset: devButtonUrl }, { label: 'Creation', index: 1, asset: creaButtonUrl }, { label: 'Art direction', index: 2, asset: artButtonUrl }],
    projectsLabel: 'Project landmarks', projectHint: 'Choose a study', open: 'Open project', roleLabel: 'Role', noProject: 'Project unavailable in the data.', fallback: 'Image unavailable',
    branches: [{ slug: 'calaveroll', trace: 'Deduction and 3D puzzle' }, { slug: 'go-duck-duck', trace: 'One button and local race' }, { slug: 'echo-grove', trace: 'Action readability' }],
  },
};

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function text(value, language) { return value?.[language] ?? value?.fr ?? ''; }

function normalizeImageUrl(source) {
  try {
    const url = new URL(source, window.location.href);
    if (url.hostname === 'imgur.com' && /^\/[A-Za-z0-9]+\.(png|jpe?g|gif|webp)$/i.test(url.pathname)) url.hostname = 'i.imgur.com';
    return url.toString();
  } catch { return String(source ?? ''); }
}

function getProjectImage(project) { return normalizeImageUrl(project?.banner || project?.media?.images?.[0] || ''); }
function getRoles(project, language) { return project?.roles?.[language]?.length ? project.roles[language] : [text(project?.role, language)].filter(Boolean); }

function projectCard(branch, project, language, ui, index) {
  const title = project ? text(project.title, language) : branch.slug;
  const image = getProjectImage(project);
  return `
    <article class="atlas-project-card${index === 0 ? ' is-active' : ''}" data-atlas-card="${escapeHtml(project?.slug ?? branch.slug)}">
      <button type="button" class="atlas-project-card__select" data-atlas-project="${escapeHtml(project?.slug ?? branch.slug)}" aria-pressed="${index === 0}">
        <span class="atlas-project-card__image">${image ? `<img src="${escapeHtml(image)}" alt="" loading="${index === 0 ? 'eager' : 'lazy'}" data-image-fallback />` : ''}<span class="atlas-image-fallback" ${image ? 'hidden' : ''}>${escapeHtml(ui.fallback)}</span></span>
        <span class="atlas-project-card__meta"><span>${escapeHtml(project?.year ?? '')}</span><span>${escapeHtml(getRoles(project, language)[0] ?? '')}</span></span>
        <strong>${escapeHtml(title)}</strong><span>${escapeHtml(branch.trace)}</span>
      </button>
    </article>`;
}

function projectPanel(project, language, ui) {
  if (!project) return `<p class="atlas-panel__empty">${escapeHtml(ui.noProject)}</p>`;
  const image = getProjectImage(project);
  const roles = getRoles(project, language).join(' · ');
  return `
    <div class="atlas-panel__media">${image ? `<img src="${escapeHtml(image)}" alt="" data-image-fallback />` : ''}<span class="atlas-image-fallback" ${image ? 'hidden' : ''}>${escapeHtml(ui.fallback)}</span></div>
    <div class="atlas-panel__copy"><div><span>${escapeHtml(project.year ?? '')}</span><span>${escapeHtml(ui.roleLabel)} · ${escapeHtml(roles)}</span></div><h2>${escapeHtml(text(project.title, language))}</h2><p>${escapeHtml(text(project.summary, language))}</p><button type="button" data-atlas-open-project="${escapeHtml(project.slug)}">${escapeHtml(ui.open)} <span aria-hidden="true">↗</span></button></div>`;
}

export const renderHomePage = {
  pageId: 'skills',
  createContent: ({ language }) => {
    const ui = copy[language] ?? copy.fr;
    const projects = getAllProjects();
    const entries = ui.branches.map((branch) => ({ branch, project: projects.find((project) => project.slug === branch.slug) }));
    return `
      <div class="atlas-home">
        <section class="atlas-hero" aria-labelledby="atlas-title">
          <div class="atlas-hero__identity"><p class="atlas-eyebrow">${escapeHtml(ui.eyebrow)}</p><h1 id="atlas-title">Nathan<br /><em>Theophile</em></h1><p class="atlas-role">${escapeHtml(ui.role)}</p><p class="atlas-intro">${escapeHtml(ui.intro)}</p><div class="atlas-hero__actions"><a href="/projects/" data-nav-link="projects">${escapeHtml(ui.projects)} <span aria-hidden="true">↗</span></a><a href="/contact/" data-nav-link="contact">${escapeHtml(ui.contact)} <span aria-hidden="true">↗</span></a></div></div>
          <div class="atlas-tree" aria-label="${escapeHtml(ui.treeLabel)}"><p>${escapeHtml(ui.treeHint)}</p><div class="atlas-tree__art" aria-hidden="true"><img class="atlas-tree__upper" src="${treeUpperUrl}" alt="" /><img class="atlas-tree__trunk" src="${trunkUrl}" alt="" />${Array.from({ length: 8 }, () => `<img class="atlas-tree__leaf" src="${leafUrl}" alt="" />`).join('')}</div><div class="atlas-tree__controls" role="group" aria-label="${escapeHtml(ui.treeLabel)}">${ui.lenses.map((lens, index) => `<button type="button" class="atlas-tree__control${index === 0 ? ' is-active' : ''}" data-atlas-lens="${lens.index}" aria-pressed="${index === 0}" aria-label="${escapeHtml(lens.label)}"><img src="${lens.asset}" alt="" /><span>${escapeHtml(lens.label)}</span></button>`).join('')}</div></div>
        </section>
        <section class="atlas-projects" aria-labelledby="atlas-projects-title"><div class="atlas-section-heading"><div><p>${escapeHtml(ui.projectsLabel)}</p><h2 id="atlas-projects-title">${escapeHtml(ui.projectHint)}</h2></div><span>01—03</span></div><div class="atlas-project-grid">${entries.map(({ branch, project }, index) => projectCard(branch, project, language, ui, index)).join('')}</div><article class="atlas-panel" data-atlas-panel aria-live="polite">${projectPanel(entries[0].project, language, ui)}</article></section>
      </div>`;
  },
  enhance: ({ root, language, navigateTo }) => {
    const ui = copy[language] ?? copy.fr;
    const entries = ui.branches.map((branch) => ({ branch, project: getAllProjects().find((project) => project.slug === branch.slug) }));
    const panel = root.querySelector('[data-atlas-panel]');
    const select = (index) => {
      const safeIndex = ((Number(index) || 0) + entries.length) % entries.length;
      root.querySelectorAll('[data-atlas-card]').forEach((card, cardIndex) => { const active = cardIndex === safeIndex; card.classList.toggle('is-active', active); card.querySelector('[data-atlas-project]')?.setAttribute('aria-pressed', String(active)); });
      root.querySelectorAll('[data-atlas-lens]').forEach((button) => { const active = Number(button.dataset.atlasLens) === safeIndex; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
      if (panel) panel.innerHTML = projectPanel(entries[safeIndex].project, language, ui);
    };
    root.querySelectorAll('[data-atlas-project]').forEach((button, index) => button.addEventListener('click', () => select(index)));
    root.querySelectorAll('[data-atlas-lens]').forEach((button) => button.addEventListener('click', () => select(button.dataset.atlasLens)));
    root.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) || !event.target.closest('[data-atlas-project], [data-atlas-lens]')) return;
      event.preventDefault(); const active = Array.from(root.querySelectorAll('[data-atlas-project]')).findIndex((button) => button.getAttribute('aria-pressed') === 'true'); const next = (active + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + entries.length) % entries.length; select(next); root.querySelectorAll('[data-atlas-project]')[next]?.focus();
    });
    root.addEventListener('error', (event) => { const image = event.target.closest?.('[data-image-fallback]'); if (!image) return; image.hidden = true; image.parentElement?.querySelector('.atlas-image-fallback')?.removeAttribute('hidden'); }, true);
    root.addEventListener('click', (event) => { const button = event.target.closest('[data-atlas-open-project]'); if (!button) return; rememberActiveProjectSlug(button.dataset.atlasOpenProject); navigateTo('projects', { pushUrl: new URL('projects/', window.location.href).href }); });
    return () => {};
  },
};
