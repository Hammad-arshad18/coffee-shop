import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import { fmt } from "../data/products";
import { useEscape, useLockBody } from "../lib/hooks";
import {
  BeanIcon,
  BodyIcon,
  CloseIcon,
  DropIcon,
  LeafIcon,
  MinusIcon,
  MountainIcon,
  PinIcon,
  PlusIcon,
  StarIcon,
  SunIcon,
} from "./Icons";

interface ProductModalProps {
  product: Product | null;
  cartQty: number;
  onClose: () => void;
  onAdd: (p: Product, qty: number) => void;
}

export default function ProductModal({ product, cartQty, onClose, onAdd }: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const [metersOn, setMetersOn] = useState(false);
  const soldOut = product ? product.available === false : false;

  useLockBody(product !== null);
  useEscape(product !== null, onClose);

  useEffect(() => {
    setQty(1);
    setMetersOn(false);
    if (!product) return;
    const t = window.setTimeout(() => setMetersOn(true), 120);
    return () => window.clearTimeout(t);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return null;

  const specs = [
    { icon: <LeafIcon className="text-caramel" />, label: "Process", value: product.process },
    { icon: <MountainIcon className="text-caramel" />, label: "Elevation", value: product.elevation },
    { icon: <BeanIcon className="text-caramel" />, label: "Varietal", value: product.varietal },
    { icon: <PinIcon className="text-caramel" />, label: "Producer", value: product.producer },
  ];

  const meters = [
    { icon: <DropIcon />, label: "Acidity", value: product.meters.acidity, color: "var(--color-honey)" },
    { icon: <BodyIcon />, label: "Body", value: product.meters.body, color: "var(--color-copper)" },
    { icon: <SunIcon />, label: "Sweetness", value: product.meters.sweetness, color: "var(--color-caramel)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
      <button
        className="absolute inset-0 cursor-default bg-espresso-950/85 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close product details"
      />

      <div className="animate-rise relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-t-2xl border border-cream/12 bg-espresso-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,1)] sm:max-h-[86vh] md:grid-cols-[1fr_1.15fr] md:rounded-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-cream/15 bg-espresso-950/70 text-latte backdrop-blur transition-all hover:rotate-90 hover:border-caramel/60 hover:text-cream"
        >
          <CloseIcon />
        </button>

        {/* image side */}
        <div className="relative min-h-[220px] overflow-hidden sm:min-h-[260px] md:min-h-0">
          <img src={product.image} alt={`${product.name} bag`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-espresso-950/25" />
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-cream/20 bg-espresso-950/75 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cream backdrop-blur-sm">
              {product.roastLabel}
            </span>
            {product.badge && (
              <span className="rounded-full border border-honey/40 bg-espresso-950/75 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-honey backdrop-blur-sm">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* details side */}
        <div className="warm-scroll overflow-y-auto p-6 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-caramel">{product.origin}</p>
          <h3 className="mt-2 pr-10 font-display text-3xl font-medium leading-tight md:text-4xl">{product.name}</h3>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-latte">
              <StarIcon className="text-honey" />
              <span className="tnum font-bold text-cream">{product.rating.toFixed(1)}</span>
              <span className="tnum text-mocha">· {product.reviews} reviews</span>
            </span>
            <span className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= product.roast ? "bg-caramel" : "bg-cream/20"}`} />
              ))}
            </span>
          </div>

          <p className="tnum mt-4 font-display text-2xl text-honey">
            {fmt(product.price)}
            <span className="ml-2 font-body text-xs font-normal text-mocha">{product.weight}</span>
          </p>

          <p className="mt-4 leading-relaxed text-latte">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {specs.map((s) => (
              <div key={s.label} className="rounded-lg border border-cream/10 bg-espresso-850/60 p-3">
                <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-mocha">
                  {s.icon} {s.label}
                </p>
                <p className="mt-1.5 text-[13px] font-semibold leading-snug text-cream">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-mocha">In the cup</p>
            <div className="mt-3 space-y-3">
              {meters.map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-[12px] font-semibold text-latte">
                    <span className="flex items-center gap-1.5 text-caramel">
                      {m.icon}
                      <span className="text-cream">{m.label}</span>
                    </span>
                    <span className="tnum text-mocha">{m.value}/100</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/10">
                    <div
                      className="h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ width: metersOn ? `${m.value}%` : "0%", background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.notes.map((n) => (
              <span key={n} className="rounded-full border border-caramel/40 px-3 py-1 text-xs font-semibold text-honey">
                {n}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-mocha">Brew it like we do</p>
            <ul className="mt-3 space-y-1.5">
              {product.brew.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-latte">
                  <BeanIcon className="shrink-0 text-[13px] text-caramel" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="sticky bottom-0 -mx-6 mt-8 border-t border-cream/10 bg-espresso-900/95 px-6 py-4 backdrop-blur md:-mx-8 md:px-8">
            {soldOut ? (
              <p className="py-2 text-center text-sm font-bold text-[#e58a63]">
                Sold out — this lot returns after Tuesday's roast
              </p>
            ) : (
            <>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-cream/20">
                <button
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="grid h-11 w-10 place-items-center text-latte transition-colors hover:text-cream disabled:opacity-30"
                >
                  <MinusIcon />
                </button>
                <span key={qty} className="tnum animate-pop w-7 text-center font-bold text-cream">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((v) => Math.min(12, v + 1))}
                  disabled={qty >= 12}
                  aria-label="Increase quantity"
                  className="grid h-11 w-10 place-items-center text-latte transition-colors hover:text-cream disabled:opacity-30"
                >
                  <PlusIcon />
                </button>
              </div>
              <button
                onClick={() => onAdd(product, qty)}
                className="flex-1 rounded-full bg-caramel py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-espresso-950 transition-all duration-300 hover:bg-honey hover:shadow-[0_12px_30px_-10px_rgba(217,154,78,0.6)]"
              >
                Add {qty > 1 ? `${qty} ` : ""}to cart · <span className="tnum">{fmt(product.price * qty)}</span>
              </button>
            </div>
            {cartQty > 0 && (
              <p className="tnum mt-2 text-center text-[11px] text-mocha">
                {cartQty} already in your cart
              </p>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
