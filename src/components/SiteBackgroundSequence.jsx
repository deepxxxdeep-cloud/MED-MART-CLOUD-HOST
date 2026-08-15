import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const FRAME_COUNT = 136;
const CONCURRENCY = 8;

// Pick a set that matches the display rather than guessing phone/desktop.
// A tablet asking for the 1600px set was downloading nearly 4x what it could
// show, which is most of why it felt worse than the phone.
function pickTier() {
  if (typeof window === "undefined") return "md";
  // Weight DPR at 1.5 rather than its full value. Counting every device pixel
  // pushed a 2x tablet onto the 1600px set — 4.1MB to fill a screen that
  // cannot resolve the difference behind a darkened overlay, and a longer
  // wait before scrubbing can start.
  const w = window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5);
  if (w <= 900) return "sm";
  if (w <= 1600) return "md";
  return "lg";
}

const DIR = `/seq/${pickTier()}`;
const frameUrl = (i) => `${DIR}/f-${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Scroll-scrubbed background rendered as a decoded image sequence.
 *
 * Two things make this smooth, and both were missing before:
 *
 * 1. Nothing is scrubbed until every frame is decoded. Previously the draw
 *    fell back to "nearest frame that happens to have arrived", so a first
 *    pass down the page showed a partial animation and a second pass — now
 *    served from cache — showed more of it. Holding the first frame until the
 *    set is ready is far less jarring than an animation that fills itself in.
 *
 * 2. Frames are decoded up front with img.decode(). Handing drawImage an
 *    undecoded image makes it decode synchronously on the main thread, which
 *    is a dropped frame every single time a new frame is reached — exactly
 *    the stutter that survived every earlier fix.
 */
export default function SiteBackgroundSequence() {
  const canvasRef = useRef(null);
  const frames = useRef([]);
  const ready = useRef(false);
  const current = useRef(0);
  const rafId = useRef(null);
  const drawRef = useRef(() => {});
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    let cancelled = false;

    const draw = (index) => {
      const img = frames.current[index];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      // cover-fit, same geometry as object-fit: cover
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };
    drawRef.current = draw;

    const resize = () => {
      // Size the backing store in device pixels — a CSS-pixel canvas gets
      // upscaled by the compositor and looks soft on any HiDPI screen.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      if (ready.current) draw(current.current);
    };
    resize();

    const load = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(i);
        const finish = () => {
          frames.current[i] = img;
          resolve();
        };
        img.onload = () => {
          // decode() resolves once the bitmap is ready, off the main thread.
          if (img.decode) img.decode().then(finish, finish);
          else finish();
        };
        img.onerror = () => resolve();
      });

    (async () => {
      // First frame alone, so there is something correct on screen at once.
      await load(0);
      if (cancelled) return;
      draw(0);
      setVisible(true);

      // Then the rest, a few at a time so we don't open 136 sockets.
      let next = 1;
      const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (!cancelled) {
          const i = next++;
          if (i >= FRAME_COUNT) return;
          await load(i);
        }
      });
      await Promise.all(workers);
      if (cancelled) return;

      ready.current = true;
      draw(current.current); // catch up to wherever the page is now
    })();

    window.addEventListener("resize", resize);
    return () => {
      cancelled = true;
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

    // Until the set is decoded, track the position but keep showing frame 0
    // rather than jumping between whichever frames happen to have landed.
    if (!ready.current) return;

    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      drawRef.current(current.current);
    });
  });

  return (
    <div className="fixed inset-0 -z-50 h-screen w-screen overflow-hidden bg-navy-deep">
      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-navy-deep/40" />
    </div>
  );
}
