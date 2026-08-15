import { motion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1];

export const BADGE = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  verified: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  pending: "bg-orange-light text-orange ring-orange/30",
  processing: "bg-orange-light text-orange ring-orange/30",
  shipped: "bg-blue-50 text-blue-700 ring-blue-500/25",
  banned: "bg-red-50 text-red-600 ring-red-500/25",
  rejected: "bg-red-50 text-red-600 ring-red-500/25",
  failed: "bg-red-50 text-red-600 ring-red-500/25",
  cancelled: "bg-navy/5 text-navy/55 ring-navy/15",
};

export function Pill({ status, children }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${BADGE[status] || BADGE.cancelled}`}>
      {children || status}
    </span>
  );
}

export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-navy/8 bg-white shadow-soft ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/8 p-5">
          <div>
            {title && <h2 className="font-display text-[15px] font-semibold text-navy">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[12px] text-navy/45">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Table({ head, children, minWidth = 900 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-navy/8 text-left text-[11px] font-semibold uppercase tracking-wide text-navy/45">
            {head.map((h, i) => (
              <th key={i} className={`px-4 py-3 ${h.right ? "text-right" : ""}`}>{h.label ?? h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const Row = ({ children }) => (
  <tr className="border-b border-navy/5 text-[12.5px] last:border-0 hover:bg-surface">{children}</tr>
);

export const Cell = ({ children, right, bold, muted, className = "" }) => (
  <td className={`px-4 py-3 ${right ? "text-right" : ""} ${bold ? "font-semibold text-navy" : muted ? "text-navy/50" : "text-navy/75"} ${className}`}>
    {children}
  </td>
);

export const Fade = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }} className={className}>
    {children}
  </motion.div>
);

export const Search = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className="h-10 w-full rounded-lg border border-navy/12 bg-white px-3 text-[13px] outline-none focus:border-orange sm:w-64" />
);

export const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    className="h-10 rounded-lg border border-navy/12 bg-white px-3 text-[13px] text-navy outline-none focus:border-orange">
    {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);
