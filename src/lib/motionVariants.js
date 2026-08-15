import { RICH_MOTION } from "../hooks/usePointerCapability";

export const easePremium = [0.22, 1, 0.36, 1];

// "Through the window" entrance — starts small and low, as if emerging from a
// distant round window, then scales up into place.
export const windowContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// The blur sells the "coming into focus" part, but it is re-rasterised every
// frame and phones cannot afford that on top of scrubbing the background
// video. Touch devices get the transform/opacity half, which composites on
// the GPU and reads almost the same.
export const windowItem = {
  hidden: {
    opacity: 0,
    scale: 0.55,
    y: 70,
    ...(RICH_MOTION ? { filter: "blur(14px)" } : {}),
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    ...(RICH_MOTION ? { filter: "blur(0px)" } : {}),
    transition: { duration: 0.85, ease: easePremium },
  },
};
