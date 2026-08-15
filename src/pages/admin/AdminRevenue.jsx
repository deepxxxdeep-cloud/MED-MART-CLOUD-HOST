import { useMemo, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Check, Loader2, Percent, Wallet, AlertTriangle, Download } from "lucide-react";
import {
  COMMISSION_RATE, PAYOUT_LOG, PENDING_PAYOUTS, PLATFORM_SERIES, inr, inrShort,
} from "../../data/adminData";
import { Panel, Table, Row, Cell, Pill, Fade } from "./_shared";

const GRAINS = ["daily", "weekly", "monthly"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-navy/10 bg-white px-3 py-2 shadow-elevated">
      <p className="text-[11px] font-semibold text-navy/50">{label}</p>
      <p className="text-[13px] font-bold text-navy">GMV {inr(p.gmv)}</p>
      <p className="text-[13px] font-bold text-orange">Commission {inr(p.commission)}</p>
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
    const b = buckets.get(key) || { label: key, gmv: 0, commission: 0 };
    b.gmv += d.gmv; b.commission += d.commission;
    buckets.set(key, b);
  }
  const out = [...buckets.values()];
  return grain === "weekly"
    ? out.map((b) => ({ ...b, label: new Date(b.label).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) }))
    : out;
}

export default function AdminRevenue() {
  const [grain, setGrain] = useState("daily");
  const [rate, setRate] = useState(Math.round(COMMISSION_RATE * 100));
  const [payouts, setPayouts] = useState(PENDING_PAYOUTS);
  const [busy, setBusy] = useState(null);

  const data = useMemo(() => aggregate(PLATFORM_SERIES, grain), [grain]);

  const totals = useMemo(() => {
    const gmv = PLATFORM_SERIES.reduce((s, d) => s + d.gmv, 0);
    const commission = PLATFORM_SERIES.reduce((s, d) => s + d.commission, 0);
    const paid = payouts.reduce((s, p) => s + p.paid, 0);
    const pending = payouts.reduce((s, p) => s + p.pending, 0);
    return { gmv, commission, paid, pending };
  }, [payouts]);

  const process = async (ids) => {
    setBusy(ids.join(","));
    await new Promise((r) => setTimeout(r, 900));
    setPayouts((l) => l.map((p) => (ids.includes(p.sellerId) && p.verified ? { ...p, paid: p.paid + p.pending, pending: 0 } : p)));
    setBusy(null);
  };

  const eligible = payouts.filter((p) => p.verified && p.pending > 0);

  return (
    <Fade className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total GMV", inrShort(totals.gmv), "all sales on platform", "text-navy"],
          ["Commission earned", inrShort(totals.commission), `${rate}% platform fee`, "text-orange"],
          ["Paid to sellers", inrShort(totals.paid), "settled", "text-navy"],
          ["Pending payouts", inrShort(totals.pending), `${eligible.length} sellers eligible`, "text-orange"],
        ].map(([label, value, sub, tone]) => (
          <div key={label} className="rounded-xl border border-navy/8 bg-white p-4 shadow-soft">
            <p className="text-[11.5px] font-medium text-navy/45">{label}</p>
            <p className={`mt-1.5 font-display text-xl font-semibold ${tone}`}>{value}</p>
            <p className="mt-0.5 text-[11px] text-navy/45">{sub}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Commission Earned Over Time"
        subtitle="Platform revenue against total marketplace volume"
        action={
          <div className="flex gap-1 rounded-lg border border-navy/10 bg-surface p-1">
            {GRAINS.map((g) => (
              <button key={g} onClick={() => setGrain(g)} className={`rounded-md px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors ${grain === g ? "bg-white text-orange shadow-soft" : "text-navy/50 hover:text-navy"}`}>{g}</button>
            ))}
          </div>
        }
      >
        <div className="h-72 w-full p-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id="admGmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B2A6B" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1B2A6B" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="admCom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F26522" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#F26522" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2A6B12" vertical={false} />
              <XAxis dataKey="label" interval={Math.max(0, Math.ceil(data.length / 7) - 1)} tick={{ fontSize: 11, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={inrShort} tick={{ fontSize: 11, fill: "#1B2A6B80" }} axisLine={false} tickLine={false} width={58} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="gmv" name="GMV" stroke="#1B2A6B" strokeWidth={2.5} fill="url(#admGmv)" />
              <Area type="monotone" dataKey="commission" name="Commission" stroke="#F26522" strokeWidth={2.5} fill="url(#admCom)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Commission Settings" subtitle="Applies to future orders only — existing orders keep the rate they were placed at">
        <div className="flex flex-wrap items-end gap-4 p-5">
          <label className="block">
            <span className="text-[12px] font-semibold text-navy/60">Global platform fee</span>
            <div className="relative mt-1.5">
              <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="h-11 w-36 rounded-lg border border-navy/12 px-3 pr-8 text-[13.5px] outline-none focus:border-orange" />
              <Percent className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-navy/35" />
            </div>
          </label>
          <button className="rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange">Save rate</button>
          <p className="text-[11.5px] text-navy/45">Category-specific overrides can be added on top of this default.</p>
        </div>
      </Panel>

      <Panel
        title="Seller Payouts"
        subtitle={`${eligible.length} sellers eligible for settlement`}
        action={
          <button
            onClick={() => process(eligible.map((p) => p.sellerId))}
            disabled={!eligible.length || busy}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            Process all pending
          </button>
        }
      >
        <Table minWidth={980} head={["Seller", { label: "Total earnings", right: true }, { label: "Paid out", right: true }, { label: "Pending", right: true }, "Bank account", "Last payout", { label: "Action", right: true }]}>
          {payouts.map((p) => (
            <Row key={p.sellerId}>
              <Cell bold>{p.seller}</Cell>
              <Cell right muted>{inr(p.earnings)}</Cell>
              <Cell right muted>{inr(p.paid)}</Cell>
              <Cell right bold className="text-orange">{inr(p.pending)}</Cell>
              <Cell muted>
                {p.verified ? (
                  <span className="flex items-center gap-1.5">••••{p.account}</span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" /> Not verified
                  </span>
                )}
              </Cell>
              <Cell muted>{p.lastPayout}</Cell>
              <Cell right>
                <button
                  onClick={() => process([p.sellerId])}
                  disabled={!p.verified || !p.pending || busy}
                  className="rounded-lg border border-navy/12 px-3 py-1.5 text-[11.5px] font-semibold text-navy/65 hover:border-orange hover:text-orange disabled:opacity-40"
                >
                  {p.pending ? "Process payout" : "Settled"}
                </button>
              </Cell>
            </Row>
          ))}
        </Table>
        <p className="border-t border-navy/8 px-5 py-3 text-[11.5px] text-navy/45">
          Sellers without verified bank details are skipped — payouts can't be released to an unverified account.
        </p>
      </Panel>

      <Panel title="Payout History" action={
        <button className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-3.5 py-2.5 text-[13px] font-semibold text-navy/65 hover:border-orange hover:text-orange">
          <Download className="h-4 w-4" /> Download report
        </button>
      }>
        <Table minWidth={760} head={["Batch ID", "Seller", { label: "Amount", right: true }, "Orders", "Account", "Date", "Status"]}>
          {PAYOUT_LOG.map((p) => (
            <Row key={p.batchId}>
              <Cell bold>{p.batchId}</Cell>
              <Cell>{p.seller}</Cell>
              <Cell right bold>{inr(p.amount)}</Cell>
              <Cell muted>{p.orders}</Cell>
              <Cell muted>••••{p.account}</Cell>
              <Cell muted>{p.date}</Cell>
              <Cell><Pill status={p.status} /></Cell>
            </Row>
          ))}
        </Table>
      </Panel>
    </Fade>
  );
}
