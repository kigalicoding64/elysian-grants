import { createFileRoute } from "@tanstack/react-router";
import { buildSitemapXml } from "@/lib/sitemap-utils";

const BASE_URL = "https://elysian-grants.lovable.app";

const STATIC_PATHS = [
  "/",
  "/how-it-works",
  "/contact",
  "/privacy",
  "/terms",
  "/concierge",
  "/universities",
  "/articles",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { publicContentClient } = await import("@/lib/public-content.server");
        const supabase = publicContentClient();

        const entries: { path: string; lastmod?: string }[] = STATIC_PATHS.map((path) => ({ path }));

        const pageSize = 1000;
        for (let offset = 0; ; ) {
          const { data, error } = await supabase
            .from("scholarships")
            .select("slug, id")
            .eq("status", "published")
            .order("id")
            .range(offset, offset + pageSize - 1);
          if (error) throw error;
          if (!data || data.length === 0) break;
          for (const row of data) {
            const key = (row as { slug: string | null; id: string }).slug ?? (row as { id: string }).id;
            entries.push({ path: `/scholarships/${encodeURIComponent(key)}` });
          }
          offset += data.length;
        }

        for (let offset = 0; ; ) {
          const { data, error } = await supabase
            .from("articles")
            .select("slug, published_at")
            .eq("status", "published")
            .order("slug")
            .range(offset, offset + pageSize - 1);
          if (error) throw error;
          if (!data || data.length === 0) break;
          for (const row of data as { slug: string; published_at: string | null }[]) {
            const lastmod = row.published_at
              ? new Date(row.published_at).toISOString().slice(0, 10)
              : undefined;
            entries.push({ path: `/articles/${encodeURIComponent(row.slug)}`, ...(lastmod ? { lastmod } : {}) });
          }
          offset += data.length;
        }

        const body = buildSitemapXml(entries.map((entry) => ({
          loc: new URL(entry.path, BASE_URL).href,
          ...(entry.lastmod ? { lastmod: entry.lastmod } : {}),
          changefreq: "daily",
          priority: entry.path === "/" ? 1 : entry.path.startsWith("/scholarships/") ? 0.9 : 0.8,
        })));

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml",
            // Cached responses expire after five minutes; subsequent requests regenerate from live content.
            "Cache-Control": "public, max-age=300, s-maxage=300, must-revalidate",
          },
        });
      },
    },
  },
});
