import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Ban, Check, ShieldAlert, ShieldCheck } from "lucide-react";
import { CHAT_FLAGS, VIOLATION_SUMMARY, timeAgo } from "../../data/adminData";
import { Panel, Pill, Fade } from "./_shared";

const TYPE_LABEL = {
  phone: "Phone number", email: "Email address",
  link: "External link", contact_keyword: "Contact keyword",
};

const TABS = [
  { key: "unreviewed", label: "Unreviewed" },
  { key: "reviewed", label: "Reviewed" },
  { key: "highrisk", label: "3+ violations" },
  { key: "all", label: "All" },
];

export default function ChatMonitoring() {
  const [flags, setFlags] = useState(CHAT_FLAGS);
  const [tab, setTab] = useState("unreviewed");
  const [acted, setActed] = useState({});

  const rows = useMemo(() => flags.filter((f) =>
    tab === "all" ? true :
    tab === "reviewed" ? f.reviewed :
    tab === "highrisk" ? f.count >= 3 :
    !f.reviewed
  ), [flags, tab]);

  const act = (id, action) => {
    setActed((a) => ({ ...a, [id]: action }));
    setFlags((l) => l.map((f) => (f.id === id ? { ...f, reviewed: true } : f)));
  };

  const todayCount = flags.filter((f) => f.mins < 1440).length;
  const topType = VIOLATION_SUMMARY[0];

  return (
    <Fade className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Flagged today", todayCount, "text-red-600"],
          ["Flagged this week", flags.length, "text-navy"],
          ["Most common", TYPE_LABEL[topType.type], "text-orange"],
          ["Users under review", flags.filter((f) => f.count >= 3).length, "text-red-600"],
        ].map(([label, value, tone]) => (
          <div key={label} className="rounded-xl border border-navy/8 bg-white p-4 shadow-soft">
            <p className="text-[11.5px] font-medium text-navy/45">{label}</p>
            <p className={`mt-1.5 font-display text-xl font-semibold ${tone}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-navy/10 bg-white p-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`relative shrink-0 rounded-md px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${tab === t.key ? "text-white" : "text-navy/55 hover:text-navy"}`}>
            {tab === t.key && <motion.span layoutId="chat-tab" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-md bg-gradient-to-b from-orange to-orange-dark shadow-glow-orange" />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((f) => (
          <Panel key={f.id}>
            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-navy">
                    {f.buyer} <span className="font-normal text-navy/40">↔</span> {f.seller}
                  </p>
                  <p className="mt-0.5 text-[12px] text-navy/50">{f.product}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill status="pending">{TYPE_LABEL[f.type]}</Pill>
                  {f.count >= 3 && (
                    <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 ring-1 ring-red-500/25">
                      <ShieldAlert className="h-3 w-3" />
                      {f.count} violations
                    </span>
                  )}
                  <span className="text-[11px] text-navy/40">{timeAgo(f.mins)}</span>
                </div>
              </div>

              {/* The offending message, quoted as evidence */}
              <div className="mt-3.5 rounded-lg border-l-[3px] border-amber-400 bg-amber-50/70 px-3.5 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">Blocked message</p>
                <p className="mt-1 text-[13px] text-navy/80">"{f.message}"</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-navy/6 pt-4">
                {acted[f.id] ? (
                  <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-700">
                    <Check className="h-4 w-4" /> Marked as {acted[f.id]}
                  </p>
                ) : (
                  <>
                    <button onClick={() => act(f.id, "dismissed")} className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-3.5 py-2 text-[12.5px] font-semibold text-navy/65 hover:border-emerald-400 hover:text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" /> Dismiss flag
                    </button>
                    <button onClick={() => act(f.id, "warned")} className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-3.5 py-2 text-[12.5px] font-semibold text-navy/65 hover:border-orange hover:text-orange">
                      <AlertTriangle className="h-3.5 w-3.5" /> Issue warning
                    </button>
                    <button onClick={() => act(f.id, "banned")} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-[12.5px] font-semibold text-red-600 hover:bg-red-50">
                      <Ban className="h-3.5 w-3.5" /> Ban user
                    </button>
                  </>
                )}
              </div>
            </div>
          </Panel>
        ))}
        {rows.length === 0 && <p className="rounded-2xl border border-navy/8 bg-white p-12 text-center text-[13px] text-navy/40">Nothing in this queue.</p>}
      </div>

      <Panel title="Violation breakdown" subtitle="All time">
        <ul className="space-y-2.5 p-5">
          {VIOLATION_SUMMARY.map((v) => {
            const max = VIOLATION_SUMMARY[0].count;
            return (
              <li key={v.type} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-[12.5px] font-medium text-navy/65">{v.label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy/6">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark" style={{ width: `${(v.count / max) * 100}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-[12.5px] font-bold text-navy">{v.count}</span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </Fade>
  );
}
