import { useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORY_SPLIT, INQUIRY_SERIES } from "../../data/sellerData";

const RANGES = [
  { key: 7, label: "7 Days" },
  { key: 30, label: "30 Days" },
  { key: 90, label: "90 Days" },
];

// Brand palette only — no new hues introduced for the charts.
const SLICE_COLORS = ["#F26522", "#1B2A6B", "#FF9457", "#4459C9", "#C9500F"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-navy/10 bg-white px-3 py-2 shadow-elevated">
      <p className="text-[11px] font-semibold text-navy/50">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-[13px] font-bold text-navy">
          {p.value} <span className="font-medium text-navy/50">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

export function InquiriesChart() {
  const [range, setRange] = useState(30);
  const data = INQUIRY_SERIES.slice(-range);
  // A 90-day axis can't fit 90 labels; thin them to roughly six.
  const tickGap = Math.ceil(data.length / 6);

  return (
    <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-navy">Inquiries Over Time</h3>
          <p className="mt-0.5 text-[12px] text-navy/45">
            {data.reduce((s, d) => s + d.inquiries, 0)} inquiries in the last {range} days
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-navy/10 bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                range === r.key ? "bg-white text-orange shadow-soft" : "text-navy/50 hover:text-navy"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="inqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F26522" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#1B2A6B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              interval={tickGap - 1}
              tick={{ fontSize: 11, fill: "#1B2A6B80" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#1B2A6B80" }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="inquiries"
              name="inquiries"
              stroke="#F26522"
              strokeWidth={2.5}
              fill="url(#inqFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryDonut() {
  return (
    <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
      <h3 className="font-display text-[15px] font-semibold text-navy">Inquiries by Category</h3>
      <p className="mt-0.5 text-[12px] text-navy/45">Share of this month's inquiries</p>

      <div className="mt-4 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CATEGORY_SPLIT}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={2}
              stroke="none"
            >
              {CATEGORY_SPLIT.map((s, i) => (
                <Cell key={s.name} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-3 space-y-1.5">
        {CATEGORY_SPLIT.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
            />
            <span className="min-w-0 flex-1 truncate text-navy/60">{s.name}</span>
            <span className="font-bold text-navy">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
