import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { SUPPLIERS, PRODUCTS } from "../../data/buyerData";

const ease = [0.22, 1, 0.36, 1];

/** Two-letter monogram — stands in for a supplier logo. */
const initials = (name) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

export default function TrustedSuppliers() {
  const railRef = useRef(null);

  const nudge = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * Math.max(rail.clientWidth * 0.8, 260), behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto max-w-[1600px] px-4 pt-14 sm:px-6 lg:px-8"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-navy sm:text-2xl">
            Featured Verified Suppliers
          </h2>
          <p className="mt-1 text-[13px] font-light text-navy/45">
            Every seller is checked for licensing, quality and compliance
          </p>
        </div>
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

      <div
        ref={railRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {SUPPLIERS.map((s) => {
          // Show a few of this supplier's own listings, falling back to any
          // products so a card is never left with empty thumbnail slots.
          const own = PRODUCTS.filter((p) => p.supplier === s.name);
          const thumbs = (own.length >= 4 ? own : [...own, ...PRODUCTS]).slice(0, 4);

          return (
            <article
              key={s.id}
              className="w-[280px] shrink-0 snap-start rounded-2xl border border-navy/8 bg-white p-5 shadow-soft transition-shadow duration-400 ease-premium hover:shadow-elevated"
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-deep font-display text-sm font-bold text-white shadow-glow-navy">
                    {initials(s.name)}
                  </div>
                  <BadgeCheck className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-white fill-orange text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[13.5px] font-semibold text-navy">{s.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-navy/45">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{s.city}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-[11px]">
                <span className="rounded-md bg-navy/5 px-2 py-1 font-semibold text-navy/70">
                  {s.years} yrs in business
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  <span className="font-bold text-navy/75">{s.rating}</span>
                  <span className="text-navy/40">({s.reviews})</span>
                </span>
              </div>

              <p className="mt-2.5 text-[11px] font-medium text-orange">{s.categories}</p>

              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {thumbs.map((p, i) => (
                  <img
                    key={`${s.id}-${p.id}-${i}`}
                    src={p.photo}
                    alt=""
                    loading="lazy"
                    className="h-12 w-full rounded-lg object-cover"
                  />
                ))}
              </div>

              <Link
                to={`/supplier/${s.id}`}
                className="mt-4 block rounded-lg border border-navy/15 py-2 text-center text-[12.5px] font-semibold text-navy transition-colors hover:border-orange hover:bg-orange hover:text-white"
              >
                View Store
              </Link>
            </article>
          );
        })}
      </div>
    </motion.section>
  );
}
