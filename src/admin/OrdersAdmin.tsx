import { useState } from "react";
import { CartIcon, CheckIcon, ChevronIcon, CloseIcon, TruckIcon } from "../components/Icons";
import { fmt, type Order, type OrderStatus } from "../data/products";
import { fmtDateTime, useData } from "../lib/store";
import { orderTone, Pill } from "./AdminPanel";

const FILTERS: ("all" | OrderStatus)[] = ["all", "pending", "roasting", "shipped", "delivered", "cancelled"];

export default function OrdersAdmin() {
  const { orders, setOrderStatus } = useData();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const visible = orders.filter((o) => filter === "all" || o.status === filter);
  const countOf = (f: "all" | OrderStatus) =>
    f === "all" ? orders.length : orders.filter((o) => o.status === f).length;

  const advance = (o: Order) => {
    if (o.status === "pending") setOrderStatus(o.id, "roasting");
    else if (o.status === "roasting") setOrderStatus(o.id, "shipped");
    else if (o.status === "shipped") setOrderStatus(o.id, "delivered");
  };

  const advanceLabel: Partial<Record<OrderStatus, string>> = {
    pending: "Start roasting",
    roasting: "Mark shipped",
    shipped: "Mark delivered",
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium">Orders</h2>
          <p className="mt-1 text-sm text-mocha">
            Every checkout lands here. Move bags through the roast → ship → deliver pipeline.
          </p>
        </div>
      </div>

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
          <CartIcon className="text-4xl text-espresso-700" />
          <p className="mt-4 font-display text-xl text-cream">No {filter === "all" ? "" : filter + " "}orders</p>
          <p className="mt-1 text-sm text-mocha">Place one from the storefront — it appears here instantly.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((o) => {
            const open = expanded === o.id;
            const advanceTo = advanceLabel[o.status];
            return (
              <li
                key={o.id}
                className={`overflow-hidden rounded-xl border bg-espresso-900 transition-colors ${
                  open ? "border-caramel/40" : "border-cream/10 hover:border-cream/20"
                }`}
              >
                <button
                  onClick={() => setExpanded(open ? null : o.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="tnum font-display text-lg text-cream">{o.number}</span>
                      <Pill tone={orderTone[o.status]}>{o.status}</Pill>
                    </div>
                    <p className="mt-0.5 truncate text-[12.5px] text-mocha">
                      {o.customer.name} · {o.items.reduce((n, i) => n + i.qty, 0)} bags · {fmtDateTime(o.createdAt)}
                    </p>
                  </div>
                  <span className="tnum shrink-0 font-display text-lg text-honey">{fmt(o.total)}</span>
                  <ChevronIcon
                    className={`shrink-0 text-mocha transition-transform duration-300 ${open ? "rotate-180 text-caramel" : ""}`}
                  />
                </button>

                {open && (
                  <div className="grid gap-5 border-t border-cream/10 px-5 py-5 md:grid-cols-[1fr_260px]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-mocha">Items</p>
                      <ul className="mt-3 space-y-2.5">
                        {o.items.map((it) => (
                          <li key={it.productId} className="flex items-center gap-3">
                            <img src={it.image} alt="" className="h-11 w-9 rounded-md object-cover" />
                            <span className="flex-1 text-sm font-semibold text-cream">{it.name}</span>
                            <span className="tnum text-xs text-mocha">{it.qty} × {fmt(it.price)}</span>
                            <span className="tnum w-16 text-right text-sm font-bold text-latte">{fmt(it.qty * it.price)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex justify-end gap-5 border-t border-cream/10 pt-3 text-xs text-mocha">
                        <span>Subtotal <span className="tnum text-latte">{fmt(o.subtotal)}</span></span>
                        <span>Shipping <span className={`tnum ${o.shipping === 0 ? "text-sage" : "text-latte"}`}>{o.shipping === 0 ? "Free" : fmt(o.shipping)}</span></span>
                        <span>Total <span className="tnum font-bold text-honey">{fmt(o.total)}</span></span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-cream/10 bg-espresso-850/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-mocha">Ship to</p>
                      <p className="mt-2 text-sm font-bold text-cream">{o.customer.name}</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-latte">
                        {o.customer.address}
                        <br />
                        {o.customer.city}, {o.customer.zip}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-mocha">{o.customer.email}</p>

                      {o.status !== "cancelled" && o.status !== "delivered" && (
                        <div className="mt-4 space-y-2">
                          {advanceTo && (
                            <button
                              onClick={() => advance(o)}
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-caramel py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-espresso-950 transition-colors hover:bg-honey"
                            >
                              {o.status === "roasting" ? <TruckIcon /> : <CheckIcon />}
                              {advanceTo}
                            </button>
                          )}
                          {confirmCancel === o.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setOrderStatus(o.id, "cancelled");
                                  setConfirmCancel(null);
                                }}
                                className="flex-1 rounded-lg bg-clay py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-[#a84425]"
                              >
                                Yes, cancel
                              </button>
                              <button
                                onClick={() => setConfirmCancel(null)}
                                className="rounded-lg border border-cream/20 px-3 text-xs font-bold text-latte hover:text-cream"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancel(o.id)}
                              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-cream/15 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-mocha transition-colors hover:border-clay/60 hover:text-[#e58a63]"
                            >
                              <CloseIcon className="text-xs" /> Cancel order
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
