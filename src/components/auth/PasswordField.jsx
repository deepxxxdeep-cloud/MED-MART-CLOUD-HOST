import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import FloatingInput from "./FloatingInput";

// Mirrors the server's rules in server/src/routes/auth.routes.js
export function scorePassword(pw) {
  if (!pw) return { score: 0, label: "", checks: {} };
  const checks = {
    length: pw.length >= 8,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const label = score <= 2 ? "Weak" : score === 3 || score === 4 ? "Medium" : "Strong";
  return { score, label, checks };
}

const TONE = {
  Weak: { bar: "bg-red-500", text: "text-red-500" },
  Medium: { bar: "bg-amber-500", text: "text-amber-600" },
  Strong: { bar: "bg-emerald-500", text: "text-emerald-600" },
};

export default function PasswordField({ label = "Password", value, onChange, error, showStrength = false, autoComplete }) {
  const [visible, setVisible] = useState(false);
  const { score, label: strength } = scorePassword(value);
  const tone = TONE[strength] || TONE.Weak;

  return (
    <div>
      <FloatingInput
        label={label}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        autoComplete={autoComplete}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-navy/40 transition-colors hover:text-orange"
          >
            {visible ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        }
      />

      <AnimatePresence>
        {showStrength && value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 pt-2.5">
              <div className="flex h-1.5 flex-1 gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-1 overflow-hidden rounded-full bg-navy/10">
                    <motion.div
                      initial={false}
                      animate={{ scaleX: i < score ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originX: 0 }}
                      className={`h-full w-full ${tone.bar}`}
                    />
                  </div>
                ))}
              </div>
              <span className={`w-14 text-right text-[11px] font-semibold ${tone.text}`}>
                {strength}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
