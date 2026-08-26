import { useState, type ReactNode } from "react";
import { BeanIcon, CartIcon, ClockIcon, FlameIcon, LogoMark, PinIcon } from "../components/Icons";
import { fmt, type OrderStatus, type ReservationStatus } from "../data/products";
import { fmtDate, fmtDateTime, todayISO, useData } from "../lib/store";
import MenuAdmin from "./MenuAdmin";
import OrdersAdmin from "./OrdersAdmin";
import ReservationsAdmin from "./ReservationsAdmin";
import TablesAdmin from "./TablesAdmin";

type Tab = "overview" | "orders" | "menu" | "tables" | "reservations";

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <FlameIcon /> },
  { id: "orders", label: "Orders", icon: <CartIcon /> },
  { id: "menu", label: "Menu", icon: <BeanIcon /> },
  { id: "tables", label: "Tables", icon: <PinIcon /> },
  { id: "reservations", label: "Reservations", icon: <ClockIcon /> },
];

export function Pill({
  tone = "mocha",
  children,
}: {
  tone?: "amber" | "clay" | "sage" | "mocha" | "caramel";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    amber: "border-honey/50 bg-honey/10 text-honey",
    clay: "border-clay/60 bg-clay/10 text-[#e58a63]",
    sage: "border-sage/50 bg-sage/10 text-sage",
    mocha: "border-cream/15 bg-cream/5 text-mocha",
    caramel: "border-caramel/50 bg-caramel/10 text-caramel",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export const orderTone: Record<OrderStatus, "amber" | "clay" | "caramel" | "sage" | "mocha"> = {
  pending: "amber",
  roasting: "clay",
  shipped: "caramel",
  delivered: "sage",
  cancelled: "mocha",
};

export const reservationTone: Record<ReservationStatus, "amber" | "sage" | "mocha"> = {
  pending: "amber",
  confirmed: "sage",
  declined: "mocha",
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-cream/10 bg-espresso-900 p-5 transition-colors hover:border-caramel/40">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-mocha">{label}</p>
      <p className="tnum mt-2 font-display text-3xl text-honey">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-mocha">{hint}</p>}
    </div>
  );
}

function Overview() {
  const { orders, reservations, tables, products } = useData();
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((n, o) => n + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const today = todayISO();
  const todayRes = reservations.filter((r) => r.date === today && r.status !== "declined");
  const openTables = tables.filter((t) => t.status === "available").length;
  const upcoming = [...reservations]
    .filter((r) => r.status !== "declined" && r.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Revenue" value={fmt(revenue)} hint={`${live.length} orders placed`} />
        <Stat label="Orders to roast" value={`${pending}`} hint="waiting on the drum" />
        <Stat label="Today's tables" value={`${todayRes.length}`} hint="reservations booked" />
        <Stat label="Tables open" value={`${openTables}/${tables.length}`} hint={`${products.length} roasts on menu`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-cream/10 bg-espresso-900 p-5">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.26em] text-caramel">Recent orders</h3>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-mocha">No orders yet — they'll land here the moment checkout completes.</p>
          ) : (
            <ul className="mt-4 divide-y divide-cream/8">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="tnum text-sm font-bold text-cream">{o.number}</p>
                    <p className="truncate text-[11.5px] text-mocha">
                      {o.customer.name} · {o.items.reduce((n, i) => n + i.qty, 0)} bags · {fmtDateTime(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="tnum text-sm font-bold text-latte">{fmt(o.total)}</span>
                    <Pill tone={orderTone[o.status]}>{o.status}</Pill>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-cream/10 bg-espresso-900 p-5">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.26em] text-caramel">Upcoming reservations</h3>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-mocha">Nothing on the book. Walk-ins only for now.</p>
          ) : (
            <ul className="mt-4 divide-y divide-cream/8">
              {upcoming.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-cream">
                      Table {r.tableName} · {r.name}
                    </p>
                    <p className="text-[11.5px] text-mocha">
                      {fmtDate(r.date)} at {r.time} · party of {r.party}
                    </p>
                  </div>
                  <Pill tone={reservationTone[r.status]}>{r.status}</Pill>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("overview");
  const { orders, reservations } = useData();
  const pendingBadges: Partial<Record<Tab, number>> = {
    orders: orders.filter((o) => o.status === "pending").length,
    reservations: reservations.filter((r) => r.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-espresso-950 text-cream">
      <header className="sticky top-0 z-30 border-b border-cream/10 bg-espresso-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-3">
            <LogoMark className="text-caramel text-[26px]" />
            <div className="leading-none">
              <p className="font-display text-lg font-semibold tracking-tight">
                Cinder <span className="font-light italic text-honey">· Back of House</span>
              </p>
              <p className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.38em] text-mocha">
                Roastery console
              </p>
            </div>
          </div>
          <a
            href="#/"
            className="link-ember text-[11px] font-bold uppercase tracking-[0.22em] text-latte transition-colors hover:text-honey"
          >
            ← View storefront
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col md:flex-row">
        {/* nav */}
        <nav className="warm-scroll flex gap-1.5 overflow-x-auto border-b border-cream/10 p-3 md:w-56 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:p-4">
          {TABS.map((t) => {
            const active = tab === t.id;
            const badge = pendingBadges[t.id] ?? 0;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                  active
                    ? "bg-caramel text-espresso-950 shadow-[0_10px_24px_-12px_rgba(217,154,78,0.7)]"
                    : "text-latte hover:bg-espresso-850 hover:text-cream"
                }`}
              >
                <span className="text-base">{t.icon}</span>
                {t.label}
                {badge > 0 && (
                  <span
                    className={`tnum ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                      active ? "bg-espresso-950/20 text-espresso-950" : "bg-clay/20 text-[#e58a63]"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="mt-auto hidden rounded-lg border border-cream/10 bg-espresso-900 p-3.5 text-[11px] leading-relaxed text-mocha md:block">
            Changes save to this browser instantly and appear on the storefront in real time.
          </div>
        </nav>

        {/* content */}
        <main className="min-w-0 flex-1 p-5 md:p-8">
          {tab === "overview" && <Overview />}
          {tab === "orders" && <OrdersAdmin />}
          {tab === "menu" && <MenuAdmin />}
          {tab === "tables" && <TablesAdmin />}
          {tab === "reservations" && <ReservationsAdmin />}
        </main>
      </div>
    </div>
  );
}
