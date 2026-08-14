export const easePremium = [0.22, 1, 0.36, 1];

// "Through the window" entrance — starts small, blurred and low, as if
// emerging from a distant round window, then scales up into sharp focus.
export const windowContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export const windowItem = {
  hidden: { opacity: 0, scale: 0.55, y: 70, filter: "blur(14px)" },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: easePremium },
  },
};
