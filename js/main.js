window.onload = function () {
  GL.create();
  const gl = GL.gl;
  const canvas = GL.canvas;
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error("GL.canvas is not a valid HTMLCanvasElement:", canvas);
    return;
  }
  document.body.appendChild(canvas);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const renderer = new Renderer(gl);
  const water = new Water(gl, renderer);

  let lastTime = Date.now();

  function animate() {
    const now = Date.now();
    const dt = (now - lastTime) / 1000.0;
    lastTime = now;

    water.stepSimulation();
    renderer.render(water);

    requestAnimationFrame(animate);
  }

  animate();
};