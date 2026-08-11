import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { Contact } from "@/components/Contact";
import { Currently } from "@/components/Currently";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Services } from "@/components/Services";
import { site } from "@/lib/site";

/**
 * Rendered on the server on every request. Once content moves behind a real
 * database, swap this for `revalidate` to get ISR instead.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    description: site.description,
    slogan: site.tagline,
    logo: `${site.url}/logo/lbci-logo.png`,
    areaServed: "US",
    serviceType: [
      "AI product development",
      "Fractional CTO services",
      "Business process automation",
    ],
  };

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Approach />
        <Currently />
        <About />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
