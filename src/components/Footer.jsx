import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";
import Logo from "./Logo";

const quickLinks = ["About Us", "Contact", "How It Works", "Blog"];
const buyerLinks = ["Post Requirement", "Browse Categories", "Track Inquiry"];
const sellerLinks = ["Register as Seller", "Seller Dashboard", "Pricing"];
const socials = [FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon];

function LinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">{title}</h4>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm font-light text-gray-400 transition-colors duration-300 hover:text-orange">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/15 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <Logo dark className="group" />
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-gray-400">
              India's trusted B2B marketplace connecting healthcare buyers with verified suppliers
              of medical equipment, tools & technology.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-orange hover:shadow-lg hover:shadow-orange/30"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Quick Links" links={quickLinks} />
          <LinkColumn title="For Buyers" links={buyerLinks} />
          <LinkColumn title="For Sellers" links={sellerLinks} />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-gray-400 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Med-Mart. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-orange">
              Terms &amp; Conditions
            </a>
            <a href="#" className="transition hover:text-orange">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
