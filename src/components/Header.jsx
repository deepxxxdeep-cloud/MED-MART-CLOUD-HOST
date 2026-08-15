import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Menu, X, Store } from "lucide-react";
import { categoryMenu } from "../data/siteData";
import Logo from "./Logo";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/15 bg-navy-deep/25">
      {/* Main header row */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group">
          <Logo dark />
        </Link>

        {/* Search bar - desktop */}
        <div className="hidden flex-1 md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for medical equipment, tools, suppliers..."
              className="w-full rounded-full border border-white/15 bg-white/90 py-2.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/20"
            />
          </div>
        </div>

        {/* Right actions - desktop */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <button className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-4 py-2 text-sm font-semibold text-white shadow-glow-orange transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
            <Store className="h-4 w-4" />
            Sell on Med-Mart
          </button>
          <Link
            to="/login"
            className="glass rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 active:translate-y-0"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-white md:ml-0 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Search bar - mobile */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment, suppliers..."
            className="w-full rounded-full border border-white/15 bg-white/90 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-orange focus:bg-white"
          />
        </div>
      </div>

      {/* Category menu bar - desktop */}
      <nav className="hidden border-t border-white/10 bg-navy-deep/20 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {categoryMenu.map((cat) => (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => setOpenCategory(cat.name)}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <button className="flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-200 transition hover:text-orange">
                {cat.name}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {openCategory === cat.name && (
                <div className="animate-in absolute left-0 top-full z-50 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-2xl shadow-navy/20 ring-1 ring-black/5">
                  {cat.items.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-orange-light hover:text-orange"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy-deep/90 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {categoryMenu.map((cat) => (
              <details key={cat.name} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between py-2.5 text-sm font-medium text-gray-200">
                  {cat.name}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="ml-3 flex flex-col gap-1 border-l border-white/15 pl-3 pb-2">
                  {cat.items.map((item) => (
                    <a key={item} href="#" className="py-1.5 text-sm text-gray-400 hover:text-orange">
                      {item}
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 px-4 py-4">
            <button className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-4 py-2.5 text-sm font-semibold text-white">
              <Store className="h-4 w-4" />
              Sell on Med-Mart
            </button>
            <div className="flex gap-2">
              <Link
                to="/login"
                className="glass flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex-1 rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-navy"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
