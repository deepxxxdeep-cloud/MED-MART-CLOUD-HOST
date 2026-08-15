import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Archive, ArrowLeft, Check, MapPin, Paperclip, Send } from "lucide-react";
import { INQUIRIES, timeAgo } from "../../data/sellerData";
import { checkMessage } from "../../lib/messageGuard";
import { SafetyBanner, BlockedNotice } from "../../components/seller/SafetyBanner";

const TABS = ["All", "Unread", "Responded", "Archived"];

const initials = (name) =>
  name.split(" ").slice(-2).map((w) => w[0]).join("");

export default function Inquiries() {
  const [items, setItems] = useState(INQUIRIES);
  const [tab, setTab] = useState("All");
  const [activeId, setActiveId] = useState(INQUIRIES[0].id);
  const [reply, setReply] = useState("");
  const [blocked, setBlocked] = useState(null);
  const [violations, setViolations] = useState(0);
  // Mobile shows one panel at a time; desktop shows both.
  const [mobileThread, setMobileThread] = useState(false);

  const list = useMemo(() => {
    if (tab === "All") return items;
    return items.filter((i) => i.status === tab.toLowerCase());
  }, [items, tab]);

  const active = items.find((i) => i.id === activeId) || list[0];

  const setStatus = (id, status) =>
    setItems((l) => l.map((i) => (i.id === id ? { ...i, status } : i)));

  const open = (id) => {
    setActiveId(id);
    setMobileThread(true);
    // Opening an inquiry is the natural point to clear its unread state.
    setItems((l) => l.map((i) => (i.id === id && i.status === "unread" ? { ...i, status: "responded" } : i)));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-navy/10 bg-white p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const count =
            t === "All" ? items.length : items.filter((i) => i.status === t.toLowerCase()).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative shrink-0 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
                tab === t ? "text-white" : "text-navy/55 hover:text-navy"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="inq-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-lg bg-gradient-to-b from-orange to-orange-dark shadow-glow-orange"
                />
              )}
              <span className="relative">
                {t} <span className="opacity-60">({count})</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        {/* List */}
        <div
          className={`overflow-hidden rounded-2xl border border-navy/8 bg-white shadow-soft ${
            mobileThread ? "hidden lg:block" : ""
          }`}
        >
          <ul className="max-h-[calc(100vh-16rem)] divide-y divide-navy/5 overflow-y-auto">
            {list.map((q) => (
              <li key={q.id}>
                <button
                  onClick={() => open(q.id)}
                  className={`flex w-full gap-3 p-3.5 text-left transition-colors hover:bg-surface ${
                    active?.id === q.id ? "bg-orange-light/50" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[11px] font-bold text-white">
                    {initials(q.buyer)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[13px] font-semibold text-navy">{q.buyer}</p>
                      {q.status === "unread" && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                      )}
                      <span className="ml-auto shrink-0 text-[11px] text-navy/40">
                        {timeAgo(q.minutesAgo)}
                      </span>
                    </div>
                    <p className="truncate text-[11.5px] font-medium text-orange">{q.product}</p>
                    <p className="mt-0.5 line-clamp-2 text-[12px] text-navy/50">{q.message}</p>
                  </div>
                </button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="p-8 text-center text-[13px] text-navy/40">Nothing here yet.</li>
            )}
          </ul>
        </div>

        {/* Thread */}
        {active && (
          <div
            className={`flex flex-col rounded-2xl border border-navy/8 bg-white shadow-soft ${
              mobileThread ? "" : "hidden lg:flex"
            }`}
          >
            <div className="flex items-start gap-3 border-b border-navy/8 p-4">
              <button
                onClick={() => setMobileThread(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy/50 lg:hidden"
                aria-label="Back to list"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[12px] font-bold text-white sm:flex">
                {initials(active.buyer)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-navy">{active.buyer}</p>
                <p className="truncate text-[12px] text-navy/50">{active.company}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-navy/40">
                  <MapPin className="h-3 w-3" />
                  {active.city}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setStatus(active.id, "responded")}
                  className="hidden items-center gap-1.5 rounded-lg border border-navy/12 px-3 py-2 text-[12px] font-semibold text-navy/60 hover:border-emerald-400 hover:text-emerald-700 sm:flex"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark as Responded
                </button>
                <button
                  onClick={() => setStatus(active.id, "archived")}
                  aria-label="Archive"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy/12 text-navy/50 hover:border-orange hover:text-orange"
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <SafetyBanner />

              <div className="rounded-xl border border-navy/8 bg-surface p-3">
                <p className="text-[11.5px] font-semibold text-navy/45">Enquired about</p>
                <p className="mt-0.5 text-[13px] font-semibold text-orange">{active.product}</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[10px] font-bold text-white">
                  {initials(active.buyer)}
                </span>
                <div className="max-w-lg rounded-2xl rounded-tl-sm bg-surface px-4 py-3">
                  <p className="text-[13px] leading-relaxed text-navy/80">{active.message}</p>
                  <p className="mt-1.5 text-[11px] text-navy/35">{timeAgo(active.minutesAgo)}</p>
                </div>
              </div>

              {active.status !== "unread" && (
                <div className="flex flex-row-reverse gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange to-orange-dark text-[10px] font-bold text-white">
                    PS
                  </span>
                  <div className="max-w-lg rounded-2xl rounded-tr-sm bg-orange-light px-4 py-3">
                    <p className="text-[13px] leading-relaxed text-navy/80">
                      Thanks for reaching out — sharing our quotation and catalogue now. Happy to
                      arrange a call to walk through the specifications.
                    </p>
                    <p className="mt-1.5 text-right text-[11px] text-navy/35">Sent</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5 border-t border-navy/8 p-3">
              <BlockedNotice verdict={blocked} violations={violations} />
              <div className="flex items-end gap-2">
                <button
                  aria-label="Attach quote or catalogue"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navy/12 text-navy/45 hover:border-orange hover:text-orange"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </button>
                <textarea
                  rows={1}
                  value={reply}
                  onChange={(e) => {
                    setReply(e.target.value);
                    if (blocked) setBlocked(null);
                  }}
                  placeholder="Write your response…"
                  className={`max-h-32 min-h-11 flex-1 resize-y rounded-lg border px-3 py-2.5 text-[13.5px] text-navy outline-none ${
                    blocked ? "border-amber-400 bg-amber-50/40" : "border-navy/12 focus:border-orange"
                  }`}
                />
                <button
                  onClick={() => {
                    // Mirrors the server check so the refusal is immediate;
                    // the server re-runs it and is the real gate.
                    const verdict = checkMessage(reply);
                    if (!verdict.allowed) {
                      setViolations((v) => v + 1);
                      setBlocked(verdict);
                      return;
                    }
                    setBlocked(null);
                    setStatus(active.id, "responded");
                    setReply("");
                  }}
                  className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-4 text-[13px] font-semibold text-white shadow-glow-orange"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send Response</span>
                </button>
              </div>
              <p className="mt-1.5 pl-13 text-[11px] text-navy/35">
                Attach a PDF quote or your product catalogue with the clip icon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
