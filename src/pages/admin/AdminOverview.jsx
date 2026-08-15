import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Users, Store, Receipt, TrendingUp, Wallet, Percent,
  UserPlus, ShieldAlert, ClipboardCheck, LifeBuoy, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ACTIVITY_FEED, ADMIN_METRICS, COMMISSION_RATE, PLATFORM_SERIES,
  inr, inrShort, timeAgo,
} from "../../data/adminData";

const ease = [0.22, 1, 0.36, 1];
const GRAINS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

function Metric({ label, value, sub, icon: Icon, trend, index }) {
  const up = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease }}
      className="rounded-xl border border-navy/8 bg-white p-4 shadow-soft transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11.5px] font-medium text-navy/45">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-orange" />
      </div>
      <p className="mt-2 font-display text-xl font-semibold tracking-tight text-navy">{value}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        {trend != null && (
          <span className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10.5px] font-bold ${up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className="text-[11px] text-navy/45">{sub}</span>}
      </div>
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-navy/10 bg-white px-3 py-2 shadow-elevated">
      <p className="text-[11px] font-semibold text-navy/50">{label}</p>
      <p className="text-[13px] font-bold text-navy">GMV {inr(p.gmv)}</p>
      <p className="text-[13px] font-bold text-orange">Commission {inr(p.commission)}</p>
      <p className="mt-0.5 text-[11px] text-navy/50">{p.orders} orders</p>
    </div>
  );
}

function aggregate(series, grain) {
  if (grain === "daily") return series.slice(-30);
  const buckets = new Map();
  for (const d of series) {
    const date = new Date(d.date);
    let key;
    if (grain === "weekly") {
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      key = monday.toISOString().slice(0, 10);
    } else key = d.month;
    const b = buckets.get(key) || { label: key, gmv: 0, commission: 0, orders: 0 };
    b.gmv += d.gmv; b.commission += d.commission; b.orders += d.orders;
    buckets.set(key, b);
  }
  const out = [...buckets.values()];
  return grain === "weekly"
    ? out.map((b) => ({ ...b, label: new Date(b.label).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) }))
    : out;
}

const FEED_STYLE = {
  seller: { cls: "bg-blue-50 text-blue-700", Icon: Store },
  order: { cls: "bg-emerald-50 text-emerald-700", Icon: Receipt },
  flag: { cls: "bg-amber-50 text-amber-700", Icon: ShieldAlert },
  payout: { cls: "bg-orange-light text-orange", Icon: Wallet },
};

export default function AdminOverview() {
  const [grain, setGrain] = useState("daily");
  const data = useMemo(() => aggregate(PLATFORM_SERIES, grain), [grain]);
  const m = ADMIN_METRICS;
  const orderTrend = Number((((m.orders.thisMonth - m.orders.lastMonth) / m.orders.lastMonth) * 100).toFixed(1));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <Metric index={0} label="Total Users" value={m.users.total.toLocaleString("en-IN")} sub={`${m.users.buyers} buyers · ${m.users.sellers} sellers`} icon={Users} />
        <Metric index={1} label="Active Sellers" value={m.sellers.verified} sub={`${m.sellers.pending} pending`} icon={Store} />
        <Metric index={2} label="Orders This Month" value={m.orders.thisMonth.toLocaleString("en-IN")} trend={orderTrend} icon={Receipt} />
        <Metric index={3} label="Platform GMV" value={inrShort(m.gmv)} sub="this month" icon={TrendingUp} />
        <Metric index={4} label="Commission Earned" value={inrShort(m.commission)} sub={`${Math.round(COMMISSION_RATE * 100)}% fee`} icon={Percent} />
        <Metric index={5} label="Pending Payouts" value={inrShort(m.pendingPayouts.amount)} sub={`${m.pendingPayouts.count} orders`} icon={Wallet} />
      </div>

      <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[15px] font-semibold text-navy">GMV vs Platform Commission</h2>
            <p className="mt-0.5 text-[12px] text-navy/45">
              Total sales on the platform against Med-Mart's own earnings
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border border-navy/10 bg-surface p-1">
            {GRAINS.map((g) => (
              <button key={g.key} onClick={() => setGrain(g.key)} className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${grain === g.key ? "bg-white text-orange shadow-soft" : "text-navy/50 hover:text-navy"}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id="gmvFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B2A6B" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#1B2A6B" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="comFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F26522" stopOpacity={0.38} />
                  <stop offset="100%" stopColor="#F26522" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2A6B12" vertical={false} />
              <XAxis dataKey="label" interval={Math.max(0, Math.ceil(data.length / 7) - 1)} tick={{ fontSize: 11, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={inrShort} tick={{ fontSize: 11, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} width={58} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="gmv" name="Total GMV" stroke="#1B2A6B" strokeWidth={2.5} fill="url(#gmvFill)" />
              <Area type="monotone" dataKey="commission" name="Platform commission" stroke="#F26522" strokeWidth={2.5} fill="url(#comFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "New signups today", value: `${m.signupsToday.buyers + m.signupsToday.sellers}`, sub: `${m.signupsToday.buyers} buyers · ${m.signupsToday.sellers} sellers`, icon: UserPlus, to: "/admin/users", tone: "text-navy" },
          { label: "Pending verifications", value: m.sellers.pending, sub: "sellers awaiting review", icon: ClipboardCheck, to: "/admin/sellers", tone: "text-orange" },
          { label: "Flagged chats", value: m.flaggedChats, sub: "need review", icon: ShieldAlert, to: "/admin/chat-monitoring", tone: "text-red-600" },
          { label: "Open tickets", value: m.openTickets, sub: "support queue", icon: LifeBuoy, to: "/admin/users", tone: "text-navy" },
        ].map(({ label, value, sub, icon: Icon, to, tone }) => (
          <Link key={label} to={to} className="rounded-xl border border-navy/8 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-medium text-navy/45">{label}</p>
              <Icon className={`h-4 w-4 ${tone}`} />
            </div>
            <p className={`mt-1.5 font-display text-2xl font-semibold ${tone}`}>{value}</p>
            <p className="mt-0.5 text-[11px] text-navy/45">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
        <h2 className="font-display text-[15px] font-semibold text-navy">Recent Activity</h2>
        <ul className="mt-4 space-y-2">
          {ACTIVITY_FEED.map((a) => {
            const s = FEED_STYLE[a.type];
            return (
              <li key={a.id} className="flex items-center gap-3 rounded-lg border border-navy/6 px-3 py-2.5">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.cls}`}>
                  <s.Icon className="h-4 w-4" />
                </span>
                <p className="min-w-0 flex-1 truncate text-[13px] text-navy/75">{a.text}</p>
                <span className="shrink-0 text-[11px] text-navy/40">{timeAgo(a.mins)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
