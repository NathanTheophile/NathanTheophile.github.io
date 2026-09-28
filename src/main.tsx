import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const Comparison = import.meta.env.DEV
  ? lazy(() => import("./dev/Comparison"))
  : null;
const compare = Comparison && new URLSearchParams(location.search).has("compare");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {compare && Comparison ? (
      <Suspense fallback={<p>Chargement de la comparaison…</p>}><Comparison /></Suspense>
    ) : <App />}
  </React.StrictMode>,
);
