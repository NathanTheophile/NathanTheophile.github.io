const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const pages = Array.from(document.querySelectorAll('.page'));
const pageContainer = document.querySelector('.page-container');
const siteHeader = document.querySelector('.site-header');
const skillsScroll = document.querySelector('.skills-scroll');
const leafLayer = document.querySelector('.leaf-fall-layer');
const skillsIntro = document.querySelector('.skills-panel--intro');
const skillsIntroImage = skillsIntro?.querySelector('img');
const trailCanvas = document.querySelector('.mouse-trail');
const trailContext = trailCanvas?.getContext('2d');

const pageOrder = navLinks.map((link) => link.dataset.page).filter(Boolean);
const pageMap = new Map(pages.map((page) => [page.dataset.page, page]));

let activePage = document.querySelector('.page.is-active')?.dataset.page || pageOrder[0];
let viewportWidth = window.innerWidth;
let leafInterval = null;
let trailAnimationFrame = null;
let trailPoints = [];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const trailLifetime = 520;
const trailMaxWidth = 5;
const trailMinWidth = 0.3;

const setViewportWidth = () => {
  viewportWidth = window.innerWidth;
};

const updateHeaderVisibility = () => {
  if (!siteHeader) return;

  if (activePage !== 'skills') {
    siteHeader.classList.remove('is-hidden');
    return;
  }

  if (!skillsScroll) return;
  siteHeader.classList.toggle('is-hidden', skillsScroll.scrollTop > 0);
};

const setPagePositions = (targetPage = activePage, offsetX = 0) => {
  const targetIndex = pageOrder.indexOf(targetPage);

  pages.forEach((page) => {
    const pageIndex = pageOrder.indexOf(page.dataset.page);
    const baseOffset = (pageIndex - targetIndex) * viewportWidth;
    page.style.transform = `translateX(${baseOffset + offsetX}px)`;
    page.classList.toggle('is-active', page.dataset.page === targetPage);
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.page === targetPage);
  });
};

const updateActivePage = (nextPage) => {
  if (!nextPage || nextPage === activePage) {
    setPagePositions(activePage, 0);
    updateHeaderVisibility();
    setLeafFallState(activePage === 'skills');
    return;
  }
  activePage = nextPage;
  setPagePositions(activePage, 0);
  updateHeaderVisibility();
  setLeafFallState(activePage === 'skills');
};

const getAdjacentPage = (direction) => {
  const currentIndex = pageOrder.indexOf(activePage);
  const nextIndex = currentIndex + direction;
  return pageOrder[nextIndex];
};

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    updateActivePage(link.dataset.page);
  });
});

let isDragging = false;
let dragStarted = false;
let startX = 0;
let startY = 0;

pageContainer.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;

  isDragging = true;
  dragStarted = false;
  startX = event.clientX;
  startY = event.clientY;
  pageContainer.setPointerCapture(event.pointerId);
});

pageContainer.addEventListener('pointermove', (event) => {
  if (!isDragging) return;

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;

  if (!dragStarted) {
    if (Math.abs(deltaX) < 8 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }
    dragStarted = true;
    pageContainer.classList.add('is-dragging');
  }

  event.preventDefault();
  setPagePositions(activePage, deltaX);
});

const endDrag = (event) => {
  if (!isDragging) return;

  const deltaX = event.clientX - startX;
  const threshold = Math.min(140, viewportWidth * 0.2);

  pageContainer.classList.remove('is-dragging');

  if (dragStarted && Math.abs(deltaX) > threshold) {
    const direction = deltaX > 0 ? -1 : 1;
    updateActivePage(getAdjacentPage(direction));
  } else {
    setPagePositions(activePage, 0);
  }

  isDragging = false;
  dragStarted = false;
};

pageContainer.addEventListener('pointerup', endDrag);
pageContainer.addEventListener('pointercancel', endDrag);

window.addEventListener('resize', () => {
  setViewportWidth();
  setPagePositions(activePage, 0);
  resizeTrailCanvas();
});

if (skillsScroll) {
  skillsScroll.addEventListener('scroll', () => {
    if (activePage !== 'skills') return;
    updateHeaderVisibility();
  }, { passive: true });
}

setViewportWidth();
setPagePositions(activePage, 0);
updateHeaderVisibility();
setLeafFallState(activePage === 'skills');
resizeTrailCanvas();

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function buildLeafKeyframes(maxDrop, maxSway, startRotation) {
  const keyframes = [];
  const steps = 8;
  const easeOutCirc = 'cubic-bezier(0.37, 0, 0.63, 1)';
  const drift = randomBetween(-maxSway * 0.3, maxSway * 0.3);
  const directionStart = Math.random() < 0.5 ? -1 : 1;
  const maxOpacity = 0.8;
  const minOpacity = 0.1;

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const drop = maxDrop * progress;
    const swingDirection = step === 0 ? 0 : directionStart * (step % 2 === 0 ? -1 : 1);
    const swingMagnitude = maxSway * (0.35 + progress * 0.65);
    const currentX = swingDirection * swingMagnitude + drift * progress;
    const currentRotation = step === 0 ? startRotation : swingDirection * -45;
    const opacity = minOpacity + (maxOpacity - minOpacity) * (1 - progress);

    keyframes.push({
      transform: `translate(${currentX.toFixed(2)}px, ${drop.toFixed(2)}px) rotate(${currentRotation.toFixed(2)}deg)`,
      opacity: Number(opacity.toFixed(2)),
      easing: easeOutCirc,
    });
  }

  return keyframes;
}

function createFallingLeaf() {
  if (!leafLayer || prefersReducedMotion.matches) return;

  const layerRect = leafLayer.getBoundingClientRect();
  if (!layerRect.width || !layerRect.height) return;

  const treeRect = skillsIntroImage?.getBoundingClientRect();
  const spawnBounds = treeRect && treeRect.width && treeRect.height
    ? {
        left: Math.max(treeRect.left, layerRect.left),
        right: Math.min(treeRect.right, layerRect.right),
        top: Math.max(treeRect.top, layerRect.top),
        bottom: Math.min(treeRect.bottom, layerRect.bottom),
      }
    : {
        left: layerRect.left,
        right: layerRect.right,
        top: layerRect.top,
        bottom: layerRect.bottom,
      };

  const spawnWidth = Math.max(0, spawnBounds.right - spawnBounds.left);
  const spawnHeight = Math.max(0, spawnBounds.bottom - spawnBounds.top);
  const safeSpawnWidth = spawnWidth || layerRect.width;
  const safeSpawnHeight = spawnHeight || layerRect.height;
  const spawnOffsetX = (spawnBounds.left ?? layerRect.left) - layerRect.left;
  const spawnOffsetY = (spawnBounds.top ?? layerRect.top) - layerRect.top;

  const leaf = document.createElement('img');
  leaf.src = 'assets/img/tree/leave.svg';
  leaf.alt = '';
  leaf.className = 'falling-leaf';
  const size = randomBetween(6, 12);
  leaf.style.width = `${size}px`;
  leaf.style.height = 'auto';

  const startX = randomBetween(safeSpawnWidth * 0.15, safeSpawnWidth * 0.85) + spawnOffsetX;
  const startY = randomBetween(safeSpawnHeight * 0.05, safeSpawnHeight * 0.4) + spawnOffsetY;
  leaf.style.left = `${startX}px`;
  leaf.style.top = `${startY}px`;

  const availableDrop = Math.max(layerRect.height - startY, layerRect.height * 0.35);
  const maxDrop = availableDrop * randomBetween(0.6, 0.95);
  const maxSway = safeSpawnWidth * randomBetween(0.05, 0.12);
  const startRotation = randomBetween(-30, 30);

  const animation = leaf.animate(buildLeafKeyframes(maxDrop, maxSway, startRotation), {
    duration: randomBetween(10400, 18000),
    easing: 'linear',
    fill: 'forwards',
  });

  animation.addEventListener('finish', () => {
    leaf.remove();
  });

  leafLayer.appendChild(leaf);
}

function setLeafFallState(shouldRun) {
  if (!leafLayer) return;

  if (leafInterval) {
    clearInterval(leafInterval);
    leafInterval = null;
  }

  if (!shouldRun || prefersReducedMotion.matches) {
    leafLayer.innerHTML = '';
    return;
  }

  leafInterval = setInterval(createFallingLeaf, 250);
}

if (prefersReducedMotion?.addEventListener) {
  prefersReducedMotion.addEventListener('change', () => {
    setLeafFallState(activePage === 'skills');
    if (prefersReducedMotion.matches) {
      trailPoints = [];
      clearTrailCanvas();
    }
  });
}

function resizeTrailCanvas() {
  if (!trailCanvas || !trailContext) return;

  const dpr = window.devicePixelRatio || 1;
  trailCanvas.width = window.innerWidth * dpr;
  trailCanvas.height = window.innerHeight * dpr;
  trailCanvas.style.width = `${window.innerWidth}px`;
  trailCanvas.style.height = `${window.innerHeight}px`;
  trailContext.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function clearTrailCanvas() {
  if (!trailCanvas || !trailContext) return;
  trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
}

function addTrailPoint(event) {
  if (!trailCanvas || !trailContext || prefersReducedMotion.matches) return;
  const timestamp = performance.now();
  const lastPoint = trailPoints[trailPoints.length - 1];
  const nextPoint = {
    x: event.clientX,
    y: event.clientY,
    timestamp,
  };

  if (!lastPoint) {
    trailPoints.push(nextPoint);
  } else {
    const dx = nextPoint.x - lastPoint.x;
    const dy = nextPoint.y - lastPoint.y;
    const distance = Math.hypot(dx, dy);
    const maxStep = 6;

    if (distance >= maxStep) {
      const steps = Math.floor(distance / maxStep);
      for (let step = 1; step <= steps; step += 1) {
        const progress = step / (steps + 1);
        trailPoints.push({
          x: lastPoint.x + dx * progress,
          y: lastPoint.y + dy * progress,
          timestamp,
        });
      }
    }

    trailPoints.push(nextPoint);
  }

  if (!trailAnimationFrame) {
    trailAnimationFrame = requestAnimationFrame(animateTrail);
  }
}

function animateTrail() {
  if (!trailCanvas || !trailContext) return;

  clearTrailCanvas();

  const now = performance.now();
  trailPoints = trailPoints.filter((point) => now - point.timestamp <= trailLifetime);

  if (trailPoints.length < 2) {
    if (trailPoints.length === 0 && trailAnimationFrame) {
      cancelAnimationFrame(trailAnimationFrame);
      trailAnimationFrame = null;
    }
    return;
  }

  for (let index = 1; index < trailPoints.length; index += 1) {
    const previous = trailPoints[index - 1];
    const current = trailPoints[index];
    const age = now - current.timestamp;
    const lifeProgress = Math.min(age / trailLifetime, 1);
    const width = Math.max(trailMinWidth, trailMaxWidth * (1 - lifeProgress));
    const alpha = 0.65 * (1 - lifeProgress);

    trailContext.strokeStyle = `rgba(168, 157, 138, ${alpha.toFixed(3)})`;
    trailContext.lineWidth = width;
    trailContext.lineCap = 'round';
    trailContext.lineJoin = 'round';
    trailContext.beginPath();
    trailContext.moveTo(previous.x, previous.y);
    trailContext.lineTo(current.x, current.y);
    trailContext.stroke();
  }

  trailAnimationFrame = requestAnimationFrame(animateTrail);
}

const trailTargets = [window, pageContainer].filter(Boolean);
trailTargets.forEach((target) => {
  target.addEventListener('pointermove', addTrailPoint, { passive: true });
  target.addEventListener('pointerdown', addTrailPoint, { passive: true });
});

if (window.jQuery) {
  window.jQuery(() => {
    const $wavePaths = window.jQuery('.skills-waves path');
    if (!$wavePaths.length || prefersReducedMotion.matches) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const accentColor = rootStyles.getPropertyValue('--accent').trim();
    const mutedColor = rootStyles.getPropertyValue('--muted').trim();

    const hexToRgb = (hex) => {
      const cleaned = hex.replace('#', '');
      const value = cleaned.length === 3
        ? cleaned.split('').map((char) => char + char).join('')
        : cleaned;
      const intValue = Number.parseInt(value, 16);
      return {
        r: (intValue >> 16) & 255,
        g: (intValue >> 8) & 255,
        b: intValue & 255,
      };
    };

    const mixColors = (from, to, amount) => {
      const r = Math.round(from.r + (to.r - from.r) * amount);
      const g = Math.round(from.g + (to.g - from.g) * amount);
      const b = Math.round(from.b + (to.b - from.b) * amount);
      return `rgb(${r}, ${g}, ${b})`;
    };

    const accentRgb = hexToRgb(accentColor);
    const mutedRgb = hexToRgb(mutedColor);

    $wavePaths.each((index, element) => {
      const $path = window.jQuery(element);
      const mixAmount = Math.random();
      $path.attr('stroke', mixColors(accentRgb, mutedRgb, mixAmount));

      const duration = 7000 + index * 1400;
      const amplitude = 18 + index * 6;
      const animateWave = () => {
        window.jQuery({ phase: 0 }).animate(
          { phase: Math.PI * 2 },
          {
            duration,
            easing: 'linear',
            step(now) {
              const offset = Math.sin(now) * amplitude;
              const verticalOffset = Math.cos(now) * amplitude * 0.12;
              $path.attr('transform', `translate(${offset} ${verticalOffset})`);
            },
            complete() {
              $path.attr('transform', 'translate(0 0)');
              animateWave();
            },
          },
        );
      };

      setTimeout(animateWave, index * 300);
    });
  });
}