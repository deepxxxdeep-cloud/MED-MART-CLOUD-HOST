import { motion } from "framer-motion";
import TiltCard3D from "./TiltCard3D";
import { easePremium, windowItem } from "../lib/motionVariants";

const buyerSteps = [
  { title: "Search Product", description: "Find the exact medical equipment or tool you need from our catalog." },
  { title: "Compare Quotes", description: "Receive and compare quotes from multiple verified suppliers." },
  { title: "Connect & Purchase", description: "Chat directly with suppliers and close the deal with confidence." },
];

const sellerSteps = [
  { title: "Register & List Products", description: "Create your seller profile and list your product catalog." },
  { title: "Receive Buyer Inquiries", description: "Get matched with genuine buyers actively looking to purchase." },
  { title: "Close Deals", description: "Negotiate and finalize orders directly through the platform." },
];

function StepColumn({ heading, steps, accent, glow }) {
  return (
    <TiltCard3D maxTilt={5} className="h-full rounded-2xl">
      <div className="h-full rounded-2xl border border-white/25 bg-white/10 p-7 shadow-elevated transition-colors duration-500 ease-premium hover:border-orange/60 hover:bg-white/20 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          {heading}
        </h3>
        <div className="mt-7 flex flex-col gap-7">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${accent} ${glow}`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="mt-1 w-px flex-1 bg-white/25" />}
              </div>
              <div className={i < steps.length - 1 ? "pb-2" : ""}>
                <p className="font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  {step.title}
                </p>
                <p className="mt-1 text-sm font-light leading-relaxed text-white/75 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard3D>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easePremium }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
            How Med-Mart Works
          </h2>
          <p className="mt-4 text-base font-light text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            Simple, transparent process for both buyers and sellers
          </p>
        </motion.div>

        <div className="perspective grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            variants={windowItem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <StepColumn heading="For Buyers" steps={buyerSteps} accent="bg-navy" glow="shadow-glow-navy" />
          </motion.div>
          <motion.div
            variants={{
              hidden: windowItem.hidden,
              show: { ...windowItem.show, transition: { ...windowItem.show.transition, delay: 0.15 } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <StepColumn
              heading="For Sellers"
              steps={sellerSteps}
              accent="bg-gradient-to-b from-orange to-orange-dark"
              glow="shadow-glow-orange"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
