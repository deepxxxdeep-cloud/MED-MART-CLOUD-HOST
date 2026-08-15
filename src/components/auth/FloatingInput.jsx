import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Floating-label field: the label sits inside the input until it has focus
// or a value, then rises and turns orange. Errors shake the field once.
export default function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
  trailing,
  optional = false,
  ...rest
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const floated = focused || String(value ?? "").length > 0;

  return (
    <div>
      <motion.div
        animate={error ? { x: [0, -7, 6, -4, 0] } : { x: 0 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
        className="relative"
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`peer h-14 w-full rounded-xl border bg-white/70 px-4 pt-5 pb-1.5 text-[15px] text-navy outline-none transition-all duration-300 ease-premium
            ${trailing ? "pr-12" : ""}
            ${
              error
                ? "border-red-400 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                : "border-navy/15 focus:border-orange focus:shadow-[0_0_0_4px_rgba(242,101,34,0.13)]"
            }`}
          {...rest}
        />

        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 origin-left transition-all duration-300 ease-premium
            ${floated ? "top-2 text-[11px] font-semibold tracking-wide" : "top-1/2 -translate-y-1/2 text-[15px]"}
            ${error ? "text-red-500" : focused ? "text-orange" : "text-navy/45"}`}
        >
          {label}
          {optional && <span className="ml-1 font-normal text-navy/30">(optional)</span>}
        </label>

        {trailing && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden pl-1 pt-1.5 text-xs font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
