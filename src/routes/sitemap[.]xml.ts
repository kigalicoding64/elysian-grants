import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://elysian-grants.lovable.app";

const STATIC_PATHS = [
  "/",
  "/how-it-works",
  "/concierge",
  "/universities",
  "/articles",
  "/auth",
];

function xmlEscape(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { createClient } = await import("@supabase/supabase-js");
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"]!;
        const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"]!;
        const supabase = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              if (key.startsWith("sb_") && headers.get("Authorization") === "Bearer " + key)
                headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const entries: { path: string; lastmod?: string }[] = STATIC_PATHS.map((path) => ({ path }));

        const pageSize = 1000;
        for (let offset = 0; ; ) {
          const { data, error } = await supabase
            .from("scholarships")
            .select("slug, id, created_at")
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

        const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries
          .map(
            (e) =>
              `<url><loc>${xmlEscape(new URL(e.path, BASE_URL).href)}</loc>${
                e.lastmod ? `<lastmod>${xmlEscape(e.lastmod)}</lastmod>` : ""
              }</url>`,
          )
          .join("")}</urlset>`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml",
            // Regenerated at most every 5 minutes.
            "Cache-Control": "public, max-age=300, s-maxage=300, must-revalidate",
          },
        });
      },
    },
  },
});
