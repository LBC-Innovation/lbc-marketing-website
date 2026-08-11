"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The logo, rendered once, travelling from the hero into the nav as you scroll.
 *
 * It lives in a fixed wrapper that carries the *same* container classes as the
 * nav and the hero (`mx-auto max-w-6xl px-5 sm:px-8`), which means both resting
 * places share an identical left edge. The horizontal delta is therefore always
 * zero and the animation reduces to translateY plus scale — one composited
 * transform, no layout work per frame.
 *
 * Progress is mapped so the lockup travels at exactly scroll speed: it appears
 * pinned to the page while it shrinks, then parks in the nav. Two empty
 * elements, #brand-slot-hero and #brand-slot-nav, reserve the space and are the
 * measurement targets, so the geometry follows the layout instead of
 * duplicating its numbers here.
 */
export function BrandLockup() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    const navSlot = document.getElementById("brand-slot-nav");
    const heroSlot = document.getElementById("brand-slot-hero");
    if (!el || !navSlot || !heroSlot) return;

    const root = document.documentElement;
    let startY = 0;
    let endY = 0;
    let endScale = 1;
    let naturalHeight = 0;
    let naturalWidth = 0;
    let dockedCenter = 0;
    let queued = 0;

    const apply = () => {
      queued = 0;
      const travel = Math.max(startY - endY, 1);
      // An open mobile sheet pins the lockup to the nav regardless of scroll.
      const p =
        root.dataset.menuOpen === "true"
          ? 1
          : Math.min(1, Math.max(0, window.scrollY / travel));
      const y = startY + (endY - startY) * p;
      const scale = 1 + (endScale - 1) * p;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

      // Derive the offset from the logo's actual centre rather than lerping it:
      // the centre moves non-linearly because the scale is changing too, and
      // the nav must stay level with it the whole way down.
      const centre = y + (naturalHeight * scale) / 2;
      root.style.setProperty("--nav-offset", `${(centre - dockedCenter).toFixed(2)}px`);

      // The slot tracks the logo's current width so the bar's justify-between
      // distributes around the real footprint. This does reflow the header row
      // per frame, but a transform cannot buy space: shifting the links clear
      // of the expanded logo only drove them into the buttons instead. The
      // reflow is one flex row inside a fixed element, so it stays off the
      // page's layout path.
      root.style.setProperty("--brand-slot-w", `${(naturalWidth * scale).toFixed(2)}px`);

      // The bar only materialises as the logo finishes docking; fading it in
      // from the first pixel of scroll reads as muddy.
      const chrome = Math.min(1, Math.max(0, (p - 0.72) / 0.28));
      root.style.setProperty("--brand-chrome", chrome.toFixed(3));
    };

    const measure = () => {
      // Measure the lockup at its natural size, then restore the transform in
      // the same frame so nothing is painted untransformed.
      const previous = el.style.transform;
      el.style.transform = "none";
      const self = el.getBoundingClientRect();
      const nav = navSlot.getBoundingClientRect();
      const hero = heroSlot.getBoundingClientRect();
      el.style.transform = previous;

      // The nav is fixed, so its rect is already in viewport space. The hero
      // slot is in flow, so it needs converting to document space.
      startY = hero.top + window.scrollY;
      endY = nav.top;
      naturalHeight = self.height;
      naturalWidth = self.width;
      endScale = self.height > 0 ? nav.height / self.height : 1;
      // The slot is centred in the bar, so its centre is where the logo lands
      // and equally what the nav contents must line up with.
      dockedCenter = nav.top + nav.height / 2;
      apply();
    };

    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(apply);
    };

    measure();
    el.dataset.ready = "true";

    // Scroll-driven frames must not be eased or they lag the scroll position,
    // so the transition is switched on only for this discrete state change.
    let easeOff = 0;
    const onRefresh = () => {
      root.dataset.brandEased = "true";
      window.clearTimeout(easeOff);
      easeOff = window.setTimeout(() => delete root.dataset.brandEased, 340);
      apply();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("brand:refresh", onRefresh);
    // Web fonts change the wordmark's metrics, which changes the lockup height
    // the scale is derived from.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      if (queued) cancelAnimationFrame(queued);
      window.clearTimeout(easeOff);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("brand:refresh", onRefresh);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <a
          ref={ref}
          href="#top"
          aria-label="LBC Innovation — back to top"
          // The inline transform is the pre-hydration position: --brand-hero-y
          // mirrors the hero's top padding so the lockup renders in the right
          // place before the effect runs. JS replaces it with measured values.
          style={{ transform: "translate3d(0, var(--brand-hero-y), 0)" }}
          className="brand-follow pointer-events-auto inline-flex origin-top-left items-center gap-3 will-change-transform md:gap-4 xl:gap-5"
        >
          {/* The size steps are md/xl rather than sm/lg: expanded, the lockup
              shares the bar with the links and buttons, and stepping up at the
              same breakpoints they appear at left no gap between them. */}
          <Image
            src="/logo/lbci-mark.png"
            alt=""
            width={512}
            height={512}
            priority
            className="size-20 md:size-24 xl:size-28"
          />
          {/* Tracking is in em so it scales with the type under transform. */}
          <span className="text-[15px] uppercase tracking-[0.3em] text-ink md:text-[22px] xl:text-[26px]">
            Innovation
          </span>
        </a>
      </div>
    </div>
  );
}
