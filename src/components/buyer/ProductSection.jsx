import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const ease = [0.22, 1, 0.36, 1];

/**
 * Horizontally scrolling product row with a heading and a "view all" link.
 * Arrow buttons are pointer-only affordances — touch users swipe.
 */
export default function ProductSection({ title, subtitle, viewAllTo = "/shop", products, showNewBadge }) {
  const railRef = useRef(null);

  const nudge = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * Math.max(rail.clientWidth * 0.8, 240), behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto max-w-[1600px] px-4 pt-12 sm:px-6 lg:px-8"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-navy sm:text-2xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-[13px] font-light text-navy/45">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={viewAllTo}
            className="whitespace-nowrap text-[13px] font-semibold text-orange transition-opacity hover:opacity-75"
          >
            View All →
          </Link>
          <div className="hidden gap-1.5 md:flex">
            <button
              onClick={() => nudge(-1)}
              aria-label="Scroll left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/12 bg-white text-navy/55 shadow-soft transition-colors hover:border-orange hover:text-orange"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => nudge(1)}
              aria-label="Scroll right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/12 bg-white text-navy/55 shadow-soft transition-colors hover:border-orange hover:text-orange"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="perspective -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[210px] shrink-0 snap-start sm:w-[230px]">
            <ProductCard product={p} showNewBadge={showNewBadge} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
