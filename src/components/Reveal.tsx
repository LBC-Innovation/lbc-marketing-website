"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades content up as it enters the viewport.
 *
 * The element ships from the server already in the "pending" state so there is
 * no flash of visible content before the observer attaches. Two escape hatches
 * keep that from trapping anyone: a <noscript> override in the layout, and a
 * prefers-reduced-motion rule in globals.css — both force it visible.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.reveal = "shown";
      return;
    }

    const show = () => {
      el.style.transitionDelay = `${delay}ms`;
      el.dataset.reveal = "shown";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(el);

    // Safety net. An element hidden by a decoration should never be able to
    // stay hidden — background tabs and occluded windows suppress
    // IntersectionObserver, and a missed callback would swallow the content.
    const fallback = window.setTimeout(() => {
      show();
      observer.disconnect();
    }, 3000);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [delay]);

  return (
    // @ts-expect-error — a polymorphic tag with a single shared ref type
    <Tag ref={ref} data-reveal="pending" className={className}>
      {children}
    </Tag>
  );
}
