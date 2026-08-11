import Image from "next/image";
import { getProjects, type ProjectStatus } from "@/lib/content";
import { ProjectThumb } from "./ProjectThumb";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const statusStyles: Record<ProjectStatus, string> = {
  Building: "border-rose/45 text-accent",
  Exploring: "border-coral/50 text-accent",
  Researching: "border-edge-strong text-muted",
};

export async function Currently() {
  const projects = await getProjects();

  return (
    <Section
      id="currently"
      eyebrow="Currently"
      title="What's on the bench."
      lede="No case-study theater. This is what is actually being built, poked at, and read about right now — which says more about how the work goes than a finished logo wall would."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 90}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-bg transition-colors hover:border-edge-strong">
              <div className="relative aspect-[16/10] overflow-hidden bg-sunken">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <ProjectThumb slug={project.slug} />
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                  {project.isPlaceholder ? (
                    <span className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      Sample
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                  {project.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
