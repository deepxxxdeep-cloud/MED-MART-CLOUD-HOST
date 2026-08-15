import { Link } from "react-router-dom";
import Logo from "../Logo";
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from "../SocialIcons";

const COLUMNS = [
  {
    title: "Quick Links",
    links: [
      ["About Us", "/about"],
      ["Contact", "/contact"],
      ["How It Works", "/how-it-works"],
      ["Blog", "/blog"],
    ],
  },
  {
    title: "For Buyers",
    links: [
      ["Post Requirement", "/post-requirement"],
      ["Browse Categories", "/shop"],
      ["My Orders", "/orders"],
      ["Track Shipment", "/orders/track"],
    ],
  },
  {
    title: "Buyer Support",
    links: [
      ["Return Policy", "/returns"],
      ["Buyer Protection", "/buyer-protection"],
      ["Track Inquiry", "/inquiry"],
      ["Help Center", "/help"],
    ],
  },
  {
    title: "For Sellers",
    links: [
      ["Register as Seller", "/signup"],
      ["Seller Dashboard", "/seller"],
      ["Pricing", "/pricing"],
    ],
  },
];

const SOCIALS = [FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon];

export default function BuyerFooter() {
  return (
    <footer className="mt-16 bg-navy-deep text-gray-300">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="group">
              <Logo dark />
            </Link>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-gray-400">
              India's trusted B2B marketplace connecting healthcare buyers with verified suppliers
              of medical equipment, tools &amp; technology.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-orange hover:shadow-lg hover:shadow-orange/30"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm font-light text-gray-400 transition-colors duration-300 hover:text-orange"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-gray-400 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Med-Mart. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="transition hover:text-orange">
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" className="transition hover:text-orange">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-4 py-5 text-center sm:px-6 lg:px-8">
          <a
            href="https://aiwebify.site"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors duration-300 hover:text-orange"
          >
            Made by
            <span className="relative font-semibold text-white transition-colors duration-300 group-hover:text-orange">
              aiwebify.site
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-orange transition-all duration-300 group-hover:w-full" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
