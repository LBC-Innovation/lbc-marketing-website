import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav solid />
      <main id="top" className="mx-auto max-w-6xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32">
        <p className="eyebrow">Missing</p>
        <h1 className="mt-6 max-w-xl text-[clamp(1.875rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
          It may have moved, or the link might be off. The work we&rsquo;re writing
          about lives on the homepage.
        </p>
        <p className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg transition-opacity hover:opacity-85"
          >
            Back to the homepage
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
