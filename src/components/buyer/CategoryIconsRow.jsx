import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../data/buyerData";
import { IconTile3D } from "../icons3d";

const ease = [0.22, 1, 0.36, 1];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export default function CategoryIconsRow() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-10 sm:px-6 lg:px-8">
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        // Scrolls horizontally on small screens instead of wrapping into a
        // ragged grid; snaps so items don't come to rest half-cut.
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible lg:grid-cols-10 [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map((cat) => (
          <motion.li key={cat.slug} variants={item} className="w-[88px] shrink-0 snap-start sm:w-auto">
            <Link to={`/c/${cat.slug}`} className="group flex flex-col items-center gap-2.5 text-center">
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-navy/8 bg-white shadow-soft transition-all duration-300 ease-premium group-hover:-translate-y-1 group-hover:border-orange/40 group-hover:shadow-elevated">
                <IconTile3D glyph={cat.glyph} variant={cat.variant} size={40} />
              </span>
              <span className="text-[11.5px] font-medium leading-tight text-navy/75 transition-colors group-hover:text-orange">
                {cat.name}
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
