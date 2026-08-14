import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IconTile3D, BadgeCheckGlyph, HandCoinsGlyph, LayoutGridGlyph, MapPinnedGlyph } from "./icons3d";
import TiltCard3D from "./TiltCard3D";
import FlyThroughItem from "./FlyThroughItem";

const features = [
  {
    glyph: BadgeCheckGlyph,
    variant: "orange",
    title: "Verified Suppliers",
    description: "Every seller on our platform is verified for quality, licensing & compliance.",
  },
  {
    glyph: HandCoinsGlyph,
    variant: "navy",
    title: "Best Prices",
    description: "Compare quotes from multiple suppliers and negotiate the best deal.",
  },
  {
    glyph: LayoutGridGlyph,
    variant: "orange",
    title: "Wide Range",
    description: "10,000+ medical products across surgical, diagnostic & lab categories.",
  },
  {
    glyph: MapPinnedGlyph,
    variant: "navy",
    title: "Pan-India Network",
    description: "Verified suppliers and reliable delivery reaching every corner of India.",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.08, 0.78, 0.96], [0, 1, 1, 0]);
  const headingScale = useTransform(scrollYProgress, [0, 0.96], [0.85, 1.15]);

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ opacity: headingOpacity, scale: headingScale }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
              Why Choose Med-Mart
            </h2>
            <p className="mt-4 text-base font-light text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              Built for healthcare buyers and sellers who value trust
            </p>
          </motion.div>

          <div
            ref={gridRef}
            className="perspective relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f, i) => (
              <FlyThroughItem
                key={f.title}
                progress={scrollYProgress}
                index={i}
                total={features.length}
                gridRef={gridRef}
              >
                <TiltCard3D maxTilt={7} className="h-full rounded-2xl">
                  <div className="h-full rounded-2xl border border-white/25 bg-white/10 p-7 shadow-elevated transition-colors duration-500 ease-premium hover:border-orange/60 hover:bg-white/20">
                    <IconTile3D glyph={f.glyph} variant={f.variant} size={54} />
                    <h3 className="mt-5 font-display text-lg font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-white/75 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                      {f.description}
                    </p>
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
