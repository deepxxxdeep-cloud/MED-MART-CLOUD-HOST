import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, PlusCircle, MessagesSquare, Building2 } from "lucide-react";
import Sidebar from "../../components/seller/Sidebar";
import DashboardHeader from "../../components/seller/DashboardHeader";
import { unreadInquiries } from "../../data/sellerData";

// Route → page title, so the header reflects where you are without each page
// having to declare it.
const TITLES = [
  ["/seller/products/add", "Add New Product"],
  ["/seller/products", "My Products"],
  ["/seller/inquiries", "Buyer Inquiries"],
  ["/seller/buy-requirements", "Buy Requirements"],
  ["/seller/orders", "Orders"],
  ["/seller/revenue", "Revenue"],
  ["/seller/analytics", "Analytics"],
  ["/seller/profile", "Business Profile"],
  ["/seller/settings", "Settings"],
  ["/seller", "Dashboard Overview"],
];

const BOTTOM_NAV = [
  { to: "/seller", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/seller/products", label: "Products", icon: Package },
  { to: "/seller/products/add", label: "Add", icon: PlusCircle },
  { to: "/seller/inquiries", label: "Inquiries", icon: MessagesSquare, badge: unreadInquiries() },
  { to: "/seller/profile", label: "Profile", icon: Building2 },
];

export default function SellerLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] || "Seller";

  return (
    <div className="min-h-screen bg-surface font-sans">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="lg:pl-[248px]">
        <DashboardHeader title={title} onOpenNav={() => setNavOpen(true)} />

        {/* Snappy transition — this is a work tool, so it stays short. */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 pb-24 pt-6 sm:px-6 lg:pb-10"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Mobile bottom bar — the primary actions stay one tap away */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-white/95 backdrop-blur-xl lg:hidden">
        <ul className="flex">
          {BOTTOM_NAV.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                    isActive ? "text-orange" : "text-navy/45"
                  }`
                }
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[9px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
