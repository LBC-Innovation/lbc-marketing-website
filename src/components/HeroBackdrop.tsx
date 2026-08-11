/**
 * Hero backdrop, in three layers back to front:
 *
 *   1. Aurora   — blurred coral/rose fields, drifting on a long loop
 *   2. Arc field — the logo's concentric-stroke construction at hero scale
 *   3. Grain     — fine noise that breaks up gradient banding
 *
 * All of it is generated: no image requests, so the hero never becomes the
 * LCP element, and every color resolves from the theme variables.
 */

// Radii of each arc group, with how many parallel strokes it carries. Groups
// of two and three alternate the way the strokes do in the mark itself.
const ARC_GROUPS = [
  { radius: 150, strokes: 3 },
  { radius: 262, strokes: 2 },
  { radius: 352, strokes: 3 },
  { radius: 470, strokes: 2 },
  { radius: 582, strokes: 3 },
  { radius: 700, strokes: 2 },
  { radius: 828, strokes: 3 },
];

const STROKE_GAP = 16;
const CX = 1180;
const CY = 350;

function arcPath(radius: number): string {
  // Top to bottom, counterclockwise, so the curve bulges left into the page.
  return `M ${CX} ${CY - radius} A ${radius} ${radius} 0 0 0 ${CX} ${CY + radius}`;
}

export function HeroBackdrop() {
  const arcs = ARC_GROUPS.flatMap(({ radius, strokes }, groupIndex) =>
    Array.from({ length: strokes }, (_, strokeIndex) => ({
      key: `${groupIndex}-${strokeIndex}`,
      d: arcPath(radius + strokeIndex * STROKE_GAP),
      // Outer groups sit back slightly so the field reads as receding.
      opacity: 1 - groupIndex * 0.09 - strokeIndex * 0.12,
    })),
  );

  return (
    <div
      aria-hidden="true"
      className="hero-backdrop pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="hero-drift-a absolute -top-[28rem] left-1/2 h-[46rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,162,107,0.28),rgba(236,113,134,0.16),transparent)] blur-3xl dark:opacity-70" />
      <div className="hero-drift-b absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(236,113,134,0.20),transparent)] blur-3xl" />

      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMaxYMid slice"
        className="hero-arcs absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="hero-arc-stroke" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A26B" />
            <stop offset="100%" stopColor="#EC7186" />
          </linearGradient>

          {/* Fades the field out before it reaches the text column. */}
          <linearGradient id="hero-arc-fade" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="hero-arc-mask">
            <rect width="1200" height="700" fill="url(#hero-arc-fade)" />
          </mask>
        </defs>

        <g
          mask="url(#hero-arc-mask)"
          fill="none"
          stroke="url(#hero-arc-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          {arcs.map((arc) => (
            <path key={arc.key} d={arc.d} opacity={arc.opacity} />
          ))}
        </g>
      </svg>

      <div className="hero-grain absolute inset-0" />
    </div>
  );
}
