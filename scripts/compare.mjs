import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const label = process.argv[2] ?? "latest";
if (!/^[a-z0-9-]+$/.test(label)) throw new Error("Use a simple comparison name, e.g. before or after.");
const output = resolve(".visual-check", `comparison-${label}`);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1150 } });
  const renderPage = await browser.newPage({ viewport: { width: 1000, height: 870 } });
  await renderPage.goto("http://127.0.0.1:5173/");
  await renderPage.waitForFunction(() => document.querySelectorAll("[data-reference-network]").length === 2);
  const reports = [];
  for (const section of ["projects", "tools"]) {
    await page.goto(`http://127.0.0.1:5173/?compare&section=${section}`);
    await page.getByLabel("Zoom", { exact: true }).selectOption("1");
    await page.waitForFunction((section) => window.__comparison?.section === section && window.__comparison.metrics.referencePixels > 0, section);
    const report = await page.evaluate(() => window.__comparison);
    reports.push(report);
    await renderPage.evaluate((section) => document.querySelector("main").scrollTo({ top: section === "tools" ? 870 : 0, behavior: "instant" }), section);
    await renderPage.waitForTimeout(100);
    await renderPage.locator(`#${section} .composition`).screenshot({ path: `${output}/${section}-render.png` });
    await page.locator("[data-testid=comparison-frame]").screenshot({ path: `${output}/${section}-overlay.png` });
    await page.getByLabel("Vue", { exact: true }).selectOption("contours");
    await page.locator("[data-testid=comparison-frame]").screenshot({ path: `${output}/${section}-contours.png` });
    const masks = await page.evaluate(() => {
      const result = {};
      for (const key of ["reference", "render", "allowed"]) {
        const c = document.createElement("canvas"); c.width = 1000; c.height = 870;
        const context = c.getContext("2d"), data = context.createImageData(1000, 870);
        window.__comparisonMasks[key].forEach((pixel, i) => {
          data.data[i * 4] = data.data[i * 4 + 1] = data.data[i * 4 + 2] = pixel ? 255 : 0;
          data.data[i * 4 + 3] = 255;
        });
        context.putImageData(data, 0, 0);
        result[key] = c.toDataURL("image/png").split(",")[1];
      }
      result.source = document.querySelector(".reference-layer").toDataURL("image/png").split(",")[1];
      return result;
    });
    for (const [key, bytes] of Object.entries(masks)) await writeFile(`${output}/${section}-${key === "render" || key === "reference" ? `${key}-mask` : key}.png`, Buffer.from(bytes, "base64"));
  }
  await writeFile(`${output}/report.json`, JSON.stringify({ capturedAt: new Date().toISOString(), reports }, null, 2));
  console.log(JSON.stringify({ output, reports: reports.map(({ section, metrics }) => ({ section, ...metrics })) }, null, 2));
} finally { await browser.close(); }
