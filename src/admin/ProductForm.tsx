import { useState } from "react";
import { CloseIcon } from "../components/Icons";
import { CATEGORIES, type Category, type Product } from "../data/products";
import { uid, useData } from "../lib/store";

const IMAGE_LIBRARY = [
  "https://image.qwenlm.ai/generated-images/daed2be5-48ba-48a9-8131-4e0febc61471/_result.png",
  "https://image.qwenlm.ai/generated-images/3e6f76bc-2f5b-4520-a95b-1a363392f10e/_result.png",
  "https://image.qwenlm.ai/generated-images/05c897c6-99e9-441e-b6ef-855eaf1857db/_result.png",
  "https://image.qwenlm.ai/generated-images/dec1200f-c888-4386-a462-482cfdba7632/_result.png",
  "https://image.qwenlm.ai/generated-images/c55614b0-25ca-495d-921c-f184c313a6ed/_result.png",
  "https://image.qwenlm.ai/generated-images/7dfe18c9-d2f2-4a92-9b3e-71f66eb01b2a/_result.png",
  "https://image.qwenlm.ai/generated-images/5a8c1302-bfd2-4fe7-89c3-332053c0de2d/_result.png",
];

const ROAST_LABELS = ["", "Extra light", "Light roast", "Medium roast", "Medium-dark", "Dark roast"];

const inputCls =
  "w-full rounded-lg border border-cream/15 bg-espresso-850 px-3.5 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-mocha/60 hover:border-cream/25 focus:border-caramel/70";

function L({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">{label}</span>
      {children}
    </label>
  );
}

export default function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { upsertProduct } = useData();
  const [f, setF] = useState<Product>(
    product ?? {
      id: uid(),
      name: "",
      origin: "",
      category: "single-origin",
      roast: 3,
      roastLabel: ROAST_LABELS[3],
      price: 19,
      weight: "250 g · whole bean",
      notes: [],
      description: "",
      process: "Washed",
      elevation: "",
      varietal: "",
      producer: "",
      image: IMAGE_LIBRARY[1],
      accent: "#d99a4e",
      meters: { acidity: 60, body: 60, sweetness: 60 },
      brew: ["V60 · 1:15 · 93°C"],
      rating: 4.8,
      reviews: 0,
      available: true,
    }
  );
  const [notesText, setNotesText] = useState((product?.notes ?? ["", "", ""]).join(", "));
  const [brewText, setBrewText] = useState((product?.brew ?? []).join(" · ") || "V60 · 1:15 · 93°C");
  const [error, setError] = useState("");

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (f.name.trim().length < 2) return setError("Give the roast a name.");
    if (!(f.price > 0)) return setError("Price must be above zero.");
    if (!f.origin.trim()) return setError("Add an origin line, e.g. “Ethiopia · Gedeb”.");
    const next: Product = {
      ...f,
      name: f.name.trim(),
      origin: f.origin.trim(),
      roastLabel: ROAST_LABELS[f.roast],
      notes: notesText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4),
      brew: brewText.split(/·|,/).map((s) => s.trim()).filter(Boolean),
      rating: Math.min(5, Math.max(0, f.rating)),
      reviews: Math.max(0, Math.round(f.reviews)),
    };
    upsertProduct(next);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default bg-espresso-950/85 backdrop-blur-sm" onClick={onClose} aria-label="Close form" />
      <div className="animate-rise warm-scroll relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-cream/12 bg-espresso-900 p-6 sm:max-h-[88vh] md:rounded-2xl md:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-medium">{product ? `Edit · ${product.name}` : "New roast"}</h3>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-cream/15 text-latte transition-all hover:rotate-90 hover:text-cream">
            <CloseIcon />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <L label="Name" className="sm:col-span-2">
            <input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Yirgacheffe Dawn" />
          </L>
          <L label="Origin line">
            <input className={inputCls} value={f.origin} onChange={(e) => set("origin", e.target.value)} placeholder="Ethiopia · Gedeb" />
          </L>
          <L label="Category">
            <select className={`${inputCls} cursor-pointer`} value={f.category} onChange={(e) => set("category", e.target.value as Category)}>
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </L>
          <L label="Price (USD)">
            <input className={inputCls} type="number" min="0" step="0.5" value={f.price} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} />
          </L>
          <L label="Weight line">
            <input className={inputCls} value={f.weight} onChange={(e) => set("weight", e.target.value)} placeholder="250 g · whole bean" />
          </L>
          <L label={`Roast level — ${ROAST_LABELS[f.roast]}`}>
            <input type="range" min={1} max={5} value={f.roast} onChange={(e) => set("roast", Number(e.target.value) as Product["roast"])} className="mt-3 w-full accent-caramel" />
          </L>
          <L label="Badge (optional)">
            <input className={inputCls} value={f.badge ?? ""} onChange={(e) => set("badge", e.target.value || undefined)} placeholder="New crop" />
          </L>
          <L label="Tasting notes · comma separated" className="sm:col-span-2">
            <input className={inputCls} value={notesText} onChange={(e) => setNotesText(e.target.value)} placeholder="Bergamot, Apricot, Jasmine" />
          </L>
          <L label="Description" className="sm:col-span-2">
            <textarea className={`${inputCls} min-h-[90px] resize-y`} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell the story of this lot…" />
          </L>
          <L label="Process"><input className={inputCls} value={f.process} onChange={(e) => set("process", e.target.value)} /></L>
          <L label="Elevation"><input className={inputCls} value={f.elevation} onChange={(e) => set("elevation", e.target.value)} placeholder="1,900 masl" /></L>
          <L label="Varietal"><input className={inputCls} value={f.varietal} onChange={(e) => set("varietal", e.target.value)} /></L>
          <L label="Producer"><input className={inputCls} value={f.producer} onChange={(e) => set("producer", e.target.value)} /></L>
          <L label="Brew recipes · separated by ·" className="sm:col-span-2">
            <input className={inputCls} value={brewText} onChange={(e) => setBrewText(e.target.value)} placeholder="V60 · 1:15 · 93°C · Espresso · 1:2" />
          </L>

          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Cup profile</span>
            <div className="grid gap-3 rounded-lg border border-cream/10 bg-espresso-850/60 p-4 sm:grid-cols-3">
              {(["acidity", "body", "sweetness"] as const).map((k) => (
                <div key={k}>
                  <p className="flex justify-between text-xs font-semibold capitalize text-latte">
                    {k} <span className="tnum text-mocha">{f.meters[k]}</span>
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={f.meters[k]}
                    onChange={(e) => set("meters", { ...f.meters, [k]: Number(e.target.value) })}
                    className="mt-1 w-full accent-caramel"
                  />
                </div>
              ))}
            </div>
          </div>

          <L label="Rating (0–5)">
            <input className={inputCls} type="number" min="0" max="5" step="0.1" value={f.rating} onChange={(e) => set("rating", parseFloat(e.target.value) || 0)} />
          </L>
          <L label="Review count">
            <input className={inputCls} type="number" min="0" value={f.reviews} onChange={(e) => set("reviews", parseInt(e.target.value) || 0)} />
          </L>

          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">Bag photo</span>
            <div className="flex flex-wrap items-center gap-2.5">
              {IMAGE_LIBRARY.map((url) => (
                <button
                  key={url}
                  onClick={() => set("image", url)}
                  className={`overflow-hidden rounded-lg border-2 transition-all ${
                    f.image === url ? "border-caramel shadow-[0_0_0_3px_rgba(217,154,78,0.25)]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label="Choose this photo"
                >
                  <img src={url} alt="" className="h-14 w-11 object-cover" />
                </button>
              ))}
            </div>
            <input className={`${inputCls} mt-2.5`} value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="…or paste any image URL" />
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg border border-clay/50 bg-clay/10 px-4 py-2.5 text-sm font-semibold text-[#e58a63]">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="rounded-full border border-cream/20 px-6 py-3 text-sm font-bold text-latte transition-colors hover:text-cream">
            Discard
          </button>
          <button onClick={save} className="flex-1 rounded-full bg-caramel py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-espresso-950 transition-all hover:bg-honey">
            {product ? "Save changes" : "Add to menu"}
          </button>
        </div>
      </div>
    </div>
  );
}
