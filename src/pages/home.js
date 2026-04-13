import btnArtClickedUrl from '../images/Btn_Art_Clicked.svg';
import btnArtHoverUrl from '../images/Btn_Art_Hover.svg';
import btnArtNormalUrl from '../images/Btn_Art_Normal.svg';
import btnCreaClickedUrl from '../images/Btn_Crea_Clicked.svg';
import btnCreaHoverUrl from '../images/Btn_Crea_Hover.svg';
import btnCreaNormalUrl from '../images/Btn_Crea_Normal.svg';
import btnDevClickedUrl from '../images/Btn_Dev_Clicked.svg';
import btnDevHoverUrl from '../images/Btn_Dev_Hover.svg';
import btnDevNormalUrl from '../images/Btn_Dev_Normal.svg';
import trunkUrl from '../images/Trunk.svg';
import treeUpperUrl from '../images/tree_upper.svg';
import {
  cloneSkillCategories,
  exportSkillCategories,
  exportSkillCategoriesModule,
  loadSkillCategories,
  resetSkillCategories,
  saveSkillCategories,
  skillCategories,
} from '../data/skills.js';
import { siteCopy } from '../data/site.js';

const skillCategoryOrder = ['development', 'creativity', 'art'];
const categoryButtonPositions = {
  development: 22.2,
  creativity: 50,
  art: 77.8,
};

const categoryButtonImages = {
  development: {
    clicked: btnDevClickedUrl,
    hover: btnDevHoverUrl,
    normal: btnDevNormalUrl,
  },
  creativity: {
    clicked: btnCreaClickedUrl,
    hover: btnCreaHoverUrl,
    normal: btnCreaNormalUrl,
  },
  art: {
    clicked: btnArtClickedUrl,
    hover: btnArtHoverUrl,
    normal: btnArtNormalUrl,
  },
};

const bridgeAccentColors = {
  development: '#2f9fbd',
  creativity: '#69a957',
  art: '#c6577d',
};

const editorCopy = {
  fr: {
    open: 'Editer l arbre',
    close: 'Fermer l editeur',
    addNode: 'Ajouter un node',
    copyJson: 'Copier le JSON',
    saveProject: 'Sauver dans le projet',
    reset: 'Reinitialiser',
    autosave: 'Sauvegarde locale automatique active.',
    copied: 'Configuration copiee dans le presse-papiers.',
    copyFailed: 'Copie impossible depuis ce navigateur.',
    projectSaved: 'Fichier du projet mis a jour. Tu peux commit et push.',
    projectSaveFailed: 'Impossible d ecrire le fichier du projet depuis ce navigateur.',
    resetDone: 'Les arbres par defaut ont ete restaures.',
    resetConfirm: 'Restaurer les arbres d origine ?',
    dragHint: 'Glisse les nodes et l origine sur la grille.',
    chooseNode: 'Node selectionne',
    nodeSettings: 'Node',
    connections: 'Lignes',
    origin: 'Origine',
    noNode: 'Aucun node selectionne.',
    deleteNode: 'Supprimer ce node',
    deleteNodeConfirm: 'Supprimer ce node et ses connexions ?',
    linkAdded: 'Connexion ajoutee.',
    linkRemoved: 'Connexion supprimee.',
    nodeAdded: 'Nouveau node ajoute.',
    nodeDeleted: 'Node supprime.',
    nodeUpdated: 'Node mis a jour.',
    positionUpdated: 'Position mise a jour.',
    originUpdated: 'Origine mise a jour.',
    linkInvalid: 'Selectionne deux nodes differents.',
    linkExists: 'Cette connexion existe deja.',
    linkModeArmed: 'Mode lien actif : clique sur un autre node.',
    linkModeCanceled: 'Mode lien annule.',
    addConnection: 'Ajouter la connexion',
    addLink: 'Ajouter un lien',
    cycleSize: 'Changer la taille',
    editTooltip: 'Editer l infobulle',
    iconImagePrompt: 'URL de l image du node',
    tooltipMediaPrompt: 'URL de l image ou du GIF de l infobulle',
    tooltipTitle: 'Titre de l infobulle',
    tooltipSummary: 'Texte de l infobulle',
    tooltipDetails: 'Texte detaille',
    tooltipTier: 'Label du tier',
    from: 'De',
    to: 'Vers',
    type: 'Type',
    major: 'Major',
    branch: 'Branch',
    id: 'Id',
    icon: 'Icone',
    shape: 'Forme',
    tier: 'Tier',
    titleFr: 'Titre FR',
    titleEn: 'Titre EN',
    summaryFr: 'Resume FR',
    summaryEn: 'Resume EN',
    detailsFr: 'Details FR',
    detailsEn: 'Details EN',
    posX: 'X',
    posY: 'Y',
    core: 'Core',
    diamond: 'Diamond',
    support: 'Support',
    small: 'Petite',
    medium: 'Moyenne',
    large: 'Grande',
    skillDetails: 'Detail competence',
    noSkillSelected: 'Clique sur un node pour afficher ses details.',
    categoryLabel: 'Categorie',
    visualLabel: 'Visuel',
    notesLabel: 'Description',
    remove: 'Supprimer',
    createdFromOrigin: 'Origine',
  },
  en: {
    open: 'Edit tree',
    close: 'Close editor',
    addNode: 'Add node',
    copyJson: 'Copy JSON',
    saveProject: 'Save to project',
    reset: 'Reset',
    autosave: 'Local autosave is active.',
    copied: 'Configuration copied to clipboard.',
    copyFailed: 'Clipboard copy is not available here.',
    projectSaved: 'Project file updated. You can commit and push it.',
    projectSaveFailed: 'Unable to write the project file from this browser.',
    resetDone: 'Default trees restored.',
    resetConfirm: 'Restore the default trees?',
    dragHint: 'Drag nodes and the origin on the virtual grid.',
    chooseNode: 'Selected node',
    nodeSettings: 'Node',
    connections: 'Connections',
    origin: 'Origin',
    noNode: 'No node selected.',
    deleteNode: 'Delete this node',
    deleteNodeConfirm: 'Delete this node and its links?',
    linkAdded: 'Connection added.',
    linkRemoved: 'Connection removed.',
    nodeAdded: 'New node added.',
    nodeDeleted: 'Node deleted.',
    nodeUpdated: 'Node updated.',
    positionUpdated: 'Position updated.',
    originUpdated: 'Origin updated.',
    linkInvalid: 'Pick two different nodes.',
    linkExists: 'That connection already exists.',
    linkModeArmed: 'Link mode is active: click another node.',
    linkModeCanceled: 'Link mode canceled.',
    addConnection: 'Add connection',
    addLink: 'Add link',
    cycleSize: 'Change size',
    editTooltip: 'Edit tooltip',
    iconImagePrompt: 'Node image URL',
    tooltipMediaPrompt: 'Tooltip image or GIF URL',
    tooltipTitle: 'Tooltip title',
    tooltipSummary: 'Tooltip text',
    tooltipDetails: 'Detailed text',
    tooltipTier: 'Tier label',
    from: 'From',
    to: 'To',
    type: 'Type',
    major: 'Major',
    branch: 'Branch',
    id: 'Id',
    icon: 'Icon',
    shape: 'Shape',
    tier: 'Tier',
    titleFr: 'Title FR',
    titleEn: 'Title EN',
    summaryFr: 'Summary FR',
    summaryEn: 'Summary EN',
    detailsFr: 'Details FR',
    detailsEn: 'Details EN',
    posX: 'X',
    posY: 'Y',
    core: 'Core',
    diamond: 'Diamond',
    support: 'Support',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    skillDetails: 'Skill detail',
    noSkillSelected: 'Click a node to display its details.',
    categoryLabel: 'Category',
    visualLabel: 'Visual',
    notesLabel: 'Description',
    remove: 'Remove',
    createdFromOrigin: 'Origin',
  },
};

const allowedShapes = ['core', 'diamond', 'support'];
const allowedSizes = ['small', 'medium', 'large'];
const gridStep = 2;

function getEditorText(language, key) {
  return editorCopy[language]?.[key] ?? editorCopy.fr[key] ?? key;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function snapToGrid(value) {
  return Math.round(clamp(value, 0, 100) / gridStep) * gridStep;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getOrderedSkillCategories(categories) {
  const ordered = skillCategoryOrder
    .map((id) => categories.find((category) => category.id === id))
    .filter(Boolean);
  const extras = categories.filter((category) => !skillCategoryOrder.includes(category.id));
  return [...ordered, ...extras];
}

function getCategoryButtonOrder(categories) {
  return getOrderedSkillCategories(categories).map((category) => category.id);
}

function createNodeId(category, seed = 'node') {
  const base = slugify(seed) || 'node';
  const usedIds = new Set(category.nodes.map((node) => node.id));
  if (!usedIds.has(base)) return base;

  let index = 2;
  while (usedIds.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function createDefaultNode(category) {
  const count = category.nodes.length;
  const row = Math.floor(count / 4);
  const column = count % 4;

  return {
    id: createNodeId(category, `${category.id}-node`),
    icon: 'ND',
    iconImage: '',
    shape: 'support',
    size: 'medium',
    title: { fr: 'Nouveau node', en: 'New node' },
    summary: { fr: 'Resume rapide.', en: 'Quick summary.' },
    details: { fr: 'Detaille ce node ici.', en: 'Describe this node here.' },
    tooltipMedia: '',
    tier: 'Support',
    position: {
      x: snapToGrid(28 + column * 16),
      y: snapToGrid(28 + row * 16),
    },
  };
}

function renderTreeVisual() {
  return `
    <div class="hero-tree hero-tree--canopy" aria-hidden="true">
      <img class="hero-tree__upper" src="${treeUpperUrl}" alt="" />
    </div>
  `;
}

function renderTrunkBridge() {
  return `
    <img class="home-trunk-bridge__asset" src="${trunkUrl}" alt="" />
      <svg class="home-trunk-bridge__svg" viewBox="0 0 1920 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="homeTrunkGold" x1="0" y1="393.82" x2="426.9" y2="393.82" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#70623e" />
            <stop offset="1" stop-color="#c9a84c" />
        </linearGradient>
        <linearGradient id="homeTrunkGoldMirror" x1="1827.4" y1="393.82" x2="2254.31" y2="393.82" gradientTransform="translate(3747.54 0) rotate(-180)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#70623e" />
          <stop offset="1" stop-color="#c9a84c" />
        </linearGradient>
        </defs>
        <g class="home-trunk-bridge__branches">
          <path class="home-trunk-bridge__ground home-trunk-bridge__ground--upper" d="M-36 302 C 160 272, 320 276, 486 302 C 646 326, 820 310, 960 310 C 1100 310, 1274 326, 1434 302 C 1600 276, 1760 272, 1956 302" />
          <path class="home-trunk-bridge__ground home-trunk-bridge__ground--soft" d="M-36 484 C 46 452, 124 426, 208 434 C 286 442, 354 470, 430 468 C 490 466, 552 438, 628 436 C 716 434, 804 462, 892 462 C 926 462, 944 438, 960 438 C 976 438, 994 462, 1028 462 C 1116 462, 1204 434, 1292 436 C 1368 438, 1430 466, 1490 468 C 1566 470, 1634 442, 1712 434 C 1796 426, 1874 452, 1956 484" />
          <path class="home-trunk-bridge__ground home-trunk-bridge__ground--accent" d="M-36 462 C 150 480, 316 480, 482 462 C 644 444, 820 466, 960 466 C 1100 466, 1276 444, 1438 462 C 1604 480, 1770 480, 1956 462" />
        </g>
    </svg>
  `;
}

function renderCategoryButtons(t, categories) {
  return getCategoryButtonOrder(categories)
    .map((id) => categories.find((category) => category.id === id))
    .filter(Boolean)
    .map((category, index) => {
      const buttonImages = categoryButtonImages[category.id];
      const buttonPosition = categoryButtonPositions[category.id] ?? 50;

      return `
        <button
          class="category-card"
          type="button"
          data-category-trigger="${category.id}"
          data-accent="${category.accent}"
          style="transition-delay:${index * 80}ms; --category-x:${buttonPosition}%"
          aria-label="${t(category.label)}"
          data-reveal
        >
          ${
            buttonImages
              ? `<span class="category-card__visual" aria-hidden="true">
                  <img class="category-card__image category-card__image--normal" src="${buttonImages.normal}" alt="" />
                  <img class="category-card__image category-card__image--hover" src="${buttonImages.hover}" alt="" />
                  <img class="category-card__image category-card__image--clicked" src="${buttonImages.clicked}" alt="" />
                </span>`
              : `<span class="category-card__icon" aria-hidden="true">${category.icon}</span>`
          }
          <span class="category-card__label sr-only">${t(category.label)}</span>
        </button>
      `;
    })
    .join('');
}

function getSkillLinkPath(start, end) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const direction = deltaX >= 0 ? 1 : -1;
  const span = Math.max(Math.abs(deltaX), 1);
  const stub = Math.min(7, Math.max(4, span * 0.2));
  const startStubX = start.x + stub * direction;
  const endStubX = end.x - stub * direction;

  const buildRoundedPath = (points) => {
    if (points.length < 2) return '';

    const distanceBetween = (firstPoint, secondPoint) => Math.hypot(secondPoint.x - firstPoint.x, secondPoint.y - firstPoint.y);
    const moveTowards = (fromPoint, toPoint, amount) => {
      const distance = distanceBetween(fromPoint, toPoint);
      if (!distance) return { ...fromPoint };
      const ratio = amount / distance;
      return {
        x: fromPoint.x + (toPoint.x - fromPoint.x) * ratio,
        y: fromPoint.y + (toPoint.y - fromPoint.y) * ratio,
      };
    };

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let index = 1; index < points.length; index += 1) {
      const previousPoint = points[index - 1];
      const currentPoint = points[index];
      const nextPoint = points[index + 1];

      if (!nextPoint) {
        path += ` L ${currentPoint.x} ${currentPoint.y}`;
        continue;
      }

      const incomingLength = distanceBetween(previousPoint, currentPoint);
      const outgoingLength = distanceBetween(currentPoint, nextPoint);
      const cornerRadius = Math.min(3.4, incomingLength * 0.45, outgoingLength * 0.45);

      if (cornerRadius < 0.1) {
        path += ` L ${currentPoint.x} ${currentPoint.y}`;
        continue;
      }

      const curveStart = moveTowards(currentPoint, previousPoint, cornerRadius);
      const curveEnd = moveTowards(currentPoint, nextPoint, cornerRadius);
      path += ` L ${curveStart.x} ${curveStart.y} Q ${currentPoint.x} ${currentPoint.y} ${curveEnd.x} ${curveEnd.y}`;
    }

    return path;
  };

  if (Math.abs(deltaY) <= 3) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  if (Math.abs(deltaX) < 10) {
    const midY = start.y + deltaY * 0.5;
    return buildRoundedPath([
      { x: start.x, y: start.y },
      { x: start.x, y: midY },
      { x: end.x, y: midY },
      { x: end.x, y: end.y },
    ]);
  }

  const midX = start.x + deltaX * 0.5;
  const midY = start.y + deltaY * 0.5;
  return buildRoundedPath([
    { x: start.x, y: start.y },
    { x: startStubX, y: start.y },
    { x: midX, y: midY },
    { x: endStubX, y: end.y },
    { x: end.x, y: end.y },
  ]);
}

function renderSkillLines(category) {
  const nodesById = Object.fromEntries(category.nodes.map((node) => [node.id, node]));
  const origin = category.origin ?? { x: 8, y: 54 };

  return (category.connections ?? [])
    .map((connection) => {
      const start = connection.from === 'origin' ? origin : nodesById[connection.from]?.position;
      const end = nodesById[connection.to]?.position;

      if (!start || !end) return '';

      const path = getSkillLinkPath(start, end);
      const kind = connection.kind ?? 'branch';

      return `
        <path class="skill-stage__link skill-stage__link--glow skill-stage__link--${kind}" d="${path}" />
        <path class="skill-stage__link skill-stage__link--core skill-stage__link--${kind}" d="${path}" />
      `;
    })
    .join('');
}

function renderSkillStagePanel() {
  return `
    <div class="skill-stage__panel" aria-hidden="true">
      <svg class="skill-stage__panel-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="skillStagePanelFill" x1="0" y1="0" x2="0" y2="1">
            <stop class="skill-stage__panel-stop skill-stage__panel-stop--base" offset="0%" />
            <stop class="skill-stage__panel-stop skill-stage__panel-stop--base" offset="30%" />
            <stop class="skill-stage__panel-stop skill-stage__panel-stop--bottom" offset="50%" />
            <stop class="skill-stage__panel-stop skill-stage__panel-stop--bottom" offset="100%" />
          </linearGradient>
          <pattern id="skillStagePanelGrid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.35" />
          </pattern>
        </defs>
        <path
          class="skill-stage__panel-fill"
          d="M 0 18.4 C 9.54 12.6, 17.77 12.2, 26 15.4 C 34.04 18.4, 42.97 15, 50 15 C 57.03 15, 65.96 18.4, 73.99 15.4 C 82.23 12.2, 90.46 12.6, 100 18.4 L 100 100 L 0 100 Z"
        />
        <path
          class="skill-stage__panel-grid"
          d="M 0 18.4 C 9.54 12.6, 17.77 12.2, 26 15.4 C 34.04 18.4, 42.97 15, 50 15 C 57.03 15, 65.96 18.4, 73.99 15.4 C 82.23 12.2, 90.46 12.6, 100 18.4 L 100 100 L 0 100 Z"
        />
        <path
          class="skill-stage__panel-outline"
          d="M 0 18.4 C 9.54 12.6, 17.77 12.2, 26 15.4 C 34.04 18.4, 42.97 15, 50 15 C 57.03 15, 65.96 18.4, 73.99 15.4 C 82.23 12.2, 90.46 12.6, 100 18.4"
        />
      </svg>
    </div>
  `;
}

function renderEditorContextMenu(category, language, selectedNodeId, contextMenu) {
  if (!contextMenu) return '';

  const targetNode = contextMenu.nodeId
    ? category.nodes.find((node) => node.id === contextMenu.nodeId) ?? null
    : null;
  const selectedNode = selectedNodeId
    ? category.nodes.find((node) => node.id === selectedNodeId) ?? null
    : null;
  const hasSelectedLink =
    targetNode && selectedNode && selectedNode.id !== targetNode.id
      ? category.connections.some((connection) => connection.from === selectedNode.id && connection.to === targetNode.id)
      : false;
  const hasOriginLink = targetNode
    ? category.connections.some((connection) => connection.from === 'origin' && connection.to === targetNode.id)
    : false;

  const items = targetNode
    ? [
        `<button type="button" data-context-action="select-node" data-context-node="${escapeHtml(targetNode.id)}">${escapeHtml(
          targetNode.title[language]
        )}</button>`,
        `<button type="button" data-context-action="rename-node" data-context-node="${escapeHtml(targetNode.id)}">${language === 'fr' ? 'Renommer' : 'Rename'}</button>`,
        `<button type="button" data-context-action="edit-tooltip" data-context-node="${escapeHtml(targetNode.id)}">${escapeHtml(
          getEditorText(language, 'editTooltip')
        )}</button>`,
        `<button type="button" data-context-action="edit-icon" data-context-node="${escapeHtml(targetNode.id)}">${language === 'fr' ? 'Changer l icone' : 'Edit icon'}</button>`,
        `<button type="button" data-context-action="cycle-shape" data-context-node="${escapeHtml(targetNode.id)}">${language === 'fr' ? 'Changer la forme' : 'Cycle shape'}</button>`,
        `<button type="button" data-context-action="cycle-size" data-context-node="${escapeHtml(targetNode.id)}">${escapeHtml(
          `${getEditorText(language, 'cycleSize')} · ${getEditorText(language, targetNode.size || 'medium')}`
        )}</button>`,
        `<button type="button" data-context-action="arm-link-mode" data-context-node="${escapeHtml(targetNode.id)}">${escapeHtml(
          getEditorText(language, 'addLink')
        )}</button>`,
        selectedNode && selectedNode.id !== targetNode.id
          ? `<button type="button" data-context-action="${hasSelectedLink ? 'remove-link-from-selected' : 'add-link-from-selected'}" data-context-node="${escapeHtml(
              targetNode.id
            )}">${escapeHtml(
              hasSelectedLink
                ? language === 'fr'
                  ? 'Supprimer le lien depuis la selection'
                  : 'Remove link from selection'
                : language === 'fr'
                  ? 'Lier depuis la selection'
                  : 'Link from selection'
            )}</button>`
          : '',
        `<button type="button" data-context-action="${hasOriginLink ? 'remove-link-from-origin' : 'add-link-from-origin'}" data-context-node="${escapeHtml(
          targetNode.id
        )}">${escapeHtml(
          hasOriginLink
            ? language === 'fr'
              ? 'Supprimer le lien depuis l origine'
              : 'Remove link from origin'
            : language === 'fr'
              ? 'Lier depuis l origine'
              : 'Link from origin'
        )}</button>`,
        `<button type="button" class="is-danger" data-context-action="delete-node" data-context-node="${escapeHtml(targetNode.id)}">${escapeHtml(
          getEditorText(language, 'deleteNode')
        )}</button>`,
      ]
    : [
        `<button type="button" data-context-action="add-node-at">${language === 'fr' ? 'Ajouter un node ici' : 'Add node here'}</button>`,
      ];

  return `
    <div
      class="skill-editor-menu"
      data-skill-editor-menu
      style="left:${contextMenu.left}px; top:${contextMenu.top}px;"
    >
      ${items.filter(Boolean).join('')}
    </div>
  `;
}

function renderNodeVisual(node) {
  if (node.iconImage) return '';

  return `<span class="skill-node__placeholder" aria-hidden="true"><span class="skill-node__placeholder-dot"></span></span>`;
}

function renderTooltipMedia(node) {
  if (node.tooltipMedia) {
    return `<img class="skill-tooltip__media-image" src="${escapeHtml(node.tooltipMedia)}" alt="" loading="lazy" />`;
  }

  return `
    <div class="skill-tooltip__media-placeholder" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
}

function renderSkillDetail(category, node, language) {
  if (!node) {
    return '';
  }

  const visualSource = node.tooltipMedia || node.iconImage;

  return `
    <aside class="detail-card detail-card--skill detail-card--skill-overlay" data-skill-detail>
      <div class="detail-card__header">
        <span class="detail-card__badge">${escapeHtml(node.tier)}</span>
        <span class="detail-card__badge">${escapeHtml(category.label[language])}</span>
      </div>
      <h3>${escapeHtml(node.title[language])}</h3>
      <p>${escapeHtml(node.summary[language])}</p>
      <div class="detail-card__media-block skill-detail__media-block">
        <span class="detail-card__section-label">${escapeHtml(getEditorText(language, 'visualLabel'))}</span>
        <div class="skill-detail__media ${visualSource ? 'has-media' : ''}">
          ${
            visualSource
              ? `<img src="${escapeHtml(visualSource)}" alt="" loading="lazy" />`
              : `<div class="skill-detail__media-placeholder" aria-hidden="true"><span></span><span></span></div>`
          }
        </div>
      </div>
      <div class="detail-card__stack">
        <span class="detail-card__section-label">${escapeHtml(getEditorText(language, 'categoryLabel'))}</span>
        <div class="stack-pill-row">
          <span class="stack-pill">${escapeHtml(category.label[language])}</span>
          <span class="stack-pill">${escapeHtml(getEditorText(language, node.shape))}</span>
          <span class="stack-pill">${escapeHtml(getEditorText(language, node.size))}</span>
        </div>
      </div>
      <div class="detail-card__stack">
        <span class="detail-card__section-label">${escapeHtml(getEditorText(language, 'notesLabel'))}</span>
        <p>${escapeHtml(node.details[language])}</p>
      </div>
    </aside>
  `;
}

function renderSkillMap(category, language, editorState = {}) {
  const {
    editorOpen = false,
    selectedNodeId = '',
    statusMessage = '',
    contextMenu = null,
    linkingFromNodeId = '',
  } = editorState;
  const origin = category.origin ?? { x: 8, y: 54 };
  const selectedNode = category.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const nodes = category.nodes
    .map((node) => {
      const isSelected = node.id === selectedNodeId ? ' is-selected' : '';
      const isLinkSource = editorOpen && node.id === linkingFromNodeId ? ' is-link-source' : '';
      return `
        <button
          class="skill-node${isSelected}${isLinkSource}"
          type="button"
          data-skill-node="${node.id}"
          data-shape="${node.shape ?? 'support'}"
          data-size="${node.size ?? 'medium'}"
          data-tier="${String(node.tier ?? 'support').toLowerCase()}"
          style="left:${node.position.x}%; top:${node.position.y}%"
          aria-label="${escapeHtml(node.title[language])}"
        >
          <span class="skill-node__socket" aria-hidden="true">
            <span class="skill-node__frame"></span>
            <span class="skill-node__core">
              <span
                class="skill-node__media ${node.iconImage ? 'skill-node__media--image' : ''}"
                ${node.iconImage ? `style="background-image: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.14)), url('${escapeHtml(node.iconImage)}');"` : ''}
              >
              <span class="skill-node__icon">${renderNodeVisual(node)}</span>
              </span>
            </span>
          </span>
          <span class="skill-node__title">${escapeHtml(node.title[language])}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="skill-stage__content skill-stage__content--full" data-accent="${category.accent}">
      <div class="skill-stage__workspace">
        <div class="skill-stage__map skill-stage__map--full ${editorOpen ? 'is-editor-open' : ''}" data-reveal data-skill-map>
          ${renderSkillStagePanel()}
          <div class="skill-stage__toolbar skill-stage__toolbar--floating">
            <div class="skill-stage__toolbar-actions">
              <button class="skill-stage__toolbar-button skill-stage__toolbar-button--primary" type="button" data-editor-action="toggle">
                ${escapeHtml(getEditorText(language, editorOpen ? 'close' : 'open'))}
              </button>
              ${
                editorOpen
                  ? `
                    <button class="skill-stage__toolbar-button" type="button" data-editor-action="copy-json">
                      ${escapeHtml(getEditorText(language, 'copyJson'))}
                    </button>
                    <button class="skill-stage__toolbar-button" type="button" data-editor-action="save-project">
                      ${escapeHtml(getEditorText(language, 'saveProject'))}
                    </button>
                    <button class="skill-stage__toolbar-button skill-stage__toolbar-button--ghost" type="button" data-editor-action="reset">
                      ${escapeHtml(getEditorText(language, 'reset'))}
                    </button>
                  `
                  : ''
              }
            </div>
            <span class="skill-stage__toolbar-status" data-skill-editor-status>${escapeHtml(statusMessage || getEditorText(language, 'autosave'))}</span>
          </div>
          <button class="skill-stage__nav skill-stage__nav--prev" type="button" data-skill-nav="prev" aria-label="${language === 'fr' ? 'Categorie precedente' : 'Previous category'}">
            <span class="skill-stage__nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M14.75 5.75L8.5 12l6.25 6.25" />
              </svg>
            </span>
          </button>
          <button class="skill-stage__nav skill-stage__nav--next" type="button" data-skill-nav="next" aria-label="${language === 'fr' ? 'Categorie suivante' : 'Next category'}">
            <span class="skill-stage__nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M9.25 5.75L15.5 12l-6.25 6.25" />
              </svg>
            </span>
          </button>
          ${
            editorOpen
              ? `<button class="skill-stage__origin skill-stage__origin--editable" type="button" data-skill-origin-handle style="left:${origin.x}%; top:${origin.y}%;" aria-label="${escapeHtml(
                  getEditorText(language, 'origin')
                )}">
                  <span class="skill-stage__origin-ring"></span>
                  <span class="skill-stage__origin-core"></span>
                </button>`
              : ''
          }
          <svg class="skill-stage__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            ${renderSkillLines(category)}
          </svg>
          ${
            editorOpen
              ? `
                <div class="skill-stage__editor-hint">${escapeHtml(getEditorText(language, 'dragHint'))}</div>
                <div class="skill-stage__editor-selection">
                  ${escapeHtml(
                    linkingFromNodeId
                      ? `${
                          language === 'fr' ? 'Lien depuis' : 'Link from'
                        } ${category.nodes.find((node) => node.id === linkingFromNodeId)?.title[language] ?? linkingFromNodeId}`
                      : selectedNodeId
                        ? category.nodes.find((node) => node.id === selectedNodeId)?.title[language] ?? selectedNodeId
                      : language === 'fr'
                        ? 'Aucune selection'
                        : 'No selection'
                  )}
                </div>
              `
              : ''
          }
          ${editorOpen ? renderEditorContextMenu(category, language, selectedNodeId, contextMenu) : ''}
          <div class="skill-tooltip is-hidden" data-skill-tooltip></div>
          ${!editorOpen ? renderSkillDetail(category, selectedNode, language) : ''}
          <div class="skill-node-layer">${nodes}</div>
        </div>
      </div>
    </div>
  `;
}

export const renderHomePage = {
  pageId: 'skills',
  createContent: ({ t, language }) => {
    const storedCategories = loadSkillCategories();
    const orderedCategories = getOrderedSkillCategories(storedCategories);
    const initialCategory = orderedCategories[0] ?? storedCategories[0] ?? skillCategories[0];

    return `
      <div class="home-snap-track">
        <div class="home-trunk-bridge" aria-hidden="true">
          ${renderTrunkBridge()}
        </div>
        <section class="hero-section hero-section--poster hero-intro home-snap-section" data-home-section>
          <div class="hero-poster hero-poster--intro">
            <div class="hero-canopy" data-reveal>
              ${renderTreeVisual()}
            </div>
            <div class="hero-identity" data-reveal>
              <h1 class="hero-title hero-title--poster">${t(siteCopy.home.title)}</h1>
              <span class="hero-identity__rule" aria-hidden="true"></span>
              <div class="hero-roles hero-roles--single">
                ${siteCopy.home.roles
                  .map((role) => `<span>${t(role)}</span>`)
                  .join('<span class="hero-roles__separator">.</span>')}
              </div>
            </div>
            <div class="hero-actions hero-actions--bottom" data-reveal>
              <a class="primary-link" href="#skills-hub" data-discover-tree>${t(siteCopy.common.discoverTree)}</a>
            </div>
          </div>
        </section>

        <section id="skills-hub" class="skills-screen section-shell home-snap-section" data-home-section>
          <div class="skills-screen__inner">
            <div class="skills-screen__controls" data-reveal>
              <div class="category-grid category-grid--compact">
                ${renderCategoryButtons(t, storedCategories)}
              </div>
            </div>
            <div class="skill-stage skill-stage--screen" data-skill-stage>
              ${renderSkillMap(initialCategory, language, {
                editorOpen: false,
                selectedNodeId: '',
                statusMessage: getEditorText(language, 'autosave'),
              })}
            </div>
          </div>
        </section>
      </div>
    `;
  },
  enhance: ({ root, language }) => {
    const stage = root.querySelector('[data-skill-stage]');
    const triggerButtons = Array.from(root.querySelectorAll('[data-category-trigger]'));
    const homeSections = Array.from(root.querySelectorAll('[data-home-section]'));
    const homeSnapTrack = root.querySelector('.home-snap-track');
    const heroVisual = root.querySelector('.hero-tree');
    const heroIdentity = root.querySelector('.hero-identity');
    const heroTitle = root.querySelector('.hero-title--poster');
    const heroRoles = root.querySelector('.hero-roles--single');
    const pageContent = root.querySelector('.page-content');
    const skillsHub = root.querySelector('#skills-hub');
    const discoverButton = root.querySelector('[data-discover-tree]');
    if (!stage) return () => {};

    const cleanups = [];
    const addCleanup = (callback) => {
      if (typeof callback === 'function') cleanups.push(callback);
    };

    let categoriesState = loadSkillCategories();
    let orderedCategories = getOrderedSkillCategories(categoriesState);
    let activeCategory = orderedCategories[0] ?? categoriesState[0] ?? skillCategories[0];
    let editorOpen = false;
    let selectedNodeId = '';
    let statusMessage = getEditorText(language, 'autosave');
    let ignoredNodeClickId = '';
    let contextMenu = null;
    let linkingFromNodeId = '';

    const getActiveCategory = () =>
      orderedCategories.find((category) => category.id === activeCategory?.id) ??
      categoriesState.find((category) => category.id === activeCategory?.id) ??
      orderedCategories[0] ??
      categoriesState[0] ??
      null;

    const syncSelectedNode = () => {
      activeCategory = getActiveCategory();
      if (!activeCategory) {
        selectedNodeId = '';
        return;
      }

      if (selectedNodeId && !activeCategory.nodes.some((node) => node.id === selectedNodeId)) {
        selectedNodeId = '';
      }
    };

    const setStatusMessage = (nextMessage) => {
      statusMessage = nextMessage;
      const statusNode = stage.querySelector('[data-skill-editor-status]');
      if (statusNode) statusNode.textContent = nextMessage;
    };

    const hideTooltip = () => {
      const tooltip = stage.querySelector('[data-skill-tooltip]');
      if (tooltip) tooltip.classList.add('is-hidden');
    };

    const updateStageNav = () => {
      const currentIndex = orderedCategories.findIndex((item) => item.id === activeCategory?.id);
      const prevButton = stage.querySelector('[data-skill-nav="prev"]');
      const nextButton = stage.querySelector('[data-skill-nav="next"]');
      if (prevButton) prevButton.disabled = currentIndex <= 0;
      if (nextButton) nextButton.disabled = currentIndex >= orderedCategories.length - 1;
    };

    const renderStage = () => {
      activeCategory = getActiveCategory();
      if (!activeCategory) return;

      syncSelectedNode();

      homeSnapTrack?.style.setProperty('--home-bridge-accent', bridgeAccentColors[activeCategory.id] ?? '#2f9fbd');
      stage.innerHTML = renderSkillMap(activeCategory, language, {
        editorOpen,
        selectedNodeId,
        statusMessage,
        contextMenu,
        linkingFromNodeId,
      });
      stage.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('is-visible'));
      bindSkillNodes();
      updateStageNav();
      triggerButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.categoryTrigger === activeCategory.id);
      });
    };

    const commitCategories = (nextCategories, messageKey = 'autosave') => {
      categoriesState = saveSkillCategories(nextCategories);
      orderedCategories = getOrderedSkillCategories(categoriesState);
      activeCategory =
        orderedCategories.find((category) => category.id === activeCategory?.id) ??
        orderedCategories[0] ??
        categoriesState[0] ??
        null;
      renderStage();
      setStatusMessage(getEditorText(language, messageKey));
    };

    const getPositionFromEvent = (event, element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: snapToGrid(((event.clientX - rect.left) / rect.width) * 100),
        y: snapToGrid(((event.clientY - rect.top) / rect.height) * 100),
      };
    };

    const updatePosition = (kind, id, position, messageKey) => {
      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory?.id);
      if (!nextCategory) return;

      if (kind === 'origin') {
        nextCategory.origin = position;
      } else {
        const node = nextCategory.nodes.find((item) => item.id === id);
        if (!node) return;
        node.position = position;
      }

      commitCategories(nextCategories, messageKey);
    };

    const openContextMenu = (event, nodeId = '') => {
      if (!editorOpen) return;
      const map = stage.querySelector('[data-skill-map]');
      if (!map) return;

      const mapRect = map.getBoundingClientRect();
      const menuWidth = 240;
      const menuHeight = 260;
      const left = clamp(event.clientX - mapRect.left, 16, Math.max(16, mapRect.width - menuWidth - 16));
      const top = clamp(event.clientY - mapRect.top, 16, Math.max(16, mapRect.height - menuHeight - 16));

      contextMenu = {
        left,
        top,
        nodeId: nodeId || '',
        position: getPositionFromEvent(event, map),
      };
      renderStage();
    };

    const bindDragHandle = (handle, kind, id) => {
      if (!handle || !editorOpen) return;
      const map = stage.querySelector('[data-skill-map]');
      if (!map) return;

      handle.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        contextMenu = null;
        const startPosition =
          kind === 'origin'
            ? { ...(activeCategory?.origin ?? { x: 8, y: 54 }) }
            : { ...(activeCategory?.nodes.find((node) => node.id === id)?.position ?? { x: 50, y: 50 }) };

        let moved = false;
        let lastPosition = startPosition;
        const startX = event.clientX;
        const startY = event.clientY;

        event.preventDefault();
        handle.setPointerCapture(event.pointerId);
        handle.classList.add('is-dragging');

        const onPointerMove = (moveEvent) => {
          const distance = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
          if (distance > 3) moved = true;
          if (!moved) return;

          lastPosition = getPositionFromEvent(moveEvent, map);
          handle.style.left = `${lastPosition.x}%`;
          handle.style.top = `${lastPosition.y}%`;
        };

        const finishDrag = () => {
          handle.classList.remove('is-dragging');
          handle.removeEventListener('pointermove', onPointerMove);
          handle.removeEventListener('pointerup', onPointerUp);
          handle.removeEventListener('pointercancel', onPointerCancel);
          handle.removeEventListener('lostpointercapture', onPointerCancel);

          if (!moved) return;
          if (kind === 'node') ignoredNodeClickId = id;
          updatePosition(kind, id, lastPosition, kind === 'origin' ? 'originUpdated' : 'positionUpdated');
        };

        const onPointerUp = () => {
          finishDrag();
        };

        const onPointerCancel = () => {
          finishDrag();
        };

        handle.addEventListener('pointermove', onPointerMove);
        handle.addEventListener('pointerup', onPointerUp);
        handle.addEventListener('pointercancel', onPointerCancel);
        handle.addEventListener('lostpointercapture', onPointerCancel);
      });
    };

    const bindSkillNodes = () => {
      const nodes = Array.from(stage.querySelectorAll('[data-skill-node]'));
      const map = stage.querySelector('[data-skill-map]');
      const tooltip = stage.querySelector('[data-skill-tooltip]');

      if (!editorOpen) {
        const showTooltip = (nodeButton) => {
          const node = activeCategory?.nodes.find((item) => item.id === nodeButton.dataset.skillNode);
          if (!node || !tooltip || !map) return;

          const mapRect = map.getBoundingClientRect();
          const buttonRect = nodeButton.getBoundingClientRect();
          const tooltipWidth = Math.min(260, mapRect.width - 32);
          const nodeCenterX = buttonRect.left - mapRect.left + buttonRect.width / 2;
          const nodeTopY = buttonRect.top - mapRect.top;
          const desiredLeft = nodeCenterX > mapRect.width * 0.58 ? nodeCenterX - tooltipWidth - 22 : nodeCenterX + 22;
          const left = Math.max(16, Math.min(desiredLeft, mapRect.width - tooltipWidth - 16));
          const top = Math.max(16, Math.min(nodeTopY - 8, mapRect.height - 120));

          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
          tooltip.innerHTML = `
            <div class="skill-tooltip__media">
              ${renderTooltipMedia(node)}
            </div>
            <div class="skill-tooltip__body">
              <span class="skill-tooltip__eyebrow">${escapeHtml(node.tier)}</span>
              <strong>${escapeHtml(node.title[language])}</strong>
              <p>${escapeHtml(node.summary[language])}</p>
            </div>
          `;
          tooltip.classList.remove('is-hidden');
        };

        nodes.forEach((nodeButton) => {
          const activate = () => {
            nodes.forEach((item) => item.classList.toggle('is-active', item === nodeButton));
            showTooltip(nodeButton);
          };

          const deactivate = () => {
            nodeButton.classList.remove('is-active');
            hideTooltip();
          };

          nodeButton.addEventListener('mouseenter', activate);
          nodeButton.addEventListener('mouseleave', deactivate);
          nodeButton.addEventListener('focus', activate);
          nodeButton.addEventListener('blur', deactivate);
        });

        map?.addEventListener('mouseleave', hideTooltip);
        return;
      }

      hideTooltip();
      nodes.forEach((nodeButton) => bindDragHandle(nodeButton, 'node', nodeButton.dataset.skillNode));
      bindDragHandle(stage.querySelector('[data-skill-origin-handle]'), 'origin', 'origin');
    };

    const renderCategory = (categoryId) => {
      activeCategory =
        orderedCategories.find((category) => category.id === categoryId) ??
        categoriesState.find((category) => category.id === categoryId) ??
        activeCategory;
      selectedNodeId = '';
      linkingFromNodeId = '';
      contextMenu = null;
      renderStage();
    };

    const renameNode = (nodeId) => {
      if (!activeCategory || !nodeId) return;
      const node = activeCategory.nodes.find((item) => item.id === nodeId);
      if (!node) return;

      const nextTitle = window.prompt(language === 'fr' ? 'Nom du node' : 'Node title', node.title[language]);
      if (nextTitle === null) return;

      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      const nextNode = nextCategory?.nodes.find((item) => item.id === nodeId);
      if (!nextNode) return;

      nextNode.title.fr = nextTitle.trim() || nextNode.title.fr;
      nextNode.title.en = nextTitle.trim() || nextNode.title.en;
      nextNode.summary.fr = nextNode.title.fr;
      nextNode.summary.en = nextNode.title.en;
      selectedNodeId = nodeId;
      commitCategories(nextCategories, 'nodeUpdated');
    };

    const editTooltip = (nodeId) => {
      if (!activeCategory || !nodeId) return;
      const node = activeCategory.nodes.find((item) => item.id === nodeId);
      if (!node) return;

      const nextTier = window.prompt(getEditorText(language, 'tooltipTier'), node.tier);
      if (nextTier === null) return;
      const nextTitle = window.prompt(getEditorText(language, 'tooltipTitle'), node.title[language]);
      if (nextTitle === null) return;
      const nextSummary = window.prompt(getEditorText(language, 'tooltipSummary'), node.summary[language]);
      if (nextSummary === null) return;
      const nextDetails = window.prompt(getEditorText(language, 'tooltipDetails'), node.details[language]);
      if (nextDetails === null) return;
      const nextTooltipMedia = window.prompt(getEditorText(language, 'tooltipMediaPrompt'), node.tooltipMedia || '');
      if (nextTooltipMedia === null) return;

      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      const nextNode = nextCategory?.nodes.find((item) => item.id === nodeId);
      if (!nextNode) return;

      nextNode.tier = nextTier.trim() || nextNode.tier;
      nextNode.title[language] = nextTitle.trim() || nextNode.title[language];
      nextNode.summary[language] = nextSummary.trim() || nextNode.summary[language];
      nextNode.details[language] = nextDetails.trim() || nextNode.details[language];
      nextNode.tooltipMedia = nextTooltipMedia.trim();
      selectedNodeId = nodeId;
      contextMenu = null;
      commitCategories(nextCategories, 'nodeUpdated');
    };

    const editNodeIcon = (nodeId) => {
      if (!activeCategory || !nodeId) return;
      const node = activeCategory.nodes.find((item) => item.id === nodeId);
      if (!node) return;

      const nextIconImage = window.prompt(getEditorText(language, 'iconImagePrompt'), node.iconImage || '');
      if (nextIconImage === null) return;

      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      const nextNode = nextCategory?.nodes.find((item) => item.id === nodeId);
      if (!nextNode) return;

      nextNode.iconImage = nextIconImage.trim();
      selectedNodeId = nodeId;
      contextMenu = null;
      commitCategories(nextCategories, 'nodeUpdated');
    };

    const cycleNodeShape = (nodeId) => {
      if (!activeCategory || !nodeId) return;
      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      const nextNode = nextCategory?.nodes.find((item) => item.id === nodeId);
      if (!nextNode) return;

      const currentIndex = allowedShapes.indexOf(nextNode.shape);
      nextNode.shape = allowedShapes[(currentIndex + 1) % allowedShapes.length];
      selectedNodeId = nodeId;
      contextMenu = null;
      commitCategories(nextCategories, 'nodeUpdated');
    };

    const cycleNodeSize = (nodeId) => {
      if (!activeCategory || !nodeId) return;
      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      const nextNode = nextCategory?.nodes.find((item) => item.id === nodeId);
      if (!nextNode) return;

      const currentIndex = allowedSizes.indexOf(nextNode.size || 'medium');
      nextNode.size = allowedSizes[(currentIndex + 1) % allowedSizes.length];
      selectedNodeId = nodeId;
      contextMenu = null;
      commitCategories(nextCategories, 'nodeUpdated');
    };

    const addNodeAt = (position) => {
      if (!activeCategory) return;
      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      if (!nextCategory) return;

      const nextNode = createDefaultNode(nextCategory);
      const promptedTitle = window.prompt(language === 'fr' ? 'Nom du nouveau node' : 'New node title', nextNode.title[language]);
      if (promptedTitle !== null && promptedTitle.trim()) {
        nextNode.title.fr = promptedTitle.trim();
        nextNode.title.en = promptedTitle.trim();
        nextNode.summary.fr = promptedTitle.trim();
        nextNode.summary.en = promptedTitle.trim();
      }
      nextNode.position = position;
      nextCategory.nodes.push(nextNode);
      selectedNodeId = nextNode.id;
      contextMenu = null;
      commitCategories(nextCategories, 'nodeAdded');
    };

    const deleteNodeById = (nodeId) => {
      if (!nodeId || !activeCategory) return;
      if (!window.confirm(getEditorText(language, 'deleteNodeConfirm'))) return;

      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      if (!nextCategory) return;

      nextCategory.nodes = nextCategory.nodes.filter((node) => node.id !== nodeId);
      nextCategory.connections = nextCategory.connections.filter(
        (connection) => connection.from !== nodeId && connection.to !== nodeId
      );
      if (selectedNodeId === nodeId) {
        selectedNodeId = '';
      }
      contextMenu = null;
      commitCategories(nextCategories, 'nodeDeleted');
    };

    const toggleConnection = (from, to) => {
      if (!activeCategory || !to || !from || from === to) {
        setStatusMessage(getEditorText(language, 'linkInvalid'));
        return;
      }

      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      if (!nextCategory) return;

      const existingIndex = nextCategory.connections.findIndex(
        (connection) => connection.from === from && connection.to === to
      );

      if (existingIndex >= 0) {
        nextCategory.connections.splice(existingIndex, 1);
        contextMenu = null;
        commitCategories(nextCategories, 'linkRemoved');
        return;
      }

      nextCategory.connections.push({
        from,
        to,
        kind: from === 'origin' ? 'major' : 'branch',
      });
      contextMenu = null;
      commitCategories(nextCategories, 'linkAdded');
    };

    const addConnectionBetween = (from, to) => {
      if (!activeCategory || !from || !to || from === to) {
        setStatusMessage(getEditorText(language, 'linkInvalid'));
        return;
      }

      const nextCategories = cloneSkillCategories(categoriesState);
      const nextCategory = nextCategories.find((category) => category.id === activeCategory.id);
      if (!nextCategory) return;

      const exists = nextCategory.connections.some((connection) => connection.from === from && connection.to === to);
      if (exists) {
        linkingFromNodeId = '';
        contextMenu = null;
        renderStage();
        setStatusMessage(getEditorText(language, 'linkExists'));
        return;
      }

      nextCategory.connections.push({
        from,
        to,
        kind: from === 'origin' ? 'major' : 'branch',
      });
      linkingFromNodeId = '';
      contextMenu = null;
      commitCategories(nextCategories, 'linkAdded');
    };

    const resetEditorTrees = () => {
      if (!window.confirm(getEditorText(language, 'resetConfirm'))) return;
      categoriesState = resetSkillCategories();
      orderedCategories = getOrderedSkillCategories(categoriesState);
      activeCategory = orderedCategories.find((category) => category.id === activeCategory?.id) ?? orderedCategories[0];
      selectedNodeId = '';
      contextMenu = null;
      linkingFromNodeId = '';
      renderStage();
      setStatusMessage(getEditorText(language, 'resetDone'));
    };

    const copyEditorJson = async () => {
      try {
        await navigator.clipboard.writeText(exportSkillCategories(categoriesState));
        setStatusMessage(getEditorText(language, 'copied'));
      } catch {
        setStatusMessage(getEditorText(language, 'copyFailed'));
      }
    };

    const saveProjectFile = async () => {
      const moduleSource = exportSkillCategoriesModule(categoriesState);

      if (!('showSaveFilePicker' in window)) {
        setStatusMessage(getEditorText(language, 'projectSaveFailed'));
        return;
      }

      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'skills.seed.js',
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
        setStatusMessage(getEditorText(language, 'projectSaved'));
      } catch (error) {
        if (error?.name === 'AbortError') return;
        setStatusMessage(getEditorText(language, 'projectSaveFailed'));
      }
    };

    if (pageContent && homeSections.length > 1) {
      let snapLock = false;
      let snapTimer = 0;

      const getNearestSectionIndex = () => {
        const scrollTop = pageContent.scrollTop;
        return homeSections.reduce((closestIndex, section, index) => {
          const closestDistance = Math.abs(homeSections[closestIndex].offsetTop - scrollTop);
          const currentDistance = Math.abs(section.offsetTop - scrollTop);
          return currentDistance < closestDistance ? index : closestIndex;
        }, 0);
      };

      const snapToSection = (index, behavior = 'smooth') => {
        const safeIndex = Math.max(0, Math.min(index, homeSections.length - 1));
        const targetTop = homeSections[safeIndex]?.offsetTop ?? 0;
        if (Math.abs(pageContent.scrollTop - targetTop) < 4) return;

        snapLock = true;
        pageContent.scrollTo({ top: targetTop, behavior });
        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(() => {
          snapLock = false;
        }, 420);
      };

      const onWheel = (event) => {
        if (snapLock || Math.abs(event.deltaY) < 6) return;
        event.preventDefault();
        const currentIndex = getNearestSectionIndex();
        const nextIndex = event.deltaY > 0 ? currentIndex + 1 : currentIndex - 1;
        snapToSection(nextIndex);
      };

      const onScroll = () => {
        if (snapLock) return;
        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(() => {
          snapToSection(getNearestSectionIndex());
        }, 140);
      };

      pageContent.addEventListener('wheel', onWheel, { passive: false });
      pageContent.addEventListener('scroll', onScroll, { passive: true });
      addCleanup(() => {
        pageContent.removeEventListener('wheel', onWheel);
        pageContent.removeEventListener('scroll', onScroll);
        window.clearTimeout(snapTimer);
      });
    }

    if (homeSnapTrack && heroIdentity) {
      let trunkSyncTimerA = 0;
      let trunkSyncTimerB = 0;
      const bridge = root.querySelector('.home-trunk-bridge');
      const centerTrigger = triggerButtons[Math.floor(triggerButtons.length / 2)] ?? triggerButtons[0] ?? null;
      const centerVisual = centerTrigger?.querySelector('.category-card__visual, .category-card__icon') ?? centerTrigger;

      const syncTrunkTop = () => {
        const trackRect = homeSnapTrack.getBoundingClientRect();
        const anchorRect = (heroRoles ?? heroTitle ?? heroIdentity).getBoundingClientRect();
        const trunkTop = Math.max(anchorRect.bottom - trackRect.top + 30, 152);
        homeSnapTrack.style.setProperty('--home-trunk-top', `${Math.round(trunkTop)}px`);
      };

      const syncBridgeWaves = () => {
        if (!bridge || !centerVisual) return;
        const bridgeRect = bridge.getBoundingClientRect();
        const visualRect = centerVisual.getBoundingClientRect();
        const computedStyles = getComputedStyle(homeSnapTrack);
        const waveHeight = Number.parseFloat(computedStyles.getPropertyValue('--home-bridge-wave-height')) || 540;
        const upperWaveCenterY = (332 / 900) * waveHeight;
        const desiredOffset = visualRect.top + visualRect.height / 2 - bridgeRect.top - upperWaveCenterY;
        homeSnapTrack.style.setProperty('--home-bridge-wave-offset', `${Math.round(desiredOffset)}px`);
      };

      const syncTrunkTopAfterLayout = () => {
        syncTrunkTop();
        syncBridgeWaves();
        requestAnimationFrame(() => {
          syncTrunkTop();
          syncBridgeWaves();
        });
        trunkSyncTimerA = window.setTimeout(() => {
          syncTrunkTop();
          syncBridgeWaves();
        }, 120);
        trunkSyncTimerB = window.setTimeout(() => {
          syncTrunkTop();
          syncBridgeWaves();
        }, 320);
      };

      syncTrunkTopAfterLayout();
      document.fonts?.ready?.then(syncTrunkTopAfterLayout);
      window.addEventListener('load', syncTrunkTopAfterLayout, { once: true });
      window.addEventListener('resize', syncTrunkTopAfterLayout);

      if ('ResizeObserver' in window) {
        const identityObserver = new ResizeObserver(syncTrunkTopAfterLayout);
        identityObserver.observe(heroIdentity);
        const centerObserver = centerVisual ? new ResizeObserver(syncTrunkTopAfterLayout) : null;
        centerObserver?.observe(centerVisual);
        addCleanup(() => identityObserver.disconnect());
        addCleanup(() => centerObserver?.disconnect());
      }

      addCleanup(() => {
        window.removeEventListener('resize', syncTrunkTopAfterLayout);
        window.clearTimeout(trunkSyncTimerA);
        window.clearTimeout(trunkSyncTimerB);
      });
    }

    triggerButtons.forEach((button, index) => {
      button.classList.toggle('is-active', index === 0);
      button.addEventListener('click', () => {
        renderCategory(button.dataset.categoryTrigger);
        skillsHub?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    discoverButton?.addEventListener('click', (event) => {
      event.preventDefault();
      skillsHub?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    stage.addEventListener('click', (event) => {
      const navButton = event.target.closest('[data-skill-nav]');
      if (navButton) {
        const currentIndex = orderedCategories.findIndex((item) => item.id === activeCategory?.id);
        const nextIndex = navButton.dataset.skillNav === 'prev' ? currentIndex - 1 : currentIndex + 1;
        const nextCategory = orderedCategories[nextIndex];
        if (nextCategory) renderCategory(nextCategory.id);
        return;
      }

      const actionButton = event.target.closest('[data-editor-action]');
      if (actionButton) {
        const action = actionButton.dataset.editorAction;
        if (action === 'toggle') {
          editorOpen = !editorOpen;
          contextMenu = null;
          linkingFromNodeId = '';
          renderStage();
        }
        if (action === 'copy-json') copyEditorJson();
        if (action === 'save-project') saveProjectFile();
        if (action === 'reset') resetEditorTrees();
        return;
      }

      const contextButton = event.target.closest('[data-context-action]');
      if (contextButton) {
        const action = contextButton.dataset.contextAction;
        const nodeId = contextButton.dataset.contextNode || '';

        if (action === 'add-node-at' && contextMenu?.position) addNodeAt(contextMenu.position);
        if (action === 'select-node') {
          selectedNodeId = nodeId;
          contextMenu = null;
          renderStage();
        }
        if (action === 'rename-node') renameNode(nodeId);
        if (action === 'edit-tooltip') editTooltip(nodeId);
        if (action === 'edit-icon') editNodeIcon(nodeId);
        if (action === 'cycle-shape') cycleNodeShape(nodeId);
        if (action === 'cycle-size') cycleNodeSize(nodeId);
        if (action === 'arm-link-mode') {
          selectedNodeId = nodeId;
          linkingFromNodeId = nodeId;
          contextMenu = null;
          renderStage();
          setStatusMessage(getEditorText(language, 'linkModeArmed'));
        }
        if (action === 'delete-node') deleteNodeById(nodeId);
        if (action === 'add-link-from-selected' && selectedNodeId) toggleConnection(selectedNodeId, nodeId);
        if (action === 'remove-link-from-selected' && selectedNodeId) toggleConnection(selectedNodeId, nodeId);
        if (action === 'add-link-from-origin') toggleConnection('origin', nodeId);
        if (action === 'remove-link-from-origin') toggleConnection('origin', nodeId);
        return;
      }

      if (editorOpen && contextMenu && !event.target.closest('[data-skill-editor-menu]')) {
        contextMenu = null;
        renderStage();
        return;
      }

      const nodeButton = event.target.closest('[data-skill-node]');
      if (!nodeButton) return;
      if (ignoredNodeClickId && ignoredNodeClickId === nodeButton.dataset.skillNode) {
        ignoredNodeClickId = '';
        return;
      }
      if (editorOpen && linkingFromNodeId) {
        if (nodeButton.dataset.skillNode === linkingFromNodeId) {
          linkingFromNodeId = '';
          contextMenu = null;
          renderStage();
          setStatusMessage(getEditorText(language, 'linkModeCanceled'));
          return;
        }
        addConnectionBetween(linkingFromNodeId, nodeButton.dataset.skillNode);
        return;
      }
      selectedNodeId = nodeButton.dataset.skillNode;
      contextMenu = null;
      renderStage();
    });

    stage.addEventListener('contextmenu', (event) => {
      if (!editorOpen) return;
      const map = event.target.closest('[data-skill-map]');
      if (!map) return;

      event.preventDefault();
      const nodeButton = event.target.closest('[data-skill-node]');
      if (nodeButton) {
        selectedNodeId = nodeButton.dataset.skillNode;
      }
      openContextMenu(event, nodeButton?.dataset.skillNode || '');
    });

    renderStage();
    hideTooltip();

    if (heroVisual) {
      const onHeroScroll = () => {
        const scrollTop = pageContent?.scrollTop ?? window.scrollY;
        heroVisual.style.transform = `translateY(${Math.min(scrollTop * 0.03, 12)}px)`;
      };

      const scrollTarget = pageContent ?? window;
      onHeroScroll();
      scrollTarget.addEventListener('scroll', onHeroScroll, { passive: true });
      addCleanup(() => scrollTarget.removeEventListener('scroll', onHeroScroll));
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  },
};
