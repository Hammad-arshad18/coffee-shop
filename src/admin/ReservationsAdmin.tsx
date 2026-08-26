import { useState } from "react";
import { CheckIcon, ClockIcon, CloseIcon } from "../components/Icons";
import { type ReservationStatus } from "../data/products";
import { fmtDate, useData } from "../lib/store";
import { Pill, reservationTone } from "./AdminPanel";

const FILTERS: ("all" | ReservationStatus)[] = ["all", "pending", "confirmed", "declined"];

export default function ReservationsAdmin() {
  const { reservations, setReservationStatus } = useData();
  const [filter, setFilter] = useState<"all" | ReservationStatus>("all");

  const sorted = [...reservations].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const visible = sorted.filter((r) => filter === "all" || r.status === filter);
  const countOf = (f: "all" | ReservationStatus) =>
    f === "all" ? reservations.length : reservations.filter((r) => r.status === f).length;

  return (
    <div>
      <h2 className="font-display text-3xl font-medium">Reservations</h2>
      <p className="mt-1 text-sm text-mocha">
        Guests book from the storefront; a reservation goes live on the book once you confirm it.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold capitalize transition-all ${
              filter === f
                ? "border-caramel bg-caramel text-espresso-950"
                : "border-cream/15 text-latte hover:border-caramel/50 hover:text-honey"
            }`}
          >
            {f}
            <span className={`tnum ${filter === f ? "text-espresso-950/70" : "text-mocha"}`}>{countOf(f)}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-cream/15 py-16 text-center">
          <ClockIcon className="text-4xl text-espresso-700" />
          <p className="mt-4 font-display text-xl text-cream">The book is quiet</p>
          <p className="mt-1 text-sm text-mocha">
            {filter === "pending"
              ? "Nothing waiting on you — nice work."
              : "No reservations in this view yet."}
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {visible.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-cream/10 bg-espresso-900 px-4 py-4 transition-colors hover:border-cream/20 sm:flex-nowrap"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-caramel/30 bg-caramel/10">
                <span className="tnum font-display text-lg text-honey">{r.party}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-cream">{r.name}</p>
                  <span className="tnum rounded-full border border-cream/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-mocha">
                    {r.code}
                  </span>
                  <Pill tone={reservationTone[r.status]}>{r.status}</Pill>
                </div>
                <p className="mt-0.5 text-[12.5px] text-mocha">
                  Table {r.tableName} ({r.seats} seats) · {fmtDate(r.date)} at {r.time} · {r.email}
                  {r.notes ? ` · “${r.notes}”` : ""}
                </p>
              </div>
              {r.status === "pending" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setReservationStatus(r.id, "confirmed")}
                    className="flex items-center gap-1.5 rounded-lg bg-sage px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-espresso-950 transition-all hover:-translate-y-0.5 hover:brightness-110"
                  >
                    <CheckIcon /> Confirm
                  </button>
                  <button
                    onClick={() => setReservationStatus(r.id, "declined")}
                    className="flex items-center gap-1.5 rounded-lg border border-cream/15 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-mocha transition-colors hover:border-clay/60 hover:text-[#e58a63]"
                  >
                    <CloseIcon className="text-xs" /> Decline
                  </button>
                </div>
              )}
              {r.status === "confirmed" && (
                <button
                  onClick={() => setReservationStatus(r.id, "pending")}
                  className="shrink-0 rounded-lg border border-cream/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-mocha transition-colors hover:text-cream"
                >
                  Reopen
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
