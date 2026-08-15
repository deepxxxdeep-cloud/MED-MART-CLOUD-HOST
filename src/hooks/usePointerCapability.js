// True only for devices with a real hovering pointer (a mouse/trackpad).
// Phones and tablets report false, which we use to skip effects that are
// either meaningless without a cursor (tilt-on-hover) or too expensive for a
// mobile GPU to run at 60fps (animated blur filters).
//
// Evaluated once at module load: pointer capability does not change during a
// session in any way worth re-rendering the whole page for.
export const HAS_FINE_POINTER =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Run the expensive version only where it will actually hold up. */
export const RICH_MOTION = HAS_FINE_POINTER && !PREFERS_REDUCED_MOTION;
