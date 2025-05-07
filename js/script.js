import { CONFIG } from './config.js';

const canvas = document.getElementById('linesCanvas');
const ctx = canvas.getContext('2d');

const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
canvas.width = screenWidth * CONFIG.screenMultiplierX;
canvas.height = screenHeight * CONFIG.screenMultiplierY;

const width = canvas.width;
const height = canvas.height;

const lines = [];

for (let x = 0; x <= width; x += CONFIG.lineSpacing) {
  lines.push({
    x: x,
    offset: Math.random() * 1000,
    pulse: null
  });
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  lines.forEach((line, i) => {
    // Ligne normale
    const [r, g, b] = CONFIG.lineBaseColor;
    ctx.strokeStyle = `rgba(${r},${g},${b},${CONFIG.lineBaseOpacity})`;
    ctx.beginPath();

    for (let y = 0; y < height; y += CONFIG.yStep) {
      const curve = Math.sin((y + line.offset) * CONFIG.curveFrequency + i * CONFIG.curveScrollOffset) * CONFIG.curveAmplitude;
      const px = line.x + curve;
      if (y === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }

    ctx.stroke();

    // Ligne impulsée
    if (line.pulse) {
      const pulseY = line.pulse.y;

      ctx.strokeStyle = `rgba(${r},${g},${b},${CONFIG.linePulseOpacity})`;
      ctx.beginPath();

      for (let y = pulseY; y < pulseY + CONFIG.pulseHeight && y < height; y += 10) {
        const curve = Math.sin((y + line.offset) * CONFIG.curveFrequency + i * CONFIG.curveScrollOffset) * CONFIG.curveAmplitude;
        const px = line.x + curve;
        if (y === pulseY) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }

      ctx.stroke();

      line.pulse.life--;
      if (line.pulse.life <= 0) {
        line.pulse = null;
      }
    } else if (Math.random() < CONFIG.pulseChance) {
      line.pulse = {
        y: Math.random() * height,
        life: CONFIG.pulseDuration
      };
    }

    line.offset += CONFIG.offsetSpeed;
  });

  requestAnimationFrame(draw);
}

draw();
