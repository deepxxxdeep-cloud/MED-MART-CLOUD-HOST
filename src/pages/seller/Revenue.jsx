import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Search, Wallet, Clock, TrendingUp, Package } from "lucide-react";
import MetricCard from "../../components/seller/MetricCard";
import { HandCoinsGlyph, BadgeCheckGlyph, PackageGlyph, BoxesGlyph } from "../../components/icons3d";
import {
  PAYOUTS,
  PAYOUT_SCHEDULE_DAYS,
  REVENUE_BY_CATEGORY,
  REVENUE_BY_STATE,
  REVENUE_SERIES,
  TOP_PRODUCTS_REVENUE,
  TRANSACTIONS,
} from "../../data/sellerData";

const SLICE_COLORS = ["#F26522", "#1B2A6B", "#FF9457", "#4459C9", "#C9500F"];
const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const inrShort = (n) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr`
  : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
  : n >= 1000 ? `₹${Math.round(n / 1000)}k`
  : `₹${n}`;

const GRAINS = [
  { key: "daily", label: "Daily", days: 30 },
  { key: "weekly", label: "Weekly", days: 84 },
  { key: "monthly", label: "Monthly", days: 180 },
  { key: "yearly", label: "Yearly", days: 180 },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-navy/10 bg-white px-3 py-2 shadow-elevated">
      <p className="text-[11px] font-semibold text-navy/50">{label}</p>
      <p className="text-[13px] font-bold text-navy">{inr(p.revenue ?? payload[0].value)}</p>
      {p.orders != null && (
        <p className="text-[11px] text-navy/50">
          {p.orders} order{p.orders === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-navy">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[12px] text-navy/45">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const PAYOUT_BADGE = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  scheduled: "bg-orange-light text-orange ring-orange/30",
  pending: "bg-navy/5 text-navy/55 ring-navy/15",
};

/** Group the daily series into weeks / months for the coarser views. */
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
    } else if (grain === "monthly") {
      key = d.month;
    } else {
      key = String(date.getFullYear());
    }
    const b = buckets.get(key) || { label: key, revenue: 0, orders: 0 };
    b.revenue += d.revenue;
    b.orders += d.orders;
    buckets.set(key, b);
  }
  const out = [...buckets.values()];
  return grain === "weekly"
    ? out.map((b) => ({
        ...b,
        label: new Date(b.label).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      }))
    : out;
}

export default function Revenue() {
  const [grain, setGrain] = useState("daily");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const chartData = useMemo(() => aggregate(REVENUE_SERIES, grain), [grain]);

  const totals = useMemo(() => {
    const all = REVENUE_SERIES.reduce((s, d) => s + d.revenue, 0);
    const thisMonth = REVENUE_SERIES.slice(-30).reduce((s, d) => s + d.revenue, 0);
    const lastMonth = REVENUE_SERIES.slice(-60, -30).reduce((s, d) => s + d.revenue, 0);
    const trend = lastMonth ? Number((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)) : 0;
    const pending = TRANSACTIONS.filter((t) => t.payoutStatus !== "paid").reduce(
      (s, t) => s + t.net,
      0
    );
    return { all, thisMonth, trend, pending, orders: REVENUE_SERIES.reduce((s, d) => s + d.orders, 0) };
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRANSACTIONS.filter(
      (t) =>
        (!q ||
          t.orderId.toLowerCase().includes(q) ||
          t.buyer.toLowerCase().includes(q) ||
          t.product.toLowerCase().includes(q)) &&
        (status === "All" || t.payoutStatus === status)
    );
  }, [query, status]);

  const exportCsv = () => {
    const header = ["Order ID", "Date", "Buyer", "Product", "Amount", "Platform Fee", "Net Earning", "Payment", "Payout"];
    const body = rows.map((t) => [t.orderId, t.date, t.buyer, t.product, t.amount, t.commission, t.net, t.paymentStatus, t.payoutStatus]);
    const csv = [header, ...body]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `medmart-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nextPayout = new Date(Date.now() + PAYOUT_SCHEDULE_DAYS * 86400000);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricCard label="Total Revenue" value={totals.all} trend={totals.trend} glyph={HandCoinsGlyph} variant="orange" index={0} />
        <MetricCard label="This Month" value={totals.thisMonth} trend={totals.trend} glyph={BadgeCheckGlyph} variant="navy" index={1} />
        <MetricCard label="Pending Payouts" value={totals.pending} trend={0} glyph={PackageGlyph} variant="orange" index={2} />
        <MetricCard label="Orders Completed" value={totals.orders} trend={9.4} glyph={BoxesGlyph} variant="navy" index={3} />
      </div>

      <Panel
        title="Revenue Over Time"
        subtitle={`${inr(chartData.reduce((s, d) => s + d.revenue, 0))} across this view`}
        action={
          <div className="flex gap-1 rounded-lg border border-navy/10 bg-surface p-1">
            {GRAINS.map((g) => (
              <button
                key={g.key}
                onClick={() => setGrain(g.key)}
                className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  grain === g.key ? "bg-white text-orange shadow-soft" : "text-navy/50 hover:text-navy"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -6, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F26522" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1B2A6B" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2A6B12" vertical={false} />
              <XAxis
                dataKey="label"
                interval={Math.max(0, Math.ceil(chartData.length / 7) - 1)}
                tick={{ fontSize: 11, fill: "#1B2A6B80" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={inrShort}
                tick={{ fontSize: 11, fill: "#1B2A6B80" }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#F26522" strokeWidth={2.5} fill="url(#revFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Revenue by Category">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REVENUE_BY_CATEGORY} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
                  {REVENUE_BY_CATEGORY.map((s, i) => (
                    <Cell key={s.name} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {REVENUE_BY_CATEGORY.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2 text-[12px]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }} />
                <span className="min-w-0 flex-1 truncate text-navy/60">{s.name}</span>
                <span className="font-bold text-navy">{inrShort(s.value)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Top 5 Products by Revenue">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_PRODUCTS_REVENUE} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B2A6B12" horizontal={false} />
                <XAxis type="number" tickFormatter={inrShort} tick={{ fontSize: 11, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 10, fill: "#1B2A6B80" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v.length > 22 ? `${v.slice(0, 22)}…` : v)}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F2652210" }} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {TOP_PRODUCTS_REVENUE.map((_, i) => (
                    <Cell key={i} fill={i % 2 ? "#1B2A6B" : "#F26522"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Revenue by Buyer Location" subtitle="Where demand is coming from">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px]">
            <thead>
              <tr className="border-b border-navy/8 text-left text-[11.5px] font-semibold uppercase tracking-wide text-navy/45">
                <th className="py-2.5">State</th>
                <th className="py-2.5">Orders</th>
                <th className="py-2.5 text-right">Revenue</th>
                <th className="w-1/3 py-2.5 pl-4">Share</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_BY_STATE.map((s) => {
                const max = REVENUE_BY_STATE[0].revenue;
                return (
                  <tr key={s.state} className="border-b border-navy/5 last:border-0">
                    <td className="py-2.5 text-[13px] font-medium text-navy">{s.state}</td>
                    <td className="py-2.5 text-[12.5px] text-navy/55">{s.orders}</td>
                    <td className="py-2.5 text-right text-[13px] font-semibold text-navy">{inr(s.revenue)}</td>
                    <td className="py-2.5 pl-4">
                      <div className="h-2 overflow-hidden rounded-full bg-navy/6">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark" style={{ width: `${(s.revenue / max) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Transactions"
        subtitle={`${rows.length} of ${TRANSACTIONS.length}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order, buyer, product…"
                className="h-10 w-52 rounded-lg border border-navy/12 bg-white pl-9 pr-3 text-[13px] outline-none focus:border-orange"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-lg border border-navy/12 bg-white px-3 text-[13px] outline-none focus:border-orange"
            >
              <option value="All">All payouts</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="paid">Paid</option>
            </select>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-navy/12 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-navy/65 hover:border-orange hover:text-orange"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-navy/8 text-left text-[11.5px] font-semibold uppercase tracking-wide text-navy/45">
                <th className="py-2.5">Order ID</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Buyer</th>
                <th className="py-2.5">Product</th>
                <th className="py-2.5 text-right">Amount</th>
                <th className="py-2.5 text-right">Platform fee</th>
                <th className="py-2.5 text-right">Net earning</th>
                <th className="py-2.5 pl-4">Payout</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.orderId} className="border-b border-navy/5 last:border-0 hover:bg-surface">
                  <td className="py-3 text-[12.5px] font-semibold text-navy">{t.orderId}</td>
                  <td className="py-3 text-[12.5px] text-navy/55">{t.date}</td>
                  <td className="py-3 text-[12.5px] text-navy/70">{t.buyer}</td>
                  <td className="max-w-[220px] truncate py-3 text-[12.5px] text-navy/55">{t.product}</td>
                  <td className="py-3 text-right text-[12.5px] font-semibold text-navy">{inr(t.amount)}</td>
                  <td className="py-3 text-right text-[12.5px] text-navy/45">−{inr(t.commission)}</td>
                  <td className="py-3 text-right text-[13px] font-bold text-emerald-700">{inr(t.net)}</td>
                  <td className="py-3 pl-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${PAYOUT_BADGE[t.payoutStatus]}`}>
                      {t.payoutStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Payout History"
        subtitle={`Payouts run every ${PAYOUT_SCHEDULE_DAYS} days for delivered orders`}
        action={
          <div className="flex items-center gap-2 rounded-lg border border-orange/30 bg-orange-light/60 px-3.5 py-2">
            <Clock className="h-4 w-4 text-orange" />
            <span className="text-[12.5px] font-semibold text-navy">
              Next payout {nextPayout.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-navy/8 text-left text-[11.5px] font-semibold uppercase tracking-wide text-navy/45">
                <th className="py-2.5">Payout ID</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5 text-right">Amount</th>
                <th className="py-2.5">Orders</th>
                <th className="py-2.5">Account</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p) => (
                <tr key={p.payoutId} className="border-b border-navy/5 last:border-0 hover:bg-surface">
                  <td className="py-3 text-[12.5px] font-semibold text-navy">{p.payoutId}</td>
                  <td className="py-3 text-[12.5px] text-navy/55">{p.date}</td>
                  <td className="py-3 text-right text-[13px] font-bold text-navy">{inr(p.amount)}</td>
                  <td className="py-3 text-[12.5px] text-navy/55">{p.orders}</td>
                  <td className="py-3 text-[12.5px] text-navy/55">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-navy/35" />
                      •••• {p.accountLast4}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${PAYOUT_BADGE[p.status] || PAYOUT_BADGE.paid}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
