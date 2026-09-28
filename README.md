# Technical tree portfolio

Four snapped full-screen pages built with React, TypeScript, CSS and SVG: the project tree, the tools/skills roots, the project catalog and the tools/skills catalog. Scroll, swipe and keyboard navigation connect all four pages. More Projects and More Tools jump directly to their respective catalogs.

```sh
npm install
npm run dev
npm run build
npm test
```

For browser tests on a fresh machine, run `npx playwright install chromium` first. Screenshots are saved to `.visual-check/` (ignored by Git).

## Replace the placeholders

- `src/data.ts`: identity, email, project and skill content, plus the desktop/mobile node coordinates.
- `src/Artwork.tsx`: replaceable SVG thumbnail illustrations, skill icons and node connections.
- `src/artwork/`: reference-derived vector outlines for the desktop tree and roots, plus measured connection anchors.
- `src/branchGeometry.ts`: the mobile branch arrangement.
- `src/App.tsx`: chapter labels, preview panels and placeholder About/Contact dialogs.
- `src/styles.css`: typography, colors and the bounded art stage.

Identity, technology names and project descriptions mirror the supplied concept and are placeholders, not verified portfolio claims. No external fonts or images are requested at runtime.

Branch endpoints derive from each node's center and radius. Both sections share the same stage and trunk anchor. Mobile uses a separate arrangement, rather than shrinking the desktop node layout.

Project and skill nodes show a small, non-modal preview on hover or keyboard focus. The preview closes on pointer leave, blur, Escape or page movement. Touch opens the preview with a tap and dismisses it with an outside tap. Desktop branches reach the intermediate project rings and the outer skill rings; the trunk continues behind the scroll control into the next section.

Each preview has a square media area to the left of its text. It uses the existing illustration/icon until an item in `src/data.ts` has `previewMedia: { src: "/media/prototype.gif", alt: "Prototype preview" }`. Place the image or GIF in `public/media/`; GIFs use a native image element and retain their animation.

Both catalogs use the same content and media fields as the tree nodes. On smaller screens, their content scrolls within the page; wheel/touch gestures move to the neighboring snapped page once the catalog reaches its edge. Clicking a catalog card opens its placeholder details. The roots page mirrors the tree's section navigation in its upper-right corner.

## Compare with the concept

With the dev server running, open `http://127.0.0.1:5173/?compare`. The workshop provides a reference overlay, adjustable opacity, split view, colored linework contours, zoom, canonical coordinate measurements and JSON/SVG exports. Load the supplied reference using the file picker, or copy it to `.visual-check/reference.png` for automatic loading and scripted checks.

```sh
npm run compare -- latest
```

This writes separate render, reference, overlay, contour and mask images, plus a metrics report under `.visual-check/comparison-latest/`. The original reference and comparison workshop are excluded from production. The portfolio uses local SVG vector assets, not the reference bitmap.

See [the tracing and validation procedure](docs/reference-tracing.md) for authoring details and the limits of the geometric metrics.

The browser checks cover all six requested viewports plus 3440 × 1440, 390 × 667 and 360 × 640, page alignment, endpoint geometry, node visibility, label clearance, keyboard navigation, reduced motion, resizing, dialogs and native touch gestures.
