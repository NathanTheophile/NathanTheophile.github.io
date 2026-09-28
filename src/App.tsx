import { useCallback, useEffect, useRef, useState } from "react";
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

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={down ? "M12 4v16m-7-7 7 7 7-7" : "M4 12h15m-6-6 6 6-6 6"}
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
  open,
}: {
  item: Item;
  mobile: boolean;
  dark?: boolean;
  open: (detail: Detail) => void;
}) {
  const p = mobile ? item.mobile : item.desktop;
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
        <circle cx={p.x} cy={p.y} r={p.r} strokeWidth={dark ? 1.5 : 0.65} />
        <circle
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
            <circle
              cx={p.x}
              cy={p.y - p.r - 2}
              r="2.3"
              fill="currentColor"
              stroke="none"
              opacity=".6"
            />
            <circle
              cx={p.x - p.r - 1}
              cy={p.y}
              r="2.1"
              fill="currentColor"
              stroke="none"
              opacity=".7"
            />
            <path d={`M${p.x} ${p.y + p.r}v${dark ? 13 : 26}`} opacity=".5" />
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
          onClick={() =>
            open({
              title: item.title,
              description: item.description,
              category: dark ? "Tool & skill" : "Project",
            })
          }
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
            onClick={() =>
              open({
                title: item.title,
                description: item.description,
                category: dark ? "Tool & skill" : "Project",
              })
            }
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
      height={mobile ? (dark ? 245 : 184) : dark ? 290 : 310}
    >
      <div className="editorial">
        <div className="section-label">
          <span>{dark ? "02" : "01"}</span>
          <i />
          {dark ? "TOOLS & SKILLS" : "PROJECTS"}
        </div>
        {dark ? (
          <h2>
            Built on
            <br className="desktop-break" /> a Solid System.
          </h2>
        ) : (
          <h1 id="projects-title">
            Ideas
            <br className="desktop-break" /> in Motion.
          </h1>
        )}
        <p>
          {dark ? (
            <>
              Engines, tools, and technical skills
              <br className="desktop-break" /> that power the work above.
              <br className="desktop-break" /> A foundation for creating,
              experimenting,
              <br className="desktop-break" /> and shaping interactive
              experiences.
            </>
          ) : (
            <>
              Real-time graphics, gameplay systems,
              <br className="desktop-break" /> and interactive experiments.
              <br className="desktop-break" /> A selection of recent work
              exploring
              <br className="desktop-break" /> play, tech, and visual systems.
            </>
          )}
        </p>
        <button className="outline-cta" onClick={onExplore}>
          {dark ? "EXPLORE TOOLS" : "EXPLORE PROJECTS"}
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

function Index({ go }: { go: (page: number) => void }) {
  return (
    <foreignObject x="45" y="700" width="225" height="110">
      <nav className="section-index" aria-label="Section navigation">
        <button className="selected" onClick={() => go(0)}>
          <span>01</span>PROJECTS
        </button>
        <button onClick={() => go(1)}>
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
  const locked = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const swipe = useRef<{ y: number; x: number; page: number } | null>(null);
  const go = useCallback((page: number) => {
    const element = scroller.current;
    if (!element) return;
    const target = Math.max(0, Math.min(1, page));
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
  const open = (content: Detail) => setDetail(content);

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
        End: 1,
      };
      if (event.key === " " && event.target === document.body)
        pages[" "] = event.shiftKey ? current - 1 : current + 1;
      if (event.key in pages) {
        event.preventDefault();
        if (!locked.current) go(pages[event.key]!);
      }
    };
    const resize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      element.scrollTo({
        top: activePage.current * element.clientHeight,
        behavior: "instant",
      });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      element.removeEventListener("wheel", wheel);
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
          const page = Math.round(
            event.currentTarget.scrollTop / event.currentTarget.clientHeight,
          );
          activePage.current = page;
          setActive(page);
        }}
        onTouchStart={(event) => {
          const t = event.touches[0]!;
          swipe.current = { x: t.clientX, y: t.clientY, page: active };
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
                  onExplore={() => {
                    const item = (dark ? skillItems : projectItems)[0]!;
                    open({
                      title: item.title,
                      description: item.description,
                      category: dark ? "Tool & skill" : "Project",
                    });
                  }}
                />
                {(dark ? skillItems : projectItems).map((item) => (
                  <Node
                    key={item.id}
                    item={item}
                    mobile={mobile}
                    dark={dark}
                    open={open}
                  />
                ))}
                {!mobile && (
                  <>
                    {!dark && <Index go={go} />}
                    <foreignObject
                      x="849"
                      y={dark ? 69 : 715}
                      width="145"
                      height="122"
                    >
                      <div className="disciplines">
                        {(dark
                          ? [
                              "ENGINES",
                              "PROGRAMMING",
                              "GRAPHICS",
                              "TOOLS",
                              "WORKFLOW",
                              "AND MORE",
                            ]
                          : [
                              "GAMES",
                              "REAL-TIME GRAPHICS",
                              "INTERACTIVE SYSTEMS",
                              "TECHNICAL ART",
                            ]
                        ).map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                        <i />
                      </div>
                    </foreignObject>
                  </>
                )}
                {!dark && (
                  <foreignObject
                    x={(mobile ? MOBILE_TRUNK_X : TRUNK_X) - (mobile ? 23 : 35)}
                    y={mobile ? mobileHeight - 62 : 797}
                    width={mobile ? 150 : 176}
                    height={mobile ? 60 : 70}
                  >
                    <button
                      className="scroll-control"
                      onClick={() => go(1)}
                      aria-label="Scroll to tools and skills"
                    >
                      <span className="scroll-circle">
                        <Arrow down />
                      </span>
                      {(!mobile || mobileHeight >= 844) && (
                        <span className="scroll-caption">
                          SCROLL
                          <br />
                          TO EXPLORE
                        </span>
                      )}
                    </button>
                  </foreignObject>
                )}
                {dark && (
                  <foreignObject
                    x={mobile ? 245 : 849}
                    y={mobile ? mobileHeight - 49 : 826}
                    width={mobile ? 130 : 145}
                    height="44"
                  >
                    <button className="back-control" onClick={() => go(0)}>
                      ↑ BACK TO PROJECTS
                    </button>
                  </foreignObject>
                )}
              </svg>
            </div>
          </section>
        ))}
      </main>
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
