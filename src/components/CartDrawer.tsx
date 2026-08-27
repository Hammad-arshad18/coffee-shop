import type { Product } from "../data/products";
import { fmt, FREE_SHIPPING_THRESHOLD } from "../data/products";
import { useEscape, useLockBody } from "../lib/hooks";
import { ArrowIcon, CartIcon, CheckIcon, CloseIcon, MinusIcon, PlusIcon, TruckIcon } from "./Icons";

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartDrawerProps {
  open: boolean;
  lines: CartLine[];
  subtotal: number;
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, lines, subtotal, onClose, onSetQty, onRemove, onCheckout }: CartDrawerProps) {
  useLockBody(open);
  useEscape(open, onClose);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <>
      <button
        aria-label="Close cart"
        onClick={onClose}
        className={`fixed inset-0 z-50 cursor-default bg-espresso-950/80 backdrop-blur-[3px] transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-cream/12 bg-espresso-900 shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
          <h2 className="flex items-center gap-3 font-display text-2xl">
            Your cart
            {count > 0 && (
              <span className="tnum rounded-full bg-caramel px-2.5 py-0.5 font-body text-xs font-extrabold text-espresso-950">
                {count}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-latte transition-all hover:rotate-90 hover:border-caramel/60 hover:text-cream"
          >
            <CloseIcon />
          </button>
        </header>

        {lines.length > 0 ? (
          <>
            {/* free shipping meter */}
            <div className="mx-6 mt-5 rounded-lg border border-cream/10 bg-espresso-850/70 p-3.5">
              {remaining > 0 ? (
                <p className="flex items-center gap-2 text-[13px] font-semibold text-latte">
                  <TruckIcon className="text-caramel" />
                  <span>
                    <span className="tnum text-honey">{fmt(remaining)}</span> away from free shipping
                  </span>
                </p>
              ) : (
                <p className="flex items-center gap-2 text-[13px] font-bold text-sage">
                  <CheckIcon /> Free shipping unlocked
                </p>
              )}
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-cream/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-copper to-caramel transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <ul className="warm-scroll flex-1 divide-y divide-cream/8 overflow-y-auto px-6">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <img
                    src={product.image}
                    alt=""
                    className="h-20 w-16 shrink-0 rounded-lg border border-cream/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-lg leading-tight text-cream">{product.name}</h3>
                        <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel">
                          {product.origin}
                        </p>
                        <p className="tnum mt-1 text-xs text-mocha">{fmt(product.price)} each</p>
                      </div>
                      <button
                        onClick={() => onRemove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="text-mocha transition-colors hover:text-clay"
                      >
                        <CloseIcon className="text-sm" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-cream/15">
                        <button
                          onClick={() => onSetQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-8 w-8 place-items-center text-latte transition-colors hover:text-cream"
                        >
                          <MinusIcon className="text-sm" />
                        </button>
                        <span key={qty} className="tnum animate-pop w-7 text-center text-sm font-bold">
                          {qty}
                        </span>
                        <button
                          onClick={() => onSetQty(product.id, qty + 1)}
                          disabled={qty >= 12}
                          aria-label="Increase quantity"
                          className="grid h-8 w-8 place-items-center text-latte transition-colors hover:text-cream disabled:opacity-30"
                        >
                          <PlusIcon className="text-sm" />
                        </button>
                      </div>
                      <p className="tnum font-display text-lg text-honey">{fmt(product.price * qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-cream/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-latte">Subtotal</span>
                <span className="tnum font-display text-2xl text-cream">{fmt(subtotal)}</span>
              </div>
              <p className="mt-1.5 text-[11.5px] text-mocha">
                Shipping & taxes at checkout · roasted to order, ships within 72 h
              </p>
              <button
                onClick={onCheckout}
                className="group mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-caramel py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-espresso-950 transition-all duration-300 hover:bg-honey hover:shadow-[0_14px_36px_-12px_rgba(217,154,78,0.55)]"
              >
                Checkout · <span className="tnum">{fmt(subtotal)}</span>
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={onClose}
                className="link-ember mx-auto mt-3 block text-[12px] font-bold uppercase tracking-[0.18em] text-mocha hover:text-honey transition-colors"
              >
                Keep browsing
              </button>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <CartIcon className="text-6xl text-espresso-700" />
            <h3 className="mt-6 font-display text-2xl">Your cart is still cold</h3>
            <p className="mt-2 text-sm leading-relaxed text-mocha">
              Six roasts are resting on the shelf, each one within 72 hours of the drum.
            </p>
            <a
              href="#shop"
              onClick={onClose}
              className="mt-7 rounded-full border border-caramel/60 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-honey transition-all hover:bg-caramel hover:text-espresso-950"
            >
              Warm it up
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
