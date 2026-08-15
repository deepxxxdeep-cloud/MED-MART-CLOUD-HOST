import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, AlertCircle } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import RoleToggle from "../components/auth/RoleToggle";
import FloatingInput from "../components/auth/FloatingInput";
import PasswordField from "../components/auth/PasswordField";
import { Checkbox, Select, Tabs, SubmitButton } from "../components/auth/Controls";
import GoogleMark from "../components/auth/GoogleMark";
import { useAuth } from "../context/AuthContext";

const ease = [0.22, 1, 0.36, 1];

const BUSINESS_TYPES = [
  "Manufacturer",
  "Distributor",
  "Wholesaler",
  "Retailer",
  "Importer / Exporter",
  "Service Provider",
];

const TABS = [
  { id: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { id: "phone", label: "Phone", icon: <Phone className="h-4 w-4" /> },
  { id: "google", label: "Google", icon: <GoogleMark className="h-4 w-4" /> },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState("buyer");
  const [tab, setTab] = useState("email");
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessType: "",
    city: "",
    gstNumber: "",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    setLoading(true);
    try {
      await signup({ ...form, role, acceptedTerms: String(terms) });
      navigate("/", { replace: true });
    } catch (err) {
      setErrors(err.errors || {});
      // Only surface a banner when no field owns the failure.
      if (!err.errors || Object.keys(err.errors).length === 0) setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Join India's Trusted Medical Marketplace"
      subtitle="Create your account to source verified equipment — or start selling to thousands of healthcare buyers across India."
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm font-light text-navy/50">
          Takes less than a minute to get started.
        </p>
      </div>

      <RoleToggle value={role} onChange={setRole} />

      <div className="mt-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} idPrefix="signup" />
      </div>

      <AnimatePresence mode="wait">
        {tab === "email" && (
          <motion.form
            key="email"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease }}
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 flex flex-col gap-4"
          >
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-600">
                    <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                    {formError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput
              label="Full name"
              value={form.fullName}
              onChange={set("fullName")}
              error={errors.fullName}
              autoComplete="name"
            />
            <FloatingInput
              label="Business name"
              value={form.businessName}
              onChange={set("businessName")}
              error={errors.businessName}
              autoComplete="organization"
              optional={role === "buyer"}
            />
            <FloatingInput
              label="Email address"
              type="email"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              autoComplete="email"
              inputMode="email"
            />

            {/* Seller-only fields reflow in with a height animation */}
            <AnimatePresence initial={false}>
              {role === "seller" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-4 pt-0.5">
                    <Select
                      label="Business type"
                      value={form.businessType}
                      onChange={set("businessType")}
                      options={BUSINESS_TYPES}
                      error={errors.businessType}
                    />
                    <FloatingInput
                      label="City"
                      value={form.city}
                      onChange={set("city")}
                      error={errors.city}
                      autoComplete="address-level2"
                    />
                    <FloatingInput
                      label="GST number"
                      value={form.gstNumber}
                      onChange={set("gstNumber")}
                      error={errors.gstNumber}
                      optional
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <PasswordField
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              autoComplete="new-password"
              showStrength
            />
            <PasswordField
              label="Confirm password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Checkbox
              checked={terms}
              onChange={(v) => {
                setTerms(v);
                setErrors((p) => ({ ...p, acceptedTerms: undefined }));
              }}
              error={errors.acceptedTerms}
            >
              I agree to Med-Mart's{" "}
              <a href="#" className="font-semibold text-orange hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold text-orange hover:underline">
                Privacy Policy
              </a>
              .
            </Checkbox>

            <SubmitButton loading={loading}>
              {loading ? "Creating account…" : "Create account"}
            </SubmitButton>
          </motion.form>
        )}

        {tab !== "email" && (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease }}
            className="mt-6 rounded-2xl border border-dashed border-navy/15 bg-navy/[0.03] px-5 py-10 text-center"
          >
            <p className="text-sm font-semibold text-navy/70">
              {tab === "phone" ? "Phone OTP sign-up" : "Google sign-up"}
            </p>
            <p className="mx-auto mt-2 max-w-xs text-[13px] font-light leading-relaxed text-navy/45">
              Wiring this up next — it needs the{" "}
              {tab === "phone" ? "Firebase" : "Google Cloud"} keys from the setup steps.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-navy/55">
        Already have an account?{" "}
        <Link
          to="/login"
          className="group relative font-semibold text-navy transition-colors hover:text-orange"
        >
          Log in
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-orange transition-all duration-300 group-hover:w-full" />
        </Link>
      </p>
    </AuthLayout>
  );
}
