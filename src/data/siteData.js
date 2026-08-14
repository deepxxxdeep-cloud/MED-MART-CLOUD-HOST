import {
  StethoscopeGlyph,
  SyringeGlyph,
  MicroscopeGlyph,
  HospitalBedGlyph,
  ShieldGlyph,
  BoneGlyph,
  CrossGlyph,
  BoxesGlyph,
  LaptopGlyph,
  HeartPulseGlyph,
  XRayGlyph,
  MonitorGlyph,
  ScalpelGlyph,
  CentrifugeGlyph,
  MaskGlyph,
  UltrasoundGlyph,
} from "../components/icons3d";

export const categoryMenu = [
  {
    name: "Surgical Instruments",
    items: ["Scalpels & Blades", "Forceps", "Surgical Scissors", "Retractors"],
  },
  {
    name: "Diagnostic Equipment",
    items: ["ECG Machines", "Ultrasound Systems", "X-Ray Machines", "Patient Monitors"],
  },
  {
    name: "Hospital Furniture",
    items: ["Hospital Beds", "ICU Beds", "Wheelchairs", "Stretchers"],
  },
  {
    name: "PPE & Safety",
    items: ["Face Masks", "Gloves", "Gowns & Coveralls", "Face Shields"],
  },
  {
    name: "Lab Equipment",
    items: ["Centrifuges", "Microscopes", "Autoclaves", "Lab Refrigerators"],
  },
  {
    name: "Orthopedic Supplies",
    items: ["Implants", "Braces & Supports", "Traction Equipment", "Casting Supplies"],
  },
  {
    name: "Dental Equipment",
    items: ["Dental Chairs", "Dental X-Ray", "Sterilizers", "Hand Instruments"],
  },
  {
    name: "Disposables",
    items: ["Syringes & Needles", "IV Sets", "Catheters", "Surgical Drapes"],
  },
];

export const categories = [
  { name: "Surgical Instruments", glyph: SyringeGlyph, variant: "orange", count: "1,200+" },
  { name: "Diagnostic Equipment", glyph: HeartPulseGlyph, variant: "navy", count: "980+" },
  { name: "Hospital Furniture", glyph: HospitalBedGlyph, variant: "orange", count: "650+" },
  { name: "PPE & Safety Equipment", glyph: ShieldGlyph, variant: "navy", count: "1,500+" },
  { name: "Lab & Testing Equipment", glyph: MicroscopeGlyph, variant: "orange", count: "870+" },
  { name: "Orthopedic Supplies", glyph: BoneGlyph, variant: "navy", count: "540+" },
  { name: "Dental Equipment", glyph: CrossGlyph, variant: "orange", count: "460+" },
  { name: "Physiotherapy Equipment", glyph: StethoscopeGlyph, variant: "navy", count: "390+" },
  { name: "Disposables & Consumables", glyph: BoxesGlyph, variant: "orange", count: "2,100+" },
  { name: "Medical Software & Tech", glyph: LaptopGlyph, variant: "navy", count: "210+" },
];

export const featuredProducts = [
  {
    name: "Digital Portable X-Ray Machine",
    priceRange: "₹2,50,000 - ₹6,50,000",
    moq: "MOQ: 1 unit",
    location: "Mumbai, Maharashtra",
    glyph: XRayGlyph,
    variant: "navy",
  },
  {
    name: "Multi-Parameter Patient Monitor",
    priceRange: "₹35,000 - ₹95,000",
    moq: "MOQ: 5 units",
    location: "Chennai, Tamil Nadu",
    glyph: MonitorGlyph,
    variant: "orange",
  },
  {
    name: "Surgical Instrument Kit (Set of 20)",
    priceRange: "₹8,000 - ₹22,000",
    moq: "MOQ: 10 sets",
    location: "Delhi NCR",
    glyph: ScalpelGlyph,
    variant: "navy",
  },
  {
    name: "ICU Electric Hospital Bed",
    priceRange: "₹45,000 - ₹1,20,000",
    moq: "MOQ: 2 units",
    location: "Ahmedabad, Gujarat",
    glyph: HospitalBedGlyph,
    variant: "orange",
  },
  {
    name: "Digital Laboratory Centrifuge",
    priceRange: "₹18,000 - ₹55,000",
    moq: "MOQ: 3 units",
    location: "Pune, Maharashtra",
    glyph: CentrifugeGlyph,
    variant: "navy",
  },
  {
    name: "N95 Respirator Masks (Box of 50)",
    priceRange: "₹1,200 - ₹2,800",
    moq: "MOQ: 100 boxes",
    location: "Bengaluru, Karnataka",
    glyph: MaskGlyph,
    variant: "orange",
  },
  {
    name: "Portable Ultrasound Scanner",
    priceRange: "₹4,50,000 - ₹9,00,000",
    moq: "MOQ: 1 unit",
    location: "Hyderabad, Telangana",
    glyph: UltrasoundGlyph,
    variant: "navy",
  },
  {
    name: "Orthopedic Traction Unit",
    priceRange: "₹25,000 - ₹60,000",
    moq: "MOQ: 2 units",
    location: "Kolkata, West Bengal",
    glyph: BoneGlyph,
    variant: "orange",
  },
];

export const testimonials = [
  {
    name: "Dr. Rajesh Menon",
    company: "Apex Multispecialty Hospital, Kochi",
    quote:
      "Med-Mart made procuring ICU equipment during our expansion incredibly smooth. We compared quotes from five verified suppliers in under a day.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    company: "Sharma Diagnostics Pvt. Ltd., Jaipur",
    quote:
      "The supplier verification gives us real confidence. We've sourced diagnostic imaging equipment twice now without a single quality issue.",
    rating: 5,
  },
  {
    name: "Anil Kapoor",
    company: "MedTech Distributors, Nagpur",
    quote:
      "As a seller, the quality of buyer inquiries on Med-Mart is far better than other platforms we've tried. Our closing rate has genuinely improved.",
    rating: 4,
  },
];

export const trustStats = [
  { label: "Products", value: "10,000+" },
  { label: "Verified Suppliers", value: "500+" },
  { label: "Delivery", value: "Pan-India" },
];
