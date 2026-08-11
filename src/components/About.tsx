import { site } from "@/lib/site";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const letters = [
  { letter: "L", formal: "Limitless", personal: "Luca" },
  { letter: "B", formal: "Bounds", personal: "Bella" },
  { letter: "C", formal: "Creative", personal: "Carin" },
];

export function About() {
  return (
    <div className="border-y border-edge bg-sunken">
      <Section
        id="about"
        eyebrow="About"
        title={
          <>
            Two readings of the same three letters.{" "}
            <span className="text-muted">Both are true.</span>
          </>
        }
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <dl className="rounded-2xl border border-edge bg-bg p-7 sm:p-8">
              {letters.map(({ letter, formal, personal }) => (
                <div
                  key={letter}
                  className="flex items-baseline gap-5 border-b border-edge py-4 first:pt-0 last:border-0 last:pb-0"
                >
                  <dt className="text-gradient w-6 shrink-0 text-3xl font-semibold tracking-tight">
                    {letter}
                  </dt>
                  <dd className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-[15px] font-medium">{formal}</span>
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
                      {personal}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={100}>
            {/* Capped measure — the grid column is wide enough to run past a
                comfortable line length otherwise. */}
            <div className="max-w-[62ch] space-y-6 text-[17px] leading-relaxed text-muted">
              <p className="text-ink">
                LBC Innovation is {site.legalName}. It is also Luca, Bella, and
                Carin — which is the reason the rest of it has to be worth
                doing.
              </p>
              <p>
                {site.founderName} builds AI-oriented products, leads
                engineering as a fractional CTO, and helps established
                businesses find the efficiency that modern tooling has quietly
                made available. The work runs from product invention to
                distinctly unglamorous operational plumbing, usually in that
                order.
              </p>
              <p>
                This site is a flag in the sand. The shape of the practice is
                still forming — big ideas tend to start as confusion — but the
                direction is clear enough to build from: products that are
                genuinely useful and genuinely new, and businesses that get
                measurably better at what they already do.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
