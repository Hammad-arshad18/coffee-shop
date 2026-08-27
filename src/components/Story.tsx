import { ClockIcon, LeafIcon, ThermoIcon, TruckIcon } from "./Icons";
import { Reveal } from "./Reveal";

const STATS = [
  { v: "12 kg", k: "Max batch size" },
  { v: "27", k: "Partner farms" },
  { v: "48 h", k: "Rest before shipping" },
  { v: "72 h", k: "Roast to your door" },
];

const STEPS = [
  {
    icon: <LeafIcon />,
    n: "01",
    title: "Source",
    text: "Direct contracts with twenty-seven farms we visit and can name. We pay 2–3× the commodity price and publish what we pay, every lot.",
  },
  {
    icon: <ThermoIcon />,
    n: "02",
    title: "Profile",
    text: "Every batch is curve-logged on our 12-kilo drum roaster — charge, turn, first crack, drop. If a curve drifts, the batch becomes staff coffee.",
  },
  {
    icon: <ClockIcon />,
    n: "03",
    title: "Rest",
    text: "Fresh isn't a flex if it's gassy. Beans rest 48 hours so CO₂ settles and the cup opens up before the bag ever leaves the building.",
  },
  {
    icon: <TruckIcon />,
    n: "04",
    title: "Ship",
    text: "Sealed in compostable bags with the roast date stamped on the seam. Within 72 hours of the drop, it's on your porch.",
  },
];

export default function Story() {
  return (
    <section id="story" className="relative scroll-mt-24 border-y border-cream/10 bg-espresso-900/50">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        {/* sticky intro column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-caramel">
              <span className="h-px w-8 bg-caramel/60" />
              The roast log
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-[3.2rem]">
              Twelve kilos
              <br />
              at a time.
              <br />
              <em className="font-light italic text-honey">Never more.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-latte">
              Big roasters optimize for throughput. We optimize for the twelve minutes a batch
              spends in the drum — and every hour after. This is the whole process, no romance
              removed.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <dl className="mt-10 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-xl border border-cream/10 bg-cream/10">
              {STATS.map((s) => (
                <div key={s.k} className="flex flex-col bg-espresso-900 p-5 transition-colors duration-300 hover:bg-espresso-850">
                  <dt className="order-2 mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-mocha">
                    {s.k}
                  </dt>
                  <dd className="tnum font-display text-3xl text-honey">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* steps column */}
        <div>
          <ol className="relative space-y-10 border-l border-cream/12 pl-8 md:pl-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <li className="group relative">
                  <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border border-caramel/60 bg-espresso-950 transition-all duration-300 group-hover:scale-125 group-hover:bg-caramel md:-left-[49px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-caramel transition-colors group-hover:bg-espresso-950" />
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg border border-cream/12 bg-espresso-850 text-xl text-caramel transition-all duration-300 group-hover:border-caramel/50 group-hover:text-honey">
                      {s.icon}
                    </span>
                    <div>
                      <p className="tnum text-[10px] font-extrabold uppercase tracking-[0.3em] text-mocha">
                        Step {s.n}
                      </p>
                      <h3 className="font-display text-2xl text-cream">{s.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3.5 max-w-lg leading-relaxed text-latte">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200}>
            <blockquote className="relative mt-14 rounded-xl border border-cream/10 bg-espresso-850/60 p-7 md:p-9">
              <span className="absolute -top-5 left-7 font-display text-7xl leading-none text-caramel/40">“</span>
              <p className="font-display text-xl font-light italic leading-relaxed text-cream md:text-2xl">
                Coffee is patient. Twelve minutes in the drum, two days on the shelf, three days in
                the post — and it still waits for your kettle.
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <span className="h-px w-8 bg-caramel/60" />
                <cite className="text-[11px] font-bold uppercase not-italic tracking-[0.24em] text-caramel">
                  Etta Kline · Head roaster
                </cite>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
