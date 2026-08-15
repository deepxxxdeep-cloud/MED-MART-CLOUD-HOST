import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, ShieldOff, ShieldCheck, ArrowLeft } from "lucide-react";
import Logo from "../../components/Logo";

// Stand-in review queue. The real list comes from GET /api/admin/flagged-users,
// which returns the same shape plus the blocked messages behind each flag.
const FLAGGED = [
  {
    id: "u1",
    fullName: "Anil Kapoor",
    businessName: "MedTech Distributors",
    email: "anil@medtechdist.in",
    role: "buyer",
    violations: 4,
    flaggedAt: "2026-08-13",
    evidence: [
      { content: "call me on 9876543210 for a better rate", codes: ["phone", "contact_keyword"] },
      { content: "mail me at anil (at) gmail (dot) com", codes: ["email", "link"] },
      { content: "nine eight seven six five four three two one zero", codes: ["phone"] },
    ],
  },
  {
    id: "u2",
    fullName: "Imran Qureshi",
    businessName: "Lifeline Surgicals",
    email: "imran@lifelinesurg.in",
    role: "seller",
    violations: 3,
    flaggedAt: "2026-08-11",
    evidence: [
      { content: "ping me on whatsapp, we can do a direct deal", codes: ["contact_keyword"] },
      { content: "visit lifelinesurg.com for full catalogue", codes: ["link"] },
      { content: "98-76*54-32-10", codes: ["phone"] },
    ],
  },
];

const CODE_LABEL = {
  phone: "phone number",
  email: "email address",
  link: "external link",
  contact_keyword: "contact keyword",
};

export default function FlaggedUsers() {
  const [users, setUsers] = useState(FLAGGED);
  const [resolved, setResolved] = useState({});

  const review = (id, action) => {
    setResolved((r) => ({ ...r, [id]: action }));
    if (action !== "suspend") {
      setTimeout(() => setUsers((list) => list.filter((u) => u.id !== id)), 900);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="border-b border-navy/8 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2 text-navy/50 hover:text-orange">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <Link to="/" className="group">
            <Logo textClassName="text-lg" />
          </Link>
          <span className="ml-auto rounded-full bg-navy/5 px-3 py-1 text-[11.5px] font-semibold text-navy/60">
            Admin
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-xl font-semibold text-navy sm:text-2xl">Flagged Accounts</h1>
        <p className="mt-1.5 text-[13px] text-navy/50">
          Accounts that hit three or more blocked attempts to share contact details. Review the
          evidence before acting — most are habit rather than intent.
        </p>

        <div className="mt-6 space-y-4">
          {users.map((u) => (
            <motion.article
              key={u.id}
              layout
              animate={{ opacity: resolved[u.id] ? 0.55 : 1 }}
              className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[12px] font-bold text-white">
                    {u.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-navy">{u.fullName}</p>
                    <p className="text-[12px] text-navy/50">
                      {u.businessName} · <span className="capitalize">{u.role}</span>
                    </p>
                    <p className="text-[11.5px] text-navy/40">{u.email}</p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11.5px] font-semibold text-amber-900 ring-1 ring-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {u.violations} violations · flagged {u.flaggedAt}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-navy/45">
                  Blocked messages
                </p>
                {u.evidence.map((e, i) => (
                  <div key={i} className="rounded-lg border border-navy/8 bg-surface px-3.5 py-2.5">
                    <p className="text-[12.5px] text-navy/75">"{e.content}"</p>
                    <p className="mt-1 flex flex-wrap gap-1.5">
                      {e.codes.map((c) => (
                        <span key={c} className="rounded bg-amber-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-800">
                          {CODE_LABEL[c] || c}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-navy/6 pt-4">
                {resolved[u.id] ? (
                  <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-700">
                    <Check className="h-4 w-4" />
                    Marked as {resolved[u.id]}
                  </p>
                ) : (
                  <>
                    <button
                      onClick={() => review(u.id, "dismissed")}
                      className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-3.5 py-2 text-[12.5px] font-semibold text-navy/65 hover:border-emerald-400 hover:text-emerald-700"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Dismiss flag
                    </button>
                    <button
                      onClick={() => review(u.id, "warned")}
                      className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-3.5 py-2 text-[12.5px] font-semibold text-navy/65 hover:border-orange hover:text-orange"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Send warning
                    </button>
                    <button
                      onClick={() => review(u.id, "suspend")}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-[12.5px] font-semibold text-red-600 hover:bg-red-50"
                    >
                      <ShieldOff className="h-3.5 w-3.5" />
                      Suspend account
                    </button>
                  </>
                )}
              </div>
            </motion.article>
          ))}

          {users.length === 0 && (
            <p className="rounded-2xl border border-navy/8 bg-white p-12 text-center text-[13px] text-navy/40">
              Nothing in the review queue.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
