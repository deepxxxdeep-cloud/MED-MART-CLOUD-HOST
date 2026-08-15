import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES, PROMO_TILES } from "../../data/buyerData";
import { RICH_MOTION } from "../../hooks/usePointerCapability";

const ease = [0.22, 1, 0.36, 1];
const ROTATE_MS = 6000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next) => {
    setIndex((i) => (next + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(index + 1), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const slide = HERO_SLIDES[index];

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Carousel */}
        <div
          className="relative h-[300px] overflow-hidden rounded-2xl shadow-elevated sm:h-[380px] lg:h-[420px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease }}
              className="absolute inset-0"
            >
              <img src={slide.photo} alt="" className="h-full w-full object-cover" />
              {/* Scrim keeps the copy readable whatever the photo does */}
              <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/75 to-navy-deep/20" />
            </motion.div>
          </AnimatePresence>

          <div className="relative flex h-full items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease }}
                className="glass-dark noise-overlay m-6 max-w-md rounded-2xl p-6 shadow-elevated sm:m-10 sm:p-8"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-2.5 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {slide.title}
                </h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/70">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.to}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-sm font-semibold text-white shadow-glow-orange transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="glass absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="glass absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/25"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-orange" : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Promo tiles — a row on tablet, a column matching the carousel's
            height on desktop (explicit rows so they divide it evenly). */}
        <div className="grid gap-4 sm:grid-cols-3 lg:h-[420px] lg:grid-cols-1 lg:grid-rows-3">
          {PROMO_TILES.map((tile) => (
            <Link
              key={tile.id}
              to={tile.to}
              className="group relative h-28 min-h-0 overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-elevated sm:h-32 lg:h-full"
            >
              <img
                src={tile.photo}
                alt=""
                className={`h-full w-full object-cover ${
                  RICH_MOTION ? "transition-transform duration-500 ease-premium group-hover:scale-105" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="glass inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold text-orange">
                  {tile.off}
                </span>
                <p className="mt-1.5 font-display text-sm font-semibold text-white">{tile.title}</p>
                <p className="text-[11px] font-light text-white/60">{tile.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
