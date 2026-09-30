import { expect, test } from "@playwright/test";
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";

let preview: ChildProcess;
const url = "http://127.0.0.1:5181";
test.beforeAll(async () => {
  await new Promise<void>((done, reject) => {
    const build = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "build"], { windowsHide: true, stdio: "pipe" });
    let output = "";
    build.stdout!.on("data", chunk => { output += chunk; }); build.stderr!.on("data", chunk => { output += chunk; });
    build.once("error", reject); build.once("exit", code => code === 0 ? done() : reject(new Error(output)));
  });
  preview = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "5181", "--strictPort"], {
    windowsHide: true, stdio: "pipe",
  });
  await new Promise<void>((done, reject) => {
    const timeout = setTimeout(() => reject(new Error("Production preview did not start")), 10000);
    preview.once("error", error => { clearTimeout(timeout); reject(error); });
    preview.once("exit", code => { clearTimeout(timeout); reject(new Error("Preview exited: " + code)); });
    preview.stdout!.on("data", chunk => { if (String(chunk).includes("5181")) { clearTimeout(timeout); done(); } });
  });
});
test.afterAll(async () => {
  if (!preview || preview.exitCode !== null) return;
  await new Promise<void>(done => { preview.once("exit", () => done()); preview.kill(); });
});

test("production has no editor UI, editable fields, editor bundles or write API", async ({ page, request }) => {
  const original = await readFile("src/content.json", "utf8");
  const files = await readdir("dist/assets");
  expect(files.some(file => /editor|comparison/i.test(file))).toBe(false);
  const bundles = (await Promise.all(files.filter(file => /\.(js|css)$/.test(file)).map(file => readFile("dist/assets/" + file, "utf8")))).join("\n");
  for (const forbidden of ["/__editor/", "data-edit-text", "data-edit-media", "data-edit-group", "editor-toolbar", "inline-editing", "Éditer le contenu"])
    expect(bundles).not.toContain(forbidden);
  for (const query of ["?edit", "?editor-preview"]) {
    await page.goto(url + "/" + query);
    await expect(page.locator(".screen")).toHaveCount(5);
    await expect(page.locator(".content-editor,.node-edit,[contenteditable],iframe")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Éditer le contenu" })).toHaveCount(0);
    await page.locator('#projects [data-node="recent"] h3').click();
    await expect(page.locator("[contenteditable]")).toHaveCount(0);
  }
  const write = await request.put(url + "/__editor/content", { data: { content: {} } });
  expect(write.ok()).toBe(false);
  const read = await request.get(url + "/__editor/content");
  expect(read.headers()["content-type"]).not.toContain("application/json");
  expect(await readFile("src/content.json", "utf8")).toBe(original);
});
