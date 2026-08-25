import Image from "next/image";
import Link from "next/link";
import type { Project, ProjectStatus } from "@/lib/content";
import { site } from "@/lib/site";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { Reveal } from "./Reveal";

const statusStyles: Record<ProjectStatus, string> = {
  Building: "border-rose/45 text-accent",
  Exploring: "border-coral/50 text-accent",
  Researching: "border-edge-strong text-muted",
};

export function ProjectDetail({ project }: { project: Project }) {
  const story = project.story ?? [];
  const demonstrates = project.demonstrates ?? [];
  const stack = project.stack ?? [];

  return (
    <>
      <Nav solid />
      <main id="top">
        <article>
          <header className="mx-auto max-w-6xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
            <Reveal>
              <p className="eyebrow">In progress</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${statusStyles[project.status]}`}
                >
                  {project.status}
                </span>
              </div>
              <h1 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
                {project.description}
              </p>
            </Reveal>
          </header>

          {project.image ? (
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
              <Reveal>
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-edge bg-sunken sm:aspect-[2/1]">
                  <Image
                    src={project.image}
                    alt={`${project.title} interface`}
                    fill
                    priority
                    sizes="(min-width: 1152px) 72rem, 92vw"
                    className="object-cover object-top"
                  />
                </div>
              </Reveal>
            </div>
          ) : null}

          {story.length > 0 ? (
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
              <div className="max-w-2xl space-y-5 text-[17px] leading-relaxed text-muted">
                {story.map((paragraph) => (
                  <Reveal key={paragraph.slice(0, 24)}>
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}

          {demonstrates.length > 0 ? (
            <div className="border-y border-edge bg-sunken">
              <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
                <Reveal>
                  <p className="eyebrow">What this shows</p>
                  <h2 className="mt-6 max-w-3xl text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
                    The kind of work this is.
                  </h2>
                </Reveal>
                <ol className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-14">
                  {demonstrates.map((item, i) => (
                    <Reveal as="li" key={item.title} delay={i * 80}>
                      <div className="h-px w-full rule-gradient" />
                      <h3 className="mt-5 text-lg font-semibold tracking-tight sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}

          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
            <Reveal>
              {stack.length > 0 ? (
                <>
                  <p className="eyebrow">Underneath</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {stack.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-edge px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-edge-strong px-6 py-3.5 text-[15px] font-medium transition-colors hover:bg-elevated"
                  >
                    Source on GitHub
                  </a>
                ) : null}
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85"
                >
                  Get in touch
                </Link>
              </div>

              <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-muted">
                This is the kind of work we take on — design it, build it, put
                it in someone&rsquo;s hands. If that&rsquo;s useful,{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink underline decoration-edge-strong underline-offset-4 hover:decoration-ink"
                >
                  say hello
                </a>
                .
              </p>

              <p className="mt-8">
                <Link
                  href="/#currently"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  ← What we&rsquo;re working on
                </Link>
              </p>
            </Reveal>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
