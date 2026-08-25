"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The bar's contents ride along with the logo.
 *
 * <BrandLockup /> owns the scroll math and publishes three custom properties:
 * --nav-offset (how far the links and buttons sit below their docked position,
 * kept level with the logo's centre) and --brand-chrome (the bar's background
 * and border, which only materialise as the logo finishes docking). The brand
 * slot deliberately stays outside the transform: it is the measurement target
 * the lockup reads, and moving it would feed its own output back in.
 */
export function Nav({ solid = false }: { solid?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const follows = solid ? "" : "brand-follow";
  const followStyle = solid
    ? undefined
    : { transform: "translate3d(0, var(--nav-offset, 0px), 0)" };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        style={solid ? undefined : { opacity: "var(--brand-chrome, 0)" }}
        className="absolute inset-0 border-b border-edge bg-bg/85 backdrop-blur-xl"
      />

      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        {/* On the homepage the logo is <BrandLockup />, which overlays this
            empty slot as it travels from the hero. Inner pages pass `solid`
            and render the docked lockup here instead. */}
        <div
          id="brand-slot-nav"
          aria-hidden={solid ? undefined : true}
          style={solid ? undefined : { width: "var(--brand-slot-w, 10rem)" }}
          className="h-11 shrink-0 sm:h-12"
        >
          {solid ? (
            <a
              href="/"
              aria-label="LBC Innovation, back to home"
              className="inline-flex h-full items-center gap-2.5 md:gap-3"
            >
              <img
                src="/logo/lbci-mark.svg"
                alt=""
                width={48}
                height={48}
                className="size-11 sm:size-12"
              />
              <span className="text-[13px] uppercase tracking-[0.3em] sm:text-[15px]">
                Innovation
              </span>
            </a>
          ) : null}
        </div>

        <div className={`hidden items-center gap-1 lg:flex ${follows}`} style={followStyle}>
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

        <div className={`flex items-center gap-2.5 ${follows}`} style={followStyle}>
          <ThemeToggle />
          <a
            href="/#contact"
            className="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
          >
            Get in touch
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-edge text-muted lg:hidden"
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
        className="relative border-t border-edge bg-bg lg:hidden"
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
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 block rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-bg"
            >
              Get in touch
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
