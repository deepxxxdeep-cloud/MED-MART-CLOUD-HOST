import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { categories } from "../data/siteData";
import { IconTile3D } from "./icons3d";
import TiltCard3D from "./TiltCard3D";
import FlyThroughItem from "./FlyThroughItem";

export default function CategoryGrid() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Heading fades in first, then drifts back as the cards fly past it.
  const headingOpacity = useTransform(scrollYProgress, [0, 0.08, 0.75, 0.95], [0, 1, 1, 0]);
  const headingScale = useTransform(scrollYProgress, [0, 0.95], [0.85, 1.15]);

  return (
    <section ref={sectionRef} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ opacity: headingOpacity, scale: headingScale }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
              Shop by Category
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-light leading-relaxed text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              Explore thousands of verified medical products across every specialty
            </p>
          </motion.div>

          <div
            ref={gridRef}
            className="perspective relative grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-5"
          >
            {categories.map((cat, i) => {
              const Glyph = cat.glyph;
              return (
                <FlyThroughItem
                  key={cat.name}
                  progress={scrollYProgress}
                  index={i}
                  total={categories.length}
                  gridRef={gridRef}
                >
                  <a href="#" className="group block pt-8">
                    <TiltCard3D maxTilt={9} className="rounded-2xl">
                      <div className="relative rounded-2xl border border-white/25 bg-white/10 px-4 pb-6 pt-11 text-center shadow-elevated transition-colors duration-500 ease-premium group-hover:border-orange/60 group-hover:bg-white/20">
                        <div
                          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-premium group-hover:-translate-y-[60%] group-hover:scale-110"
                          style={{ transform: "translateZ(40px)" }}
                        >
                          <IconTile3D glyph={Glyph} variant={cat.variant} size={56} />
                        </div>

                        <p className="text-sm font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                          {cat.name}
                        </p>
                        <p className="mt-1.5 text-xs font-medium tracking-wide text-white/70 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                          {cat.count} Products
                        </p>
                      </div>
                    </TiltCard3D>
                  </a>
                </FlyThroughItem>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
