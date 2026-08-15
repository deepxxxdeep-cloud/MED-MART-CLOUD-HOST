import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Check, Package, Truck } from "lucide-react";
import Logo from "../components/Logo";

const ease = [0.22, 1, 0.36, 1];

export default function OrderSuccess() {
  const { orderId } = useParams();
  const eta = new Date(Date.now() + 6 * 86400000);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-5 py-12 font-sans">
      <Link to="/" className="group mb-8">
        <Logo />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="w-full max-w-md rounded-2xl border border-navy/8 bg-white p-8 text-center shadow-elevated"
      >
        <motion.div
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_10px_30px_-6px_rgba(16,185,129,0.6)]"
        >
          <Check className="h-8 w-8 text-white" strokeWidth={3.5} />
        </motion.div>

        <h1 className="mt-6 font-display text-2xl font-semibold text-navy">Order confirmed</h1>
        <p className="mt-2 text-[13.5px] font-light leading-relaxed text-navy/55">
          Payment received. The seller has been notified and will begin processing your order.
        </p>

        <div className="mt-6 rounded-xl border border-navy/8 bg-surface p-4 text-left">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-navy/45">Order ID</p>
          <p className="mt-0.5 font-display text-[15px] font-semibold text-navy">{orderId}</p>

          <div className="mt-3 flex items-center gap-2 border-t border-navy/8 pt-3 text-[12.5px] text-navy/55">
            <Truck className="h-4 w-4 shrink-0 text-orange" />
            Estimated delivery by {eta.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-navy/55">
            <Package className="h-4 w-4 shrink-0 text-orange" />
            Tracking details appear here once the seller ships
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange"
          >
            View my orders
          </Link>
          <Link
            to="/shop"
            className="rounded-lg border border-navy/12 px-5 py-2.5 text-[13px] font-semibold text-navy/65 hover:border-orange hover:text-orange"
          >
            Keep browsing
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
