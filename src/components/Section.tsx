import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Shared section chrome: consistent rhythm, eyebrow label, and heading scale.
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-36 ${className}`}
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
}
