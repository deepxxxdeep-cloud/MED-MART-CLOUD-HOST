import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, Check, Search } from "lucide-react";
import { TRANSACTIONS } from "../../data/sellerData";

const FLOW = ["confirmed", "processing", "shipped", "delivered"];

const BADGE = {
  confirmed: "bg-navy/5 text-navy/60 ring-navy/15",
  processing: "bg-orange-light text-orange ring-orange/30",
  shipped: "bg-blue-50 text-blue-700 ring-blue-500/25",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  cancelled: "bg-red-50 text-red-600 ring-red-500/25",
};

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function Orders() {
  const [orders, setOrders] = useState(() =>
    TRANSACTIONS.map((t) => ({ ...t, tracking: t.orderStatus === "shipped" ? "BLR" + t.orderId.slice(-6) : "" }))
  );
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "All" || o.orderStatus === filter) &&
        (!q || o.orderId.toLowerCase().includes(q) || o.buyer.toLowerCase().includes(q))
    );
  }, [orders, filter, query]);

  // Statuses only move forward — a delivered order can't be walked back,
  // which would reopen a payout that has already been scheduled.
  const advance = (orderId) =>
    setOrders((list) =>
      list.map((o) => {
        if (o.orderId !== orderId) return o;
        const next = FLOW[Math.min(FLOW.indexOf(o.orderStatus) + 1, FLOW.length - 1)];
        return {
          ...o,
          orderStatus: next,
          payoutStatus: next === "delivered" ? "scheduled" : o.payoutStatus,
          tracking: next === "shipped" && !o.tracking ? "BLR" + orderId.slice(-6) : o.tracking,
        };
      })
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg border border-navy/10 bg-white p-1">
          {["All", ...FLOW].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-md px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-colors ${
                filter === f ? "text-white" : "text-navy/50 hover:text-navy"
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="orders-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-md bg-gradient-to-b from-orange to-orange-dark shadow-glow-orange"
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order or buyer…"
            className="h-10 w-56 rounded-lg border border-navy/12 bg-white pl-9 pr-3 text-[13px] outline-none focus:border-orange"
          />
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((o) => (
          <div key={o.orderId} className="rounded-2xl border border-navy/8 bg-white p-4 shadow-soft sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13.5px] font-semibold text-navy">{o.orderId}</p>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${BADGE[o.orderStatus]}`}>
                    {o.orderStatus}
                  </span>
                </div>
                <p className="mt-1 truncate text-[12.5px] text-navy/55">{o.product}</p>
                <p className="mt-0.5 text-[12px] text-navy/45">
                  {o.buyer} · {o.date}
                </p>
              </div>

              <div className="text-right">
                <p className="font-display text-[15px] font-semibold text-navy">{inr(o.amount)}</p>
                <p className="text-[11.5px] text-navy/45">
                  net {inr(o.net)} after {inr(o.commission)} fee
                </p>
              </div>
            </div>

            {/* Fulfilment progress */}
            <div className="mt-4 flex items-center gap-1.5">
              {FLOW.map((s, i) => {
                const reached = FLOW.indexOf(o.orderStatus) >= i;
                return (
                  <div key={s} className="flex flex-1 items-center gap-1.5">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        reached ? "bg-gradient-to-b from-orange to-orange-dark text-white" : "bg-navy/8 text-navy/35"
                      }`}
                    >
                      {reached ? <Check className="h-3 w-3" strokeWidth={3.5} /> : i + 1}
                    </span>
                    <span className={`hidden text-[11px] capitalize sm:inline ${reached ? "font-semibold text-navy/70" : "text-navy/35"}`}>
                      {s}
                    </span>
                    {i < FLOW.length - 1 && (
                      <span className={`h-0.5 flex-1 rounded ${FLOW.indexOf(o.orderStatus) > i ? "bg-orange" : "bg-navy/8"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-navy/6 pt-3.5">
              {o.tracking && (
                <span className="flex items-center gap-1.5 text-[12px] text-navy/55">
                  <Truck className="h-3.5 w-3.5 text-orange" />
                  Tracking <span className="font-semibold text-navy">{o.tracking}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[12px] text-navy/55">
                <Package className="h-3.5 w-3.5 text-navy/35" />
                Payout <span className="font-semibold capitalize text-navy">{o.payoutStatus}</span>
              </span>

              {o.orderStatus !== "delivered" && (
                <button
                  onClick={() => advance(o.orderId)}
                  className="ml-auto rounded-lg bg-gradient-to-b from-orange to-orange-dark px-4 py-2 text-[12.5px] font-semibold text-white shadow-glow-orange"
                >
                  Mark as {FLOW[FLOW.indexOf(o.orderStatus) + 1]}
                </button>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="rounded-2xl border border-navy/8 bg-white p-10 text-center text-[13px] text-navy/40">
            No orders match that filter.
          </p>
        )}
      </div>
    </div>
  );
}
