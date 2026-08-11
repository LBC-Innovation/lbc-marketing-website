"use client";

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

  // Drives the bar's own chrome only; the logo's travel is handled by
  // <BrandLockup />, which reads scroll position directly.
  const compact = scrolled || menuOpen;

  // The mobile sheet covers the page, so the body behind it must not scroll.
  // The flag additionally tells <BrandLockup /> to dock: it is fixed and sits
  // above the header, so at the top of the page the full-size logo would
  // otherwise render on top of the open sheet's links.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    document.documentElement.dataset.menuOpen = String(menuOpen);
    window.dispatchEvent(new Event("brand:refresh"));
    return () => {
      document.body.style.overflow = "";
      delete document.documentElement.dataset.menuOpen;
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
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        {/* The logo itself is <BrandLockup />, which is fixed and overlays this
            spot so it can travel here from the hero. This reserves its space
            and is the measurement target for where it lands. */}
        <div
          id="brand-slot-nav"
          aria-hidden="true"
          className="h-11 w-[7.5rem] sm:h-12 sm:w-[10rem]"
        />

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
