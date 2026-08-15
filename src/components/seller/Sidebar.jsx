import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessagesSquare,
  Target,
  ClipboardList,
  BarChart3,
  Building2,
  Settings,
  LifeBuoy,
  LogOut,
  BadgeCheck,
  X,
} from "lucide-react";
import Logo from "../Logo";
import { SELLER, unreadInquiries } from "../../data/sellerData";

const NAV = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/seller/products", label: "My Products", icon: Package },
  { to: "/seller/products/add", label: "Add New Product", icon: PlusCircle },
  { to: "/seller/inquiries", label: "Buyer Inquiries", icon: MessagesSquare, badge: unreadInquiries() },
  { to: "/seller/buy-requirements", label: "Buy Requirements", icon: Target },
  { to: "/seller/orders", label: "Orders", icon: ClipboardList },
  { to: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/seller/profile", label: "Business Profile", icon: Building2 },
  { to: "/seller/settings", label: "Settings", icon: Settings },
];

function NavItem({ item, onNavigate }) {
  const { to, label, icon: Icon, end, badge } = item;
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-200 ${
          isActive ? "text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            // Shared layoutId slides the active pill between items.
            <motion.span
              layoutId="seller-nav-active"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange to-orange-dark shadow-glow-orange"
            />
          )}
          <Icon className="relative h-[18px] w-[18px] shrink-0" />
          <span className="relative min-w-0 truncate">{label}</span>
          {badge > 0 && (
            <span
              className={`relative ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                isActive ? "bg-white/25 text-white" : "bg-orange text-white"
              }`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const content = (
    <div className="flex h-full flex-col bg-navy-deep">
      <div className="flex items-center justify-between px-5 pt-5">
        <Link to="/" className="group">
          <Logo dark textClassName="text-lg" />
        </Link>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Seller identity */}
      <div className="mx-4 mt-5 rounded-xl border border-white/10 bg-white/5 p-3.5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange to-orange-dark font-display text-sm font-bold text-white">
              PS
            </div>
            {SELLER.verified && (
              <BadgeCheck className="absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full bg-navy-deep fill-orange text-navy-deep" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-white">{SELLER.businessName}</p>
            <p className="text-[11px] text-orange">Verified Seller</p>
          </div>
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onClose} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          to="/help"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LifeBuoy className="h-[18px] w-[18px]" />
          Help &amp; Support
        </Link>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="h-[18px] w-[18px]" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: permanent rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block">{content}</aside>

      {/* Mobile: slide-over */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-navy-deep/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-y-0 left-0 z-50 w-[268px] lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
