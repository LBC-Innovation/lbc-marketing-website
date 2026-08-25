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

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  description: string;
  /** Path under /public, e.g. "/projects/atlas.png". Null renders the
   *  generated placeholder thumbnail keyed off the slug. */
  image: string | null;
  /** Reserved for detail pages; unused by the current single-page layout. */
  href?: string;
  isPlaceholder?: boolean;
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

/**
 * PLACEHOLDER CONTENT — replace with your real projects.
 * Set `image` to a path under /public to use a real thumbnail; leave it null
 * to render the generated gradient placeholder. Drop `isPlaceholder` once the
 * entry is real — it is what dims the card and shows the sample badge.
 */
const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    status: "Building",
    description:
      "An internal tool for a mid-size operator who still runs scheduling in a shared spreadsheet. The first version is in use with a handful of people.",
    image: null,
    isPlaceholder: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    status: "Exploring",
    description:
      "Looking at whether claims intake can skip the inbox entirely. Too early to call it a product. On this list because it's taking real hours.",
    image: null,
    isPlaceholder: true,
  },
  {
    slug: "project-three",
    title: "Project Three",
    status: "Researching",
    description:
      "Talking with small manufacturers about how production data actually moves. No build yet. Trying to find the part that's worth building.",
    image: null,
    isPlaceholder: true,
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
  return projects.find((p) => p.slug === slug) ?? null;
}
