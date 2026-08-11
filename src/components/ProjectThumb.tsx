/**
 * Placeholder thumbnail for projects with no image yet.
 *
 * Draws concentric strokes echoing the logo's line construction, varied
 * deterministically by slug so each project reads as distinct while the set
 * still looks like one family. Replace by setting `image` on the project.
 */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function ProjectThumb({ slug }: { slug: string }) {
  const h = hash(slug);
  const gradientId = `thumb-${slug}`;
  const arcCount = 3 + (h % 3);
  const originX = 18 + (h % 5) * 12;
  const rotation = -20 + (h % 7) * 10;
  const baseRadius = 26 + (h % 4) * 7;

  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label=""
      aria-hidden="true"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#EC7186" />
          <stop offset="100%" stopColor="#F5A26B" />
        </linearGradient>
      </defs>

      <g
        transform={`translate(${originX} 200) rotate(${rotation})`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
      >
        {Array.from({ length: arcCount }).map((_, i) => {
          const r = baseRadius + i * 26;
          return (
            <path
              key={i}
              d={`M 0 ${-r} A ${r} ${r} 0 0 1 ${r} 0`}
              strokeWidth={5}
              opacity={0.85 - i * 0.13}
            />
          );
        })}
      </g>

      <g
        transform={`translate(300 24) rotate(${rotation + 180})`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        opacity="0.35"
      >
        <path
          d={`M 0 ${-baseRadius} A ${baseRadius} ${baseRadius} 0 0 1 ${baseRadius} 0`}
          strokeWidth={5}
        />
      </g>
    </svg>
  );
}
