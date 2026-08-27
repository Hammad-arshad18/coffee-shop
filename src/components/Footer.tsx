import { useState, type FormEvent } from "react";
import { ArrowIcon, BeanIcon, CheckIcon, ClockIcon, LogoMark, MailIcon, PinIcon } from "./Icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setDone(true);
  };

  return (
    <footer id="visit" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-caramel/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          {/* brand */}
          <div className="md:col-span-4">
            <a href="#top" className="group inline-flex items-center gap-2.5">
              <LogoMark className="text-caramel text-[30px] transition-transform duration-500 group-hover:rotate-12" />
              <span className="leading-none">
                <span className="block font-display text-2xl font-semibold tracking-tight">Cinder</span>
                <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.42em] text-mocha">
                  Roastery · PDX
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-latte">
              A twelve-kilo micro-roastery roasting to order since 2016. Small fire, slow hands,
              serious coffee.
            </p>
            <p className="mt-5 flex items-start gap-2.5 text-sm text-latte">
              <ClockIcon className="mt-0.5 shrink-0 text-caramel" />
              <span>
                Cupping bar open
                <br />
                Tue–Sat · 7:00–15:00
              </span>
            </p>
          </div>

          {/* visit */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-caramel">Find the fire</h3>
            <ul className="mt-5 space-y-3.5 text-sm text-latte">
              <li className="flex items-start gap-2.5">
                <PinIcon className="mt-0.5 shrink-0 text-caramel" />
                <span>
                  1140 SE Ankeny St
                  <br />
                  Portland, OR 97214
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="shrink-0 text-caramel" />
                <a href="mailto:hello@cinderroastery.com" className="link-ember hover:text-cream transition-colors">
                  hello@cinderroastery.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <BeanIcon className="shrink-0 text-caramel" />
                <span>Tours every Saturday, 10:00</span>
              </li>
            </ul>
          </div>

          {/* links */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-caramel">Roastery</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { label: "Shop roasts", href: "#shop" },
                { label: "The roast log", href: "#story" },
                { label: "Back to top", href: "#top" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-ember group inline-flex items-center gap-2 text-latte transition-colors hover:text-cream">
                    {l.label}
                    <ArrowIcon className="text-xs text-caramel opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-caramel">First pour, on us</h3>
            <p className="mt-5 text-sm leading-relaxed text-latte">
              Roast-day notes, new lots, and a free cup the next time you visit the bar.
            </p>
            {done ? (
              <p className="mt-4 flex items-center gap-2.5 rounded-lg border border-sage/40 bg-sage/10 px-4 py-3 text-sm font-bold text-sage">
                <CheckIcon /> You're on the list — see you Tuesday.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-4">
                <div
                  className={`flex overflow-hidden rounded-full border transition-colors ${
                    invalid ? "border-clay/70" : "border-cream/15 focus-within:border-caramel/70"
                  }`}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setInvalid(false);
                    }}
                    placeholder="you@morning.coffee"
                    aria-label="Email for newsletter"
                    className="w-full bg-espresso-900 px-4 py-3 text-sm text-cream outline-none placeholder:text-mocha/70"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="grid w-12 shrink-0 place-items-center bg-caramel text-espresso-950 transition-colors hover:bg-honey"
                  >
                    <ArrowIcon />
                  </button>
                </div>
                {invalid && <p className="mt-2 text-[11px] font-semibold text-clay">That email doesn't look brewed — try again.</p>}
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-7 text-[11.5px] text-mocha md:flex-row">
          <p>© 2026 Cinder Roastery. Roasted with patience in Portland, OR.</p>
          <p className="flex items-center gap-2">
            <BeanIcon className="text-caramel" />
            No beans were rushed in the making of this coffee.
          </p>
        </div>
      </div>
    </footer>
  );
}
