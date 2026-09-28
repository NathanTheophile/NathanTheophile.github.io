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
    await expect(page.locator(".screen")).toHaveCount(2);
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
    expect(geometry.sectionHeights).toEqual([height, height]);
    expect(geometry.total).toBe(height * 2);
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
      // Verify mathematical endpoints land on the ring at each breakpoint.
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
      expect(connections).toHaveLength(screen ? 11 : 5);
      connections.forEach((error) => expect(error).toBeLessThan(0.1));
      if (screen === 1) {
        const crossings = await section.evaluate((el) => {
          const textRects = [
            ...el.querySelectorAll(".node-copy h3, .node-copy p"),
          ].flatMap((text) => {
            const range = document.createRange();
            range.selectNodeContents(text);
            return [...range.getClientRects()].filter((rect) => rect.width > 0);
          });
          return [...el.querySelectorAll<SVGPathElement>("[data-root]")]
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
            .map((path) => path.dataset.root);
        });
        expect(crossings, "Major roots must not cross readable labels").toEqual(
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

test("project details, contact and keyboard focus work", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "EXPLORE PROJECTS", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "Recent Project",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Explore Recent Project", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "Recent Project",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explore Recent Project", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "CONTACT", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("link")).toHaveAttribute(
    "href",
    "mailto:hello@example.com",
  );
  await page.getByRole("button", { name: "Close details" }).click();
  await page.keyboard.press("End");
  await landed(page, 1);
  await page
    .getByRole("button", { name: "EXPLORE TOOLS", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "Unity",
  );
  await page.keyboard.press("Escape");
  await page.keyboard.press("PageUp");
  await landed(page, 0);
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
  await page.getByRole("button", { name: "↑ BACK TO PROJECTS" }).click();
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
  await context.close();
});
