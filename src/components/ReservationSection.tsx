import { useMemo, useState } from "react";
import { ArrowIcon, BeanIcon, CheckIcon, ClockIcon, PinIcon } from "./Icons";
import { fmtDate, todayISO, useData } from "../lib/store";
import { Reveal } from "./Reveal";

const SLOTS = Array.from({ length: 20 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  return `${`${h}`.padStart(2, "0")}:${i % 2 ? "30" : "00"}`;
});

const inputCls =
  "w-full rounded-lg border border-cream/15 bg-espresso-850 px-3.5 py-3 text-sm text-cream outline-none transition-colors placeholder:text-mocha/60 hover:border-cream/25 focus:border-caramel/70";

export default function ReservationSection() {
  const { tables, reservations, addReservation } = useData();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [party, setParty] = useState(2);
  const [tableId, setTableId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ code: string; name: string; table: string } | null>(null);

  const [lookupCode, setLookupCode] = useState("");
  const [lookup, setLookup] = useState<null | { found: boolean; status?: string; date?: string; time?: string; table?: string }>(null);

  const min = todayISO();
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
  }, []);

  const openTables = tables.filter((t) => t.status === "available");

  const freeTables = useMemo(() => {
    if (!date || !time) return [];
    return openTables.filter(
      (t) =>
        t.seats >= party &&
        !reservations.some(
          (r) => r.tableId === t.id && r.date === date && r.time === time && r.status !== "declined"
        )
    );
  }, [openTables, reservations, date, time, party]);

  const pickReady = date && time && tableId;

  const submit = () => {
    if (!date) return setError("Pick a day.");
    if (!time) return setError("Pick a time.");
    if (!tableId) return setError("Choose one of the free tables below.");
    if (name.trim().length < 2) return setError("Who's the table for?");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Add a valid email so we can confirm.");
    const table = openTables.find((t) => t.id === tableId);
    const r = addReservation({
      name: name.trim(),
      email: email.trim(),
      tableId,
      date,
      time,
      party,
      notes: notes.trim() || undefined,
    });
    setDone({ code: r.code, name: r.name, table: table?.name ?? "—" });
    setError("");
  };

  const runLookup = () => {
    const code = lookupCode.trim().toUpperCase();
    if (!code) return;
    const r = reservations.find((x) => x.code.toUpperCase() === code);
    setLookup(r ? { found: true, status: r.status, date: r.date, time: r.time, table: r.tableName } : { found: false });
  };

  return (
    <section id="reserve" className="relative scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* pitch + lookup */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-caramel">
                <span className="h-px w-8 bg-caramel/60" />
                The cupping bar
              </p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-[3.2rem]">
                Pull up a chair
                <br />
                <em className="font-light italic text-honey">by the roaster.</em>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-latte">
                Twelve seats face the drum, the rest of the room smells like first crack. Reserve a
                table for brews, tasting flights, or a slow afternoon — Etta confirms every booking
                personally, usually within the hour.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: <PinIcon />, text: "Window, bar, floor and patio tables — pick what fits your party." },
                  { icon: <ClockIcon />, text: "Slots every 30 minutes, 08:00 to 17:30, up to 30 days out." },
                  { icon: <BeanIcon />, text: "Reservations include a complimentary tasting flight of the week's roasts." },
                ].map((x, i) => (
                  <li key={i} className="flex items-start gap-3.5 text-sm leading-relaxed text-latte">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-cream/12 bg-espresso-900 text-base text-caramel">
                      {x.icon}
                    </span>
                    {x.text}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-10 rounded-xl border border-cream/10 bg-espresso-900/70 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-mocha">Already booked? Check your status</p>
                <div className="mt-3 flex gap-2">
                  <input
                    className={inputCls}
                    value={lookupCode}
                    onChange={(e) => {
                      setLookupCode(e.target.value);
                      setLookup(null);
                    }}
                    placeholder="Booking code · e.g. TBL-8FK2"
                  />
                  <button
                    onClick={runLookup}
                    aria-label="Look up reservation"
                    className="grid w-12 shrink-0 place-items-center rounded-lg bg-caramel text-espresso-950 transition-colors hover:bg-honey"
                  >
                    <ArrowIcon />
                  </button>
                </div>
                {lookup && !lookup.found && (
                  <p className="mt-3 text-sm font-semibold text-[#e58a63]">No booking with that code — double-check the email we sent.</p>
                )}
                {lookup?.found && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-cream/10 bg-espresso-850 px-4 py-3">
                    <p className="text-sm text-latte">
                      Table {lookup.table} · {fmtDate(lookup.date!)} at {lookup.time}
                    </p>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                        lookup.status === "confirmed"
                          ? "border-sage/50 bg-sage/10 text-sage"
                          : lookup.status === "pending"
                            ? "border-honey/50 bg-honey/10 text-honey"
                            : "border-cream/15 bg-cream/5 text-mocha"
                      }`}
                    >
                      {lookup.status}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* booking panel */}
          <Reveal delay={100}>
            {done ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-sage/30 bg-espresso-900/80 p-10 text-center">
                <div className="animate-stamp grid h-20 w-20 place-items-center rounded-full border-[3px] border-sage text-sage">
                  <CheckIcon className="text-3xl" strokeWidth={2.2} />
                </div>
                <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.3em] text-caramel">Request received</p>
                <h3 className="mt-3 font-display text-3xl font-medium">
                  Table {done.table} is on the book, <em className="font-light italic text-honey">{done.name}.</em>
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-latte">
                  Your booking code is{" "}
                  <span className="tnum rounded-md border border-caramel/40 bg-caramel/10 px-2 py-0.5 font-extrabold text-honey">
                    {done.code}
                  </span>
                  . Etta will confirm shortly — watch your inbox. You can check the status anytime
                  with the code on the left.
                </p>
                <button
                  onClick={() => {
                    setDone(null);
                    setTableId("");
                    setNotes("");
                  }}
                  className="mt-8 rounded-full border border-cream/20 px-7 py-3 text-sm font-bold text-latte transition-colors hover:border-caramel/60 hover:text-honey"
                >
                  Book another table
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-cream/12 bg-espresso-900/80 p-6 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] md:p-8">
                <h3 className="font-display text-2xl">Reserve a table</h3>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <label className="block sm:col-span-1">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Date</span>
                    <input
                      type="date"
                      min={min}
                      max={maxDate}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setTableId("");
                      }}
                      className={`${inputCls} [color-scheme:dark]`}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Time</span>
                    <select className={`${inputCls} cursor-pointer`} value={time} onChange={(e) => { setTime(e.target.value); setTableId(""); }}>
                      <option value="">Choose…</option>
                      {SLOTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Party</span>
                    <select className={`${inputCls} cursor-pointer`} value={party} onChange={(e) => { setParty(Number(e.target.value)); setTableId(""); }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">
                    Free tables {date && time ? `· ${fmtDate(date)} at ${time}` : "· pick a date & time first"}
                  </span>
                  {openTables.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-cream/15 px-4 py-5 text-center text-sm text-mocha">
                      The floor is closed right now — try the cupping bar walk-in seats.
                    </p>
                  ) : !date || !time ? (
                    <div className="flex flex-wrap gap-2">
                      {openTables.map((t) => (
                        <span key={t.id} className="rounded-lg border border-cream/10 bg-espresso-850 px-3.5 py-2.5 text-xs font-bold text-mocha">
                          {t.name} · {t.zone} · {t.seats} seats
                        </span>
                      ))}
                    </div>
                  ) : freeTables.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-cream/15 px-4 py-5 text-center text-sm text-mocha">
                      Nothing fits {party} guest{party > 1 ? "s" : ""} at that slot — try another time.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {freeTables.map((t) => {
                        const active = tableId === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setTableId(t.id)}
                            aria-pressed={active}
                            className={`rounded-lg border px-4 py-2.5 text-left text-xs font-bold transition-all duration-200 ${
                              active
                                ? "border-caramel bg-caramel text-espresso-950 shadow-[0_10px_24px_-12px_rgba(217,154,78,0.7)]"
                                : "border-cream/15 bg-espresso-850 text-latte hover:border-caramel/60 hover:text-honey"
                            }`}
                          >
                            <span className="block text-sm">Table {t.name}</span>
                            <span className={`mt-0.5 block text-[10.5px] font-semibold uppercase tracking-[0.1em] ${active ? "text-espresso-950/70" : "text-mocha"}`}>
                              {t.zone} · {t.seats} seats
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Name</span>
                    <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="June Kettle" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Email</span>
                    <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="june@kettle.coffee" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Notes · optional</span>
                    <input className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Birthday, window seat, oat milk…" />
                  </label>
                </div>

                {error && (
                  <p className="mt-4 rounded-lg border border-clay/50 bg-clay/10 px-4 py-2.5 text-sm font-semibold text-[#e58a63]">{error}</p>
                )}

                <button
                  onClick={submit}
                  disabled={!pickReady}
                  className={`group mt-6 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-sm font-extrabold uppercase tracking-[0.14em] transition-all duration-300 ${
                    pickReady
                      ? "bg-caramel text-espresso-950 hover:-translate-y-0.5 hover:bg-honey hover:shadow-[0_16px_36px_-14px_rgba(217,154,78,0.65)]"
                      : "cursor-not-allowed bg-cream/10 text-mocha"
                  }`}
                >
                  Request reservation
                  <ArrowIcon className={`transition-transform duration-300 ${pickReady ? "group-hover:translate-x-1" : ""}`} />
                </button>
                <p className="mt-3 text-center text-[11.5px] text-mocha">
                  Requests are confirmed from the roastery — you'll see the status flip to “confirmed” here.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
