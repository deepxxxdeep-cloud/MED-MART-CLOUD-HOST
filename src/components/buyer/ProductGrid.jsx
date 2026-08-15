import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const ease = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function ProductGrid({ title, subtitle, products, initial = 10, step = 5, showNewBadge }) {
  const [shown, setShown] = useState(initial);
  const visible = products.slice(0, shown);
  const more = shown < products.length;

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-14 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.6, ease }}
        className="mb-5"
      >
        <h2 className="font-display text-xl font-semibold tracking-tight text-navy sm:text-2xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-[13px] font-light text-navy/45">{subtitle}</p>}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="perspective grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {visible.map((p) => (
          <motion.div key={p.id} variants={item}>
            <ProductCard product={p} showNewBadge={showNewBadge} />
          </motion.div>
        ))}
      </motion.div>

      {more && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShown((n) => n + step)}
            className="glass rounded-xl border border-orange/50 px-7 py-3 text-sm font-semibold text-orange shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange hover:text-white"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
