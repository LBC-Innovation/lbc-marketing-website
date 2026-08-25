import Image from "next/image";
import Link from "next/link";
import { getProjects, type Project, type ProjectStatus } from "@/lib/content";
import { ProjectThumb } from "./ProjectThumb";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const statusStyles: Record<ProjectStatus, string> = {
  Building: "border-rose/45 text-accent",
  Exploring: "border-coral/50 text-accent",
  Researching: "border-edge-strong text-muted",
};

function CardMedia({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-sunken">
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <ProjectThumb slug={project.slug} />
      )}
    </div>
  );
}

function CardBody({ project }: { project: Project }) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        {project.comingSoon ? (
          <span className="rounded-full bg-sunken px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            On the desk
          </span>
        ) : (
          <span
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${statusStyles[project.status]}`}
          >
            {project.status}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        {project.title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
        {project.description}
      </p>
    </div>
  );
}

export async function Currently() {
  const projects = await getProjects();

  return (
    <Section
      id="currently"
      eyebrow="In progress"
      title="What we're working on."
      lede="What's on the desk. Two of these are far enough along to write about."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 90}>
            {project.comingSoon ? (
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-edge bg-bg">
                <CardMedia project={project} />
                <CardBody project={project} />
              </article>
            ) : (
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-bg transition-colors hover:border-edge-strong">
                <Link
                  href={`/projects/${project.slug}`}
                  className="flex h-full flex-col"
                >
                  <CardMedia project={project} />
                  <CardBody project={project} />
                </Link>
              </article>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
