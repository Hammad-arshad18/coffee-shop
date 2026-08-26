import { useEffect, useRef, useState } from "react";
import { CartIcon, CloseIcon, LogoMark, SearchIcon } from "./Icons";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  query: string;
  onQueryChange: (q: string) => void;
}

const NAV = [
  { label: "Shop", href: "#shop" },
  { label: "Roast log", href: "#story" },
  { label: "Visit", href: "#visit" },
];

export default function Header({ cartCount, onCartOpen, query, onQueryChange }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileSearch) mobileInputRef.current?.focus();
  }, [mobileSearch]);

  const inputCls =
    "w-full bg-espresso-850 border border-cream/15 rounded-full py-2.5 pl-10 pr-9 text-sm text-cream placeholder-mocha outline-none transition-all duration-300 focus:border-caramel/70 focus:bg-espresso-800";

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled || mobileSearch
          ? "bg-espresso-950/90 backdrop-blur-md border-b border-cream/10 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 md:h-[76px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="group flex items-center gap-2.5 shrink-0">
          <LogoMark className="text-caramel text-[27px] transition-transform duration-500 group-hover:rotate-12" />
          <span className="leading-none">
            <span className="block font-display text-[21px] font-semibold tracking-tight">
              Cinder
            </span>
            <span className="block text-[8.5px] font-bold uppercase tracking-[0.42em] text-mocha mt-0.5">
              Roastery · PDX
            </span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="link-ember text-[12px] font-bold uppercase tracking-[0.22em] text-latte hover:text-cream transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="relative hidden md:block">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mocha text-sm" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search roasts, notes…"
              className={`${inputCls} w-52 focus:w-72`}
              aria-label="Search coffees"
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mocha hover:text-cream transition-colors"
              >
                <CloseIcon className="text-sm" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileSearch((v) => !v)}
            aria-label="Toggle search"
            className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-latte hover:border-caramel/60 hover:text-honey transition-colors"
          >
            {mobileSearch ? <CloseIcon className="text-base" /> : <SearchIcon className="text-base" />}
          </button>

          <button
            onClick={onCartOpen}
            className="group relative flex items-center gap-2 rounded-full border border-cream/15 py-2.5 pl-4 pr-4 sm:pr-5 text-sm font-bold text-cream hover:border-caramel/70 hover:bg-espresso-900 transition-all duration-300"
          >
            <CartIcon className="text-lg text-caramel transition-transform duration-300 group-hover:-rotate-6" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="animate-pop absolute -right-1.5 -top-1.5 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-caramel px-1 text-[11px] font-extrabold text-espresso-950"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileSearch && (
        <div className="md:hidden border-t border-cream/10 px-5 py-3 bg-espresso-950/95">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mocha text-sm" />
            <input
              ref={mobileInputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search roasts, origins, tasting notes…"
              className={inputCls}
              aria-label="Search coffees"
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha"
              >
                <CloseIcon className="text-sm" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
