import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Plus,
  Star,
  Trash2,
  Upload,
  Bold,
  Italic,
  List as ListIcon,
} from "lucide-react";
import { CATEGORIES } from "../../data/buyerData";

const ease = [0.22, 1, 0.36, 1];
const STEPS = ["Basic Info", "Images", "Pricing & MOQ", "Specifications"];
const UNITS = ["Pieces", "Boxes", "Sets", "Kits", "Packs", "Units"];
const CERTS = ["ISO 13485", "CE Marking", "US FDA", "BIS", "WHO-GMP", "CDSCO"];

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-navy/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-navy/40">{hint}</span>}
    </label>
  );
}

const inputCls =
  "mt-1.5 h-11 w-full rounded-lg border border-navy/12 bg-white px-3 text-[13.5px] text-navy outline-none transition-colors focus:border-orange";

export default function AddProduct() {
  const [step, setStep] = useState(0);
  const [priceType, setPriceType] = useState("range");
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [tiers, setTiers] = useState([{ qty: "", price: "" }]);
  const [specs, setSpecs] = useState([{ key: "Material", value: "Surgical Stainless Steel 316L" }]);
  const [certs, setCerts] = useState(["ISO 13485"]);
  const dragIndex = useRef(null);
  const fileRef = useRef(null);

  const addFiles = (files) => {
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 8 - images.length)
      .map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f), name: f.name }));
    setImages((list) => [...list, ...next]);
  };

  // Reorder by dragging one preview onto another.
  const onDropReorder = (target) => {
    const from = dragIndex.current;
    if (from === null || from === target) return;
    setImages((list) => {
      const copy = [...list];
      const [moved] = copy.splice(from, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
    dragIndex.current = null;
  };

  const makeMain = (i) =>
    setImages((list) => {
      const copy = [...list];
      const [main] = copy.splice(i, 1);
      return [main, ...copy];
    });

  const toggleCert = (c) =>
    setCerts((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Progress */}
      <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-navy">
            Step {step + 1} of {STEPS.length}
            <span className="ml-2 font-normal text-navy/45">{STEPS[step]}</span>
          </p>
          <p className="text-[12px] text-navy/45">
            {Math.round(((step + 1) / STEPS.length) * 100)}% complete
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy/8">
          <motion.div
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.45, ease }}
            className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark"
          />
        </div>
        <ol className="mt-3 flex justify-between">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-1.5 text-[11.5px] font-medium ${
                i <= step ? "text-orange" : "text-navy/35"
              }`}
            >
              <span
                className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[9px] font-bold ${
                  i < step ? "bg-orange text-white" : i === step ? "ring-2 ring-orange" : "bg-navy/10"
                }`}
              >
                {i < step ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Steps */}
      <div className="rounded-2xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease }}
          >
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Product name">
                    <input className={inputCls} placeholder="e.g. Surgical Instrument Kit — 20 Pieces" />
                  </Field>
                </div>
                <Field label="Category">
                  <select className={inputCls} defaultValue="">
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Subcategory">
                  <select className={inputCls} defaultValue="">
                    <option value="" disabled>
                      Select a subcategory
                    </option>
                    {CATEGORIES[0].columns.flatMap((col) => col.items).map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Brand" hint="Optional">
                  <input className={inputCls} placeholder="e.g. Precision Surgico" />
                </Field>
                <Field label="Model / SKU" hint="Optional">
                  <input className={inputCls} placeholder="e.g. PS-KIT-20" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Short description" hint="Shown in search results — keep it under 200 characters">
                    <textarea
                      rows={3}
                      className={`${inputCls} h-auto py-2.5`}
                      placeholder="A concise summary buyers will see first…"
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                    dragOver ? "border-orange bg-orange-light/60" : "border-navy/15 bg-surface"
                  }`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-orange to-orange-dark shadow-glow-orange">
                    <Upload className="h-6 w-6 text-white" />
                  </span>
                  <p className="mt-4 text-[14px] font-semibold text-navy">
                    Drag images here, or click to browse
                  </p>
                  <p className="mt-1 text-[12px] text-navy/45">
                    JPG or PNG, up to 8 images · {images.length}/8 added
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>

                {images.length > 0 && (
                  <>
                    <p className="mt-5 text-[12px] text-navy/45">
                      Drag a thumbnail onto another to reorder. The first image is the main one.
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {images.map((img, i) => (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={() => (dragIndex.current = i)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => onDropReorder(i)}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-navy/10"
                        >
                          <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                          {i === 0 && (
                            <span className="absolute left-1.5 top-1.5 rounded-full bg-orange px-2 py-0.5 text-[9px] font-bold text-white">
                              MAIN
                            </span>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy-deep/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => makeMain(i)}
                              aria-label="Set as main image"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-navy hover:text-orange"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setImages((l) => l.filter((x) => x.id !== img.id))}
                              aria-label="Remove image"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {images.length < 8 && (
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-navy/15 text-navy/35 hover:border-orange hover:text-orange"
                        >
                          <ImagePlus className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <span className="text-[12px] font-semibold text-navy/60">Price type</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      ["fixed", "Fixed Price"],
                      ["range", "Price Range"],
                      ["quote", "Get Quote"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setPriceType(key)}
                        className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
                          priceType === key
                            ? "bg-gradient-to-b from-orange to-orange-dark text-white shadow-glow-orange"
                            : "border border-navy/12 bg-white text-navy/60 hover:border-orange hover:text-orange"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {priceType !== "quote" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={priceType === "range" ? "Minimum price (₹)" : "Price (₹)"}>
                      <input type="number" className={inputCls} placeholder="9200" />
                    </Field>
                    {priceType === "range" && (
                      <Field label="Maximum price (₹)">
                        <input type="number" className={inputCls} placeholder="14500" />
                      </Field>
                    )}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Minimum order quantity">
                    <input type="number" className={inputCls} placeholder="10" />
                  </Field>
                  <Field label="Unit of measurement">
                    <select className={inputCls}>
                      {UNITS.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-navy/60">
                      Bulk pricing tiers <span className="font-normal text-navy/35">(optional)</span>
                    </span>
                    <button
                      onClick={() => setTiers((t) => [...t, { qty: "", price: "" }])}
                      className="flex items-center gap-1 text-[12px] font-semibold text-orange hover:opacity-75"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add pricing tier
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {tiers.map((t, i) => (
                      <div key={i} className="flex gap-2">
                        <input placeholder="Min qty (e.g. 50)" className={`${inputCls} mt-0`} />
                        <input placeholder="Price per unit (₹)" className={`${inputCls} mt-0`} />
                        <button
                          onClick={() => setTiers((l) => l.filter((_, x) => x !== i))}
                          aria-label="Remove tier"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navy/12 text-navy/40 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-navy/60">Specifications</span>
                    <button
                      onClick={() => setSpecs((s) => [...s, { key: "", value: "" }])}
                      className="flex items-center gap-1 text-[12px] font-semibold text-orange hover:opacity-75"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add specification
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {specs.map((s, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          defaultValue={s.key}
                          placeholder="Name (e.g. Material)"
                          className={`${inputCls} mt-0`}
                        />
                        <input
                          defaultValue={s.value}
                          placeholder="Value (e.g. Stainless Steel)"
                          className={`${inputCls} mt-0`}
                        />
                        <button
                          onClick={() => setSpecs((l) => l.filter((_, x) => x !== i))}
                          aria-label="Remove specification"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navy/12 text-navy/40 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[12px] font-semibold text-navy/60">Detailed description</span>
                  <div className="mt-1.5 overflow-hidden rounded-lg border border-navy/12">
                    <div className="flex gap-1 border-b border-navy/8 bg-surface px-2 py-1.5">
                      {[Bold, Italic, ListIcon].map((Icon, i) => (
                        <button
                          key={i}
                          onClick={(e) => e.preventDefault()}
                          className="flex h-7 w-7 items-center justify-center rounded text-navy/50 hover:bg-white hover:text-orange"
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </button>
                      ))}
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-32 px-3 py-2.5 text-[13.5px] text-navy outline-none"
                    >
                      Describe materials, sterilisation method, packaging and what's included…
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[12px] font-semibold text-navy/60">
                    Certifications &amp; compliance
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CERTS.map((c) => {
                      const on = certs.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleCert(c)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold transition-colors ${
                            on
                              ? "bg-orange-light text-orange ring-1 ring-orange/40"
                              : "border border-navy/12 bg-white text-navy/55 hover:border-orange"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded ${
                              on ? "bg-orange text-white" : "border border-navy/20"
                            }`}
                          >
                            {on && <Check className="h-3 w-3" strokeWidth={3.5} />}
                          </span>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy/65 transition-colors hover:border-orange hover:text-orange disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>
        <button className="rounded-lg border border-navy/12 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy/65 hover:border-orange hover:text-orange">
          Save as Draft
        </button>

        <div className="ml-auto">
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange transition-transform hover:scale-[1.02] active:scale-95"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange transition-transform hover:scale-[1.02] active:scale-95">
              <Check className="h-4 w-4" />
              Publish Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
