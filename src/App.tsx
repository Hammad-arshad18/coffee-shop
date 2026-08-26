import { useCallback, useMemo, useState } from "react";
import CartDrawer, { type CartLine } from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductModal from "./components/ProductModal";
import Shop, { type SortKey } from "./components/Shop";
import Story from "./components/Story";
import Ticker from "./components/Ticker";
import Toasts, { type Toast } from "./components/Toasts";
import { products, type CartItem, type Category, type Product } from "./data/products";
import { useLocalStorage } from "./lib/hooks";

export default function App() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cinder-cart-v1", []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [active, setActive] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addToCart = useCallback(
    (p: Product, qty = 1) => {
      setCart((c) => {
        const existing = c.find((i) => i.id === p.id);
        if (existing)
          return c.map((i) => (i.id === p.id ? { ...i, qty: Math.min(12, i.qty + qty) } : i));
        return [...c, { id: p.id, qty: Math.min(12, qty) }];
      });
      pushToast(qty > 1 ? `${qty} × ${p.name} added to cart` : `${p.name} added to cart`);
    },
    [pushToast, setCart]
  );

  const setQty = useCallback(
    (id: string, qty: number) => {
      setCart((c) => {
        if (qty <= 0) return c.filter((i) => i.id !== id);
        const clamped = Math.min(12, qty);
        return c.some((i) => i.id === id)
          ? c.map((i) => (i.id === id ? { ...i, qty: clamped } : i))
          : [...c, { id, qty: clamped }];
      });
    },
    [setCart]
  );

  const removeLine = useCallback(
    (id: string) => setCart((c) => c.filter((i) => i.id !== id)),
    [setCart]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      const hay =
        `${p.name} ${p.origin} ${p.notes.join(" ")} ${p.roastLabel} ${p.process} ${p.category} ${p.varietal}`.toLowerCase();
      return hay.includes(q);
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      default:
        break;
    }
    return list;
  }, [query, category, sort]);

  const lines: CartLine[] = useMemo(
    () =>
      cart
        .map((ci) => {
          const product = products.find((p) => p.id === ci.id);
          return product ? { product, qty: ci.qty } : null;
        })
        .filter((l): l is CartLine => l !== null),
    [cart]
  );

  const subtotal = useMemo(() => lines.reduce((n, l) => n + l.product.price * l.qty, 0), [lines]);
  const cartCount = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);

  const resetFilters = useCallback(() => {
    setQuery("");
    setCategory("all");
    setSort("featured");
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* ambient ember glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-drift absolute -left-48 -top-48 h-[38rem] w-[38rem] rounded-full bg-caramel/[0.09] blur-[130px]" />
        <div className="animate-drift-slow absolute -right-52 top-1/3 h-[42rem] w-[42rem] rounded-full bg-copper/[0.08] blur-[150px]" />
        <div className="absolute -bottom-32 left-1/4 h-[26rem] w-[26rem] rounded-full bg-clay/[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Header
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          query={query}
          onQueryChange={setQuery}
        />
        <Ticker />
        <main>
          <Hero
            featured={products[0]}
            onQuickAdd={(p) => addToCart(p)}
            onOpen={(p) => setActive(p)}
          />
          <Shop
            query={query}
            category={category}
            sort={sort}
            results={results}
            cart={cart}
            onCategoryChange={setCategory}
            onSortChange={setSort}
            onAdd={(p) => addToCart(p)}
            onOpen={(p) => setActive(p)}
            onSetQty={setQty}
            onReset={resetFilters}
          />
          <Story />
        </main>
        <Footer />
      </div>

      {/* overlays */}
      <ProductModal
        product={active}
        cartQty={active ? cart.find((c) => c.id === active.id)?.qty ?? 0 : 0}
        onClose={() => setActive(null)}
        onAdd={(p, qty) => {
          addToCart(p, qty);
          setActive(null);
        }}
      />
      <CartDrawer
        open={cartOpen}
        lines={lines}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onSetQty={setQty}
        onRemove={removeLine}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal
        open={checkoutOpen}
        lines={lines}
        subtotal={subtotal}
        onClose={() => setCheckoutOpen(false)}
        onComplete={() => {
          setCart([]);
          pushToast("Order placed — see you Tuesday");
        }}
      />
      <Toasts toasts={toasts} />
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}
