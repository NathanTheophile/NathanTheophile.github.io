import seedSkillCategories from './skills.seed.js';

export const SKILL_TREE_STORAGE_KEY = 'nt-portfolio-skill-trees';

export const skillCategories = seedSkillCategories;

const localizedKeys = ['label', 'summary', 'description', 'title', 'details'];
const allowedShapes = new Set(['core', 'diamond', 'support']);
const allowedKinds = new Set(['major', 'branch']);
const allowedSizes = new Set(['small', 'medium', 'large']);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanString(value, fallback = '') {
  if (typeof value === 'string') return value.trim();
  return fallback;
}

function sanitizeLocalizedValue(value, fallback = {}) {
  return {
    fr: cleanString(value?.fr, fallback.fr ?? ''),
    en: cleanString(value?.en, fallback.en ?? ''),
  };
}

function sanitizePoint(value, fallback) {
  const fallbackPoint = fallback ?? { x: 50, y: 50 };
  return {
    x: clamp(Number.parseFloat(value?.x) || fallbackPoint.x, 0, 100),
    y: clamp(Number.parseFloat(value?.y) || fallbackPoint.y, 0, 100),
  };
}

function sanitizeNode(node, index, fallbackNode = {}) {
  const nodeId = slugify(node?.id) || slugify(fallbackNode.id) || `node-${index + 1}`;
  const title = sanitizeLocalizedValue(node?.title, fallbackNode.title);
  const fallbackSize =
    fallbackNode.size ||
    (fallbackNode.shape === 'core' ? 'large' : fallbackNode.shape === 'support' ? 'small' : 'medium');

  return {
    id: nodeId,
    icon: cleanString(node?.icon, fallbackNode.icon || 'ND').slice(0, 4).toUpperCase() || 'ND',
    iconImage: cleanString(node?.iconImage, fallbackNode.iconImage || ''),
    shape: allowedShapes.has(node?.shape) ? node.shape : fallbackNode.shape || 'support',
    size: allowedSizes.has(node?.size) ? node.size : fallbackSize,
    title,
    summary: sanitizeLocalizedValue(node?.summary, fallbackNode.summary),
    details: sanitizeLocalizedValue(node?.details, fallbackNode.details),
    tooltipMedia: cleanString(node?.tooltipMedia, fallbackNode.tooltipMedia || ''),
    tier: cleanString(node?.tier, fallbackNode.tier || 'Support') || 'Support',
    position: sanitizePoint(node?.position, fallbackNode.position),
  };
}

function sanitizeCategory(category, index, fallbackCategory = {}) {
  const baseId = slugify(category?.id) || slugify(fallbackCategory.id) || `category-${index + 1}`;
  const localizedFallbacks = Object.fromEntries(
    localizedKeys.map((key) => [key, fallbackCategory[key]])
  );

  const nodes = Array.isArray(category?.nodes)
    ? category.nodes.map((node, nodeIndex) => {
        const fallbackNode = fallbackCategory.nodes?.find((item) => item.id === node?.id) ?? fallbackCategory.nodes?.[nodeIndex];
        return sanitizeNode(node, nodeIndex, fallbackNode);
      })
    : [];

  const uniqueNodes = [];
  const usedNodeIds = new Set();

  nodes.forEach((node) => {
    let nextId = node.id;
    let duplicateIndex = 2;
    while (usedNodeIds.has(nextId)) {
      nextId = `${node.id}-${duplicateIndex}`;
      duplicateIndex += 1;
    }
    usedNodeIds.add(nextId);
    uniqueNodes.push({ ...node, id: nextId });
  });

  const validNodeIds = new Set(uniqueNodes.map((node) => node.id));
  const seenConnections = new Set();
  const connections = Array.isArray(category?.connections)
    ? category.connections
        .map((connection) => {
          const from = connection?.from === 'origin' ? 'origin' : slugify(connection?.from);
          const to = slugify(connection?.to);
          const kind = allowedKinds.has(connection?.kind) ? connection.kind : 'branch';
          return { from, to, kind };
        })
        .filter((connection) => {
          if (!connection.to || !validNodeIds.has(connection.to)) return false;
          if (connection.from !== 'origin' && !validNodeIds.has(connection.from)) return false;
          if (connection.from === connection.to) return false;
          const signature = `${connection.from}:${connection.to}`;
          if (seenConnections.has(signature)) return false;
          seenConnections.add(signature);
          return true;
        })
    : [];

  return {
    id: baseId,
    accent: cleanString(category?.accent, fallbackCategory.accent || baseId) || baseId,
    icon: cleanString(category?.icon, fallbackCategory.icon || baseId.slice(0, 3)).slice(0, 4).toUpperCase() || 'SK',
    label: sanitizeLocalizedValue(category?.label, localizedFallbacks.label),
    summary: sanitizeLocalizedValue(category?.summary, localizedFallbacks.summary),
    description: sanitizeLocalizedValue(category?.description, localizedFallbacks.description),
    origin: sanitizePoint(category?.origin, fallbackCategory.origin),
    connections,
    nodes: uniqueNodes,
  };
}

export function cloneSkillCategories(categories = skillCategories) {
  return deepClone(categories);
}

export function sanitizeSkillCategories(categories) {
  if (!Array.isArray(categories) || !categories.length) {
    return cloneSkillCategories(skillCategories);
  }

  return categories.map((category, index) => {
    const fallbackCategory =
      skillCategories.find((item) => item.id === category?.id) ??
      skillCategories[index] ??
      {};
    return sanitizeCategory(category, index, fallbackCategory);
  });
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadSkillCategories() {
  if (!canUseLocalStorage()) {
    return cloneSkillCategories(skillCategories);
  }

  const storedValue = window.localStorage.getItem(SKILL_TREE_STORAGE_KEY);
  if (!storedValue) {
    return cloneSkillCategories(skillCategories);
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return sanitizeSkillCategories(parsedValue);
  } catch {
    return cloneSkillCategories(skillCategories);
  }
}

export function saveSkillCategories(categories) {
  const sanitized = sanitizeSkillCategories(categories);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(SKILL_TREE_STORAGE_KEY, JSON.stringify(sanitized));
  }

  return cloneSkillCategories(sanitized);
}

export function resetSkillCategories() {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(SKILL_TREE_STORAGE_KEY);
  }

  return cloneSkillCategories(skillCategories);
}

export function exportSkillCategories(categories) {
  return JSON.stringify(sanitizeSkillCategories(categories), null, 2);
}

export function exportSkillCategoriesModule(categories) {
  return `export default ${exportSkillCategories(categories)};\n`;
}
