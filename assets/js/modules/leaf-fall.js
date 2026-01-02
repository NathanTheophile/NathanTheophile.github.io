const trailIntervalDelay = 250;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const buildLeafKeyframes = (maxDrop, maxSway, startRotation) => {
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
};

const getCanopyBounds = (treeRect, layerRect) => {
  if (!treeRect || !treeRect.width || !treeRect.height) {
    return {
      left: layerRect.left,
      right: layerRect.right,
      top: layerRect.top,
      bottom: layerRect.bottom,
    };
  }

  const canopyBounds = {
    left: treeRect.left + treeRect.width * 0.06,
    right: treeRect.left + treeRect.width * 0.94,
    top: treeRect.top + treeRect.height * 0.04,
    bottom: treeRect.top + treeRect.height * 0.56,
  };

  return {
    left: Math.max(canopyBounds.left, layerRect.left),
    right: Math.min(canopyBounds.right, layerRect.right),
    top: Math.max(canopyBounds.top, layerRect.top),
    bottom: Math.min(canopyBounds.bottom, layerRect.bottom),
  };
};

export function createLeafFall({ leafLayer, skillsIntroImage, prefersReducedMotion }) {
  let leafInterval = null;
  let canopyMaskCache = null;
  let canopyMaskSource = null;

  const getCanopyMask = (imageElement) => {
    if (!imageElement?.complete || !imageElement.naturalWidth || !imageElement.naturalHeight) {
      return null;
    }

    if (canopyMaskSource !== imageElement.src) {
      canopyMaskSource = imageElement.src;
      canopyMaskCache = null;
    }

    if (canopyMaskCache) {
      return canopyMaskCache;
    }

    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(imageElement, 0, 0);
    canopyMaskCache = {
      data: context.getImageData(0, 0, canvas.width, canvas.height).data,
      width: canvas.width,
      height: canvas.height,
    };

    return canopyMaskCache;
  };

  const isPointInCanopyMask = (pageX, pageY, treeRect, maskData) => {
    if (!maskData || !treeRect.width || !treeRect.height) return false;

    const relativeX = (pageX - treeRect.left) / treeRect.width;
    const relativeY = (pageY - treeRect.top) / treeRect.height;
    if (relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1) return false;

    const pixelX = Math.min(maskData.width - 1, Math.max(0, Math.round(relativeX * maskData.width)));
    const pixelY = Math.min(maskData.height - 1, Math.max(0, Math.round(relativeY * maskData.height)));
    const alpha = maskData.data[(pixelY * maskData.width + pixelX) * 4 + 3];

    return alpha > 10;
  };

  const createFallingLeaf = () => {
    if (!leafLayer || prefersReducedMotion.matches) return;

    const layerRect = leafLayer.getBoundingClientRect();
    if (!layerRect.width || !layerRect.height) return;

    const treeRect = skillsIntroImage?.getBoundingClientRect();
    const spawnBounds = getCanopyBounds(treeRect, layerRect);
    const canopyMask = treeRect ? getCanopyMask(skillsIntroImage) : null;

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

    let startX = randomBetween(safeSpawnWidth * 0.15, safeSpawnWidth * 0.85) + spawnOffsetX;
    let startY = randomBetween(safeSpawnHeight * 0.1, safeSpawnHeight * 0.9) + spawnOffsetY;
    const maxAttempts = 18;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const candidateX = randomBetween(safeSpawnWidth * 0.15, safeSpawnWidth * 0.85) + spawnOffsetX;
      const candidateY = randomBetween(safeSpawnHeight * 0.1, safeSpawnHeight * 0.9) + spawnOffsetY;
      const pageX = candidateX + layerRect.left;
      const pageY = candidateY + layerRect.top;

      if (!canopyMask || !treeRect) {
        startX = candidateX;
        startY = candidateY;
        break;
      }

      if (isPointInCanopyMask(pageX, pageY, treeRect, canopyMask)) {
        startX = candidateX;
        startY = candidateY;
        break;
      }
    }

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
  };

  const setLeafFallState = (shouldRun) => {
    if (!leafLayer) return;

    if (leafInterval) {
      clearInterval(leafInterval);
      leafInterval = null;
    }

    if (!shouldRun || prefersReducedMotion.matches) {
      leafLayer.innerHTML = '';
      return;
    }

    leafInterval = setInterval(createFallingLeaf, trailIntervalDelay);
  };

  return {
    setActivePage: (page) => setLeafFallState(page === 'skills'),
    handleReducedMotionChange: (activePage) => setLeafFallState(activePage === 'skills'),
  };
}