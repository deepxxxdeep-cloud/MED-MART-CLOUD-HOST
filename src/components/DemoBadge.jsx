import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, X, RotateCcw } from "lucide-react";
import { DEMO_MODE, resetDemo } from "../lib/demoBackend";

/**
 * Small persistent marker that this build runs on the in-browser demo backend.
 * Being explicit avoids the worst outcome of a demo: someone assuming an order
 * or account is real.
 */
export default function DemoBadge() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (!DEMO_MODE || hidden) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-2 w-[19rem] rounded-xl border border-navy/10 bg-white p-4 shadow-elevated"
          >
            <p className="font-display text-[13.5px] font-semibold text-navy">Demo mode</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-navy/55">
              No server or database is connected. Accounts, orders and payments are simulated in
              your browser and stored locally.
            </p>

            <ul className="mt-3 space-y-1.5 text-[11.5px] text-navy/60">
              <li>• Sign up with anything — the real password rules still apply</li>
              <li>• Any email logs you in; the seeded accounts below check passwords</li>
              <li>• Checkout completes without a payment gateway</li>
            </ul>

            <div className="mt-3 space-y-1 rounded-lg bg-surface p-2.5 font-mono text-[11px] text-navy/70">
              <p>buyer@demo.in · demo1234</p>
              <p>seller@demo.in · demo1234</p>
            </div>

            <button
              onClick={() => {
                resetDemo();
                window.location.href = "/";
              }}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-navy/12 py-2 text-[12px] font-semibold text-navy/65 hover:border-orange hover:text-orange"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset demo data
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full bg-navy-deep/90 px-3.5 py-2 text-[11.5px] font-semibold text-white shadow-elevated backdrop-blur transition-colors hover:bg-navy"
        >
          <Info className="h-3.5 w-3.5 text-orange" />
          Demo mode
        </button>
        <button
          onClick={() => setHidden(true)}
          aria-label="Hide demo badge"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-deep/70 text-white/70 shadow-soft backdrop-blur hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
