import { useState } from "react";
import { LockIcon, PencilIcon, PinIcon, PlusIcon } from "../components/Icons";
import { type Table } from "../data/products";
import { can, uid, useData } from "../lib/store";
import { Pill } from "./AdminPanel";

const ZONES = ["Window", "Bar", "Floor", "Patio", "Lounge"];

const inputCls =
  "w-full rounded-lg border border-cream/15 bg-espresso-850 px-3.5 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-mocha/60 hover:border-cream/25 focus:border-caramel/70";

export default function TablesAdmin() {
  const { tables, reservations, upsertTable, deleteTable, currentUser } = useData();
  const canManage = can(currentUser, "tables.manage");
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(2);
  const [zone, setZone] = useState(ZONES[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const upcomingFor = (id: string) =>
    reservations.filter((r) => r.tableId === id && r.status !== "declined").length;

  const submit = () => {
    if (!name.trim()) return setError("Give the table a name, e.g. W3.");
    const t: Table = {
      id: editingId ?? uid(),
      name: name.trim().toUpperCase(),
      seats: Math.min(12, Math.max(1, seats)),
      zone,
      status: editingId ? tables.find((x) => x.id === editingId)?.status ?? "available" : "available",
    };
    upsertTable(t);
    reset();
  };

  const reset = () => {
    setName("");
    setSeats(2);
    setZone(ZONES[0]);
    setEditingId(null);
    setError("");
  };

  const startEdit = (t: Table) => {
    setEditingId(t.id);
    setName(t.name);
    setSeats(t.seats);
    setZone(t.zone);
    setError("");
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-medium">Tables</h2>
      <p className="mt-1 text-sm text-mocha">
        The floor plan guests book against. Add a table here and it appears in the reservation picker immediately.
      </p>

      {!canManage && (
        <p className="mt-5 flex items-center gap-2.5 rounded-lg border border-cream/12 bg-espresso-900 px-4 py-3 text-[13px] font-semibold text-latte">
          <span className="text-caramel"><LockIcon /></span>
          Read-only — the Staff role can view the floor plan but not change it.
        </p>
      )}

      {/* add / edit form */}
      {canManage && (
      <div className="mt-6 rounded-xl border border-cream/10 bg-espresso-900 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-caramel">
          {editingId ? "Edit table" : "Add a table"}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_0.8fr_1fr_auto]">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Table name · e.g. W3" />
          <input
            className={inputCls}
            type="number"
            min={1}
            max={12}
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
            aria-label="Seats"
          />
          <select className={`${inputCls} cursor-pointer`} value={zone} onChange={(e) => setZone(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={submit}
              className="flex items-center gap-2 rounded-lg bg-caramel px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-espresso-950 transition-colors hover:bg-honey"
            >
              {editingId ? <PencilIcon /> : <PlusIcon />}
              {editingId ? "Save" : "Add table"}
            </button>
            {editingId && (
              <button onClick={reset} className="rounded-lg border border-cream/15 px-4 py-2.5 text-xs font-bold text-latte hover:text-cream">
                Cancel
              </button>
            )}
          </div>
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-[#e58a63]">{error}</p>}
      </div>
      )}

      {/* floor plan */}
      {tables.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-cream/15 py-16 text-center">
          <PinIcon className="text-4xl text-espresso-700" />
          <p className="mt-4 font-display text-xl text-cream">No tables on the floor</p>
          <p className="mt-1 text-sm text-mocha">Guests can't reserve until you add at least one.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tables.map((t) => {
            const maintenance = t.status === "maintenance";
            const booked = upcomingFor(t.id);
            return (
              <div
                key={t.id}
                className={`rounded-xl border p-5 transition-colors ${
                  maintenance ? "border-cream/8 bg-espresso-900/60 opacity-70" : "border-cream/10 bg-espresso-900 hover:border-caramel/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-2xl text-cream">Table {t.name}</p>
                    <p className="mt-0.5 text-[12px] text-mocha">
                      {t.zone} · seats {t.seats} · {booked} upcoming booking{booked === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Pill tone={maintenance ? "mocha" : "sage"}>{maintenance ? "Maintenance" : "Open"}</Pill>
                </div>

                {canManage && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => upsertTable({ ...t, status: maintenance ? "available" : "maintenance" })}
                    className={`rounded-lg border px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors ${
                      maintenance
                        ? "border-sage/50 text-sage hover:bg-sage/10"
                        : "border-cream/15 text-mocha hover:border-honey/50 hover:text-honey"
                    }`}
                  >
                    {maintenance ? "Reopen" : "Close for maintenance"}
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="grid h-[34px] w-9 place-items-center rounded-lg border border-cream/15 text-latte transition-colors hover:border-caramel/60 hover:text-honey"
                    aria-label={`Edit table ${t.name}`}
                  >
                    <PencilIcon />
                  </button>
                  {confirmDelete === t.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          deleteTable(t.id);
                          setConfirmDelete(null);
                        }}
                        className="rounded-lg bg-clay px-3 py-2 text-[11px] font-extrabold uppercase text-cream hover:bg-[#a84425]"
                      >
                        Sure?
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-cream/15 px-2.5 py-2 text-[11px] font-bold text-latte hover:text-cream">
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(t.id)}
                      className="rounded-lg border border-cream/15 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-mocha transition-colors hover:border-clay/60 hover:text-[#e58a63]"
                    >
                      Remove
                    </button>
                  )}
                </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
