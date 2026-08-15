import {
  SyringeGlyph,
  HeartPulseGlyph,
  ShieldGlyph,
  MicroscopeGlyph,
  HospitalBedGlyph,
  BoneGlyph,
  CrossGlyph,
  BoxesGlyph,
  LaptopGlyph,
  StethoscopeGlyph,
} from "../components/icons3d";

const img = (id, w = 600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

// Shared medical stock shots, reused across the dummy catalogue.
export const PHOTOS = {
  surgical: img("photo-1583324113626-70df0f4deaab"),
  diagnostic: img("photo-1631549916768-4119b2e5f926"),
  ppe: img("photo-1584362917165-526a968579e8"),
  lab: img("photo-1581595219315-a187dd40c322"),
  furniture: img("photo-1516549655169-df83a0774514"),
  ortho: img("photo-1607613009820-a29f7bb81c04"),
  dental: img("photo-1615486511484-92e172cc4fe0"),
  tech: img("photo-1666214280557-f1b5022eb634"),
};

/** Full category tree — drives the nav bar mega-menus and the icon row. */
export const CATEGORIES = [
  {
    slug: "surgical-instruments",
    name: "Surgical Instruments",
    glyph: SyringeGlyph,
    variant: "orange",
    count: "1,200+",
    photo: PHOTOS.surgical,
    columns: [
      { title: "Cutting & Dissecting", items: ["Scalpels & Blades", "Surgical Scissors", "Bone Cutters", "Curettes"] },
      { title: "Grasping & Clamping", items: ["Forceps", "Needle Holders", "Hemostats", "Towel Clamps"] },
      { title: "Retractors", items: ["Self-Retaining", "Handheld", "Abdominal", "Orthopedic"] },
    ],
  },
  {
    slug: "diagnostic-equipment",
    name: "Diagnostic Equipment",
    glyph: HeartPulseGlyph,
    variant: "navy",
    count: "980+",
    photo: PHOTOS.diagnostic,
    columns: [
      { title: "Imaging", items: ["X-Ray Machines", "Ultrasound Systems", "CT Accessories", "MRI Coils"] },
      { title: "Monitoring", items: ["Patient Monitors", "ECG Machines", "Pulse Oximeters", "BP Monitors"] },
      { title: "Point of Care", items: ["Glucometers", "Rapid Test Kits", "Thermometers", "Dopplers"] },
    ],
  },
  {
    slug: "ppe-safety",
    name: "PPE & Safety",
    glyph: ShieldGlyph,
    variant: "orange",
    count: "1,500+",
    photo: PHOTOS.ppe,
    columns: [
      { title: "Protection", items: ["N95 Respirators", "Surgical Masks", "Face Shields", "Goggles"] },
      { title: "Apparel", items: ["Gowns", "Coveralls", "Scrub Suits", "Shoe Covers"] },
      { title: "Hand Care", items: ["Nitrile Gloves", "Latex Gloves", "Sanitizers", "Surgical Scrub"] },
    ],
  },
  {
    slug: "lab-equipment",
    name: "Lab Equipment",
    glyph: MicroscopeGlyph,
    variant: "navy",
    count: "870+",
    photo: PHOTOS.lab,
    columns: [
      { title: "Analysis", items: ["Microscopes", "Centrifuges", "Analyzers", "Spectrophotometers"] },
      { title: "Sterilization", items: ["Autoclaves", "Hot Air Ovens", "UV Cabinets", "Incinerators"] },
      { title: "Storage", items: ["Lab Refrigerators", "Deep Freezers", "Incubators", "Cryo Storage"] },
    ],
  },
  {
    slug: "hospital-furniture",
    name: "Hospital Furniture",
    glyph: HospitalBedGlyph,
    variant: "orange",
    count: "650+",
    photo: PHOTOS.furniture,
    columns: [
      { title: "Beds", items: ["ICU Beds", "Semi-Fowler Beds", "Pediatric Cots", "Delivery Tables"] },
      { title: "Mobility", items: ["Wheelchairs", "Stretchers", "Patient Trolleys", "Walkers"] },
      { title: "Ward", items: ["Bedside Lockers", "Overbed Tables", "IV Stands", "Screens"] },
    ],
  },
  {
    slug: "orthopedic",
    name: "Orthopedic",
    glyph: BoneGlyph,
    variant: "navy",
    count: "540+",
    photo: PHOTOS.ortho,
    columns: [
      { title: "Implants", items: ["Bone Plates", "Screws & Pins", "Spinal Implants", "Joint Prosthetics"] },
      { title: "Supports", items: ["Knee Braces", "Cervical Collars", "Lumbar Belts", "Slings"] },
      { title: "Casting", items: ["POP Bandages", "Fiberglass Casts", "Cast Cutters", "Padding"] },
    ],
  },
  {
    slug: "dental",
    name: "Dental",
    glyph: CrossGlyph,
    variant: "orange",
    count: "460+",
    photo: PHOTOS.dental,
    columns: [
      { title: "Chairs & Units", items: ["Dental Chairs", "Delivery Units", "Operating Lights", "Stools"] },
      { title: "Instruments", items: ["Handpieces", "Scalers", "Extraction Forceps", "Mirrors"] },
      { title: "Materials", items: ["Composites", "Impression Material", "Cements", "Burs"] },
    ],
  },
  {
    slug: "disposables",
    name: "Disposables",
    glyph: BoxesGlyph,
    variant: "navy",
    count: "2,100+",
    photo: PHOTOS.ppe,
    columns: [
      { title: "Injection", items: ["Syringes", "Needles", "IV Cannulas", "Infusion Sets"] },
      { title: "Wound Care", items: ["Gauze & Bandages", "Adhesive Dressings", "Sutures", "Cotton"] },
      { title: "Tubing", items: ["Catheters", "Feeding Tubes", "Oxygen Masks", "Suction Tubes"] },
    ],
  },
  {
    slug: "medical-tech",
    name: "Medical Tech",
    glyph: LaptopGlyph,
    variant: "orange",
    count: "210+",
    photo: PHOTOS.tech,
    columns: [
      { title: "Software", items: ["Hospital HIS", "Clinic HMS", "PACS/RIS", "Telemedicine"] },
      { title: "Hardware", items: ["Kiosks", "Barcode Scanners", "Label Printers", "Tablets"] },
    ],
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    glyph: StethoscopeGlyph,
    variant: "navy",
    count: "390+",
    photo: PHOTOS.ortho,
    columns: [
      { title: "Electrotherapy", items: ["TENS Units", "Ultrasound Therapy", "Shortwave Diathermy", "IFT"] },
      { title: "Exercise", items: ["Resistance Bands", "Therapy Balls", "Parallel Bars", "Pedal Exercisers"] },
    ],
  },
];

/** Flat list for the search-bar dropdown. */
export const CATEGORY_NAMES = ["All Categories", ...CATEGORIES.map((c) => c.name)];

const P = (id, name, cat, photo, price, mrp, moq, rating, reviews, supplier, city, tags = []) => ({
  id,
  name,
  category: cat,
  photo,
  price,
  mrp,
  // percentage off, derived so the badge can never disagree with the prices
  discount: Math.round(((mrp - price) / mrp) * 100),
  moq,
  rating,
  reviews,
  supplier,
  city,
  tags,
});

/** Dummy catalogue — replaced by the API once product endpoints exist. */
export const PRODUCTS = [
  P(1, "Digital Portable X-Ray Machine 5kW", "diagnostic-equipment", PHOTOS.diagnostic, 289000, 365000, 1, 4.6, 128, "Medline Imaging Pvt. Ltd.", "Mumbai, MH", ["deal", "trending"]),
  P(2, "Multi-Parameter Patient Monitor 5-Para", "diagnostic-equipment", PHOTOS.diagnostic, 38500, 52000, 5, 4.4, 96, "CarePoint Systems", "Chennai, TN", ["deal", "recommended"]),
  P(3, "Surgical Instrument Kit — 20 Pieces", "surgical-instruments", PHOTOS.surgical, 9200, 14500, 10, 4.7, 214, "Precision Surgico", "Delhi NCR", ["deal", "trending"]),
  P(4, "ICU Electric Hospital Bed 5-Function", "hospital-furniture", PHOTOS.furniture, 52000, 74000, 2, 4.5, 73, "Aarogya Furnitech", "Ahmedabad, GJ", ["deal"]),
  P(5, "Laboratory Centrifuge 8000 RPM", "lab-equipment", PHOTOS.lab, 21500, 28000, 3, 4.3, 58, "LabTech Instruments", "Pune, MH", ["recommended"]),
  P(6, "N95 Respirator Masks — Box of 50", "ppe-safety", PHOTOS.ppe, 1350, 2400, 100, 4.8, 1042, "SafeGuard Medicals", "Bengaluru, KA", ["deal", "trending"]),
  P(7, "Portable Ultrasound Scanner Colour Doppler", "diagnostic-equipment", PHOTOS.diagnostic, 498000, 640000, 1, 4.6, 41, "Medline Imaging Pvt. Ltd.", "Hyderabad, TG", ["new"]),
  P(8, "Orthopedic Traction Unit — Adjustable", "orthopedic", PHOTOS.ortho, 27500, 36000, 2, 4.2, 37, "OrthoLine India", "Kolkata, WB", ["recommended"]),
  P(9, "Autoclave Vertical 50L Fully Automatic", "lab-equipment", PHOTOS.lab, 46000, 61000, 1, 4.5, 89, "SteriMax Equipments", "Pune, MH", ["deal", "recommended"]),
  P(10, "Nitrile Examination Gloves — 1000 pcs", "disposables", PHOTOS.ppe, 2150, 3200, 50, 4.6, 876, "SafeGuard Medicals", "Bengaluru, KA", ["deal"]),
  P(11, "Dental Chair with LED Operating Light", "dental", PHOTOS.dental, 168000, 215000, 1, 4.4, 52, "DentPro Systems", "Jaipur, RJ", ["new", "recommended"]),
  P(12, "ECG Machine 12-Channel with Trolley", "diagnostic-equipment", PHOTOS.diagnostic, 74500, 95000, 2, 4.5, 63, "CarePoint Systems", "Chennai, TN", ["recommended"]),
  P(13, "Stainless Steel Surgical Scissors Set", "surgical-instruments", PHOTOS.surgical, 3400, 5200, 25, 4.7, 305, "Precision Surgico", "Delhi NCR", ["trending"]),
  P(14, "Fowler Hospital Bed Manual 2-Crank", "hospital-furniture", PHOTOS.furniture, 24500, 33000, 3, 4.1, 44, "Aarogya Furnitech", "Ahmedabad, GJ", ["recommended"]),
  P(15, "Titanium Bone Plate & Screw System", "orthopedic", PHOTOS.ortho, 15800, 21000, 10, 4.6, 71, "OrthoLine India", "Kolkata, WB", ["new"]),
  P(16, "Binocular Compound Microscope 1000x", "lab-equipment", PHOTOS.lab, 32500, 44000, 2, 4.4, 112, "LabTech Instruments", "Pune, MH", ["deal"]),
  P(17, "Disposable Syringes 5ml — Box of 100", "disposables", PHOTOS.ppe, 620, 950, 200, 4.5, 1288, "MediDispose Corp", "Indore, MP", ["deal", "trending"]),
  P(18, "Surgical Gowns SMS Sterile — Pack of 25", "ppe-safety", PHOTOS.ppe, 2850, 4100, 40, 4.3, 197, "SafeGuard Medicals", "Bengaluru, KA", ["recommended"]),
  P(19, "Hospital Management Software — Annual", "medical-tech", PHOTOS.tech, 84000, 110000, 1, 4.2, 28, "HealthStack Labs", "Noida, UP", ["new"]),
  P(20, "TENS Electrotherapy Unit Dual Channel", "physiotherapy", PHOTOS.ortho, 8900, 12500, 5, 4.4, 84, "PhysioCare Devices", "Coimbatore, TN", ["new", "recommended"]),
  P(21, "Infusion Pump Volumetric with Alarm", "diagnostic-equipment", PHOTOS.diagnostic, 41500, 55000, 2, 4.5, 66, "CarePoint Systems", "Chennai, TN", ["recommended"]),
  P(22, "Foldable Steel Wheelchair with Brakes", "hospital-furniture", PHOTOS.furniture, 7400, 10500, 5, 4.3, 231, "Aarogya Furnitech", "Ahmedabad, GJ", ["deal", "trending"]),
  P(23, "Absorbable Surgical Sutures — Box of 12", "disposables", PHOTOS.surgical, 4200, 5900, 20, 4.6, 158, "MediDispose Corp", "Indore, MP", ["recommended"]),
  P(24, "Ultrasonic Dental Scaler Piezo", "dental", PHOTOS.dental, 18700, 25000, 2, 4.3, 47, "DentPro Systems", "Jaipur, RJ", ["new"]),
  P(25, "Fingertip Pulse Oximeter OLED — Pack of 10", "diagnostic-equipment", PHOTOS.diagnostic, 5600, 8900, 20, 4.7, 512, "CarePoint Systems", "Chennai, TN", ["deal", "trending"]),
];

export const byTag = (tag) => PRODUCTS.filter((p) => p.tags.includes(tag));
export const byCategory = (slug) => PRODUCTS.filter((p) => p.category === slug);

export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

/** Hero carousel slides. */
export const HERO_SLIDES = [
  {
    id: "bulk",
    eyebrow: "Limited period",
    title: "Bulk Orders, Better Margins",
    subtitle: "Up to 30% off on high-volume orders across surgical and disposable ranges.",
    cta: "Shop bulk deals",
    to: "/c/disposables",
    photo: PHOTOS.surgical,
  },
  {
    id: "diagnostic",
    eyebrow: "Just landed",
    title: "New Diagnostic Equipment Range",
    subtitle: "Imaging, monitoring and point-of-care devices from verified Indian suppliers.",
    cta: "Explore diagnostics",
    to: "/c/diagnostic-equipment",
    photo: PHOTOS.diagnostic,
  },
  {
    id: "ppe",
    eyebrow: "Always in stock",
    title: "PPE & Safety, Ready to Ship",
    subtitle: "N95 respirators, gowns and gloves with pan-India delivery in 3–5 days.",
    cta: "Browse PPE",
    to: "/c/ppe-safety",
    photo: PHOTOS.ppe,
  },
  {
    id: "rfq",
    eyebrow: "Can't find it?",
    title: "Post a Requirement, Get Quotes",
    subtitle: "Tell us what you need and verified suppliers respond within 24 hours.",
    cta: "Post requirement",
    to: "/post-requirement",
    photo: PHOTOS.lab,
  },
];

/** Small promo tiles beside the carousel. */
export const PROMO_TILES = [
  { id: "lab", title: "Lab Equipment", note: "Autoclaves & centrifuges", off: "25% OFF", to: "/c/lab-equipment", photo: PHOTOS.lab },
  { id: "furniture", title: "Hospital Furniture", note: "ICU beds & trolleys", off: "18% OFF", to: "/c/hospital-furniture", photo: PHOTOS.furniture },
  { id: "dental", title: "Dental Range", note: "Chairs, scalers & more", off: "New arrivals", to: "/c/dental", photo: PHOTOS.dental },
];

/** Popular search terms — the autocomplete matches against these. */
export const SEARCH_SUGGESTIONS = [
  "Surgical scissors stainless steel",
  "Digital patient monitor 5 para",
  "N95 respirator mask NIOSH",
  "Portable ultrasound scanner",
  "ICU electric hospital bed",
  "Autoclave 50 litre vertical",
  "Nitrile examination gloves",
  "Orthopedic bone plate titanium",
  "Dental chair with LED light",
  "Digital X-ray flat panel detector",
  "Infusion pump volumetric",
  "Laboratory centrifuge 8000 rpm",
  "Pulse oximeter fingertip",
  "Surgical suture absorbable",
  "Wheelchair foldable steel",
];
