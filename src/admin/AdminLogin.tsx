import { useState, type FormEvent } from "react";
import { FlameIcon, LockIcon, LogoMark, ShieldIcon, UserIcon } from "../components/Icons";
import { ROLE_LABEL, useData } from "../lib/store";

const DEMO = [
  { role: "admin" as const, email: "admin@cinder.roast", password: "ember-214", blurb: "Full access · team & roles" },
  { role: "manager" as const, email: "manager@cinder.roast", password: "first-crack", blurb: "Orders, menu & tables · no team" },
  { role: "staff" as const, email: "staff@cinder.roast", password: "slow-pour", blurb: "Pipeline & bookings · read-only menu" },
];

const roleAccent: Record<string, string> = {
  admin: "text-caramel border-caramel/50",
  manager: "text-honey border-honey/50",
  staff: "text-latte border-cream/25",
};

export default function AdminLogin({ notice }: { notice?: "customer" }) {
  const { login, logout } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const u = login(email, password);
    if (!u) {
      setError("Those credentials don't match the roster.");
      return;
    }
    if (u.role === "customer") {
      logout();
      setError("That's a customer account — Back of House needs a staff login.");
    }
  };

  const field =
    "w-full rounded-lg border border-cream/15 bg-espresso-850 py-3 pl-10 pr-3.5 text-sm text-cream outline-none transition-colors placeholder:text-mocha/60 hover:border-cream/25 focus:border-caramel/70";

  return (
    <div className="flex items-center justify-center px-5 py-14 md:py-20">
      <div className="w-full max-w-[920px] overflow-hidden rounded-2xl border border-cream/12 bg-espresso-900 shadow-[0_50px_120px_-40px_rgba(0,0,0,1)] md:grid md:grid-cols-[1fr_1.05fr]">
        {/* roster side */}
        <aside className="border-b border-cream/10 bg-espresso-850/70 p-7 md:border-b-0 md:border-r md:p-9">
          <LogoMark className="text-caramel text-[34px]" />
          <h1 className="mt-5 font-display text-3xl font-medium leading-tight md:text-[2.4rem]">
            The keys to
            <br />
            the <em className="font-light italic text-honey">roastery.</em>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-latte">
            Orders, menu, tables and the reservation book live back here. Access is role-based —
            tap a roster card to fill the form.
          </p>

          <div className="mt-6 space-y-2.5">
            {DEMO.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => {
                  setEmail(d.email);
                  setPassword(d.password);
                  setError("");
                }}
                className={`group flex w-full items-center gap-3.5 rounded-xl border bg-espresso-900/70 px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${roleAccent[d.role]} ${
                  email === d.email ? "border-caramel" : "border-cream/12 hover:border-caramel/50"
                }`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-current/30 bg-espresso-950/60 text-base">
                  {d.role === "admin" ? <ShieldIcon /> : d.role === "manager" ? <FlameIcon /> : <UserIcon />}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-extrabold text-cream">
                    {ROLE_LABEL[d.role]}
                  </span>
                  <span className="block truncate text-[11.5px] text-mocha">{d.blurb}</span>
                  <span className="tnum mt-0.5 block text-[11px] text-mocha/80">
                    {d.email} · {d.password}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* form side */}
        <div className="p-7 md:p-9">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-caramel">Staff access</p>
          <h2 className="mt-2 font-display text-2xl font-medium">Unlock the console</h2>

          {notice === "customer" && (
            <div className="mt-5 rounded-lg border border-honey/40 bg-honey/10 px-4 py-3 text-[13px] font-semibold leading-relaxed text-honey">
              You're signed in as a customer. Back of House needs a staff account — sign in below
              or keep browsing the shop.
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mocha" />
              <input
                className={field}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@cinder.roast"
                aria-label="Email"
              />
            </div>
            <div className="relative">
              <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mocha" />
              <input
                className={field}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-clay/50 bg-clay/10 px-4 py-2.5 text-[13px] font-semibold text-[#e58a63]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-caramel py-3.5 text-sm font-extrabold uppercase tracking-[0.14em] text-espresso-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-honey hover:shadow-[0_16px_36px_-14px_rgba(217,154,78,0.65)]"
            >
              <LockIcon className="transition-transform duration-300 group-hover:-rotate-6" />
              Sign in
            </button>
          </form>

          <p className="mt-5 text-center text-[11.5px] leading-relaxed text-mocha">
            Demo MVP — accounts and sessions live in this browser only.
            <br />
            <a href="#/" className="link-ember font-bold text-latte transition-colors hover:text-honey">
              ← Back to the storefront
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
