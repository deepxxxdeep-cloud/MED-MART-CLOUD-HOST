import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Hammer } from "lucide-react";
import Logo from "../components/Logo";

/**
 * Catch-all for routes the buyer UI already links to but which aren't built
 * yet (category listings, product detail, orders…). Without this those links
 * render a blank white page, which reads as a crash rather than as work in
 * progress.
 */
export default function ComingSoon() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-deep px-6 text-center">
      <Link to="/" className="group mb-10">
        <Logo dark />
      </Link>

      <div className="glass-dark rounded-2xl px-8 py-10 shadow-elevated">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-orange to-orange-dark shadow-glow-orange">
          <Hammer className="h-7 w-7 text-white" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-white">
          This page is next up
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-white/60">
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/80">{pathname}</code> is
          linked from the marketplace but hasn't been built yet.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-sm font-semibold text-white shadow-glow-orange"
          >
            Back to marketplace
          </Link>
          <Link
            to="/"
            className="glass flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
