import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const sizes = [
  [2560, 1080],
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1024, 768],
  [390, 844],
  [3440, 1440],
  [390, 667],
  [360, 640],
] as const;

async function landed(page: Page, screen: number) {
  await expect
    .poll(() => page.locator("main").evaluate((el) => Math.round(el.scrollTop)))
    .toBe(screen * (page.viewportSize()?.height ?? 0));
  // A second sample verifies the settled position rather than a transient crossing.
  await page.waitForTimeout(800);
  expect(await page.locator("main").evaluate((el) => el.scrollTop)).toBe(
    screen * (page.viewportSize()?.height ?? 0),
  );
}

for (const [width, height] of sizes) {
  test(`complete composition and navigation at ${width} × ${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/");
    await expect(page.locator(".screen")).toHaveCount(4);
    await expect(page.locator("#projects .node")).toHaveCount(5);
    await expect(page.locator("#tools .node")).toHaveCount(11);
    await landed(page, 0);
    const geometry = await page.evaluate(() => ({
      bodyOverflow: document.documentElement.scrollWidth > innerWidth,
      scrollerOverflow:
        document.querySelector("main")!.scrollWidth > innerWidth,
      sectionHeights: [...document.querySelectorAll(".screen")].map(
        (el) => el.getBoundingClientRect().height,
      ),
      total: document.querySelector("main")!.scrollHeight,
      stages: [...document.querySelectorAll(".art-stage")].map(
        (el) => el.getBoundingClientRect().width,
      ),
    }));
    expect(geometry.bodyOverflow).toBe(false);
    expect(geometry.scrollerOverflow).toBe(false);
    expect(geometry.sectionHeights).toEqual([height, height, height, height]);
    expect(geometry.total).toBe(height * 4);
    await expect(page.locator("#projects-grid .catalog-card")).toHaveCount(5);
    await expect(page.locator("#tools-grid .catalog-card")).toHaveCount(11);
    const clippedCards = await page.locator(".catalog-card").evaluateAll((cards) =>
      cards.filter((card) => card.scrollWidth > card.clientWidth + 1 ||
        [...card.querySelectorAll(".catalog-copy strong,.catalog-copy > span")].some((text) => {
          const bounds = text.getBoundingClientRect(), parent = card.getBoundingClientRect();
          return bounds.right > parent.right || bounds.left < parent.left;
        })).map((card) => card.textContent));
    expect(clippedCards).toEqual([]);
    expect(geometry.stages[0]).toBeCloseTo(geometry.stages[1]!, 2);
    if (width > height * 1.15) expect(geometry.stages[0]).toBeLessThan(width);

    await mkdir(".visual-check", { recursive: true });
    for (const screen of [0, 1]) {
      if (screen === 1) {
        await page
          .getByRole("button", { name: "Scroll to tools and skills" })
          .click();
        await landed(page, 1);
      }
      const section = page.locator(screen ? "#tools" : "#projects");
      // Test painted content, not only the containers (SVG foreignObjects can clip text).
      const bounds = await section
        .locator(
          ".node-copy h3, .node-copy p, .node-image, .editorial h1, .editorial h2, .editorial p, .outline-cta",
        )
        .evaluateAll((elements) =>
          elements.map((el) => {
            const r = el.getBoundingClientRect();
            return {
              text: el.textContent?.trim(),
              left: r.left,
              right: r.right,
              top: r.top,
              bottom: r.bottom,
            };
          }),
        );
      for (const r of bounds) {
        expect(r.left, r.text).toBeGreaterThanOrEqual(-1);
        expect(r.right, r.text).toBeLessThanOrEqual(width + 1);
        expect(r.top, r.text).toBeGreaterThanOrEqual(-1);
        expect(r.bottom, r.text).toBeLessThanOrEqual(height + 1);
      }
      const clipped = await section
        .locator(
          ".node-copy h3, .node-copy p, .editorial h1, .editorial h2, .editorial p, .outline-cta",
        )
        .evaluateAll((elements) =>
          elements
            .filter((el) => {
              const r = el.getBoundingClientRect(),
                container = el
                  .closest("foreignObject")!
                  .getBoundingClientRect();
              return (
                r.bottom > container.bottom + 1 || r.right > container.right + 1
              );
            })
            .map((el) => el.textContent),
        );
      expect(clipped).toEqual([]);
      // Mobile uses centerline strokes. Desktop filled contours are checked
      // separately at the painted target-ring boundary.
      const connections = await section.evaluate((el) =>
        [
          ...el.querySelectorAll<SVGPathElement>("[data-branch], [data-root]"),
        ].map((path) => {
          const id = path.dataset.branch ?? path.dataset.root;
          const ring = el.querySelector<SVGCircleElement>(
            `[data-node="${id}"] circle`,
          )!;
          const endpoint = path.getPointAtLength(path.getTotalLength());
          return Math.abs(
            Math.hypot(
              endpoint.x - ring.cx.baseVal.value,
              endpoint.y - ring.cy.baseVal.value,
            ) - ring.r.baseVal.value,
          );
        }),
      );
      expect(connections).toHaveLength(width <= 700 ? (screen ? 11 : 5) : 0);
      connections.forEach((error) => expect(error).toBeLessThan(0.1));
      const attachments = await section.evaluate((el) =>
        [...el.querySelectorAll<SVGPathElement>("[data-structural]")].map((path) => {
          const start = path.getPointAtLength(0);
          if (!path.dataset.parent) {
            return {
              id: path.id,
              error: path.id === "tree-trunk"
                ? Math.abs(start.y - path.ownerSVGElement!.viewBox.baseVal.height)
                : Math.abs(start.y),
            };
          }
          const parent = el.querySelector<SVGPathElement>(`#${path.dataset.parent}`)!;
          if (parent.hasAttribute("data-outline-layer") && parent.isPointInFill(start)) {
            return { id: path.id, error: 0 };
          }
          const length = parent.getTotalLength();
          let error = Infinity;
          // Sample the rendered parent, including its actual SVG curve geometry.
          for (let distance = 0; distance <= length; distance += 0.25) {
            const point = parent.getPointAtLength(distance);
            error = Math.min(error, Math.hypot(start.x - point.x, start.y - point.y));
          }
          const end = parent.getPointAtLength(length);
          error = Math.min(error, Math.hypot(start.x - end.x, start.y - end.y));
          return { id: path.id, error };
        }),
      );
      for (const attachment of attachments) {
        expect(attachment.error, `${attachment.id} must join its parent`).toBeLessThan(0.2);
      }
      {
        const crossings = await section.evaluate((el) => {
          const textRects = [
            ...el.querySelectorAll(".node-copy h3, .node-copy p"),
          ].flatMap((text) => {
            const range = document.createRange();
            range.selectNodeContents(text);
            return [...range.getClientRects()].filter((rect) => rect.width > 0);
          });
          return [...el.querySelectorAll<SVGPathElement>("[data-structural]")]
            .filter((path) => {
              const length = path.getTotalLength(),
                matrix = path.getScreenCTM()!;
              for (let i = 0; i <= 300; i++) {
                const point = path
                  .getPointAtLength((length * i) / 300)
                  .matrixTransform(matrix);
                if (
                  textRects.some(
                    (rect) =>
                      point.x > rect.left &&
                      point.x < rect.right &&
                      point.y > rect.top &&
                      point.y < rect.bottom,
                  )
                )
                  return true;
              }
              return false;
            })
            .map((path) => path.id);
        });
        expect(crossings, "Branches must not cross readable labels").toEqual(
          [],
        );
      }
      await page.screenshot({
        path: `.visual-check/${screen ? "skills" : "projects"}-${width}x${height}.png`,
      });
    }
    await page.mouse.wheel(0, -60);
    await landed(page, 0);
    await page.mouse.wheel(0, 25);
    await landed(page, 1);
    await page.keyboard.press("Home");
    await landed(page, 0);
    expect(errors).toEqual([]);
  });
}

test("hover previews, contact and keyboard focus work", async ({ page }) => {
  await page.goto("/");
  const recent = page.getByRole("button", { name: "Explore Recent Project", exact: true });
  await recent.hover();
  await expect(page.getByRole("tooltip").getByRole("heading")).toHaveText("Recent Project");
  await recent.click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.mouse.move(0, 0);
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Details about Recent Project", exact: true })).toBeFocused();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.getByRole("button", { name: "CONTACT", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("link")).toHaveAttribute(
    "href",
    "mailto:hello@example.com",
  );
  await page.getByRole("button", { name: "Close details" }).click();
  await page.keyboard.press("PageDown");
  await landed(page, 1);
  await page
    .getByRole("button", { name: "MORE TOOLS", exact: true })
    .click();
  await landed(page, 3);
  await page.locator("#tools-grid").getByRole("button", { name: /Unity/ }).click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "Unity",
  );
  await page.keyboard.press("Escape");
  await page.keyboard.press("Home");
  await landed(page, 0);
});

test("all project and skill previews open on hover and close on leave", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".node")).toHaveCount(16);
  for (const section of ["projects", "tools"]) {
    await page.evaluate((section) => document.querySelector("main")!.scrollTo({
      top: section === "tools" ? innerHeight : 0, behavior: "instant",
    }), section);
    for (const node of await page.locator(`#${section} .node`).all()) {
      const title = await node.locator("h3").textContent();
      for (const button of await node.locator("button").all()) {
        await button.hover();
        const card = page.getByRole("tooltip");
        await expect(card.getByRole("heading")).toHaveText(title!);
        const bounds = await card.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(16);
        expect(bounds!.y).toBeGreaterThanOrEqual(16);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(1440-16);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900-16);
        const media = await card.locator(".preview-media").boundingBox();
        const copy = await card.locator(".preview-copy").boundingBox();
        expect(Math.abs(media!.width-media!.height)).toBeLessThan(.1);
        expect(Math.abs(media!.height-copy!.height)).toBeLessThan(.1);
        expect(Math.abs(media!.x+media!.width-copy!.x)).toBeLessThan(.1);
        await button.click();
        await expect(page.getByRole("dialog")).not.toBeVisible();
        await page.mouse.move(0, 0);
        await expect(card).toHaveCount(0);
      }
    }
  }
});

test("trunk contours meet at the page boundary on desktop and mobile", async ({ page }) => {
  for (const [width, height] of [[1000, 870], [390, 844]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".screen")).toHaveCount(4);
    if (width > 700) await expect(page.locator("[data-reference-network]")).toHaveCount(2);
    else await expect(page.locator("#tree-trunk")).toHaveCount(1);
    if (width > 700) {
      const strips = await page.evaluate(async () => {
        const output: number[][] = [];
        for (const section of ["projects", "tools"]) {
          const original = document.querySelector(`#${section} .composition`)!;
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          svg.setAttribute("viewBox", `482 ${section === "projects" ? 869 : 0} 53 1`);
          svg.setAttribute("width", "212"); svg.setAttribute("height", "4");
          svg.style.color = "white";
          svg.append(original.querySelector("[data-reference-network]")!.cloneNode(true));
          svg.querySelectorAll("[data-construction-guide]").forEach((guide) => guide.remove());
          const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
          const image = new Image(); image.src = url;
          const canvas = document.createElement("canvas"); canvas.width = 212; canvas.height = 4;
          const context = canvas.getContext("2d")!;
          try { await image.decode(); context.drawImage(image, 0, 0); } finally { URL.revokeObjectURL(url); }
          const pixels = context.getImageData(0, 0, 212, 4).data;
          output.push(Array.from({ length: 212 }, (_, x) => pixels[(212+x)*4+3]!));
        }
        return output;
      });
      expect(strips[0]!.filter((alpha) => alpha > 50).length).toBeGreaterThan(20);
      // Filled, textured contours meet across the seam; no uniform stroke substitute.
      for (const [from, to] of [[strips[0]!, strips[1]!], [strips[1]!, strips[0]!]]) {
        const ink = to.map((alpha, x) => alpha > 50 ? x : -1).filter((x) => x >= 0);
        from.forEach((alpha, x) => {
          if (alpha > 50) expect(Math.min(...ink.map((other) => Math.abs(x-other)))).toBeLessThanOrEqual(2);
        });
      }
      const coverage = strips.map((strip) => strip.reduce((total, alpha) => total+alpha, 0));
      expect(Math.abs(coverage[0]!-coverage[1]!) / coverage[0]!).toBeLessThan(.1);
      await expect(page.locator("[data-stem-bridge]")).toHaveCount(0);
      continue;
    }
    const seam = await page.evaluate(() => {
      const tree = [...document.querySelectorAll<SVGPathElement>('#tree-trunk, #tree-stem-left, #tree-stem-right')];
      const roots = [...document.querySelectorAll<SVGPathElement>('#tools [data-root]')];
      return tree.map((path) => {
        const point = path.getPointAtLength(path.id === "tree-trunk" ? 0 : path.getTotalLength())
          .matrixTransform(path.getScreenCTM()!);
        return Math.min(...roots.map((root) => {
          const start = root.getPointAtLength(0).matrixTransform(root.getScreenCTM()!);
          return Math.hypot(point.x-start.x, point.y-start.y);
        }));
      });
    });
    expect(seam).toHaveLength(3);
    seam.forEach((gap) => expect(gap).toBeLessThan(.1));
  }
});

test("touch shows a non-modal preview and dismisses it on an outside tap", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Explore Recent Project", exact: true }).tap();
  await expect(page.getByRole("tooltip").getByRole("heading")).toHaveText("Recent Project");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.touchscreen.tap(10, 600);
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await context.close();
});

test("compact chapter headers and the dark trunk return control work", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 870 });
  await page.goto("/");
  await expect(page.locator(".editorial")).toHaveCount(2);
  await expect(page.locator(".editorial h1,.editorial h2,.editorial p")).toHaveCount(0);
  for (const section of ["projects", "tools"]) {
    const gap = await page.locator(`#${section} .editorial`).evaluate((element) => {
      return element.querySelector("button")!.getBoundingClientRect().top - element.querySelector(".section-label")!.getBoundingClientRect().bottom;
    });
    expect(gap).toBeCloseTo(28, 1);
  }
  await page.getByRole("button", { name: "Scroll to tools and skills" }).click();
  await landed(page, 1);
  const back = page.getByRole("button", { name: "Scroll back to projects" });
  const bounds = await back.boundingBox();
  expect(bounds!.y).toBeLessThan(90);
  await expect(back.locator(".scroll-circle")).toHaveCSS("background-color", "rgb(32, 40, 45)");
  await expect(page.locator(".back-control")).toHaveCount(0);
  await back.click();
  await landed(page, 0);
});

test("catalog links, mirrored section navigation and four-page snapping work", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 870 });
  await page.goto("/");
  await expect(page.locator(".disciplines")).toHaveCount(0);
  const index = page.locator("#tools .section-index");
  await expect(index.getByRole("button", { name: /TOOLS & SKILLS/ })).toHaveAttribute("aria-current", "page");
  const position = await index.evaluate((element) => {
    const box = element.closest("foreignObject")!;
    return { x: box.getAttribute("x"), y: box.getAttribute("y") };
  });
  expect(position).toEqual({ x: "849", y: "69" });
  await page.getByRole("button", { name: "MORE PROJECTS", exact: true }).click();
  await landed(page, 2);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("#projects-grid").getByRole("heading")).toHaveText("All projects");
  await page.keyboard.press("Home");
  await landed(page, 0);
  await page.mouse.move(5, 400);
  for (const screen of [1, 2, 3]) {
    await page.mouse.wheel(0, 60);
    await landed(page, screen);
  }
  await page.keyboard.press("PageUp");
  await landed(page, 2);
  await page.keyboard.press("PageUp");
  await landed(page, 1);
  const numberPositions = await index.locator("button > span").evaluateAll((numbers) => numbers.map((number) => number.getBoundingClientRect().left));
  expect(numberPositions[0]).toBeCloseTo(numberPositions[1]!, 1);
  await index.getByRole("button", { name: /PROJECTS/ }).click();
  await landed(page, 0);
  await page.getByRole("button", { name: "Scroll to tools and skills" }).click();
  await landed(page, 1);
  await page.getByRole("button", { name: "MORE TOOLS", exact: true }).click();
  await landed(page, 3);
  await page.keyboard.press("Home");
  await landed(page, 0);
  await page.keyboard.press("End");
  await landed(page, 3);
  await page.setViewportSize({ width: 390, height: 844 });
  await landed(page, 3);
});

test("small-screen catalogs scroll through all cards before changing page", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "MORE PROJECTS", exact: true }).click();
  await landed(page, 2);
  const grid = page.getByRole("region", { name: "Project grid", exact: true });
  const box = await grid.boundingBox();
  await page.mouse.move(box!.x + 40, box!.y + 50);
  await page.mouse.wheel(0, 100);
  await expect.poll(() => grid.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await landed(page, 2);
  await grid.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect(page.locator("#projects-grid .catalog-card").last()).toBeInViewport();
  await page.mouse.wheel(0, 100);
  await landed(page, 3);
  const toolsGrid = page.getByRole("region", { name: "Skills and tools grid", exact: true });
  await toolsGrid.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect(page.locator("#tools-grid .catalog-card").last()).toBeInViewport();
  await toolsGrid.evaluate((element) => { element.scrollTop = 0; });
  const toolsBox = await toolsGrid.boundingBox();
  await page.mouse.move(toolsBox!.x + 40, toolsBox!.y + 50);
  await page.mouse.wheel(0, -100);
  await landed(page, 2);
});

test("preview media accepts a native GIF source", async ({ page }) => {
  const src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  await page.route(/\/src\/data\.ts(?:\?.*)?$/, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace('id: "recent",', `id: "recent", previewMedia: ${JSON.stringify({ src, alt: "Project GIF preview" })},`);
    expect(body).toContain('previewMedia:');
    await route.fulfill({ response, body });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Explore Recent Project", exact: true }).hover();
  const image = page.getByRole("tooltip").locator(".preview-media img");
  await expect(image).toHaveAttribute("src", src);
  await expect(image).toHaveAttribute("alt", "Project GIF preview");
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBe(1);
});

test("reduced motion and resizing retain a complete screen", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Scroll to tools and skills" })
    .click();
  await landed(page, 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await landed(page, 1);
  await page.getByRole("button", { name: "Scroll back to projects" }).click();
  await landed(page, 0);
});

test("mobile swipes change exactly one page in both directions", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  const client = await context.newCDPSession(page);
  async function swipe(from: number, to: number) {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 195, y: from }],
    });
    for (let step = 1; step <= 6; step++) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 195, y: from + ((to - from) * step) / 6 }],
      });
      await page.waitForTimeout(30);
    }
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await swipe(650, 440);
  await landed(page, 1);
  await swipe(350, 560);
  await landed(page, 0);
  await swipe(650, 440);
  await landed(page, 1);
  await swipe(650, 440);
  await landed(page, 2);
  await swipe(650, 440);
  await landed(page, 3);
  const grid = page.getByRole("region", { name: "Skills and tools grid", exact: true });
  await swipe(650, 440);
  await expect.poll(() => grid.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await landed(page, 3);
  // Stop native touch momentum before testing an upward gesture at the edge.
  await grid.evaluate((element) => { element.scrollTop = 0; });
  await swipe(350, 560);
  await landed(page, 2);
  await context.close();
});
