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
    promise: "Imagine the product that assumes AI, then build it.",
    body: "Not a feature bolted onto an existing roadmap. We start from what your business actually does, ask what becomes possible when intelligence is assumed rather than added, and ship a working version you can put in front of real people.",
  },
  {
    id: "fractional-cto",
    index: "02",
    title: "Fractional CTO",
    promise: "Ongoing technical leadership for teams without a CTO.",
    body: "Architecture, hiring, vendor decisions, and the judgment calls that are expensive to get wrong. Enough presence to be genuinely accountable, structured so you are not carrying a full-time executive salary to get it.",
  },
  {
    id: "efficiency-sprint",
    index: "03",
    title: "Efficiency Sprint",
    promise: "Fixed scope. Find where modern tech removes real cost. Ship it. Prove it.",
    body: "A defined engagement that ends in something running, with a number attached. Built for operations that still move on spreadsheets, email threads, and institutional memory — where the gains are largest and least glamorous.",
  },
];

const principles: Principle[] = [
  {
    id: "start-with-the-work",
    title: "Start with the work, not the technology",
    body: "The question is never where we can put AI. It is what the business actually does all day, and which parts of that should no longer require a person.",
  },
  {
    id: "woven-not-appended",
    title: "Woven, not appended",
    body: "Anyone can add a panel to an existing screen. The harder move is redrawing the process itself, so the intelligence is load-bearing rather than decorative.",
  },
  {
    id: "ship-to-learn",
    title: "Ship to learn",
    body: "Working software beats a deck. The fastest way to find out whether an idea holds is to put a real version of it in someone's hands and watch what they do.",
  },
  {
    id: "boring-underneath",
    title: "Boring where it counts",
    body: "Novel at the surface, conventional underneath. The interesting risk belongs in the product. It never belongs in the infrastructure.",
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
      "A short, plain description of what this is and who it is for. Two or three sentences is the right length — enough to make the idea concrete, short enough that someone scanning the page still reads it. Say what it does before you say why it matters.",
    image: null,
    isPlaceholder: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    status: "Exploring",
    description:
      "Something you are actively poking at but have not committed to. The Exploring tag does real work here: it lets you show early thinking without implying a launch date, which is exactly the honest position for work at this stage.",
    image: null,
    isPlaceholder: true,
  },
  {
    slug: "project-three",
    title: "Project Three",
    status: "Researching",
    description:
      "An open question you are spending time on. Research entries signal the direction of your attention, which is often more persuasive to a prospective client than a finished case study — it shows how you think, not just what you shipped.",
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
