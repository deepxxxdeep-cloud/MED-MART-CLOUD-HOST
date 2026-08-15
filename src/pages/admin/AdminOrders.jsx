import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { ADMIN_ORDERS, inr } from "../../data/adminData";
import { Panel, Table, Row, Cell, Pill, Search, Select, Fade } from "./_shared";

export default function AdminOrders() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ADMIN_ORDERS.filter(
      (o) =>
        (status === "all" || o.status === status) &&
        (!s || o.orderId.toLowerCase().includes(s) || o.buyer.toLowerCase().includes(s) || o.seller.toLowerCase().includes(s))
    );
  }, [q, status]);

  const exportCsv = () => {
    const head = ["Order ID", "Date", "Buyer", "Seller", "Product", "Amount", "Commission", "Seller earning", "Payment", "Status"];
    const body = rows.map((o) => [o.orderId, o.date, o.buyer, o.seller, o.product, o.amount, o.commission, o.sellerEarning, o.payment, o.status]);
    const csv = [head, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `medmart-orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const totals = rows.reduce((s, o) => ({ gmv: s.gmv + o.amount, com: s.com + o.commission }), { gmv: 0, com: 0 });

  return (
    <Fade className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[["Orders shown", rows.length], ["GMV", inr(totals.gmv)], ["Commission", inr(totals.com)]].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-navy/8 bg-white p-4 shadow-soft">
            <p className="text-[11.5px] font-medium text-navy/45">{k}</p>
            <p className="mt-1.5 font-display text-lg font-semibold text-navy">{v}</p>
          </div>
        ))}
      </div>

      <Panel
        title="All Orders"
        subtitle={`${rows.length} of ${ADMIN_ORDERS.length}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Search value={q} onChange={setQ} placeholder="Order ID, buyer or seller…" />
            <Select value={status} onChange={setStatus} options={[
              { value: "all", label: "All statuses" }, "processing", "shipped", "delivered", "cancelled",
            ]} />
            <button onClick={exportCsv} className="flex items-center gap-1.5 rounded-lg border border-navy/12 px-3.5 py-2.5 text-[13px] font-semibold text-navy/65 hover:border-orange hover:text-orange">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        }
      >
        <Table minWidth={1050} head={["Order ID", "Date", "Buyer", "Seller", "Product", { label: "Amount", right: true }, { label: "Commission", right: true }, { label: "Seller earning", right: true }, "Payment", "Status"]}>
          {rows.map((o) => (
            <Row key={o.orderId}>
              <Cell bold>{o.orderId}</Cell>
              <Cell muted>{o.date}</Cell>
              <Cell>{o.buyer}</Cell>
              <Cell>{o.seller}</Cell>
              <Cell muted className="max-w-[200px] truncate">{o.product}</Cell>
              <Cell right bold>{inr(o.amount)}</Cell>
              <Cell right className="text-orange">{inr(o.commission)}</Cell>
              <Cell right muted>{inr(o.sellerEarning)}</Cell>
              <Cell><Pill status={o.payment === "completed" ? "completed" : "failed"} /></Cell>
              <Cell><Pill status={o.status} /></Cell>
            </Row>
          ))}
        </Table>
      </Panel>
    </Fade>
  );
}
