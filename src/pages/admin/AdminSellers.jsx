import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Ban, Check, FileText, ShieldCheck, Star, X } from "lucide-react";
import { ADMIN_SELLERS, PENDING_DOCS, inr, inrShort } from "../../data/adminData";
import { Panel, Table, Row, Cell, Pill, Search, Fade } from "./_shared";

const TABS = [
  { key: "all", label: "All Sellers" },
  { key: "pending", label: "Pending Verification" },
  { key: "verified", label: "Verified" },
  { key: "banned", label: "Banned" },
];

export default function AdminSellers() {
  const [sellers, setSellers] = useState(ADMIN_SELLERS);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return sellers.filter((x) => {
      const tabOk =
        tab === "all" ? true :
        tab === "banned" ? x.status === "banned" :
        x.verification === tab;
      return tabOk && (!s || x.businessName.toLowerCase().includes(s) || x.owner.toLowerCase().includes(s));
    });
  }, [sellers, tab, q]);

  const decide = (id, approved, why) => {
    setSellers((l) => l.map((x) => (x.id === id ? { ...x, verification: approved ? "verified" : "rejected", rejectReason: why } : x)));
    setRejecting(null);
    setReason("");
  };

  const toggleBan = (id) =>
    setSellers((l) => l.map((x) => (x.id === id ? { ...x, status: x.status === "banned" ? "active" : "banned" } : x)));

  return (
    <Fade className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-navy/10 bg-white p-1">
          {TABS.map((t) => {
            const count = t.key === "all" ? sellers.length
              : t.key === "banned" ? sellers.filter((s) => s.status === "banned").length
              : sellers.filter((s) => s.verification === t.key).length;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`relative shrink-0 rounded-md px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${tab === t.key ? "text-white" : "text-navy/55 hover:text-navy"}`}>
                {tab === t.key && <motion.span layoutId="seller-tab" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-md bg-gradient-to-b from-orange to-orange-dark shadow-glow-orange" />}
                <span className="relative">{t.label} <span className="opacity-65">({count})</span></span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto"><Search value={q} onChange={setQ} placeholder="Search business or owner…" /></div>
      </div>

      {tab === "pending" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((s) => (
            <Panel key={s.id} title={s.businessName} subtitle={`${s.owner} · ${s.category} · joined ${s.joined}`}>
              <div className="p-5">
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-navy/45">Submitted documents</p>
                <ul className="mt-2.5 space-y-2">
                  {(PENDING_DOCS[s.id] || []).map((d) => (
                    <li key={d.name} className="flex items-center gap-3 rounded-lg border border-navy/8 px-3 py-2.5">
                      <FileText className={`h-4 w-4 shrink-0 ${d.status === "uploaded" ? "text-orange" : "text-navy/25"}`} />
                      <span className="min-w-0 flex-1 truncate text-[12.5px] text-navy/75">{d.name}</span>
                      {d.status === "uploaded"
                        ? <a href="#" className="shrink-0 text-[11.5px] font-semibold text-orange hover:underline">{d.file}</a>
                        : <Pill status="pending">Missing</Pill>}
                    </li>
                  ))}
                </ul>

                {rejecting === s.id ? (
                  <div className="mt-4 space-y-2">
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="Why is this being rejected? The seller sees this." className="w-full rounded-lg border border-navy/12 px-3 py-2.5 text-[13px] outline-none focus:border-orange" />
                    <div className="flex gap-2">
                      <button disabled={!reason.trim()} onClick={() => decide(s.id, false, reason)} className="rounded-lg bg-red-600 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-40">Confirm rejection</button>
                      <button onClick={() => { setRejecting(null); setReason(""); }} className="rounded-lg border border-navy/12 px-4 py-2 text-[12.5px] font-semibold text-navy/60">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => decide(s.id, true)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2.5 text-[13px] font-semibold text-white hover:bg-emerald-700">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button onClick={() => setRejecting(s.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </Panel>
          ))}
          {rows.length === 0 && <p className="rounded-2xl border border-navy/8 bg-white p-12 text-center text-[13px] text-navy/40">Nothing awaiting verification.</p>}
        </div>
      ) : (
        <Panel>
          <Table head={["Business", "Category", "Joined", "Verification", "Products", { label: "Sales", right: true }, "Rating", "Status", { label: "Actions", right: true }]}>
            {rows.map((s) => (
              <Row key={s.id}>
                <Cell bold>
                  {s.businessName}
                  <div className="text-[11.5px] font-normal text-navy/45">{s.owner}</div>
                </Cell>
                <Cell muted>{s.category}</Cell>
                <Cell muted>{s.joined}</Cell>
                <Cell><Pill status={s.verification} /></Cell>
                <Cell>{s.products}</Cell>
                <Cell right bold>{s.sales ? inrShort(s.sales) : "—"}</Cell>
                <Cell>{s.rating ? <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{s.rating}</span> : "—"}</Cell>
                <Cell><Pill status={s.status} /></Cell>
                <Cell right>
                  <button onClick={() => toggleBan(s.id)} className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-semibold ${s.status === "banned" ? "text-emerald-700 hover:bg-emerald-50" : "text-red-600 hover:bg-red-50"}`}>
                    {s.status === "banned" ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                    {s.status === "banned" ? "Unban" : "Ban"}
                  </button>
                </Cell>
              </Row>
            ))}
          </Table>
        </Panel>
      )}
    </Fade>
  );
}
