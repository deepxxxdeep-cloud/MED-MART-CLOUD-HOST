import { PHOTOS } from "./buyerData";

const DAY = 86400000;
const ago = (d) => new Date(Date.now() - d * DAY).toISOString().slice(0, 10);

export const ADMIN = { name: "Gyan Mishra", email: "gyan@med-mart.in", role: "super-admin" };

export const COMMISSION_RATE = 0.07;

/** Platform-wide GMV vs commission. */
export const PLATFORM_SERIES = Array.from({ length: 180 }, (_, i) => {
  const d = new Date(Date.now() - (179 - i) * DAY);
  const base = 480000 + i * 3400;
  const weekly = Math.sin((i / 7) * Math.PI * 2) * 96000;
  const noise = ((i * 61) % 23) * 5200;
  const gmv = Math.max(0, Math.round(base + weekly + noise));
  return {
    date: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
    gmv,
    commission: Math.round(gmv * COMMISSION_RATE),
    orders: Math.max(1, Math.round(gmv / 42000)),
  };
});

export const ADMIN_METRICS = {
  users: { total: 8420, buyers: 7890, sellers: 530 },
  sellers: { verified: 412, pending: 27, banned: 9 },
  orders: { thisMonth: 1284, lastMonth: 1096 },
  gmv: PLATFORM_SERIES.slice(-30).reduce((s, d) => s + d.gmv, 0),
  commission: PLATFORM_SERIES.slice(-30).reduce((s, d) => s + d.commission, 0),
  pendingPayouts: { amount: 2840600, count: 46 },
  signupsToday: { buyers: 34, sellers: 6 },
  flaggedChats: 12,
  openTickets: 5,
};

const U = (id, name, email, phone, days, orders, spent, status) => ({
  id, name, email, phone, joined: ago(days), orders, spent, status,
});

export const ADMIN_USERS = [
  U("u1", "Dr. Rajesh Menon", "rajesh@apexhospital.in", "+91 98470 12345", 412, 24, 1840000, "active"),
  U("u2", "Priya Sharma", "priya@sharmadiag.in", "+91 94140 55221", 298, 18, 962000, "active"),
  U("u3", "Anil Kapoor", "anil@medtechdist.in", "+91 98220 77410", 187, 41, 3120000, "banned"),
  U("u4", "Fatima Sheikh", "fatima@crescentcare.in", "+91 90000 31245", 154, 12, 486000, "active"),
  U("u5", "Vikram Nair", "vikram@nairortho.in", "+91 99470 88123", 121, 7, 298000, "active"),
  U("u6", "Sunita Rao", "sunita@raonursing.in", "+91 98900 11223", 96, 15, 412000, "active"),
  U("u7", "Imran Qureshi", "imran@lifelinesurg.in", "+91 94150 66332", 74, 9, 231000, "banned"),
  U("u8", "Meera Iyer", "meera@iyerhealth.in", "+91 98400 22114", 51, 5, 148000, "active"),
];

const S = (id, biz, owner, cat, days, verification, products, sales, rating, status) => ({
  id, businessName: biz, owner, category: cat, joined: ago(days),
  verification, products, sales, rating, status,
});

export const ADMIN_SELLERS = [
  S("s1", "Precision Surgico", "Rahul Verma", "Surgical Instruments", 1840, "verified", 15, 8420000, 4.8, "active"),
  S("s2", "Medline Imaging Pvt. Ltd.", "Sanjay Rao", "Diagnostics", 1420, "verified", 32, 12400000, 4.7, "active"),
  S("s3", "SafeGuard Medicals", "Neha Gupta", "PPE & Disposables", 980, "verified", 48, 6240000, 4.6, "active"),
  S("s4", "Aarogya Furnitech", "Mahesh Patel", "Hospital Furniture", 760, "verified", 21, 3180000, 4.4, "active"),
  S("s5", "OrthoLine India", "Debashish Sen", "Orthopedic", 420, "pending", 12, 0, 0, "active"),
  S("s6", "DentPro Systems", "Kavita Jain", "Dental", 310, "pending", 8, 0, 0, "active"),
  S("s7", "LabTech Instruments", "Arun Kulkarni", "Lab Equipment", 640, "verified", 27, 2410000, 4.5, "active"),
  S("s8", "QuickMed Traders", "Sameer Khan", "Disposables", 88, "rejected", 3, 0, 0, "banned"),
];

export const PENDING_DOCS = {
  s5: [
    { name: "GST Certificate", status: "uploaded", file: "gst-orthoLine.pdf" },
    { name: "Business License", status: "uploaded", file: "license-orthoLine.pdf" },
    { name: "Bank Proof", status: "uploaded", file: "cancelled-cheque.jpg" },
  ],
  s6: [
    { name: "GST Certificate", status: "uploaded", file: "gst-dentpro.pdf" },
    { name: "Business License", status: "missing", file: null },
    { name: "Bank Proof", status: "uploaded", file: "bank-letter.pdf" },
  ],
};

const F = (id, buyer, seller, product, message, type, mins, count, reviewed) => ({
  id, buyer, seller, product, message, type, mins, count, reviewed,
});

export const CHAT_FLAGS = [
  F("f1", "Anil Kapoor", "Precision Surgico", "Surgical Instrument Kit", "call me on 9876543210 for a better rate", "phone", 24, 4, false),
  F("f2", "Imran Qureshi", "SafeGuard Medicals", "N95 Respirator Masks", "ping me on whatsapp, we can do a direct deal", "contact_keyword", 96, 3, false),
  F("f3", "Meera Iyer", "Medline Imaging", "Portable Ultrasound", "mail me at meera (at) gmail (dot) com", "email", 180, 2, false),
  F("f4", "Sunita Rao", "Aarogya Furnitech", "ICU Hospital Bed", "visit aarogyabeds.com for full catalogue", "link", 320, 1, true),
  F("f5", "Vikram Nair", "OrthoLine India", "Bone Plate System", "nine eight seven six five four three two one zero", "phone", 640, 3, false),
  F("f6", "Priya Sharma", "LabTech Instruments", "Autoclave 50L", "98-76*54-32-10 is my direct line", "phone", 1400, 2, true),
];

export const VIOLATION_SUMMARY = [
  { type: "phone", label: "Phone number", count: 148 },
  { type: "contact_keyword", label: "Contact keyword", count: 92 },
  { type: "email", label: "Email address", count: 61 },
  { type: "link", label: "External link", count: 38 },
];

const O = (id, buyer, seller, product, amount, days, payment, status) => {
  const commission = Math.round(amount * COMMISSION_RATE);
  return { orderId: id, buyer, seller, product, amount, commission, sellerEarning: amount - commission, date: ago(days), payment, status };
};

export const ADMIN_ORDERS = [
  O("MM-2026-004821", "Apex Multispecialty", "Precision Surgico", "Surgical Instrument Kit — 20 Pieces", 368000, 1, "completed", "processing"),
  O("MM-2026-004815", "Crescent Care", "Precision Surgico", "Absorbable Sutures — Box of 12", 84000, 3, "completed", "shipped"),
  O("MM-2026-004809", "Nair Ortho Clinic", "Medline Imaging", "Portable Ultrasound Scanner", 498000, 4, "completed", "delivered"),
  O("MM-2026-004802", "Rao Nursing Home", "SafeGuard Medicals", "N95 Masks — 200 boxes", 270000, 6, "completed", "delivered"),
  O("MM-2026-004795", "Iyer Healthcare", "Aarogya Furnitech", "ICU Electric Bed ×4", 208000, 8, "completed", "delivered"),
  O("MM-2026-004788", "Sharma Diagnostics", "Precision Surgico", "Titanium Bone Plate System", 158000, 9, "completed", "delivered"),
  O("MM-2026-004771", "MedTech Distributors", "LabTech Instruments", "Lab Centrifuge ×6", 129000, 13, "completed", "delivered"),
  O("MM-2026-004766", "Lifeline Surgicals", "Medline Imaging", "Patient Monitor ×5", 192500, 15, "failed", "cancelled"),
];

export const PENDING_PAYOUTS = [
  { sellerId: "s1", seller: "Precision Surgico", earnings: 8420000, paid: 7980000, pending: 440000, account: "4412", lastPayout: ago(4), verified: true },
  { sellerId: "s2", seller: "Medline Imaging Pvt. Ltd.", earnings: 12400000, paid: 11460000, pending: 940000, account: "8871", lastPayout: ago(6), verified: true },
  { sellerId: "s3", seller: "SafeGuard Medicals", earnings: 6240000, paid: 5620000, pending: 620000, account: "2033", lastPayout: ago(5), verified: true },
  { sellerId: "s4", seller: "Aarogya Furnitech", earnings: 3180000, paid: 2940000, pending: 240000, account: "5590", lastPayout: ago(9), verified: true },
  { sellerId: "s7", seller: "LabTech Instruments", earnings: 2410000, paid: 2180000, pending: 230000, account: null, lastPayout: ago(12), verified: false },
];

export const PAYOUT_LOG = [
  { batchId: "PO-2026-0142", seller: "Medline Imaging Pvt. Ltd.", amount: 1240000, orders: 14, date: ago(6), status: "completed", account: "8871" },
  { batchId: "PO-2026-0141", seller: "Precision Surgico", amount: 862000, orders: 9, date: ago(4), status: "completed", account: "4412" },
  { batchId: "PO-2026-0138", seller: "SafeGuard Medicals", amount: 604000, orders: 21, date: ago(5), status: "completed", account: "2033" },
  { batchId: "PO-2026-0134", seller: "Aarogya Furnitech", amount: 318000, orders: 6, date: ago(9), status: "failed", account: "5590" },
  { batchId: "PO-2026-0130", seller: "LabTech Instruments", amount: 226000, orders: 8, date: ago(12), status: "completed", account: "1147" },
];

export const ACTIVITY_FEED = [
  { id: "a1", type: "seller", text: "New seller registered — OrthoLine India", mins: 18 },
  { id: "a2", type: "order", text: "Order MM-2026-004821 completed — ₹3,68,000", mins: 42 },
  { id: "a3", type: "flag", text: "Chat flagged between Anil Kapoor & Precision Surgico", mins: 74 },
  { id: "a4", type: "payout", text: "Payout processed — ₹12,40,000 to Medline Imaging", mins: 160 },
  { id: "a5", type: "seller", text: "Seller verified — LabTech Instruments", mins: 290 },
  { id: "a6", type: "order", text: "Order MM-2026-004809 delivered — ₹4,98,000", mins: 420 },
  { id: "a7", type: "flag", text: "User banned — Imran Qureshi (repeated violations)", mins: 610 },
];

export const ADMIN_TEAM = [
  { id: "t1", name: "Gyan Mishra", email: "gyan@med-mart.in", role: "super-admin", active: true, lastLogin: ago(0) },
  { id: "t2", name: "Ritu Desai", email: "ritu@med-mart.in", role: "finance", active: true, lastLogin: ago(1) },
  { id: "t3", name: "Karan Mehta", email: "karan@med-mart.in", role: "support", active: true, lastLogin: ago(0) },
  { id: "t4", name: "Nisha Bhat", email: "nisha@med-mart.in", role: "admin", active: false, lastLogin: ago(34) },
];

export const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
export const inrShort = (n) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr`
  : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
  : n >= 1000 ? `₹${Math.round(n / 1000)}k` : `₹${n}`;
export const timeAgo = (m) => (m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`);
export { PHOTOS };
