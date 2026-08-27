import { BeanIcon } from "./Icons";

const ITEMS = [
  "Roast day — every Tuesday",
  "Free shipping over $40",
  "Batch Nº 214 dropping this week",
  "Rested 48 h before it ships",
  "Direct trade · 27 partner farms",
  "Compostable bags, always",
  "This week's cup — Yirgacheffe Dawn",
  "Roasted within 72 h of your door",
];

function Group({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-8 pr-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-latte"
    >
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-8 whitespace-nowrap">
          {item}
          <BeanIcon className="text-caramel text-[13px] shrink-0" />
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className="relative z-20 overflow-hidden border-y border-cream/10 bg-espresso-900/80 py-3">
      <div className="ticker-track">
        <Group />
        <Group ariaHidden />
      </div>
    </div>
  );
}
