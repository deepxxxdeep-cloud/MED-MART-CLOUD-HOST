import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { easePremium, windowItem } from "../lib/motionVariants";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-orange/20 blur-3xl" />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 animate-float rounded-full bg-orange/10 blur-3xl"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        variants={windowItem}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
          Are You a Medical Equipment Supplier?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg font-light leading-relaxed text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
          Join Med-Mart and reach thousands of verified buyers across India
        </p>
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96, y: 0 }}
          transition={{ duration: 0.2, ease: easePremium }}
          className="group animate-pulse-glow mt-9 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-8 py-3.5 text-base font-semibold text-white shadow-glow-orange"
        >
          Start Selling Today
          <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </section>
  );
}
