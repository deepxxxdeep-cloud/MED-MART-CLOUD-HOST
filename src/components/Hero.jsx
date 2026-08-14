import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { trustStats } from "../data/siteData";
import { IconTile3D, PackageGlyph, ShieldGlyph, TruckGlyph } from "./icons3d";

const trustGlyphs = [PackageGlyph, ShieldGlyph, TruckGlyph];
const easePremium = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <section className="relative min-h-[640px] overflow-hidden sm:min-h-[720px]">
      {/* Light scrim only on the text side so the video stays visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/55 via-transparent to-transparent" />

      {/* Ambient gradient accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-mesh absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-orange/20 blur-[110px]" />
        <div
          className="animate-mesh absolute bottom-[-8rem] left-1/4 h-[22rem] w-[22rem] rounded-full bg-[#3b4fc9]/25 blur-[110px]"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easePremium }}
        >
          <span className="glass inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-orange shadow-glow-orange">
            India's #1 Medical B2B Marketplace
          </span>
          <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl">
            India's Trusted{" "}
            <span className="bg-gradient-to-r from-orange via-[#ff9457] to-white bg-clip-text text-transparent">
              Medical Equipment
            </span>{" "}
            Marketplace
          </h1>
          <p className="mt-6 max-w-xl text-lg font-light leading-[1.7] text-gray-300">
            Connect with verified suppliers of surgical tools, diagnostic equipment &amp;
            healthcare technology — all in one place.
          </p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easePremium }}
            className="glass mt-9 flex flex-col gap-2 rounded-2xl p-2 shadow-elevated sm:flex-row sm:items-center"
          >
            <select className="rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-gray-700 outline-none sm:w-48">
              <option>All Categories</option>
              <option>Surgical Instruments</option>
              <option>Diagnostic Equipment</option>
              <option>Hospital Furniture</option>
              <option>PPE &amp; Safety</option>
              <option>Lab Equipment</option>
            </select>
            <div className="hidden h-6 w-px bg-white/20 sm:block" />
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, brands, suppliers..."
                className="w-full rounded-xl border-0 bg-white/80 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none placeholder:text-gray-500 sm:bg-transparent"
              />
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ duration: 0.2, ease: easePremium }}
              className="rounded-xl bg-gradient-to-b from-orange to-orange-dark px-6 py-3 text-sm font-semibold text-white shadow-glow-orange"
            >
              Search
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easePremium }}
            className="mt-10 flex flex-wrap gap-x-9 gap-y-5"
          >
            {trustStats.map((stat, i) => {
              const Glyph = trustGlyphs[i];
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <IconTile3D glyph={Glyph} variant={i === 1 ? "navy" : "orange"} size={40} />
                  <div>
                    <p className="text-sm font-bold leading-none text-white">{stat.value}</p>
                    <p className="mt-1.5 text-xs font-light text-gray-300">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right — floating glass panels */}
        <div className="perspective relative hidden h-[26rem] lg:block">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: easePremium }}
            className="glass-dark noise-overlay absolute right-4 top-4 w-64 rounded-2xl p-6 shadow-elevated"
          >
            <p className="font-display text-3xl font-semibold text-white">10,000+</p>
            <p className="mt-1 text-sm font-light text-gray-300">Products across 10 major categories</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: easePremium }}
            className="glass-dark noise-overlay absolute bottom-10 right-16 w-60 rounded-2xl p-6 shadow-elevated"
          >
            <div className="flex items-center gap-3">
              <IconTile3D glyph={ShieldGlyph} variant="orange" size={40} />
              <div>
                <p className="text-sm font-semibold text-white">Verified Suppliers</p>
                <p className="text-xs font-light text-gray-300">Quality-checked &amp; compliant</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
