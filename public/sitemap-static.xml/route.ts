import { NextResponse } from 'next/server';

export const revalidate = 604800; // 7 Days (604,800 seconds)

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elscholarship.com';
  const now = new Date().toISOString();

  const staticUrls = [
    { loc: `${baseUrl}/`, lastmod: now, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/concierge`, lastmod: now, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/directory/undergraduate`, lastmod: now, changefreq: 'daily', priority: 0.7 },
    { loc: `${baseUrl}/directory/masters`, lastmod: now, changefreq: 'daily', priority: 0.7 },
    { loc: `${baseUrl}/directory/phd`, lastmod: now, changefreq: 'daily', priority: 0.7 },
    { loc: `${baseUrl}/directory/fellowship`, lastmod: now, changefreq: 'daily', priority: 0.7 },
    { loc: `${baseUrl}/directory/training`, lastmod: now, changefreq: 'daily', priority: 0.7 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}
