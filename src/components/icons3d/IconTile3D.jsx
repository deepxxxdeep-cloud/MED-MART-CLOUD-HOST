// Layered-gradient "glossy tile" icon shell — simulates a dimensional,
// softly-lit render (highlight + gradient body + drop shadow + glyph bevel)
// without depending on external 3D-rendered assets.
let uid = 0;

export default function IconTile3D({ glyph: Glyph, variant = "orange", size = 64, className = "" }) {
  const id = `ic3d-${++uid}`;
  const palettes = {
    orange: {
      from: "#ff9457",
      mid: "#f26522",
      to: "#c9500f",
      glow: "rgba(242,101,34,0.45)",
    },
    navy: {
      from: "#4459c9",
      mid: "#243694",
      to: "#141f5c",
      glow: "rgba(27,42,107,0.45)",
    },
  };
  const p = palettes[variant] || palettes.orange;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      style={{ filter: `drop-shadow(0 10px 18px ${p.glow})` }}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={p.from} />
          <stop offset="55%" stopColor={p.mid} />
          <stop offset="100%" stopColor={p.to} />
        </linearGradient>
        <radialGradient id={`${id}-sheen`} cx="30%" cy="22%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* body */}
      <rect x="3" y="3" width="58" height="58" rx="18" fill={`url(#${id}-body)`} />
      {/* inner bottom shade for roundness */}
      <rect x="3" y="3" width="58" height="58" rx="18" fill={`url(#${id}-edge)`} />
      {/* glass sheen */}
      <rect x="3" y="3" width="58" height="58" rx="18" fill={`url(#${id}-sheen)`} />
      {/* top hairline highlight */}
      <path
        d="M11 5 H45"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* glyph — drawn with a soft dark bevel duplicate + white main stroke */}
      <g transform="translate(32,32)">
        <g
          transform="translate(0.9,1.3)"
          opacity="0.25"
          stroke="#0f1a45"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Glyph />
        </g>
        <g stroke="#ffffff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <Glyph />
        </g>
      </g>
    </svg>
  );
}
