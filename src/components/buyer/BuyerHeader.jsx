import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  User,
  Heart,
  FileText,
  ClipboardList,
  Package,
  LogOut,
  Bookmark,
  Menu,
} from "lucide-react";
import Logo from "../Logo";
import { CATEGORY_NAMES, SEARCH_SUGGESTIONS } from "../../data/buyerData";
import { useShop } from "../../context/ShopContext";

const ease = [0.22, 1, 0.36, 1];

function Badge({ count }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gradient-to-b from-orange to-orange-dark px-1 text-[10px] font-bold text-white shadow-glow-orange"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}

/** Closes the popover when a click lands outside it. */
function useDismiss(ref, close) {
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, close]);
}

export default function BuyerHeader({ onToggleMobileNav }) {
  const { inquiryCount, savedCount } = useShop();

  const [category, setCategory] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const catRef = useRef(null);
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  useDismiss(catRef, () => setCatOpen(false));
  useDismiss(searchRef, () => setFocused(false));
  useDismiss(accountRef, () => setAccountOpen(false));

  const matches = query.trim()
    ? SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : SEARCH_SUGGESTIONS.slice(0, 6);

  return (
    <div className="border-b border-white/10 bg-navy">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={onToggleMobileNav}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white lg:hidden"
          aria-label="Open categories"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="group shrink-0">
          <Logo dark />
        </Link>

        {/* Search — category select + input + button, one pill */}
        <div ref={searchRef} className="relative hidden min-w-0 flex-1 md:block">
          <div className="flex h-12 items-stretch overflow-visible rounded-xl bg-white shadow-elevated">
            <div ref={catRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setCatOpen((o) => !o)}
                className="flex h-full items-center gap-1.5 rounded-l-xl border-r border-navy/10 bg-surface px-4 text-[13px] font-semibold text-navy/75 transition-colors hover:text-orange"
              >
                <span className="max-w-[9rem] truncate">{category}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease }}
                    className="absolute left-0 top-full z-50 mt-2 max-h-80 w-60 overflow-auto rounded-xl border border-navy/10 bg-white py-1.5 shadow-elevated"
                  >
                    {CATEGORY_NAMES.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          onClick={() => {
                            setCategory(name);
                            setCatOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-orange-light hover:text-orange ${
                            name === category ? "font-semibold text-orange" : "text-navy/75"
                          }`}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search for surgical tools, diagnostic equipment, medical supplies..."
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-navy outline-none placeholder:text-navy/35"
            />

            <button className="my-1.5 mr-1.5 flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 text-sm font-semibold text-white shadow-glow-orange transition-transform duration-200 hover:scale-[1.02] active:scale-95">
              <Search className="h-4.5 w-4.5" />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>

          {/* Autocomplete */}
          <AnimatePresence>
            {focused && matches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease }}
                className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-navy/10 bg-white py-1.5 shadow-elevated"
              >
                <p className="px-4 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy/35">
                  {query.trim() ? "Suggestions" : "Popular searches"}
                </p>
                {matches.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={() => {
                      setQuery(s);
                      setFocused(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-navy/75 transition-colors hover:bg-orange-light hover:text-orange"
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-navy/30" />
                    <span className="truncate">{s}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to="/post-requirement"
            className="hidden items-center gap-1.5 rounded-lg border border-orange/70 px-3.5 py-2 text-[13px] font-semibold text-orange transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange hover:text-white xl:flex"
          >
            <FileText className="h-4 w-4" />
            Post Buy Requirement
          </Link>

          <Link
            to="/saved"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white/85 transition-colors hover:text-orange"
            aria-label="Saved items"
          >
            <Heart className="h-5 w-5" />
            <Badge count={savedCount} />
          </Link>

          <Link
            to="/inquiry"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white/85 transition-colors hover:text-orange"
            aria-label="Inquiry list"
          >
            <ClipboardList className="h-5 w-5" />
            <Badge count={inquiryCount} />
          </Link>

          <div ref={accountRef} className="relative">
            <button
              onClick={() => setAccountOpen((o) => !o)}
              className="flex h-10 items-center gap-1.5 rounded-lg px-2 text-white/85 transition-colors hover:text-orange"
            >
              <User className="h-5 w-5" />
              <ChevronDown className={`hidden h-3.5 w-3.5 transition-transform sm:block ${accountOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2, ease }}
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-navy/10 bg-white py-1.5 shadow-elevated"
                >
                  {[
                    { label: "My Profile", icon: User, to: "/account" },
                    { label: "My Orders", icon: Package, to: "/orders" },
                    { label: "Saved Items", icon: Bookmark, to: "/saved" },
                  ].map(({ label, icon: Icon, to }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy/75 transition-colors hover:bg-orange-light hover:text-orange"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-navy/10" />
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-navy/75 transition-colors hover:bg-red-50 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search — full width below the logo row */}
      <div className="px-4 pb-3 md:hidden">
        <div className="flex h-11 items-stretch overflow-hidden rounded-xl bg-white shadow-soft">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medical equipment..."
            className="min-w-0 flex-1 bg-transparent px-4 text-sm text-navy outline-none placeholder:text-navy/35"
          />
          <button className="flex shrink-0 items-center justify-center bg-gradient-to-b from-orange to-orange-dark px-4 text-white">
            <Search className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
