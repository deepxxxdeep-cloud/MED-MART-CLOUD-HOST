import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IconTile3D, PackageGlyph, ShieldGlyph, HeartPulseGlyph, MicroscopeGlyph } from "../icons3d";

const ease = [0.22, 1, 0.36, 1];

const FLOATERS = [
  { glyph: PackageGlyph, variant: "orange", size: 52, cls: "left-[8%] top-[18%]", delay: "0s", rot: "-6deg" },
  { glyph: HeartPulseGlyph, variant: "navy", size: 44, cls: "left-[20%] bottom-[16%]", delay: "1s", rot: "4deg" },
  { glyph: MicroscopeGlyph, variant: "navy", size: 48, cls: "right-[18%] top-[14%]", delay: "2s", rot: "5deg" },
  { glyph: ShieldGlyph, variant: "orange", size: 56, cls: "right-[8%] bottom-[18%]", delay: "3s", rot: "-4deg" },
];

export default function RFQBanner() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.7, ease }}
        className="noise-overlay relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-deep to-navy shadow-elevated"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-mesh absolute -left-20 -top-20 h-80 w-80 rounded-full bg-orange/20 blur-[100px]" />
          <div
            className="animate-mesh absolute -right-16 bottom-[-6rem] h-80 w-80 rounded-full bg-[#3b4fc9]/25 blur-[100px]"
            style={{ animationDelay: "-7s" }}
          />
        </div>

        {/* Decorative tiles — hidden on small screens where they'd crowd the copy */}
        {FLOATERS.map((f) => (
          <div
            key={f.cls}
            className={`animate-float pointer-events-none absolute hidden lg:block ${f.cls}`}
            style={{ animationDelay: f.delay, "--float-rot": f.rot }}
          >
            <IconTile3D glyph={f.glyph} variant={f.variant} size={f.size} />
          </div>
        ))}

        <div className="relative mx-auto max-w-2xl px-6 py-14 text-center sm:py-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            Can't Find What You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-white/70 sm:text-base">
            Post your requirement and get quotes from verified suppliers within 24 hours.
          </p>
          <Link
            to="/post-requirement"
            className="animate-pulse-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-orange to-orange-dark px-8 py-3.5 text-sm font-semibold text-white shadow-glow-orange transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:text-base"
          >
            Post Buy Requirement
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
