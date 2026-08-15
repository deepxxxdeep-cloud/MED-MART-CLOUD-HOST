import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck, Truck, AlertCircle } from "lucide-react";
import { PRODUCTS, formatINR } from "../data/buyerData";
import Logo from "../components/Logo";
import { api, DEMO_MODE } from "../lib/api";

const COMMISSION_RATE = 0.06;
const inputCls =
  "mt-1.5 h-11 w-full rounded-lg border border-navy/12 bg-white px-3 text-[13.5px] text-navy outline-none transition-colors focus:border-orange";

function Field({ label, children, wide }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[12px] font-semibold text-navy/60">{label}</span>
      {children}
    </label>
  );
}

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => PRODUCTS.find((p) => String(p.id) === String(id)) || PRODUCTS[0], [id]);
  const [quantity, setQuantity] = useState(product.moq);
  const [address, setAddress] = useState({
    fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Displayed only. The server recomputes every figure from its own product
  // record before charging anything.
  const subtotal = product.price * quantity;
  const platformFee = Math.round(subtotal * COMMISSION_RATE);
  const delivery = new Date(Date.now() + 6 * 86400000);

  const set = (k) => (e) => setAddress((a) => ({ ...a, [k]: e.target.value }));

  async function pay() {
    setError("");
    if (Object.entries(address).some(([k, v]) => k !== "line2" && !v.trim())) {
      setError("Please complete the delivery address.");
      return;
    }
    setBusy(true);
    try {
      const { order } = await api("/orders/create", {
        body: {
          productId: product.id,
          quantity,
          deliveryAddress: address,
          // Demo backend has no product table to price against, so it needs
          // these; the real server ignores them and reads its own record.
          unitPrice: product.price,
          productName: product.name,
        },
      });

      if (DEMO_MODE) {
        // Stand in for the Razorpay modal so the flow can be walked end to end
        // without live keys.
        await api("/orders/verify-payment", {
          body: { razorpayOrderId: "demo", razorpayPaymentId: "demo", signature: "demo" },
        });
        navigate(`/order-success/${order.orderId}`);
        return;
      }

      const { razorpay } = await api("/orders/create", {
        body: { productId: product.id, quantity, deliveryAddress: address },
      });
      const cfg = await api("/orders/config", { method: "GET" });

      // Razorpay's script renders its own modal over this page — the buyer
      // never leaves Med-Mart, and card details go straight to Razorpay.
      const rzp = new window.Razorpay({
        key: cfg.keyId,
        order_id: razorpay.orderId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Med-Mart",
        description: product.name,
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: "#F26522" },
        handler: async (resp) => {
          await api("/orders/verify-payment", {
            body: {
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
            },
          });
          navigate(`/order-success/${order.orderId}`);
        },
      });
      rzp.open();
    } catch (err) {
      setError(
        err.status === 503
          ? "Payments aren't switched on yet — add your Razorpay keys to the server (see SETUP.md)."
          : err.message
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="border-b border-navy/8 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link to="/shop" className="group flex items-center gap-2 text-navy/50 hover:text-orange">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <Link to="/" className="group">
            <Logo textClassName="text-lg" />
          </Link>
          <span className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-navy/50">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            Secure checkout
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
            <h2 className="font-display text-[15px] font-semibold text-navy">Order summary</h2>
            <div className="mt-4 flex gap-4">
              <img src={product.photo} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-navy">{product.name}</p>
                <p className="mt-0.5 text-[12px] text-navy/50">
                  {product.supplier} · {product.city}
                </p>
                <p className="mt-1.5 text-[13px] font-semibold text-navy">
                  {formatINR(product.price)}{" "}
                  <span className="font-normal text-navy/45">per unit</span>
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-[12px] font-semibold text-navy/60">Quantity</span>
              <input
                type="number"
                min={product.moq}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value) || product.moq))}
                className="h-10 w-24 rounded-lg border border-navy/12 px-3 text-[13.5px] outline-none focus:border-orange"
              />
              <span className="text-[11.5px] text-navy/45">Min. order {product.moq}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
            <h2 className="font-display text-[15px] font-semibold text-navy">Delivery address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><input className={inputCls} value={address.fullName} onChange={set("fullName")} /></Field>
              <Field label="Phone"><input className={inputCls} value={address.phone} onChange={set("phone")} /></Field>
              <Field label="Address line 1" wide><input className={inputCls} value={address.line1} onChange={set("line1")} /></Field>
              <Field label="Address line 2 (optional)" wide><input className={inputCls} value={address.line2} onChange={set("line2")} /></Field>
              <Field label="City"><input className={inputCls} value={address.city} onChange={set("city")} /></Field>
              <Field label="State"><input className={inputCls} value={address.state} onChange={set("state")} /></Field>
              <Field label="PIN code"><input className={inputCls} value={address.pincode} onChange={set("pincode")} /></Field>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[12px] text-navy/50">
              <Truck className="h-4 w-4 text-orange" />
              Estimated delivery by{" "}
              {delivery.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
            <h2 className="font-display text-[15px] font-semibold text-navy">Payment</h2>

            <dl className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-navy/55">
                  {formatINR(product.price)} × {quantity}
                </dt>
                <dd className="font-semibold text-navy">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy/55">Platform fee ({Math.round(COMMISSION_RATE * 100)}%)</dt>
                <dd className="text-navy/55">included</dd>
              </div>
              <div className="flex justify-between border-t border-navy/8 pt-2.5">
                <dt className="font-semibold text-navy">Total payable</dt>
                <dd className="font-display text-lg font-semibold text-navy">{formatINR(subtotal)}</dd>
              </div>
            </dl>

            {error && (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-[12px] font-medium text-amber-900">
                <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <motion.button
              onClick={pay}
              disabled={busy}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 w-full rounded-xl bg-gradient-to-b from-orange to-orange-dark py-3.5 text-[14px] font-semibold text-white shadow-glow-orange disabled:opacity-60"
            >
              {busy ? "Opening secure checkout…" : "Proceed to Payment"}
            </motion.button>

            <div className="mt-4 space-y-2 border-t border-navy/8 pt-4">
              <p className="flex items-center gap-2 text-[11.5px] text-navy/50">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                Buyer protection on every on-platform order
              </p>
              <p className="flex items-center gap-2 text-[11.5px] text-navy/50">
                <Lock className="h-4 w-4 shrink-0 text-emerald-600" />
                Secured by Razorpay · UPI, cards, net banking
              </p>
              <p className="text-[11px] leading-relaxed text-navy/40">
                Card details are entered directly with Razorpay and never touch Med-Mart's servers.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
