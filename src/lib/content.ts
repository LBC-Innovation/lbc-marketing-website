/**
 * The content layer — and the seam that keeps a database optional.
 *
 * Every page reads content through the async `get*` functions at the bottom of
 * this file, never from the arrays directly. Today those functions resolve
 * local data. Swapping in Neon + Payload later means rewriting the bodies of
 * four functions; no component or page changes.
 *
 * Keeping them async now is the whole point: call sites already `await`, so
 * introducing real I/O later is not a refactor.
 */

export type Service = {
  id: string;
  index: string;
  title: string;
  promise: string;
  body: string;
};

export type Principle = {
  id: string;
  title: string;
  body: string;
};

export type ProjectStatus = "Building" | "Exploring" | "Researching";

export type ProjectProof = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  /** Homepage card blurb. */
  description: string;
  /** Homepage card image. Null renders the generated placeholder
   *  thumbnail keyed off the slug. */
  thumbnail: string | null;
  /** Focused image on the project page. Falls back to thumbnail. */
  hero?: string | null;
  /** Optional phone screenshot, shown beside the hero. */
  heroMobile?: string | null;
  github?: string;
  /** Third-slot card: visible on the homepage, no detail page. */
  comingSoon?: boolean;
  isPlaceholder?: boolean;
  story?: string[];
  demonstrates?: ProjectProof[];
  stack?: string[];
};

// --- Data -------------------------------------------------------------------

const services: Service[] = [
  {
    id: "product-innovation",
    index: "01",
    title: "Product Innovation",
    promise: "Figure out what the product should be if AI is in it from the start. Then build that.",
    body: "We sit with how you actually operate, sketch the version of the product that only makes sense now, and get a working build in front of the people who'd use it.",
  },
  {
    id: "fractional-cto",
    index: "02",
    title: "Fractional CTO",
    promise: "Technical leadership when you need a CTO and aren't hiring one full-time.",
    body: "Architecture, hiring, vendors, and the decisions that get expensive if you guess. We're around enough to own the outcome, without you taking on a full-time executive salary to get there.",
  },
  {
    id: "efficiency-sprint",
    index: "03",
    title: "Efficiency Sprint",
    promise: "A short, scoped project. Find the busywork, replace it, and show the number.",
    body: "We pick one messy process (usually a spreadsheet, an email chain, or something only one person knows how to do) and leave you with a working replacement. You get a before-and-after you can point at.",
  },
];

const principles: Principle[] = [
  {
    id: "start-with-the-work",
    title: "Start with the work",
    body: "We don't begin with where AI could go. We begin with what people do all day, and which of those hours shouldn't still need a person.",
  },
  {
    id: "woven-not-appended",
    title: "Change the process, not just the screen",
    body: "It's easy to drop a new panel onto an old workflow. It's more useful to change the workflow so the software is doing real work, not sitting in the corner waiting to be asked.",
  },
  {
    id: "ship-to-learn",
    title: "Put it in someone's hands",
    body: "A working version tells you more than a deck. We'd rather find out early that an idea is wrong than spend months polishing a plan.",
  },
  {
    id: "boring-underneath",
    title: "Keep the plumbing ordinary",
    body: "Be inventive in the product. Use well-understood tools underneath. The risky part shouldn't be whether the servers stay up.",
  },
];

const projects: Project[] = [
  {
    slug: "smartycolor",
    title: "SmartyColor",
    status: "Building",
    description:
      "Kids describe what they want to color, talk it through with Smarty, and print a sheet of their own invention.",
    thumbnail: "/projects/smartycolor-thumb.jpg",
    hero: "/projects/smartycolor-hero.png",
    github: "https://github.com/LBC-Innovation/SmartyColor",
    story: [
      "A child has a picture in their head. Store-bought books don't have that picture. SmartyColor is the conversation that gets it onto paper.",
      "They type or speak. A character named Smarty turns the chat into a list of drawing details they can edit — add a line, drop one, keep going. When the plan feels right, Make It builds a printable sheet on the same page.",
      "No account is required. Sign-in is only there if someone wants to reopen an old sheet. The drawing model sits behind a provider facade, so the product isn't welded to one vendor. Printer options live in the header, because that's when paper actually comes up.",
      "If they ask for a famous character, it aims for a close look-alike instead of a copy. That's a product constraint, not a slogan.",
    ],
    demonstrates: [
      {
        title: "A closed loop",
        body: "Conversation, a structured plan, generation, print, and optional history. Not a chatbot taped to a download button.",
      },
      {
        title: "The model does a job",
        body: "AI produces something the child can inspect and change before anything is drawn. The unusual part is the workflow, not a panel in the corner.",
      },
      {
        title: "An interface for people who aren't operators",
        body: "Large type, voice input, one primary action. The same discipline we use when the user isn't a technologist.",
      },
      {
        title: "Ordinary plumbing",
        body: "Next.js on Vercel, optional Supabase. Be inventive in the product. Keep the stack boring.",
      },
    ],
    stack: ["Next.js", "Tailwind CSS", "Gemini", "Supabase", "Vercel"],
  },
  {
    slug: "sharelist",
    title: "ShareList",
    status: "Exploring",
    description:
      "Friends on different music services still can't share a playlist the other person can play. ShareList is the layer in the middle — matching tracks, not playing them.",
    thumbnail: "/projects/sharelist-thumb.jpg",
    hero: "/projects/sharelist-hero.png",
    heroMobile: "/projects/sharelist-mobile.jpg",
    github: "https://github.com/LBC-Innovation/ShareList",
    story: [
      "A Spotify playlist sent to someone on Apple Music is usually a screenshot. ShareList is the layer in the middle. Each person keeps their own playlist on their own service. The ShareList is what they share.",
      "Connect a service, pick a playlist, invite a friend. They link a playlist from their side. Sync copies missing tracks into each linked playlist when a match exists; songs that only live on one catalog stay put. It is not a player and it does not host audio.",
      "Spotify, Apple Music, and SoundCloud are wired today. YouTube Music is reserved in the schema. Tokens live on the server, not in the browser. The frontend talks only to our API; the API talks to the vendors.",
      "This one is still being explored. The hard part is matching catalogs and writing back safely — not another set of screens.",
    ],
    demonstrates: [
      {
        title: "Several vendors, several auth models",
        body: "Redirect OAuth, Apple MusicKit in the page, OAuth 2.1. Tokens stored server-side. The product has to live with how each vendor actually works.",
      },
      {
        title: "A real boundary",
        body: "React on one deploy, Express on another, Supabase for auth and Postgres. The browser never talks to Spotify or Apple directly.",
      },
      {
        title: "One repo, two ships",
        body: "A monorepo that deploys as two Vercel projects, with CI in between. Web from git; the API typechecked and transpiled before it goes out.",
      },
      {
        title: "Knowing what to leave out",
        body: "No player, no hosted files, no replacement for the services people already pay for. The work is the sharing layer.",
      },
    ],
    stack: [
      "React",
      "Vite",
      "Express",
      "TypeScript",
      "Supabase",
      "Vercel",
      "Resend",
    ],
  },
  {
    slug: "more-on-the-way",
    title: "More on the way",
    status: "Researching",
    description:
      "Not everything on the desk is ready to write about. This space stays open for whatever comes next.",
    thumbnail: null,
    comingSoon: true,
  },
];

// --- Accessors --------------------------------------------------------------
// Read content through these. See the note at the top of the file.

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getPrinciples(): Promise<Principle[]> {
  return principles;
}

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProject(slug: string): Promise<Project | null> {
  const project = projects.find((p) => p.slug === slug) ?? null;
  if (!project || project.comingSoon) return null;
  return project;
}

export async function getProjectSlugs(): Promise<string[]> {
  return projects.filter((p) => !p.comingSoon).map((p) => p.slug);
}
