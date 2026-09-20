import { site } from "~/content/site";

// `User-agent: *` already allows them: the explicit stanzas state the intent,
// so nobody later assumes the AI crawlers were forgotten (see CLAUDE.md).
const aiCrawlers = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

// The noindex pages stay crawlable on purpose: a Disallow would hide the
// `noindex` meta tag, and a page never fetched is never de-indexed.
export function loader() {
  const body = [
    "User-agent: *",
    "Allow: /",
    ...aiCrawlers.flatMap((ua) => ["", `User-agent: ${ua}`, "Allow: /"]),
    "",
    `Sitemap: ${site.url}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
