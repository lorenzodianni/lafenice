import { site } from "~/content/site";

// `Allow: /` for everyone, AI crawlers included: named stanzas would be worse
// than the comment, since a crawler obeys only its most specific group and
// would then miss any future rule added to `*`.
// The noindex pages stay crawlable on purpose: a Disallow would hide the
// `noindex` meta tag, and a page never fetched is never de-indexed.
export function loader() {
  const body = `# Tutti i crawler sono i benvenuti, AI compresi
# (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
