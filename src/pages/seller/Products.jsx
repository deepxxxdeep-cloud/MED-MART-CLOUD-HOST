import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Edit3,
  Grid2x2,
  List,
  Plus,
  Search,
  Trash2,
  Eye,
  MessagesSquare,
} from "lucide-react";
import { SELLER_PRODUCTS } from "../../data/sellerData";
import { formatINR } from "../../data/buyerData";

const PER_PAGE = 8;

const STATUS = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-emerald-500/25" },
  draft: { label: "Draft", cls: "bg-navy/5 text-navy/60 ring-navy/15" },
  "out-of-stock": { label: "Out of Stock", cls: "bg-orange-light text-orange ring-orange/30" },
};

function StatusBadge({ status }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${s.cls}`}>
      {s.label}
    </span>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
        on ? "bg-gradient-to-r from-orange to-orange-dark" : "bg-navy/15"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${on ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

export default function Products() {
  const [items, setItems] = useState(SELLER_PRODUCTS);
  const [view, setView] = useState("list");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => ["All", ...new Set(SELLER_PRODUCTS.map((p) => p.category))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (category === "All" || p.category === category) &&
        (status === "All" || p.status === status)
    );
  }, [items, query, category, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const allShownSelected = visible.length > 0 && visible.every((p) => selected.includes(p.id));

  const toggleSelect = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleSelectAll = () =>
    setSelected((s) =>
      allShownSelected
        ? s.filter((id) => !visible.some((p) => p.id === id))
        : [...new Set([...s, ...visible.map((p) => p.id)])]
    );

  const bulkDelete = () => {
    setItems((list) => list.filter((p) => !selected.includes(p.id)));
    setSelected([]);
  };

  const bulkActivate = () => {
    setItems((list) =>
      list.map((p) => (selected.includes(p.id) ? { ...p, status: "active" } : p))
    );
    setSelected([]);
  };

  const toggleStatus = (id) =>
    setItems((list) =>
      list.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "draft" : "active" } : p
      )
    );

  const resetPage = (fn) => (v) => {
    fn(v);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/seller/products/add"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>

        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
          <input
            value={query}
            onChange={(e) => resetPage(setQuery)(e.target.value)}
            placeholder="Search products…"
            className="h-10 w-full rounded-lg border border-navy/12 bg-white pl-9 pr-3 text-[13px] text-navy outline-none focus:border-orange"
          />
        </div>

        <select
          value={category}
          onChange={(e) => resetPage(setCategory)(e.target.value)}
          className="h-10 rounded-lg border border-navy/12 bg-white px-3 text-[13px] text-navy outline-none focus:border-orange"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => resetPage(setStatus)(e.target.value)}
          className="h-10 rounded-lg border border-navy/12 bg-white px-3 text-[13px] text-navy outline-none focus:border-orange"
        >
          <option value="All">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <div className="ml-auto flex gap-1 rounded-lg border border-navy/12 bg-white p-1">
          {[
            ["list", List],
            ["grid", Grid2x2],
          ].map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              aria-label={`${key} view`}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                view === key ? "bg-orange text-white" : "text-navy/45 hover:text-navy"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions appear only with a selection */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-orange/30 bg-orange-light/60 px-4 py-3"
        >
          <span className="text-[13px] font-semibold text-navy">
            {selected.length} selected
          </span>
          <button
            onClick={bulkActivate}
            className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-navy shadow-soft hover:text-orange"
          >
            Activate
          </button>
          <button
            onClick={bulkDelete}
            className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-red-600 shadow-soft"
          >
            Delete
          </button>
          <button
            onClick={() => setSelected([])}
            className="ml-auto text-[12px] font-medium text-navy/50 hover:text-navy"
          >
            Clear
          </button>
        </motion.div>
      )}

      {/* List view — a real table on desktop, cards on mobile */}
      {view === "list" ? (
        <div className="overflow-hidden rounded-2xl border border-navy/8 bg-white shadow-soft">
          <table className="hidden w-full md:table">
            <thead>
              <tr className="border-b border-navy/8 text-left text-[11.5px] font-semibold uppercase tracking-wide text-navy/45">
                <th className="w-10 py-3 pl-4">
                  <input
                    type="checkbox"
                    checked={allShownSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 accent-orange"
                    aria-label="Select all on this page"
                  />
                </th>
                <th className="py-3">Product</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Status</th>
                <th className="py-3">Views</th>
                <th className="py-3">Inquiries</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-b border-navy/5 last:border-0 hover:bg-surface">
                  <td className="py-3 pl-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="h-4 w-4 accent-orange"
                      aria-label={`Select ${p.name}`}
                    />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.photo} alt="" loading="lazy" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="max-w-[240px] truncate text-[13px] font-medium text-navy">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-[12.5px] text-navy/55">{p.category}</td>
                  <td className="py-3 text-[13px] font-semibold text-navy">{formatINR(p.price)}</td>
                  <td className="py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3 text-[12.5px] text-navy/55">{p.views.toLocaleString("en-IN")}</td>
                  <td className="py-3 text-[12.5px] font-semibold text-orange">{p.inquiries}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <Toggle on={p.status === "active"} onChange={() => toggleStatus(p.id)} />
                      <button
                        aria-label="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-navy/45 hover:bg-orange-light hover:text-orange"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setItems((l) => l.filter((x) => x.id !== p.id))}
                        aria-label="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-navy/45 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards — a table can't stay readable at 375px */}
          <ul className="divide-y divide-navy/5 md:hidden">
            {visible.map((p) => (
              <li key={p.id} className="flex gap-3 p-3">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-orange"
                  aria-label={`Select ${p.name}`}
                />
                <img src={p.photo} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-navy">{p.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-navy/50">{p.category}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-navy">{formatINR(p.price)}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[11.5px] text-navy/50">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {p.views.toLocaleString("en-IN")}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-orange">
                      <MessagesSquare className="h-3.5 w-3.5" />
                      {p.inquiries}
                    </span>
                    <Toggle on={p.status === "active"} onChange={() => toggleStatus(p.id)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visible.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border border-navy/8 bg-white shadow-soft transition-shadow hover:shadow-elevated"
            >
              <div className="relative">
                <img src={p.photo} alt="" loading="lazy" className="h-28 w-full object-cover" />
                <span className="absolute left-2 top-2">
                  <StatusBadge status={p.status} />
                </span>
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="absolute right-2 top-2 h-4 w-4 accent-orange"
                  aria-label={`Select ${p.name}`}
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-2 min-h-9 text-[12.5px] font-medium text-navy">{p.name}</p>
                <p className="mt-1 text-[13px] font-semibold text-navy">{formatINR(p.price)}</p>
                <div className="mt-2 flex items-center justify-between text-[11.5px] text-navy/50">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {p.views.toLocaleString("en-IN")}
                  </span>
                  <Toggle on={p.status === "active"} onChange={() => toggleStatus(p.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-navy/45">
          Showing {visible.length} of {filtered.length} products
        </p>
        {pages > 1 && (
          <div className="flex gap-1.5">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-9 w-9 rounded-lg text-[13px] font-semibold transition-colors ${
                  n === current
                    ? "bg-gradient-to-b from-orange to-orange-dark text-white shadow-glow-orange"
                    : "border border-navy/12 bg-white text-navy/60 hover:border-orange hover:text-orange"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
