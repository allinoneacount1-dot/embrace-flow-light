import { useMemo } from "react";

/**
 * Generative sigil — deterministic from a seed string.
 * Sacred circle + glyph paths derived from a tiny hash of the seed.
 */
function hashSeed(seed: string): number[] {
  const out: number[] = [];
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
    out.push((h >>> 0) % 1000);
  }
  // ensure enough entropy
  while (out.length < 24) {
    h = Math.imul(h ^ out.length, 16777619);
    out.push((h >>> 0) % 1000);
  }
  return out;
}

export function Sigil({
  seed = "numina-prime",
  size = 480,
  className,
}: {
  seed?: string;
  size?: number;
  className?: string;
}) {
  const points = useMemo(() => {
    const h = hashSeed(seed);
    const n = 7 + (h[0] % 5); // 7–11 vertices
    const r = 140;
    const cx = 250;
    const cy = 250;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const jitter = 0.85 + ((h[i + 1] % 30) / 100);
      return {
        x: cx + Math.cos(a) * r * jitter,
        y: cy + Math.sin(a) * r * jitter,
      };
    });
  }, [seed]);

  const innerPath = useMemo(() => {
    // star-like inner glyph connecting non-adjacent points
    const n = points.length;
    const step = n % 2 === 0 ? 3 : 2;
    let d = "";
    for (let i = 0; i < n; i++) {
      const p = points[(i * step) % n];
      d += (i === 0 ? "M" : "L") + p.x + "," + p.y + " ";
    }
    return d + "Z";
  }, [points]);

  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Sacred sigil"
    >
      <defs>
        <radialGradient id="sigilGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.83 0.13 85)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="oklch(0.62 0.22 295)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 295)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.83 0.13 85)" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 295)" />
        </linearGradient>
      </defs>

      {/* aura */}
      <circle cx="250" cy="250" r="240" fill="url(#sigilGlow)" />

      {/* outer rotating rings */}
      <g className="animate-slow-spin" style={{ transformOrigin: "250px 250px" }}>
        <circle cx="250" cy="250" r="220" fill="none" stroke="url(#ringGrad)" strokeWidth="0.6" opacity="0.6" />
        <circle cx="250" cy="250" r="200" fill="none" stroke="oklch(0.62 0.22 295)" strokeWidth="0.4" strokeDasharray="2 8" opacity="0.5" />
        {/* tick marks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const x1 = 250 + Math.cos(a) * 196;
          const y1 = 250 + Math.sin(a) * 196;
          const x2 = 250 + Math.cos(a) * (i % 3 === 0 ? 182 : 190);
          const y2 = 250 + Math.sin(a) * (i % 3 === 0 ? 182 : 190);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.83 0.13 85)" strokeWidth="0.5" opacity={i % 3 === 0 ? 0.8 : 0.35} />;
        })}
      </g>

      {/* counter-rotating mid ring */}
      <g className="animate-slow-spin-rev" style={{ transformOrigin: "250px 250px" }}>
        <circle cx="250" cy="250" r="170" fill="none" stroke="oklch(0.83 0.13 85)" strokeWidth="0.4" opacity="0.4" />
        <circle cx="250" cy="250" r="160" fill="none" stroke="oklch(0.62 0.22 295)" strokeWidth="0.3" strokeDasharray="1 4" opacity="0.6" />
      </g>

      {/* inner sacred geometry */}
      <g>
        <circle cx="250" cy="250" r="140" fill="none" stroke="oklch(0.83 0.13 85 / 0.7)" strokeWidth="0.8" />
        <path d={innerPath} fill="none" stroke="oklch(0.62 0.22 295)" strokeWidth="1.2" opacity="0.9" />
        <path d={innerPath} fill="oklch(0.62 0.22 295 / 0.06)" stroke="oklch(0.83 0.13 85 / 0.8)" strokeWidth="0.4" />

        {/* vertex nodes */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="oklch(0.83 0.13 85)" />
            <circle cx={p.x} cy={p.y} r="8" fill="oklch(0.83 0.13 85 / 0.15)" />
          </g>
        ))}

        {/* center eye */}
        <circle cx="250" cy="250" r="42" fill="none" stroke="oklch(0.83 0.13 85)" strokeWidth="0.6" />
        <circle cx="250" cy="250" r="28" fill="none" stroke="oklch(0.62 0.22 295)" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="10" fill="oklch(0.83 0.13 85)" opacity="0.9" />
        <circle cx="250" cy="250" r="4" fill="oklch(0.08 0.02 285)" />
      </g>
    </svg>
  );
}