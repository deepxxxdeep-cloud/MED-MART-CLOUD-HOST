import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

// Phones get the smaller encode. Chosen once at mount — swapping src later
// would reset the playhead.
const SRC =
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
    ? "/media/plane-window-480.mp4"
    : "/media/plane-window-720.mp4";

/**
 * Full-site background video, driven entirely by scroll position. It never
 * plays on its own: the only thing that moves the playhead is the page moving.
 *
 * The catch is that mobile Safari refuses to decode a video that has never
 * been played, so seeking a never-played element leaves it stuck on frame one.
 * The fix is to "unlock" the decoder with a play() that is cancelled by a
 * pause() as soon as it resolves — long enough for the browser to spin up the
 * decoder, too short to look like playback. That is retried on the first touch
 * because iOS often rejects the call until there has been a gesture.
 */
export default function SiteBackgroundVideo() {
  const videoRef = useRef(null);
  const duration = useRef(0);
  const target = useRef(0);
  const rafId = useRef(null);
  const unlocked = useRef(false);

  const { scrollYProgress } = useScroll();

  // Push the playhead to wherever the page currently is.
  const sync = () => {
    const video = videoRef.current;
    const total = duration.current;
    if (!video || !total) return;
    const t = Math.min(Math.max(target.current, 0), 1) * total;
    if (video.seekable.length && t > video.seekable.end(video.seekable.length - 1)) return;
    video.currentTime = t;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      duration.current = video.duration || 0;
      sync();
    };

    // Wake the decoder, then stop immediately so nothing actually plays.
    const unlock = () => {
      if (unlocked.current) return;
      const started = video.play();
      if (started && typeof started.then === "function") {
        started
          .then(() => {
            video.pause();
            unlocked.current = true;
            sync();
          })
          .catch(() => {});
      } else {
        video.pause();
      }
    };

    // Belt and braces: if anything ever manages to start playback (an
    // autoplay heuristic, a restored session), stop it. Scroll owns the
    // playhead, nothing else.
    const onPlay = () => video.pause();

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", unlock);
    video.addEventListener("play", onPlay);
    if (video.readyState >= 1) onMeta();
    unlock();

    const onFirstGesture = () => unlock();
    window.addEventListener("touchstart", onFirstGesture, { passive: true });
    window.addEventListener("pointerdown", onFirstGesture, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", unlock);
      video.removeEventListener("play", onPlay);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("pointerdown", onFirstGesture);
    };
  }, []);

  // Seeking on every scroll event floods the decoder, so coalesce to one
  // seek per frame.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    target.current = progress;
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      sync();
    });
  });

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return (
    // The gradient underneath keeps a slow load looking deliberate rather
    // than showing an empty rectangle.
    <div className="fixed inset-0 -z-50 h-screen w-screen overflow-hidden bg-gradient-to-b from-navy-deep via-navy to-navy-deep">
      <video
        ref={videoRef}
        src={SRC}
        poster="/media/plane-window-poster.jpg"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-deep/40" />
    </div>
  );
}
