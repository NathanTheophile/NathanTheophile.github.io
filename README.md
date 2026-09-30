# Technical tree portfolio

Five snapped full-screen pages built with React, TypeScript, CSS and SVG: the project tree, the tools/skills roots, the project catalog, the tools/skills catalog and contact. Scroll, swipe and keyboard navigation connect all five pages. More Projects and More Tools jump directly to their respective catalogs.

```sh
npm install
npm run dev
npm run build
npm test
```

For browser tests on a fresh machine, run `npx playwright install chromium` first. Screenshots are saved to `.visual-check/` (ignored by Git).

## Local content editor

Run `npm run dev`, then click **Éditer le contenu** on the first page or open `http://127.0.0.1:5173/?edit`.

- Click a text in the preview to edit it. Enter commits; Shift + Enter inserts a line; Escape cancels.
- Click a circle/image or a node's **Modifier** button to open its fields in the sidebar. The element selector also covers identity, page labels, navigation buttons and contact.
- Import PNG, JPEG, GIF, WebP or AVIF files (up to 12 MB), or enter an HTTP(S) image URL. Circles/catalogs and hover panels can have separate media. The original illustration is the fallback.
- **Mode aperçu** restores normal interactions. The page selector visits all five pages.
- **Enregistrer** writes `src/content.json`; uploaded files are stored under `public/media/`. Commit those files with the site to deploy the changes. Edits are shared across tree nodes, previews, catalogs and contact.
- **Annuler** reloads the last saved content. A conflicting external save is reported without overwriting it. Uploads are retained even if you later cancel, so previously referenced media are not deleted.

The editor and its styling are loaded only in development on a loopback hostname. The write API exists only in the Vite dev server and rejects non-local requests. Neither the editor nor the write API is included in `npm run build` or `npm run preview`; adding `?edit` to a deployed URL has no effect.

## Content and artwork

- `src/content.json`: saved identity, email, page labels, project/skill text and media references.
- `src/data.ts`: desktop/mobile node coordinates and default illustration identifiers.
- `src/Artwork.tsx`: replaceable SVG thumbnail illustrations, skill icons and node connections.
- `src/artwork/`: reference-derived vector outlines for the desktop tree and roots, plus measured connection anchors.
- `src/branchGeometry.ts`: the mobile branch arrangement.
- `src/App.tsx`: chapter layouts, preview panels, catalogs and contact.
- `src/styles.css`: typography, colors and the bounded art stage.

Identity, technology names and project descriptions mirror the supplied concept and are placeholders, not verified portfolio claims. Default content uses local illustrations and no external fonts. Any remote image URLs you add are loaded from their specified hosts.

Branch endpoints derive from each node's center and radius. Both sections share the same stage and trunk anchor. Mobile uses a separate arrangement, rather than shrinking the desktop node layout.

Project and skill nodes show a small, non-modal preview on hover or keyboard focus. The preview closes on pointer leave, blur, Escape or page movement. Touch opens the preview with a tap and dismisses it with an outside tap. Desktop branches reach the intermediate project rings and the outer skill rings; the trunk continues behind the scroll control into the next section.

Each preview has a square media area to the left of its text. It uses the existing illustration/icon until an item in `src/content.json` has `"previewMedia": { "src": "media/prototype.gif", "alt": "Prototype preview" }`. Relative `media/` paths respect the Vite base URL when deploying to a GitHub Pages project. Place the image or GIF in `public/media/`; GIFs use a native image element and retain their animation.

Both catalogs use the same content and media fields as the tree nodes. On smaller screens, their content scrolls within the page; wheel/touch gestures move to the neighboring snapped page once the catalog reaches its edge. Clicking a catalog card opens its placeholder details. The roots page mirrors the tree's section navigation in its upper-right corner.

## Compare with the concept

With the dev server running, open `http://127.0.0.1:5173/?compare`. The workshop provides a reference overlay, adjustable opacity, split view, colored linework contours, zoom, canonical coordinate measurements and JSON/SVG exports. Load the supplied reference using the file picker, or copy it to `.visual-check/reference.png` for automatic loading and scripted checks.

```sh
npm run compare -- latest
```

This writes separate render, reference, overlay, contour and mask images, plus a metrics report under `.visual-check/comparison-latest/`. The original reference and comparison workshop are excluded from production. The portfolio uses local SVG vector assets, not the reference bitmap.

See [the tracing and validation procedure](docs/reference-tracing.md) for authoring details and the limits of the geometric metrics.

The browser checks cover all six requested viewports plus 3440 × 1440, 390 × 667 and 360 × 640, page alignment, endpoint geometry, node visibility, label clearance, keyboard navigation, reduced motion, resizing, dialogs and native touch gestures.
