import { Contacts } from "~/components/Contacts";
import { Hero } from "~/components/Hero";
import { ProductSection } from "~/components/ProductSection";
import { Studio } from "~/components/Studio";
import { Treatments } from "~/components/Treatments";
import { products } from "~/content/products";
import { site, socialLinks } from "~/content/site";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta(
      {
        title: `${site.name} | ${site.kind} a ${site.address.city}`,
        description: site.description,
      },
      "/",
    ),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BeautySalon",
        "@id": `${site.url}/#business`,
        name: site.name,
        legalName: site.legalName,
        description: site.description,
        url: `${site.url}/`,
        // Stable public URL: hashed asset URLs change on every build.
        logo: `${site.url}/favicon.png`,
        image: `${site.url}/favicon.png`,
        telephone: site.phone,
        email: site.email,
        vatID: site.vatId,
        foundingDate: String(site.foundingYear),
        founder: { "@type": "Person", name: site.owner.name },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressRegion: site.address.province,
          addressCountry: site.address.country,
        },
        openingHoursSpecification: site.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        ...(socialLinks.length > 0 && {
          sameAs: socialLinks.map(([, url]) => url),
        }),
      },
    },
  ];
}

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductSection product={products[0]} heading="h2" id="preordine">
        <a className="btn" href={`/products/${products[0].handle}`}>
          Preordina ora
        </a>
      </ProductSection>
      <Treatments />
      <Studio />
      <Contacts />
    </main>
  );
}
