import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const loopback = new Set(["localhost", "127.0.0.1", "[::1]", "::1", "::ffff:127.0.0.1"]);
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const formats = new Map([
  ["image/png", "png"], ["image/jpeg", "jpg"], ["image/gif", "gif"],
  ["image/webp", "webp"], ["image/avif", "avif"],
]);
class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function body(req: IncomingMessage, limit: number) {
  if (Number(req.headers["content-length"]) > limit) {
    req.resume();
    throw new RequestError(413, "Fichier ou contenu trop volumineux.");
  }
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > limit) {
        chunks.length = 0;
        reject(new RequestError(413, "Fichier ou contenu trop volumineux."));
      } else chunks.push(chunk);
    });
    req.once("end", () => resolve(Buffer.concat(chunks)));
    req.once("error", reject);
    req.once("aborted", () => reject(new RequestError(400, "Envoi interrompu.")));
  });
}

function validImage(bytes: Buffer, format: string) {
  if (format === "png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (format === "jpg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (format === "gif") return /^GIF8[79]a$/.test(bytes.toString("ascii", 0, 6));
  if (format === "webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  return bytes.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(bytes.toString("ascii", 8, 32));
}

// Only the content schema can be saved. Coordinates, source code and paths
// are never accepted from the browser.
function validate(value: unknown, template: unknown, path = "") {
  const invalid = () => { throw new RequestError(400, "Contenu invalide : " + path); };
  if (path.endsWith("Media")) {
    if (value === null) return;
    if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
    const media = value as Record<string, unknown>;
    if (Object.keys(media).some(key => key !== "src" && key !== "alt") || typeof media.src !== "string") return invalid();
    if (media.alt !== undefined && (typeof media.alt !== "string" || media.alt.length > 2000)) return invalid();
    if (/^media\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|webp|avif)$/.test(media.src)) return;
    try {
      const url = new URL(media.src);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return invalid();
    } catch { return invalid(); }
    return;
  }
  if (typeof template === "string") {
    if (typeof value !== "string" || value.length > 20000) return invalid();
    if (path === "identity.email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return invalid();
    return;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value) || value.length !== template.length) return invalid();
    template.forEach((item, index) => validate(value[index], item, path + "." + index));
    return;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
  const object = value as Record<string, unknown>;
  const schema = template as Record<string, unknown>;
  if (Object.keys(object).length !== Object.keys(schema).length || Object.keys(object).some(key => !(key in schema))) return invalid();
  Object.entries(schema).forEach(([key, item]) => validate(object[key], item, path ? path + "." + key : key));
}

export function editorMiddleware(root: string) {
  const file = resolve(root, "src/content.json");
  const token = randomUUID();
  let saving = false;
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const pathname = req.url?.split("?")[0];
    if (!pathname?.startsWith("/__editor/")) return next();
    const reply = (status: number, value: unknown) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.end(JSON.stringify(value));
    };
    try {
      const origin = new URL("http://" + req.headers.host);
      if (!loopback.has(origin.hostname) || !loopback.has(req.socket.remoteAddress ?? ""))
        throw new RequestError(403, "Éditeur disponible uniquement en local.");
      if (req.headers.origin && req.headers.origin !== origin.origin)
        throw new RequestError(403, "Origine refusée.");
      if (req.method !== "GET" && req.headers["x-portfolio-editor"] !== token)
        throw new RequestError(403, "Session d’édition invalide. Recharge l’éditeur.");
      if (pathname === "/__editor/content" && req.method === "GET") {
        const raw = await readFile(file, "utf8");
        return reply(200, { content: JSON.parse(raw), version: digest(raw), token });
      }
      if (pathname === "/__editor/content" && req.method === "PUT") {
        if (saving) throw new RequestError(409, "Une sauvegarde est déjà en cours.");
        saving = true;
        const temporary = file + "." + randomUUID() + ".tmp";
        try {
          const request = JSON.parse((await body(req, 1024 * 1024)).toString("utf8"));
          const raw = await readFile(file, "utf8");
          if (request.version !== digest(raw)) throw new RequestError(409, "Le fichier a changé. Recharge le contenu avant de sauvegarder.");
          validate(request.content, JSON.parse(raw));
          const updated = JSON.stringify(request.content, null, 2) + "\n";
          await writeFile(temporary, updated, { flag: "wx" });
          // Check again after writing, so an external edit is not silently lost.
          if (digest(await readFile(file, "utf8")) !== request.version) throw new RequestError(409, "Le fichier a changé pendant la sauvegarde.");
          await rename(temporary, file);
          return reply(200, { content: request.content, version: digest(updated) });
        } finally {
          saving = false;
          await unlink(temporary).catch(() => {});
        }
      }
      if (pathname === "/__editor/media" && req.method === "POST") {
        const format = formats.get(req.headers["content-type"] ?? "");
        if (!format) throw new RequestError(400, "Utilise une image PNG, JPEG, GIF, WebP ou AVIF.");
        const bytes = await body(req, 12 * 1024 * 1024);
        if (!validImage(bytes, format)) throw new RequestError(400, "Le fichier ne correspond pas au format annoncé.");
        const filename = "upload-" + randomUUID() + "." + format;
        await mkdir(resolve(root, "public/media"), { recursive: true });
        await writeFile(resolve(root, "public/media", filename), bytes, { flag: "wx" });
        return reply(201, { src: "media/" + filename, alt: "" });
      }
      reply(pathname === "/__editor/content" || pathname === "/__editor/media" ? 405 : 404, { error: "Route indisponible." });
    } catch (error) {
      reply(error instanceof RequestError ? error.status : error instanceof SyntaxError ? 400 : 500,
        { error: error instanceof RequestError ? error.message : "Impossible de lire ou d’enregistrer le contenu." });
    }
  };
}

export function localEditor(): Plugin {
  return {
    name: "local-content-editor", apply: "serve",
    configureServer(server) { server.middlewares.use(editorMiddleware(server.config.root)); },
  };
}
