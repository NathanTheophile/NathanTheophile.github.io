import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const Comparison = import.meta.env.DEV
  ? lazy(() => import("./dev/Comparison"))
  : null;
const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const Editor = import.meta.env.DEV && local ? lazy(() => import("./dev/Editor")) : null;
const EditorPreview = import.meta.env.DEV && local
  ? lazy(() => import("./dev/Editor").then(module => ({ default: module.EditorPreview }))) : null;
const params = new URLSearchParams(location.search);
const compare = Comparison && params.has("compare");
const editor = Editor && params.has("edit");
const preview = EditorPreview && params.has("editor-preview");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {editor && Editor ? <Suspense fallback={<p>Chargement de l’éditeur…</p>}><Editor /></Suspense>
      : preview && EditorPreview ? <Suspense fallback={<p>Chargement de l’aperçu…</p>}><EditorPreview /></Suspense>
      : compare && Comparison ? (
      <Suspense fallback={<p>Chargement de la comparaison…</p>}><Comparison /></Suspense>
    ) : <App />}
  </React.StrictMode>,
);
