import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import { featuredProducts } from "../data/siteData";
import TiltCard3D from "./TiltCard3D";
import FlyThroughItem from "./FlyThroughItem";
import { IconTile3D } from "./icons3d";
import { easePremium } from "../lib/motionVariants";

export default function FeaturedProducts() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.08, 0.78, 0.96], [0, 1, 1, 0]);
  const headingScale = useTransform(scrollYProgress, [0, 0.96], [0.85, 1.12]);

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ opacity: headingOpacity, scale: headingScale }}
            className="mb-10 text-center"
          >
            <h2 className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
              Trending Medical Equipment
            </h2>
            <p className="mt-4 text-base font-light text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              Popular products buyers are requesting quotes for
            </p>
          </motion.div>

          <div
            ref={gridRef}
            className="perspective relative grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
          >
            {featuredProducts.map((product, i) => (
              <FlyThroughItem
                key={product.name}
                progress={scrollYProgress}
                index={i}
                total={featuredProducts.length}
                gridRef={gridRef}
              >
                <TiltCard3D maxTilt={7} className="h-full rounded-2xl">
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-elevated transition-colors duration-500 ease-premium hover:border-orange/60 hover:bg-white/20">
                    <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-white/15 bg-white/10">
                      <div className="transition-transform duration-500 ease-premium group-hover:scale-110 group-hover:-rotate-3">
                        <IconTile3D glyph={product.glyph} variant={product.variant} size={64} />
                      </div>
                      <span className="absolute right-2 top-2 rounded-full border border-white/30 bg-navy-deep/70 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        {product.moq}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm font-extrabold text-orange drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                        {product.priceRange}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-light text-white/70 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                        <MapPin className="h-3.5 w-3.5 text-white/60" />
                        {product.location}
                      </div>
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96, y: 0 }}
                        transition={{ duration: 0.2, ease: easePremium }}
                        className="mt-3 w-full rounded-lg bg-gradient-to-b from-orange to-orange-dark py-2 text-xs font-semibold text-white shadow-glow-orange"
                      >
                        Get Best Price
                      </motion.button>
                    </div>
                  </div>
                </TiltCard3D>
              </FlyThroughItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
