import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

/**
 * Full-site background video.
 *
 * Scroll-scrubbing a video only works once the bytes for the target time are
 * actually buffered — and mobile Safari will not decode a video that has never
 * been played. On a phone the old "pause it and set currentTime" approach
 * therefore froze on the first frame: nothing was buffered, so every seek was a
 * no-op.
 *
 * So this runs as a small state machine instead:
 *
 *   play  — the video loops normally. There is always motion, and playing is
 *           what makes the browser download the rest of the file.
 *   scrub — once the whole clip is buffered we pause and drive currentTime
 *           from scroll progress, which is the effect we actually want.
 *
 * Desktop reaches `scrub` almost immediately. A phone on a slow connection may
 * stay in `play` for a while, which still looks correct — it just isn't
 * scroll-linked yet. It upgrades itself the moment buffering catches up.
 */
// Phones get the smaller encode: a 24MB clip never buffers over cellular, and
// an unbuffered seek is a no-op, which is what used to freeze the first frame.
// Chosen once at mount — switching src mid-session would restart playback.
const SRC =
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
    ? "/media/plane-window-480.mp4"
    : "/media/plane-window-720.mp4";

export default function SiteBackgroundVideo() {
  const videoRef = useRef(null);
  const [mode, setMode] = useState("play");
  const duration = useRef(0);
  const pending = useRef(null);
  const rafId = useRef(null);

  const { scrollYProgress } = useScroll();

  // Kick playback off and watch buffering to decide when we can scrub.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS only decodes after a play() call; muted + playsInline keeps it legal
    // without a user gesture. If autoplay is still refused we retry on the
    // first touch, otherwise the frame would stay frozen.
    const start = () => video.play().catch(() => {});
    start();
    const onFirstTouch = () => start();
    window.addEventListener("touchstart", onFirstTouch, { passive: true, once: true });

    const onMeta = () => {
      duration.current = video.duration || 0;
    };

    const checkBuffered = () => {
      const total = video.duration;
      if (!total || !video.buffered.length) return;
      // Buffered ranges can be fragmented; only the range covering the start
      // matters, since scrubbing walks forward from 0.
      const end = video.buffered.end(video.buffered.length - 1);
      if (end >= total - 0.35) {
        duration.current = total;
        setMode("scrub");
      }
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("progress", checkBuffered);
    video.addEventListener("canplaythrough", checkBuffered);
    if (video.readyState >= 1) onMeta();
    checkBuffered();

    return () => {
      window.removeEventListener("touchstart", onFirstTouch);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("progress", checkBuffered);
      video.removeEventListener("canplaythrough", checkBuffered);
    };
  }, []);

  // Entering scrub mode: stop playback so seeking owns the playhead, and jump
  // straight to wherever the page already is. Without this catch-up seek, a
  // visitor who scrolled while the clip was still buffering would be left on
  // whatever frame playback happened to reach, and would see nothing move
  // until they scrolled again.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (mode === "scrub") {
      video.pause();
      const total = duration.current || video.duration;
      if (total) video.currentTime = Math.min(Math.max(scrollYProgress.get(), 0), 1) * total;
    } else {
      video.play().catch(() => {});
    }
  }, [mode, scrollYProgress]);

  // Seeking on every scroll event overwhelms the decoder, so coalesce into one
  // seek per animation frame.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (mode !== "scrub") return;
    pending.current = progress;
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      const video = videoRef.current;
      const total = duration.current;
      if (!video || !total) return;

      const target = Math.min(Math.max(pending.current, 0), 1) * total;
      // Guard against seeking into a gap, which would stall the decoder.
      if (video.seekable.length && target > video.seekable.end(video.seekable.length - 1)) return;
      video.currentTime = target;
    });
  });

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return (
    // The gradient underneath means a failed/slow video still looks deliberate
    // rather than showing a blank rectangle.
    <div className="fixed inset-0 -z-50 h-screen w-screen overflow-hidden bg-gradient-to-b from-navy-deep via-navy to-navy-deep">
      <video
        ref={videoRef}
        src={SRC}
        poster="/media/plane-window-poster.jpg"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-deep/40" />
    </div>
  );
}
