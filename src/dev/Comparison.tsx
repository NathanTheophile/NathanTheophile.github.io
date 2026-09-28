import { useCallback, useEffect, useRef, useState } from "react";
import { analyze, FRAME, loadImage } from "./analysis";
import type { Landmark, Metrics, Section } from "./analysis";
import { referenceLandmarks } from "./landmarks";
import "./comparison.css";

type Mode = "overlay" | "split" | "contours" | "reference" | "render";
const modes: [Mode, string][] = [["overlay", "Superposition"], ["split", "Volet"], ["contours", "Contours"], ["reference", "Référence"], ["render", "Rendu"]];
const initial = new URLSearchParams(location.search);

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Comparison() {
  const [section, setSection] = useState<Section>(initial.get("section") === "tools" ? "tools" : "projects");
  const [mode, setMode] = useState<Mode>((initial.get("mode") as Mode) || "overlay");
  const [opacity, setOpacity] = useState(50), [zoom, setZoom] = useState(.75), [split, setSplit] = useState(820);
  const [contrast, setContrast] = useState(14), [guides, setGuides] = useState(false);
  const [measure, setMeasure] = useState(false), [showPoints, setShowPoints] = useState(false), [name, setName] = useState("Nouveau repère 1");
  const [points, setPoints] = useState<Landmark[]>(referenceLandmarks), [metrics, setMetrics] = useState<Metrics>();
  const [error, setError] = useState(""), [ready, setReady] = useState(0);
  const [image, setImage] = useState<HTMLImageElement>();
  const frame = useRef<HTMLIFrameElement>(null), referenceCanvas = useRef<HTMLCanvasElement>(null), contourCanvas = useRef<HTMLCanvasElement>(null);
  const result = useRef<Awaited<ReturnType<typeof analyze>>>(undefined);
  const version = useRef(0);

  useEffect(() => {
    loadImage("/__reference/image.png").then(setImage).catch(() => setError("Charge l’image originale avec le bouton Référence PNG."));
  }, []);

  const refresh = useCallback(async () => {
    const document = frame.current?.contentDocument;
    if (!document?.querySelector("[data-reference-network]") || !image) return;
    const current = ++version.current;
    document.querySelector("main")!.scrollTo({ top: section === "tools" ? FRAME.height : 0, behavior: "instant" });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    try {
      const next = await analyze(document, image, section, split, contrast, guides);
      if (version.current !== current) return;
      result.current = next;
      referenceCanvas.current!.getContext("2d")!.drawImage(next.source, 0, 0);
      contourCanvas.current!.getContext("2d")!.drawImage(next.contours, 0, 0);
      setMetrics(next.metrics); setError("");
      // Read-only evidence interface used by the Playwright comparison script.
      Object.assign(window, { __comparison: { section, split, contrast, guides, metrics: next.metrics, points, frame: FRAME }, __comparisonMasks: { reference: next.targetMask, render: next.renderMask, allowed: next.allowed } });
    } catch (cause) { setError(String(cause)); }
  }, [image, section, split, contrast, guides, ready, points]);

  useEffect(() => {
    const timer = setTimeout(() => { void refresh(); }, 150);
    return () => clearTimeout(timer);
  }, [refresh]);

  function loaded(attempt = 0) {
    const document = frame.current?.contentDocument;
    if (!document) return;
    if (document.querySelectorAll("[data-reference-network]").length !== 2) {
      if (attempt < 200) setTimeout(() => loaded(attempt + 1), 50);
      else setError("Le rendu SVG n’a pas chargé. Vérifie le portfolio puis actualise le rendu.");
      return;
    }
    setReady((value) => value + 1);
  }

  const visiblePoints = points.filter((point) => point.section === section);
  return <div className="comparison-tool">
    <header className="comparison-toolbar">
      <strong>Atelier de fidélité visuelle</strong>
      <label>Écran <select aria-label="Écran" value={section} onChange={(event) => setSection(event.target.value as Section)}><option value="projects">Arbre / projets</option><option value="tools">Racines / outils</option></select></label>
      <label>Vue <select aria-label="Vue" value={mode} onChange={(event) => setMode(event.target.value as Mode)}>{modes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>{mode === "split" ? "Volet" : "Opacité"} <input aria-label="Opacité" type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(+event.target.value)} /> {opacity}%</label>
      <label>Zoom <select aria-label="Zoom" value={zoom} onChange={(event) => setZoom(+event.target.value)}>{[.5, .75, 1, 1.5, 2, 3].map((value) => <option key={value} value={value}>{value * 100}%</option>)}</select></label>
      <button onClick={() => { frame.current!.contentWindow!.location.reload(); }}>Actualiser le rendu</button>
      <a href="/" target="_blank" rel="noreferrer">Portfolio ↗</a>
    </header>
    <aside className="comparison-settings">
      <label className="reference-upload">Référence PNG <input aria-label="Référence PNG" type="file" accept="image/png,image/jpeg" onChange={async (event) => {
        const file = event.target.files?.[0]; if (!file) return;
        const url = URL.createObjectURL(file);
        try { setImage(await loadImage(url)); } finally { URL.revokeObjectURL(url); }
      }} /></label>
      <label>Début des racines (px source) <input aria-label="Début des racines" type="number" value={split} onChange={(event) => setSplit(+event.target.value)} /></label>
      <label>Contraste minimal <input aria-label="Contraste minimal" type="number" min="4" max="60" value={contrast} onChange={(event) => setContrast(+event.target.value)} /></label>
      <label><input type="checkbox" checked={guides} onChange={(event) => setGuides(event.target.checked)} /> Inclure les traits très faibles</label>
      <label><input aria-label="Relever des repères" type="checkbox" checked={measure} onChange={(event) => setMeasure(event.target.checked)} /> Relever des repères</label>
      <label><input aria-label="Afficher les repères" type="checkbox" checked={showPoints} onChange={(event) => setShowPoints(event.target.checked)} /> Afficher les repères</label>
      <input aria-label="Nom du repère" placeholder="Nom du repère" value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={() => { download(`releve-${section}.json`, JSON.stringify({ reference: { width: image?.naturalWidth, height: image?.naturalHeight, split }, frame: FRAME, contrast, guides, metrics, points }, null, 2), "application/json"); }}>Exporter le relevé</button>
      <button onClick={() => { if (result.current) download(`traces-${section}.svg`, result.current.markup.replace(/color:\s*white;/, `color: ${section === "tools" ? "#b3c8d7" : "#222a33"};`), "image/svg+xml"); }}>Exporter les tracés SVG</button>
    </aside>
    <main className="comparison-workspace">
      <div className="comparison-surface" style={{ width: FRAME.width * zoom, height: FRAME.height * zoom }}>
        <div className={`comparison-frame mode-${mode}`} style={{ transform: `scale(${zoom})` }} data-testid="comparison-frame">
          <iframe ref={frame} src="/" title="Rendu réel du portfolio" width={FRAME.width} height={FRAME.height} onLoad={() => loaded()} />
          <canvas ref={referenceCanvas} width={FRAME.width} height={FRAME.height} className="reference-layer" style={{ opacity: mode === "overlay" ? opacity / 100 : 1, clipPath: mode === "split" ? `inset(0 0 0 ${opacity}%)` : undefined }} />
          <canvas ref={contourCanvas} width={FRAME.width} height={FRAME.height} className="contour-layer" />
          <svg className="landmark-layer" viewBox="0 0 1000 870" style={{ pointerEvents: measure ? "auto" : "none", cursor: measure ? "crosshair" : undefined }} onClick={(event) => {
            if (!measure) return;
            const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(event.currentTarget.getScreenCTM()!.inverse());
            setPoints((current) => [...current, { name: name || `Repère ${current.length + 1}`, section, x: Math.round(point.x * 10) / 10, y: Math.round(point.y * 10) / 10 }]);
            setName(`Bifurcation ${points.length + 2}`);
          }}>
            {(showPoints || measure) && visiblePoints.map((point, i) => <g key={i}><circle cx={point.x} cy={point.y} r="4" /><path d={`M${point.x - 9} ${point.y}h18M${point.x} ${point.y - 9}v18`} /><text x={point.x + 10} y={point.y - 8}>{point.name} · {point.x}, {point.y}</text></g>)}
          </svg>
        </div>
      </div>
    </main>
    <footer className="comparison-evidence">
      {error ? <p role="alert">{error}</p> : metrics ? <p data-testid="comparison-metrics"><b>Cyan : référence · Orange : rendu.</b> Référence couverte à ≤3 px : {(metrics.referenceCoverage * 100).toFixed(1)}% · Rendu proche à ≤3 px : {(metrics.renderCoverage * 100).toFixed(1)}% · Écart médian : {metrics.medianError.toFixed(1)} px · P90 : {metrics.p90Error.toFixed(1)} px · Texte traversé : {metrics.textOverlapPixels} pixels.</p> : <p>Analyse du rendu et de la référence…</p>}
      <p>Cadre 1000 × 870 · Échelle uniforme · Contenus et cercles masqués pour les mesures. Les métriques concernent les traits contrastés, pas la fidélité globale. <button onClick={() => setPoints([])}>Effacer les repères</button></p>
      {visiblePoints.length > 0 && <details><summary>{visiblePoints.length} repères sur cet écran</summary><ol>{visiblePoints.map((point, i) => <li key={i}>{point.name} : {point.x}, {point.y} <button onClick={() => setPoints((current) => current.filter((p) => p !== point))}>Supprimer</button></li>)}</ol></details>}
    </footer>
  </div>;
}
