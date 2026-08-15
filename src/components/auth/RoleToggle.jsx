import { motion } from "framer-motion";
import { IconTile3D, PackageGlyph, StoreGlyph } from "../icons3d";

const ROLES = [
  { id: "buyer", label: "I'm a Buyer", hint: "Source equipment", glyph: PackageGlyph },
  { id: "seller", label: "I'm a Seller", hint: "List & sell", glyph: StoreGlyph },
];

export default function RoleToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ROLES.map((role) => {
        const active = value === role.id;
        return (
          <motion.button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-300 ease-premium
              ${
                active
                  ? "border-orange bg-orange-light/60 shadow-glow-orange"
                  : "border-navy/12 bg-white/60 hover:border-navy/25"
              }`}
          >
            <IconTile3D
              glyph={role.glyph}
              variant={active ? "orange" : "navy"}
              size={38}
              className={active ? "" : "opacity-60"}
            />
            <p className={`mt-3 text-sm font-semibold ${active ? "text-orange" : "text-navy/70"}`}>
              {role.label}
            </p>
            <p className="mt-0.5 text-[11px] text-navy/40">{role.hint}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
