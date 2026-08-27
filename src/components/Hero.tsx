import type { Product } from "../data/products";
import { fmt } from "../data/products";
import { ArrowIcon, BeanIcon, FlameIcon, PlusIcon } from "./Icons";
import { MaskLines, Reveal } from "./Reveal";

interface HeroProps {
  featured: Product;
  onQuickAdd: (p: Product) => void;
  onOpen: (p: Product) => void;
}

const STATS = [
  { k: "Charge", v: "200°C" },
  { k: "First crack", v: "11:04" },
  { k: "Drop", v: "13:12 · 204°C" },
];

export default function Hero({ featured, onQuickAdd, onOpen }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 md:grid-cols-12 md:gap-8 md:px-8 md:pb-28 md:pt-16 lg:gap-12">
        {/* ---- left: roast log opening ---- */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-caramel">
              <span className="animate-blink inline-block h-2 w-2 rounded-full bg-clay" />
              Roasting now — Batch Nº 214
            </p>
          </Reveal>

          <MaskLines
            className="mt-5 font-display text-[2.65rem] leading-[1.03] font-medium tracking-[-0.015em] sm:text-6xl lg:text-[4.5rem]"
            lines={[
              <>Small fire,</>,
              <>
                slow <em className="font-light italic text-honey">hands,</em>
              </>,
              <>serious coffee.</>,
            ]}
          />

          <Reveal delay={350}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-latte md:text-lg">
              Cinder is a twelve-kilo micro-roastery in Portland. We buy from twenty-seven farms we
              can name, roast twice a week, and ship every bag within 72 hours of the drop — rested,
              sealed, and still warm from the story.
            </p>
          </Reveal>

          <Reveal delay={450}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#shop"
                className="group inline-flex items-center gap-2.5 rounded-full bg-caramel px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.14em] text-espresso-950 shadow-[0_14px_36px_-12px_rgba(217,154,78,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-honey"
              >
                Shop the roasts
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#story"
                className="link-ember inline-flex items-center gap-2 rounded-full border border-cream/20 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-latte transition-colors hover:border-caramel/60 hover:text-honey"
              >
                <FlameIcon className="text-caramel" />
                Our roast log
              </a>
            </div>
          </Reveal>

          <Reveal delay={550}>
            <div className="relative mt-12 max-w-xl overflow-hidden rounded-xl border border-cream/10 bg-espresso-900/70 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-mocha">
                  Roast log · Ethiopia Gedeb — light
                </p>
                <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-clay">
                  <span className="animate-blink h-1.5 w-1.5 rounded-full bg-clay" />
                  Live
                </p>
              </div>

              <svg viewBox="0 0 320 118" className="mt-3 h-auto w-full" role="img" aria-label="Roast temperature curve for batch 214">
                {[30, 58, 86].map((y) => (
                  <line key={y} x1="4" x2="316" y1={y} y2={y} stroke="var(--color-cream)" strokeOpacity="0.07" strokeDasharray="3 6" />
                ))}
                <path
                  className="draw-path"
                  d="M6,16 C36,90 74,104 106,98 C156,90 232,60 314,30"
                  fill="none"
                  stroke="var(--color-caramel)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="106" cy="98" r="3.5" fill="var(--color-copper)" />
                <circle cx="314" cy="30" r="3.5" fill="var(--color-honey)" />
                <text x="6" y="10" fontSize="9" letterSpacing="1.2" fill="var(--color-latte)">CHARGE · 200°C</text>
                <text x="70" y="113" fontSize="9" letterSpacing="1.2" fill="var(--color-latte)">TURN · 96°C</text>
                <text x="186" y="50" fontSize="9" letterSpacing="1.2" fill="var(--color-latte)">1ST CRACK · 196°C</text>
                <text x="246" y="18" fontSize="9" letterSpacing="1.2" fill="var(--color-honey)">DROP · 204°C</text>
              </svg>

              <div className="mt-4 grid grid-cols-3 divide-x divide-cream/10 border-t border-cream/10 pt-4">
                {STATS.map((s, i) => (
                  <div key={s.k} className={i === 0 ? "pr-3" : "px-3"}>
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.24em] text-mocha">{s.k}</p>
                    <p className="tnum mt-1 font-display text-base text-cream md:text-lg">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---- right: roastery image + this week's pour ---- */}
        <div className="relative md:col-span-5">
          <Reveal delay={200} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.3rem] border border-cream/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]">
              <img
                src="https://image.qwenlm.ai/generated-images/daed2be5-48ba-48a9-8131-4e0febc61471/_result.png"
                alt="Freshly roasted beans cooling in the roaster at Cinder"
                className="animate-ken h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-950/55 via-transparent to-espresso-950/20" />
            </div>

            {/* rotating stamp */}
            <div className="absolute -left-5 -top-5 h-24 w-24 md:-left-9 md:h-28 md:w-28">
              <svg viewBox="0 0 100 100" className="animate-spin-slow h-full w-full">
                <defs>
                  <path id="stamp-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text fontSize="10.5" letterSpacing="3" fill="var(--color-honey)" fontWeight="700">
                  <textPath href="#stamp-circle">ROASTED TO ORDER · SMALL BATCH ·</textPath>
                </text>
              </svg>
              <BeanIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-caramel" />
            </div>

            {/* this week's pour */}
            <button
              onClick={() => onOpen(featured)}
              className="group absolute -bottom-7 left-4 right-4 flex items-center gap-3.5 rounded-xl border border-cream/15 bg-espresso-900/95 p-4 text-left shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 md:-left-9 md:right-auto md:w-[330px]"
            >
              <img
                src={featured.image}
                alt=""
                className="h-16 w-14 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[9.5px] font-bold uppercase tracking-[0.24em] text-caramel">
                  This week's first pour
                </span>
                <span className="mt-1 block truncate font-display text-lg leading-tight text-cream group-hover:text-honey transition-colors">
                  {featured.name}
                </span>
                <span className="tnum mt-0.5 block text-xs text-mocha">
                  {fmt(featured.price)} · {featured.origin}
                </span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(featured);
                }}
                role="button"
                aria-label={`Add ${featured.name} to cart`}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-caramel text-espresso-950 transition-all duration-300 hover:scale-110 hover:bg-honey"
              >
                <PlusIcon className="text-base" />
              </span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
