"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import {
  emptyContactState,
  type ContactField,
  type ContactState,
} from "@/lib/contact";
import { site } from "@/lib/site";

/**
 * Best-effort rate limit. This lives in process memory, so it resets on deploy
 * and is not shared across serverless instances — it exists to blunt casual
 * spam, not to be an authority. Move it to a store when there is one.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: hidden from humans, irresistible to bots. Accept silently so the
  // bot has no signal that it was caught.
  if (String(formData.get("website") ?? "")) {
    return { ...emptyContactState, status: "success", message: "Thanks. Your note is on its way." };
  }

  const fieldErrors: Partial<Record<ContactField, string>> = {};
  if (values.name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!EMAIL_RE.test(values.email)) fieldErrors.email = "Please enter a valid email address.";
  if (values.message.length < 20) {
    fieldErrors.message = "A sentence or two more would help. 20 characters minimum.";
  }
  if (values.message.length > 5000) {
    fieldErrors.message = "That's over the 5,000 character limit.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "", fieldErrors, values };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return {
      status: "error",
      message: `That's a lot of messages in one hour. Email ${site.email} directly and it will get through.`,
      fieldErrors: {},
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Unconfigured is a deploy state, not a user error — say so plainly and
    // give them a route that works right now.
    console.warn("[contact] RESEND_API_KEY is not set; submission not delivered:", values);
    return {
      status: "error",
      message: `Email delivery isn't set up yet. Please write ${site.email} directly for now.`,
      fieldErrors: {},
      values,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM ?? "LBC Innovation <onboarding@resend.dev>",
      to: process.env.CONTACT_TO ?? site.email,
      replyTo: values.email,
      subject: `New inquiry from ${values.name}${values.company ? ` (${values.company})` : ""}`,
      text: [
        `Name:    ${values.name}`,
        `Email:   ${values.email}`,
        `Company: ${values.company || "—"}`,
        "",
        values.message,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Resend rejected the send:", error);
      return {
        status: "error",
        message: `That didn't send. Please try ${site.email} directly.`,
        fieldErrors: {},
        values,
      };
    }

    return {
      ...emptyContactState,
      status: "success",
      message: "Thanks. That came through. You'll hear back in a couple of days.",
    };
  } catch (err) {
    console.error("[contact] Unexpected failure:", err);
    return {
      status: "error",
        message: `That didn't send. Please try ${site.email} directly.`,
      fieldErrors: {},
      values,
    };
  }
}
