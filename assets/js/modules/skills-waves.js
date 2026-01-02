export function initSkillsWaves({ prefersReducedMotion }) {
  if (!window.jQuery) return;

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