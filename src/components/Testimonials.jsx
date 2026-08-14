import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "../data/siteData";
import TiltCard3D from "./TiltCard3D";
import FlyThroughItem from "./FlyThroughItem";

function initials(name) {
  return name
    .split(" ")
    .filter((w) => w[0] === w[0].toUpperCase())
    .map((w) => w[0])
    .slice(-2)
    .join("");
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.08, 0.78, 0.96], [0, 1, 1, 0]);
  const headingScale = useTransform(scrollYProgress, [0, 0.96], [0.85, 1.12]);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ opacity: headingOpacity, scale: headingScale }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
              Trusted by Healthcare Businesses Across India
            </h2>
            <p className="mt-4 text-base font-light text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              Hear from buyers and sellers on the Med-Mart platform
            </p>
          </motion.div>

          <div ref={gridRef} className="perspective relative grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <FlyThroughItem
                key={t.name}
                progress={scrollYProgress}
                index={i}
                total={testimonials.length}
                gridRef={gridRef}
              >
                <TiltCard3D maxTilt={6} className="h-full rounded-2xl">
                  <div className="flex h-full flex-col rounded-2xl border border-white/25 bg-white/10 p-7 shadow-elevated transition-colors duration-500 ease-premium hover:border-orange/60 hover:bg-white/20">
                    <Quote className="h-7 w-7 text-orange" />
                    <p className="mt-4 flex-1 text-sm font-light leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                      "{t.quote}"
                    </p>
                    <div className="mt-5 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${
                            idx < t.rating
                              ? "fill-gold text-gold drop-shadow-[0_0_4px_rgba(232,178,61,0.6)]"
                              : "fill-white/20 text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3 border-t border-white/20 pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-deep text-xs font-bold text-white ring-2 ring-orange/60 shadow-glow-navy">
                        {initials(t.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                          {t.name}
                        </p>
                        <p className="text-xs font-light text-white/70 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                          {t.company}
                        </p>
                      </div>
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
