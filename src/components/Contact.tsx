import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      tone="sunken"
      title="Start a conversation."
      lede="Two doors, depending on how formed the idea is. Neither one obligates you to anything."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <div className="space-y-6">
            <a
              href={site.calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-edge bg-elevated p-6 transition-colors hover:border-edge-strong"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                If you already know
              </p>
              <p className="mt-3 flex items-center gap-2 text-lg font-semibold tracking-tight">
                Book a 30-minute intro
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Pick a time. No deck, no pitch — a conversation about what you
                are trying to do.
              </p>
            </a>

            <div className="rounded-2xl border border-edge p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Or just email
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 block text-[15px] text-accent underline decoration-1 underline-offset-4 transition-colors hover:text-accent-hover"
              >
                {site.email}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-2xl border border-edge bg-elevated p-6 sm:p-8">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              If it is still fuzzy
            </p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
