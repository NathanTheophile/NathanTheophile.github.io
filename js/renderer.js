function Renderer(gl) {
  this.gl = gl;
  this.plane = GL.Mesh.plane();
  this.shader = new GL.Shader(
    `attribute vec3 vertex;
     varying vec2 coord;
     void main() {
       coord = vertex.xy * 0.5 + 0.5;
       gl_Position = vec4(vertex, 1.0);
     }`,
    `precision mediump float;
     uniform sampler2D heightmap;
     varying vec2 coord;
     void main() {
       float h = texture2D(heightmap, coord).r;
       gl_FragColor = vec4(vec3(h), 1.0);  // grayscale visualisation
     }`
  );
}

Renderer.prototype.render = function (water) {
  const gl = this.gl;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bindTexture(gl.TEXTURE_2D, water.getCurrentTexture());
  this.shader.uniforms({ heightmap: 0 }).draw(this.plane);
};