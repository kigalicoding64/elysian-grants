import { it } from "node:test";
import assert from "node:assert/strict";
import { buildSitemapXml } from "./sitemap-utils";

it("sitemap escapes URLs and omits lastmod without a page-specific date", () => {
  const xml = buildSitemapXml([{ loc: "https://elysian-grants.lovable.app/?a=1&b=2", changefreq: "daily", priority: 1 }]);
  assert.ok(xml.includes("?a=1&amp;b=2"));
  assert.equal(xml.includes("lastmod"), false);
});
it("sitemap preserves a supplied page-specific date", () => {
  const xml = buildSitemapXml([{ loc: "https://elysian-grants.lovable.app/articles/guide", lastmod: "2026-11-01", changefreq: "daily", priority: 0.8 }]);
  assert.ok(xml.includes("<lastmod>2026-11-01</lastmod>"));
});