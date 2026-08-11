"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact } from "@/app/actions";
import { emptyContactState } from "@/lib/contact";

const fieldClass =
  "w-full rounded-xl border border-edge bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-faint transition-colors focus:border-edge-strong focus:outline-none focus-visible:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-55"
    >
      {pending ? "Sending…" : "Send it"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, emptyContactState);
  const { fieldErrors, values } = state;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={fieldClass}
          />
          {fieldErrors.name ? (
            <p id="name-error" className="mt-2 text-sm text-accent">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values.email}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={fieldClass}
          />
          {fieldErrors.email ? (
            <p id="email-error" className="mt-2 text-sm text-accent">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block text-sm text-muted">
          Company <span className="text-faint">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          defaultValue={values.company}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-muted">
          What are you trying to build, or fix?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={values.message}
          placeholder="The rough shape is enough. Detail can come later."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
        {fieldErrors.message ? (
          <p id="message-error" className="mt-2 text-sm text-accent">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — positioned off-screen rather than display:none, which some
          bots detect. Hidden from assistive tech and from tab order. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <SubmitButton />
        {state.status !== "idle" && state.message ? (
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${state.status === "success" ? "text-ink" : "text-accent"}`}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
