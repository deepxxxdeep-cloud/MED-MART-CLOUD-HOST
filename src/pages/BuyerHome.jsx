import { useState } from "react";
import TopUtilityBar from "../components/buyer/TopUtilityBar";
import BuyerHeader from "../components/buyer/BuyerHeader";
import CategoryNav from "../components/buyer/CategoryNav";
import HeroCarousel from "../components/buyer/HeroCarousel";
import CategoryIconsRow from "../components/buyer/CategoryIconsRow";
import ProductSection from "../components/buyer/ProductSection";
import ShopByCategory from "../components/buyer/ShopByCategory";
import ProductGrid from "../components/buyer/ProductGrid";
import TrustedSuppliers from "../components/buyer/TrustedSuppliers";
import RFQBanner from "../components/buyer/RFQBanner";
import BuyerFooter from "../components/buyer/BuyerFooter";
import { PRODUCTS, byTag, byCategory } from "../data/buyerData";

export default function BuyerHome() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-sans">
      {/* The masthead sticks so search and categories stay reachable while
          browsing long product lists. */}
      <header className="sticky top-0 z-50">
        <TopUtilityBar />
        <BuyerHeader onToggleMobileNav={() => setMobileNav((v) => !v)} />
        <CategoryNav mobileOpen={mobileNav} />
      </header>

      <main>
        <HeroCarousel />
        <CategoryIconsRow />

        <ProductSection
          title="Bulk Order Deals"
          subtitle="Volume pricing from verified suppliers"
          products={byTag("deal")}
        />

        <ShopByCategory />

        <ProductGrid
          title="Recommended for You"
          subtitle="Based on your browsing history"
          products={PRODUCTS}
          initial={10}
          step={5}
        />

        <TrustedSuppliers />

        <ProductSection
          title="Just Launched"
          subtitle="New arrivals across categories"
          products={byTag("new")}
          showNewBadge
        />

        <RFQBanner />

        <ProductSection
          title="Popular in Surgical Instruments"
          viewAllTo="/c/surgical-instruments"
          products={byCategory("surgical-instruments")}
        />
        <ProductSection
          title="Trending in Diagnostic Equipment"
          viewAllTo="/c/diagnostic-equipment"
          products={byCategory("diagnostic-equipment")}
        />
      </main>

      <BuyerFooter />
    </div>
  );
}
