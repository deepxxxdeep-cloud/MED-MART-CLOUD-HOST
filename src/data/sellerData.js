import { PHOTOS } from "./buyerData";

export const SELLER = {
  businessName: "Precision Surgico",
  ownerName: "Rahul",
  city: "Delhi NCR",
  verified: true,
  memberSince: 2011,
  profileCompletion: 85,
  plan: "Growth",
};

const SP = (id, name, category, photo, price, mrp, status, views, inquiries, stock) => ({
  id,
  name,
  category,
  photo,
  price,
  mrp,
  status, // active | draft | out-of-stock
  views,
  inquiries,
  stock,
});

/** The seller's own listings. */
export const SELLER_PRODUCTS = [
  SP(101, "Surgical Instrument Kit — 20 Pieces", "Surgical Instruments", PHOTOS.surgical, 9200, 14500, "active", 4820, 96, 340),
  SP(102, "Stainless Steel Surgical Scissors Set", "Surgical Instruments", PHOTOS.surgical, 3400, 5200, "active", 3915, 74, 1200),
  SP(103, "Scalpel Blades #10 — Box of 100", "Surgical Instruments", PHOTOS.surgical, 780, 1150, "active", 3204, 61, 5400),
  SP(104, "Titanium Bone Plate & Screw System", "Orthopedic", PHOTOS.ortho, 15800, 21000, "active", 2870, 52, 120),
  SP(105, "Retractor Set Self-Retaining", "Surgical Instruments", PHOTOS.surgical, 6400, 9000, "active", 2611, 44, 85),
  SP(106, "Absorbable Surgical Sutures — Box of 12", "Disposables", PHOTOS.surgical, 4200, 5900, "active", 2210, 38, 640),
  SP(107, "Needle Holder Mayo-Hegar 18cm", "Surgical Instruments", PHOTOS.surgical, 1450, 2100, "active", 1980, 31, 430),
  SP(108, "Laparoscopic Instrument Trolley", "Hospital Furniture", PHOTOS.furniture, 34500, 46000, "out-of-stock", 1654, 27, 0),
  SP(109, "Bone Cutter Double Action 23cm", "Orthopedic", PHOTOS.ortho, 5200, 7400, "active", 1420, 22, 60),
  SP(110, "Sterilisation Tray Perforated SS", "Lab Equipment", PHOTOS.lab, 2650, 3800, "draft", 0, 0, 210),
  SP(111, "Micro Surgery Forceps Titanium", "Surgical Instruments", PHOTOS.surgical, 8900, 12000, "draft", 0, 0, 45),
  SP(112, "Orthopedic Drill Machine Cordless", "Orthopedic", PHOTOS.ortho, 62000, 78000, "active", 1180, 19, 12),
  SP(113, "Surgical Suction Unit 2L", "Diagnostic Equipment", PHOTOS.diagnostic, 18500, 24000, "active", 990, 15, 34),
  SP(114, "Disposable Scalpel Sterile — Box of 50", "Disposables", PHOTOS.surgical, 1180, 1700, "active", 870, 12, 2100),
  SP(115, "Instrument Sterilisation Pouches", "Disposables", PHOTOS.lab, 640, 950, "out-of-stock", 720, 9, 0),
];

/** Inquiries over the last 90 days — the charts slice this. */
export const INQUIRY_SERIES = Array.from({ length: 90 }, (_, i) => {
  const day = 89 - i;
  const date = new Date();
  date.setDate(date.getDate() - day);
  // gentle upward trend with a weekly rhythm and a little noise
  const base = 6 + i * 0.09;
  const weekly = Math.sin((i / 7) * Math.PI * 2) * 2.2;
  const noise = ((i * 37) % 11) / 3.5;
  return {
    date: date.toISOString().slice(0, 10),
    label: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    inquiries: Math.max(1, Math.round(base + weekly + noise)),
    views: Math.round((base + weekly + noise) * 11 + 40),
  };
});

export const CATEGORY_SPLIT = [
  { name: "Surgical Instruments", value: 46 },
  { name: "Orthopedic", value: 23 },
  { name: "Disposables", value: 18 },
  { name: "Hospital Furniture", value: 8 },
  { name: "Others", value: 5 },
];

export const GEO_SPLIT = [
  { state: "Maharashtra", inquiries: 84 },
  { state: "Delhi NCR", inquiries: 71 },
  { state: "Tamil Nadu", inquiries: 58 },
  { state: "Karnataka", inquiries: 47 },
  { state: "Gujarat", inquiries: 39 },
  { state: "West Bengal", inquiries: 28 },
  { state: "Telangana", inquiries: 24 },
];

export const FUNNEL = [
  { stage: "Profile views", value: 12480 },
  { stage: "Product views", value: 5310 },
  { stage: "Inquiries", value: 486 },
  { stage: "Quotes sent", value: 312 },
  { stage: "Deals closed", value: 97 },
];

const INQ = (id, buyer, company, city, productId, product, message, minutesAgo, status) => ({
  id,
  buyer,
  company,
  city,
  productId,
  product,
  message,
  minutesAgo,
  status, // unread | responded | archived
});

export const INQUIRIES = [
  INQ("i1", "Dr. Rajesh Menon", "Apex Multispecialty Hospital", "Kochi, KL", 101, "Surgical Instrument Kit — 20 Pieces", "We're setting up two new operation theatres and need 40 kits. Could you share bulk pricing and the delivery timeline to Kochi?", 12, "unread"),
  INQ("i2", "Priya Sharma", "Sharma Diagnostics Pvt. Ltd.", "Jaipur, RJ", 104, "Titanium Bone Plate & Screw System", "Do these carry CE marking? We need documentation for our tender submission by next Friday.", 47, "unread"),
  INQ("i3", "Anil Kapoor", "MedTech Distributors", "Nagpur, MH", 102, "Stainless Steel Surgical Scissors Set", "Interested in becoming a regional distributor. What are your margins on orders above 500 sets?", 145, "unread"),
  INQ("i4", "Fatima Sheikh", "Crescent Care Hospital", "Hyderabad, TG", 106, "Absorbable Surgical Sutures — Box of 12", "Please quote for 200 boxes, monthly recurring. Also need the shelf life and storage conditions.", 320, "responded"),
  INQ("i5", "Vikram Nair", "Nair Ortho Clinic", "Kozhikode, KL", 112, "Orthopedic Drill Machine Cordless", "Is a demo available before purchase? We're comparing against two other brands.", 640, "responded"),
  INQ("i6", "Sunita Rao", "Rao Nursing Home", "Pune, MH", 103, "Scalpel Blades #10 — Box of 100", "Need 30 boxes urgently. Can you dispatch today if I confirm within the hour?", 1180, "responded"),
  INQ("i7", "Imran Qureshi", "Lifeline Surgicals", "Lucknow, UP", 105, "Retractor Set Self-Retaining", "Share the full catalogue with GST-inclusive rates please.", 2600, "archived"),
  INQ("i8", "Meera Iyer", "Iyer Healthcare LLP", "Chennai, TN", 107, "Needle Holder Mayo-Hegar 18cm", "What is the warranty period and do you handle servicing?", 4100, "archived"),
];

const RFQ = (id, title, category, quantity, unit, city, hoursAgo, budget) => ({
  id,
  title,
  category,
  quantity,
  unit,
  city,
  hoursAgo,
  budget,
});

/** Buyer-posted requirements matching this seller's categories. */
export const BUY_REQUIREMENTS = [
  RFQ("r1", "Surgical instrument sets for new OT block", "Surgical Instruments", 60, "sets", "Mumbai, MH", 2, "₹6,00,000 – ₹9,00,000"),
  RFQ("r2", "Titanium orthopedic implants — annual contract", "Orthopedic", 500, "pieces", "Delhi NCR", 5, "₹70,00,000+"),
  RFQ("r3", "Absorbable sutures monthly supply", "Disposables", 400, "boxes", "Bengaluru, KA", 9, "₹15,00,000 – ₹20,00,000"),
  RFQ("r4", "Laparoscopic trolleys for day-care centre", "Hospital Furniture", 12, "units", "Ahmedabad, GJ", 18, "₹4,00,000 – ₹5,50,000"),
  RFQ("r5", "Scalpel blades bulk procurement", "Disposables", 2000, "boxes", "Chennai, TN", 27, "₹14,00,000 – ₹18,00,000"),
  RFQ("r6", "Bone cutters and rongeurs assorted", "Orthopedic", 80, "pieces", "Kolkata, WB", 41, "₹3,50,000 – ₹5,00,000"),
];

export const METRICS = [
  { key: "products", label: "Products Listed", value: 15, trend: 12.5, suffix: "" },
  { key: "inquiries", label: "Inquiries This Month", value: 486, trend: 23.8, suffix: "" },
  { key: "views", label: "Profile Views", value: 12480, trend: 8.2, suffix: "" },
  { key: "response", label: "Response Rate", value: 94, trend: -2.1, suffix: "%" },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "3 new buyer inquiries need a response", minutesAgo: 12 },
  { id: "n2", text: "Your GST certificate was verified", minutesAgo: 180 },
  { id: "n3", text: "2 buy requirements match your categories", minutesAgo: 420 },
];

export const unreadInquiries = () => INQUIRIES.filter((i) => i.status === "unread").length;

export const timeAgo = (minutes) => {
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.round(minutes / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};
