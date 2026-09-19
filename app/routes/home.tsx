import { Contacts } from "~/components/Contacts";
import { Hero } from "~/components/Hero";
import { ProductTeaser } from "~/components/ProductTeaser";
import { Studio } from "~/components/Studio";
import { Treatments } from "~/components/Treatments";
import { products } from "~/content/products";
import { site, socialLinks } from "~/content/site";
import type { Route } from "./+types/home";

const title = `${site.name} | ${site.kind} a ${site.address.city}`;

export function meta(_: Route.MetaArgs) {
  return [
    { title },
    { name: "description", content: site.description },
    { tagName: "link", rel: "canonical", href: `${site.url}/` },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "it_IT" },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: title },
    { property: "og:description", content: site.description },
    { property: "og:url", content: `${site.url}/` },
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
      <ProductTeaser product={products[0]} />
      <Treatments />
      <Studio />
      <Contacts />
    </main>
  );
}
