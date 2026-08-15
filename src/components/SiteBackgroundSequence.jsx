import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const FRAME_COUNT = 136;

// Phones get the 900px set, everything else the 1600px set. Decided once —
// swapping mid-session would throw away a warm cache for no visible gain.
const IS_SMALL =
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
const DIR = IS_SMALL ? "/seq/sd" : "/seq/hd";

const frameUrl = (i) => `${DIR}/f-${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Scroll-scrubbed background, drawn as an image sequence on a canvas.
 *
 * This replaces the <video> approach. Scrubbing a video means asking the
 * decoder to seek on every scroll event, which is where the mobile stutter
 * came from — a seek is only cheap if the target frame is buffered and close
 * to a keyframe. Swapping a decoded still costs nothing, so the animation
 * tracks the finger exactly. It is the technique Apple uses for the same
 * effect.
 *
 * The canvas is sized in device pixels, not CSS pixels: on a 3x phone a
 * canvas backed at CSS resolution is upscaled by the compositor and looks
 * soft, which is the "blurry" part. DPR is capped at 2 because the memory
 * cost of a third sample is real and the difference is not visible.
 */
export default function SiteBackgroundSequence() {
  const canvasRef = useRef(null);
  const frames = useRef([]);
  const loaded = useRef(new Array(FRAME_COUNT).fill(false));
  const current = useRef(0);
  const rafId = useRef(null);
  const drawRef = useRef(() => {});

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(current.current);
    };

    // Cover-fit, mirroring object-fit: cover.
    const draw = (index) => {
      // If this frame hasn't arrived yet, fall back to the nearest one that
      // has, so early scrolling still moves rather than showing nothing.
      let i = index;
      if (!loaded.current[i]) {
        let found = -1;
        for (let d = 1; d < FRAME_COUNT; d++) {
          if (loaded.current[i - d]) { found = i - d; break; }
          if (loaded.current[i + d]) { found = i + d; break; }
        }
        if (found < 0) return;
        i = found;
      }

      const img = frames.current[i];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    drawRef.current = draw;

    // Load frame 0 first so something is on screen immediately, then the rest
    // in order. Browsers cap parallel connections anyway, so a plain loop is
    // fine and keeps arrival roughly sequential.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(i);
      img.onload = () => {
        loaded.current[i] = true;
        // Only repaint if this is the frame we actually want right now.
        if (i === current.current) draw(i);
        else if (i === 0 && current.current === 0) draw(0);
      };
      frames.current[i] = img;
    }

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const index = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
    );
    if (index === current.current) return;
    current.current = index;

    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      drawRef.current(current.current);
    });
  });

  return (
    <div className="fixed inset-0 -z-50 h-screen w-screen overflow-hidden bg-navy-deep">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-navy-deep/40" />
    </div>
  );
}
