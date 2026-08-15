import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { IconTile3D } from "../icons3d";

const ease = [0.22, 1, 0.36, 1];

export default function MetricCard({ label, value, trend, suffix = "", glyph, variant, index = 0 }) {
  const up = trend >= 0;
  const Trend = up ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease }}
      className="group relative overflow-hidden rounded-2xl border border-navy/8 bg-white p-5 shadow-soft transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-navy/45">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-navy">
            {value.toLocaleString("en-IN")}
            {suffix}
          </p>
        </div>
        <IconTile3D glyph={glyph} variant={variant} size={42} />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
            up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          <Trend className="h-3 w-3" />
          {Math.abs(trend)}%
        </span>
        <span className="text-[11px] text-navy/40">vs last month</span>
      </div>
    </motion.div>
  );
}
