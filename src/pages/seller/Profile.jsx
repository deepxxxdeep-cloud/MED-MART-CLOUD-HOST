import { useState } from "react";
import { BadgeCheck, Clock, Eye, Upload, X } from "lucide-react";
import { SELLER } from "../../data/sellerData";

const inputCls =
  "mt-1.5 h-11 w-full rounded-lg border border-navy/12 bg-white px-3 text-[13.5px] text-navy outline-none transition-colors focus:border-orange";

function Field({ label, children, hint, wide }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[12px] font-semibold text-navy/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-navy/40">{hint}</span>}
    </label>
  );
}

const DOCS = [
  { id: "gst", label: "GST Certificate", status: "verified" },
  { id: "license", label: "Business License", status: "verified" },
  { id: "iso", label: "ISO 13485 Certificate", status: "pending" },
  { id: "pan", label: "Company PAN", status: "missing" },
];

const DOC_STATUS = {
  verified: { label: "Verified", cls: "bg-emerald-50 text-emerald-700 ring-emerald-500/25", Icon: BadgeCheck },
  pending: { label: "Under review", cls: "bg-orange-light text-orange ring-orange/30", Icon: Clock },
  missing: { label: "Not uploaded", cls: "bg-navy/5 text-navy/55 ring-navy/15", Icon: X },
};

export default function Profile() {
  const [certs, setCerts] = useState(["ISO 13485", "CE Marking"]);

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-navy/50">
          This is what buyers see on your storefront.
        </p>
        <button className="flex items-center gap-1.5 rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy/65 transition-colors hover:border-orange hover:text-orange">
          <Eye className="h-4 w-4" />
          Preview as buyer
        </button>
      </div>

      <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="font-display text-[15px] font-semibold text-navy">Business details</h3>

        <div className="mt-4 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange to-orange-dark font-display text-lg font-bold text-white shadow-glow-orange">
              PS
            </div>
            <BadgeCheck className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white fill-orange text-white" />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-3.5 py-2 text-[12.5px] font-semibold text-navy/60 hover:border-orange hover:text-orange">
            <Upload className="h-3.5 w-3.5" />
            Upload logo
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Business name">
            <input className={inputCls} defaultValue={SELLER.businessName} />
          </Field>
          <Field label="Business type">
            <select className={inputCls} defaultValue="Manufacturer">
              {["Manufacturer", "Distributor", "Wholesaler", "Retailer", "Importer / Exporter"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="GST number">
            <input className={inputCls} defaultValue="07AABCP1234M1Z5" />
          </Field>
          <Field label="Years in business">
            <input type="number" className={inputCls} defaultValue={new Date().getFullYear() - SELLER.memberSince} />
          </Field>
          <Field label="Business address" wide>
            <input className={inputCls} defaultValue="Plot 24, Okhla Industrial Area Phase II" />
          </Field>
          <Field label="City">
            <input className={inputCls} defaultValue="New Delhi" />
          </Field>
          <Field label="PIN code">
            <input className={inputCls} defaultValue="110020" />
          </Field>
          <Field label="Contact email">
            <input type="email" className={inputCls} defaultValue="sales@precisionsurgico.in" />
          </Field>
          <Field label="Contact phone">
            <input className={inputCls} defaultValue="+91 98110 44221" />
          </Field>
          <Field label="About your business" wide hint="Buyers read this before sending an inquiry">
            <textarea
              rows={4}
              className={`${inputCls} h-auto py-2.5`}
              defaultValue="Manufacturer of precision surgical instruments since 2011, supplying hospitals and distributors across India. In-house tooling, ISO 13485 certified production and full traceability on every batch."
            />
          </Field>
        </div>

        <div className="mt-5">
          <span className="text-[12px] font-semibold text-navy/60">Certifications</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {["ISO 13485", "CE Marking", "US FDA", "BIS", "WHO-GMP"].map((c) => {
              const on = certs.includes(c);
              return (
                <button
                  key={c}
                  onClick={() =>
                    setCerts((l) => (l.includes(c) ? l.filter((x) => x !== c) : [...l, c]))
                  }
                  className={`rounded-lg px-3 py-2 text-[12.5px] font-semibold transition-colors ${
                    on
                      ? "bg-orange-light text-orange ring-1 ring-orange/40"
                      : "border border-navy/12 text-navy/55 hover:border-orange"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange">
            Save changes
          </button>
          <button className="rounded-lg border border-navy/12 px-5 py-2.5 text-[13px] font-semibold text-navy/60 hover:border-orange hover:text-orange">
            Cancel
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="font-display text-[15px] font-semibold text-navy">Verification status</h3>
        <p className="mt-1 text-[12.5px] text-navy/45">
          Verified sellers appear higher in search and carry a badge on every listing.
        </p>

        <ul className="mt-4 space-y-2.5">
          {DOCS.map((d) => {
            const s = DOC_STATUS[d.status];
            return (
              <li
                key={d.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-navy/8 p-3.5"
              >
                <span className="text-[13px] font-medium text-navy">{d.label}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${s.cls}`}
                >
                  <s.Icon className="h-3 w-3" />
                  {s.label}
                </span>
                <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-navy/12 px-3 py-1.5 text-[12px] font-semibold text-navy/60 hover:border-orange hover:text-orange">
                  <Upload className="h-3.5 w-3.5" />
                  {d.status === "missing" ? "Upload" : "Replace"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
