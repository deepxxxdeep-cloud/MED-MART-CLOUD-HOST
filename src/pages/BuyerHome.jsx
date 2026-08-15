import { useState } from "react";
import TopUtilityBar from "../components/buyer/TopUtilityBar";
import BuyerHeader from "../components/buyer/BuyerHeader";
import CategoryNav from "../components/buyer/CategoryNav";

export default function BuyerHome() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-sans">
      {/* The whole masthead sticks — search and categories stay reachable
          while browsing long product lists. */}
      <header className="sticky top-0 z-50">
        <TopUtilityBar />
        <BuyerHeader onToggleMobileNav={() => setMobileNav((v) => !v)} />
        <CategoryNav mobileOpen={mobileNav} />
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-navy/40">
          Sections build out from here — hero carousel next.
        </p>
      </main>
    </div>
  );
}
