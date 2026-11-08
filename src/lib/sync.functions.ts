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
  details: SyncDetails | null;
};

export type SyncDetails = {
  about_institution?: string | undefined;
  coverage_summary?: string | undefined;
  coverage_tags?: string[] | undefined;
  eligibility?: string | undefined;
  financial_criteria?: string | undefined;
  required_documents?: string | undefined;
  student_responsibilities?: string | undefined;
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
          about_institution: { type: "string", description: "2-4 sentences about the host institution/government body and location" },
          coverage_summary: { type: "string", description: "2-4 sentences: tuition, stipend amount, insurance, flights, housing" },
          coverage_tags: { type: "array", items: { type: "string" }, description: "Short benefit labels e.g. Tuition, Stipend, Airfare" },
          eligibility: { type: "string", description: "2-4 sentences: nationalities, academic level, GPA, age, language" },
          financial_criteria: { type: "string", description: "2-4 sentences: need-based/merit-based, income thresholds" },
          required_documents: { type: "string", description: "2-4 sentences: transcripts, certificates, tests, letters" },
          student_responsibilities: { type: "string", description: "2-4 sentences: how to apply, steps, obligations after award" },
        },
        required: ["title"],
      },
    },
  },
  required: ["opportunities"],
};

const PROMPT =
  "Extract every currently active scholarship, fellowship, grant or study funding opportunity announced on this page, with its full details (institution, coverage, eligibility, financial criteria, required documents, application steps). Use only facts stated on the page; leave a field empty if not stated. Skip expired ones and navigation items. Return an empty list if there are none.";

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

function pickDetails(o: Record<string, unknown>): SyncDetails | null {
  const str = (k: string) => (typeof o[k] === "string" && (o[k] as string).trim() ? (o[k] as string).trim() : undefined);
  const d: SyncDetails = {
    about_institution: str("about_institution"),
    coverage_summary: str("coverage_summary"),
    coverage_tags: Array.isArray(o["coverage_tags"]) ? (o["coverage_tags"] as unknown[]).filter((t): t is string => typeof t === "string").slice(0, 8) : undefined,
    eligibility: str("eligibility"),
    financial_criteria: str("financial_criteria"),
    required_documents: str("required_documents"),
    student_responsibilities: str("student_responsibilities"),
  };
  return Object.values(d).some(Boolean) ? d : null;
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
        details: pickDetails(o as Record<string, unknown>),
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

async function discover(url: string, maxPages: number) {
  const pages = [url];
  try {
    const m = await fc("/map", { url, search: "scholarship", limit: 30 });
    const links: string[] = (m.links ?? m.data?.links ?? [])
      .map((l: string | { url: string }) => (typeof l === "string" ? l : l.url))
      .filter((l: string) => /scholar|grant|fellow|funding|bourse|stipend|award/i.test(l));
    for (const l of links) if (!pages.includes(l) && pages.length < maxPages) pages.push(l);
  } catch {
    /* site map unavailable — scan home page only */
  }
  return pages;
}

/** Scans a small batch of sources and stores what it finds for admin review. */
export const syncSourceBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      sources: z.array(z.object({ url: z.string().min(3).max(300), group: z.string().max(40) })).min(1).max(5),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const perSource = await Promise.all(
      data.sources.map(async (s) => {
        const url = /^https?:\/\//i.test(s.url) ? s.url : `https://${s.url}`;
        try {
          const pages = await discover(url, 3);
          const found = (await Promise.all(pages.map(extract))).flat();
          return { url: s.url, group: s.group, found, ok: true };
        } catch {
          return { url: s.url, group: s.group, found: [] as SyncCandidate[], ok: false };
        }
      }),
    );

    const today = new Date().toISOString().slice(0, 10);
    const seen = new Set<string>();
    const rows = perSource.flatMap((r) =>
      r.found
        .filter((c) => !c.deadline || c.deadline >= today)
        .filter((c) => {
          const k = `${c.official_link}|${c.title.toLowerCase()}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        })
        .map((c) => ({
          title: c.title,
          university: c.university,
          country: c.country,
          degree_levels: c.degree_levels,
          funding_type: c.funding_type,
          coverage_details: c.coverage_details || null,
          deadline: c.deadline,
          official_link: c.official_link,
          source_url: c.source_url,
          source_group: r.group,
          details: c.details,
        })),
    );

    let added = 0;
    if (rows.length) {
      const { data: inserted, error } = await context.supabase
        .from("sync_candidates")
        .upsert(rows, { onConflict: "official_link,title", ignoreDuplicates: true })
        .select("id");
      if (error) console.error("sync upsert failed", error);
      added = inserted?.length ?? 0;
    }
    return { added, failed: perSource.filter((r) => !r.ok).map((r) => r.url) };
  });
