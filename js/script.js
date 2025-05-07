const canvas = document.getElementById('linesCanvas');
const ctx = canvas.getContext('2d');

// Paramètres
let width, height;

const numLines = 80;
let lines = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    for (let i = 0; i < numLines; i++) {
      lines.push({
        x: (i / numLines) * width,
        offset: Math.random() * 1000,
        pulse: Math.random() < 0.1 ? 0 : null
      });
    }
}

window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  lines.forEach((line, i) => {
    // Ligne de base
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();

    let yStep = 20;
    for (let y = 0; y < height; y += yStep) {
      const curve = Math.sin((y + line.offset) * 0.01 + i) * 10;
      const x = line.x + curve;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();

    // Effet de "pulsation"
    if (line.pulse !== null) {
      let pulseY = line.pulse;
      const pulseHeight = 100;

      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      for (let y = pulseY; y < pulseY + pulseHeight && y < height; y += yStep) {
        const curve = Math.sin((y + line.offset) * 0.01 + i) * 10;
        const x = line.x + curve;
        if (y === pulseY) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      line.pulse += 2;
      if (line.pulse > height + pulseHeight) {
        line.pulse = Math.random() < 0.01 ? 0 : null;
      }
    } else if (Math.random() < 0.001) {
      line.pulse = 0;
    }

    line.offset += 0.5;
  });

  requestAnimationFrame(draw);
}

draw();
