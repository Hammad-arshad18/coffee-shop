import { useEffect, useState, type InputHTMLAttributes } from "react";
import { fmt, FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from "../data/products";
import { useEscape, useLockBody } from "../lib/hooks";
import { useData } from "../lib/store";
import type { CartLine } from "./CartDrawer";
import { ArrowIcon, BeanIcon, CheckIcon, TruckIcon } from "./Icons";

type Step = "details" | "payment" | "processing" | "success";

interface CheckoutModalProps {
  open: boolean;
  lines: CartLine[];
  subtotal: number;
  onClose: () => void;
  onComplete: () => void;
}

const EMPTY = {
  name: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  cardName: "",
  card: "",
  exp: "",
  cvc: "",
};

function Field({
  label,
  error,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-mocha">
        {label}
        {error && <span className="normal-case tracking-normal text-[11px] font-semibold text-clay">{error}</span>}
      </span>
      <input
        {...rest}
        className={`w-full rounded-lg border bg-espresso-850 px-3.5 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-mocha/60 ${
          error ? "border-clay/70" : "border-cream/15 focus:border-caramel/70 hover:border-cream/25"
        }`}
      />
    </label>
  );
}

export default function CheckoutModal({ open, lines, subtotal, onClose, onComplete }: CheckoutModalProps) {
  const { placeOrder, currentUser, updateUser } = useData();
  const isCustomer = currentUser?.role === "customer";
  const [step, setStep] = useState<Step>("details");
  const [snapshot, setSnapshot] = useState<CartLine[]>([]);
  const [snapTotal, setSnapTotal] = useState(0);
  const [orderNo, setOrderNo] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useLockBody(open);
  useEscape(open && step !== "processing" && step !== "success", onClose);

  useEffect(() => {
    if (open) {
      setSnapshot(lines);
      setSnapTotal(subtotal);
      setStep("details");
      setErrors({});
      setForm(EMPTY);
      setOrderNo("");
      if (currentUser && currentUser.role === "customer") {
        setForm({
          ...EMPTY,
          name: currentUser.name,
          email: currentUser.email,
          address: currentUser.address ?? "",
          city: currentUser.city ?? "",
          zip: currentUser.zip ?? "",
        });
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const shipping = snapTotal >= FREE_SHIPPING_THRESHOLD || snapshot.length === 0 ? 0 : FLAT_SHIPPING;
  const total = snapTotal + shipping;
  const processing = step === "processing";

  const set = (k: keyof typeof EMPTY) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (!e[k]) return e;
      const next = { ...e };
      delete next[k];
      return next;
    });
  };

  const validDetails = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email needed";
    if (form.address.trim().length < 4) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (form.zip.trim().length < 3) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validPayment = () => {
    const e: Record<string, string> = {};
    if (form.cardName.trim().length < 2) e.cardName = "Required";
    if (form.card.replace(/\s/g, "").length !== 16) e.card = "16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.exp)) e.exp = "MM/YY";
    if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = "3–4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = () => {
    if (!validPayment()) return;
    setStep("processing");
    window.setTimeout(() => {
      const order = placeOrder({
        customer: {
          name: form.name,
          email: form.email,
          address: form.address,
          city: form.city,
          zip: form.zip,
        },
        items: snapshot.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          price: l.product.price,
          qty: l.qty,
          image: l.product.image,
        })),
        subtotal: snapTotal,
        shipping,
        total,
        userId: currentUser?.id ?? null,
      });
      if (currentUser && currentUser.role === "customer") {
        updateUser(currentUser.id, {
          name: form.name,
          email: form.email,
          address: form.address,
          city: form.city,
          zip: form.zip,
        });
      }
      setOrderNo(order.number);
      setStep("success");
      onComplete();
    }, 1800);
  };

  const stepDot = (n: 1 | 2, label: string) => {
    const reached = (step === "details" && n === 1) || (step !== "details" && n === 2) || step === "success";
    return (
      <span className="flex items-center gap-2">
        <span
          className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-extrabold transition-colors ${
            reached ? "bg-caramel text-espresso-950" : "border border-cream/20 text-mocha"
          }`}
        >
          {reached && step !== "details" && n === 1 ? <CheckIcon className="text-xs" /> : n}
        </span>
        <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${reached ? "text-cream" : "text-mocha"}`}>
          {label}
        </span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Checkout">
      <button
        className="absolute inset-0 cursor-default bg-espresso-950/85 backdrop-blur-sm"
        onClick={() => !processing && onClose()}
        aria-label="Close checkout"
      />

      <div className="animate-rise relative max-h-[94vh] w-full max-w-3xl overflow-hidden rounded-t-2xl border border-cream/12 bg-espresso-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,1)] sm:max-h-[88vh] md:rounded-2xl">
        {step === "success" ? (
          <div className="flex flex-col items-center px-8 py-16 text-center md:py-20">
            <div className="animate-stamp grid h-24 w-24 place-items-center rounded-full border-[3px] border-sage text-sage">
              <CheckIcon className="text-4xl" strokeWidth={2.2} />
            </div>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-caramel">
              Order {orderNo} · confirmed
            </p>
            <h3 className="mt-3 font-display text-3xl font-medium md:text-4xl">
              The beans are <em className="font-light italic text-honey">yours.</em>
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-latte">
              A confirmation is on its way to <span className="font-bold text-cream">{form.email || "your inbox"}</span>.
              Your coffee enters Tuesday's roast queue and ships rested — within 72 hours of the drop.
            </p>
            <button
              onClick={onClose}
              className="mt-9 rounded-full bg-caramel px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-espresso-950 transition-all hover:-translate-y-0.5 hover:bg-honey"
            >
              Back to the roastery
            </button>
          </div>
        ) : (
          <div className="warm-scroll grid max-h-[94vh] overflow-y-auto sm:max-h-[88vh] md:grid-cols-[1fr_1.25fr]">
            {/* summary */}
            <aside className="border-b border-cream/10 bg-espresso-850/60 p-6 md:border-b-0 md:border-r md:p-7">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.26em] text-mocha">Order summary</h3>
              <ul className="mt-4 space-y-3.5">
                {snapshot.map(({ product, qty }) => (
                  <li key={product.id} className="flex items-center gap-3">
                    <img src={product.image} alt="" className="h-12 w-10 shrink-0 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-cream">{product.name}</p>
                      <p className="tnum text-[11px] text-mocha">
                        {qty} × {fmt(product.price)}
                      </p>
                    </div>
                    <span className="tnum text-sm font-bold text-latte">{fmt(product.price * qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t border-cream/10 pt-4 text-sm">
                <p className="flex justify-between text-latte">
                  <span>Subtotal</span>
                  <span className="tnum">{fmt(snapTotal)}</span>
                </p>
                <p className="flex justify-between text-latte">
                  <span className="flex items-center gap-1.5">
                    <TruckIcon className="text-caramel" /> Shipping
                  </span>
                  <span className={`tnum ${shipping === 0 ? "font-bold text-sage" : ""}`}>
                    {shipping === 0 ? "Free" : fmt(shipping)}
                  </span>
                </p>
                <p className="flex justify-between border-t border-cream/10 pt-3 text-base font-bold text-cream">
                  <span>Total</span>
                  <span className="tnum font-display text-xl text-honey">{fmt(total)}</span>
                </p>
              </div>
              <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-mocha">
                <BeanIcon className="mt-0.5 shrink-0 text-caramel" />
                Demo checkout — no real payment is processed, only very real enthusiasm.
              </p>
            </aside>

            {/* form */}
            <div className="p-6 md:p-7">
              <div className="flex items-center gap-4">
                {stepDot(1, "Details")}
                <span className="h-px w-6 bg-cream/15" />
                {stepDot(2, "Payment")}
              </div>

              {processing ? (
                <div className="flex flex-col items-center py-20 text-center">
                  <BeanIcon className="animate-spin text-4xl text-caramel" />
                  <h3 className="mt-6 font-display text-2xl">Reserving your batch…</h3>
                  <p className="mt-2 text-sm text-mocha">Etta is writing your name on the bag.</p>
                </div>
              ) : step === "details" ? (
                <div className="mt-6">
                  <h3 className="font-display text-2xl">Where's it headed?</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-mocha">
                    {isCustomer
                      ? `Signed in as ${currentUser!.name} — we'll save these details to your profile.`
                      : "Checking out as a guest — create an account from the header any time."}
                  </p>
                  <div className="mt-5 space-y-4">
                    <Field label="Full name" placeholder="June Kettle" value={form.name} error={errors.name} onChange={(e) => set("name")(e.target.value)} />
                    <Field label="Email" type="email" placeholder="june@kettle.coffee" value={form.email} error={errors.email} onChange={(e) => set("email")(e.target.value)} />
                    <Field label="Street address" placeholder="1140 SE Ankeny St" value={form.address} error={errors.address} onChange={(e) => set("address")(e.target.value)} />
                    <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                      <Field label="City" placeholder="Portland" value={form.city} error={errors.city} onChange={(e) => set("city")(e.target.value)} />
                      <Field label="ZIP" placeholder="97214" value={form.zip} error={errors.zip} onChange={(e) => set("zip")(e.target.value)} />
                    </div>
                  </div>
                  <button
                    onClick={() => validDetails() && setStep("payment")}
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-caramel py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-espresso-950 transition-all hover:bg-honey"
                  >
                    Continue to payment
                    <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="font-display text-2xl">Settle up</h3>
                  <div className="mt-5 space-y-4">
                    <Field label="Name on card" placeholder="June Kettle" value={form.cardName} error={errors.cardName} onChange={(e) => set("cardName")(e.target.value)} />
                    <Field
                      label="Card number"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={form.card}
                      error={errors.card}
                      onChange={(e) =>
                        set("card")(
                          e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ")
                        )
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Expiry"
                        placeholder="MM/YY"
                        value={form.exp}
                        error={errors.exp}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                          set("exp")(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                        }}
                      />
                      <Field
                        label="CVC"
                        inputMode="numeric"
                        placeholder="123"
                        value={form.cvc}
                        error={errors.cvc}
                        onChange={(e) => set("cvc")(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setStep("details")}
                      className="rounded-full border border-cream/20 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-latte transition-colors hover:border-caramel/60 hover:text-honey"
                    >
                      Back
                    </button>
                    <button
                      onClick={submitOrder}
                      className="flex-1 rounded-full bg-caramel py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-espresso-950 transition-all hover:bg-honey hover:shadow-[0_12px_30px_-10px_rgba(217,154,78,0.6)]"
                    >
                      Place order · <span className="tnum">{fmt(total)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
