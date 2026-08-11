import { getPrinciples } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export async function Approach() {
  const principles = await getPrinciples();

  return (
    <Section
      id="approach"
      eyebrow="Approach"
      tone="sunken"
      title={
        <>
          A chat box in the corner is a feature.{" "}
          <span className="text-muted">
            Rebuilding the workflow around what a model can now do is a product.
          </span>
        </>
      }
    >
      <ol className="grid gap-10 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-14">
        {principles.map((principle, i) => (
          <Reveal as="li" key={principle.id} delay={i * 80}>
            <div className="h-px w-full rule-gradient" />
            <h3 className="mt-5 text-lg font-semibold tracking-tight sm:text-xl">
              {principle.title}
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
              {principle.body}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
