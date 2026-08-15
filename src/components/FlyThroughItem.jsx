import { useLayoutEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { RICH_MOTION } from "../hooks/usePointerCapability";

// One grid item that flies out of the window: it starts tiny at the grid's
// centre (far away, blurred), then scales up and travels out to its real
// grid slot as its slice of the section's scroll progress plays.
export default function FlyThroughItem({ progress, index, total, gridRef, children, className = "" }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    const grid = gridRef.current;
    if (!el || !grid) return;

    const measure = () => {
      // offsetLeft/Top are layout-based, so they ignore our own transforms
      const cardCx = el.offsetLeft + el.offsetWidth / 2;
      const cardCy = el.offsetTop + el.offsetHeight / 2;
      setOffset({ x: grid.offsetWidth / 2 - cardCx, y: grid.offsetHeight / 2 - cardCy });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, [gridRef]);

  // Each card owns a slice of the scroll so they arrive one after another.
  const span = 0.55 / total;
  const start = index * span;
  const end = start + span * 2.2;

  const raw = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const p = useSpring(raw, { stiffness: 140, damping: 26, mass: 0.5 });

  const x = useTransform(p, [0, 1], [offset.x, 0]);
  const y = useTransform(p, [0, 1], [offset.y, 0]);
  const scale = useTransform(p, [0, 1], [0.08, 1]);
  const opacity = useTransform(p, [0, 0.12, 1], [0, 1, 1]);
  // An animated blur is re-rasterised every frame, and with a gridful of these
  // running at once that alone is enough to drop a phone to single-digit fps.
  // Transform and opacity are GPU-composited, so mobile keeps just those —
  // the cards still fly out of the window, they simply arrive sharp.
  const filter = useTransform(p, [0, 0.6, 1], ["blur(12px)", "blur(3px)", "blur(0px)"]);

  const style = RICH_MOTION
    ? { x, y, scale, opacity, filter, willChange: "transform, opacity, filter" }
    : { x, y, scale, opacity, willChange: "transform, opacity" };

  return (
    <motion.div ref={ref} style={style} className={className}>
      {children}
    </motion.div>
  );
}
