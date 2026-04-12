export const SKILL_TREE_STORAGE_KEY = 'nt-portfolio-skill-trees';

export const skillCategories = [
  {
    id: 'development',
    accent: 'development',
    icon: 'DEV',
    label: { fr: 'Developpement', en: 'Development' },
    summary: {
      fr: 'Gameplay, systemes, outils et iteration rapide.',
      en: 'Gameplay, systems, tools and fast iteration.',
    },
    description: {
      fr: 'Le coeur code du portfolio : tout ce qui transforme une idee en boucle jouable, lisible et maintenable.',
      en: 'The code core of the portfolio: everything that turns an idea into a playable, readable and maintainable loop.',
    },
    origin: { x: 8, y: 54 },
    connections: [
      { from: 'origin', to: 'gameplay-loop', kind: 'major' },
      { from: 'gameplay-loop', to: 'combat-systems', kind: 'major' },
      { from: 'gameplay-loop', to: 'instrumentation', kind: 'major' },
      { from: 'combat-systems', to: 'tools-pipeline', kind: 'major' },
      { from: 'combat-systems', to: 'ai-behaviour', kind: 'branch' },
      { from: 'combat-systems', to: 'instrumentation', kind: 'branch' },
      { from: 'tools-pipeline', to: 'ai-behaviour', kind: 'branch' },
      { from: 'instrumentation', to: 'ai-behaviour', kind: 'branch' },
    ],
    nodes: [
      {
        id: 'gameplay-loop',
        icon: 'GL',
        shape: 'core',
        title: { fr: 'Gameplay Loop', en: 'Gameplay Loop' },
        summary: { fr: 'Structurer des boucles lisibles et testables.', en: 'Shape loops that are readable and testable.' },
        details: { fr: 'Je travaille la sensation moment-to-moment, les timings, les etats et le feedback pour obtenir des actions que l on comprend vite et que l on veut rejouer.', en: 'I work on moment-to-moment feel, timings, states and feedback to build actions players understand quickly and want to replay.' },
        tier: 'Core',
        position: { x: 22, y: 54 },
      },
      {
        id: 'combat-systems',
        icon: 'CS',
        shape: 'diamond',
        title: { fr: 'Combat Systems', en: 'Combat Systems' },
        summary: { fr: 'Rythme, lecture et profondeur.', en: 'Rhythm, readability and depth.' },
        details: { fr: 'Du lock-on au dodge timing, je cherche des systemes qui restent comprehensibles sous pression sans perdre leur expressivite.', en: 'From lock-on to dodge timing, I aim for systems that stay readable under pressure without losing expressiveness.' },
        tier: 'Advanced',
        position: { x: 42, y: 38 },
      },
      {
        id: 'tools-pipeline',
        icon: 'TP',
        shape: 'diamond',
        title: { fr: 'Tools & Pipeline', en: 'Tools & Pipeline' },
        summary: { fr: 'Des outils pour iterer plus vite.', en: 'Tools to iterate faster.' },
        details: { fr: 'Je construis des outils editor, des interfaces de tuning et des workflows qui donnent plus d autonomie aux designers et reduisent les frictions de production.', en: 'I build editor tools, tuning interfaces and workflows that empower designers and reduce production friction.' },
        tier: 'Advanced',
        position: { x: 60, y: 24 },
      },
      {
        id: 'ai-behaviour',
        icon: 'AI',
        shape: 'support',
        title: { fr: 'AI Behaviour', en: 'AI Behaviour' },
        summary: { fr: 'Intentions de gameplay lisibles cote ennemis.', en: 'Readable enemy gameplay intent.' },
        details: { fr: 'L IA m interesse surtout comme mise en scene systemique : annoncer, menacer, punir ou relancer le joueur au bon moment.', en: 'AI interests me mainly as systemic staging: telegraphing, threatening, punishing or re-engaging the player at the right moment.' },
        tier: 'Support',
        position: { x: 84, y: 50 },
      },
      {
        id: 'instrumentation',
        icon: 'DT',
        shape: 'support',
        title: { fr: 'Data & Tuning', en: 'Data & Tuning' },
        summary: { fr: 'Passer du ressenti a la mesure.', en: 'Move from feel to measurement.' },
        details: { fr: 'J aime relier intuition de design et telemetry legere afin de rendre les arbitrages de balance plus rapides et plus argumentes.', en: 'I like connecting design intuition and lightweight telemetry so balance decisions become faster and more grounded.' },
        tier: 'Support',
        position: { x: 64, y: 78 },
      },
    ],
  },
  {
    id: 'art',
    accent: 'art',
    icon: 'ART',
    label: { fr: 'Art', en: 'Art' },
    summary: {
      fr: 'Lisibilite, motion et coherence de presentation.',
      en: 'Readability, motion and presentation coherence.',
    },
    description: {
      fr: 'Un versant technique et sensible : donner une forme juste aux systemes pour qu ils soient clairs, desirables et memorables.',
      en: 'A technical and sensitive side: giving systems the right form so they feel clear, desirable and memorable.',
    },
    origin: { x: 8, y: 54 },
    connections: [
      { from: 'origin', to: 'ui-ux', kind: 'major' },
      { from: 'ui-ux', to: 'technical-art', kind: 'major' },
      { from: 'ui-ux', to: 'visual-cohesion', kind: 'major' },
      { from: 'technical-art', to: 'motion-language', kind: 'major' },
      { from: 'technical-art', to: 'composition', kind: 'branch' },
      { from: 'technical-art', to: 'visual-cohesion', kind: 'branch' },
      { from: 'motion-language', to: 'composition', kind: 'branch' },
      { from: 'visual-cohesion', to: 'composition', kind: 'branch' },
    ],
    nodes: [
      {
        id: 'ui-ux',
        icon: 'UI',
        shape: 'core',
        title: { fr: 'UI / UX', en: 'UI / UX' },
        summary: { fr: 'Faire lire sans surcharger.', en: 'Make things readable without overload.' },
        details: { fr: 'Je traite l interface comme une couche de mise en scene. L objectif n est pas juste d afficher une information, mais de la faire comprendre au bon rythme.', en: 'I treat interface as a staging layer. The goal is not only to display information, but to make it understood at the right pace.' },
        tier: 'Core',
        position: { x: 22, y: 54 },
      },
      {
        id: 'technical-art',
        icon: 'TA',
        shape: 'diamond',
        title: { fr: 'Technical Art', en: 'Technical Art' },
        summary: { fr: 'Pont entre art, code et contraintes.', en: 'Bridge between art, code and constraints.' },
        details: { fr: 'Shaders, presentation, VFX sobres ou automatisation de setup : j aime les zones ou le craft visuel aide directement la production.', en: 'Shaders, presentation, subtle VFX or setup automation: I enjoy the areas where visual craft directly helps production.' },
        tier: 'Advanced',
        position: { x: 40, y: 34 },
      },
      {
        id: 'motion-language',
        icon: 'MO',
        shape: 'diamond',
        title: { fr: 'Motion Language', en: 'Motion Language' },
        summary: { fr: 'Le mouvement comme hierarchie.', en: 'Movement as hierarchy.' },
        details: { fr: 'Quand une transition ou une animation clarifie un etat, une priorite ou un changement de focus, elle fait partie du systeme de lecture.', en: 'When a transition or animation clarifies a state, a priority or a focus shift, it becomes part of the readability system.' },
        tier: 'Advanced',
        position: { x: 58, y: 24 },
      },
      {
        id: 'composition',
        icon: 'CP',
        shape: 'support',
        title: { fr: 'Composition', en: 'Composition' },
        summary: { fr: 'Cadres, silences et focus.', en: 'Frames, silence and focus.' },
        details: { fr: 'J aime composer les pages et les ecrans comme des posters jouables : une idee dominante, des respirations nettes, et peu de bruit decoratif.', en: 'I like composing pages and screens like playable posters: one dominant idea, crisp breathing room and very little decorative noise.' },
        tier: 'Support',
        position: { x: 82, y: 48 },
      },
      {
        id: 'visual-cohesion',
        icon: 'VC',
        shape: 'support',
        title: { fr: 'Visual Cohesion', en: 'Visual Cohesion' },
        summary: { fr: 'Une palette qui raconte le systeme.', en: 'A palette that tells the system.' },
        details: { fr: 'Je relie volontiers couleur, materiau et comportement interactif pour qu un projet garde une voix claire meme quand il grandit.', en: 'I like connecting color, material and interaction behavior so a project keeps a clear voice even as it grows.' },
        tier: 'Support',
        position: { x: 48, y: 78 },
      },
    ],
  },
  {
    id: 'creativity',
    accent: 'creativity',
    icon: 'CRE',
    label: { fr: 'Creativite', en: 'Creativity' },
    summary: {
      fr: 'Piliers, promesses et direction d experience.',
      en: 'Pillars, promises and experience direction.',
    },
    description: {
      fr: 'La partie qui donne du sens a l ensemble : clarifier ce qu un projet veut faire ressentir, et comment il va le prouver rapidement.',
      en: 'The layer that gives meaning to the whole: clarifying what a project wants players to feel and how it will prove it quickly.',
    },
    origin: { x: 8, y: 54 },
    connections: [
      { from: 'origin', to: 'game-feel-vision', kind: 'major' },
      { from: 'game-feel-vision', to: 'creative-pillars', kind: 'major' },
      { from: 'game-feel-vision', to: 'cross-discipline', kind: 'major' },
      { from: 'creative-pillars', to: 'narrative-framing', kind: 'major' },
      { from: 'creative-pillars', to: 'pitch-craft', kind: 'branch' },
      { from: 'creative-pillars', to: 'cross-discipline', kind: 'branch' },
      { from: 'narrative-framing', to: 'pitch-craft', kind: 'branch' },
      { from: 'cross-discipline', to: 'pitch-craft', kind: 'branch' },
    ],
    nodes: [
      {
        id: 'game-feel-vision',
        icon: 'GF',
        shape: 'core',
        title: { fr: 'Game Feel Vision', en: 'Game Feel Vision' },
        summary: { fr: 'Nommer le ressenti avant de le coder.', en: 'Name the feel before coding it.' },
        details: { fr: 'Je cherche a definir tres tot la texture d une action ou d une boucle pour que la technique serve une sensation deja claire.', en: 'I try to define the texture of an action or loop very early so the technical work serves an already clear sensation.' },
        tier: 'Core',
        position: { x: 22, y: 54 },
      },
      {
        id: 'creative-pillars',
        icon: 'PL',
        shape: 'diamond',
        title: { fr: 'Creative Pillars', en: 'Creative Pillars' },
        summary: { fr: 'Une promesse courte mais solide.', en: 'A short but solid promise.' },
        details: { fr: 'J aime formaliser quelques piliers forts pour aligner design, production et communication. Cela aide a dire non tout aussi bien qu a dire oui.', en: 'I like formalizing a few strong pillars to align design, production and communication. It helps saying no just as much as yes.' },
        tier: 'Advanced',
        position: { x: 40, y: 34 },
      },
      {
        id: 'narrative-framing',
        icon: 'NF',
        shape: 'diamond',
        title: { fr: 'Narrative Framing', en: 'Narrative Framing' },
        summary: { fr: 'Donner du contexte sans perdre le rythme.', en: 'Add context without losing pace.' },
        details: { fr: 'Meme sur des prototypes systemiques, j aime que l intention soit contextualisee : ton, enjeu, situation et desir de joueur doivent se lire tres vite.', en: 'Even on systemic prototypes, I like intent to be contextualized: tone, stakes, situation and player desire should read very quickly.' },
        tier: 'Advanced',
        position: { x: 58, y: 24 },
      },
      {
        id: 'pitch-craft',
        icon: 'PT',
        shape: 'support',
        title: { fr: 'Pitch Craft', en: 'Pitch Craft' },
        summary: { fr: 'Faire exister l idee en quelques minutes.', en: 'Make an idea real in a few minutes.' },
        details: { fr: 'Je prends au serieux la facon de montrer un prototype. Un bon pitch n est pas de la decoration : c est une clarification du produit.', en: 'I take prototype presentation seriously. A good pitch is not decoration: it is a clarification of the product.' },
        tier: 'Support',
        position: { x: 82, y: 48 },
      },
      {
        id: 'cross-discipline',
        icon: 'XD',
        shape: 'support',
        title: { fr: 'Cross-discipline', en: 'Cross-discipline' },
        summary: { fr: 'Relier code, design et presentation.', en: 'Connect code, design and presentation.' },
        details: { fr: 'J aime les zones ou plusieurs metiers se rencontrent. C est souvent la que naissent les solutions les plus propres et les plus ambitieuses.', en: 'I enjoy the zones where multiple disciplines meet. That is often where the cleanest and most ambitious solutions emerge.' },
        tier: 'Support',
        position: { x: 52, y: 78 },
      },
    ],
  },
];

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
