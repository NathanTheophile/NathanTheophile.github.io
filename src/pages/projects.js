import {
  addStoredProject,
  clearRememberedActiveProjectSlug,
  deleteProjectBySlug,
  exportProjectsDataModule,
  exportStoredProjectsModule,
  getAllProjects,
  getRememberedActiveProjectSlug,
  getStoredProjects,
  rememberActiveProjectSlug,
  removeStoredProject,
  saveStoredProject,
} from '../data/project-store.js';
import { siteCopy } from '../data/site.js';

const projectsUiCopy = {
  workshopEyebrow: { fr: 'Atelier local', en: 'Local workshop' },
  workshopTitle: { fr: 'Ajouter un projet sans coder', en: 'Add a project without coding' },
  workshopBody: {
    fr: 'Le formulaire ci-dessous cree des projets stockes dans ce navigateur. Ce sont des brouillons locaux tant que tu ne les exportes pas dans le projet.',
    en: 'The form below creates projects stored in this browser. They remain local drafts until you export them into the project.',
  },
  workshopCount: {
    fr: (count) => `${count} projet${count > 1 ? 's' : ''} local${count > 1 ? 'aux' : ''}`,
    en: (count) => `${count} local project${count > 1 ? 's' : ''}`,
  },
  addProject: { fr: 'Ajouter un projet', en: 'Add project' },
  exportProjects: { fr: 'Exporter les projets', en: 'Export projects' },
  saveProjectsFile: { fr: 'Sauver projects.js', en: 'Save projects.js' },
  copyProjectsCode: { fr: 'Copier le code', en: 'Copy code' },
  noLocalProjects: {
    fr: 'Ajoute au moins un projet local avant d exporter.',
    en: 'Add at least one local project before exporting.',
  },
  exportSaved: {
    fr: 'Module exporte. Integre-le dans src/data/projects.js puis commit.',
    en: 'Module exported. Fold it into src/data/projects.js, then commit.',
  },
  projectsFileSaved: {
    fr: 'projects.js sauvegarde. Relance le build puis commit.',
    en: 'projects.js saved. Run the build again, then commit.',
  },
  projectsFileSaveUnsupported: {
    fr: 'Sauvegarde directe indisponible ici. Utilise Exporter ou Copier le code.',
    en: 'Direct file save is unavailable here. Use Export or Copy code.',
  },
  exportCopied: {
    fr: 'Code des projets copie dans le presse-papiers.',
    en: 'Project code copied to clipboard.',
  },
  exportFailed: {
    fr: 'Export impossible depuis ce navigateur. Essaie le bouton Copier le code.',
    en: 'Unable to export from this browser. Try the Copy code button.',
  },
  copyFailed: {
    fr: 'Copie impossible depuis ce navigateur.',
    en: 'Clipboard copy is not available in this browser.',
  },
  localBadge: { fr: 'Projet local', en: 'Local project' },
  localNote: {
    fr: 'Ce projet est un brouillon local visible uniquement dans ce navigateur jusqu a ce que tu l integres au code.',
    en: 'This project is a local draft visible only in this browser until you fold it back into the codebase.',
  },
  deleteProject: { fr: 'Supprimer ce projet local', en: 'Delete this local project' },
  deleteConfirm: {
    fr: 'Supprimer ce projet local de la page projets ?',
    en: 'Delete this local project from the projects page?',
  },
  removeTile: { fr: 'Retirer le projet', en: 'Remove project' },
  removeTileConfirm: {
    fr: 'Retirer ce projet de la page projets dans ce navigateur ?',
    en: 'Remove this project from the projects page in this browser?',
  },
  editTile: { fr: 'Modifier le projet', en: 'Edit project' },
  mediaLabel: { fr: 'Medias', en: 'Media' },
  modalTitleCreate: { fr: 'Nouveau projet', en: 'New project' },
  modalTitleEdit: { fr: 'Modifier le projet', en: 'Edit project' },
  modalIntro: {
    fr: 'Remplis les champs utiles. Si les champs anglais sont vides, la version francaise sera reutilisee automatiquement.',
    en: 'Fill the fields you need. If English fields are empty, the French content will be reused automatically.',
  },
  modalClose: { fr: 'Fermer', en: 'Close' },
  modalCancel: { fr: 'Annuler', en: 'Cancel' },
  modalSaveCreate: { fr: 'Enregistrer le projet', en: 'Save project' },
  modalSaveEdit: { fr: 'Enregistrer les modifications', en: 'Save changes' },
  sectionIdentity: { fr: 'Identite', en: 'Identity' },
  sectionContent: { fr: 'Contenu', en: 'Content' },
  sectionDetails: { fr: 'Details', en: 'Details' },
  sectionMedia: { fr: 'Medias', en: 'Media' },
  fieldYear: { fr: 'Annee', en: 'Year' },
  fieldSpotlight: { fr: 'Afficher dans le carousel', en: 'Show in carousel' },
  fieldTitleFr: { fr: 'Titre (FR)', en: 'Title (FR)' },
  fieldTitleEn: { fr: 'Titre (EN)', en: 'Title (EN)' },
  fieldRoleFr: { fr: 'Roles (FR)', en: 'Roles (FR)' },
  fieldRoleEn: { fr: 'Roles (EN)', en: 'Roles (EN)' },
  fieldSummaryFr: { fr: 'Description courte (FR)', en: 'Short summary (FR)' },
  fieldSummaryEn: { fr: 'Description courte (EN)', en: 'Short summary (EN)' },
  fieldDescriptionFr: { fr: 'Description detaillee (FR)', en: 'Detailed description (FR)' },
  fieldDescriptionEn: { fr: 'Description detaillee (EN)', en: 'Detailed description (EN)' },
  fieldStack: { fr: 'Outils & langages', en: 'Tools & languages' },
  fieldSupport: { fr: 'Support / plateforme', en: 'Support / platform' },
  fieldBanner: { fr: 'Image banniere', en: 'Banner image' },
  fieldOutcomesFr: { fr: 'Resultats (FR)', en: 'Outcomes (FR)' },
  fieldOutcomesEn: { fr: 'Resultats (EN)', en: 'Outcomes (EN)' },
  fieldImages: { fr: 'Images', en: 'Images' },
  fieldVideos: { fr: 'Videos', en: 'Videos' },
  fieldStackHint: {
    fr: 'Un outil ou langage par ligne, ou separe par des virgules.',
    en: 'One tool or language per line, or separated with commas.',
  },
  fieldOutcomeHint: {
    fr: 'Un resultat par ligne.',
    en: 'One outcome per line.',
  },
  fieldRoleHint: {
    fr: 'Un role par ligne.',
    en: 'One role per line.',
  },
  fieldSupportHint: {
    fr: 'Un support par ligne ou separe par des virgules.',
    en: 'One support per line or separated with commas.',
  },
  filterRole: { fr: 'Role', en: 'Role' },
  filterSupport: { fr: 'Support', en: 'Support' },
  filterTools: { fr: 'Outils & langages', en: 'Tools & languages' },
  filterAllRoles: { fr: 'Tous les roles', en: 'All roles' },
  filterAllSupports: { fr: 'Tous les supports', en: 'All supports' },
  filterAllTools: { fr: 'Tous les outils/langages', en: 'All tools/languages' },
  fieldMediaHint: {
    fr: 'Une URL par ligne. Tu peux coller des liens directs, YouTube, Vimeo, etc.',
    en: 'One URL per line. You can paste direct links, YouTube, Vimeo, and so on.',
  },
  fieldBannerHint: {
    fr: 'Une URL d image au format large. Ratio recommande: 3:1 pour la grille.',
    en: 'One wide image URL. Recommended ratio: 3:1 for the grid.',
  },
  sortDateButton: { fr: 'Date', en: 'Date' },
  sortDateAsc: { fr: 'Croissante', en: 'Ascending' },
  sortDateDesc: { fr: 'Decroissante', en: 'Descending' },
  sortDateToggleLabel: {
    fr: (direction) => `Trier par date ${direction === 'asc' ? 'croissante' : 'decroissante'}`,
    en: (direction) => `Sort by date ${direction === 'asc' ? 'ascending' : 'descending'}`,
  },
  mediaOpenImage: { fr: 'Ouvrir l image en grand', en: 'Open image fullscreen' },
  mediaOpenVideo: { fr: 'Ouvrir la video en grand', en: 'Open video fullscreen' },
  mediaPrev: { fr: 'Media precedent', en: 'Previous media' },
  mediaNext: { fr: 'Media suivant', en: 'Next media' },
  mediaGallery: { fr: 'Galerie media', en: 'Media gallery' },
  mediaImageLabel: { fr: 'Image', en: 'Image' },
  mediaVideoLabel: { fr: 'Video', en: 'Video' },
  mediaPlay: { fr: 'Lire', en: 'Play' },
  lightboxClose: { fr: 'Fermer le media', en: 'Close media' },
  modalError: {
    fr: 'Impossible d enregistrer ce projet localement. Verifie les champs et l espace disponible du navigateur.',
    en: 'Unable to save this project locally. Check the fields and the browser storage space.',
  },
};

const spotlightProjectOrder = ['calaveroll', 'dream-fragment', 'lord-of-shadows'];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeCssUrl(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"');
}

function getProjectRoleLabels(project, language) {
  return project.roles?.[language]?.length ? project.roles[language] : [project.role[language]];
}

function getProjectSupportLabels(project, language) {
  return project.support?.[language]?.length ? project.support[language] : [];
}

function getProjectToolLabels(project) {
  return Array.isArray(project.stack) ? project.stack : [];
}

function normalizeFilterValue(value) {
  return String(value ?? '').trim().toLocaleLowerCase();
}

function getUniqueProjectOptions(projectList, readOptions) {
  const options = projectList
    .flatMap(readOptions)
    .map((option) => String(option ?? '').trim())
    .filter(Boolean);

  return [...new Set(options)].sort((left, right) => left.localeCompare(right));
}

function sortSpotlightProjects(projectList) {
  const orderLookup = new Map(spotlightProjectOrder.map((slug, index) => [slug, index]));

  return [...projectList].sort((left, right) => {
    const leftOrder = orderLookup.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = orderLookup.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    return leftOrder - rightOrder || String(left.title.fr).localeCompare(String(right.title.fr));
  });
}

function getInitialProject(projectList) {
  const rememberedSlug = getRememberedActiveProjectSlug();
  return projectList.find((project) => project.slug === rememberedSlug) ?? projectList[0] ?? null;
}

function splitTextareaList(value, { allowComma = false } = {}) {
  const rawValue = String(value ?? '').trim();
  if (!rawValue) return [];
  const separator = allowComma ? /[\n,]+/ : /\n+/;
  return rawValue
    .split(separator)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getProjectThumbnail(project) {
  return project.media?.images?.[0] ?? '';
}

function getProjectBanner(project) {
  return project.banner || getProjectThumbnail(project);
}

function getVideoEmbedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl, window.location.href);

    if (url.hostname.includes('youtu.be')) {
      const videoId = url.pathname.replaceAll('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/shorts/')) {
        const videoId = url.pathname.split('/')[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }

      const videoId = url.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    if (url.hostname.includes('vimeo.com')) {
      const videoId = url.pathname
        .split('/')
        .map((part) => part.trim())
        .filter(Boolean)
        .at(-1);
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }
  } catch {
    return '';
  }

  return '';
}

function getAutoplayVideoUrl(rawUrl) {
  try {
    const url = new URL(rawUrl, window.location.href);
    url.searchParams.set('autoplay', '1');
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
      url.searchParams.set('rel', '0');
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function getVideoThumbnailUrl(rawUrl) {
  try {
    const url = new URL(rawUrl, window.location.href);

    if (url.hostname.includes('youtu.be')) {
      const videoId = url.pathname.replaceAll('/', '');
      return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
    }

    if (url.hostname.includes('youtube.com')) {
      const videoId = url.pathname.startsWith('/shorts/')
        ? url.pathname.split('/')[2]
        : url.searchParams.get('v');
      return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
    }

    if (url.hostname.includes('vimeo.com')) {
      const videoId = url.pathname
        .split('/')
        .map((part) => part.trim())
        .filter(Boolean)
        .at(-1);
      return videoId ? `https://vumbnail.com/${videoId}.jpg` : '';
    }
  } catch {
    return '';
  }

  return '';
}

function getProjectMediaItems(project, language, kind = 'all') {
  const imageItems = (project.media?.images ?? []).map((source, index) => ({
    type: 'image',
    source,
    title: `${project.title[language]} ${projectsUiCopy.mediaImageLabel[language]} ${index + 1}`,
    label: `${projectsUiCopy.mediaImageLabel[language]} ${index + 1}`,
  }));

  const videoItems = (project.media?.videos ?? []).map((source, index) => {
    const embedUrl = getVideoEmbedUrl(source);
    return {
      type: 'video',
      source,
      embedUrl,
      autoplayUrl: embedUrl ? getAutoplayVideoUrl(embedUrl) : source,
      thumbnailUrl: embedUrl ? getVideoThumbnailUrl(source) : '',
      title: `${project.title[language]} ${projectsUiCopy.mediaVideoLabel[language]} ${index + 1}`,
      label: `${projectsUiCopy.mediaVideoLabel[language]} ${index + 1}`,
    };
  });

  if (kind === 'image') return imageItems;
  if (kind === 'video') return videoItems;
  return [...imageItems, ...videoItems];
}

function renderProjectCard(project, language, index) {
  const banner = getProjectBanner(project);
  const initials = project.title[language].slice(0, 2).toUpperCase();
  const mediaStyle = banner
    ? ` style="--project-card-banner: url(&quot;${escapeHtml(escapeCssUrl(banner))}&quot;)"`
    : '';
  const mediaMarkup = banner ? '' : `<span>${escapeHtml(initials)}</span>`;
  const roleSummary = getProjectRoleLabels(project, language).join(' / ');

  return `
    <article class="project-card-shell" style="transition-delay:${index * 70}ms" data-reveal>
      <button class="project-card__edit" type="button" data-project-card-edit="${escapeHtml(project.slug)}" aria-label="${escapeHtml(projectsUiCopy.editTile[language])}">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M4 20l4.1-.8L18.6 8.7l-3.3-3.3L4.8 15.9 4 20Z" />
          <path d="M13.9 6.7l3.3 3.3" />
        </svg>
      </button>
      <button class="project-card__delete" type="button" data-project-card-delete="${escapeHtml(project.slug)}" aria-label="${escapeHtml(projectsUiCopy.removeTile[language])}">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M9 3.5h6" />
          <path d="M5.5 7h13" />
          <path d="M8 7l.7 11h6.6L16 7" />
          <path d="M10 10.5v4.5" />
          <path d="M14 10.5v4.5" />
        </svg>
      </button>
      <button class="project-card" type="button" data-project-card="${escapeHtml(project.slug)}">
        <span class="project-card__media" data-initials="${escapeHtml(initials)}" data-has-image="${banner ? 'true' : 'false'}"${mediaStyle}>
          ${mediaMarkup}
        </span>
        <span class="project-card__eyebrow">${escapeHtml(project.year)}</span>
        <strong class="project-card__title">${escapeHtml(project.title[language])}</strong>
        <span class="project-card__roles">${escapeHtml(roleSummary)}</span>
        <span class="project-card__body">${escapeHtml(project.summary[language])}</span>
      </button>
    </article>
  `;
}

function renderProjectFilterSelect(name, label, allLabel, options) {
  const optionMarkup = options
    .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
    .join('');

  return `
    <label class="projects-filter-select">
      <span>${escapeHtml(label)}</span>
      <select data-project-filter-select="${escapeHtml(name)}">
        <option value="">${escapeHtml(allLabel)}</option>
        ${optionMarkup}
      </select>
    </label>
  `;
}

function renderProjectFilterSelects(projectList, language) {
  const roles = getUniqueProjectOptions(projectList, (project) => getProjectRoleLabels(project, language));
  const supports = getUniqueProjectOptions(projectList, (project) => getProjectSupportLabels(project, language));
  const tools = getUniqueProjectOptions(projectList, getProjectToolLabels);

  return `
    ${renderProjectFilterSelect('role', projectsUiCopy.filterRole[language], projectsUiCopy.filterAllRoles[language], roles)}
    ${renderProjectFilterSelect('support', projectsUiCopy.filterSupport[language], projectsUiCopy.filterAllSupports[language], supports)}
    ${renderProjectFilterSelect('tool', projectsUiCopy.filterTools[language], projectsUiCopy.filterAllTools[language], tools)}
  `;
}

function renderSortButton(language, direction = 'desc') {
  const iconPath = direction === 'asc'
    ? '<path d="M12 18V7" /><path d="M7.5 11.5 12 7l4.5 4.5" />'
    : '<path d="M12 6v11" /><path d="m7.5 12.5 4.5 4.5 4.5-4.5" />';

  return `
    <button
      class="projects-sort-button"
      type="button"
      data-project-sort-toggle
      data-sort-direction="${direction}"
      aria-label="${escapeHtml(projectsUiCopy.sortDateToggleLabel[language](direction))}"
    >
      <span class="sr-only">${escapeHtml(projectsUiCopy.sortDateButton[language])}</span>
      <span class="projects-sort-button__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          ${iconPath}
        </svg>
      </span>
    </button>
  `;
}

function renderProjectMediaCarousel(mediaItems, kind, language) {
  if (!mediaItems.length) return '';

  const mediaMarkup = mediaItems
    .map((item, index) => {
      const previewMarkup = item.type === 'image'
        ? `<img src="${escapeHtml(item.source)}" alt="${escapeHtml(item.title)}" loading="lazy" />`
        : `
          ${
            item.thumbnailUrl
              ? `<img class="project-media__video-thumbnail" src="${escapeHtml(item.thumbnailUrl)}" alt="" loading="lazy" aria-hidden="true" />`
              : `<video class="project-media__video-thumbnail" preload="metadata" muted playsinline src="${escapeHtml(item.source)}" aria-hidden="true"></video>`
          }
          <span class="project-media__video-overlay" aria-hidden="true">
            <span class="project-media__play-badge"></span>
            <span class="project-media__video-chip">${escapeHtml(item.label)}</span>
          </span>
        `;

      return `
        <button
          class="project-media project-media--${item.type}${index === 0 ? ' is-active' : ''}"
          type="button"
          data-project-media-open="${index}"
          data-project-media-slide="${index}"
          data-project-media-kind="${kind}"
          aria-label="${escapeHtml(
            item.type === 'image' ? projectsUiCopy.mediaOpenImage[language] : projectsUiCopy.mediaOpenVideo[language]
          )}"
          aria-hidden="${index === 0 ? 'false' : 'true'}"
        >
          ${previewMarkup}
        </button>
      `;
    })
    .join('');

  return `
    <div class="detail-card__media-block">
      <span class="detail-card__section-label">${escapeHtml(
        kind === 'image' ? projectsUiCopy.fieldImages[language] : projectsUiCopy.fieldVideos[language]
      )}</span>
      <div class="project-media-carousel" data-project-media-carousel data-project-media-kind="${kind}" data-project-media-count="${mediaItems.length}" data-active-media-index="0">
        <div class="project-media-grid">
          ${mediaMarkup}
        </div>
        ${
          mediaItems.length > 1
            ? `
              <button class="project-media-carousel__nav project-media-carousel__nav--prev" type="button" data-project-media-nav="prev" data-project-media-kind="${kind}" aria-label="${escapeHtml(projectsUiCopy.mediaPrev[language])}">
                <span class="project-media-carousel__nav-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M14.75 5.75L8.5 12l6.25 6.25" />
                  </svg>
                </span>
              </button>
              <button class="project-media-carousel__nav project-media-carousel__nav--next" type="button" data-project-media-nav="next" data-project-media-kind="${kind}" aria-label="${escapeHtml(projectsUiCopy.mediaNext[language])}">
                <span class="project-media-carousel__nav-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M9.25 5.75L15.5 12l-6.25 6.25" />
                  </svg>
                </span>
              </button>
            `
            : ''
        }
      </div>
    </div>
  `;
}

function renderProjectMedia(project, language) {
  const imageItems = getProjectMediaItems(project, language, 'image');
  const videoItems = getProjectMediaItems(project, language, 'video');

  if (!imageItems.length && !videoItems.length) return '';

  return `
    ${renderProjectMediaCarousel(imageItems, 'image', language)}
    ${renderProjectMediaCarousel(videoItems, 'video', language)}
  `;
}

function renderProjectDetail(project, language) {
  if (!project) {
    return `
      <div class="detail-card__scroll">
        <span class="detail-card__eyebrow">${escapeHtml(siteCopy.projectsPage.eyebrow[language])}</span>
        <h3>${escapeHtml(siteCopy.projectsPage.title[language])}</h3>
      </div>
    `;
  }

  const stack = project.stack.map((item) => `<span class="stack-pill">${escapeHtml(item)}</span>`).join('');
  const support = getProjectSupportLabels(project, language)
    .map((item) => `<span class="stack-pill">${escapeHtml(item)}</span>`)
    .join('');
  const mediaMarkup = renderProjectMedia(project, language);
  const footerNote = siteCopy.projectsPage.emptyLinks[language];
  const deleteAction = project.isCustom
    ? `
      <button class="detail-card__action" type="button" data-project-delete="${escapeHtml(project.slug)}">
        ${escapeHtml(projectsUiCopy.deleteProject[language])}
      </button>
    `
    : '';

  return `
    <div class="detail-card__scroll">
      <div class="detail-card__header">
        <span class="detail-card__eyebrow">${escapeHtml(project.year)}</span>
      </div>
      <h3>${escapeHtml(project.title[language])}</h3>
      <p class="detail-card__role">${escapeHtml(getProjectRoleLabels(project, language).join(' / '))}</p>
      <p>${escapeHtml(project.description[language])}</p>
      ${
        support
          ? `
            <div class="detail-card__stack">
              <span class="detail-card__section-label">${escapeHtml(projectsUiCopy.fieldSupport[language])}</span>
              <div class="stack-pill-row">${support}</div>
            </div>
          `
          : ''
      }
      ${
        stack
          ? `
            <div class="detail-card__stack">
              <span class="detail-card__section-label">${escapeHtml(siteCopy.projectsPage.stackLabel[language])}</span>
              <div class="stack-pill-row">${stack}</div>
            </div>
          `
          : ''
      }
      ${mediaMarkup}
      <div class="detail-card__footer">
        <p class="detail-card__footnote">${escapeHtml(footerNote)}</p>
        ${deleteAction}
      </div>
    </div>
  `;
}

function renderProjectSpotlight(project, language, index, total) {
  const stack = project.stack
    .slice(0, 3)
    .map((item) => `<span class="project-carousel__stack-pill">${escapeHtml(item)}</span>`)
    .join('');
  const thumbnail = getProjectThumbnail(project);
  const backgroundStyle = thumbnail
    ? ` style="--project-spotlight-image: url(&quot;${escapeHtml(escapeCssUrl(thumbnail))}&quot;)"`
    : '';

  return `
    <article
      class="project-carousel__slide${index === 0 ? ' is-active' : ''}"
      data-project-slide="${index}"
      aria-hidden="${index === 0 ? 'false' : 'true'}"
      ${backgroundStyle}
    >
      <div class="project-carousel__copy">
        <div class="project-carousel__panel project-carousel__panel--meta">
          <div class="project-carousel__meta">
            <span>${escapeHtml(project.year)}</span>
          </div>
        </div>
        <div class="project-carousel__panel project-carousel__panel--title">
          <h2>${escapeHtml(project.title[language])}</h2>
        </div>
        <div class="project-carousel__panel project-carousel__panel--role">
          <p class="project-carousel__role">${escapeHtml(getProjectRoleLabels(project, language).join(' / '))}</p>
        </div>
        ${
          stack
            ? `
              <div class="project-carousel__panel project-carousel__panel--stack">
                <div class="project-carousel__stack">${stack}</div>
              </div>
            `
            : ''
        }
      </div>
    </article>
  `;
}

function renderWorkshopPanel(language, customCount) {
  const countLabel = customCount
    ? `<span class="project-workshop__count">${escapeHtml(projectsUiCopy.workshopCount[language](customCount))}</span>`
    : '';
  const exportDisabled = customCount ? '' : ' disabled';

  return `
    <section class="project-workshop" data-reveal>
      <div class="project-workshop__copy">
        <p class="eyebrow">${escapeHtml(projectsUiCopy.workshopEyebrow[language])}</p>
        <h3>${escapeHtml(projectsUiCopy.workshopTitle[language])}</h3>
        <p>${escapeHtml(projectsUiCopy.workshopBody[language])}</p>
      </div>
      <div class="project-workshop__actions">
        ${countLabel}
        <button class="project-workshop__button" type="button" data-project-workshop-open>
          ${escapeHtml(projectsUiCopy.addProject[language])}
        </button>
        <button class="project-workshop__button project-workshop__button--secondary" type="button" data-project-export${exportDisabled}>
          ${escapeHtml(projectsUiCopy.exportProjects[language])}
        </button>
        <button class="project-workshop__button project-workshop__button--secondary" type="button" data-project-save-file${exportDisabled}>
          ${escapeHtml(projectsUiCopy.saveProjectsFile[language])}
        </button>
        <button class="project-workshop__button project-workshop__button--secondary" type="button" data-project-copy-export${exportDisabled}>
          ${escapeHtml(projectsUiCopy.copyProjectsCode[language])}
        </button>
        <p class="project-workshop__status" data-project-export-status aria-live="polite">
          ${customCount ? '' : escapeHtml(projectsUiCopy.noLocalProjects[language])}
        </p>
      </div>
    </section>
  `;
}

function renderProjectModal(language) {
  return `
    <div class="project-modal" data-project-modal hidden>
      <div class="project-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <div class="project-modal__header">
          <div>
            <p class="eyebrow">${escapeHtml(projectsUiCopy.workshopEyebrow[language])}</p>
            <h3 id="project-modal-title" data-project-modal-title>${escapeHtml(projectsUiCopy.modalTitleCreate[language])}</h3>
          </div>
          <button class="project-modal__close" type="button" data-project-modal-close aria-label="${escapeHtml(projectsUiCopy.modalClose[language])}">
            <span aria-hidden="true">x</span>
          </button>
        </div>
        <p class="project-modal__intro">${escapeHtml(projectsUiCopy.modalIntro[language])}</p>
        <form class="project-form" data-project-form>
          <div class="project-form__section">
            <p class="project-form__section-title">${escapeHtml(projectsUiCopy.sectionIdentity[language])}</p>
            <div class="project-form__grid project-form__grid--compact">
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldTitleFr[language])}</span>
                <input name="titleFr" type="text" required />
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldTitleEn[language])}</span>
                <input name="titleEn" type="text" />
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldRoleFr[language])}</span>
                <textarea name="rolesFr" rows="3" required></textarea>
                <small>${escapeHtml(projectsUiCopy.fieldRoleHint[language])}</small>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldRoleEn[language])}</span>
                <textarea name="rolesEn" rows="3"></textarea>
                <small>${escapeHtml(projectsUiCopy.fieldRoleHint[language])}</small>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldYear[language])}</span>
                <input name="year" type="number" min="2000" max="2100" value="${new Date().getFullYear()}" required />
              </label>
              <label class="project-form__checkbox">
                <input name="spotlight" type="checkbox" />
                <span>${escapeHtml(projectsUiCopy.fieldSpotlight[language])}</span>
              </label>
            </div>
          </div>

          <div class="project-form__section">
            <p class="project-form__section-title">${escapeHtml(projectsUiCopy.sectionContent[language])}</p>
            <div class="project-form__grid">
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldSummaryFr[language])}</span>
                <textarea name="summaryFr" rows="3" required></textarea>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldSummaryEn[language])}</span>
                <textarea name="summaryEn" rows="3"></textarea>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldDescriptionFr[language])}</span>
                <textarea name="descriptionFr" rows="5" required></textarea>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldDescriptionEn[language])}</span>
                <textarea name="descriptionEn" rows="5"></textarea>
              </label>
            </div>
          </div>

          <div class="project-form__section">
            <p class="project-form__section-title">${escapeHtml(projectsUiCopy.sectionDetails[language])}</p>
            <div class="project-form__grid">
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldSupport[language])}</span>
                <textarea name="support" rows="3"></textarea>
                <small>${escapeHtml(projectsUiCopy.fieldSupportHint[language])}</small>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldStack[language])}</span>
                <textarea name="stack" rows="4"></textarea>
                <small>${escapeHtml(projectsUiCopy.fieldStackHint[language])}</small>
              </label>
            </div>
          </div>

          <div class="project-form__section">
            <p class="project-form__section-title">${escapeHtml(projectsUiCopy.sectionMedia[language])}</p>
            <div class="project-form__grid">
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldBanner[language])}</span>
                <input name="banner" type="url" />
                <small>${escapeHtml(projectsUiCopy.fieldBannerHint[language])}</small>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldImages[language])}</span>
                <textarea name="images" rows="4"></textarea>
                <small>${escapeHtml(projectsUiCopy.fieldMediaHint[language])}</small>
              </label>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldVideos[language])}</span>
                <textarea name="videos" rows="4"></textarea>
                <small>${escapeHtml(projectsUiCopy.fieldMediaHint[language])}</small>
              </label>
            </div>
          </div>

          <p class="project-form__status" data-project-form-status aria-live="polite"></p>
          <div class="project-form__actions">
            <button class="project-form__secondary" type="button" data-project-modal-close>
              ${escapeHtml(projectsUiCopy.modalCancel[language])}
            </button>
            <button class="project-form__primary" type="submit">
              <span data-project-submit-label>${escapeHtml(projectsUiCopy.modalSaveCreate[language])}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderProjectLightbox(language) {
  return `
    <div class="project-lightbox" data-project-lightbox hidden>
      <div class="project-lightbox__dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(projectsUiCopy.mediaGallery[language])}">
        <button class="project-lightbox__close" type="button" data-project-lightbox-close aria-label="${escapeHtml(projectsUiCopy.lightboxClose[language])}">
          <span aria-hidden="true">x</span>
        </button>
        <div class="project-lightbox__stage" data-project-lightbox-stage></div>
        <div class="project-lightbox__footer">
          <div class="project-lightbox__meta">
            <span class="detail-card__section-label" data-project-lightbox-count></span>
            <strong data-project-lightbox-title></strong>
          </div>
          <div class="project-lightbox__dots" data-project-lightbox-dots></div>
        </div>
        <button class="project-lightbox__nav project-lightbox__nav--prev" type="button" data-project-lightbox-nav="prev" aria-label="${escapeHtml(projectsUiCopy.mediaPrev[language])}">
          <span class="project-lightbox__nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M14.75 5.75L8.5 12l6.25 6.25" />
            </svg>
          </span>
        </button>
        <button class="project-lightbox__nav project-lightbox__nav--next" type="button" data-project-lightbox-nav="next" aria-label="${escapeHtml(projectsUiCopy.mediaNext[language])}">
          <span class="project-lightbox__nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M9.25 5.75L15.5 12l-6.25 6.25" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  `;
}

function buildProjectPayload(form) {
  const formData = new FormData(form);
  const titleFr = String(formData.get('titleFr') ?? '').trim();
  const titleEn = String(formData.get('titleEn') ?? '').trim() || titleFr;
  const rolesFr = splitTextareaList(formData.get('rolesFr'));
  const rolesEnSource = splitTextareaList(formData.get('rolesEn'));
  const summaryFr = String(formData.get('summaryFr') ?? '').trim();
  const summaryEn = String(formData.get('summaryEn') ?? '').trim() || summaryFr;
  const descriptionFr = String(formData.get('descriptionFr') ?? '').trim();
  const descriptionEn = String(formData.get('descriptionEn') ?? '').trim() || descriptionFr;

  return {
    year: String(formData.get('year') ?? '').trim(),
    spotlight: formData.get('spotlight') === 'on',
    banner: String(formData.get('banner') ?? '').trim(),
    support: splitTextareaList(formData.get('support'), { allowComma: true }),
    title: { fr: titleFr, en: titleEn },
    roles: {
      fr: rolesFr,
      en: rolesEnSource.length ? rolesEnSource : rolesFr,
    },
    summary: { fr: summaryFr, en: summaryEn },
    description: { fr: descriptionFr, en: descriptionEn },
    stack: splitTextareaList(formData.get('stack'), { allowComma: true }),
    outcomes: { fr: [], en: [] },
    media: {
      images: splitTextareaList(formData.get('images')),
      videos: splitTextareaList(formData.get('videos')),
    },
  };
}

export const renderProjectsPage = {
  pageId: 'projects',
  createContent: ({ t, language }) => {
    const allProjects = getAllProjects();
    const spotlightProjects = [
      ...sortSpotlightProjects(allProjects.filter((project) => project.spotlight)),
      ...allProjects.filter((project) => !project.spotlight),
    ].slice(0, Math.min(3, allProjects.length));
    const activeProject = getInitialProject(allProjects);
    const customCount = getStoredProjects().length;
    const spotlightMarkup = spotlightProjects
      .map((project, index) => renderProjectSpotlight(project, language, index, spotlightProjects.length))
      .join('');
    const spotlightDots = spotlightProjects
      .map(
        (project, index) => {
          const dotThumbnail = getProjectThumbnail(project);
          const dotBackgroundStyle = dotThumbnail
            ? ` style="--project-dot-image: url(&quot;${escapeHtml(escapeCssUrl(dotThumbnail))}&quot;)"`
            : '';

          return `
          <button
            class="project-carousel__dot${index === 0 ? ' is-active' : ''}"
            type="button"
            data-project-dot="${index}"
            aria-label="${language === 'fr' ? `Afficher ${project.title.fr}` : `Show ${project.title.en}`}"
            aria-pressed="${index === 0 ? 'true' : 'false'}"
            ${dotBackgroundStyle}
          >
            <span class="project-carousel__dot-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="project-carousel__dot-title">${escapeHtml(project.title[language])}</span>
          </button>
        `;
        }
      )
      .join('');

    return `
      <section class="project-spotlight section-shell" data-reveal>
        <h1 class="sr-only">${escapeHtml(t(siteCopy.projectsPage.title))}</h1>
        <div class="project-carousel" data-project-carousel>
          <div class="project-carousel__viewport">
            ${spotlightMarkup}
            <button class="project-carousel__nav project-carousel__nav--prev" type="button" data-project-nav="prev" aria-label="${language === 'fr' ? 'Projet precedent' : 'Previous project'}">
              <span class="project-carousel__nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M14.75 5.75L8.5 12l6.25 6.25" />
                </svg>
              </span>
            </button>
            <button class="project-carousel__nav project-carousel__nav--next" type="button" data-project-nav="next" aria-label="${language === 'fr' ? 'Projet suivant' : 'Next project'}">
              <span class="project-carousel__nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M9.25 5.75L15.5 12l-6.25 6.25" />
                </svg>
              </span>
            </button>
          </div>
          <div class="project-carousel__dots" aria-label="${language === 'fr' ? 'Projets a la une' : 'Spotlight projects'}">
            ${spotlightDots}
          </div>
        </div>
      </section>

      <section class="projects-workspace section-shell">
        <div class="projects-toolbar" data-reveal>
          <div class="projects-filter-row">
            ${renderProjectFilterSelects(allProjects, language)}
          </div>
          <div class="projects-toolbar__sort">
            ${renderSortButton(language)}
          </div>
        </div>
        <div class="projects-stage">
          <div class="projects-grid" data-project-grid>
            ${allProjects.map((project, index) => renderProjectCard(project, language, index)).join('')}
          </div>
          <aside class="detail-card detail-card--project" data-reveal data-project-detail>
            ${renderProjectDetail(activeProject, language)}
          </aside>
        </div>
        ${renderWorkshopPanel(language, customCount)}
      </section>

      ${renderProjectModal(language)}
      ${renderProjectLightbox(language)}
    `;
  },
  enhance: ({ root, pageRoot, language, rerender }) => {
    const projectList = getAllProjects();
    const cards = Array.from(root.querySelectorAll('[data-project-card]'));
    const cardEditButtons = Array.from(root.querySelectorAll('[data-project-card-edit]'));
    const cardDeleteButtons = Array.from(root.querySelectorAll('[data-project-card-delete]'));
    const filterSelects = Array.from(root.querySelectorAll('[data-project-filter-select]'));
    const sortToggle = root.querySelector('[data-project-sort-toggle]');
    const grid = root.querySelector('[data-project-grid]');
    const detail = root.querySelector('[data-project-detail]');
    const carousel = root.querySelector('[data-project-carousel]');
    const workshopOpenButton = root.querySelector('[data-project-workshop-open]');
    const exportProjectsButton = root.querySelector('[data-project-export]');
    const saveProjectsFileButton = root.querySelector('[data-project-save-file]');
    const copyExportButton = root.querySelector('[data-project-copy-export]');
    const exportStatus = root.querySelector('[data-project-export-status]');
    const modal = root.querySelector('[data-project-modal]');
    const form = root.querySelector('[data-project-form]');
    const status = root.querySelector('[data-project-form-status]');
    const modalTitle = root.querySelector('[data-project-modal-title]');
    const submitLabel = root.querySelector('[data-project-submit-label]');
    const lightbox = root.querySelector('[data-project-lightbox]');
    const lightboxStage = root.querySelector('[data-project-lightbox-stage]');
    const lightboxTitle = root.querySelector('[data-project-lightbox-title]');
    const lightboxCount = root.querySelector('[data-project-lightbox-count]');
    const lightboxDots = root.querySelector('[data-project-lightbox-dots]');
    const lightboxCloseButton = root.querySelector('[data-project-lightbox-close]');

    let activeFilters = { role: '', support: '', tool: '' };
    let activeSort = 'desc';
    let activeProject = getInitialProject(projectList);
    let editingProject = null;
    let lightboxItems = [];
    let lightboxIndex = 0;
    let lastLightboxTrigger = null;
    const projectOrder = new Map(projectList.map((project, index) => [project.slug, index]));
    const cardShellsBySlug = new Map(
      cards.map((card) => [card.dataset.projectCard, card.closest('.project-card-shell')])
    );

    const preservePageScroll = (callback) => {
      const previousScrollTop = pageRoot?.scrollTop;
      callback();
      if (!Number.isFinite(previousScrollTop)) return;

      pageRoot.scrollTop = previousScrollTop;
      requestAnimationFrame(() => {
        pageRoot.scrollTop = previousScrollTop;
      });
    };

    const matchesOption = (options, activeValue) => {
      if (!activeValue) return true;
      const normalizedActive = normalizeFilterValue(activeValue);
      return options.some((option) => normalizeFilterValue(option) === normalizedActive);
    };

    const getVisibleProjects = () =>
      projectList.filter(
        (project) =>
          matchesOption(getProjectRoleLabels(project, language), activeFilters.role) &&
          matchesOption(getProjectSupportLabels(project, language), activeFilters.support) &&
          matchesOption(getProjectToolLabels(project), activeFilters.tool)
      );

    const sortProjects = (projects) =>
      [...projects].sort((left, right) => {
        const leftYear = Number.parseInt(left.year, 10) || 0;
        const rightYear = Number.parseInt(right.year, 10) || 0;
        const yearDelta = activeSort === 'asc' ? leftYear - rightYear : rightYear - leftYear;
        if (yearDelta !== 0) return yearDelta;
        return (projectOrder.get(left.slug) ?? 0) - (projectOrder.get(right.slug) ?? 0);
      });

    const fillFormFromProject = (project) => {
      if (!form) return;

      form.reset();
      form.elements.titleFr.value = project?.title.fr ?? '';
      form.elements.titleEn.value = project?.title.en ?? '';
      form.elements.rolesFr.value = getProjectRoleLabels(project, 'fr').join('\n');
      form.elements.rolesEn.value = getProjectRoleLabels(project, 'en').join('\n');
      form.elements.year.value = project?.year ?? new Date().getFullYear();
      form.elements.spotlight.checked = Boolean(project?.spotlight);
      form.elements.summaryFr.value = project?.summary.fr ?? '';
      form.elements.summaryEn.value = project?.summary.en ?? '';
      form.elements.descriptionFr.value = project?.description.fr ?? '';
      form.elements.descriptionEn.value = project?.description.en ?? '';
      form.elements.support.value = getProjectSupportLabels(project, 'fr').join('\n');
      form.elements.stack.value = (project?.stack ?? []).join('\n');
      form.elements.banner.value = project?.banner ?? '';
      form.elements.images.value = (project?.media?.images ?? []).join('\n');
      form.elements.videos.value = (project?.media?.videos ?? []).join('\n');

    };

    const syncDetail = () => {
      if (!detail) return;
      detail.innerHTML = renderProjectDetail(activeProject, language);
      Array.from(detail.querySelectorAll('[data-project-media-carousel]')).forEach((carouselElement) => {
        syncDetailMediaCarousel(carouselElement, 0);
      });
      rememberActiveProjectSlug(activeProject?.slug ?? '');
    };

    const syncDetailMediaCarousel = (carouselElement, nextIndex = 0) => {
      if (!carouselElement) return;

      const slides = Array.from(carouselElement.querySelectorAll('[data-project-media-slide]'));
      if (!slides.length) return;

      const total = slides.length;
      const safeIndex = ((Number(nextIndex) || 0) + total) % total;
      carouselElement.dataset.activeMediaIndex = String(safeIndex);

      slides.forEach((slide, index) => {
        const isActive = index === safeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
    };

    const renderLightboxMedia = (item) => {
      if (!item) return '';

      if (item.type === 'image') {
        return `<img src="${escapeHtml(item.source)}" alt="${escapeHtml(item.title)}" />`;
      }

      if (item.embedUrl) {
        return `
          <iframe
            src="${escapeHtml(item.autoplayUrl)}"
            title="${escapeHtml(item.title)}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        `;
      }

      return `<video controls autoplay preload="metadata" src="${escapeHtml(item.source)}"></video>`;
    };

    const syncLightbox = () => {
      if (!lightboxStage || !lightboxTitle || !lightboxCount || !lightboxDots || !lightboxItems.length) return;

      const item = lightboxItems[lightboxIndex];
      lightboxStage.innerHTML = renderLightboxMedia(item);
      lightboxTitle.textContent = item.title;
      lightboxCount.textContent = `${String(lightboxIndex + 1).padStart(2, '0')} / ${String(lightboxItems.length).padStart(2, '0')}`;
      lightboxDots.innerHTML = lightboxItems
        .map(
          (mediaItem, index) => `
            <button
              class="project-lightbox__dot${index === lightboxIndex ? ' is-active' : ''}"
              type="button"
              data-project-lightbox-dot="${index}"
              aria-label="${escapeHtml(mediaItem.label)}"
              aria-pressed="${index === lightboxIndex ? 'true' : 'false'}"
            >
              ${String(index + 1).padStart(2, '0')}
            </button>
          `
        )
        .join('');

      Array.from(root.querySelectorAll('[data-project-lightbox-nav]')).forEach((button) => {
        button.hidden = lightboxItems.length < 2;
      });
    };

    const closeLightbox = () => {
      if (!lightbox || lightbox.hidden) return;
      lightbox.hidden = true;
      lightbox.classList.remove('is-open');
      if (lightboxStage) lightboxStage.innerHTML = '';
      lightboxItems = [];
      lightboxIndex = 0;
      lastLightboxTrigger?.focus?.();
      lastLightboxTrigger = null;
    };

    const openLightbox = (kind = 'all', startIndex = 0, trigger = null) => {
      if (!lightbox || !activeProject) return;

      const mediaItems = getProjectMediaItems(activeProject, language, kind);
      if (!mediaItems.length) return;

      lightboxItems = mediaItems;
      lightboxIndex = ((Number(startIndex) || 0) + mediaItems.length) % mediaItems.length;
      lastLightboxTrigger = trigger;
      lightbox.hidden = false;
      lightbox.classList.add('is-open');
      syncLightbox();
      lightboxCloseButton?.focus();
    };

    const syncCards = ({ reorder = true } = {}) => {
      const visibleProjects = sortProjects(getVisibleProjects());

      if (!visibleProjects.some((project) => project.slug === activeProject?.slug)) {
        activeProject = visibleProjects[0] ?? null;
      }

      if (grid && reorder) {
        const visibleSlugs = new Set(visibleProjects.map((project) => project.slug));
        const hiddenProjects = projectList.filter((project) => !visibleSlugs.has(project.slug));
        [...visibleProjects, ...hiddenProjects].forEach((project) => {
          const cardShell = cardShellsBySlug.get(project.slug);
          if (cardShell) grid.append(cardShell);
        });
      }

      cards.forEach((card) => {
        const cardShell = card.closest('.project-card-shell');
        const cardProject = projectList.find((project) => project.slug === card.dataset.projectCard);
        const matches = cardProject
          ? matchesOption(getProjectRoleLabels(cardProject, language), activeFilters.role) &&
            matchesOption(getProjectSupportLabels(cardProject, language), activeFilters.support) &&
            matchesOption(getProjectToolLabels(cardProject), activeFilters.tool)
          : false;
        if (cardShell) cardShell.hidden = !matches;
        card.classList.toggle('is-selected', card.dataset.projectCard === activeProject?.slug);
      });
    };

    const syncFilters = () => {
      filterSelects.forEach((select) => {
        const filterName = select.dataset.projectFilterSelect;
        if (filterName && select.value !== activeFilters[filterName]) {
          select.value = activeFilters[filterName] ?? '';
        }
      });
    };

    const syncSortButton = () => {
      if (!sortToggle) return;
      const iconPath = activeSort === 'asc'
        ? '<path d="M12 18V7" /><path d="M7.5 11.5 12 7l4.5 4.5" />'
        : '<path d="M12 6v11" /><path d="m7.5 12.5 4.5 4.5 4.5-4.5" />';
      sortToggle.dataset.sortDirection = activeSort;
      sortToggle.setAttribute('aria-label', projectsUiCopy.sortDateToggleLabel[language](activeSort));
      sortToggle.innerHTML = `
        <span class="sr-only">${escapeHtml(projectsUiCopy.sortDateButton[language])}</span>
        <span class="projects-sort-button__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            ${iconPath}
          </svg>
        </span>
      `;
    };

    const openModal = (project = null) => {
      if (!modal) return;
      editingProject = project;
      modal.hidden = false;
      modal.classList.add('is-open');
      if (status) status.textContent = '';
      if (modalTitle) {
        modalTitle.textContent = project
          ? projectsUiCopy.modalTitleEdit[language]
          : projectsUiCopy.modalTitleCreate[language];
      }
      if (submitLabel) {
        submitLabel.textContent = project
          ? projectsUiCopy.modalSaveEdit[language]
          : projectsUiCopy.modalSaveCreate[language];
      }
      fillFormFromProject(
        project ?? {
          year: String(new Date().getFullYear()),
          roles: { fr: [], en: [] },
          title: { fr: '', en: '' },
          summary: { fr: '', en: '' },
          description: { fr: '', en: '' },
          stack: [],
          outcomes: { fr: [], en: [] },
          media: { images: [], videos: [] },
        }
      );
      const firstField = form?.querySelector('input[name="titleFr"]');
      firstField?.focus();
    };

    const closeModal = () => {
      if (!modal) return;
      editingProject = null;
      modal.classList.remove('is-open');
      modal.hidden = true;
      form?.reset();
      if (status) status.textContent = '';
    };

    const setExportStatus = (messageKey) => {
      if (!exportStatus) return;
      exportStatus.textContent = projectsUiCopy[messageKey]?.[language] ?? '';
    };

    const getStoredProjectsModule = () => {
      const storedProjects = getStoredProjects();
      return storedProjects.length ? exportStoredProjectsModule(storedProjects) : '';
    };

    const getProjectsDataModule = () => {
      const storedProjects = getStoredProjects();
      return storedProjects.length ? exportProjectsDataModule(storedProjects) : '';
    };

    const copyProjectExport = async () => {
      const moduleSource = getStoredProjectsModule();
      if (!moduleSource) {
        setExportStatus('noLocalProjects');
        return false;
      }

      try {
        await navigator.clipboard.writeText(moduleSource);
        setExportStatus('exportCopied');
        return true;
      } catch {
        setExportStatus('copyFailed');
        return false;
      }
    };

    const saveProjectExport = async () => {
      const moduleSource = getStoredProjectsModule();
      if (!moduleSource) {
        setExportStatus('noLocalProjects');
        return;
      }

      if (!('showSaveFilePicker' in window)) {
        await copyProjectExport();
        return;
      }

      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'projects.local-export.js',
          types: [
            {
              description: 'JavaScript module',
              accept: {
                'text/javascript': ['.js'],
              },
            },
          ],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(moduleSource);
        await writable.close();
        setExportStatus('exportSaved');
      } catch (error) {
        if (error?.name === 'AbortError') return;
        setExportStatus('exportFailed');
      }
    };

    const saveProjectsFile = async () => {
      const moduleSource = getProjectsDataModule();
      if (!moduleSource) {
        setExportStatus('noLocalProjects');
        return;
      }

      if (!('showSaveFilePicker' in window)) {
        setExportStatus('projectsFileSaveUnsupported');
        return;
      }

      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'projects.js',
          types: [
            {
              description: 'JavaScript module',
              accept: {
                'text/javascript': ['.js'],
              },
            },
          ],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(moduleSource);
        await writable.close();
        setExportStatus('projectsFileSaved');
      } catch (error) {
        if (error?.name === 'AbortError') return;
        setExportStatus('exportFailed');
      }
    };

    filterSelects.forEach((select) => {
      select.addEventListener('change', () => {
        const filterName = select.dataset.projectFilterSelect;
        if (!filterName) return;
        activeFilters = { ...activeFilters, [filterName]: select.value };
        syncFilters();
        syncCards();
        syncDetail();
      });
    });

    sortToggle?.addEventListener('click', () => {
      activeSort = activeSort === 'desc' ? 'asc' : 'desc';
      syncSortButton();
      syncCards();
      syncDetail();
    });

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const nextProject = projectList.find((project) => project.slug === card.dataset.projectCard);
        if (!nextProject) return;
        preservePageScroll(() => {
          activeProject = nextProject;
          syncCards({ reorder: false });
          syncDetail();
        });
      });
    });

    cardEditButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const slug = button.dataset.projectCardEdit;
        const project = projectList.find((item) => item.slug === slug);
        if (!project) return;

        openModal(project);
      });
    });

    cardDeleteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const slug = button.dataset.projectCardDelete;
        if (!slug) return;
        if (!window.confirm(projectsUiCopy.removeTileConfirm[language])) return;

        deleteProjectBySlug(slug);
        if (activeProject?.slug === slug) {
          clearRememberedActiveProjectSlug();
        }
        rerender();
      });
    });

    if (detail) {
      detail.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('[data-project-delete]');
        if (deleteButton) {
          const slug = deleteButton.dataset.projectDelete;
          if (!slug) return;
          if (!window.confirm(projectsUiCopy.deleteConfirm[language])) return;

          removeStoredProject(slug);
          clearRememberedActiveProjectSlug();
          rerender();
          return;
        }

        const mediaNav = event.target.closest('[data-project-media-nav]');
        if (mediaNav) {
          const carouselElement = mediaNav.closest('[data-project-media-carousel]');
          const currentIndex = Number(carouselElement?.dataset.activeMediaIndex ?? '0');
          const direction = mediaNav.dataset.projectMediaNav === 'next' ? 1 : -1;
          syncDetailMediaCarousel(carouselElement, currentIndex + direction);
          return;
        }

        const mediaSlide = event.target.closest('[data-project-media-open]');
        if (mediaSlide) {
          openLightbox(mediaSlide.dataset.projectMediaKind ?? 'all', Number(mediaSlide.dataset.projectMediaOpen), mediaSlide);
        }
      });
    }

    workshopOpenButton?.addEventListener('click', () => openModal());
    exportProjectsButton?.addEventListener('click', saveProjectExport);
    saveProjectsFileButton?.addEventListener('click', saveProjectsFile);
    copyExportButton?.addEventListener('click', copyProjectExport);

    modal?.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-project-modal-close]')) {
        closeModal();
      }
    });

    lightbox?.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.closest('[data-project-lightbox-close]')) {
        closeLightbox();
        return;
      }

      const navButton = event.target.closest('[data-project-lightbox-nav]');
      if (navButton) {
        const direction = navButton.dataset.projectLightboxNav === 'next' ? 1 : -1;
        lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
        syncLightbox();
        return;
      }

      const dotButton = event.target.closest('[data-project-lightbox-dot]');
      if (dotButton) {
        lightboxIndex = Number(dotButton.dataset.projectLightboxDot);
        syncLightbox();
      }
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form || !status) return;

      status.textContent = '';

      try {
        const payload = buildProjectPayload(form);
        const project = editingProject
          ? saveStoredProject(payload, { existingSlug: editingProject.slug })
          : addStoredProject(payload);
        rememberActiveProjectSlug(project.slug);
        rerender();
      } catch {
        status.textContent = projectsUiCopy.modalError[language];
      }
    });

    const handleKeydown = (event) => {
      if (event.key === 'Escape' && modal && !modal.hidden) {
        closeModal();
        return;
      }

      if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
        closeLightbox();
        return;
      }

      if (lightbox && !lightbox.hidden && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        lightboxIndex =
          event.key === 'ArrowRight'
            ? (lightboxIndex + 1) % lightboxItems.length
            : (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
        syncLightbox();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    if (carousel) {
      const slides = Array.from(carousel.querySelectorAll('[data-project-slide]'));
      const dots = Array.from(carousel.querySelectorAll('[data-project-dot]'));
      const navButtons = Array.from(carousel.querySelectorAll('[data-project-nav]'));
      let activeSlide = 0;

      const syncCarousel = () => {
        slides.forEach((slide, index) => {
          const isActive = index === activeSlide;
          slide.classList.toggle('is-active', isActive);
          slide.setAttribute('aria-hidden', String(!isActive));
        });

        dots.forEach((dot, index) => {
          const isActive = index === activeSlide;
          dot.classList.toggle('is-active', isActive);
          dot.setAttribute('aria-pressed', String(isActive));
        });
      };

      navButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const direction = button.dataset.projectNav === 'next' ? 1 : -1;
          activeSlide = (activeSlide + direction + slides.length) % slides.length;
          syncCarousel();
        });
      });

      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          activeSlide = Number(dot.dataset.projectDot);
          syncCarousel();
        });
      });

      carousel.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        activeSlide =
          event.key === 'ArrowRight'
            ? (activeSlide + 1) % slides.length
            : (activeSlide - 1 + slides.length) % slides.length;
        syncCarousel();
      });

      syncCarousel();
    }

    syncFilters();
    syncSortButton();
    syncCards();
    syncDetail();

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  },
};
