import { projects, skills } from "../data";

export const FRAME = { width: 1000, height: 870 };
export type Section = "projects" | "tools";
export type Landmark = { name: string; x: number; y: number; section: Section };
export type Metrics = {
  referencePixels: number;
  renderPixels: number;
  referenceCoverage: number;
  renderCoverage: number;
  medianError: number;
  p90Error: number;
  textOverlapPixels: number;
};

export function canvas() {
  const element = document.createElement("canvas");
  element.width = FRAME.width;
  element.height = FRAME.height;
  return element;
}

export async function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

function distances(mask: Uint8Array) {
  const { width: w, height: h } = FRAME;
  const d = Float32Array.from(mask, (pixel) => pixel ? 0 : 1e6);
  const diagonal = Math.SQRT2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (x) d[i] = Math.min(d[i]!, d[i - 1]! + 1);
    if (y) d[i] = Math.min(d[i]!, d[i - w]! + 1);
    if (x && y) d[i] = Math.min(d[i]!, d[i - w - 1]! + diagonal);
    if (y && x < w - 1) d[i] = Math.min(d[i]!, d[i - w + 1]! + diagonal);
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x;
    if (x < w - 1) d[i] = Math.min(d[i]!, d[i + 1]! + 1);
    if (y < h - 1) d[i] = Math.min(d[i]!, d[i + w]! + 1);
    if (x < w - 1 && y < h - 1) d[i] = Math.min(d[i]!, d[i + w + 1]! + diagonal);
    if (x && y < h - 1) d[i] = Math.min(d[i]!, d[i + w - 1]! + diagonal);
  }
  return d;
}

export async function analyze(
  document: Document,
  reference: HTMLImageElement,
  section: Section,
  split: number,
  contrast: number,
  guides: boolean,
) {
  const { width: w, height: h } = FRAME;
  const source = canvas(), sourceContext = source.getContext("2d")!;
  // Uniform scaling from the original width; the lower section's extra footer is cropped.
  sourceContext.drawImage(reference, 0, section === "tools" ? split : 0,
    reference.naturalWidth, h * reference.naturalWidth / w, 0, 0, w, h);
  const sectionElement = document.querySelector(`#${section}`)!;
  const composition = sectionElement.querySelector<SVGSVGElement>(".composition")!;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 1000 870");
  svg.setAttribute("width", "1000"); svg.setAttribute("height", "870");
  svg.style.color = "white";
  svg.append(composition.querySelector(section === "tools" ? ".root-art" : ".tree-art")!.cloneNode(true));
  // Guides use the page's clip-path, so preserve its definition for the comparison too.
  const defs = composition.querySelector(":scope > defs");
  if (defs) svg.prepend(defs.cloneNode(true));
  if (!guides) svg.querySelectorAll(".construction,[data-construction-guide]").forEach((element) => element.remove());
  const markup = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  const render = canvas(), renderContext = render.getContext("2d")!;
  try { renderContext.drawImage(await loadImage(url), 0, 0); }
  finally { URL.revokeObjectURL(url); }

  const allowed = new Uint8Array(w * h).fill(1);
  const exclude = (left: number, top: number, right: number, bottom: number) => {
    for (let y = Math.max(0, Math.floor(top)); y < Math.min(h, bottom); y++)
      for (let x = Math.max(0, Math.floor(left)); x < Math.min(w, right); x++) allowed[y * w + x] = 0;
  };
  if (section === "projects") { exclude(0, 0, w, 90); exclude(0, 740, w, h); }
  else exclude(820, 835, w, h);
  // The concept's original editorial copy has intentionally been removed from
  // the page. It must still be excluded from this linework-only comparison.
  if (section === "projects") exclude(20, 160, 320, 435);
  else exclude(20, 104, 350, 382);
  // Removed discipline labels still exist in the source concept.
  if (section === "projects") exclude(835, 700, w, h);
  else exclude(835, 60, w, 200);
  const inverse = composition.getScreenCTM()!.inverse();
  const textBounds: { left: number; top: number; right: number; bottom: number }[] = [];
  const selectors = ".node-copy h3,.node-copy p,.node-copy button,.editorial h1,.editorial h2,.editorial p,.outline-cta,.section-label,.disciplines,.section-index";
  sectionElement.querySelectorAll(selectors).forEach((element) => {
    // Linework is measured in the original authoring frame. Node captions
    // share the display translation, so undo it for their source text masks.
    const network = element.closest<SVGGElement>("[data-centered-network]");
    const textInverse = network ? network.getScreenCTM()!.inverse() : inverse;
    const range = document.createRange(); range.selectNodeContents(element);
    const rects = element.matches("button,.outline-cta,.section-label,.disciplines,.section-index")
      ? [element.getBoundingClientRect()] : [...range.getClientRects()];
    rects.forEach((rect) => {
      const a = new DOMPoint(rect.left, rect.top).matrixTransform(textInverse);
      const b = new DOMPoint(rect.right, rect.bottom).matrixTransform(textInverse);
      if (element.matches(".node-copy h3,.node-copy p,.editorial h1,.editorial h2,.editorial p"))
        textBounds.push({ left: a.x, top: a.y, right: b.x, bottom: b.y });
      const padding = element.matches(".outline-cta,.editorial p,.editorial h1,.editorial h2") ? 18 : 7;
      exclude(a.x - padding, a.y - padding, b.x + padding, b.y + padding);
    });
  });
  for (const item of section === "tools" ? skills : projects) {
    const p = item.desktop, radius = p.r + 14;
    for (let y = Math.floor(p.y - radius); y <= p.y + radius; y++)
      for (let x = Math.floor(p.x - radius); x <= p.x + radius; x++)
        if (x >= 0 && x < w && y >= 0 && y < h && Math.hypot(x - p.x, y - p.y) < radius)
          allowed[y * w + x] = 0;
  }
  const pixels = sourceContext.getImageData(0, 0, w, h);
  const rendered = renderContext.getImageData(0, 0, w, h);
  let textOverlapPixels = 0;
  for (const rect of textBounds)
    for (let y = Math.max(0, Math.ceil(rect.top)); y < Math.min(h, Math.floor(rect.bottom)); y++)
      for (let x = Math.max(0, Math.ceil(rect.left)); x < Math.min(w, Math.floor(rect.right)); x++)
        if (rendered.data[(y * w + x) * 4 + 3]! > 40) textOverlapPixels++;
  const luminance = Float32Array.from(allowed, (_, i) => {
    const offset = i * 4;
    return pixels.data[offset]! * .2126 + pixels.data[offset + 1]! * .7152 + pixels.data[offset + 2]! * .0722;
  });
  const targetMask = new Uint8Array(w * h), renderMask = new Uint8Array(w * h);
  const neighbors = [-6, 6, -w * 6, w * 6, -w * 6 - 6, -w * 6 + 6, w * 6 - 6, w * 6 + 6];
  for (let i = 0; i < allowed.length; i++) {
    if (!allowed[i]) continue;
    const neighborhood = neighbors.map((offset) => luminance[Math.max(0, Math.min(luminance.length - 1, i + offset))]!).sort((a, b) => a - b);
    const background = (neighborhood[3]! + neighborhood[4]!) / 2;
    const difference = section === "tools" ? luminance[i]! - background : background - luminance[i]!;
    if (difference > contrast) targetMask[i] = 1;
    if (rendered.data[i * 4 + 3]! > (guides ? 5 : 40)) renderMask[i] = 1;
  }
  const toRender = distances(renderMask), toTarget = distances(targetMask);
  const targetErrors: number[] = [], renderErrors: number[] = [];
  const contours = canvas(), contourContext = contours.getContext("2d")!;
  const colored = contourContext.createImageData(w, h);
  for (let i = 0; i < allowed.length; i++) {
    const t = targetMask[i], r = renderMask[i];
    if (t) targetErrors.push(toRender[i]!);
    if (r) renderErrors.push(toTarget[i]!);
    if (t || r) {
      const offset = i * 4;
      colored.data[offset] = r ? 255 : 0;
      colored.data[offset + 1] = t ? 195 : 86;
      colored.data[offset + 2] = t ? 255 : 45;
      colored.data[offset + 3] = 255;
    }
  }
  contourContext.putImageData(colored, 0, 0);
  targetErrors.sort((a, b) => a - b);
  const metrics: Metrics = {
    referencePixels: targetErrors.length,
    renderPixels: renderErrors.length,
    referenceCoverage: targetErrors.length ? targetErrors.filter((error) => error <= 3).length / targetErrors.length : 0,
    renderCoverage: renderErrors.length ? renderErrors.filter((error) => error <= 3).length / renderErrors.length : 0,
    medianError: targetErrors[Math.floor(targetErrors.length * .5)] ?? 0,
    p90Error: targetErrors[Math.floor(targetErrors.length * .9)] ?? 0,
    textOverlapPixels,
  };
  return { source, contours, metrics, markup, targetMask, renderMask, allowed };
}
