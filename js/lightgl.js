// Version minimale de LightGL pour notre usage
var GL = (function () {
  let gl, canvas;
  return {
    create: function () {
        canvas = document.createElement("canvas");
        this.canvas = canvas;
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        this.gl = gl;
        return this;
      },      
    get gl() {
      return gl;
    },
    Mesh: {
      plane: function () {
        const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        return {
          draw: function () {
            gl.enableVertexAttribArray(0);
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          }
        };
      }
    },
    Shader: function (vert, frag) {
      const compile = (src, type) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const vs = compile(vert, gl.VERTEX_SHADER);
      const fs = compile(frag, gl.FRAGMENT_SHADER);
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      return {
        uniforms: function (obj) {
          gl.useProgram(program);
          for (let name in obj) {
            const loc = gl.getUniformLocation(program, name);
            const val = obj[name];
            if (typeof val === 'number') gl.uniform1f(loc, val);
            else if (val.length === 2) gl.uniform2fv(loc, val);
            else if (val.length === 3) gl.uniform3fv(loc, val);
            else if (val.length === 4) gl.uniform4fv(loc, val);
          }
          return this;
        },
        draw: function (mesh) {
          gl.useProgram(program);
          mesh.draw();
        }
      };
    }
  };
})();