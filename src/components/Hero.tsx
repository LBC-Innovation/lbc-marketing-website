import { HeroBackdrop } from "./HeroBackdrop";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <HeroBackdrop />

      <div
        style={{ paddingTop: "var(--hero-gap)" }}
        className="relative mx-auto max-w-6xl px-5 pb-14 sm:px-8 sm:pb-16 lg:pb-20"
      >
        {/* Reserves the space <BrandLockup /> occupies at rest, and is the
            measurement target it starts from. */}
        <div
          id="brand-slot-hero"
          aria-hidden="true"
          className="h-20 md:h-24 xl:h-28"
        />

        {/* The margin is --hero-gap less the headline's own leading, so the gap
            you SEE below the logo matches the one above it. Cap height sits
            0.107em below the box top at leading 0.94 (Inter's ascent 0.969em,
            cap 0.727em); expressed against --h1-size it stays correct across
            the whole clamp rather than only at one viewport width. */}
        <h1
          style={{
            fontSize: "var(--h1-size)",
            marginTop: "calc(var(--hero-gap) - 0.107 * var(--h1-size))",
          }}
          className="max-w-4xl font-semibold leading-[0.94] tracking-[-0.04em]"
        >
          AI woven in.
          <br />
          <span className="text-gradient">Not bolted on.</span>
        </h1>

        <p className="mt-8 max-w-xl text-[clamp(1.0625rem,2.2vw,1.3125rem)] leading-relaxed text-muted">
          Most companies are adding AI to the product they already built. The
          more interesting work is imagining the product that assumes it — and
          then actually building the thing.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85"
          >
            Start a conversation
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href={site.calLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-edge-strong px-6 py-3.5 text-[15px] font-medium transition-colors hover:bg-elevated"
          >
            Book an intro call
          </a>
        </div>

        <p className="mt-14 max-w-md border-l-2 border-rose/50 pl-4 text-sm leading-relaxed text-faint sm:mt-20">
          Built for businesses that don&rsquo;t call themselves tech companies —
          where the gains are largest and the least glamorous.
        </p>
      </div>
    </section>
  );
}
