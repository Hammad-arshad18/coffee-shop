import type { Product } from "../data/products";
import { fmt } from "../data/products";
import { MinusIcon, PlusIcon, StarIcon } from "./Icons";

interface ProductCardProps {
  product: Product;
  cartQty: number;
  onAdd: (p: Product) => void;
  onOpen: (p: Product) => void;
  onSetQty: (id: string, qty: number) => void;
}

export default function ProductCard({ product, cartQty, onAdd, onOpen, onSetQty }: ProductCardProps) {
  return (
    <article
      className="group cursor-pointer"
      onClick={() => onOpen(product)}
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-cream/10 bg-espresso-900">
        <img
          src={product.image}
          alt={`${product.name} — ${product.origin}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-espresso-950/75 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:opacity-0 max-md:opacity-100" />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-honey/40 bg-espresso-950/75 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-honey backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        <span
          className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-espresso-950/70 px-2 py-1.5 backdrop-blur-sm"
          title={`Roast level: ${product.roastLabel}`}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i <= product.roast ? "bg-caramel" : "bg-cream/25"}`}
            />
          ))}
        </span>

        {/* quick add / in-cart stepper */}
        <div
          className="absolute inset-x-3 bottom-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-y-[115%] md:group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          {cartQty === 0 ? (
            <button
              onClick={() => onAdd(product)}
              className="flex w-full items-center justify-between rounded-lg border border-cream/15 bg-espresso-950/85 px-4 py-3 text-sm font-bold text-cream backdrop-blur transition-all duration-300 hover:border-caramel/70 hover:bg-espresso-950"
            >
              <span className="flex items-center gap-2">
                <PlusIcon className="text-caramel" />
                Add to cart
              </span>
              <span className="tnum text-latte">{fmt(product.price)}</span>
            </button>
          ) : (
            <div className="flex w-full items-center justify-between rounded-lg border border-caramel/50 bg-espresso-950/90 px-2 py-1.5 backdrop-blur">
              <button
                onClick={() => onSetQty(product.id, cartQty - 1)}
                aria-label="Decrease quantity"
                className="grid h-9 w-9 place-items-center rounded-md text-latte transition-colors hover:bg-espresso-800 hover:text-cream"
              >
                <MinusIcon />
              </button>
              <span className="tnum text-sm font-bold text-honey">{cartQty} in cart</span>
              <button
                onClick={() => onSetQty(product.id, cartQty + 1)}
                aria-label="Increase quantity"
                className="grid h-9 w-9 place-items-center rounded-md text-latte transition-colors hover:bg-espresso-800 hover:text-cream"
              >
                <PlusIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-caramel">{product.origin}</p>
        <p className="flex items-center gap-1 text-xs text-mocha">
          <StarIcon className="text-honey text-[11px]" />
          <span className="tnum font-bold text-latte">{product.rating.toFixed(1)}</span>
          <span className="tnum">({product.reviews})</span>
        </p>
      </div>
      <h3 className="mt-1 font-display text-[22px] font-medium leading-snug text-cream transition-colors duration-300 group-hover:text-honey">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-latte">{product.notes.join(" · ")}</p>
      <p className="mt-2.5 flex items-baseline justify-between">
        <span className="tnum font-display text-xl text-cream">{fmt(product.price)}</span>
        <span className="text-xs text-mocha">{product.weight}</span>
      </p>
    </article>
  );
}
