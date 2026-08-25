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
      title="Get in touch."
      lede="Book a call if you already know what you need. Or send a note and we'll go from there."
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
                Ready to talk
              </p>
              <p className="mt-3 flex items-center gap-2 text-lg font-semibold tracking-tight">
                Book a 30-minute call
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
                Thirty minutes. No slides. Tell us what you&rsquo;re up against.
              </p>
            </a>

            <div className="rounded-2xl border border-edge p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Email
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
              Not sure yet? Write it here.
            </p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
