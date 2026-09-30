# Reference tracing and visual validation

## Stable frame

The original concept is 941 × 1672 pixels. Its second section starts at source y=820. Each comparison uses a 1000 × 870 frame, with uniform scaling from the source width. The lower reference's extra bottom padding is cropped; the image is never stretched to align individual branches.

The workshop at `/?compare` is available only during development. Its iframe renders the actual portfolio at the canonical viewport. The reference, overlay and contour layers share this same coordinate frame. Zoom affects the workshop display, not the portfolio viewport or the exported coordinates.

## Authoring

Desktop linework is stored as filled SVG silhouettes in `src/artwork/tree-network.svg` and `root-network.svg`. Their curved boundaries preserve the reference's local thickness changes, bifurcations, secondary branches and attached technical points. A fine-detail region and a stronger ink region retain the contrast hierarchy. Large construction arcs are exact SVG circles; the faint guide dashes retain their measured source positions. There are no raster images or browser blur filters.

The authoring script recovers branch tips through the comparison mask's padded circle exclusion. An SVG clip trims project branches at the intermediate ring and roots at the outer ring. No separate radial connector strokes are added. `src/artwork/anchors.ts` records nearby linework for diagnostic landmarks only.

The stem bundle continues behind the scroll control to the frame edge. Both pages derive their stem silhouettes from the same sampled source field, with matching widths and opacity at the shared edge. The inner scroll discs stay opaque for their arrows, while stems remain visible through the outer annuli. A painted-boundary test checks alignment and ink coverage. Node rings have no downward decoration or top/left dot markers.

The mobile layout retains its separate, readable branch arrangement. Moving a desktop node extensively requires changing the corresponding artwork too; editing identity or descriptions does not require retracing.

The displayed network and every node share one horizontal SVG translation to center the stem optically. Scroll discs and arrows are centered independently on the viewport. The original path and node coordinates remain intact; linework metrics compare their authoring geometry, while screen-coordinate tests verify the displayed centering separately.

The optional offline authoring script uses local contrast against the original reference, excludes interface content and rejects glyph remnants. Subpixel contours are resampled and smoothed along their boundaries before fitting quadratic curves. The process keeps variable widths and technical details instead of reducing branches to uniform strokes. Frame padding preserves the shared trunk. Regeneration always starts from the original calibrated source, never from a previous rendered iteration. Python is used only during authoring; the browser displays exported vector geometry directly.

A vector luminance mask reduces pale detail opacity by about 30% away from principal ink and by about 80% in the 1.2 px rim beside it. The principal silhouettes and their underpaint retain their approved geometry and contrast. This avoids cutting secondary branches into disconnected fragments.

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
