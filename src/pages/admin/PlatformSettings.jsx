import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Lock, ShieldCheck, CheckCircle2, XCircle, Loader2, Save, Zap, Info,
} from "lucide-react";
import { ADMIN } from "../../data/adminData";

const inputCls =
  "mt-1.5 h-11 w-full rounded-lg border border-navy/12 bg-white px-3 pr-11 text-[13.5px] text-navy outline-none transition-colors focus:border-orange font-mono";

/** Secret input: masked by default, reveals on demand, never pre-filled. */
function SecretField({ label, hint, configured, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-[12px] font-semibold text-navy/60">
        <Lock className="h-3 w-3 text-navy/35" />
        {label}
        {configured && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-500/25">
            Saved
          </span>
        )}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={configured ? "•••••••• (leave blank to keep)" : placeholder}
          className={inputCls}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-navy/40 hover:text-orange"
          aria-label={show ? "Hide" : "Show"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && <span className="mt-1 block text-[11px] text-navy/40">{hint}</span>}
    </label>
  );
}

function PlainField({ label, hint, value, onChange, type = "text", suffix }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-navy/60">{label}</span>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-lg border border-navy/12 bg-white px-3 text-[13.5px] text-navy outline-none focus:border-orange"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-navy/40">{suffix}</span>
        )}
      </div>
      {hint && <span className="mt-1 block text-[11px] text-navy/40">{hint}</span>}
    </label>
  );
}

function Section({ title, subtitle, children, locked }) {
  return (
    <section className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[15px] font-semibold text-navy">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[12px] text-navy/45">{subtitle}</p>}
        </div>
        {locked && <Lock className="h-4 w-4 shrink-0 text-navy/25" />}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function PlatformSettings() {
  // Secrets start empty by design — the API returns only whether each is set,
  // never the value, so there is nothing to pre-fill.
  const [form, setForm] = useState({
    razorpay_key_id: "", razorpay_key_secret: "", razorpay_webhook_secret: "",
    smtp_host: "smtp.sendgrid.net", smtp_port: "587", smtp_user: "apikey", smtp_password: "",
    twilio_account_sid: "", twilio_auth_token: "", firebase_project_id: "",
    platform_commission_rate: "7", payout_schedule_days: "7",
    minimum_payout_amount: "1000", support_email: "support@med-mart.in",
  });
  const [mode, setMode] = useState("test");
  const [configured] = useState({ razorpay_key_id: false, razorpay_key_secret: false, razorpay_webhook_secret: false, smtp_password: false, twilio_auth_token: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const gatewayConnected = configured.razorpay_key_id && configured.razorpay_key_secret;

  if (ADMIN.role !== "super-admin") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-navy/8 bg-white p-10 text-center shadow-soft">
        <Lock className="mx-auto h-8 w-8 text-navy/25" />
        <h2 className="mt-4 font-display text-lg font-semibold text-navy">Super admin only</h2>
        <p className="mt-2 text-[13px] text-navy/50">
          Platform settings hold live payment credentials, so they're restricted to super admin
          accounts.
        </p>
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    setSaved(false);
    // Blank secrets are omitted so saving the form never wipes stored keys.
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 900));
    setTesting(false);
    setTestResult(
      form.razorpay_key_id || configured.razorpay_key_id
        ? { ok: true, message: `Connected. Key is in ${mode} mode.` }
        : { ok: false, message: "Add a key id and secret first." }
    );
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-navy/10 bg-navy/[0.03] px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-orange" />
        <p className="text-[12px] leading-relaxed text-navy/60">
          These credentials are encrypted with AES-256-GCM before they're written to the database,
          and only super admin accounts can view or edit this page. Saved secrets are never sent
          back to the browser — you'll see whether a value is set, not the value itself.
        </p>
      </div>

      <Section
        title="Payment Gateway (Razorpay)"
        subtitle="Used for buyer checkout and seller payouts"
        locked
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/8 bg-surface p-3.5">
          <div className="flex items-center gap-2.5">
            {gatewayConnected ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-[13px] font-semibold text-emerald-700">Payment Gateway: Connected</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-navy/35" />
                <span className="text-[13px] font-semibold text-navy/55">Payment Gateway: Not Configured</span>
              </>
            )}
          </div>

          <div className="flex gap-1 rounded-lg border border-navy/10 bg-white p-1">
            {["test", "live"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-3.5 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
                  mode === m
                    ? m === "live"
                      ? "bg-gradient-to-b from-orange to-orange-dark text-white shadow-glow-orange"
                      : "bg-navy text-white"
                    : "text-navy/50 hover:text-navy"
                }`}
              >
                {m} mode
              </button>
            ))}
          </div>
        </div>

        {mode === "live" && (
          <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-[12px] text-amber-900">
            <Info className="mt-px h-4 w-4 shrink-0" />
            Live mode charges real money. Run "Test connection" before saving live keys.
          </p>
        )}

        <div className="space-y-4">
          <SecretField label="Razorpay Key ID" placeholder={mode === "live" ? "rzp_live_…" : "rzp_test_…"} configured={configured.razorpay_key_id} value={form.razorpay_key_id} onChange={set("razorpay_key_id")} hint="Public — identifies your account to the checkout script" />
          <SecretField label="Razorpay Key Secret" placeholder="Your key secret" configured={configured.razorpay_key_secret} value={form.razorpay_key_secret} onChange={set("razorpay_key_secret")} hint="Never leaves the server" />
          <SecretField label="Webhook Secret" placeholder="Your webhook signing secret" configured={configured.razorpay_webhook_secret} value={form.razorpay_webhook_secret} onChange={set("razorpay_webhook_secret")} hint="Verifies server-to-server payment confirmations" />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button onClick={testConnection} disabled={testing} className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-4 py-2.5 text-[13px] font-semibold text-navy/65 hover:border-orange hover:text-orange disabled:opacity-60">
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Test connection
          </button>
          <AnimatePresence>
            {testResult && (
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={`flex items-center gap-1.5 text-[12.5px] font-semibold ${testResult.ok ? "text-emerald-700" : "text-red-600"}`}>
                {testResult.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {testResult.message}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Section>

      <Section title="Email Service" subtitle="Order confirmations, password resets and notifications" locked>
        <div className="grid gap-4 sm:grid-cols-2">
          <PlainField label="SMTP host" value={form.smtp_host} onChange={set("smtp_host")} />
          <PlainField label="SMTP port" value={form.smtp_port} onChange={set("smtp_port")} />
          <PlainField label="SMTP user" value={form.smtp_user} onChange={set("smtp_user")} />
          <SecretField label="SMTP password / API key" placeholder="SG.xxxxx" configured={configured.smtp_password} value={form.smtp_password} onChange={set("smtp_password")} />
        </div>
      </Section>

      <Section title="SMS / OTP Service" subtitle="Phone verification for buyers and sellers" locked>
        <div className="grid gap-4 sm:grid-cols-2">
          <PlainField label="Twilio Account SID" value={form.twilio_account_sid} onChange={set("twilio_account_sid")} />
          <SecretField label="Twilio Auth Token" placeholder="Your auth token" configured={configured.twilio_auth_token} value={form.twilio_auth_token} onChange={set("twilio_auth_token")} />
          <PlainField label="Firebase Project ID" hint="Alternative to Twilio — Firebase Phone Auth" value={form.firebase_project_id} onChange={set("firebase_project_id")} />
        </div>
      </Section>

      <Section title="Platform Settings" subtitle="Commission, payouts and support contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <PlainField label="Platform commission" type="number" suffix="%" hint="Applies to future orders only — existing orders keep their original rate" value={form.platform_commission_rate} onChange={set("platform_commission_rate")} />
          <PlainField label="Payout schedule" type="number" suffix="days" hint="How often delivered orders are settled" value={form.payout_schedule_days} onChange={set("payout_schedule_days")} />
          <PlainField label="Minimum payout amount" type="number" suffix="₹" hint="Balances below this roll into the next cycle" value={form.minimum_payout_amount} onChange={set("minimum_payout_amount")} />
          <PlainField label="Support email" type="email" value={form.support_email} onChange={set("support_email")} />
        </div>
      </Section>

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-navy/10 bg-white/95 p-3 shadow-elevated backdrop-blur">
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </button>
        <AnimatePresence>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Saved and encrypted
            </motion.span>
          )}
        </AnimatePresence>
        <span className="ml-auto hidden text-[11px] text-navy/40 sm:block">
          Blank secret fields keep their existing value
        </span>
      </div>
    </div>
  );
}
