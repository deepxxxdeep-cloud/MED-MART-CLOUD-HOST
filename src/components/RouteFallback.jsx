import Logo from "./Logo";

/**
 * Shown while a route's chunk is downloading. Branded rather than a bare
 * spinner so a split point never reads as a broken page.
 */
export default function RouteFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy-deep">
      <Logo dark />
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="animate-shimmer h-full w-full rounded-full bg-gradient-to-r from-transparent via-orange to-transparent" />
      </div>
    </div>
  );
}
