import { useEffect, useState } from "react";
import type { Item } from "./data";
import { rootTraces, treeTraces, tracePath } from "./branchGeometry";
import type { Trace } from "./branchGeometry";
import treeOutline from "./artwork/tree-network.svg?url";
import rootOutline from "./artwork/root-network.svg?url";
export { TRUNK_X, MOBILE_TRUNK_X } from "./branchGeometry";

function ReferenceNetwork({ items, dark }: { items: Item[]; dark: boolean }) {
  const prefix = dark ? "roots" : "tree";
  const outlineUrl = dark ? rootOutline : treeOutline;
  const [outline, setOutline] = useState("");
  useEffect(() => {
    let active = true;
    fetch(outlineUrl).then((response) => response.text()).then((source) => {
      if (active) setOutline(source.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")
        .replace('<path data-network-branch=', `<path id="${prefix}-reference-base" data-network-branch=`));
    });
    return () => { active = false; };
  }, [outlineUrl, prefix]);
  if (!outline) return null;
  // Projects reach the intermediate ring; roots retain the outer-ring contact.
  const holes = items.map(({ desktop: node }) => {
    const r = node.r + (dark ? 9 : 0);
    return `M${node.x-r} ${node.y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`;
  }).join("");
  return <g fill="currentColor" strokeLinecap="round" strokeLinejoin="round" data-reference-network={prefix}>
    <defs>
      <clipPath id={`${prefix}-outside-rings`} clipPathUnits="userSpaceOnUse">
        <path clipRule="evenodd" d={`M0 0H1000V870H0Z${holes}`} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${prefix}-outside-rings)`}
      dangerouslySetInnerHTML={{ __html: outline }} />
  </g>;
}

function Network({ traces, prefix }: { traces: Trace[]; prefix: string }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {traces.map((trace) => (
        <path
          key={trace.id}
          id={`${prefix}-${trace.id}`}
          className={trace.id === "trunk" ? "main-trunk" : undefined}
          data-structural={trace.id}
          data-parent={
            trace.parent ? `${prefix}-${trace.parent.id}` : undefined
          }
          data-branch={
            prefix === "tree" && !trace.secondary ? trace.nodeId : undefined
          }
          data-root={
            prefix === "roots" && !trace.secondary ? trace.nodeId : undefined
          }
          data-secondary={trace.secondary ? "true" : undefined}
          d={tracePath(trace)}
          strokeWidth={trace.width}
          opacity={trace.opacity}
        />
      ))}
      {traces
        .filter((trace) => trace.secondary)
        .map((trace) => {
          const from = trace.segments[0]!.from,
            to = trace.segments.at(-1)!.to;
          return (
            <g
              key={`${trace.id}-marks`}
              fill="currentColor"
              stroke="none"
              opacity={trace.opacity * 0.8}
            >
              <circle cx={from.x} cy={from.y} r="1.3" />
              <circle cx={to.x} cy={to.y} r={trace.width > 1 ? 2 : 1.7} />
            </g>
          );
        })}
    </g>
  );
}

export function TreeGraphic({
  items,
  mobile,
  height = 844,
}: {
  items: Item[];
  mobile: boolean;
  height?: number;
}) {
  return (
    <g className="tree-art" aria-hidden="true">
      {mobile ? <Network traces={treeTraces(items, true, height)} prefix="tree" />
        : <ReferenceNetwork items={items} dark={false} />}
    </g>
  );
}

export function RootsGraphic({
  items,
  mobile,
}: {
  items: Item[];
  mobile: boolean;
}) {
  return (
    <g className="root-art" aria-hidden="true">
      {mobile ? <Network traces={rootTraces(items, true)} prefix="roots" />
        : <ReferenceNetwork items={items} dark />}
    </g>
  );
}

export function Thumbnail({ kind, cover = false }: { kind: string; cover?: boolean }) {
  if (kind === "shader")
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} aria-hidden="true">
        <defs>
          <radialGradient id="purple">
            <stop stopColor="#9780e9" />
            <stop offset=".45" stopColor="#422592" />
            <stop offset="1" stopColor="#0e1233" />
          </radialGradient>
          <linearGradient id="ribbon">
            <stop stopColor="#37c6ff" />
            <stop offset=".5" stopColor="#9c51d4" />
            <stop offset="1" stopColor="#241448" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#purple)" />
        <path
          d="M-10 23Q65 84 111 17M-8 91Q50 22 112 82"
          fill="none"
          stroke="url(#ribbon)"
          strokeWidth="16"
        />
        <path
          d="M0 49Q45 61 100 43M12 0Q77 52 43 100"
          fill="none"
          stroke="#b091ec"
          strokeWidth=".6"
        />
        {Array.from({ length: 18 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${39 + i * 0.6}Q52 ${72 - i} 100 ${28 + i * 1.5}`}
            stroke="#70b7f8"
            strokeWidth=".25"
            fill="none"
            opacity=".7"
          />
        ))}
        <circle cx="28" cy="49" r="2" fill="#97e8ff" />
      </svg>
    );
  if (kind === "grid")
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} aria-hidden="true">
        <defs>
          <radialGradient id="gridBg">
            <stop stopColor="#172b3f" />
            <stop offset="1" stopColor="#080f1a" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#gridBg)" />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} stroke="#36516c" strokeWidth=".45" opacity=".65">
            <path d={`M${i * 14 - 8} 0V100M0 ${i * 14 - 8}H100`} />
            <path d={`M${i * 15 - 34} 0 100 ${i * 13 + 12}`} opacity=".45" />
          </g>
        ))}
        <path
          d="M19 64V29L60 20 85 38V71L44 87Z M19 29 44 45 85 38M44 45V87M60 20V58L19 64M60 58 85 71"
          fill="none"
          stroke="#7b9cb9"
          strokeWidth=".5"
        />
        <circle cx="44" cy="45" r="2" fill="#7babbf" />
        <path
          d="M6 75 37 55 51 62 86 28"
          fill="none"
          stroke="#84b0c5"
          strokeWidth=".6"
        />
      </svg>
    );
  if (kind === "landscape")
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} aria-hidden="true">
        <defs>
          <linearGradient id="sky" x2="0" y2="1">
            <stop stopColor="#8bb4cf" />
            <stop offset="1" stopColor="#dde3df" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#sky)" />
        <path
          d="M0 47 15 40 27 48 42 36 61 48 76 39 100 48V100H0"
          fill="#6b7e7c"
        />
        <path d="M0 59 34 54 65 61 100 50V100H0" fill="#778969" />
        <path d="M0 76 34 66 67 72 100 61V100H0" fill="#465b4e" />
        <path d="M35 100 42 70 55 59 62 59 51 76 64 100" fill="#b5b5a5" />
        <g fill="#676b63" stroke="#aeb8b4" strokeWidth=".5">
          <path d="M27 59V37H35V32H39V61M40 59V46H55V60M53 63V37H61V34H65V63M67 61V49H77V63" />
        </g>
        <g fill="#c1c1ad">
          {Array.from({ length: 10 }, (_, i) => (
            <rect
              key={i}
              x={29 + (i % 5) * 7}
              y={42 + Math.floor(i / 5) * 8}
              width="2"
              height="3"
            />
          ))}
        </g>
        <path
          d="M0 63 19 72 34 74M67 82 84 76 100 80"
          fill="none"
          stroke="#959a78"
          strokeWidth="2"
        />
      </svg>
    );
  const room = kind === "room";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} aria-hidden="true">
      <defs>
        <linearGradient id={`wall-${kind}`}>
          <stop stopColor="#171d20" />
          <stop offset=".52" stopColor="#777b75" />
          <stop offset="1" stopColor="#20282b" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#wall-${kind})`} />
      <path d="M0 0 37 26H66L100 0M0 100 37 66H66L100 100" fill="#252b2c" />
      <path
        d="M37 26V66H66V26ZM0 0 37 26M0 100 37 66M100 0 66 26M100 100 66 66"
        fill="none"
        stroke="#93958b"
        strokeWidth=".7"
      />
      <path d="M40 28H62V62H40Z" fill="#151d21" />
      <path d="M47 34H58V56H47Z" fill={room ? "#c4d4d6" : "#a7c3ca"} />
      <g stroke="#bec1b4" strokeWidth=".7" fill="#3f4646">
        <path d="M8 16 22 23V66L8 79ZM77 22 93 12V80L77 66Z" />
        <path d="M26 27 32 30V61L26 66" />
      </g>
      <path d="M38 75 60 70 74 80 58 93 32 86Z" fill="#555b59" />
      {room ? (
        <>
          <path d="M8 67 36 64 43 80 16 91Z" fill="#191f23" />
          <path d="M71 53H91V67H71ZM69 69 88 74 87 89 72 79Z" fill="#9b9e90" />
          <path d="M77 23H89V50H77Z" fill="#c6cabc" />
        </>
      ) : (
        <>
          <circle cx="50" cy="48" r="5" stroke="#eff6ef" fill="none" />
          <circle cx="50" cy="48" r="2" fill="#e8f7f6" />
          <path d="M37 73 48 66 62 69 60 78 43 79Z" fill="#a0a8a5" />
        </>
      )}
      <g stroke="#787c76" strokeWidth=".35">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${20 + i * 13} 100 50 64M${30 + i * 14} 0 52 26`}
          />
        ))}
      </g>
    </svg>
  );
}

export function SkillIcon({ kind }: { kind: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="skill-icon"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    >
      {kind === "unity" && (
        <path
          d="m30 6 7 19-6 17-4-12-15 2-6-10 13-12-1 11 9-2ZM12 32l8-11 10 9M27 19l10 6"
          strokeWidth="3.7"
        />
      )}
      {kind === "unreal" && (
        <>
          <circle cx="24" cy="24" r="18" strokeWidth="1" />
          <text
            x="24"
            y="35"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            fontFamily="Georgia,serif"
            fontSize="33"
            fontWeight="bold"
          >
            𝔘
          </text>
        </>
      )}
      {(kind === "csharp" || kind === "cpp") && (
        <>
          <path
            d="M24 3 43 14V35L24 46 5 35V14Z"
            fill={kind === "cpp" ? "#559fc9" : "currentColor"}
            stroke="none"
          />
          <path
            d="m24 9 14 8v15l-14 9-14-9V17Z"
            fill={kind === "cpp" ? "#19649d" : "#28313a"}
            stroke="none"
          />
          <text
            x="22"
            y="34"
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="#f1f6fa"
            stroke="none"
          >
            C
          </text>
          <text
            x="36"
            y="27"
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#f1f6fa"
            stroke="none"
          >
            {kind === "cpp" ? "+" : "#"}
          </text>
        </>
      )}
      {kind === "glsl" && <path d="M7 13H41L24 37ZM13 17H35" />}
      {kind === "hlsl" && (
        <path
          d="M12 14 23 12v11H12ZM25 12 38 10v13H25ZM12 25h11v11l-11-2ZM25 25h13v13l-13-2Z"
          fill="currentColor"
          stroke="none"
        />
      )}
      {kind === "git" && (
        <>
          <rect
            x="9"
            y="9"
            width="30"
            height="30"
            rx="2"
            transform="rotate(45 24 24)"
            fill="#ed593d"
            stroke="none"
          />
          <path d="m17 10 15 15M22 15v19" stroke="#20282e" strokeWidth="3" />
          <circle cx="22" cy="16" r="3" fill="#20282e" stroke="none" />
          <circle cx="32" cy="25" r="3" fill="#20282e" stroke="none" />
          <circle cx="22" cy="34" r="3" fill="#20282e" stroke="none" />
        </>
      )}
      {kind === "webgl" && (
        <>
          <ellipse cx="24" cy="24" rx="21" ry="13" strokeWidth="1" />
          <text
            x="24"
            y="29"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="currentColor"
            stroke="none"
          >
            WebGL
          </text>
        </>
      )}
      {kind === "tools" && (
        <>
          <path d="m12 8 2 7 7 3 6-6-3-7c9 0 13 8 8 14L13 39a3 3 0 0 1-4-4L27 17M10 7l28 30-3 3L7 10Z" />
          <circle cx="12" cy="36" r="1" />
        </>
      )}
      {kind === "workflow" && (
        <>
          <path d="m7 17 17-9 17 9-17 9Z" fill="currentColor" stroke="none" />
          <path d="m7 25 17 9 17-9M7 33l17 9 17-9" strokeWidth="3" />
        </>
      )}
      {kind === "experiments" && (
        <>
          <path d="M18 6h12M20 6v14L10 36q-2 5 4 5h20q6 0 4-5L28 20V6M16 30h16" />
          <path d="m15 33-3 5h24l-3-5" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}
