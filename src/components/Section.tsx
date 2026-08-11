import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Shared section chrome: consistent rhythm, eyebrow label, and heading scale.
 *
 * `tone` owns the banding. It used to be a wrapper each caller added by hand,
 * which made the alternation invisible until you read every section file and
 * easy to break when one was removed. Bands must alternate — two adjacent
 * sunken blocks merge into one, and so do a sunken section and the footer.
 * The running order is in page.tsx.
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  tone = "plain",
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  tone?: "plain" | "sunken";
  className?: string;
}) {
  const body = (
    <section
      id={id}
      // Keep in step with the hero's pb-*: together they set the gap between
      // sections. It wants to stay clearly larger than the mt-* below, which
      // is the biggest gap inside a section — that contrast is what keeps
      // sections reading as separate blocks.
      className={`mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20 ${className}`}
    >
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-6 max-w-3xl text-[clamp(1.875rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
          {title}
        </h2>
        {lede ? (
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
            {lede}
          </p>
        ) : null}
      </Reveal>
      <div className="mt-12 sm:mt-16">{children}</div>
    </section>
  );

  if (tone === "sunken") {
    return <div className="border-y border-edge bg-sunken">{body}</div>;
  }
  return body;
}
