import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import {
  IconTile3D,
  SyringeGlyph,
  StethoscopeGlyph,
  PillBottleGlyph,
  ShieldGlyph,
} from "../icons3d";

const ease = [0.22, 1, 0.36, 1];

const FLOATERS = [
  { glyph: SyringeGlyph, variant: "orange", size: 62, pos: "left-[12%] top-[18%]", delay: "0s", rot: "-6deg" },
  { glyph: StethoscopeGlyph, variant: "navy", size: 74, pos: "right-[16%] top-[26%]", delay: "0.9s", rot: "5deg" },
  { glyph: PillBottleGlyph, variant: "navy", size: 56, pos: "left-[20%] bottom-[26%]", delay: "1.8s", rot: "4deg" },
  { glyph: ShieldGlyph, variant: "orange", size: 66, pos: "right-[13%] bottom-[20%]", delay: "2.7s", rot: "-4deg" },
];

/**
 * Split-screen auth shell: animated 3D visual panel on the left (hidden on
 * mobile, narrower on tablet), form column on the right.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left — visual panel */}
      <aside className="noise-overlay relative hidden overflow-hidden bg-navy-deep lg:flex lg:w-[52%] xl:w-[58%]">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-mesh absolute -left-24 -top-24 h-[32rem] w-[32rem] rounded-full bg-orange/25 blur-[120px]" />
          <div
            className="animate-mesh absolute -right-20 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#3b4fc9]/30 blur-[120px]"
            style={{ animationDelay: "-6s" }}
          />
          <div
            className="animate-mesh absolute bottom-[-8rem] left-1/4 h-[26rem] w-[26rem] rounded-full bg-orange-dark/20 blur-[120px]"
            style={{ animationDelay: "-11s" }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {FLOATERS.map((f) => (
          <div
            key={f.pos}
            className={`animate-float absolute ${f.pos}`}
            style={{ animationDelay: f.delay, "--float-rot": f.rot }}
          >
            <IconTile3D glyph={f.glyph} variant={f.variant} size={f.size} />
          </div>
        ))}

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <Link to="/" className="group w-fit">
            <Logo dark />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="max-w-md"
          >
            <h2 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-5xl">
              {title}
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-white/70">{subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="flex flex-wrap gap-3"
          >
            {[
              ["500+", "Verified Suppliers"],
              ["10,000+", "Products"],
              ["Pan-India", "Delivery"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="glass-dark rounded-xl px-4 py-3 shadow-elevated"
              >
                <p className="text-sm font-bold leading-none text-white">{value}</p>
                <p className="mt-1.5 text-[11px] font-light text-white/60">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </aside>

      {/* Right — form column */}
      <main className="relative flex flex-1 flex-col overflow-hidden bg-surface">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange/10 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-navy/10 blur-[90px]" />

        {/* Mobile branding bar — the visual panel is hidden below lg */}
        <div className="relative flex items-center justify-between border-b border-navy/10 px-5 py-4 lg:hidden">
          <Link to="/" className="group">
            <Logo textClassName="text-lg" />
          </Link>
          <p className="text-[11px] font-medium text-navy/45">India's medical marketplace</p>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full max-w-[440px]"
          >
            <div className="border-gradient rounded-3xl bg-white/80 p-7 shadow-elevated backdrop-blur-xl sm:p-9">
              {children}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
