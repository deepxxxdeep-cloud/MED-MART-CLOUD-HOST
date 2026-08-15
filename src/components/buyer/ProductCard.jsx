import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, MapPin, Star, Check, Plus } from "lucide-react";
import { formatINR } from "../../data/buyerData";
import { useShop } from "../../context/ShopContext";
import TiltCard3D from "../TiltCard3D";

const ease = [0.22, 1, 0.36, 1];

export default function ProductCard({ product, showNewBadge = false }) {
  const { addToInquiry, toggleSaved, isSaved, inInquiry } = useShop();
  const saved = isSaved(product.id);
  const added = inInquiry(product.id);

  return (
    <TiltCard3D maxTilt={6} className="h-full rounded-2xl" glare={false}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/8 bg-white shadow-soft transition-shadow duration-400 ease-premium hover:shadow-elevated">
        <Link to={`/p/${product.id}`} className="relative block overflow-hidden bg-surface">
          <img
            src={product.photo}
            alt={product.name}
            loading="lazy"
            className="h-40 w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.06]"
          />

          {product.discount > 0 && (
            <span className="glass absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-orange shadow-soft">
              {product.discount}% OFF on Bulk
            </span>
          )}
          {showNewBadge && (
            <span className="glass absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-orange shadow-soft">
              NEW
            </span>
          )}
        </Link>

        {/* Wishlist — sits outside the link so it never navigates */}
        <button
          onClick={() => toggleSaved(product)}
          aria-label={saved ? "Remove from saved" : "Save item"}
          aria-pressed={saved}
          className={`absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-full shadow-soft transition-all duration-300 ${
            showNewBadge ? "top-12" : "top-2.5"
          } ${saved ? "bg-orange text-white" : "bg-white/90 text-navy/45 hover:text-orange"}`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>

        <div className="flex flex-1 flex-col p-4">
          <Link to={`/p/${product.id}`}>
            <h3 className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-snug text-navy transition-colors hover:text-orange">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-base font-semibold text-navy">
              {formatINR(product.price)}
            </span>
            <span className="text-[11px] text-navy/35 line-through">{formatINR(product.mrp)}</span>
          </div>

          <p className="mt-1 text-[11px] font-medium text-navy/45">
            Min. Order: {product.moq} {product.moq === 1 ? "unit" : "units"}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 rounded bg-gold/15 px-1.5 py-0.5">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span className="text-[11px] font-bold text-navy/75">{product.rating}</span>
            </span>
            <span className="text-[11px] text-navy/40">({product.reviews})</span>
          </div>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-navy/45">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{product.city}</span>
          </div>

          {/* Reveals on hover where there's a pointer; always visible on touch,
              since there is no hover state to reveal it with. */}
          <motion.button
            onClick={() => addToInquiry(product)}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease }}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-[12.5px] font-semibold transition-all duration-300 ease-premium md:opacity-0 md:group-hover:opacity-100 ${
              added
                ? "bg-emerald-50 text-emerald-700 md:opacity-100"
                : "bg-gradient-to-b from-orange to-orange-dark text-white shadow-glow-orange"
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {added ? "In inquiry list" : "Add to Inquiry"}
          </motion.button>
        </div>
      </div>
    </TiltCard3D>
  );
}
