import { useState } from "react";
import { BeanIcon, LockIcon, PencilIcon, PlusIcon } from "../components/Icons";
import { CATEGORY_LABEL, fmt, type Product } from "../data/products";
import { can, useData } from "../lib/store";
import { Pill } from "./AdminPanel";
import ProductForm from "./ProductForm";

export default function MenuAdmin() {
  const { products, deleteProduct, upsertProduct, currentUser } = useData();
  const allowCreate = can(currentUser, "menu.create");
  const allowEdit = can(currentUser, "menu.edit");
  const allowStock = can(currentUser, "menu.stock");
  const allowDelete = can(currentUser, "menu.delete");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleAvailable = (p: Product) =>
    upsertProduct({ ...p, available: p.available === false ? true : false });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium">Menu</h2>
          <p className="mt-1 text-sm text-mocha">
            Add, edit, price and retire roasts — the storefront shelf updates instantly.
          </p>
        </div>
        {allowCreate && (
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-caramel px-5 py-3 text-xs font-extrabold uppercase tracking-[0.12em] text-espresso-950 transition-all hover:-translate-y-0.5 hover:bg-honey"
          >
            <PlusIcon /> New roast
          </button>
        )}
      </div>

      {!allowEdit && (
        <p className="mt-5 flex items-center gap-2.5 rounded-lg border border-cream/12 bg-espresso-900 px-4 py-3 text-[13px] font-semibold text-latte">
          <span className="text-caramel"><LockIcon /></span>
          Read-only — the Staff role can browse the menu but not change it. Ask a manager or admin for edits.
        </p>
      )}

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-cream/15 py-16 text-center">
          <BeanIcon className="text-4xl text-espresso-700" />
          <p className="mt-4 font-display text-xl text-cream">The shelf is empty</p>
          <p className="mt-1 text-sm text-mocha">Add your first roast to open the shop.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {products.map((p) => {
            const soldOut = p.available === false;
            return (
              <li
                key={p.id}
                className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-espresso-900 px-4 py-3.5 transition-colors sm:flex-nowrap ${
                  soldOut ? "border-cream/8 opacity-70" : "border-cream/10 hover:border-cream/20"
                }`}
              >
                <img src={p.image} alt="" className={`h-14 w-11 shrink-0 rounded-lg object-cover ${soldOut ? "saturate-50" : ""}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg leading-tight text-cream">{p.name}</p>
                    {soldOut && <Pill tone="clay">Sold out</Pill>}
                    {p.badge && !soldOut && <Pill tone="caramel">{p.badge}</Pill>}
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-mocha">
                    {CATEGORY_LABEL[p.category]} · {p.origin} · {p.notes.join(", ") || "no notes set"}
                  </p>
                </div>

                <span className="flex shrink-0 items-center gap-1" title={`Roast: ${p.roastLabel}`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= p.roast ? "bg-caramel" : "bg-cream/20"}`} />
                  ))}
                </span>

                <span className="tnum w-16 shrink-0 text-right font-display text-lg text-honey">{fmt(p.price)}</span>

                <div className="flex shrink-0 items-center gap-1.5">
                  {allowStock && (
                    <button
                      onClick={() => toggleAvailable(p)}
                      className={`rounded-lg border px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors ${
                        soldOut
                          ? "border-sage/50 text-sage hover:bg-sage/10"
                          : "border-cream/15 text-mocha hover:border-honey/50 hover:text-honey"
                      }`}
                    >
                      {soldOut ? "Restock" : "Mark sold out"}
                    </button>
                  )}
                  {allowEdit && (
                    <button
                      onClick={() => {
                        setEditing(p);
                        setFormOpen(true);
                      }}
                      aria-label={`Edit ${p.name}`}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-cream/15 text-latte transition-colors hover:border-caramel/60 hover:text-honey"
                    >
                      <PencilIcon />
                    </button>
                  )}
                  {allowDelete && (confirmDelete === p.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          deleteProduct(p.id);
                          setConfirmDelete(null);
                        }}
                        className="rounded-lg bg-clay px-3 py-2 text-[11px] font-extrabold uppercase text-cream hover:bg-[#a84425]"
                      >
                        Sure?
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-lg border border-cream/15 px-2.5 py-2 text-[11px] font-bold text-latte hover:text-cream"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="rounded-lg border border-cream/15 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-mocha transition-colors hover:border-clay/60 hover:text-[#e58a63]"
                    >
                      Delete
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {formOpen && <ProductForm key={editing?.id ?? "new"} product={editing} onClose={() => setFormOpen(false)} />}
    </div>
  );
}
