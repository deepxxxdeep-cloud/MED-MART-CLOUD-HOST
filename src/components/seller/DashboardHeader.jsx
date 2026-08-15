import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bell, ChevronDown, Building2, LogOut, Menu, Search, Settings } from "lucide-react";
import { NOTIFICATIONS, SELLER, timeAgo } from "../../data/sellerData";

const ease = [0.22, 1, 0.36, 1];

function useDismiss(ref, close) {
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, close]);
}

export default function DashboardHeader({ title, onOpenNav }) {
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const bellRef = useRef(null);
  const profileRef = useRef(null);
  useDismiss(bellRef, () => setBellOpen(false));
  useDismiss(profileRef, () => setProfileOpen(false));

  return (
    <header className="sticky top-0 z-30 border-b border-navy/8 bg-white/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onOpenNav}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-navy lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5.5 w-5.5" />
        </button>

        <h1 className="min-w-0 truncate font-display text-lg font-semibold text-navy sm:text-xl">
          {title}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
            <input
              placeholder="Search products, inquiries…"
              className="h-10 w-56 rounded-lg border border-navy/12 bg-surface pl-9 pr-3 text-[13px] text-navy outline-none transition-all focus:w-72 focus:border-orange focus:bg-white lg:w-64"
            />
          </div>

          <div ref={bellRef} className="relative">
            <button
              onClick={() => setBellOpen((o) => !o)}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-navy/60 transition-colors hover:bg-surface hover:text-orange"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[9px] font-bold text-white">
                {NOTIFICATIONS.length}
              </span>
            </button>
            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-navy/10 bg-white shadow-elevated"
                >
                  <p className="border-b border-navy/8 px-4 py-3 text-[13px] font-semibold text-navy">
                    Notifications
                  </p>
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 border-b border-navy/5 px-4 py-3 last:border-0 hover:bg-surface"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                      <div>
                        <p className="text-[13px] leading-snug text-navy/80">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-navy/40">{timeAgo(n.minutesAgo)}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex h-10 items-center gap-2 rounded-lg pl-1 pr-2 transition-colors hover:bg-surface"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[11px] font-bold text-white">
                PS
              </span>
              <span className="hidden text-[13px] font-semibold text-navy sm:block">
                {SELLER.businessName}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-navy/40 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease }}
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-navy/10 bg-white py-1.5 shadow-elevated"
                >
                  {[
                    { label: "Business Profile", icon: Building2, to: "/seller/profile" },
                    { label: "Settings", icon: Settings, to: "/seller/settings" },
                  ].map(({ label, icon: Icon, to }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-navy/75 transition-colors hover:bg-orange-light hover:text-orange"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-navy/8" />
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-navy/75 transition-colors hover:bg-red-50 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
