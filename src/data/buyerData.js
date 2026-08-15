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
