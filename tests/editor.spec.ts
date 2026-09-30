import { expect, test } from "@playwright/test";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";
import { editorMiddleware } from "../scripts/local-editor";
import type { PortfolioContent } from "../src/content";

let server: Server, origin: string, fixture: string, original: string;
const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
test.beforeEach(async ({ page }) => {
  original = await readFile("src/content.json", "utf8");
  fixture = resolve(".visual-check", "editor-fixture-" + randomUUID());
  await mkdir(resolve(fixture, "src"), { recursive: true });
  await writeFile(resolve(fixture, "src/content.json"), original);
  const handler = editorMiddleware(fixture);
  server = createServer((req, res) => { void handler(req, res, () => { res.statusCode = 404; res.end(); }); });
  await new Promise<void>(done => server.listen(0, "127.0.0.1", done));
  origin = "http://127.0.0.1:" + (server.address() as { port: number }).port;
  // Exercise the real local middleware against an isolated project, leaving
  // the user's content and media untouched throughout the browser tests.
  await page.route("**/__editor/**", async route => {
    const request = route.request();
    const headers = { ...request.headers(), host: new URL(origin).host, origin };
    delete (headers as Record<string, string>)["content-length"];
    const response = await fetch(origin + new URL(request.url()).pathname, {
      method: request.method(), headers, body: request.postDataBuffer(),
    });
    await route.fulfill({ status: response.status, contentType: "application/json", body: Buffer.from(await response.arrayBuffer()) });
  });
  await page.route("**/media/upload-*", async route => {
    const filename = new URL(route.request().url()).pathname.split("/").pop()!;
    await route.fulfill({ contentType: "image/gif", body: await readFile(resolve(fixture, "public/media", filename)) });
  });
  await page.setViewportSize({ width: 1600, height: 1000 });
});
test.afterEach(async () => {
  await new Promise<void>((done, reject) => server.close(error => error ? reject(error) : done()));
  expect(await readFile("src/content.json", "utf8")).toBe(original);
  const expectedRoot = resolve(".visual-check") + sep;
  if (!fixture.startsWith(expectedRoot)) throw new Error("Unexpected fixture directory");
  await rm(fixture, { recursive: true, force: true });
});

test("inline editing, cancellation, shared catalogs and persistent save", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/?edit");
  const preview = page.frameLocator('iframe[title="Aperçu éditable du portfolio"]');
  const title = preview.locator('#projects [data-edit-text="projects.recent.title"]');
  await title.click();
  await expect(title).toHaveAttribute("contenteditable", "plaintext-only");
  await title.fill("Titre annulé"); await title.press("Escape");
  await expect(title).toHaveText("Recent Project");
  await title.click(); await title.fill("Mon projet"); await title.press("Enter");
  await expect(title).toHaveText("Mon projet");
  await expect(page.getByRole("status")).toContainText("non enregistrées");
  // Saving also commits an inline field that has not been validated yet.
  const description = preview.locator('#projects [data-edit-text="projects.recent.description"]');
  await description.click(); await description.fill("Une première ligne\nUne deuxième ligne");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Enregistré dans le projet.");
  const saved = JSON.parse(await readFile(resolve(fixture, "src/content.json"), "utf8"));
  expect(saved.projects.recent).toMatchObject({ title: "Mon projet", description: "Une première ligne\nUne deuxième ligne" });
  await page.getByRole("combobox", { name: "Page de l’aperçu" }).selectOption("2");
  await expect(preview.locator("#projects-grid .catalog-card").first()).toContainText("Mon projet");
  await page.getByRole("button", { name: "Mode édition" }).click();
  await preview.locator("#projects-grid .catalog-card").first().click();
  await expect(preview.getByRole("dialog").getByRole("heading")).toHaveText("Mon projet");
  await page.reload();
  await expect(preview.locator('#projects [data-edit-text="projects.recent.title"]')).toHaveText("Mon projet");
  expect(errors).toEqual([]);
});

test("project and skill edit controls, GIF uploads, logo and contact fields", async ({ page }) => {
  await page.goto("/?edit");
  const preview = page.frameLocator('iframe[title="Aperçu éditable du portfolio"]');
  await preview.locator('#projects [data-node="recent"]').getByRole("button", { name: "Modifier", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Élément à modifier" })).toHaveValue("projects.recent");
  await page.locator('[id="projects.recent.thumbnailMedia"]').setInputFiles({ name: "Vignette.gif", mimeType: "image/gif", buffer: gif });
  const circle = preview.locator('#projects [data-node="recent"] .node-image img');
  await expect(circle).toHaveAttribute("src", /^\/media\/upload-/);
  await expect.poll(() => circle.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1);
  await page.locator('[id="projects.recent.previewMedia"]').setInputFiles({ name: "Animation.gif", mimeType: "image/gif", buffer: gif });
  await page.getByRole("button", { name: "Mode édition" }).click();
  await preview.getByRole("button", { name: "Explore Recent Project", exact: true }).hover();
  const image = preview.getByRole("tooltip").locator("img");
  await expect(image).toHaveAttribute("alt", "Animation");
  await expect.poll(() => image.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1);
  await page.getByRole("button", { name: "Mode aperçu" }).click();
  await page.getByRole("combobox", { name: "Page de l’aperçu" }).selectOption("1");
  await preview.locator('#tools [data-node="unity"]').getByRole("button", { name: "Modifier", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Élément à modifier" })).toHaveValue("skills.unity");
  await page.getByLabel("Titre", { exact: true }).fill("Mon outil");
  await expect(preview.locator('#tools [data-node="unity"] h3')).toHaveText("Mon outil");
  await page.getByRole("combobox", { name: "Élément à modifier" }).selectOption("identity");
  await page.getByLabel("Nom", { exact: true }).fill("Nathan");
  await page.getByLabel("Adresse e-mail").fill("nathan@example.com");
  await page.locator('[id="identity.logoMedia"]').setInputFiles({ name: "Logo.gif", mimeType: "image/gif", buffer: gif });
  await expect(preview.locator(".brand-mark img")).toHaveAttribute("alt", "Logo");
  await page.getByRole("combobox", { name: "Élément à modifier" }).selectOption("contact");
  await page.getByLabel("Accroche").fill("Parlons de votre projet.");
  await expect(preview.locator(".contact-intro h3")).toHaveText("Parlons de votre projet.");
  await expect(preview.locator(".contact-email")).toHaveAttribute("href", "mailto:nathan@example.com");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Enregistré dans le projet.");
  const content = JSON.parse(await readFile(resolve(fixture, "src/content.json"), "utf8"));
  expect(content.skills.unity.title).toBe("Mon outil");
  expect(content.projects.recent.thumbnailMedia.src).not.toBe(content.projects.recent.previewMedia.src);
  await page.screenshot({ path: ".visual-check/editor-contact.png" });
});

test("external edits produce a conflict and keep the unsaved draft", async ({ page }) => {
  await page.goto("/?edit");
  await page.getByLabel("Nom", { exact: true }).fill("Mon brouillon");
  const external = JSON.parse(original) as PortfolioContent;
  external.identity.name = "Modification externe";
  await writeFile(resolve(fixture, "src/content.json"), JSON.stringify(external, null, 2));
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Le fichier a changé");
  await expect(page.getByLabel("Nom", { exact: true })).toHaveValue("Mon brouillon");
  expect(JSON.parse(await readFile(resolve(fixture, "src/content.json"), "utf8")).identity.name).toBe("Modification externe");
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  await expect(page.getByLabel("Nom", { exact: true })).toHaveValue("Modification externe");
});

test("local API rejects remote hosts, origins, invalid content and unsafe media", async ({ request }) => {
  const response = await request.get(origin + "/__editor/content");
  expect(response.status()).toBe(200);
  const { token, version, content } = await response.json();
  const put = (body: unknown, extra = {}) => request.put(origin + "/__editor/content", {
    headers: { "X-Portfolio-Editor": token, ...extra }, data: body,
  });
  expect((await request.get(origin + "/__editor/content", { headers: { Host: "example.com" } })).status()).toBe(403);
  expect((await request.get(origin + "/__editor/content", { headers: { Origin: "https://example.com" } })).status()).toBe(403);
  expect((await put({ content, version }, { "X-Portfolio-Editor": "wrong" })).status()).toBe(403);
  expect((await put({ content, version: "stale" })).status()).toBe(409);
  const invalid = structuredClone(content); invalid.projects.recent.desktop = { x: 1 };
  expect((await put({ content: invalid, version })).status()).toBe(400);
  for (const src of ["javascript:alert(1)", "../../src/App.tsx", "media/../../secret.png", "data:image/svg+xml,<svg/>"]) {
    const invalid = structuredClone(content); invalid.projects.recent.thumbnailMedia = { src };
    expect((await put({ content: invalid, version })).status()).toBe(400);
  }
  expect((await request.post(origin + "/__editor/media", { headers: { "X-Portfolio-Editor": token, "Content-Type": "image/gif" }, data: "not a GIF" })).status()).toBe(400);
  expect((await request.post(origin + "/__editor/media", { headers: { "X-Portfolio-Editor": token, "Content-Type": "image/svg+xml" }, data: "<svg/>" })).status()).toBe(400);
  expect((await request.post(origin + "/__editor/media", { headers: { "X-Portfolio-Editor": token, "Content-Type": "image/png" }, data: Buffer.alloc(12 * 1024 * 1024 + 1) })).status()).toBe(413);
});

test("ordinary local portfolio does not have inline edit controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Éditer le contenu" })).toBeVisible();
  await expect(page.locator("[contenteditable],.node-edit")).toHaveCount(0);
  await page.locator('#projects [data-node="recent"] h3').click();
  await expect(page.locator("[contenteditable]")).toHaveCount(0);
});
