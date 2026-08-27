import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import {
  ArrowIcon,
  BeanIcon,
  CartIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  LogOutIcon,
  ShieldIcon,
  UserIcon,
} from "./Icons";
import { fmt } from "../data/products";
import { useEscape, useLockBody } from "../lib/hooks";
import { fmtDateTime, ROLE_LABEL, useData, type Role } from "../lib/store";

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
}

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

const statusPill: Record<string, string> = {
  pending: "border-honey/50 bg-honey/10 text-honey",
  roasting: "border-clay/60 bg-clay/10 text-[#e58a63]",
  shipped: "border-caramel/50 bg-caramel/10 text-caramel",
  delivered: "border-sage/50 bg-sage/10 text-sage",
  cancelled: "border-cream/15 bg-cream/5 text-mocha",
  confirmed: "border-sage/50 bg-sage/10 text-sage",
  declined: "border-cream/15 bg-cream/5 text-mocha",
};

const avatarTone: Record<Role, string> = {
  admin: "bg-caramel text-espresso-950",
  manager: "bg-honey/80 text-espresso-950",
  staff: "bg-espresso-700 text-cream",
  customer: "bg-caramel/20 text-honey",
};

export default function AccountModal({ open, onClose }: AccountModalProps) {
  const { currentUser, login, logout, register, updateUser, orders, reservations } = useData();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profile, setProfile] = useState({ name: "", email: "", address: "", city: "", zip: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  useLockBody(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (!open) return;
    setTab("signin");
    setForm({ name: "", email: "", password: "" });
    setErrors({});
    setFormError("");
    setSaved(false);
    if (currentUser && currentUser.role === "customer") {
      setProfile({
        name: currentUser.name,
        email: currentUser.email,
        address: currentUser.address ?? "",
        city: currentUser.city ?? "",
        zip: currentUser.zip ?? "",
      });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  /* ---------------- signed-out: auth ---------------- */
  if (!currentUser) {
    const submit = (e: FormEvent) => {
      e.preventDefault();
      const errs: Record<string, string> = {};
      if (tab === "register" && form.name.trim().length < 2) errs.name = "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email needed";
      if (form.password.length < 6) errs.password = "Min 6 characters";
      setErrors(errs);
      if (Object.keys(errs).length) return;

      if (tab === "signin") {
        const u = login(form.email, form.password);
        if (!u) return setFormError("No account matches that email and password.");
        onClose();
      } else {
        const res = register(form);
        if (res.error) return setFormError(res.error);
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Account">
        <button className="absolute inset-0 cursor-default bg-espresso-950/85 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
        <div className="animate-rise relative w-full max-w-md overflow-hidden rounded-t-2xl border border-cream/12 bg-espresso-900 p-7 shadow-[0_50px_120px_-30px_rgba(0,0,0,1)] sm:rounded-2xl md:p-8">
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-cream/15 text-latte transition-all hover:rotate-90 hover:border-caramel/60 hover:text-cream">
            <CloseIcon />
          </button>

          <BeanIcon className="text-3xl text-caramel" />
          <h3 className="mt-3 font-display text-3xl font-medium leading-tight">
            Your corner of <em className="font-light italic text-honey">the bar.</em>
          </h3>
          <p className="mt-2 text-sm text-latte">
            Save your details, track roasts and book tables under your name.
          </p>

          <div className="mt-6 flex rounded-full border border-cream/15 p-1">
            {(["signin", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setErrors({});
                  setFormError("");
                }}
                className={`flex-1 rounded-full py-2 text-xs font-extrabold uppercase tracking-[0.14em] transition-all duration-300 ${
                  tab === t ? "bg-caramel text-espresso-950" : "text-mocha hover:text-latte"
                }`}
              >
                {t === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3.5">
            {tab === "register" && (
              <Field label="Full name" placeholder="June Kettle" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            )}
            <Field label="Email" type="email" placeholder="june@kettle.coffee" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Field label="Password" type="password" placeholder="••••••••" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

            {formError && (
              <p className="rounded-lg border border-clay/50 bg-clay/10 px-4 py-2.5 text-[13px] font-semibold text-[#e58a63]">{formError}</p>
            )}

            <button type="submit" className="w-full rounded-full bg-caramel py-3.5 text-sm font-extrabold uppercase tracking-[0.14em] text-espresso-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-honey">
              {tab === "signin" ? "Sign in" : "Create my account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-mocha">
            <span className="h-px flex-1 bg-cream/10" /> or <span className="h-px flex-1 bg-cream/10" />
          </div>

          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-cream/20 py-3.5 text-sm font-bold text-latte transition-colors hover:border-caramel/60 hover:text-honey"
          >
            <UserIcon /> Continue as guest
          </button>
          <p className="mt-3 text-center text-[11.5px] leading-relaxed text-mocha">
            Guests check out with just the basics — name and address, no account needed.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- signed-in: staff roles ---------------- */
  if (currentUser.role !== "customer") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Account">
        <button className="absolute inset-0 cursor-default bg-espresso-950/85 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
        <div className="animate-rise relative w-full max-w-sm overflow-hidden rounded-t-2xl border border-cream/12 bg-espresso-900 p-8 text-center shadow-[0_50px_120px_-30px_rgba(0,0,0,1)] sm:rounded-2xl">
          <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full font-display text-xl font-bold ${avatarTone[currentUser.role]}`}>
            {currentUser.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </span>
          <h3 className="mt-4 font-display text-2xl font-medium">{currentUser.name}</h3>
          <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-caramel">
            {ROLE_LABEL[currentUser.role]}
          </p>
          <p className="mt-3 text-sm text-latte">Staff accounts manage the roastery from the console.</p>
          <a
            href="#/admin"
            onClick={onClose}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-caramel py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-espresso-950 transition-colors hover:bg-honey"
          >
            <ShieldIcon /> Open Back of House
          </a>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-cream/20 py-3 text-sm font-bold text-latte transition-colors hover:border-clay/60 hover:text-[#e58a63]"
          >
            <LogOutIcon /> Sign out
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- signed-in: customer ---------------- */
  const myOrders = orders.filter((o) => o.userId === currentUser.id);
  const myBookings = reservations.filter(
    (r) => r.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const saveProfile = () => {
    updateUser(currentUser.id, {
      name: profile.name.trim() || currentUser.name,
      email: profile.email.trim() || currentUser.email,
      address: profile.address,
      city: profile.city,
      zip: profile.zip,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Your account">
      <button className="absolute inset-0 cursor-default bg-espresso-950/85 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="animate-rise relative max-h-[94vh] w-full max-w-xl overflow-hidden rounded-t-2xl border border-cream/12 bg-espresso-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,1)] sm:max-h-[88vh] sm:rounded-2xl">
        <div className="warm-scroll max-h-[94vh] overflow-y-auto sm:max-h-[88vh]">
          <div className="flex items-center gap-4 border-b border-cream/10 p-6 md:px-8">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-lg font-bold ${avatarTone.customer}`}>
              {currentUser.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-2xl font-medium">{currentUser.name}</h3>
              <p className="truncate text-sm text-mocha">{currentUser.email}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream/15 text-latte transition-all hover:rotate-90 hover:border-caramel/60 hover:text-cream">
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-8 p-6 md:px-8 md:py-8">
            {/* profile + shipping */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-caramel">Profile & shipping</p>
              <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                <Field label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <Field label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                <Field label="Street address" placeholder="1140 SE Ankeny St" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="sm:col-span-2" />
                <Field label="City" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                <Field label="ZIP" value={profile.zip} onChange={(e) => setProfile({ ...profile, zip: e.target.value })} />
              </div>
              <button
                onClick={saveProfile}
                className={`mt-4 flex items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-[0.12em] transition-all duration-300 ${
                  saved
                    ? "bg-sage/20 text-sage"
                    : "bg-caramel text-espresso-950 hover:bg-honey"
                }`}
              >
                {saved ? (
                  <>
                    <CheckIcon /> Saved
                  </>
                ) : (
                  "Save details"
                )}
              </button>
              <p className="mt-2 text-[11.5px] text-mocha">Checkout pre-fills from here.</p>
            </section>

            {/* orders */}
            <section>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-caramel">
                <CartIcon /> Your roasts
              </p>
              {myOrders.length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-cream/15 px-4 py-5 text-center text-sm text-mocha">
                  No orders yet — your first bag will show up here.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-cream/8 rounded-lg border border-cream/10">
                  {myOrders.slice(0, 6).map((o) => (
                    <li key={o.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="tnum text-sm font-bold text-cream">{o.number}</p>
                        <p className="text-[11.5px] text-mocha">
                          {o.items.reduce((n, i) => n + i.qty, 0)} bags · {fmtDateTime(o.createdAt)}
                        </p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${statusPill[o.status]}`}>
                        {o.status}
                      </span>
                      <span className="tnum text-sm font-bold text-latte">{fmt(o.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* bookings */}
            <section>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-caramel">
                <ClockIcon /> Your tables
              </p>
              {myBookings.length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-cream/15 px-4 py-5 text-center text-sm text-mocha">
                  No reservations under this email yet.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-cream/8 rounded-lg border border-cream/10">
                  {myBookings.slice(0, 5).map((r) => (
                    <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="tnum text-sm font-bold text-cream">
                          {r.code} · Table {r.tableName}
                        </p>
                        <p className="text-[11.5px] text-mocha">{r.date} at {r.time} · party of {r.party}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${statusPill[r.status]}`}>
                        {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <a
              href="#reserve"
              onClick={onClose}
              className="group flex items-center justify-center gap-2 rounded-full border border-cream/20 py-3.5 text-sm font-bold text-latte transition-colors hover:border-caramel/60 hover:text-honey"
            >
              Book a table <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-cream/15 py-3.5 text-sm font-bold text-mocha transition-colors hover:border-clay/60 hover:text-[#e58a63]"
            >
              <LogOutIcon /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
