import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink, Globe, Loader2, Sparkles, Star, X } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { scanPortal, syncSourceBatch, type SyncCandidate } from "@/lib/sync.functions";
import { SYNC_SOURCES, type SourceGroup } from "@/lib/sync-sources";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Square } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/sync")({
  head: () => ({
    meta: [
      { title: "Sync & Review Desk — ElScholarship Admin" },
      { name: "description", content: "Scan public scholarship portals, review opportunities and feature them in one click." },
      { property: "og:title", content: "Sync & Review Desk — ElScholarship Admin" },
      { property: "og:description", content: "Import live scholarship announcements from any portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SyncDesk,
});

const PRESETS = [
  "https://www.campuschina.org",
  "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
  "https://www.campusfrance.org/en",
  "https://www.chevening.org/scholarships/",
  "https://www.mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/",
  "https://hec.gov.rw",
];

type Item = SyncCandidate & { key: string; status: "new" | "published" | "dismissed"; id?: string };

const BATCH = 4;

function SyncDesk() {
  const scan = useServerFn(scanPortal);
  const syncBatch = useServerFn(syncSourceBatch);
  const qc = useQueryClient();
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"page" | "portal">("portal");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedLoading, setSavedLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulk, setBulk] = useState<{ done: number; total: number; found: number; current: string; failed: number } | null>(null);
  const stopRef = useRef(false);

  const existing = useQuery({
    queryKey: ["sync-existing-titles"],
    queryFn: async () => {
      const { data } = await supabase.from("scholarships").select("title");
      return new Set((data ?? []).map((r) => r.title.toLowerCase().trim()));
    },
  });

  const loadSaved = async () => {
    const { data, error } = await supabase
      .from("sync_candidates")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(500);
    setSavedLoading(false);
    if (error) { toast.error(`Could not load reviews: ${error.message}`); return; }
    const saved: Item[] = (data ?? []).map((r) => ({
      id: r.id,
      key: r.id,
      title: r.title,
      university: r.university,
      country: r.country,
      degree_levels: r.degree_levels,
      funding_type: r.funding_type === "partial" ? "partial" : "full",
      coverage_details: r.coverage_details ?? "",
      deadline: r.deadline,
      official_link: r.official_link,
      source_url: r.source_url,
      details: (r.details as SyncCandidate["details"]) ?? null,
      status: "new",
    }));
    setItems((prev) => [...prev.filter((p) => !p.id), ...saved]);
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const runAll = async (group?: SourceGroup) => {
    if (loading || syncing) return;
    setSyncing(true);
    const list = group ? SYNC_SOURCES.filter((s) => s.group === group) : SYNC_SOURCES;
    stopRef.current = false;
    setBulk({ done: 0, total: list.length, found: 0, current: "", failed: 0 });
    let done = 0;
    let found = 0;
    let failed = 0;
    for (let i = 0; i < list.length; i += BATCH) {
      if (stopRef.current) break;
      const chunk = list.slice(i, i + BATCH);
      setBulk({ done: i, total: list.length, found, current: chunk.map((c) => c.url.split("/")[0]).join(", "), failed });
      try {
        const r = await syncBatch({ data: { sources: chunk } });
        found += r.added;
        failed += r.failed.length;
      } catch (error) {
        failed += chunk.length;
        toast.error(error instanceof Error ? error.message : "Batch failed");
        stopRef.current = true;
      }
      done += chunk.length;
      setBulk({ done, total: list.length, found, current: "", failed });
    }
    setBulk((b) => (b ? { ...b, done, found, failed, current: "" } : b));
    await loadSaved();
    setSyncing(false);
    toast.success(`${stopRef.current ? "Sync stopped" : "Sync finished"} — ${found} saved for review, ${failed} sources with failed reads`);
  };

  const run = async (target = url) => {
    if (!target.trim() || loading || syncing) return;
    setUrl(target);
    setLoading(true);
    try {
      const r = await scan({ data: { url: target, mode } });
      await loadSaved();
      toast.success(`Scanned ${r.scannedPages} page(s) — ${r.added} new saved, ${r.failed.length} failed reads`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, patch: Partial<Item>) =>
    setItems((p) => p.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const markSaved = async (list: Item[], status: "published" | "dismissed") => {
    const ids = list.map((i) => i.id).filter((x): x is string => !!x);
    if (ids.length) {
      const { error } = await supabase.from("sync_candidates").update({ status }).in("id", ids);
      if (error) throw new Error(error.message);
    }
  };

  const dismiss = async (i: Item) => {
    setSaving(true);
    try { await markSaved([i], "dismissed"); update(i.key, { status: "dismissed" }); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not dismiss"); }
    finally { setSaving(false); }
  };

  const publish = async (list: Item[]) => {
    if (!list.length || saving) return;
    if (list.some(i => !i.title.trim() || !i.university.trim() || !i.country.trim() || !i.degree_levels.length)) {
      toast.error("Add a title, institution, country, and degree before featuring."); return;
    }
    setSaving(true);
    try {
    const { data: published, error: checkError } = await supabase.from("scholarships").select("title").eq("status", "published");
    if (checkError) throw new Error(checkError.message);
    const titles = new Set((published ?? []).map(row => row.title.toLowerCase().trim()));
    if (list.some(i => titles.has(i.title.toLowerCase().trim()))) throw new Error("This scholarship is already featured. Dismiss the duplicate review instead.");
    const rows = list.map((i) => ({
      title: i.title,
      university: i.university.trim(),
      country: i.country.trim(),
      degree_levels: i.degree_levels,
      funding_type: i.funding_type,
      coverage_details: i.coverage_details || null,
      official_link: i.official_link,
      deadline: i.deadline,
      details: i.details ?? null,
      status: "published" as const,
    }));
    const { error } = await supabase.from("scholarships").insert(rows);
    if (error) {
      toast.error(error.message);
      return;
    }
    list.forEach((i) => update(i.key, { status: "published" }));
    await markSaved(list, "published");
    setSelected(new Set());
    qc.invalidateQueries();
    toast.success(`${rows.length} scholarship(s) now featured on the website`);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not feature"); }
    finally { setSaving(false); }
  };

  const pending = useMemo(() => items.filter((i) => i.status === "new"), [items]);
  const govCount = SYNC_SOURCES.filter((s) => s.group === "government").length;
  const schCount = SYNC_SOURCES.length - govCount;

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Sync & Review Desk</h1>
          <p className="text-sm text-muted-foreground">
            Review public scholarship announcements before featuring them.
          </p>
        </div>

        <div className="neu-flat space-y-4 rounded-2xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Get all new updates</h2>
              <p className="text-sm text-muted-foreground">
                Checks up to three pages per source across {govCount} government scholarship portals and {schCount} scholarship & university websites. Found listings are saved here for review. Web reading uses Lovable credits; this is a bounded scan, not every page on every site.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {syncing ? (
                <Button variant="outline" onClick={() => (stopRef.current = true)}>
                  <Square className="size-4" /> Stop
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => runAll()} disabled={loading || syncing}>
                    <RefreshCw className="size-4" /> Sync all {SYNC_SOURCES.length} sources
                  </Button>
                  <Button variant="outline" onClick={() => runAll("government")} disabled={loading || syncing}>Government only</Button>
                </>
              )}
            </div>
          </div>
          {bulk && (
            <div className="space-y-1">
              <Progress value={(bulk.done / bulk.total) * 100} />
              <p className="text-xs text-muted-foreground">
                {bulk.done}/{bulk.total} sources checked · {bulk.found} new found · {bulk.failed} unreachable
                {bulk.current && ` · now reading ${bulk.current}`}
              </p>
              {syncing && <p className="text-xs text-muted-foreground">Keep this page open while it runs. A full sync can take 30–60 minutes.</p>}
            </div>
          )}
        </div>

        <div className="neu-flat space-y-4 rounded-2xl p-5">
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              run();
            }}
          >
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="studyinchina.cn or a scholarship page link" />
            <div className="flex gap-2">
              <Button type="button" variant={mode === "portal" ? "default" : "outline"} onClick={() => setMode("portal")}>
                Whole site
              </Button>
              <Button type="button" variant={mode === "page" ? "default" : "outline"} onClick={() => setMode("page")}>
                One page
              </Button>
              <Button type="submit" disabled={loading || syncing}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Scan
              </Button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                variant="outline"
                size="sm"
                key={p}
                disabled={loading || syncing}
                onClick={() => run(p)}
                className="neu-btn flex items-center gap-1 rounded-full px-3 py-1 text-xs"
              >
                <Globe className="size-3" /> {new URL(p).hostname.replace("www.", "")}
              </Button>
            ))}
          </div>
          {loading && <p className="text-sm text-muted-foreground">Reading the site… this can take up to a minute.</p>}
        </div>

        {pending.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{pending.length} waiting for review</p>
            <Button
              disabled={selected.size === 0 || saving}
              onClick={() => publish(pending.filter((i) => selected.has(i.key)))}
            >
              <Star className="size-4" /> Feature selected ({selected.size})
            </Button>
          </div>
        )}

        {items.length === 0 && !loading && !savedLoading && (
          <div className="neu-pressed rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No opportunities yet. Scan a portal to start.
          </div>
        )}

        {savedLoading && <p role="status" className="text-sm text-muted-foreground">Loading saved reviews…</p>}
        <div className="grid gap-4">
          {items.map((i) => {
            const dup = existing.data?.has(i.title.toLowerCase().trim());
            return (
              <div key={i.key} className={`neu-flat rounded-2xl p-5 ${i.status !== "new" ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap">
                  {i.status === "new" && (
                    <Checkbox
                      checked={selected.has(i.key)}
                      onCheckedChange={(v) =>
                        setSelected((s) => {
                          const n = new Set(s);
                          v ? n.add(i.key) : n.delete(i.key);
                          return n;
                        })
                      }
                    />
                  )}
                  <div className="min-w-0 flex-1 basis-48 space-y-2">
                    <Input value={i.title} disabled={i.status !== "new"} onChange={(e) => update(i.key, { title: e.target.value })} />
                    <div className="grid gap-2 sm:grid-cols-4">
                      <Input placeholder="Institution" value={i.university} disabled={i.status !== "new"} onChange={(e) => update(i.key, { university: e.target.value })} />
                      <Input placeholder="Country" value={i.country} disabled={i.status !== "new"} onChange={(e) => update(i.key, { country: e.target.value })} />
                      <Input type="date" value={i.deadline ?? ""} disabled={i.status !== "new"} onChange={(e) => update(i.key, { deadline: e.target.value || null })} />
                      <select
                        className="neu-pressed rounded-full px-3 text-sm"
                        value={i.funding_type}
                        disabled={i.status !== "new"}
                        onChange={(e) => update(i.key, { funding_type: e.target.value as "full" | "partial" })}
                      >
                        <option value="full">Fully funded</option>
                        <option value="partial">Partial</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {["Undergraduate", "Master's", "PhD"].map(degree => (
                        <label key={degree} className="flex items-center gap-2">
                          <Checkbox disabled={i.status !== "new"} checked={i.degree_levels.includes(degree)} onCheckedChange={checked => update(i.key, { degree_levels: checked ? [...i.degree_levels, degree] : i.degree_levels.filter(d => d !== degree) })} />
                          {degree}
                        </label>
                      ))}
                    </div>
                    <Input aria-label="Official announcement link" value={i.official_link} disabled={i.status !== "new"} onChange={e => update(i.key, { official_link: e.target.value })} />
                    <label className="block text-xs text-muted-foreground">Coverage
                      <textarea aria-label="Coverage" className="neu-pressed mt-1 min-h-20 w-full rounded-lg p-3 text-sm text-foreground" value={i.coverage_details} disabled={i.status !== "new"} onChange={e => update(i.key, { coverage_details: e.target.value })} />
                    </label>
                    {i.details && (
                      <details className="neu-pressed rounded-xl p-3 text-sm">
                        <summary className="cursor-pointer font-medium">Full details found</summary>
                        <dl className="mt-2 space-y-2">
                          {(
                            [
                              ["Institution & location", i.details.about_institution],
                              ["What is covered", i.details.coverage_summary],
                              ["Eligibility", i.details.eligibility],
                              ["Financial criteria", i.details.financial_criteria],
                              ["Required documents", i.details.required_documents],
                              ["How to apply / student duties", i.details.student_responsibilities],
                            ] as const
                          )
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <div key={k}>
                                <dt className="text-xs font-semibold uppercase text-muted-foreground">{k}</dt>
                                <dd><textarea aria-label={k} className="mt-1 min-h-24 w-full rounded-lg bg-background p-2 text-sm" value={v ?? ""} disabled={i.status !== "new"} onChange={e => {
                                  const fields: Record<string, string> = { "Institution & location": "about_institution", "What is covered": "coverage_summary", "Eligibility": "eligibility", "Financial criteria": "financial_criteria", "Required documents": "required_documents", "How to apply / student duties": "student_responsibilities" };
                                  const field = fields[k];
                                  if (field) update(i.key, { details: { ...i.details, [field]: e.target.value } });
                                }} /></dd>
                              </div>
                            ))}
                          {i.details.coverage_tags?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {i.details.coverage_tags.map((t) => (
                                <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{t}</span>
                              ))}
                            </div>
                          ) : null}
                        </dl>
                      </details>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{i.degree_levels.join(", ") || "Degree not stated"}</span>
                      <a href={i.official_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                        Source <ExternalLink className="size-3" />
                      </a>
                      {dup && <span className="rounded-full bg-secondary px-2 py-0.5">Already on website</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {i.status === "new" ? (
                      <>
                        <Button size="sm" disabled={saving || !!dup} onClick={() => publish([i])}>
                          <Star className="size-4" /> Feature
                        </Button>
                        <Button size="sm" variant="ghost" disabled={saving} onClick={() => dismiss(i)}>
                          <X className="size-4" /> Dismiss
                        </Button>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs">
                        <CheckCircle2 className="size-4" /> {i.status === "published" ? "Featured" : "Dismissed"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
