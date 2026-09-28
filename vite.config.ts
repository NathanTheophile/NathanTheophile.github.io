import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), {
    name: "local-design-reference",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__reference/image.png", async (_req, res) => {
        try {
          const image = await readFile(resolve(".visual-check/reference.png"));
          res.setHeader("Content-Type", "image/png");
          res.setHeader("Cache-Control", "no-store");
          res.end(image);
        } catch {
          res.statusCode = 404;
          res.end("Load the reference in the comparison tool, or copy it to .visual-check/reference.png.");
        }
      });
    },
  }],
  server: { host: "127.0.0.1" },
});
