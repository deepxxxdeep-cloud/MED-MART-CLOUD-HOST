import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

/** Custom checkbox — the native input stays for a11y but is visually replaced. */
export function Checkbox({ checked, onChange, error, children }) {
  const id = useId();
  return (
    <div>
      <motion.label
        htmlFor={id}
        animate={error ? { x: [0, -6, 5, -3, 0] } : { x: 0 }}
        transition={{ duration: 0.38 }}
        className="flex cursor-pointer items-start gap-3 select-none"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ease-premium
            ${
              checked
                ? "border-transparent bg-gradient-to-b from-orange to-orange-dark shadow-glow-orange"
                : error
                  ? "border-red-400 bg-white"
                  : "border-navy/25 bg-white"
            }`}
        >
          <AnimatePresence>
            {checked && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease }}
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="text-[13px] leading-relaxed text-navy/65">{children}</span>
      </motion.label>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pl-8 pt-1 text-xs font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Styled dropdown — replaces the native select entirely. */
export function Select({ label, value, onChange, options, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        animate={error ? { x: [0, -7, 6, -4, 0] } : { x: 0 }}
        transition={{ duration: 0.38 }}
        className={`flex h-14 w-full items-center justify-between rounded-xl border bg-white/70 px-4 text-left transition-all duration-300 ease-premium
          ${
            error
              ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
              : open
                ? "border-orange shadow-[0_0_0_4px_rgba(242,101,34,0.13)]"
                : "border-navy/15"
          }`}
      >
        <span className="flex flex-col">
          <span className={`text-[11px] font-semibold tracking-wide ${value ? "text-orange" : "text-navy/45"}`}>
            {label}
          </span>
          {value && <span className="text-[15px] text-navy">{value}</span>}
        </span>
        <ChevronDown
          className={`h-4.5 w-4.5 text-navy/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-auto rounded-xl border border-navy/10 bg-white py-1.5 shadow-elevated"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-orange-light hover:text-orange
                    ${opt === value ? "font-semibold text-orange" : "text-navy/75"}`}
                >
                  {opt}
                  {opt === value && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pl-1 pt-1.5 text-xs font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Pill tab switcher with a sliding active indicator (shared layoutId). */
export function Tabs({ tabs, active, onChange, idPrefix }) {
  return (
    <div className="flex gap-1 rounded-xl border border-navy/10 bg-navy/[0.04] p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="relative flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-200"
          >
            {isActive && (
              <motion.span
                layoutId={`${idPrefix}-tab-pill`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-white shadow-soft"
              />
            )}
            <span
              className={`relative flex items-center justify-center gap-1.5 ${isActive ? "text-orange" : "text-navy/50"}`}
            >
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Full-width gradient submit with hover shine + loading state. */
export function SubmitButton({ loading, children, ...rest }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={loading ? undefined : { scale: 1.02 }}
      whileTap={loading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease }}
      className="group relative h-13 w-full overflow-hidden rounded-xl bg-gradient-to-b from-orange to-orange-dark py-3.5 text-[15px] font-semibold text-white shadow-glow-orange disabled:opacity-70"
      {...rest}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center justify-center gap-2">
        {loading && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
        {children}
      </span>
    </motion.button>
  );
}
