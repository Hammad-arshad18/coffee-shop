import type { CartItem, Category, Product } from "../data/products";
import { CATEGORIES, products } from "../data/products";
import { BeanIcon, ChevronIcon, SearchIcon } from "./Icons";
import ProductCard from "./ProductCard";
import { Reveal } from "./Reveal";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

interface ShopProps {
  query: string;
  category: "all" | Category;
  sort: SortKey;
  results: Product[];
  cart: CartItem[];
  onCategoryChange: (c: "all" | Category) => void;
  onSortChange: (s: SortKey) => void;
  onAdd: (p: Product) => void;
  onOpen: (p: Product) => void;
  onSetQty: (id: string, qty: number) => void;
  onReset: () => void;
}

export default function Shop({
  query,
  category,
  sort,
  results,
  cart,
  onCategoryChange,
  onSortChange,
  onAdd,
  onOpen,
  onSetQty,
  onReset,
}: ShopProps) {
  const qtyOf = (id: string) => cart.find((c) => c.id === id)?.qty ?? 0;

  // counts reflect the current search, across categories
  const q = query.trim().toLowerCase();
  const searched = products.filter((p) => {
    if (!q) return true;
    const hay = `${p.name} ${p.origin} ${p.notes.join(" ")} ${p.roastLabel} ${p.process} ${p.category}`.toLowerCase();
    return hay.includes(q);
  });
  const countFor = (id: "all" | Category) =>
    id === "all" ? searched.length : searched.filter((p) => p.category === id).length;

  return (
    <section id="shop" className="relative scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        {/* toolbar */}
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-caramel">
                <span className="h-px w-8 bg-caramel/60" />
                The shelf
              </p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
                Six roasts. <em className="font-light italic text-honey">Zero filler.</em>
              </h2>
              <p className="tnum mt-2 text-sm text-mocha" aria-live="polite">
                Showing {results.length} of {products.length} coffees
                {query.trim() && (
                  <>
                    {" "}for “<span className="text-honey">{query.trim()}</span>”
                  </>
                )}
              </p>
            </div>

            <div className="relative self-start md:self-auto">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold uppercase tracking-[0.14em] text-mocha">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortKey)}
                aria-label="Sort products"
                className="cursor-pointer appearance-none rounded-full border border-cream/15 bg-espresso-900 py-3 pl-16 pr-10 text-sm font-semibold text-cream outline-none transition-colors hover:border-caramel/50 focus:border-caramel/70"
              >
                <option value="featured">Featured</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price · low to high</option>
                <option value="price-desc">Price · high to low</option>
              </select>
              <ChevronIcon className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mocha" />
            </div>
          </div>
        </Reveal>

        {/* category chips */}
        <Reveal delay={100}>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              const n = countFor(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => onCategoryChange(c.id)}
                  aria-pressed={active}
                  className={`group flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold transition-all duration-300 ${
                    active
                      ? "border-caramel bg-caramel text-espresso-950 shadow-[0_10px_26px_-12px_rgba(217,154,78,0.6)]"
                      : "border-cream/15 text-latte hover:border-caramel/60 hover:text-honey"
                  }`}
                >
                  {c.label}
                  <span
                    className={`tnum rounded-full px-1.5 py-0.5 text-[10.5px] ${
                      active ? "bg-espresso-950/15 text-espresso-950" : "bg-cream/10 text-mocha group-hover:text-honey"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}

            {query.trim() && (
              <span className="ml-1 hidden items-center gap-1.5 text-xs text-mocha sm:flex">
                <SearchIcon className="text-caramel" />
                matching name, origin & tasting notes
              </span>
            )}
          </div>
        </Reveal>

        {/* grid */}
        {results.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}>
                <ProductCard
                  product={p}
                  cartQty={qtyOf(p.id)}
                  onAdd={onAdd}
                  onOpen={onOpen}
                  onSetQty={onSetQty}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center rounded-xl border border-dashed border-cream/15 py-20 text-center">
            <BeanIcon className="text-5xl text-espresso-700" />
            <h3 className="mt-5 font-display text-2xl text-cream">Nothing in the hopper</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-mocha">
              No beans match that combination. Loosen the filter or try a note like
              “chocolate”, “apricot” or “plum”.
            </p>
            <button
              onClick={onReset}
              className="mt-6 rounded-full border border-caramel/60 px-6 py-3 text-sm font-bold text-honey transition-all hover:bg-caramel hover:text-espresso-950"
            >
              Clear search & filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
