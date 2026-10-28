import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SyncCandidate = {
  title: string;
  university: string;
  country: string;
  degree_levels: string[];
  funding_type: "full" | "partial";
  coverage_details: string;
  deadline: string | null;
  official_link: string;
  source_url: string;
};

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

const SCHEMA = {
  type: "object",
  properties: {
    opportunities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          university: { type: "string", description: "Host institution or provider" },
          country: { type: "string" },
          degree_levels: {
            type: "array",
            items: { type: "string", enum: ["Undergraduate", "Master's", "PhD"] },
          },
          funding_type: { type: "string", enum: ["full", "partial"] },
          coverage_details: { type: "string", description: "What is covered, 1-3 sentences" },
          deadline: { type: "string", description: "Application deadline as YYYY-MM-DD, or empty" },
          official_link: { type: "string", description: "Absolute URL of the announcement" },
        },
        required: ["title"],
      },
    },
  },
  required: ["opportunities"],
};

const PROMPT =
  "Extract every currently active scholarship, fellowship, grant or study funding opportunity announced on this page. Skip expired ones and navigation items. Return an empty list if there are none.";

async function fc(path: string, body: unknown) {
  const lovable = process.env["LOVABLE_API_KEY"];
  const key = process.env["FIRECRAWL_API_KEY"];
  if (!lovable || !key) throw new Error("Web scanner is not configured");
  const res = await fetch(`${GATEWAY}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": key,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Firecrawl ${path} failed [${res.status}]: ${text}`);
    throw new Error(`Scanner request failed (${res.status})`);
  }
  return res.json();
}

async function extract(url: string): Promise<SyncCandidate[]> {
  try {
    const r = await fc("/scrape", {
      url,
      formats: [{ type: "json", schema: SCHEMA, prompt: PROMPT }],
      onlyMainContent: true,
    });
    const json = r.json ?? r.data?.json;
    const list = (json?.opportunities ?? []) as Partial<SyncCandidate>[];
    return list
      .filter((o) => o.title)
      .map((o) => ({
        title: String(o.title).trim(),
        university: (o.university || "").trim(),
        country: (o.country || "").trim(),
        degree_levels: (o.degree_levels ?? []).filter(Boolean),
        funding_type: o.funding_type === "partial" ? "partial" : "full",
        coverage_details: (o.coverage_details || "").trim(),
        deadline: o.deadline && /^\d{4}-\d{2}-\d{2}$/.test(o.deadline) ? o.deadline : null,
        official_link: o.official_link?.startsWith("http") ? o.official_link : url,
        source_url: url,
      }));
  } catch (e) {
    console.error("extract failed", url, e);
    return [];
  }
}

export const scanPortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({ url: z.string().min(3).max(500), mode: z.enum(["page", "portal"]) })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    let url = data.url.trim();
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    const pages = [url];
    if (data.mode === "portal") {
      const m = await fc("/map", { url, search: "scholarship", limit: 40 });
      const links: string[] = (m.links ?? m.data?.links ?? [])
        .map((l: string | { url: string }) => (typeof l === "string" ? l : l.url))
        .filter((l: string) => /scholar|grant|fellow|funding|admission|announce|news|notice/i.test(l));
      for (const l of links) if (!pages.includes(l) && pages.length < 8) pages.push(l);
    }

    const results = await Promise.all(pages.map(extract));
    const seen = new Set<string>();
    const candidates = results.flat().filter((c) => {
      const k = c.title.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    return { scannedPages: pages.length, candidates };
  });
