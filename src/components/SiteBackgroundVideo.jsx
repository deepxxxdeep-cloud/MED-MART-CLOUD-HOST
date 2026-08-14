import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

// Full-site fixed background video, scrubbed by scroll position — scrolling
// the page advances the video frame-by-frame instead of it looping freely,
// so the "plane through clouds" motion is tied to how far down the page you are.
export default function SiteBackgroundVideo() {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setDuration(video.duration || 0);
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = latest * duration;
  });

  return (
    <div className="fixed inset-0 -z-50 h-screen w-screen overflow-hidden">
      <video
        ref={videoRef}
        src="/media/plane-window.mp4"
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-deep/40" />
    </div>
  );
}
