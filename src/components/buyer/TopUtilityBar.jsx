import { MapPin, ChevronDown, Truck, LifeBuoy, Store } from "lucide-react";
import { Link } from "react-router-dom";

const LINKS = [
  { label: "Track Order", icon: Truck, to: "/orders/track" },
  { label: "Help Center", icon: LifeBuoy, to: "/help" },
  { label: "Become a Seller", icon: Store, to: "/signup" },
];

export default function TopUtilityBar() {
  return (
    <div className="bg-navy-deep text-white/80">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between gap-4 px-4 text-[12px] sm:px-6 lg:px-8">
        <button className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-white">
          <MapPin className="h-3.5 w-3.5 text-orange" />
          <span className="text-white/60">Deliver to:</span>
          <span className="font-semibold text-white">Mumbai 400001</span>
        </button>

        <div className="flex items-center gap-5">
          {LINKS.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="hidden items-center gap-1.5 transition-colors hover:text-white sm:flex"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}

          <button className="flex items-center gap-1.5 border-l border-white/15 pl-5 transition-colors hover:text-white">
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
              IN
            </span>
            <span className="font-medium">EN / INR</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
