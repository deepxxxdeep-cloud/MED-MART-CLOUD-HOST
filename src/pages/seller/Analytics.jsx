import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { CategoryDonut } from "../../components/seller/AnalyticsChart";
import { FUNNEL, GEO_SPLIT, INQUIRY_SERIES } from "../../data/sellerData";

const RANGES = [
  { key: 7, label: "7 Days" },
  { key: 30, label: "30 Days" },
  { key: 90, label: "90 Days" },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-navy/10 bg-white px-3 py-2 shadow-elevated">
      <p className="text-[11px] font-semibold text-navy/50">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-[13px] font-bold text-navy">
          {p.value.toLocaleString("en-IN")}{" "}
          <span className="font-medium text-navy/50">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

function Panel({ title, subtitle, children, action }) {
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

export default function Analytics() {
  const [range, setRange] = useState(30);
  const data = INQUIRY_SERIES.slice(-range);
  const tickGap = Math.ceil(data.length / 6);
  const maxFunnel = FUNNEL[0].value;
  const maxGeo = Math.max(...GEO_SPLIT.map((g) => g.inquiries));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-navy/10 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-md px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                range === r.key
                  ? "bg-gradient-to-b from-orange to-orange-dark text-white shadow-glow-orange"
                  : "text-navy/50 hover:text-navy"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy/65 transition-colors hover:border-orange hover:text-orange">
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      <Panel title="Profile & Product Views" subtitle={`Last ${range} days`}>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B2A6B" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#1B2A6B" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2A6B12" vertical={false} />
              <XAxis
                dataKey="label"
                interval={tickGap - 1}
                tick={{ fontSize: 11, fill: "#1B2A6B80" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="views" name="views" stroke="#1B2A6B" strokeWidth={2.5} fill="url(#viewsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Inquiry Conversion Funnel" subtitle="From first view to closed deal">
          <ul className="space-y-3">
            {FUNNEL.map((f, i) => (
              <li key={f.stage}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span className="font-medium text-navy/65">{f.stage}</span>
                  <span className="font-bold text-navy">{f.value.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-navy/6">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark"
                    style={{ width: `${(f.value / maxFunnel) * 100}%`, opacity: 1 - i * 0.13 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <CategoryDonut />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Category-wise Performance" subtitle="Inquiries received per category">
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GEO_SPLIT} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B2A6B12" vertical={false} />
                <XAxis dataKey="state" tick={{ fontSize: 10, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" height={54} />
                <YAxis tick={{ fontSize: 11, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F2652210" }} />
                <Bar dataKey="inquiries" name="inquiries" radius={[6, 6, 0, 0]}>
                  {GEO_SPLIT.map((_, i) => (
                    <Cell key={i} fill={i % 2 ? "#1B2A6B" : "#F26522"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Where Buyers Are" subtitle="Inquiries by state">
          <ul className="space-y-2.5">
            {GEO_SPLIT.map((g) => (
              <li key={g.state} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[12.5px] font-medium text-navy/65">{g.state}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy/6">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark"
                    style={{ width: `${(g.inquiries / maxGeo) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[12.5px] font-bold text-navy">
                  {g.inquiries}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
