import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Logo from "../components/Logo";
import FloatingInput from "../components/auth/FloatingInput";
import { SubmitButton } from "../components/auth/Controls";
import { api } from "../lib/api";

const ease = [0.22, 1, 0.36, 1];

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api("/auth/forgot-password", { body: { email } });
      setSent(true);
    } catch (err) {
      setErrors(err.errors?.email ? err.errors : { email: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-deep px-5 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-mesh absolute -left-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-orange/20 blur-[120px]" />
        <div
          className="animate-mesh absolute -right-20 bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#3b4fc9]/25 blur-[120px]"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative w-full max-w-[420px]"
      >
        <div className="mb-7 flex justify-center">
          <Link to="/" className="group">
            <Logo dark />
          </Link>
        </div>

        <div className="glass-dark rounded-3xl p-8 shadow-elevated">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease }}
              >
                <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
                  Forgot your password?
                </h1>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/60">
                  Enter the email tied to your account and we'll send you a link to reset it.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-4">
                  <FloatingInput
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                    error={errors.email}
                    autoComplete="email"
                    inputMode="email"
                  />
                  <SubmitButton loading={loading}>
                    {loading ? "Sending…" : "Send reset link"}
                  </SubmitButton>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease }}
                className="py-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_10px_30px_-6px_rgba(16,185,129,0.6)]"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 320, damping: 16 }}
                  >
                    <Check className="h-8 w-8 text-white" strokeWidth={3.5} />
                  </motion.span>
                </motion.div>

                <h2 className="mt-6 font-display text-2xl font-semibold text-white">
                  Check your email
                </h2>
                <p className="mx-auto mt-2.5 max-w-xs text-sm font-light leading-relaxed text-white/60">
                  If an account exists for <span className="text-white/85">{email}</span>, a reset
                  link is on its way. It expires in 30 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-[13px] font-semibold text-orange transition-opacity hover:opacity-75"
                >
                  Use a different email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to log in
        </Link>
      </motion.div>
    </div>
  );
}
