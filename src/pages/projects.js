import { projectFilters } from '../data/projects.js';
import {
  addStoredProject,
  clearRememberedActiveProjectSlug,
  deleteProjectBySlug,
  getAllProjects,
  getRememberedActiveProjectSlug,
  getStoredProjects,
  projectAccentOptions,
  rememberActiveProjectSlug,
  removeStoredProject,
  saveStoredProject,
} from '../data/project-store.js';
import { siteCopy } from '../data/site.js';

const projectsUiCopy = {
  workshopEyebrow: { fr: 'Atelier local', en: 'Local workshop' },
  workshopTitle: { fr: 'Ajouter un projet sans coder', en: 'Add a project without coding' },
  workshopBody: {
    fr: 'Le formulaire ci-dessous cree des projets stockes dans ce navigateur. Parfait pour remplir la page pendant la mise au point du portfolio.',
    en: 'The form below creates projects stored in this browser. Perfect for filling the page while the portfolio is still in progress.',
  },
  workshopCount: {
    fr: (count) => `${count} projet${count > 1 ? 's' : ''} local${count > 1 ? 'aux' : ''}`,
    en: (count) => `${count} local project${count > 1 ? 's' : ''}`,
  },
  addProject: { fr: 'Ajouter un projet', en: 'Add project' },
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
  fieldFilter: { fr: 'Categories', en: 'Categories' },
  fieldAccent: { fr: 'Accent visuel', en: 'Visual accent' },
  fieldSpotlight: { fr: 'Afficher dans le carousel', en: 'Show in carousel' },
  fieldTitleFr: { fr: 'Titre (FR)', en: 'Title (FR)' },
  fieldTitleEn: { fr: 'Titre (EN)', en: 'Title (EN)' },
  fieldRoleFr: { fr: 'Roles (FR)', en: 'Roles (FR)' },
  fieldRoleEn: { fr: 'Roles (EN)', en: 'Roles (EN)' },
  fieldSummaryFr: { fr: 'Description courte (FR)', en: 'Short summary (FR)' },
  fieldSummaryEn: { fr: 'Description courte (EN)', en: 'Short summary (EN)' },
  fieldDescriptionFr: { fr: 'Description detaillee (FR)', en: 'Detailed description (FR)' },
  fieldDescriptionEn: { fr: 'Description detaillee (EN)', en: 'Detailed description (EN)' },
  fieldStack: { fr: 'Stack', en: 'Stack' },
  fieldSupport: { fr: 'Support / plateforme', en: 'Support / platform' },
  fieldBanner: { fr: 'Image banniere', en: 'Banner image' },
  fieldOutcomesFr: { fr: 'Resultats (FR)', en: 'Outcomes (FR)' },
  fieldOutcomesEn: { fr: 'Resultats (EN)', en: 'Outcomes (EN)' },
  fieldImages: { fr: 'Images', en: 'Images' },
  fieldVideos: { fr: 'Videos', en: 'Videos' },
  fieldStackHint: {
    fr: 'Une stack par ligne ou separee par des virgules.',
    en: 'One stack item per line or separated with commas.',
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
  fieldCategoryHint: {
    fr: 'Tu peux cocher plusieurs categories.',
    en: 'You can pick multiple categories.',
  },
  fieldMediaHint: {
    fr: 'Une URL par ligne. Tu peux coller des liens directs, YouTube, Vimeo, etc.',
    en: 'One URL per line. You can paste direct links, YouTube, Vimeo, and so on.',
  },
  fieldBannerHint: {
    fr: 'Une URL d image au format large. Ratio recommande: 3:1 pour la grille.',
    en: 'One wide image URL. Recommended ratio: 3:1 for the grid.',
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

function getProjectFilterLabel(filterId, language) {
  return projectFilters.find((filter) => filter.id === filterId)?.label[language] ?? filterId;
}

function getProjectAccentLabel(accentId, language) {
  return projectAccentOptions.find((accent) => accent.id === accentId)?.label[language] ?? accentId;
}

function getProjectFilterLabels(project, language) {
  return (project.filters ?? [project.filter]).map((filterId) => getProjectFilterLabel(filterId, language));
}

function getProjectRoleLabels(project, language) {
  return project.roles?.[language]?.length ? project.roles[language] : [project.role[language]];
}

function getProjectSupportLabels(project, language) {
  return project.support?.[language]?.length ? project.support[language] : [];
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
  const mediaMarkup = banner
    ? `<img src="${escapeHtml(banner)}" alt="${escapeHtml(project.title[language])}" loading="lazy" />`
    : `<span>${escapeHtml(initials)}</span>`;
  const roleSummary = getProjectRoleLabels(project, language).join(' / ');

  return `
    <article class="project-card-shell" data-filters="${escapeHtml((project.filters ?? [project.filter]).join(','))}" style="transition-delay:${index * 70}ms" data-reveal>
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
        <span class="project-card__media" data-accent="${escapeHtml(project.accent)}" data-initials="${escapeHtml(initials)}" data-has-image="${banner ? 'true' : 'false'}">
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

function renderFilterButtons(language) {
  return projectFilters
    .map(
      (filter) => `
        <button class="filter-chip" type="button" data-project-filter="${filter.id}">
          ${escapeHtml(filter.label[language])}
        </button>
      `
    )
    .join('');
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
      <span class="detail-card__eyebrow">${escapeHtml(siteCopy.projectsPage.eyebrow[language])}</span>
      <h3>${escapeHtml(siteCopy.projectsPage.title[language])}</h3>
    `;
  }

  const stack = project.stack.map((item) => `<span class="stack-pill">${escapeHtml(item)}</span>`).join('');
  const support = getProjectSupportLabels(project, language)
    .map((item) => `<span class="stack-pill">${escapeHtml(item)}</span>`)
    .join('');
  const categories = getProjectFilterLabels(project, language)
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
    <div class="detail-card__header">
      <span class="detail-card__eyebrow">${escapeHtml(project.year)}</span>
    </div>
    <h3>${escapeHtml(project.title[language])}</h3>
    <p class="detail-card__role">${escapeHtml(getProjectRoleLabels(project, language).join(' / '))}</p>
    <p>${escapeHtml(project.description[language])}</p>
    <div class="detail-card__stack">
      <span class="detail-card__section-label">${escapeHtml(projectsUiCopy.fieldFilter[language])}</span>
      <div class="stack-pill-row">${categories}</div>
    </div>
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
    <div class="detail-card__stack">
      <span class="detail-card__section-label">${escapeHtml(siteCopy.projectsPage.stackLabel[language])}</span>
      <div class="stack-pill-row">${stack}</div>
    </div>
    ${mediaMarkup}
    <div class="detail-card__footer">
      <p class="detail-card__footnote">${escapeHtml(footerNote)}</p>
      ${deleteAction}
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
      data-accent="${escapeHtml(project.accent)}"
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
      </div>
    </section>
  `;
}

function renderProjectModal(language) {
  const filterOptions = projectFilters
    .filter((filter) => filter.id !== 'all')
    .map(
      (filter) => `
        <label class="project-form__check-option">
          <input name="filters" type="checkbox" value="${filter.id}" />
          <span>${escapeHtml(filter.label[language])}</span>
        </label>
      `
    )
    .join('');
  const accentOptions = projectAccentOptions
    .map(
      (accent) => `
        <option value="${accent.id}">${escapeHtml(getProjectAccentLabel(accent.id, language))}</option>
      `
    )
    .join('');

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
              <div class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldFilter[language])}</span>
                <span class="project-form__check-grid">
                  ${filterOptions}
                </span>
                <small>${escapeHtml(projectsUiCopy.fieldCategoryHint[language])}</small>
              </div>
              <label class="project-form__field">
                <span>${escapeHtml(projectsUiCopy.fieldAccent[language])}</span>
                <select name="accent">
                  ${accentOptions}
                </select>
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
    filters: formData.getAll('filters').map((value) => String(value).trim()).filter(Boolean),
    accent: String(formData.get('accent') ?? '').trim(),
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
      ...allProjects.filter((project) => project.spotlight),
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
          <div class="filter-row">
            ${renderFilterButtons(language)}
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
  enhance: ({ root, language, rerender }) => {
    const projectList = getAllProjects();
    const cards = Array.from(root.querySelectorAll('[data-project-card]'));
    const cardEditButtons = Array.from(root.querySelectorAll('[data-project-card-edit]'));
    const cardDeleteButtons = Array.from(root.querySelectorAll('[data-project-card-delete]'));
    const filterButtons = Array.from(root.querySelectorAll('[data-project-filter]'));
    const detail = root.querySelector('[data-project-detail]');
    const carousel = root.querySelector('[data-project-carousel]');
    const workshopOpenButton = root.querySelector('[data-project-workshop-open]');
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

    let activeFilter = 'all';
    let activeProject = getInitialProject(projectList);
    let editingProject = null;
    let lightboxItems = [];
    let lightboxIndex = 0;
    let lastLightboxTrigger = null;

    const getVisibleProjects = () =>
      projectList.filter(
        (project) => activeFilter === 'all' || (project.filters ?? [project.filter]).includes(activeFilter)
      );

    const fillFormFromProject = (project) => {
      if (!form) return;

      form.reset();
      form.elements.titleFr.value = project?.title.fr ?? '';
      form.elements.titleEn.value = project?.title.en ?? '';
      form.elements.rolesFr.value = getProjectRoleLabels(project, 'fr').join('\n');
      form.elements.rolesEn.value = getProjectRoleLabels(project, 'en').join('\n');
      form.elements.year.value = project?.year ?? new Date().getFullYear();
      form.elements.accent.value = project?.accent ?? 'development';
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

      const selectedFilters = new Set(project?.filters ?? [project?.filter].filter(Boolean));
      Array.from(form.querySelectorAll('input[name="filters"]')).forEach((input) => {
        input.checked = selectedFilters.has(input.value);
      });
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

    const syncCards = () => {
      const visibleProjects = getVisibleProjects();

      if (!visibleProjects.some((project) => project.slug === activeProject?.slug)) {
        activeProject = visibleProjects[0] ?? projectList[0] ?? null;
      }

      cards.forEach((card) => {
        const cardShell = card.closest('.project-card-shell');
        const cardFilters = (cardShell?.dataset.filters ?? '').split(',').filter(Boolean);
        const matches = activeFilter === 'all' || cardFilters.includes(activeFilter);
        if (cardShell) cardShell.hidden = !matches;
        card.classList.toggle('is-selected', card.dataset.projectCard === activeProject?.slug);
      });
    };

    const syncFilters = () => {
      filterButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.projectFilter === activeFilter);
      });
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
          accent: 'development',
          filters: ['prototype'],
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

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.projectFilter ?? 'all';
        syncFilters();
        syncCards();
        syncDetail();
      });
    });

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const nextProject = projectList.find((project) => project.slug === card.dataset.projectCard);
        if (!nextProject) return;
        activeProject = nextProject;
        syncCards();
        syncDetail();
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
    syncCards();
    syncDetail();

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  },
};
