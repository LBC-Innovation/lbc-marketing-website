import Image from "next/image";
import { site } from "@/lib/site";

const socials = [
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "GitHub", href: site.social.github },
].filter((s): s is { label: string; href: string } => Boolean(s.href));

export function Footer() {
  return (
    <footer className="border-t border-edge bg-sunken">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {/* The full lockup gets its one appearance here, at a size where
                the wordmark is actually legible. */}
            <Image
              src="/logo/lbci-logo.png"
              alt={`${site.name} logo`}
              width={1019}
              height={758}
              className="h-24 w-auto dark:hidden"
            />
            <Image
              src="/logo/lbci-logo-dark.png"
              alt={`${site.name} logo`}
              width={1019}
              height={758}
              className="hidden h-24 w-auto dark:block"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              {site.legalName}. {site.tagline}
            </p>
          </div>

          <div className="flex gap-12 sm:gap-20">
            <nav aria-label="Footer">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Sections
              </h2>
              <ul className="mt-4 space-y-2.5">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Elsewhere
              </h2>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    Email
                  </a>
                </li>
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-edge pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Limitless · Bounds · Creative
          </p>
        </div>
      </div>
    </footer>
  );
}
