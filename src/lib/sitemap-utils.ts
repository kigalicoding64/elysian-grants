export function xmlEscape(value: string): string {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
  return value.replace(/[&<>"']/g, (c) => entities[c] ?? c);
}

export function buildSitemapXml(urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: number }>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ""}
    <changefreq>${xmlEscape(u.changefreq)}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}
