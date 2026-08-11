import { getServices } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export async function Services() {
  const services = await getServices();

  return (
    <Section
      id="services"
      eyebrow="How we work together"
      title="Three ways in."
      lede="Different shapes for different problems. The common thread is that each one ends in something running, not something presented."
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal as="li" key={service.id} delay={i * 90}>
            <article className="flex h-full flex-col bg-bg p-7 transition-colors hover:bg-elevated sm:p-9">
              <span className="font-mono text-xs font-medium tracking-[0.18em] text-rose">
                {service.index}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight sm:text-[1.375rem]">
                {service.title}
              </h3>
              <p className="mt-3 text-[15px] font-medium leading-snug text-ink/85">
                {service.promise}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {service.body}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
