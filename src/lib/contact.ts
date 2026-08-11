/**
 * Types and initial state for the contact form.
 *
 * These live outside src/app/actions.ts on purpose: a "use server" module may
 * only export async functions. Exporting a plain object from one silently
 * yields undefined at the import site.
 */

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<ContactField, string>>;
  /** Echoed back so a failed submit does not wipe what was typed. */
  values: { name: string; email: string; company: string; message: string };
};

export const emptyContactState: ContactState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: { name: "", email: "", company: "", message: "" },
};
