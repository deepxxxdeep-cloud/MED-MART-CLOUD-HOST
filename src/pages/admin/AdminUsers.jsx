import { useMemo, useState } from "react";
import { Ban, ShieldCheck, MoreHorizontal, Eye } from "lucide-react";
import { ADMIN_USERS, inr } from "../../data/adminData";
import { Panel, Table, Row, Cell, Pill, Search, Select, Fade } from "./_shared";

export default function AdminUsers() {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(null);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter(
      (u) =>
        (status === "all" || u.status === status) &&
        (!s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.phone.includes(s))
    );
  }, [users, q, status]);

  const toggleBan = (id) =>
    setUsers((l) => l.map((u) => (u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u)));

  return (
    <Fade className="space-y-4">
      <Panel
        title="Buyers"
        subtitle={`${rows.length} of ${users.length}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Search value={q} onChange={setQ} placeholder="Search name, email or phone…" />
            <Select value={status} onChange={setStatus} options={[
              { value: "all", label: "All statuses" }, { value: "active", label: "Active" }, { value: "banned", label: "Banned" },
            ]} />
          </div>
        }
      >
        <Table head={["Name", "Contact", "Joined", "Orders", { label: "Total spent", right: true }, "Status", { label: "Actions", right: true }]}>
          {rows.map((u) => (
            <Row key={u.id}>
              <Cell bold>{u.name}</Cell>
              <Cell muted>
                <div>{u.email}</div>
                <div className="text-[11.5px] text-navy/40">{u.phone}</div>
              </Cell>
              <Cell muted>{u.joined}</Cell>
              <Cell>{u.orders}</Cell>
              <Cell right bold>{inr(u.spent)}</Cell>
              <Cell><Pill status={u.status} /></Cell>
              <Cell right>
                <div className="flex justify-end gap-1.5">
                  <button onClick={() => setOpen(open === u.id ? null : u.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy/45 hover:bg-orange-light hover:text-orange" aria-label="View">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => toggleBan(u.id)} className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-semibold ${u.status === "banned" ? "text-emerald-700 hover:bg-emerald-50" : "text-red-600 hover:bg-red-50"}`}>
                    {u.status === "banned" ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                    {u.status === "banned" ? "Unban" : "Ban"}
                  </button>
                </div>
              </Cell>
            </Row>
          ))}
        </Table>
      </Panel>

      {open && (
        <Panel title={users.find((u) => u.id === open)?.name} subtitle="Account detail">
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            {[
              ["Total orders", users.find((u) => u.id === open)?.orders],
              ["Lifetime spend", inr(users.find((u) => u.id === open)?.spent || 0)],
              ["Member since", users.find((u) => u.id === open)?.joined],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-navy/8 bg-surface p-4">
                <p className="text-[11.5px] text-navy/45">{k}</p>
                <p className="mt-1 font-display text-lg font-semibold text-navy">{v}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </Fade>
  );
}
