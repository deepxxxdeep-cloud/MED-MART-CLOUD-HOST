// Minimal centered glyph fragments (drawn around origin 0,0, roughly -11..11)
// consumed by IconTile3D, which applies stroke/fill/bevel.

export function StethoscopeGlyph() {
  return (
    <>
      <path d="M-8 -10 v6 a5 5 0 0 0 10 0 v-6" />
      <path d="M-8 -10 v-1 M2 -10 v-1" />
      <path d="M-3 -4 v3 a7 7 0 0 0 14 0 v-2" />
      <circle cx="11" cy="-3" r="2.4" />
    </>
  );
}

export function SyringeGlyph() {
  return (
    <>
      <path d="M-9 9 L1 -1" />
      <path d="M-2 -8 L8 2" />
      <path d="M4 -10 L10 -4" />
      <path d="M-11 11 l3 -3" />
      <path d="M-2 4 l-3 -3 M-5 7 l-3 -3" />
    </>
  );
}

export function MicroscopeGlyph() {
  return (
    <>
      <path d="M0 11 h10" />
      <path d="M2 11 v-3 a4 4 0 0 1 4 -4" />
      <path d="M6 4 L-2 -6" />
      <path d="M-5 -9 l4 4" />
      <path d="M-6 -3 h5" />
    </>
  );
}

export function HospitalBedGlyph() {
  return (
    <>
      <path d="M-11 8 V0 h22 v8" />
      <path d="M-11 0 V-4 h6 v4" />
      <path d="M-3 -6 h4 M-1 -8 v4" />
      <path d="M-11 8 v3 M11 8 v3" />
    </>
  );
}

export function ShieldGlyph() {
  return (
    <>
      <path d="M0 -10 L9 -6 V2 C9 7 5 10 0 11 C-5 10 -9 7 -9 2 V-6 Z" />
      <path d="M-3.5 0 L-0.5 3 L4 -3" />
    </>
  );
}

export function FlaskGlyph() {
  return (
    <>
      <path d="M-3 -10 h6" />
      <path d="M-2 -10 v6 L-8 8 a2 2 0 0 0 2 3 h12 a2 2 0 0 0 2 -3 L2 -4 v-6" />
      <path d="M-5.5 3 h11" />
    </>
  );
}

export function BoneGlyph() {
  return (
    <path d="M-8 5 a2.6 2.6 0 1 0 3.7 3.7 L4.3 -0.3 a2.6 2.6 0 1 0 3.7 -3.7 a2.6 2.6 0 1 0 -3.7 -3.7 L-4.3 0.3 a2.6 2.6 0 1 0 -3.7 3.7 Z" />
  );
}

export function CrossGlyph() {
  return <path d="M-2.5 -9 h5 v6.5 h6.5 v5 h-6.5 v6.5 h-5 v-6.5 h-6.5 v-5 h6.5 Z" />;
}

export function BoxesGlyph() {
  return (
    <>
      <path d="M-9 -2 L0 -7 L9 -2 V6 L0 11 L-9 6 Z" />
      <path d="M-9 -2 L0 3 L9 -2 M0 3 V11" />
    </>
  );
}

export function LaptopGlyph() {
  return (
    <>
      <rect x="-8" y="-8" width="16" height="10" rx="1.2" />
      <path d="M-11 6 h22 l-2 3 h-18 Z" />
    </>
  );
}

export function PackageGlyph() {
  return (
    <>
      <path d="M-9 -4 L0 -9 L9 -4 V6 L0 11 L-9 6 Z" />
      <path d="M-9 -4 L0 1 L9 -4 M0 1 V11" />
      <path d="M-3 6.5 l3 2 l3 -2" />
    </>
  );
}

export function TruckGlyph() {
  return (
    <>
      <rect x="-11" y="-3" width="14" height="9" rx="1" />
      <path d="M3 0 h5 l3 3.5 V6 h-8 Z" />
      <circle cx="-6" cy="8" r="1.8" />
      <circle cx="6" cy="8" r="1.8" />
    </>
  );
}

export function HeartPulseGlyph() {
  return (
    <path d="M-9 -1 h4 l2 -4 l3 8 l2 -4 h7 M0 -1 c0 -5 -8 -6.5 -8 -1.5 c0 4 8 8.5 8 8.5 s8 -4.5 8 -8.5 c0 -5 -7.5 -3.8 -7.6 0.2" />
  );
}

export function BadgeCheckGlyph() {
  return (
    <>
      <path d="M0 -10 L2.6 -7.6 L6 -8 L6.2 -4.6 L9 -3 L7.3 0 L9 3 L6.2 4.6 L6 8 L2.6 7.6 L0 10 L-2.6 7.6 L-6 8 L-6.2 4.6 L-9 3 L-7.3 0 L-9 -3 L-6.2 -4.6 L-6 -8 L-2.6 -7.6 Z" />
      <path d="M-3.5 0 L-0.7 2.8 L4 -2.5" />
    </>
  );
}

export function HandCoinsGlyph() {
  return (
    <>
      <circle cx="-3" cy="-5" r="4" />
      <path d="M-1 -5 h0.01" />
      <path d="M-9 10 v-5 a2 2 0 0 1 2 -2 h6.5 a2 2 0 0 1 0 4 h-4.5" />
      <path d="M-0.5 3 h5 l3.5 2 l-1 2 l-8 -1" />
    </>
  );
}

export function LayoutGridGlyph() {
  return (
    <>
      <rect x="-9" y="-9" width="7.5" height="7.5" rx="1.2" />
      <rect x="1.5" y="-9" width="7.5" height="7.5" rx="1.2" />
      <rect x="-9" y="1.5" width="7.5" height="7.5" rx="1.2" />
      <rect x="1.5" y="1.5" width="7.5" height="7.5" rx="1.2" />
    </>
  );
}

export function XRayGlyph() {
  return (
    <>
      <rect x="-9" y="-10" width="18" height="20" rx="2.5" />
      <path d="M0 -6 v12" />
      <path d="M-5.5 -3 q5.5 -2.5 11 0" />
      <path d="M-5.5 1 q5.5 -2.5 11 0" />
    </>
  );
}

export function MonitorGlyph() {
  return (
    <>
      <rect x="-10" y="-9" width="20" height="14" rx="2" />
      <path d="M-6 -2 h3 l1.5 -3.5 l2.5 7 l1.5 -3.5 h3" />
      <path d="M0 5 v4 M-4 9 h8" />
    </>
  );
}

export function ScalpelGlyph() {
  return (
    <>
      <path d="M-10 10 L-3 3" />
      <path d="M-3 3 L6 -6 L10 -10 L9 -3 L3 5 Z" />
    </>
  );
}

export function CentrifugeGlyph() {
  return (
    <>
      <circle cx="0" cy="-3" r="7.5" />
      <path d="M0 -3 L4.5 -7 M0 -3 L-4.5 -7 M0 -3 v5" />
      <path d="M-6 5 h12 v5 h-12 Z" />
    </>
  );
}

export function MaskGlyph() {
  return (
    <>
      <path d="M-9 -5 q9 -4 18 0 v5 q-9 8 -18 0 Z" />
      <path d="M-9 -3 h-2.5 M9 -3 h2.5" />
      <path d="M-7.5 -1 h15 M-7 2.5 h14" />
    </>
  );
}

export function UltrasoundGlyph() {
  return (
    <>
      <rect x="-4" y="-11" width="8" height="9" rx="2" />
      <path d="M-4 -2 L-6.5 2 h13 L4 -2" />
      <path d="M-6 5.5 q6 4 12 0" />
      <path d="M-8.5 9 q8.5 5 17 0" />
    </>
  );
}

export function PillBottleGlyph() {
  return (
    <>
      <rect x="-6" y="-9" width="12" height="4" rx="1" />
      <rect x="-8" y="-5" width="16" height="15" rx="3" />
      <path d="M-8 1 h16" />
    </>
  );
}

export function MapPinnedGlyph() {
  return (
    <>
      <path d="M0 10 C0 10 7 2.5 7 -2.5 A7 7 0 0 0 -7 -2.5 C-7 2.5 0 10 0 10 Z" />
      <circle cx="0" cy="-2.5" r="2.6" />
    </>
  );
}
