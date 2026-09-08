import { NextResponse } from 'next/server';

export const revalidate = 120; // 2 Minutes (120 seconds)

interface RawOpportunity {
  title: string;
  isClosingToday?: boolean;
}

// Extracted from active ElScholarship directory listings
const OPPORTUNITIES: RawOpportunity[] = [
  { title: "China-Rwanda Inner Mongolia Medical University Scholarship 2026", isClosingToday: true },
  { title: "KfW-EAC Master’s Student Mobility Scholarships Cohort 4" },
  { title: "EAC-IUCEA Undergraduate & Diploma Mobility Grants" },
  { title: "East African Community Student Mobility Scholarship Scheme EAC-SMS" },
  { title: "NM-AIST EACSP Mobility Masters Scholarships" },
  { title: "Cybersafe x SANS AI Security Fellowship for African Women 2026" },
  { title: "IUCEA EAC Regional STEM Female Leadership Grants" },
  { title: "INES Ruhengeri Health Sciences Full Scholarship" },
  { title: "Post-Doctoral Fellowship in Integrated Data Sciences" },
  { title: "University of Sydney International Stipend USYDIS" },
  { title: "Canon Collins RMTF Postgraduate Scholarships 2027" },
  { title: "Google Africa Applied AI & Software Engineering Youth Program" },
  { title: "Ministry of Health 54 Sponsored Health Scholarships" },
  { title: "AERC-World Bank Visiting Scholars Programme 2026/2027" },
  { title: "African Development Bank AfDB - Japan Africa Dream Scholarship JADS" },
  { title: "Ashesi University High School Leaders Scholarship" },
  { title: "AVoHC Kofi Annan Global Health Leadership Fellowship 2026" },
  { title: "Kepler College Secondary Leavers Merit Scholarship" },
  { title: "Breakthrough Junior Challenge 2026" },
  { title: "DAFI Refugee Tertiary Education Scholarship UNHCR Rwanda" },
  { title: "PEGASO PhD Grants at University of Florence 2026/2027" },
  { title: "MMoCRA Multidisciplinary Mobility for Climate Resilient Africa Grants" },
  { title: "Friends of Rwandan Education FRE Higher Education Grant" },
  { title: "Mango 4G Field Sales Agent" },
  { title: "GIFT University Pakistan – Rwandan Female Leadership Grants 2026" },
  { title: "Mastercard Foundation Scholars Program at University of Pretoria 2027" },
  { title: "HEC Rwanda Government Study Loans Local September Intake" },
  { title: "AAUW International Fellowships for Women" },
  { title: "ARES Scholarships for Developing Country Students" },
  { title: "Pan African University PAU Full Scholarships African Union Commission" },
  { title: "Meta Research PhD Fellowship 2027" }
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elscholarship.com';
  const lastmod = new Date().toISOString();

  // Deduplicate entries by slug
  const uniqueMap = new Map<string, RawOpportunity>();
  for (const item of OPPORTUNITIES) {
    const slug = slugify(item.title);
    if (!uniqueMap.has(slug)) {
      uniqueMap.set(slug, item);
    }
  }

  const urls = Array.from(uniqueMap.entries()).map(([slug, item]) => {
    return {
      loc: `${baseUrl}/scholarships/${slug}`,
      lastmod,
      changefreq: 'always',
      priority: item.isClosingToday ? 1.0 : 0.8,
    };
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
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
      'Cache-Control': 'public, max-age=120, s-maxage=120, stale-while-revalidate=30',
    },
  });
}
