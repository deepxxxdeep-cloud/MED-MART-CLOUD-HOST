import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Eye, MessagesSquare } from "lucide-react";
import MetricCard from "../../components/seller/MetricCard";
import { InquiriesChart, CategoryDonut } from "../../components/seller/AnalyticsChart";
import {
  BoxesGlyph,
  HeartPulseGlyph,
  BadgeCheckGlyph,
  HandCoinsGlyph,
} from "../../components/icons3d";
import { INQUIRIES, METRICS, SELLER, SELLER_PRODUCTS, timeAgo } from "../../data/sellerData";

const ease = [0.22, 1, 0.36, 1];
const GLYPHS = {
  products: { glyph: BoxesGlyph, variant: "orange" },
  inquiries: { glyph: HeartPulseGlyph, variant: "navy" },
  views: { glyph: BadgeCheckGlyph, variant: "orange" },
  response: { glyph: HandCoinsGlyph, variant: "navy" },
};

export default function Overview() {
  const recent = INQUIRIES.slice(0, 5);
  const top = [...SELLER_PRODUCTS].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="noise-overlay relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-deep to-navy p-6 shadow-elevated sm:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/25 blur-[80px]" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              Welcome back, {SELLER.ownerName}!
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px] font-light text-white/65">
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-orange">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified Seller
              </span>
              Member since {SELLER.memberSince} · {SELLER.city}
            </p>
          </div>

          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-white/65">Profile completion</span>
              <span className="font-bold text-white">{SELLER.profileCompletion}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${SELLER.profileCompletion}%` }}
                transition={{ duration: 0.9, delay: 0.2, ease }}
                className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark"
              />
            </div>
            <Link
              to="/seller/profile"
              className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:opacity-80"
            >
              Complete your profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {METRICS.map((m, i) => (
          <MetricCard key={m.key} {...m} {...GLYPHS[m.key]} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <InquiriesChart />
        <CategoryDonut />
      </div>

      {/* Widgets */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[15px] font-semibold text-navy">Recent Inquiries</h3>
            <Link to="/seller/inquiries" className="text-[12px] font-semibold text-orange hover:opacity-75">
              View All →
            </Link>
          </div>
          <ul className="space-y-2.5">
            {recent.map((q) => (
              <li
                key={q.id}
                className="flex gap-3 rounded-xl border border-navy/6 p-3 transition-colors hover:border-orange/40 hover:bg-orange-light/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[11px] font-bold text-white">
                  {q.buyer.split(" ").slice(-2).map((w) => w[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-semibold text-navy">{q.buyer}</p>
                    {q.status === "unread" && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    )}
                    <span className="ml-auto shrink-0 text-[11px] text-navy/40">
                      {timeAgo(q.minutesAgo)}
                    </span>
                  </div>
                  <p className="truncate text-[11.5px] font-medium text-orange">{q.product}</p>
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-navy/50">{q.message}</p>
                </div>
                <Link
                  to="/seller/inquiries"
                  className="self-center rounded-lg bg-gradient-to-b from-orange to-orange-dark px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-glow-orange"
                >
                  Respond
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[15px] font-semibold text-navy">
              Top Performing Products
            </h3>
            <Link to="/seller/products" className="text-[12px] font-semibold text-orange hover:opacity-75">
              View All →
            </Link>
          </div>
          <ul className="space-y-2.5">
            {top.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-navy/6 p-2.5">
                <span className="w-4 shrink-0 text-center text-[12px] font-bold text-navy/25">
                  {i + 1}
                </span>
                <img src={p.photo} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-navy">{p.name}</p>
                <span className="flex shrink-0 items-center gap-1 text-[11.5px] text-navy/50">
                  <Eye className="h-3.5 w-3.5" />
                  {p.views.toLocaleString("en-IN")}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-orange">
                  <MessagesSquare className="h-3.5 w-3.5" />
                  {p.inquiries}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
