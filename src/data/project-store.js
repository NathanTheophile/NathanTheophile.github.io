import { projectFilters, projects } from './projects.js';

export const PROJECTS_STORAGE_KEY = 'nt-portfolio-custom-projects';
export const ACTIVE_PROJECT_STORAGE_KEY = 'nt-portfolio-active-project';
export const HIDDEN_PROJECTS_STORAGE_KEY = 'nt-portfolio-hidden-projects';

export const projectAccentOptions = [
  { id: 'development', label: { fr: 'Developpement', en: 'Development' } },
  { id: 'art', label: { fr: 'Direction visuelle', en: 'Art direction' } },
  { id: 'creativity', label: { fr: 'Creativite', en: 'Creativity' } },
];

const validFilterIds = new Set(projectFilters.map((filter) => filter.id).filter((id) => id !== 'all'));
const validAccentIds = new Set(projectAccentOptions.map((accent) => accent.id));

function getStorage(kind) {
  try {
    return window?.[kind] ?? null;
  } catch {
    return null;
  }
}

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function ensureStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => trimString(entry)).filter(Boolean);
}

function ensureLocalizedStringList(value, fallbackList = []) {
  if (Array.isArray(value)) {
    const list = ensureStringList(value);
    return { fr: list, en: list };
  }

  if (typeof value === 'string') {
    const entry = trimString(value);
    const list = entry ? [entry] : fallbackList;
    return { fr: list, en: list };
  }

  const readSide = (sideValue) => {
    if (Array.isArray(sideValue)) return ensureStringList(sideValue);
    if (typeof sideValue === 'string') {
      const entry = trimString(sideValue);
      return entry ? [entry] : [];
    }
    return [];
  };

  const fr = readSide(value?.fr);
  const en = readSide(value?.en);
  const frList = fr.length ? fr : en.length ? en : fallbackList;
  const enList = en.length ? en : fr.length ? fr : fallbackList;

  return { fr: frList, en: enList };
}

function ensureLocalizedValue(value, fallback = '') {
  if (typeof value === 'string') {
    const normalized = trimString(value) || fallback;
    return { fr: normalized, en: normalized };
  }

  const fr = trimString(value?.fr) || trimString(value?.en) || fallback;
  const en = trimString(value?.en) || trimString(value?.fr) || fallback;
  return { fr, en };
}

function ensureLocalizedList(value, fallbackList = []) {
  if (Array.isArray(value)) {
    const list = ensureStringList(value);
    return { fr: list, en: list };
  }

  const fr = ensureStringList(value?.fr);
  const en = ensureStringList(value?.en);
  const frList = fr.length ? fr : en.length ? en : fallbackList;
  const enList = en.length ? en : fr.length ? fr : fallbackList;

  return { fr: frList, en: enList };
}

function ensureMedia(value = {}) {
  return {
    images: ensureStringList(value?.images),
    videos: ensureStringList(value?.videos),
  };
}

function ensureFilters(value) {
  const normalized = (Array.isArray(value) ? value : [value])
    .map((entry) => trimString(entry))
    .filter((entry) => validFilterIds.has(entry));

  return normalized.length ? [...new Set(normalized)] : ['prototype'];
}

export function createProjectSlug(value, fallback = 'project') {
  const normalized = trimString(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || fallback;
}

export function normalizeProjectRecord(input = {}, { custom = false } = {}) {
  const title = ensureLocalizedValue(input.title, custom ? 'Untitled project' : 'Project');
  const roles = ensureLocalizedStringList(input.roles ?? input.role, []);
  const fallbackRole = roles.fr[0] || roles.en[0] || title.fr;
  const summary = ensureLocalizedValue(input.summary, fallbackRole);
  const description = ensureLocalizedValue(input.description, summary.fr);
  const support = ensureLocalizedList(input.support ?? input.platforms, []);
  const stack = ensureStringList(input.stack);
  const outcomes = ensureLocalizedList(input.outcomes, []);
  const filters = ensureFilters(input.filters ?? input.filter);
  const year = trimString(String(input.year ?? '')) || String(new Date().getFullYear());
  const slugSource = trimString(input.slug) || title.fr || title.en;
  const createdAt = Number.isFinite(Number(input.createdAt)) ? Number(input.createdAt) : Date.now();

  return {
    slug: createProjectSlug(slugSource),
    year,
    filter: filters[0],
    filters,
    featured: Boolean(input.featured),
    spotlight: Boolean(input.spotlight),
    accent: validAccentIds.has(input.accent) ? input.accent : 'development',
    title,
    role: ensureLocalizedValue(input.role, fallbackRole),
    roles,
    summary,
    description,
    banner: trimString(input.banner),
    support,
    stack,
    outcomes,
    media: ensureMedia(input.media),
    links: Array.isArray(input.links) ? input.links : [],
    isCustom: custom || Boolean(input.isCustom),
    createdAt,
  };
}

function serializeStoredProjects(projectList) {
  return projectList.map((project) => normalizeProjectRecord(project, { custom: true }));
}

function createExportProject(project) {
  const normalized = normalizeProjectRecord(project, { custom: false });

  return {
    slug: normalized.slug,
    year: normalized.year,
    filter: normalized.filter,
    filters: normalized.filters,
    featured: normalized.featured,
    spotlight: normalized.spotlight,
    accent: normalized.accent,
    title: normalized.title,
    role: normalized.role,
    roles: normalized.roles,
    summary: normalized.summary,
    description: normalized.description,
    banner: normalized.banner,
    support: normalized.support,
    stack: normalized.stack,
    outcomes: normalized.outcomes,
    media: normalized.media,
    links: normalized.links,
  };
}

export function getStoredProjects() {
  const storage = getStorage('localStorage');
  if (!storage) return [];

  try {
    const rawValue = storage.getItem(PROJECTS_STORAGE_KEY) ?? '[]';
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((project) => normalizeProjectRecord(project, { custom: true }))
      .sort((left, right) => right.createdAt - left.createdAt);
  } catch {
    return [];
  }
}

export function setStoredProjects(projectList) {
  const storage = getStorage('localStorage');
  if (!storage) return;

  storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(serializeStoredProjects(projectList)));
}

export function getExportableStoredProjects() {
  return getStoredProjects().map(createExportProject);
}

export function exportStoredProjectsModule(projectList = getExportableStoredProjects()) {
  const exportableProjects = projectList.map(createExportProject);
  return [
    '// Generated from the local portfolio project editor.',
    '// Paste these records into src/data/projects.js, or import this module and merge the array.',
    `export const exportedProjects = ${JSON.stringify(exportableProjects, null, 2)};`,
    '',
    'export default exportedProjects;',
    '',
  ].join('\n');
}

export function exportProjectsDataModule(projectList = getExportableStoredProjects()) {
  const exportableProjects = projectList.map(createExportProject);
  return [
    '// Generated from the local portfolio project editor.',
    '// This file can replace src/data/projects.js.',
    `export const projectFilters = ${JSON.stringify(projectFilters, null, 2)};`,
    '',
    `export const projects = ${JSON.stringify(exportableProjects, null, 2)};`,
    '',
  ].join('\n');
}

function createUniqueSlug(baseSlug, existingSlugs) {
  if (!existingSlugs.has(baseSlug)) return baseSlug;
  return `${baseSlug}-${Date.now().toString(36)}`;
}

function getHiddenProjectSlugs() {
  const storage = getStorage('localStorage');
  if (!storage) return [];

  try {
    const rawValue = storage.getItem(HIDDEN_PROJECTS_STORAGE_KEY) ?? '[]';
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((slug) => trimString(slug)).filter(Boolean);
  } catch {
    return [];
  }
}

function setHiddenProjectSlugs(slugs) {
  const storage = getStorage('localStorage');
  if (!storage) return;

  storage.setItem(HIDDEN_PROJECTS_STORAGE_KEY, JSON.stringify([...new Set(slugs)]));
}

export function getAllProjects() {
  const storedProjects = getStoredProjects();
  const staticProjects = projects.map((project) => normalizeProjectRecord(project));
  const storedSlugs = new Set(storedProjects.map((project) => project.slug));
  const hiddenSlugs = new Set(getHiddenProjectSlugs());
  return [...storedProjects, ...staticProjects.filter((project) => !storedSlugs.has(project.slug))].filter(
    (project) => !hiddenSlugs.has(project.slug)
  );
}

export function addStoredProject(input) {
  const normalized = normalizeProjectRecord(
    { ...input, isCustom: true, createdAt: input.createdAt ?? Date.now() },
    { custom: true }
  );
  const existingSlugs = new Set(getAllProjects().map((project) => project.slug));
  const project = {
    ...normalized,
    slug: createUniqueSlug(normalized.slug, existingSlugs),
  };
  const nextProjects = [project, ...getStoredProjects()];

  setStoredProjects(nextProjects);
  return project;
}

export function saveStoredProject(input, options = {}) {
  const existingSlug = trimString(options.existingSlug);
  const storedProjects = getStoredProjects();
  const previousProject = storedProjects.find((project) => project.slug === existingSlug);
  const normalized = normalizeProjectRecord(
    {
      ...input,
      slug: existingSlug || input.slug,
      isCustom: true,
      createdAt: previousProject?.createdAt ?? input.createdAt ?? Date.now(),
    },
    { custom: true }
  );

  const shouldPreserveSlug = Boolean(existingSlug);
  const existingSlugs = new Set(
    getAllProjects()
      .map((project) => project.slug)
      .filter((slug) => slug !== existingSlug)
  );
  const nextSlug = shouldPreserveSlug ? existingSlug : createUniqueSlug(normalized.slug, existingSlugs);
  const nextProject = {
    ...normalized,
    slug: nextSlug,
  };
  const nextProjects = [
    nextProject,
    ...storedProjects.filter((project) => project.slug !== existingSlug && project.slug !== nextSlug),
  ];

  setStoredProjects(nextProjects);
  return nextProject;
}

function hideProjectSlug(slug) {
  if (!slug) return;
  const nextHiddenSlugs = [...getHiddenProjectSlugs(), slug];
  setHiddenProjectSlugs(nextHiddenSlugs);
}

export function removeStoredProject(slug) {
  const nextProjects = getStoredProjects().filter((project) => project.slug !== slug);
  setStoredProjects(nextProjects);
}

export function deleteProjectBySlug(slug) {
  const customProjects = getStoredProjects();
  const isCustomProject = customProjects.some((project) => project.slug === slug);

  if (isCustomProject) {
    removeStoredProject(slug);
    return;
  }

  hideProjectSlug(slug);
}

export function rememberActiveProjectSlug(slug) {
  const storage = getStorage('sessionStorage');
  if (!storage) return;

  if (slug) {
    storage.setItem(ACTIVE_PROJECT_STORAGE_KEY, slug);
    return;
  }

  storage.removeItem(ACTIVE_PROJECT_STORAGE_KEY);
}

export function getRememberedActiveProjectSlug() {
  const storage = getStorage('sessionStorage');
  if (!storage) return '';
  return storage.getItem(ACTIVE_PROJECT_STORAGE_KEY) ?? '';
}

export function clearRememberedActiveProjectSlug() {
  rememberActiveProjectSlug('');
}
