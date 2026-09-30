import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

test("desktop branches reach their target rings continuously and stop outside them", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 870 });
  await page.goto("/");
  await expect(page.locator("[data-reference-network]")).toHaveCount(2);
  // Test the painted vector branches, not the old connector endpoints. At 4×
  // resolution even a small gap or a branch extending inside a ring is visible.
  for (const section of ["projects", "tools"]) {
    const junctions = await page.locator(`#${section}`).evaluate(async (element) => {
      const ns = "http://www.w3.org/2000/svg", scale = 4;
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("xmlns", ns); svg.setAttribute("viewBox", "0 0 1000 870");
      svg.setAttribute("width", "4000"); svg.setAttribute("height", "3480");
      svg.style.color = "white";
      const art = element.querySelector("[data-reference-network]")!;
      svg.append(art.cloneNode(true));
      svg.querySelectorAll("[data-construction-guide]").forEach((guide) => guide.remove());
      const image = new Image();
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
      const canvas = document.createElement("canvas"); canvas.width = 4000; canvas.height = 3480;
      const context = canvas.getContext("2d")!;
      try { image.src = url; await image.decode(); context.drawImage(image, 0, 0); }
      finally { URL.revokeObjectURL(url); }
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      return [...element.querySelectorAll<SVGGElement>(".node")].map((node) => {
        const ring = node.querySelector<SVGCircleElement>("[data-connection-ring]")!;
        const cx = ring.cx.baseVal.value, cy = ring.cy.baseVal.value, radius = ring.r.baseVal.value;
        const left = Math.floor((cx-radius-14)*scale), top = Math.floor((cy-radius-14)*scale);
        const width = Math.ceil((radius+14)*2*scale);
        const painted = new Set<number>(), boundary: number[] = [];
        let insidePixels = 0;
        for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
          const distance = Math.hypot((left+x+.5)/scale-cx, (top+y+.5)/scale-cy);
          const alpha = pixels[((top+y)*canvas.width+left+x)*4+3]!;
          if (alpha <= 8) continue;
          if (distance < radius-.5) insidePixels++;
          if (distance >= radius-.25 && distance <= radius+12) {
            const index = y*width+x; painted.add(index);
            if (distance <= radius+.4) boundary.push(index);
          }
        }
        // A contact must be connected to the branch 10 px away, rather than
        // an isolated dot at the circle. Flood the actual antialiased pixels.
        const queue = [...boundary], visited = new Set(boundary);
        let reachesBranch = false;
        for (let i = 0; i < queue.length; i++) {
          const index = queue[i]!, x = index%width, y = Math.floor(index/width);
          if (Math.hypot((left+x+.5)/scale-cx, (top+y+.5)/scale-cy) > radius+10) reachesBranch = true;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const next = (y+dy)*width+x+dx;
            if (painted.has(next) && !visited.has(next)) { visited.add(next); queue.push(next); }
          }
        }
        const inner = node.querySelector<SVGCircleElement>(".node-rings > circle")!;
        const outer = node.querySelector<SVGCircleElement>("[data-outer-ring]")!;
        return { id: node.dataset.node, contacts: boundary.length, insidePixels, reachesBranch,
          radius, inner: inner.r.baseVal.value, outer: outer.r.baseVal.value,
          ringPaths: node.querySelectorAll(".node-rings > path").length,
          ringCircles: node.querySelectorAll(".node-rings > circle").length };
      });
    });
    for (const junction of junctions) {
      expect(junction.contacts, `${junction.id}: no gap before the target ring`).toBeGreaterThan(0);
      expect(junction.reachesBranch, `${junction.id}: contact continues into the branch`).toBe(true);
      expect(junction.insidePixels, `${junction.id}: branch stops at the target ring`).toBe(0);
      expect(junction.radius).toBe(section === "projects" ? junction.inner : junction.outer);
      expect(junction.ringPaths, `${junction.id}: no descending decoration`).toBe(1);
      expect(junction.ringCircles, `${junction.id}: no dot decorations`).toBe(2);
    }
    await expect(page.locator(`#${section} [data-outline-layer], #${section} [data-reference-network] image, #${section} [data-reference-network] filter`)).toHaveCount(0);
    expect(await page.locator(`#${section} [data-network-branch]`).count()).toBeGreaterThan(0);
  }
});

test.describe("reference comparison", () => {
  test.skip(!existsSync(".visual-check/reference.png"), "Copy the supplied concept to .visual-check/reference.png, or upload it in the comparison tool.");

  test("both networks match the reference linework in the canonical frame", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1150 });
    await page.goto("/?compare");
    for (const section of ["projects", "tools"]) {
      await page.getByLabel("Écran", { exact: true }).selectOption(section);
      await page.waitForFunction((section) => {
        const evidence = (window as any).__comparison;
        return evidence?.section === section && evidence.metrics.renderPixels > 0;
      }, section);
      const evidence = await page.evaluate(() => (window as any).__comparison);
      expect(evidence.frame).toEqual({ width: 1000, height: 870 });
      // A geometric gate complements, rather than replaces, inspection of the overlays.
      expect(evidence.metrics.referenceCoverage).toBeGreaterThan(.90);
      expect(evidence.metrics.renderCoverage).toBeGreaterThan(.95);
      expect(evidence.metrics.medianError).toBeLessThanOrEqual(1.5);
      expect(evidence.metrics.p90Error).toBeLessThanOrEqual(4);
      expect(evidence.metrics.textOverlapPixels).toBe(0);
      await expect(page.getByTestId("comparison-metrics")).toContainText("Cyan");
    }
  });

  test("overlay, zoom, landmark measurements and vector exports work", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1150 });
    await page.goto("/?compare");
    await page.waitForFunction(() => (window as any).__comparison?.metrics.renderPixels > 0);
    await page.getByRole("slider", { name: "Opacité" }).press("Home");
    await expect(page.locator(".reference-layer")).toHaveCSS("opacity", "0");
    await page.getByRole("slider", { name: "Opacité" }).press("End");
    await expect(page.locator(".reference-layer")).toHaveCSS("opacity", "1");
    await page.getByLabel("Vue", { exact: true }).selectOption("split");
    await expect(page.locator(".reference-layer")).toHaveCSS("clip-path", "inset(0px 0px 0px 100%)");
    await page.getByLabel("Vue", { exact: true }).selectOption("contours");
    await expect(page.locator(".contour-layer")).toBeVisible();
    await page.getByLabel("Zoom", { exact: true }).selectOption("0.5");
    await page.getByLabel("Relever des repères", { exact: true }).check();
    await page.getByLabel("Nom du repère", { exact: true }).fill("Point de contrôle vérifié");
    await page.locator(".landmark-layer").click({ position: { x: 250, y: 150 } });
    await expect(page.locator(".landmark-layer")).toContainText("Point de contrôle vérifié");
    await page.waitForFunction(() => (window as any).__comparison?.points.at(-1)?.name === "Point de contrôle vérifié");
    const measured = await page.evaluate(() => (window as any).__comparison.points.at(-1));
    // Mouse events round screen pixels: at 50% zoom one screen pixel is two source pixels.
    expect(Math.abs(measured.x - 500)).toBeLessThanOrEqual(2);
    expect(Math.abs(measured.y - 300)).toBeLessThanOrEqual(2);
    const reportDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exporter le relevé", exact: true }).click();
    const reportPath = await (await reportDownload).path();
    const report = JSON.parse(await readFile(reportPath!, "utf8"));
    expect(report.reference.split).toBe(820);
    expect(report.points.at(-1)).toEqual(measured);
    const svgDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exporter les tracés SVG", exact: true }).click();
    const svg = await readFile((await (await svgDownload).path())!, "utf8");
    expect(svg).toContain("data-network-branch");
    expect(svg).toContain("#222a33");
    expect(svg).not.toMatch(/<image|image\.png|base64/);
  });
});

test("the normal portfolio uses vector assets without loading the reference or editor", async ({ page }) => {
  const referenceRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/__reference/") || request.url().includes("/src/dev/")) referenceRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("[data-reference-network]")).toHaveCount(2);
  await expect(page.locator(".comparison-tool")).toHaveCount(0);
  await expect(page.locator("[data-outline-layer]")).toHaveCount(0);
  expect(await page.locator("[data-network-branch]").count()).toBeGreaterThan(0);
  expect(referenceRequests).toEqual([]);
});
