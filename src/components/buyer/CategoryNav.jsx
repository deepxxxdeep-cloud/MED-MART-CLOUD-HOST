import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "../../data/buyerData";
import { IconTile3D } from "../icons3d";

const ease = [0.22, 1, 0.36, 1];

export default function CategoryNav({ mobileOpen }) {
  const [open, setOpen] = useState(null);

  return (
    <nav className="relative border-b border-white/10 bg-navy-deep/80">
      {/* Desktop: single row, hover opens a mega-menu */}
      <div className="mx-auto hidden max-w-[1600px] px-4 sm:px-6 lg:block lg:px-8">
        <ul className="flex items-center gap-0.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <li
              key={cat.slug}
              onMouseEnter={() => setOpen(cat.slug)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link
                to={`/c/${cat.slug}`}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  open === cat.slug ? "text-orange" : "text-white/75 hover:text-orange"
                }`}
              >
                <IconTile3D glyph={cat.glyph} variant={cat.variant} size={22} />
                {cat.name}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Link>

              <AnimatePresence>
                {open === cat.slug && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease }}
                    className="absolute left-0 right-0 top-full z-40"
                  >
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                      <div className="glass-dark noise-overlay overflow-hidden rounded-b-2xl border-t-0 shadow-elevated">
                        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-8 p-7">
                          {cat.columns.map((col) => (
                            <div key={col.title}>
                              <p className="font-display text-[13px] font-semibold text-orange">
                                {col.title}
                              </p>
                              <ul className="mt-3 space-y-2">
                                {col.items.map((item) => (
                                  <li key={item}>
                                    <Link
                                      to={`/c/${cat.slug}`}
                                      className="text-[13px] font-light text-white/65 transition-colors hover:text-white"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          {/* Category teaser card */}
                          <Link
                            to={`/c/${cat.slug}`}
                            className="group relative w-56 overflow-hidden rounded-xl"
                          >
                            <img
                              src={cat.photo}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <p className="font-display text-sm font-semibold text-white">
                                {cat.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-white/60">
                                {cat.count} products
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: horizontally scrollable chips */}
      <div className="lg:hidden">
        <ul className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug} className="shrink-0">
              <Link
                to={`/c/${cat.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-white/80"
              >
                <IconTile3D glyph={cat.glyph} variant={cat.variant} size={18} />
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile drawer opened from the header's hamburger */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden border-t border-white/10 bg-navy-deep lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1 p-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/c/${cat.slug}`}
                  className="flex items-center gap-2 rounded-lg p-2.5 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-orange"
                >
                  <IconTile3D glyph={cat.glyph} variant={cat.variant} size={26} />
                  <span className="min-w-0 truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
