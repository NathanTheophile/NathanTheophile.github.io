import type { Item, Placement, Point } from "./data";

export const TRUNK_X = 505;
export const MOBILE_TRUNK_X = 197;
type Curve = { from: Point; c1: Point; c2: Point; stem?: string };
type RootRoute = { stem: string; c1: Point; c2: Point };

export function edge(node: Placement, incoming: Point): Point {
  const dx = incoming.x - node.x,
    dy = incoming.y - node.y;
  const length = Math.hypot(dx, dy);
  return {
    x: node.x + (dx / length) * node.r,
    y: node.y + (dy / length) * node.r,
  };
}
export function curvePath(curve: Curve, node: Placement) {
  const to = edge(node, curve.c2);
  return `${curve.stem ?? `M${curve.from.x},${curve.from.y}`} C${curve.c1.x},${curve.c1.y} ${curve.c2.x},${curve.c2.y} ${to.x},${to.y}`;
}

const branches: Record<string, Curve> = {
  recent: {
    from: { x: 526, y: 382 },
    c1: { x: 595, y: 279 },
    c2: { x: 514, y: 274 },
  },
  prototype: {
    from: { x: 526, y: 403 },
    c1: { x: 526, y: 281 },
    c2: { x: 433, y: 325 },
  },
  gameplay: {
    from: { x: 508, y: 575 },
    stem: "M508 575C522 551 550 540 571 515C579 503 574 489 574 471C574 449 628 430 646 408C659 391 658 363 658 347",
    c1: { x: 658, y: 328 },
    c2: { x: 677, y: 321 },
  },
  shader: {
    from: { x: 505, y: 669 },
    c1: { x: 501, y: 528 },
    c2: { x: 335, y: 562 },
  },
  featured: {
    from: { x: 505, y: 699 },
    c1: { x: 531, y: 653 },
    c2: { x: 627, y: 566 },
  },
};

export function TreeGraphic({
  items,
  mobile,
  height = 844,
}: {
  items: Item[];
  mobile: boolean;
  height?: number;
}) {
  const x = mobile ? MOBILE_TRUNK_X : TRUNK_X;
  return (
    <g className="tree-art" aria-hidden="true">
      {!mobile && <Construction dark={false} />}
      <g
        className="secondary-branches"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      >
        {!mobile && (
          <>
            <path d="M510 870V688C510 650 574 641 585 626L614 602H661L687 578" />
            <path d="M488 870V719L473 697V656M498 805V669L495 615M519 803V732L536 712V667" />
            <path d="M546 531V493L593 482H628L646 462M574 482L579 456M628 482L643 477" />
            <path d="M571 493C571 455 649 427 658 389V345L681 316M615 433H644L659 419M658 396L688 388 709 369 722 369 740 346" />
            <path
              d="M450 606L415 596 401 581M471 626L450 603 418 601 403 580"
              strokeWidth="2.2"
            />
            <path d="M407 569V538L389 513 386 489 355 460 348 451M407 538L431 511 450 496M431 511V493L447 483" />
            <path d="M526 403L508 374V354M508 374L490 358 482 340M526 369V336L505 319M553 321L570 308V281L590 271 604 270M570 281L588 251" />
            <path d="M458 318L417 311 401 301M442 311L431 300M375 556H353L340 546 329 538M585 626L580 610 573 603M516 740V711L536 684" />
          </>
        )}
        {mobile && height >= 780 && (
          <path
            d={`M${x - 4} ${height}V679L177 657V560M${x + 5} ${height}V601L218 578V537M${x - 4} 511L174 489V470M${x + 4} 408L218 386V370`}
          />
        )}
      </g>
      <path
        className="main-trunk"
        d={
          mobile
            ? `M${x} ${height}V292`
            : "M505 870V669C505 625 506 602 508 575C512 554 551 535 553 503V460C553 435 539 430 526 412V382"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth={mobile ? 2.6 : 3.3}
      />
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {items.map((item) => {
          const node = mobile ? item.mobile : item.desktop;
          const branch = mobile
            ? {
                from: { x, y: Math.min(node.y + 95, height - 8) },
                c1: { x, y: node.y + 36 },
                c2: {
                  x: node.x < x ? node.x + 60 : node.x - 60,
                  y: node.y + 36,
                },
              }
            : branches[item.id]!;
          return (
            <path
              key={item.id}
              data-branch={item.id}
              d={curvePath(branch, node)}
              strokeWidth={mobile ? 1.4 : 1.9}
            />
          );
        })}
      </g>
      {!mobile && (
        <g fill="currentColor">
          {[
            [505, 658],
            [473, 714],
            [508, 674],
            [579, 574],
            [628, 480],
            [646, 462],
            [591, 361],
            [608, 251],
            [450, 496],
            [389, 513],
            [349, 451],
            [681, 316],
            [661, 602],
            [536, 712],
            [483, 429],
            [406, 618],
            [329, 534],
            [456, 234],
            [350, 452],
            [430, 496],
            [545, 581],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 4 === 0 ? 2.8 : 1.6}
              opacity={i % 3 === 0 ? 1 : 0.65}
            />
          ))}
        </g>
      )}
    </g>
  );
}

const rootRoutes: Record<string, RootRoute> = {
  unity: {
    stem: "M492 0V133C492 173 461 182 433 218C405 249 404 267 399 287C392 325 320 315 285 333C260 346 271 379 229 383L189 383",
    c1: { x: 145, y: 383 },
    c2: { x: 110, y: 401 },
  },
  unreal: {
    stem: "M501 0V194C501 230 487 257 462 283C441 304 453 336 430 356C412 373 385 372 376 388",
    c1: { x: 363, y: 398 },
    c2: { x: 355, y: 395 },
  },
  glsl: {
    stem: "M516 0V124C516 173 536 183 555 199C598 233 621 248 638 276C655 296 681 301 696 319",
    c1: { x: 714, y: 332 },
    c2: { x: 704, y: 336 },
  },
  csharp: {
    stem: "M495 0V165C495 192 409 221 415 267V310C415 351 378 374 348 392C330 407 330 430 330 469V497C330 536 250 539 229 548",
    c1: { x: 190, y: 560 },
    c2: { x: 123, y: 535 },
  },
  cpp: {
    stem: "M506 0V264C506 305 564 340 580 370V440C580 477 507 493 482 511C459 529 460 550 438 550",
    c1: { x: 414, y: 550 },
    c2: { x: 405, y: 581 },
  },
  hlsl: {
    stem: "M511 0V206C511 260 552 286 575 324C591 349 589 380 590 414V445C590 475 618 491 643 496",
    c1: { x: 657, y: 497 },
    c2: { x: 655, y: 504 },
  },
  git: {
    stem: "M519 0V181C526 214 570 241 597 270C639 320 661 338 693 335C714 336 742 333 746 348V453C746 475 803 466 824 489C852 509 873 510 873 541V564",
    c1: { x: 873, y: 576 },
    c2: { x: 842, y: 575 },
  },
  webgl: {
    stem: "M496 0V244C496 294 449 313 450 351C451 377 390 381 390 407V490C390 514 335 512 335 545C335 585 313 610 282 644C266 666 239 665 218 678",
    c1: { x: 198, y: 689 },
    c2: { x: 170, y: 688 },
  },
  tools: {
    stem: "M508 0V279C508 320 563 344 603 382V457C603 488 613 509 613 540V576C613 616 566 654 534 681C508 704 454 691 435 704",
    c1: { x: 416, y: 718 },
    c2: { x: 400, y: 717 },
  },
  workflow: {
    stem: "M511 0V292C511 340 558 359 568 394C579 434 607 451 608 505V582C609 612 585 627 591 649",
    c1: { x: 593, y: 667 },
    c2: { x: 616, y: 671 },
  },
  experiments: {
    stem: "M516 0V291C516 348 560 350 580 388C600 426 634 433 653 462C676 485 694 491 694 514V578C694 606 742 613 795 625C838 640 859 665 859 700",
    c1: { x: 859, y: 734 },
    c2: { x: 841, y: 736 },
  },
};

export function RootsGraphic({
  items,
  mobile,
}: {
  items: Item[];
  mobile: boolean;
}) {
  const x = mobile ? MOBILE_TRUNK_X : TRUNK_X;
  return (
    <g className="root-art" aria-hidden="true">
      {!mobile && (
        <g clipPath="url(#root-label-clearance)">
          <Construction dark />
        </g>
      )}
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {[-13, -8, -4, 0, 4, 8, 13].map((offset, i) => (
          <path
            key={offset}
            className="root-bundle"
            opacity={i % 2 ? 0.45 : 0.9}
            strokeWidth={i === 3 ? 1.8 : 0.8}
            d={`M${x + offset} 0V${mobile ? 225 : 105 + i * 14} Q${x + offset} ${mobile ? 246 : 150 + i * 12} ${x + offset * 2} ${mobile ? 263 : 182 + i * 15}`}
          />
        ))}
        {items.map((item, i) => {
          const node = mobile ? item.mobile : item.desktop;
          const route: RootRoute = mobile
            ? {
                stem: `M${x + ((i % 3) - 1) * 5} 248V${node.y - node.r - 12}`,
                c1: { x, y: node.y - node.r },
                c2: { x: node.x, y: node.y - node.r },
              }
            : rootRoutes[item.id]!;
          const to = edge(node, route.c2);
          const path = `${route.stem}C${route.c1.x} ${route.c1.y} ${route.c2.x} ${route.c2.y} ${to.x} ${to.y}`;
          return (
            <g key={item.id}>
              <path
                data-root={item.id}
                d={path}
                strokeWidth={mobile ? 0.85 : 1.45}
                opacity={i % 3 === 0 ? 0.88 : 0.72}
              />
            </g>
          );
        })}
        {!mobile && (
          <g
            className="secondary-roots"
            strokeWidth=".65"
            opacity=".42"
            clipPath="url(#root-label-clearance)"
          >
            <path d="M488 0V126L435 178 407 203 400 271 372 319 314 332 275 380M515 0V107L552 147M519 124L575 171Q606 198 606 256V290L645 335 695 349 752 349Q769 349 770 372" />
            <path d="M487 167L459 204V278L432 307 412 344 351 357M500 225V335L481 365V461Q471 497 445 511L410 524 359 525Q333 525 323 554V618L291 656 266 671 221 671" />
            <path d="M510 329L543 368V473L553 526 543 570 543 629 518 662M518 238L564 304 590 359 590 443 613 476 613 554 640 597Q666 622 686 623L741 630Q793 641 798 686L813 715" />
            <path d="M629 301L684 309 712 309Q794 309 794 353L795 392 820 407 902 446M646 472H725Q777 473 788 508L809 559 810 596M529 619L510 668 492 692 447 707 424 731M577 592V687L562 718 550 745 550 800" />
            <path d="M346 405L296 428V502L261 551 256 570M367 657L318 659 277 683 236 686 217 714M522 775L510 799 509 827M658 748L720 769 744 798 780 812M630 694L665 714" />
          </g>
        )}
      </g>
      {!mobile && (
        <g fill="currentColor">
          {[
            [146, 400],
            [368, 272],
            [407, 203],
            [575, 171],
            [540, 375],
            [579, 382],
            [650, 379],
            [740, 309],
            [810, 562],
            [902, 382],
            [164, 540],
            [456, 255],
            [345, 691],
            [510, 335],
            [543, 438],
            [547, 510],
            [626, 474],
            [506, 771],
            [514, 829],
            [449, 746],
            [811, 641],
            [634, 525],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 5 === 0 ? 3 : 1.6}
              opacity={i % 3 === 0 ? 0.9 : 0.5}
            />
          ))}
        </g>
      )}
    </g>
  );
}

function Construction({ dark }: { dark: boolean }) {
  const columns = dark
    ? [44, 163, 289, 431, 482, 530, 578, 628, 675, 739, 796, 848, 909]
    : [327, 349, 431, 482, 526, 553, 590, 650, 742, 794, 888];
  return (
    <g
      className="construction"
      fill="none"
      stroke="currentColor"
      strokeWidth=".65"
      opacity={dark ? 0.15 : 0.18}
    >
      {columns.map((x, i) => (
        <g key={x}>
          <path
            d={`M${x} ${dark ? (x < 350 ? 420 : 40 + (i % 4) * 47) : 220 + (i % 4) * 71}V${dark ? 822 - (i % 3) * 64 : 720 - (i % 4) * 37}`}
            strokeDasharray="2 4"
          />
          {[0, 1, 2, 3, 4].map((j) => (
            <circle
              key={j}
              cx={x}
              cy={
                (dark ? (x < 350 ? 440 : 104) : 254) +
                j * (dark && x < 350 ? 70 : 100) +
                (i % 3) * 25
              }
              r="1.6"
              fill="currentColor"
            />
          ))}
        </g>
      ))}
      {(dark
        ? [104, 153, 257, 400, 486, 598, 714]
        : [278, 323, 438, 467, 555, 615, 670]
      ).map((y, i) => (
        <path
          key={y}
          d={`M${dark ? 350 - (i % 4) * 77 : 289 + (i % 3) * 49} ${y}H${dark ? 738 + (i % 3) * 77 : 812 + (i % 2) * 73}`}
          strokeDasharray="2 4"
        />
      ))}
      {!dark && (
        <>
          <circle cx="480" cy="188" r="94" strokeDasharray="280 310" />
          <circle cx="712" cy="532" r="78" />
          <circle cx="347" cy="698" r="57" />
          <circle cx="436" cy="530" r="65" strokeDasharray="150 270" />
        </>
      )}
      {dark && <circle cx="869" cy="280" r="21" strokeDasharray="2 3" />}
    </g>
  );
}

export function Thumbnail({ kind }: { kind: string }) {
  if (kind === "shader")
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
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
      <svg viewBox="0 0 100 100" aria-hidden="true">
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
      <svg viewBox="0 0 100 100" aria-hidden="true">
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
    <svg viewBox="0 0 100 100" aria-hidden="true">
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
