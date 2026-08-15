import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Store, MessageSquareWarning, Receipt, Wallet,
  Boxes, SlidersHorizontal, UserCog, LogOut, Menu, X, Bell, Search, ShieldCheck, ChevronDown,
} from "lucide-react";
import Logo from "../../components/Logo";
import { ADMIN, ADMIN_METRICS } from "../../data/adminData";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/sellers", label: "Sellers", icon: Store, badge: ADMIN_METRICS.sellers.pending },
  { to: "/admin/chat-monitoring", label: "Chat Monitoring", icon: MessageSquareWarning, badge: ADMIN_METRICS.flaggedChats, alert: true },
  { to: "/admin/orders", label: "Orders & Transactions", icon: Receipt },
  { to: "/admin/revenue", label: "Revenue & Payouts", icon: Wallet },
  { to: "/admin/moderation", label: "Categories & Products", icon: Boxes },
  { to: "/admin/settings", label: "Platform Settings", icon: SlidersHorizontal, superOnly: true },
  { to: "/admin/team", label: "Admin Team", icon: UserCog },
];

const TITLES = [
  ["/admin/chat-monitoring", "Chat Monitoring"],
  ["/admin/orders", "Orders & Transactions"],
  ["/admin/revenue", "Revenue & Payouts"],
  ["/admin/moderation", "Categories & Products"],
  ["/admin/settings", "Platform Settings"],
  ["/admin/sellers", "Sellers"],
  ["/admin/users", "Users"],
  ["/admin/team", "Admin Team"],
  ["/admin", "Dashboard"],
];

export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES.find(([p]) => pathname.startsWith(p))?.[1] || "Admin";

  // Settings hold live payment credentials, so the link is hidden entirely for
  // non-super-admins rather than shown and then refused.
  const items = NAV.filter((n) => !n.superOnly || ADMIN.role === "super-admin");

  const rail = (
    <div className="flex h-full flex-col bg-navy-deep">
      <div className="flex items-center justify-between px-5 pt-5">
        <Link to="/" className="group flex items-center gap-2">
          <Logo dark textClassName="text-base" />
        </Link>
        <button onClick={() => setNavOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 lg:hidden" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-orange/30 bg-orange/10 px-3 py-2">
        <ShieldCheck className="h-4 w-4 shrink-0 text-orange" />
        <span className="text-[11.5px] font-semibold uppercase tracking-wide text-orange">
          Admin Console
        </span>
      </div>

      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {items.map(({ to, label, icon: Icon, end, badge, alert }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setNavOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-200 ${
                isActive ? "text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-nav-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange to-orange-dark shadow-glow-orange"
                  />
                )}
                <Icon className="relative h-[17px] w-[17px] shrink-0" />
                <span className="relative min-w-0 truncate">{label}</span>
                {badge > 0 && (
                  <span className={`relative ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive ? "bg-white/25 text-white" : alert ? "bg-red-500 text-white" : "bg-orange text-white"
                  }`}>
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/55 transition-colors hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="h-[17px] w-[17px]" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface font-sans">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] lg:block">{rail}</aside>

      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNavOpen(false)} className="fixed inset-0 z-40 bg-navy-deep/60 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }} className="fixed inset-y-0 left-0 z-50 w-[268px] lg:hidden">
              {rail}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-30 border-b border-navy/8 bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setNavOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-navy lg:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 truncate font-display text-lg font-semibold text-navy">{title}</h1>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" />
                <input placeholder="Search user, order or product ID…" className="h-10 w-64 rounded-lg border border-navy/12 bg-surface pl-9 pr-3 text-[13px] outline-none focus:border-orange focus:bg-white lg:w-72" />
              </div>

              <div className="relative">
                <button onClick={() => setBell((b) => !b)} className="relative flex h-10 w-10 items-center justify-center rounded-lg text-navy/60 hover:bg-surface hover:text-orange" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">3</span>
                </button>
                <AnimatePresence>
                  {bell && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-navy/10 bg-white shadow-elevated">
                      {[
                        [`${ADMIN_METRICS.flaggedChats} chats flagged and unreviewed`, "Chat monitoring"],
                        [`${ADMIN_METRICS.sellers.pending} sellers awaiting verification`, "Sellers"],
                        [`${ADMIN_METRICS.pendingPayouts.count} payouts pending release`, "Revenue"],
                      ].map(([text, where]) => (
                        <div key={text} className="flex gap-3 border-b border-navy/5 px-4 py-3 last:border-0 hover:bg-surface">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                          <div>
                            <p className="text-[13px] leading-snug text-navy/80">{text}</p>
                            <p className="mt-0.5 text-[11px] text-navy/40">{where}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="flex h-10 items-center gap-2 rounded-lg pl-1 pr-2 hover:bg-surface">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[11px] font-bold text-white">
                  {ADMIN.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-[12.5px] font-semibold leading-tight text-navy">{ADMIN.name}</span>
                  <span className="block text-[10.5px] capitalize leading-tight text-orange">{ADMIN.role.replace("-", " ")}</span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-navy/40" />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-6 sm:px-6"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
