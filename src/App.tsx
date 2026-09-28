import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import {
  identity,
  mobileProjects,
  mobileSkills,
  projects,
  skills,
} from "./data";
import type { Item } from "./data";
import {
  MOBILE_TRUNK_X,
  RootsGraphic,
  SkillIcon,
  Thumbnail,
  TreeGraphic,
  TRUNK_X,
} from "./Artwork";

type Detail = { title: string; description: string; category: string };
type Preview = Detail & { id: string; dark: boolean; anchor: DOMRect; mark: string; media?: Item["previewMedia"] };

function PreviewPanel({ preview }: { preview: Preview }) {
  const panel = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [mediaSize, setMediaSize] = useState(150);
  const [position, setPosition] = useState({ left: 16, top: 16 });
  useLayoutEffect(() => {
    setMediaSize(copy.current!.getBoundingClientRect().height);
    const { width, height } = panel.current!.getBoundingClientRect();
    const { anchor } = preview, gap = 16;
    let left = anchor.right + gap;
    let top = anchor.top + anchor.height / 2 - height / 2;
    if (left + width > innerWidth - gap) left = anchor.left - width - gap;
    if (left < gap) {
      left = anchor.left + anchor.width / 2 - width / 2;
      top = anchor.bottom + gap;
      if (top + height > innerHeight - gap) top = anchor.top - height - gap;
    }
    setPosition({ left: Math.max(gap, Math.min(left, innerWidth-width-gap)),
      top: Math.max(gap, Math.min(top, innerHeight-height-gap)) });
  }, [preview, mediaSize]);
  return <div ref={panel} id="node-preview" role="tooltip"
    className={`preview-panel ${preview.dark ? "dark" : ""}`} style={position}>
    <div className="preview-media" style={{ width: mediaSize }}>
      {preview.media ? <img src={preview.media.src} alt={preview.media.alt ?? preview.title} />
        : preview.dark ? <SkillIcon kind={preview.mark} /> : <Thumbnail kind={preview.mark} />}
    </div>
    <div className="preview-copy" ref={copy}>
      <span className="section-label">{preview.category}</span>
      <h2>{preview.title}</h2><p>{preview.description}</p>
    </div>
  </div>;
}

function Arrow({ down = false, up = false }: { down?: boolean; up?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={up ? "M12 20V4m-7 7 7-7 7 7" : down ? "M12 4v16m-7-7 7 7 7-7" : "M4 12h15m-6-6 6 6-6 6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function Node({
  item,
  mobile,
  dark,
  preview,
  dismissPreview,
  previewId,
}: {
  item: Item;
  mobile: boolean;
  dark?: boolean;
  preview: (detail: Preview) => void;
  dismissPreview: (id: string) => void;
  previewId?: string;
}) {
  const p = mobile ? item.mobile : item.desktop;
  const show = (button: HTMLButtonElement) => preview({ id: item.id, title: item.title,
    description: item.description, category: dark ? "Tool & skill" : "Project",
    dark: !!dark, anchor: button.getBoundingClientRect(), mark: item.mark, media: item.previewMedia });
  const interactions: ButtonHTMLAttributes<HTMLButtonElement> = {
    "aria-describedby": previewId === item.id ? "node-preview" : undefined,
    onPointerEnter: (event) => { if (event.pointerType !== "touch") show(event.currentTarget); },
    onPointerLeave: (event) => { if (event.pointerType !== "touch") dismissPreview(item.id); },
    onFocus: (event) => { if (event.currentTarget.matches(":focus-visible")) show(event.currentTarget); },
    onBlur: () => dismissPreview(item.id),
    // Touch has no hover: keep a tap preview without opening a modal.
    onClick: (event) => { if (window.matchMedia("(hover: none)").matches) show(event.currentTarget); },
  };
  return (
    <g
      className={`node ${dark ? "skill-node" : "project-node"}`}
      data-node={item.id}
    >
      <g
        aria-hidden="true"
        className="node-rings"
        fill="none"
        stroke="currentColor"
      >
        <circle data-connection-ring={!dark || mobile ? "true" : undefined}
          cx={p.x} cy={p.y} r={p.r} strokeWidth={dark ? 1.5 : 0.65} />
        <circle
          data-outer-ring="true"
          data-connection-ring={dark && !mobile ? "true" : undefined}
          cx={p.x}
          cy={p.y}
          r={p.r + (mobile ? 5 : 9)}
          strokeWidth=".5"
          opacity=".38"
          strokeDasharray={dark ? "115 20 21 45" : undefined}
        />
        {!mobile && (
          <>
            <path
              d={`M${p.label.x - 13} ${p.label.y + 5}v-8h7M${p.label.x + p.width - 11} ${p.label.y + 5}v-8h-7`}
              opacity=".6"
              strokeWidth=".75"
            />
          </>
        )}
      </g>
      <foreignObject
        x={p.x - p.r}
        y={p.y - p.r}
        width={p.r * 2}
        height={p.r * 2}
      >
        <button
          className="node-image"
          aria-label={`Explore ${item.title}`}
          {...interactions}
        >
          {dark ? (
            <SkillIcon kind={item.mark} />
          ) : (
            <Thumbnail kind={item.mark} />
          )}
        </button>
      </foreignObject>
      <foreignObject
        x={p.label.x}
        y={p.label.y}
        width={p.width}
        height={mobile ? 90 : 114}
      >
        <div className="node-copy">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <button
            className="node-action"
            {...interactions}
            aria-label={`Details about ${item.title}`}
          >
            <Arrow />
          </button>
        </div>
      </foreignObject>
    </g>
  );
}

function Editorial({
  dark,
  mobile,
  onExplore,
}: {
  dark?: boolean;
  mobile: boolean;
  onExplore: () => void;
}) {
  return (
    <foreignObject
      x={mobile ? 22 : 45}
      y={mobile ? (dark ? 50 : 122) : dark ? 72 : 136}
      width={mobile ? (dark ? 175 : 346) : dark ? 302 : 270}
      height="110"
    >
      <div className="editorial">
        <div className="section-label" id={!dark ? "projects-title" : undefined}>
          <span>{dark ? "02" : "01"}</span>
          <i />
          {dark ? "TOOLS & SKILLS" : "PROJECTS"}
        </div>
        <button className="outline-cta" onClick={onExplore}>
          {dark ? "MORE TOOLS" : "MORE PROJECTS"}
          <Arrow />
        </button>
      </div>
    </foreignObject>
  );
}

function Header({
  mobile,
  active,
  go,
  open,
}: {
  mobile: boolean;
  active: number;
  go: (page: number) => void;
  open: (detail: Detail) => void;
}) {
  return (
    <foreignObject
      x="0"
      y="0"
      width={mobile ? 390 : 1000}
      height={mobile ? 110 : 78}
    >
      <header className="header">
        <button
          className="identity"
          onClick={() => go(0)}
          aria-label="Alex Park — Projects"
        >
          <svg className="monogram" viewBox="0 0 40 32" aria-hidden="true">
            <path
              d="M2 29 14 4h6L8 29m3-9h11m-2 9V4h8c12 0 12 15 0 15h-8"
              stroke="currentColor"
              fill="none"
              strokeWidth="3.2"
            />
          </svg>
          <span>
            <strong>{identity.name}</strong>
            <small>{identity.role}</small>
          </span>
        </button>
        <nav aria-label="Main navigation">
          <button
            aria-current={active === 0 ? "page" : undefined}
            onClick={() => go(0)}
          >
            PROJECTS
          </button>
          <button
            aria-current={active === 1 ? "page" : undefined}
            onClick={() => go(1)}
          >
            TOOLS
          </button>
          <button
            onClick={() =>
              open({
                title: "About",
                category: "Portfolio",
                description:
                  "An introduction to the developer, their approach, and their interests. This placeholder is ready for your biography.",
              })
            }
          >
            ABOUT
          </button>
          <button
            onClick={() =>
              open({
                title: "Contact",
                category: "Let’s talk",
                description:
                  "Your preferred contact details and social links will live here. Replace the placeholder email when you are ready.",
              })
            }
          >
            CONTACT
          </button>
        </nav>
      </header>
    </foreignObject>
  );
}

function Index({ go, dark = false, mobile = false }: {
  go: (page: number) => void; dark?: boolean; mobile?: boolean;
}) {
  return (
    <foreignObject x={dark ? (mobile ? 230 : 849) : 45}
      y={dark ? (mobile ? 122 : 69) : 700} width={dark ? 145 : 225} height="122">
      <nav className="section-index" aria-label="Section navigation">
        <button className={!dark ? "selected" : undefined} aria-current={!dark ? "page" : undefined} onClick={() => go(0)}>
          <span>01</span>PROJECTS
        </button>
        <button className={dark ? "selected" : undefined} aria-current={dark ? "page" : undefined} onClick={() => go(1)}>
          <span>02</span>TOOLS & SKILLS
        </button>
        <span className="index-note">
          <span>03</span>ABOUT
        </span>
        <span className="index-note">
          <span>04</span>CONTACT
        </span>
      </nav>
    </foreignObject>
  );
}

function Catalog({ dark = false, open }: { dark?: boolean; open: (detail: Detail) => void }) {
  const items = dark ? skills : projects;
  return (
    <section id={dark ? "tools-grid" : "projects-grid"}
      className={`screen catalog ${dark ? "skills" : "projects"}`}
      aria-labelledby={dark ? "tools-grid-title" : "projects-grid-title"}>
      <div className="catalog-stage">
        <header className="catalog-header">
          <div>
            <div className="section-label"><span>{dark ? "04" : "03"}</span><i />{dark ? "SKILLS & TOOLS" : "PROJECTS"}</div>
            <h2 id={dark ? "tools-grid-title" : "projects-grid-title"}>{dark ? "All skills & tools" : "All projects"}</h2>
          </div>
          <span className="catalog-count">{String(items.length).padStart(2, "0")} {dark ? "TOOLS & SKILLS" : "PROJECTS"}</span>
        </header>
        <div className="catalog-scroll" tabIndex={0} role="region" aria-label={dark ? "Skills and tools grid" : "Project grid"}>
          <div className="catalog-grid">
            {items.map((item) => (
              <button className="catalog-card" key={item.id}
                onClick={() => open({ title: item.title, description: item.description, category: dark ? "Tool & skill" : "Project" })}>
                <span className="catalog-media" aria-hidden="true">
                  {item.previewMedia ? <img src={item.previewMedia.src} alt="" />
                    : dark ? <SkillIcon kind={item.mark} /> : <Thumbnail kind={item.mark} cover />}
                </span>
                <span className="catalog-copy"><strong>{item.title}</strong><span>{item.description}</span></span>
                <Arrow />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Catalogs can overflow on small screens. Read their content before moving
// to the neighboring full-screen page when a gesture reaches an edge.
function canScroll(element: HTMLElement | null, delta: number) {
  return !!element && (delta > 0
    ? element.scrollTop < element.scrollHeight - element.clientHeight - 1
    : element.scrollTop > 1);
}

export default function App() {
  const scroller = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const activePage = useRef(0);
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  const mobile = viewport.width <= 700;
  // A deliberate minimum art height keeps unusually short phone views readable.
  const mobileHeight = Math.max(660, (viewport.height / viewport.width) * 390);
  const projectItems = mobile ? mobileProjects(mobileHeight) : projects;
  const skillItems = mobile ? mobileSkills(mobileHeight) : skills;
  const [detail, setDetail] = useState<Detail | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const dismissPreview = (id: string) => setPreview((current) => current?.id === id ? null : current);
  const locked = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const swipe = useRef<{ y: number; x: number; page: number; scrollTop: number; scrollMax: number } | null>(null);
  const go = useCallback((page: number) => {
    setPreview(null);
    const element = scroller.current;
    if (!element) return;
    const target = Math.max(0, Math.min(3, page));
    locked.current = true;
    clearTimeout(unlockTimer.current);
    element.scrollTo({
      top: target * element.clientHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    unlockTimer.current = setTimeout(() => {
      locked.current = false;
    }, 750);
  }, []);
  const open = (content: Detail) => { setPreview(null); setDetail(content); };

  useEffect(() => {
    if (detail) dialog.current?.showModal();
  }, [detail]);
  useEffect(() => {
    const element = scroller.current!;
    let accumulated = 0,
      lastWheel = 0;
    const wheel = (event: WheelEvent) => {
      if (
        dialog.current?.open ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        event.ctrlKey
      )
        return;
      const catalog = (event.target as Element).closest<HTMLElement>(".catalog-scroll");
      if (canScroll(catalog, event.deltaY)) return;
      event.preventDefault();
      if (locked.current) return;
      if (
        event.timeStamp - lastWheel > 180 ||
        Math.sign(event.deltaY) !== Math.sign(accumulated)
      )
        accumulated = 0;
      lastWheel = event.timeStamp;
      accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(accumulated) < 18) return;
      go(
        Math.round(element.scrollTop / element.clientHeight) +
          (accumulated > 0 ? 1 : -1),
      );
      accumulated = 0;
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
      if (
        dialog.current?.open ||
        (event.target instanceof HTMLElement &&
          event.target.matches("input,textarea,select"))
      )
        return;
      const current = Math.round(element.scrollTop / element.clientHeight);
      const pages: Record<string, number> = {
        ArrowDown: current + 1,
        PageDown: current + 1,
        ArrowUp: current - 1,
        PageUp: current - 1,
        Home: 0,
        End: 3,
      };
      if (event.key === " " && event.target === document.body)
        pages[" "] = event.shiftKey ? current - 1 : current + 1;
      if (event.key in pages) {
        event.preventDefault();
        if (!locked.current) go(pages[event.key]!);
      }
    };
    const resize = () => {
      setPreview(null);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      element.scrollTo({
        top: activePage.current * element.clientHeight,
        behavior: "instant",
      });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    const outsidePreview = (event: globalThis.PointerEvent) => {
      if (!(event.target as Element).closest(".node-image,.node-action")) setPreview(null);
    };
    window.addEventListener("pointerdown", outsidePreview);
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      element.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerdown", outsidePreview);
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      clearTimeout(unlockTimer.current);
    };
  }, [go]);

  return (
    <>
      <a className="skip-link" href="#projects-title" onClick={() => go(0)}>
        Skip to projects
      </a>
      <main
        ref={scroller}
        className="viewport-scroller"
        tabIndex={-1}
        onScroll={(event) => {
          setPreview(null);
          const page = Math.round(
            event.currentTarget.scrollTop / event.currentTarget.clientHeight,
          );
          activePage.current = page;
          setActive(page);
        }}
        onTouchStart={(event) => {
          const t = event.touches[0]!;
          const catalog = (event.target as Element).closest<HTMLElement>(".catalog-scroll");
          swipe.current = { x: t.clientX, y: t.clientY, page: active,
            scrollTop: catalog?.scrollTop ?? 0,
            scrollMax: catalog ? catalog.scrollHeight - catalog.clientHeight : 0 };
        }}
        onTouchEnd={(event) => {
          const start = swipe.current,
            t = event.changedTouches[0];
          if (
            start &&
            t &&
            Math.abs(start.y - t.clientY) > 35 &&
            Math.abs(start.y - t.clientY) > Math.abs(start.x - t.clientX)
          )
            if (start.y > t.clientY ? start.scrollTop >= start.scrollMax - 1 : start.scrollTop <= 1)
              go(start.page + (start.y > t.clientY ? 1 : -1));
          swipe.current = null;
        }}
      >
        {[false, true].map((dark) => (
          <section
            className={`screen ${dark ? "skills" : "projects"}`}
            id={dark ? "tools" : "projects"}
            aria-label={dark ? "Tools and skills" : "Projects"}
            key={String(dark)}
          >
            <div className={`art-stage ${mobile ? "mobile" : ""}`}>
              <svg
                className="composition"
                viewBox={mobile ? `0 0 390 ${mobileHeight}` : "0 0 1000 870"}
                xmlns="http://www.w3.org/2000/svg"
                aria-label={
                  dark
                    ? "A root network connecting tools and skills"
                    : "A technical tree connecting five projects"
                }
              >
                {dark && (
                  <defs>
                    <clipPath id="root-label-clearance">
                      <path
                        clipRule="evenodd"
                        d={
                          `M0 0H${mobile ? 390 : 1000}V${mobile ? mobileHeight : 870}H0Z ` +
                          skillItems
                            .map((item) => {
                              const p = mobile ? item.mobile : item.desktop;
                              return `M${p.label.x - 4} ${p.label.y - 3}h${p.width + 8}v${mobile ? 51 : 84}h-${p.width + 8}Z`;
                            })
                            .join(" ")
                        }
                      />
                    </clipPath>
                  </defs>
                )}
                {dark ? (
                  <RootsGraphic items={skillItems} mobile={mobile} />
                ) : (
                  <TreeGraphic
                    items={projectItems}
                    mobile={mobile}
                    height={mobileHeight}
                  />
                )}
                {!dark && (
                  <Header mobile={mobile} active={active} go={go} open={open} />
                )}
                <Editorial
                  dark={dark}
                  mobile={mobile}
                  onExplore={() => go(dark ? 3 : 2)}
                />
                {(dark ? skillItems : projectItems).map((item) => (
                  <Node
                    key={item.id}
                    item={item}
                    mobile={mobile}
                    dark={dark}
                    preview={setPreview}
                    dismissPreview={dismissPreview}
                    previewId={preview?.id}
                  />
                ))}
                {(!mobile || dark) && <Index go={go} dark={dark} mobile={mobile} />}
                {(
                  <foreignObject
                    x={(mobile ? MOBILE_TRUNK_X : TRUNK_X) - (mobile ? 23 : 35)}
                    y={dark ? (mobile ? 10 : 22) : mobile ? mobileHeight - 62 : 797}
                    width={mobile ? 150 : 176}
                    height={mobile ? 60 : 70}
                  >
                    <button
                      className={`scroll-control ${dark ? "return-control" : ""}`}
                      onClick={() => go(dark ? 0 : 1)}
                      aria-label={dark ? "Scroll back to projects" : "Scroll to tools and skills"}
                    >
                      <span className="scroll-circle">
                        <Arrow down={!dark} up={dark} />
                      </span>
                      {(!mobile || mobileHeight >= 844) && (
                        <span className="scroll-caption">
                          {dark ? "BACK" : "SCROLL"}
                          <br />
                          {dark ? "TO PROJECTS" : "TO EXPLORE"}
                        </span>
                      )}
                    </button>
                  </foreignObject>
                )}
              </svg>
            </div>
          </section>
        ))}
        <Catalog open={open} />
        <Catalog dark open={open} />
      </main>
      {preview && <PreviewPanel preview={preview} />}
      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-labelledby="detail-title"
        onClose={() => setDetail(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {detail && (
          <div className="dialog-content">
            <button
              className="close-dialog"
              onClick={() => dialog.current?.close()}
              aria-label="Close details"
            >
              ×
            </button>
            <span className="section-label">{detail.category}</span>
            <h2 id="detail-title">{detail.title}</h2>
            <p>{detail.description}</p>
            <div className="placeholder-note">
              PLACEHOLDER CONTENT — READY TO PERSONALIZE
            </div>
            {detail.title === "Contact" && (
              <a className="contact-link" href={`mailto:${identity.email}`}>
                {identity.email} ↗
              </a>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
