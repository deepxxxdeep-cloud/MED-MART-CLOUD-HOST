import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Package, Wallet } from "lucide-react";
import { BUY_REQUIREMENTS, SELLER_PRODUCTS } from "../../data/sellerData";

const ease = [0.22, 1, 0.36, 1];

export default function BuyRequirements() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [quoted, setQuoted] = useState([]);

  // Categories this seller actually lists in — a requirement is "matching"
  // when it falls inside one of them.
  const myCategories = useMemo(
    () => new Set(SELLER_PRODUCTS.map((p) => p.category)),
    []
  );

  const categories = useMemo(
    () => ["All", ...new Set(BUY_REQUIREMENTS.map((r) => r.category))],
    []
  );

  const list = useMemo(() => {
    const filtered = BUY_REQUIREMENTS.filter(
      (r) => category === "All" || r.category === category
    );
    return [...filtered].sort((a, b) =>
      sort === "newest"
        ? a.hoursAgo - b.hoursAgo
        : Number(myCategories.has(b.category)) - Number(myCategories.has(a.category))
    );
  }, [category, sort, myCategories]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-lg border border-navy/12 bg-white px-3 text-[13px] text-navy outline-none focus:border-orange"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 rounded-lg border border-navy/12 bg-white px-3 text-[13px] text-navy outline-none focus:border-orange"
        >
          <option value="newest">Newest first</option>
          <option value="relevance">Best match</option>
        </select>
        <p className="ml-auto text-[12.5px] text-navy/45">
          {list.length} open requirement{list.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((r, i) => {
          const matches = myCategories.has(r.category);
          const sent = quoted.includes(r.id);
          return (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease }}
              className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft transition-shadow hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[14px] font-semibold leading-snug text-navy">{r.title}</h3>
                {matches && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold text-emerald-700 ring-1 ring-emerald-500/25">
                    Matches you
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-[12px] font-medium text-orange">{r.category}</p>

              <div className="mt-3 grid grid-cols-2 gap-2.5 text-[12px] text-navy/55">
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 shrink-0 text-navy/35" />
                  {r.quantity.toLocaleString("en-IN")} {r.unit}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-navy/35" />
                  {r.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 shrink-0 text-navy/35" />
                  {r.budget}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-navy/35" />
                  {r.hoursAgo}h ago
                </span>
              </div>

              <button
                onClick={() => setQuoted((q) => (q.includes(r.id) ? q : [...q, r.id]))}
                disabled={sent}
                className={`mt-4 w-full rounded-lg py-2.5 text-[13px] font-semibold transition-all ${
                  sent
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gradient-to-b from-orange to-orange-dark text-white shadow-glow-orange hover:scale-[1.01] active:scale-95"
                }`}
              >
                {sent ? "Quote submitted" : "Submit Quote"}
              </button>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
