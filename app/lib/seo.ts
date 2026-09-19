import { site } from "~/content/site";

// Meta every page needs. Routes spread this and add their own JSON-LD.
export function pageMeta(
  {
    title,
    description,
    noindex = false,
  }: { title: string; description: string; noindex?: boolean },
  path: string,
) {
  const url = `${site.url}${path}`;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "it_IT" },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
  ];
}
