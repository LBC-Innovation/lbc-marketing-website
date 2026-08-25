"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectShot } from "@/lib/content";

export type { ProjectShot };

export function ProjectShots({ shots }: { shots: ProjectShot[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open === null) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setOpen((i) => (i === null ? i : (i + 1) % shots.length));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setOpen((i) => (i === null ? i : (i - 1 + shots.length) % shots.length));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shots.length]);

  function openAt(index: number, trigger: HTMLElement) {
    lastTrigger.current = trigger;
    setOpen(index);
  }

  function close() {
    dialogRef.current?.close();
  }

  const current = open !== null ? shots[open] : null;

  const lightbox = mounted
    ? createPortal(
        <dialog
          ref={dialogRef}
          className="shot-lightbox"
          aria-labelledby={titleId}
          onClose={() => {
            setOpen(null);
            lastTrigger.current?.focus();
          }}
        >
          {current ? (
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <p
                  id={titleId}
                  className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[#f4edef]/80"
                >
                  {current.label ?? current.alt}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  className="rounded-full border border-[#f4edef]/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f4edef] transition-colors hover:bg-[#f4edef]/10"
                >
                  Close
                </button>
              </div>

              <div
                className="relative grid min-h-0 flex-1 place-items-center px-4 pb-6 sm:px-8"
                onClick={(e) => {
                  if (e.target === e.currentTarget) close();
                }}
              >
                {/* Native img so the full file is shown, not a resized card. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-full max-w-full object-contain"
                />

                {shots.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpen((i) =>
                          i === null ? i : (i - 1 + shots.length) % shots.length,
                        )
                      }
                      className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-[#f4edef]/20 text-[#f4edef] sm:grid"
                      aria-label="Previous image"
                    >
                      <Arrow dir="left" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setOpen((i) => (i === null ? i : (i + 1) % shots.length))
                      }
                      className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-[#f4edef]/20 text-[#f4edef] sm:grid"
                      aria-label="Next image"
                    >
                      <Arrow dir="right" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </dialog>,
        document.body,
      )
    : null;

  const hasPortrait = shots.some((shot) => shot.height > shot.width);
  const galleryClass = hasPortrait
    ? "grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(11rem,17rem)] sm:gap-5"
    : "grid items-start gap-4 sm:grid-cols-2 sm:gap-5";

  return (
    <>
      {shots.length > 1 ? (
        <div className={galleryClass}>
          {shots.map((shot, i) => (
            <ShotCard
              key={shot.src}
              shot={shot}
              onOpen={(el) => openAt(i, el)}
            />
          ))}
        </div>
      ) : shots[0] ? (
        <ShotCard shot={shots[0]} onOpen={(el) => openAt(0, el)} />
      ) : null}
      {lightbox}
    </>
  );
}

function ShotCard({
  shot,
  onOpen,
}: {
  shot: ProjectShot;
  onOpen: (trigger: HTMLElement) => void;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-edge bg-sunken">
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        className="block w-full cursor-zoom-in text-left"
        aria-label={`View ${shot.alt} full screen`}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          unoptimized
          priority
          className="h-auto w-full"
        />
      </button>
      {shot.label ? (
        <figcaption className="border-t border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          {shot.label}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      {dir === "left" ? (
        <path d="M15 6 9 12l6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}
