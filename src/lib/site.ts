/**
 * Single source of truth for identity, URLs, and contact routing.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ PLACEHOLDERS — replace these before the first real deploy.          │
 * │   url, email, calLink, social.*                                     │
 * │ Everything else is finished copy.                                   │
 * └─────────────────────────────────────────────────────────────────────┘
 */

export const site = {
  name: "LBC Innovation",
  legalName: "Limitless Bounds Creative Innovation",
  tagline: "AI Woven in, not bolted on.",
  description:
    "We help companies that aren't tech companies build software: new products, part-time technical leadership, and projects that take real cost out of day-to-day work.",

  /** PLACEHOLDER — used for canonical URLs, sitemap, and OG tags. */
  url: "https://lbcinnovation.com",

  /** PLACEHOLDER — inbox that contact form submissions are delivered to. */
  email: "hello@lbcinnovation.com",

  /** PLACEHOLDER — Cal.com booking link. Free tier covers this. */
  calLink: "https://cal.com/your-handle/intro",

  social: {
    /** PLACEHOLDER — set to null to hide the link entirely. */
    linkedin: "https://www.linkedin.com/in/your-handle" as string | null,
    github: "https://github.com/your-handle" as string | null,
  },

  nav: [
    { label: "What we do", href: "/#services" },
    { label: "How we work", href: "/#approach" },
    { label: "In progress", href: "/#currently" },
  ],
} as const;

export type Site = typeof site;
