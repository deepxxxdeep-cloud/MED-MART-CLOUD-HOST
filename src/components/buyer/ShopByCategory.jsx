import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../data/buyerData";
import { RICH_MOTION } from "../../hooks/usePointerCapability";

const ease = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export default function ShopByCategory() {
  const featured = CATEGORIES.slice(0, 6);

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-14 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.6, ease }}
        className="mb-6"
      >
        <h2 className="font-display text-xl font-semibold tracking-tight text-navy sm:text-2xl">
          Shop by Category
        </h2>
        <p className="mt-1 text-[13px] font-light text-navy/45">
          Browse verified listings across every specialty
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 gap-4 md:grid-cols-3"
      >
        {featured.map((cat) => (
          <motion.div key={cat.slug} variants={item}>
            <Link
              to={`/c/${cat.slug}`}
              className="group relative block h-40 overflow-hidden rounded-2xl shadow-soft transition-shadow duration-400 ease-premium hover:shadow-elevated sm:h-48"
            >
              <img
                src={cat.photo}
                alt=""
                loading="lazy"
                className={`h-full w-full object-cover ${
                  RICH_MOTION ? "transition-transform duration-600 ease-premium group-hover:scale-108" : ""
                }`}
              />
              {/* Scrim so the label stays readable over any photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-sm font-semibold text-white sm:text-base">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-[11px] font-light text-white/65">
                  {cat.count} products
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
