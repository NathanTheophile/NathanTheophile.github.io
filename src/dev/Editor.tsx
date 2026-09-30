import { useCallback, useEffect, useRef, useState } from "react";
import App from "../App";
import { ContentContext, EditContext, mediaUrl, savedContent } from "../content";
import type { Media, PortfolioContent } from "../content";
import "./editor.css";

type Field = { path: string; label: string; media?: boolean; multiline?: boolean };
type Group = { path: string; label: string; fields: Field[]; page: number };
type Message = { type: string; content?: PortfolioContent; editing?: boolean; path?: string; value?: string; page?: number };

const labels: Record<string, string> = {
  name: "Nom", role: "Spécialité", email: "Adresse e-mail", logoMedia: "Logo",
  label: "Libellé de section", navLabel: "Navigation latérale", headerLabel: "Navigation du header",
  title: "Titre", description: "Description", heading: "Accroche", emailLabel: "Libellé de l’e-mail",
  thumbnailMedia: "Image du cercle et de la grille", previewMedia: "Image / GIF du panneau au survol",
  moreProjects: "Bouton vers les projets", moreTools: "Bouton vers les outils",
  scrollCaption: "Bouton de descente : première ligne", scrollDescription: "Bouton de descente : deuxième ligne",
  backCaption: "Bouton de retour : première ligne", backDescription: "Bouton de retour : deuxième ligne",
};
function getAt(content: PortfolioContent, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown>)[key], content);
}
function withValue(content: PortfolioContent, path: string, value: unknown) {
  const copy = structuredClone(content);
  const keys = path.split("."), key = keys.pop()!;
  const object = keys.reduce<unknown>((value, key) => (value as Record<string, unknown>)[key], copy) as Record<string, unknown>;
  object[key] = value;
  return copy;
}
function fields(path: string, object: object) {
  return Object.keys(object).filter(key => !(path === "pages.0" || path === "pages.1") || key !== "title")
    .map(key => ({ path: path + "." + key, label: labels[key] ?? key,
      media: key.endsWith("Media"), multiline: key === "description" }));
}
function groups(content: PortfolioContent): Group[] {
  return [
    { path: "identity", label: "Identité & logo", fields: fields("identity", content.identity), page: 0 },
    ...content.pages.map((page, i) => ({ path: "pages." + i, label: "Page " + (i + 1) + " · " + page.navLabel,
      fields: fields("pages." + i, page), page: i })),
    { path: "interface", label: "Boutons de navigation", fields: fields("interface", content.interface), page: 0 },
    ...Object.entries(content.projects).map(([id, item]) => ({ path: "projects." + id, label: "Projet · " + item.title,
      fields: fields("projects." + id, item), page: 0 })),
    ...Object.entries(content.skills).map(([id, item]) => ({ path: "skills." + id, label: "Outil · " + item.title,
      fields: fields("skills." + id, item), page: 1 })),
    { path: "contact", label: "Contact", fields: fields("contact", content.contact), page: 4 },
  ];
}
async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch("/__editor/" + path, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Le serveur local ne répond pas.");
  return result;
}

export default function Editor() {
  const [draft, setDraft] = useState<PortfolioContent | null>(null);
  const draftRef = useRef<PortfolioContent | null>(null);
  const baseline = useRef("");
  const version = useRef("");
  const token = useRef("");
  const iframe = useRef<HTMLIFrameElement>(null);
  const [selected, setSelected] = useState("identity");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const flush = useRef<(() => void) | null>(null);
  const send = useCallback((message: Message) => iframe.current?.contentWindow?.postMessage(message, location.origin), []);
  const update = useCallback((path: string, value: unknown) => {
    if (!draftRef.current) return;
    const next = withValue(draftRef.current, path, value);
    draftRef.current = next;
    setDraft(next);
    setNotice("");
  }, []);
  const load = useCallback(async () => {
    setError("");
    try {
      const result = await api<{ content: PortfolioContent; version: string; token: string }>("content");
      baseline.current = JSON.stringify(result.content);
      version.current = result.version;
      token.current = result.token;
      draftRef.current = result.content;
      setDraft(result.content);
      setNotice("");
    } catch (error) { setError((error as Error).message); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const listener = (event: MessageEvent<Message>) => {
      if (event.origin !== location.origin || event.source !== iframe.current?.contentWindow) return;
      const message = event.data;
      if (message.type === "editor:ready" && draftRef.current) {
        send({ type: "editor:content", content: draftRef.current, editing });
      } else if (message.type === "editor:change" && message.path && typeof message.value === "string") {
        update(message.path, message.value);
      } else if (message.type === "editor:select" && message.path) {
        const group = groups(draftRef.current!).find(group => message.path === group.path || message.path!.startsWith(group.path + "."));
        if (group) setSelected(group.path);
        requestAnimationFrame(() => document.getElementById(message.path!)?.focus());
      } else if (message.type === "editor:page" && message.page !== undefined) {
        setPage(message.page);
      } else if (message.type === "editor:flushed") flush.current?.();
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [editing, send, update]);
  useEffect(() => { if (draft) send({ type: "editor:content", content: draft, editing }); }, [draft, editing, send]);
  const dirty = !!draft && JSON.stringify(draft) !== baseline.current;
  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty]);
  const save = async () => {
    setBusy(true); setError("");
    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => { flush.current = null; reject(new Error("L’aperçu ne répond pas. Recharge l’éditeur.")); }, 3000);
        flush.current = () => { clearTimeout(timeout); flush.current = null; resolve(); };
        send({ type: "editor:flush" });
      });
      const result = await api<{ content: PortfolioContent; version: string }>("content", {
        method: "PUT", headers: { "Content-Type": "application/json", "X-Portfolio-Editor": token.current },
        body: JSON.stringify({ content: draftRef.current, version: version.current }),
      });
      baseline.current = JSON.stringify(result.content); version.current = result.version;
      draftRef.current = result.content; setDraft(result.content);
      setNotice("Enregistré dans le projet.");
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  };
  const upload = async (path: string, file: File) => {
    setUploading(true); setError("");
    try {
      if (file.size > 12 * 1024 * 1024) throw new Error("L’image dépasse 12 Mo.");
      const media = await api<Media>("media", { method: "POST", body: file,
        headers: { "Content-Type": file.type, "X-Portfolio-Editor": token.current } });
      update(path, { ...media, alt: file.name.replace(/\.[^.]+$/, "") });
    } catch (error) { setError((error as Error).message); }
    finally { setUploading(false); }
  };
  const allGroups = draft ? groups(draft) : [];
  const current = allGroups.find(group => group.path === selected) ?? allGroups[0];
  return <div className="content-editor">
    <header className="editor-toolbar">
      <strong>Éditeur local</strong>
      <label>Page <select aria-label="Page de l’aperçu" value={page} onChange={event => {
        const index = Number(event.target.value); setPage(index); send({ type: "editor:navigate", page: index });
      }}>{draft?.pages.map((page, index) => <option key={index} value={index}>{index + 1} · {page.navLabel}</option>)}</select></label>
      <button aria-pressed={editing} onClick={() => setEditing(!editing)}>{editing ? "Mode édition" : "Mode aperçu"}</button>
      <span className="editor-save-status" role="status">{busy ? "Enregistrement…" : notice || (dirty ? "Modifications non enregistrées" : "Contenu enregistré")}</span>
      <button disabled={!dirty || busy || uploading} onClick={() => void load()}>Annuler</button>
      <button className="editor-save" disabled={!draft || busy || uploading} onClick={() => void save()}>Enregistrer</button>
      <a href="/" target="_blank" rel="noreferrer">Voir le site ↗</a>
    </header>
    {error && <div className="editor-error" role="alert">{error}</div>}
    <div className="editor-workspace">
      <aside className="editor-sidebar">
        <p>Clique sur un texte dans l’aperçu pour l’éditer. Entrée valide, Maj + Entrée ajoute une ligne, Échap annule.</p>
        <label>Élément à modifier <select aria-label="Élément à modifier" value={selected} onChange={event => {
          setSelected(event.target.value);
          const group = allGroups.find(group => group.path === event.target.value)!;
          setPage(group.page); send({ type: "editor:navigate", page: group.page });
        }}>{allGroups.map(group => <option key={group.path} value={group.path}>{group.label}</option>)}</select></label>
        {draft && current && <form onSubmit={event => { event.preventDefault(); void save(); }}>
          <h1>{current.label}</h1>
          {current.fields.map(field => {
            const value = getAt(draft, field.path);
            if (!field.media) return <label key={field.path}>{field.label}
              {field.multiline ? <textarea id={field.path} value={value as string} rows={4} disabled={busy} onChange={event => update(field.path, event.target.value)} />
                : <input id={field.path} type={field.path === "identity.email" ? "email" : "text"} value={value as string} disabled={busy} onChange={event => update(field.path, event.target.value)} />}
            </label>;
            const media = value as Media | null;
            return <fieldset key={field.path}><legend>{field.label}</legend>
              {media && <img className="editor-media-preview" src={mediaUrl(media.src)} alt={media.alt ?? ""} />}
              <label className="editor-upload">Importer une image / GIF
                <input id={field.path} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif" disabled={busy || uploading}
                  onChange={event => { const file = event.target.files?.[0]; if (file) void upload(field.path, file); event.target.value = ""; }} />
              </label>
              <label>Adresse de l’image <input type="text" aria-label={field.label + " : URL"} value={media?.src ?? ""} placeholder="https://…"
                disabled={busy || uploading} onChange={event => update(field.path, event.target.value ? { src: event.target.value, alt: media?.alt ?? "" } : null)} /></label>
              <label>Texte alternatif <input type="text" aria-label={field.label + " : texte alternatif"} value={media?.alt ?? ""} disabled={!media || busy}
                onChange={event => update(field.path, { ...media!, alt: event.target.value })} /></label>
              <button type="button" disabled={!media || busy || uploading} onClick={() => update(field.path, null)}>Rétablir l’image par défaut</button>
            </fieldset>;
          })}
        </form>}
        <p>Les images du panneau peuvent être différentes de celles des cercles. Sans image de panneau, l’image du cercle est utilisée.</p>
        <p>Enregistrer écrit les contenus dans <code>src/content.json</code>. Les images importées sont conservées dans <code>public/media</code>.</p>
      </aside>
      {draft && <iframe ref={iframe} className="editor-site-preview" title="Aperçu éditable du portfolio" src="/?editor-preview"
        onLoad={() => send({ type: "editor:content", content: draftRef.current!, editing })} />}
    </div>
  </div>;
}

export function EditorPreview() {
  const [content, setContent] = useState(savedContent);
  const [editing, setEditing] = useState(false);
  const active = useRef<{ element: HTMLElement; path: string; original: string } | null>(null);
  const send = useCallback((message: Message) => { if (parent !== window) parent.postMessage(message, location.origin); }, []);
  const finish = useCallback((cancel = false) => {
    const field = active.current;
    if (!field) return;
    active.current = null;
    const value = field.element.innerText.replace(/\n$/, "");
    field.element.removeAttribute("contenteditable");
    field.element.removeAttribute("role");
    field.element.removeAttribute("tabindex");
    field.element.classList.remove("inline-editing");
    if (cancel) field.element.innerText = field.original;
    else if (value !== field.original) send({ type: "editor:change", path: field.path, value });
    field.element.blur();
  }, [send]);
  useEffect(() => {
    const receive = (event: MessageEvent<Message>) => {
      if (event.origin !== location.origin || event.source !== parent || parent === window) return;
      const message = event.data;
      if (message.type === "editor:content" && message.content) {
        // Commit before React replaces a text node being edited.
        finish();
        setContent(message.content); setEditing(!!message.editing);
      } else if (message.type === "editor:navigate") {
        finish();
        const main = document.querySelector("main")!;
        main.scrollTo({ top: Math.max(0, Math.min(4, message.page ?? 0)) * main.clientHeight, behavior: "instant" });
      } else if (message.type === "editor:flush") { finish(); send({ type: "editor:flushed" }); }
    };
    window.addEventListener("message", receive);
    send({ type: "editor:ready" });
    return () => window.removeEventListener("message", receive);
  }, [send, finish]);
  useEffect(() => {
    document.body.classList.toggle("editor-preview", editing);
    const click = (event: MouseEvent) => {
      if (!editing || !(event.target instanceof Element)) return;
      const text = event.target.closest<HTMLElement>("[data-edit-text]");
      const media = event.target.closest<HTMLElement>("[data-edit-media]");
      const group = event.target.closest<HTMLElement>("[data-edit-group]");
      if (!text && !media && !group) return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (text) {
        if (active.current?.element === text) return;
        finish();
        active.current = { element: text, path: text.dataset.editText!, original: text.innerText };
        text.setAttribute("contenteditable", "plaintext-only");
        text.setAttribute("role", "textbox"); text.setAttribute("tabindex", "0");
        text.classList.add("inline-editing"); text.focus();
      } else {
        finish(); send({ type: "editor:select", path: media?.dataset.editMedia ?? group!.dataset.editGroup });
      }
    };
    const blur = (event: FocusEvent) => { if (event.target === active.current?.element) finish(); };
    const key = (event: KeyboardEvent) => {
      if (!active.current) return;
      event.stopImmediatePropagation();
      if (event.key === "Escape" || event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); finish(event.key === "Escape");
      }
    };
    const main = document.querySelector("main")!;
    const scroll = () => send({ type: "editor:page", page: Math.round(main.scrollTop / main.clientHeight) });
    document.addEventListener("click", click, true);
    document.addEventListener("blur", blur, true);
    window.addEventListener("keydown", key, true);
    main.addEventListener("scroll", scroll);
    return () => {
      document.body.classList.remove("editor-preview");
      document.removeEventListener("click", click, true); document.removeEventListener("blur", blur, true);
      window.removeEventListener("keydown", key, true); main.removeEventListener("scroll", scroll);
    };
  }, [editing, finish, send]);
  return <ContentContext.Provider value={content}>
    <EditContext.Provider value={editing ? path => send({ type: "editor:select", path }) : null}>
      <App />
    </EditContext.Provider>
  </ContentContext.Provider>;
}
