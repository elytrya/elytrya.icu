import { queryCollection } from "@nuxt/content/server";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default defineEventHandler(async (event) => {
  const site = (
    (useRuntimeConfig(event).public.siteUrl as string) || "https://elytrya.icu"
  ).replace(/\/$/, "");

  let posts: Array<{
    title: string;
    description: string;
    date: string;
    path: string;
  }> = [];
  try {
    posts = (await queryCollection(event, "blog")
      .order("date", "DESC")
      .all()) as typeof posts;
  } catch {
    posts = [];
  }

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site}${p.path}</link>
      <guid isPermaLink="true">${site}${p.path}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>elytrya - devlog</title>
    <link>${site}</link>
    <description>notes on bots, clis and minecraft mods.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  setHeader(event, "content-type", "application/rss+xml; charset=utf-8");
  return xml;
});
