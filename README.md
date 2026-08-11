# LBC Innovation

Marketing site for Limitless Bounds Creative Innovation.

Next.js 16 (App Router, server-rendered) · React 19 · Tailwind v4 · TypeScript.
Deployed on Vercel. No database, by design — see [Content](#content).

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with Fast Refresh |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets` | Regenerate every logo asset from `logo/lbci-logo.png` |

---

## Before the first real deploy

Replace the placeholders in [`src/lib/site.ts`](src/lib/site.ts) — they are grouped
at the top of the file and each is marked `PLACEHOLDER`:

- `url` — the live domain, used for canonical tags, OG metadata, and the sitemap
- `founderName` — shown in the About section
- `email` — where contact form submissions land
- `calLink` — Cal.com booking URL
- `social.linkedin` / `social.github` — set either to `null` to hide the link

Then replace the three sample projects in [`src/lib/content.ts`](src/lib/content.ts)
and delete their `isPlaceholder: true` flags.

---

## Content

There is no CMS and no database yet. Content lives as typed data in
`src/lib/content.ts`, read through async accessors at the bottom of that file:

```ts
getServices()  getPrinciples()  getProjects()  getProject(slug)
```

**Nothing outside that file reads the data directly.** That is the whole point —
the accessors are already `async`, so introducing real I/O later means rewriting
four function bodies and touching no components. The intended path when a
backend is wanted is Payload CMS 3 + Neon Postgres, both of which run inside
this app on Vercel's and Neon's free tiers.

### Adding a project

Append to the `projects` array in `src/lib/content.ts`:

```ts
{
  slug: "atlas",
  title: "Atlas",
  status: "Building",          // "Building" | "Exploring" | "Researching"
  description: "Two or three sentences.",
  image: "/projects/atlas.png", // or null for a generated thumbnail
}
```

Cards with `image: null` render a gradient placeholder derived from the slug
(`src/components/ProjectThumb.tsx`), so a project without artwork still looks
deliberate. Real images go in `public/projects/` at roughly 16:10.

---

## Theming

Light and dark are both first-class. Every color is a CSS custom property
defined once in `src/app/globals.css` under `:root` and `[data-theme="dark"]`,
then mapped to Tailwind utilities via `@theme inline`.

The palette is sampled directly from the logo: the gradient runs `#F5A26B`
(warm orange) to `#EC7186` (rose), with a `#5E4756` plum wordmark. Rose is
darkened to `#C2445D` for link text on light backgrounds so it clears WCAG AA.

Theme selection follows the OS by default and is overridden by the toggle,
persisted in `localStorage` under `lbc-theme`. A small blocking script in
`<head>` applies the attribute before first paint so dark loads never flash
light.

### Logo assets

`logo/lbci-logo.png` is the only source file. `npm run assets` derives the rest:

| Output | Notes |
| --- | --- |
| `public/logo/lbci-logo.png` | Light theme, trimmed |
| `public/logo/lbci-logo-dark.png` | Plum wordmark recolored to bone — it is invisible on dark otherwise |
| `public/logo/lbci-mark.png` | Mark alone, used in the nav where the wordmark would be too small to read |
| `src/app/icon.png`, `src/app/apple-icon.png` | Favicons |
| `public/brand/og.png` | 1200×630 social card |

Re-run it after replacing the source logo.

---

## Contact form

A server action (`src/app/actions.ts`) validates the submission and sends it
through [Resend](https://resend.com) (free tier: 3,000 emails/month). It has a
honeypot field and a best-effort in-memory rate limit — five submissions per IP
per hour, which resets on deploy and is not shared across serverless instances.
It exists to blunt casual spam, not as an authority.

**The site builds and runs with no environment variables.** Without
`RESEND_API_KEY` the form tells the visitor to email directly instead of
failing silently. Copy `.env.example` to `.env.local` to configure it.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_FROM` | Sender address on a domain verified in Resend |
| `CONTACT_TO` | Destination inbox; falls back to `site.email` |

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo. Next.js is detected
   automatically; no build settings need changing.
3. Add the environment variables above under **Settings → Environment
   Variables** (skip if the form is not configured yet).
4. Add the custom domain under **Settings → Domains**, and update `site.url`
   in `src/lib/site.ts` to match.

The homepage is `dynamic = "force-dynamic"`, so it is server-rendered per
request. Once content moves behind a database, swap that for `revalidate` to
get ISR instead.

---

## Accessibility and motion

- Scroll reveals are progressive enhancement. They are disabled outright under
  `prefers-reduced-motion`, overridden in `<noscript>`, and carry a 3-second
  fallback timer so a missed `IntersectionObserver` callback can never leave
  content permanently invisible.
- Skip link, visible focus rings, labelled form fields with `aria-invalid` and
  `aria-describedby`, and a live region for submit status.
