# Technical tree portfolio

Two full-screen compositions built with React, TypeScript, CSS and SVG. Scroll, swipe, arrow controls and keyboard navigation connect projects to tools and skills.

```sh
npm install
npm run dev
npm run build
npm test
```

For browser tests on a fresh machine, run `npx playwright install chromium` first. Screenshots are saved to `.visual-check/` (ignored by Git).

## Replace the placeholders

- `src/data.ts`: identity, email, project and skill content, plus the desktop/mobile node coordinates.
- `src/Artwork.tsx`: replaceable SVG thumbnail illustrations and skill icons, tree branches and root routes.
- `src/App.tsx`: editorial copy and placeholder About/Contact dialogs.
- `src/styles.css`: typography, colors and the bounded art stage.

Identity, technology names and project descriptions mirror the supplied concept and are placeholders, not verified portfolio claims. No external fonts or images are requested at runtime.

Branch endpoints derive from each node's center and radius. Both sections share the same stage and trunk anchor. Mobile uses a separate arrangement, rather than shrinking the desktop node layout.

The browser checks cover all six requested viewports plus 3440 × 1440, 390 × 667 and 360 × 640, page alignment, endpoint geometry, node visibility, label clearance, keyboard navigation, reduced motion, resizing, dialogs and native touch gestures.
