import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, AlertCircle } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import FloatingInput from "../components/auth/FloatingInput";
import PasswordField from "../components/auth/PasswordField";
import { Checkbox, Tabs, SubmitButton } from "../components/auth/Controls";
import GoogleMark from "../components/auth/GoogleMark";
import { useAuth } from "../context/AuthContext";

const ease = [0.22, 1, 0.36, 1];

const TABS = [
  { id: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { id: "phone", label: "Phone", icon: <Phone className="h-4 w-4" /> },
  { id: "google", label: "Google", icon: <GoogleMark className="h-4 w-4" /> },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tab, setTab] = useState("email");
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      setErrors(err.errors || {});
      if (!err.errors || Object.keys(err.errors).length === 0) setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome Back to Med-Mart"
      subtitle="Log in to track your inquiries, compare supplier quotes and manage your orders."
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy">
          Log in to your account
        </h1>
        <p className="mt-1.5 text-sm font-light text-navy/50">
          Good to see you again.
        </p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} idPrefix="login" />

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
              label="Email address"
              type="email"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              autoComplete="email"
              inputMode="email"
            />
            <PasswordField
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <Checkbox checked={remember} onChange={setRemember}>
                Remember me
              </Checkbox>
              <Link
                to="/forgot-password"
                className="shrink-0 text-[13px] font-semibold text-orange transition-opacity hover:opacity-75"
              >
                Forgot password?
              </Link>
            </div>

            <SubmitButton loading={loading}>
              {loading ? "Logging in…" : "Log in"}
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
              {tab === "phone" ? "Phone OTP login" : "Google login"}
            </p>
            <p className="mx-auto mt-2 max-w-xs text-[13px] font-light leading-relaxed text-navy/45">
              Wiring this up next — it needs the{" "}
              {tab === "phone" ? "Firebase" : "Google Cloud"} keys from the setup steps.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-navy/55">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="group relative font-semibold text-navy transition-colors hover:text-orange"
        >
          Sign up
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-orange transition-all duration-300 group-hover:w-full" />
        </Link>
      </p>
    </AuthLayout>
  );
}
