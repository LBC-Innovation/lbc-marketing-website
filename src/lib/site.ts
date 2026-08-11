/**
 * Single source of truth for identity, URLs, and contact routing.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ PLACEHOLDERS — replace these before the first real deploy.          │
 * │   founderName, url, email, calLink, social.*                        │
 * │ Everything else is finished copy.                                   │
 * └─────────────────────────────────────────────────────────────────────┘
 */

export const site = {
  name: "LBC Innovation",
  legalName: "Limitless Bounds Creative Innovation",
  tagline: "AI woven in. Not bolted on.",
  description:
    "A product studio for businesses that don't call themselves tech companies. Product innovation, fractional CTO leadership, and efficiency work that ends in something running.",

  /** PLACEHOLDER — used for canonical URLs, sitemap, and OG tags. */
  url: "https://lbcinnovation.com",

  /** PLACEHOLDER — your name, shown in the About section. */
  founderName: "Your Name",

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
    { label: "Work together", href: "#services" },
    { label: "Approach", href: "#approach" },
    { label: "Currently", href: "#currently" },
    { label: "About", href: "#about" },
  ],
} as const;

export type Site = typeof site;
