import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";

/** Persistent reassurance above every conversation. */
export function SafetyBanner() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-navy/10 bg-navy/[0.03] px-3.5 py-2.5">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
      <p className="text-[11.5px] leading-relaxed text-navy/60">
        All communication and payments are protected when you stay on Med-Mart. Sharing contact
        details or moving the deal off the platform isn't allowed and removes your buyer and
        seller protection.
      </p>
    </div>
  );
}

/**
 * Shown when a message is refused. Amber and explanatory rather than red —
 * most people trip this by habit, not by malice, and a punitive tone on a
 * first offence just makes the platform feel hostile.
 */
export function BlockedNotice({ verdict, violations }) {
  return (
    <AnimatePresence>
      {verdict && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-3 rounded-xl border border-amber-300/70 bg-amber-50/80 px-3.5 py-3 backdrop-blur">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-amber-900">
                Message not sent — {verdict.reason}
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-amber-800/85">
                For your safety, sharing contact details or external links isn't allowed. Keeping
                communication and payment on Med-Mart is what protects your order, your warranty
                and your money if anything goes wrong.
              </p>
              {violations >= 2 && (
                <p className="mt-1.5 text-[11.5px] font-semibold text-amber-900">
                  {violations >= 3
                    ? "Your account has been flagged for review after repeated attempts."
                    : `This is attempt ${violations} of 3 — a third will flag your account for review.`}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
