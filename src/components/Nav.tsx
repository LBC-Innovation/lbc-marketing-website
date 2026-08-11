"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Far enough down that the shrink reads as deliberate rather than twitching
  // on the first few pixels of scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The logo opens large and settles to a compact lockup once scrolling starts.
  // Menu-open forces the compact state so a tall header cannot crowd the sheet.
  const compact = scrolled || menuOpen;

  // The mobile sheet covers the page, so the body behind it must not scroll.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        compact
          ? "border-b border-edge bg-bg/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-[height] duration-300 ease-out sm:px-8 ${
          compact ? "h-16 sm:h-20" : "h-20 sm:h-28"
        }`}
      >
        <a
          href="#top"
          // The mark carries the identity alone here, so the link needs an
          // explicit name — there is no longer any text to supply one.
          aria-label="LBC Innovation — back to top"
          className="flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo/lbci-mark.png"
            alt=""
            width={512}
            height={512}
            priority
            className={`transition-[width,height] duration-300 ease-out ${
              compact ? "size-9 sm:size-10" : "size-12 sm:size-[4.25rem]"
            }`}
          />
          {/* The mark supplies the "LBC"; this completes the lockup. Tracking
              is in em, so it scales with the type rather than needing its own
              step. Case mirrors the wordmark in the source logo. */}
          <span
            className={`uppercase tracking-[0.3em] text-ink transition-[font-size] duration-300 ease-out ${
              compact ? "text-[10px] sm:text-xs" : "text-[13px] sm:text-[17px]"
            }`}
          >
            Innovation
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
          >
            Start a conversation
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-edge text-muted md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="size-4"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-edge bg-bg md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-5 py-3">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-edge py-3.5 text-lg tracking-tight"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 block rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-bg"
            >
              Start a conversation
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
