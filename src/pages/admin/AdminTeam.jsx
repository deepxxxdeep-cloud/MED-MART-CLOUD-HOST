import { useState } from "react";
import { Plus, UserCog } from "lucide-react";
import { ADMIN, ADMIN_TEAM } from "../../data/adminData";
import { Panel, Table, Row, Cell, Pill, Fade } from "./_shared";

const ROLES = [
  { key: "super-admin", label: "Super Admin", note: "Full access including platform settings" },
  { key: "admin", label: "Admin", note: "Users, sellers, orders and moderation" },
  { key: "finance", label: "Finance", note: "Revenue, payouts and reporting" },
  { key: "support", label: "Support", note: "Users and chat moderation only" },
];

export default function AdminTeam() {
  const [team, setTeam] = useState(ADMIN_TEAM);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", role: "support" });

  const isSuper = ADMIN.role === "super-admin";

  const add = () => {
    if (!draft.name.trim() || !draft.email.trim()) return;
    setTeam((t) => [{ id: `t${Date.now()}`, ...draft, active: true, lastLogin: "—" }, ...t]);
    setDraft({ name: "", email: "", role: "support" });
    setAdding(false);
  };

  return (
    <Fade className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r.key} className="rounded-xl border border-navy/8 bg-white p-4 shadow-soft">
            <p className="text-[13px] font-semibold text-navy">{r.label}</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-navy/45">{r.note}</p>
            <p className="mt-2 text-[11.5px] font-semibold text-orange">
              {team.filter((t) => t.role === r.key).length} member{team.filter((t) => t.role === r.key).length === 1 ? "" : "s"}
            </p>
          </div>
        ))}
      </div>

      <Panel
        title="Admin Accounts"
        subtitle={isSuper ? "Only super admins can add or change roles" : "Read-only — super admin access required to make changes"}
        action={isSuper && (
          <button onClick={() => setAdding((a) => !a)} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-orange to-orange-dark px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow-orange">
            <Plus className="h-4 w-4" /> Invite admin
          </button>
        )}
      >
        {adding && (
          <div className="grid gap-3 border-b border-navy/8 bg-surface p-5 sm:grid-cols-4">
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Full name" className="h-11 rounded-lg border border-navy/12 px-3 text-[13.5px] outline-none focus:border-orange" />
            <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Work email" className="h-11 rounded-lg border border-navy/12 px-3 text-[13.5px] outline-none focus:border-orange" />
            <select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className="h-11 rounded-lg border border-navy/12 px-3 text-[13.5px] outline-none focus:border-orange">
              {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
            <button onClick={add} className="h-11 rounded-lg bg-navy text-[13px] font-semibold text-white">Send invite</button>
          </div>
        )}

        <Table minWidth={720} head={["Name", "Email", "Role", "Last login", "Status", { label: "Actions", right: true }]}>
          {team.map((t) => (
            <Row key={t.id}>
              <Cell bold>
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-deep text-[10px] font-bold text-white">
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  {t.name}
                </span>
              </Cell>
              <Cell muted>{t.email}</Cell>
              <Cell>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-semibold capitalize text-navy/70">
                  <UserCog className="h-3 w-3" />
                  {t.role.replace("-", " ")}
                </span>
              </Cell>
              <Cell muted>{t.lastLogin}</Cell>
              <Cell><Pill status={t.active ? "active" : "cancelled"}>{t.active ? "Active" : "Deactivated"}</Pill></Cell>
              <Cell right>
                <button
                  disabled={!isSuper}
                  onClick={() => setTeam((l) => l.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x)))}
                  className="rounded-lg border border-navy/12 px-3 py-1.5 text-[11.5px] font-semibold text-navy/65 hover:border-orange hover:text-orange disabled:opacity-40"
                >
                  {t.active ? "Deactivate" : "Reactivate"}
                </button>
              </Cell>
            </Row>
          ))}
        </Table>
      </Panel>
    </Fade>
  );
}
