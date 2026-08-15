import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { SELLER } from "../../data/sellerData";

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

function Switch({ on, onChange, label, hint }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-navy">{label}</p>
        {hint && <p className="mt-0.5 text-[11.5px] text-navy/45">{hint}</p>}
      </div>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
          on ? "bg-gradient-to-r from-orange to-orange-dark shadow-glow-orange" : "bg-navy/15"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

const PLANS = [
  { name: "Starter", price: "Free", note: "Up to 10 listings" },
  { name: "Growth", price: "₹2,499/mo", note: "Unlimited listings, priority in search" },
  { name: "Enterprise", price: "Custom", note: "Dedicated manager, API access" },
];

export default function Settings() {
  const [prefs, setPrefs] = useState({
    emailInquiries: true,
    smsInquiries: false,
    rfqMatches: true,
    weeklyDigest: true,
    marketing: false,
    twoFactor: false,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="max-w-3xl space-y-5">
      <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="font-display text-[15px] font-semibold text-navy">Account</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Email address">
            <input type="email" className={inputCls} defaultValue="sales@precisionsurgico.in" />
          </Field>
          <Field label="Phone number">
            <input className={inputCls} defaultValue="+91 98110 44221" />
          </Field>
        </div>
        <button className="mt-4 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange">
          Update account
        </button>
      </section>

      <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="font-display text-[15px] font-semibold text-navy">Change password</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Current password">
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
          <div className="hidden sm:block" />
          <Field label="New password">
            <input type="password" className={inputCls} placeholder="At least 8 characters" />
          </Field>
          <Field label="Confirm new password">
            <input type="password" className={inputCls} placeholder="Re-enter it" />
          </Field>
        </div>
        <button className="mt-4 rounded-lg border border-navy/12 px-5 py-2.5 text-[13px] font-semibold text-navy/65 hover:border-orange hover:text-orange">
          Change password
        </button>
      </section>

      <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="font-display text-[15px] font-semibold text-navy">Notifications</h3>
        <div className="mt-2 divide-y divide-navy/6">
          <Switch label="New inquiries by email" hint="Sent as soon as a buyer writes in" on={prefs.emailInquiries} onChange={() => toggle("emailInquiries")} />
          <Switch label="New inquiries by SMS" hint="Useful for urgent, high-value requests" on={prefs.smsInquiries} onChange={() => toggle("smsInquiries")} />
          <Switch label="Matching buy requirements" hint="When an RFQ matches your categories" on={prefs.rfqMatches} onChange={() => toggle("rfqMatches")} />
          <Switch label="Weekly performance digest" hint="Views, inquiries and conversion summary" on={prefs.weeklyDigest} onChange={() => toggle("weeklyDigest")} />
          <Switch label="Product news and offers" on={prefs.marketing} onChange={() => toggle("marketing")} />
        </div>
      </section>

      <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="flex items-center gap-2 font-display text-[15px] font-semibold text-navy">
          <ShieldCheck className="h-4.5 w-4.5 text-orange" />
          Security
        </h3>
        <div className="mt-2">
          <Switch
            label="Two-factor authentication"
            hint="Require a code from your phone when logging in"
            on={prefs.twoFactor}
            onChange={() => toggle("twoFactor")}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="font-display text-[15px] font-semibold text-navy">Plan</h3>
        <p className="mt-1 text-[12.5px] text-navy/45">
          You're on the <span className="font-semibold text-orange">{SELLER.plan}</span> plan.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PLANS.map((p) => {
            const current = p.name === SELLER.plan;
            return (
              <div
                key={p.name}
                className={`rounded-xl border p-4 ${
                  current ? "border-orange bg-orange-light/50 ring-1 ring-orange/30" : "border-navy/10"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-semibold text-navy">{p.name}</p>
                  {current && <Check className="h-3.5 w-3.5 text-orange" />}
                </div>
                <p className="mt-1 font-display text-lg font-semibold text-navy">{p.price}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-navy/45">{p.note}</p>
              </div>
            );
          })}
        </div>
        <button className="mt-4 flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange">
          <Sparkles className="h-4 w-4" />
          Upgrade plan
        </button>
      </section>
    </div>
  );
}
