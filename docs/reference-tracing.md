# Reference tracing and visual validation

## Stable frame

The original concept is 941 × 1672 pixels. Its second section starts at source y=820. Each comparison uses a 1000 × 870 frame, with uniform scaling from the source width. The lower reference's extra bottom padding is cropped; the image is never stretched to align individual branches.

The workshop at `/?compare` is available only during development. Its iframe renders the actual portfolio at the canonical viewport. The reference, overlay and contour layers share this same coordinate frame. Zoom affects the workshop display, not the portfolio viewport or the exported coordinates.

## Authoring

Desktop linework is stored as filled SVG outlines in `src/artwork/tree-network.svg` and `root-network.svg`. The contours preserve the reference's irregular silhouette, variable widths, parallel stems and fine ramifications. They are grouped into five opacity bands. These files contain paths only, with no raster images, scripts, text or external links.

The outlines retain the original branch tips through the comparison mask's padded circle exclusion. An SVG clip trims project branches at the intermediate ring (the ring directly surrounding the thumbnail) and roots at the outer ring. There are no separate radial connector strokes: the branch silhouette and direction continue unchanged to the circle. `src/artwork/anchors.ts` records nearby linework for diagnostic landmarks only.

The stem bundle continues the original irregular ink contours behind the scroll control to the bottom of the frame. The authoring script reflects a 60-pixel strip of the traced trunk rather than adding clean analytic strokes. The roots start with the same contour profile and blend into their original outlines over 110 pixels. Both SVG assets reach the frame edges; a painted-boundary test checks their alignment and ink coverage. The inner scroll discs stay opaque for their arrows, while stems remain visible through the outer annuli. Node rings have no downward decoration or top/left dot markers, including in the traced source contours.

The mobile layout retains its separate, readable branch arrangement. Moving a desktop node extensively requires changing the corresponding artwork too; editing identity or descriptions does not require retracing.

The optional offline tracing script uses local contrast against the reference background, masks the interface content, rejects isolated glyph remnants, and simplifies contour outlines with a 0.3-pixel tolerance. Its diagnostic mask and report show exactly what was retained. It does not replace the page with a bitmap.

To regenerate from the same concept, retain the original calibration captures in `.visual-check/comparison-before/`, including `*-source.png` and `*-allowed.png`, then run:

```sh
python -m pip install --target .visual-check/python pillow numpy opencv-python-headless
python scripts/trace-reference.py
```

These Python authoring dependencies stay in the ignored working directory; they are not required to build or run the portfolio. For another reference or layout, create a new calibration with `npm run compare -- before`, review its content masks, then trace. Preserve existing before/after evidence before replacing it.

## Evaluation

Run the dev server, then `npm run compare -- latest`. The capture script writes the unobstructed render first, followed by the reference overlay and two-color contour view. Bitmap masks use separate filenames and never overwrite rendered screenshots.

The contour view shows cyan reference pixels and orange rendered vector pixels. The measurements report both reference coverage and rendered-pixel proximity within three canonical pixels, the reference-to-render median distance, and its 90th percentile. Content, node circles and footer controls are excluded, including the junctions immediately next to the rings. The original concept's editorial title/description areas remain excluded even after their removal from the live page: text is not branch geometry. Those junctions need a separate painted-boundary check and close-up inspection. The contrast threshold defaults to 14; the weaker-rendered-traits option changes the alpha cutoff. Comparisons must use identical parameters and exclusion masks.

The measured pre-tracing baseline at that calibration was:

| Network | Reference coverage ≤3 px | Median error | P90 error |
| --- | ---: | ---: | ---: |
| Tree | 54.0% | 2.8 px | 24.0 px |
| Roots | 37.0% | 6.7 px | 36.3 px |

The comparison tests require reference coverage above 90%, rendered proximity above 95%, median error ≤1.5 px, and P90 ≤4 px. These are geometry regression gates, not a score for the whole design. They do not evaluate typography, thumbnails, low-contrast guides or aesthetic coherence.

Before visual completion, inspect the unobstructed render and overlay separately: the main silhouette, each principal bifurcation, the parallel stem bundle, the secondary branch density, line widths, contrast, and visible node attachments. Then run the responsive/navigation tests and production build. A successful build alone is never evidence of reference fidelity.

The workshop can display measured anchors and macro landmarks, collect new named points at any zoom, and export the full coordinate record. The source reference remains local in `.visual-check/` or in browser memory after file upload. The workshop and reference endpoint are absent from the production build.

## Consigne à reprendre pour les prochaines passes

> Traite le concept comme un dessin à reproduire. Garde le cadrage et l’échelle uniformes de la calibration. Relève les repères avant de modifier les tracés. Corrige d’abord la silhouette et les bifurcations principales, puis le faisceau de lignes parallèles, les ramifications, les épaisseurs, les contrastes et les détails. Après chaque passe, inspecte séparément le rendu sans référence et sa superposition avec le concept. Les textes et les vignettes peuvent rester des placeholders. Fournis les captures du rendu, de l’overlay et des contours ainsi que le rapport de mesures. Vérifie les raccordements visibles aux cercles et la lisibilité des textes. La compilation et les tests fonctionnels complètent cette validation visuelle ; ils ne permettent pas à eux seuls de déclarer le dessin fidèle.
