import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import { CATEGORIES } from "../../data/buyerData";
import { PHOTOS, inr } from "../../data/adminData";
import { Panel, Table, Row, Cell, Pill, Fade } from "./_shared";

const QUEUE = [
  { id: "p1", name: "Portable Ultrasound Scanner Colour Doppler", seller: "Medline Imaging", category: "Diagnostic Equipment", price: 498000, photo: PHOTOS.diagnostic, submitted: "2 hours ago" },
  { id: "p2", name: "Titanium Bone Plate & Screw System", seller: "OrthoLine India", category: "Orthopedic", price: 15800, photo: PHOTOS.ortho, submitted: "5 hours ago" },
  { id: "p3", name: "Dental Chair with LED Operating Light", seller: "DentPro Systems", category: "Dental", price: 168000, photo: PHOTOS.dental, submitted: "1 day ago" },
];

export default function AdminModeration() {
  const [queue, setQueue] = useState(QUEUE);
  const [done, setDone] = useState({});

  const decide = (id, action) => {
    setDone((d) => ({ ...d, [id]: action }));
    setTimeout(() => setQueue((q) => q.filter((p) => p.id !== id)), 800);
  };

  return (
    <Fade className="space-y-4">
      <Panel title="Products Awaiting Review" subtitle={`${queue.length} listings submitted by sellers`}>
        <div className="divide-y divide-navy/5">
          {queue.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 p-4">
              <img src={p.photo} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-navy">{p.name}</p>
                <p className="mt-0.5 text-[12px] text-navy/50">{p.seller} · {p.category}</p>
                <p className="text-[11.5px] text-navy/40">Submitted {p.submitted}</p>
              </div>
              <p className="font-display text-[15px] font-semibold text-navy">{inr(p.price)}</p>
              {done[p.id] ? (
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-700">
                  <Check className="h-4 w-4" /> {done[p.id]}
                </span>
              ) : (
                <div className="flex gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy/12 text-navy/45 hover:border-orange hover:text-orange" aria-label="Preview"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => decide(p.id, "approved")} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-emerald-700">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={() => decide(p.id, "rejected")} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-[12.5px] font-semibold text-red-600 hover:bg-red-50">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          {queue.length === 0 && <p className="p-12 text-center text-[13px] text-navy/40">Review queue is clear.</p>}
        </div>
      </Panel>

      <Panel title="Categories" subtitle="Live categories and their listing counts">
        <Table minWidth={560} head={["Category", "Subcategories", "Products", "Status"]}>
          {CATEGORIES.map((c) => (
            <Row key={c.slug}>
              <Cell bold>{c.name}</Cell>
              <Cell muted>{c.columns.reduce((s, col) => s + col.items.length, 0)}</Cell>
              <Cell muted>{c.count}</Cell>
              <Cell><Pill status="active" /></Cell>
            </Row>
          ))}
        </Table>
      </Panel>
    </Fade>
  );
}
