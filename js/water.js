function Water(gl, renderer) {
  this.gl = gl;
  this.renderer = renderer;
  const size = 512;

  this.size = size;
  this.plane = GL.Mesh.plane();
  this.textureA = gl.createTexture();
  this.textureB = gl.createTexture();

  this.framebuffer = gl.createFramebuffer();
  this.current = 0;

  this.initTexture(this.textureA);
  this.initTexture(this.textureB);

  this.stepShader = new GL.Shader(
    `attribute vec3 vertex;
     varying vec2 coord;
     void main() {
       coord = vertex.xy * 0.5 + 0.5;
       gl_Position = vec4(vertex, 1.0);
     }`,
    `precision mediump float;
     uniform sampler2D texture;
     uniform vec2 delta;
     varying vec2 coord;
     void main() {
       float center = texture2D(texture, coord).r;
       float left   = texture2D(texture, coord - vec2(delta.x, 0)).r;
       float right  = texture2D(texture, coord + vec2(delta.x, 0)).r;
       float up     = texture2D(texture, coord + vec2(0, delta.y)).r;
       float down   = texture2D(texture, coord - vec2(0, delta.y)).r;
       float avg = (left + right + up + down) * 0.25;
       float diff = avg - center;
       gl_FragColor = vec4(center + diff * 0.2, 0.0, 0.0, 1.0);
     }`
  );
}

Water.prototype.initTexture = function (tex) {
  const gl = this.gl;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size, this.size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
};

Water.prototype.stepSimulation = function () {
  const gl = this.gl;
  const read = this.current === 0 ? this.textureA : this.textureB;
  const write = this.current === 0 ? this.textureB : this.textureA;
  this.current = 1 - this.current;

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, write, 0);
  gl.viewport(0, 0, this.size, this.size);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindTexture(gl.TEXTURE_2D, read);
  this.stepShader.uniforms({
    texture: 0,
    delta: [1.0 / this.size, 1.0 / this.size]
  }).draw(this.plane);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

Water.prototype.getCurrentTexture = function () {
  return this.current === 0 ? this.textureA : this.textureB;
};