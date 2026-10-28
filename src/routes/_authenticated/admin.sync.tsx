import { useMemo, useState } from "react";
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
import { scanPortal, type SyncCandidate } from "@/lib/sync.functions";

export const Route = createFileRoute("/_authenticated/admin/sync")({
  head: () => ({
    meta: [
      { title: "Sync & Review Desk — ElScholarship Admin" },
      { name: "description", content: "Scan public scholarship portals, review opportunities and feature them in one click." },
      { property: "og:title", content: "Sync & Review Desk — ElScholarship Admin" },
      { property: "og:description", content: "Import live scholarship announcements from any portal." },
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

type Item = SyncCandidate & { key: string; status: "new" | "published" | "dismissed" };

function SyncDesk() {
  const scan = useServerFn(scanPortal);
  const qc = useQueryClient();
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"page" | "portal">("portal");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const existing = useQuery({
    queryKey: ["sync-existing-titles"],
    queryFn: async () => {
      const { data } = await supabase.from("scholarships").select("title");
      return new Set((data ?? []).map((r) => r.title.toLowerCase().trim()));
    },
  });

  const run = async (target = url) => {
    if (!target.trim()) return;
    setUrl(target);
    setLoading(true);
    try {
      const r = await scan({ data: { url: target, mode } });
      const fresh = r.candidates.map((c, i) => ({ ...c, key: `${Date.now()}-${i}`, status: "new" as const }));
      setItems((prev) => [...fresh, ...prev]);
      toast.success(`Scanned ${r.scannedPages} page(s) — found ${fresh.length} opportunities`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, patch: Partial<Item>) =>
    setItems((p) => p.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const publish = async (list: Item[]) => {
    const rows = list.map((i) => ({
      title: i.title,
      university: i.university || "To be confirmed",
      country: i.country || "Global",
      degree_levels: i.degree_levels.length ? i.degree_levels : ["Master's"],
      funding_type: i.funding_type,
      coverage_details: i.coverage_details || null,
      official_link: i.official_link,
      deadline: i.deadline,
      status: "published" as const,
    }));
    const { error } = await supabase.from("scholarships").insert(rows);
    if (error) {
      toast.error(error.message);
      return;
    }
    list.forEach((i) => update(i.key, { status: "published" }));
    setSelected(new Set());
    qc.invalidateQueries();
    toast.success(`${rows.length} scholarship(s) now featured on the website`);
  };

  const pending = useMemo(() => items.filter((i) => i.status === "new"), [items]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Sync & Review Desk</h1>
          <p className="text-sm text-muted-foreground">
            Enter any public portal (e.g. studyinchina.cn) — we read its active announcements so you can review and feature them.
          </p>
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
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Scan
              </Button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                disabled={loading}
                onClick={() => run(p)}
                className="neu-btn flex items-center gap-1 rounded-full px-3 py-1 text-xs"
              >
                <Globe className="size-3" /> {new URL(p).hostname.replace("www.", "")}
              </button>
            ))}
          </div>
          {loading && <p className="text-sm text-muted-foreground">Reading the site… this can take up to a minute.</p>}
        </div>

        {pending.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{pending.length} waiting for review</p>
            <Button
              disabled={selected.size === 0}
              onClick={() => publish(pending.filter((i) => selected.has(i.key)))}
            >
              <Star className="size-4" /> Feature selected ({selected.size})
            </Button>
          </div>
        )}

        {items.length === 0 && !loading && (
          <div className="neu-pressed rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No opportunities yet. Scan a portal to start.
          </div>
        )}

        <div className="grid gap-4">
          {items.map((i) => {
            const dup = existing.data?.has(i.title.toLowerCase().trim());
            return (
              <div key={i.key} className={`neu-flat rounded-2xl p-5 ${i.status !== "new" ? "opacity-60" : ""}`}>
                <div className="flex items-start gap-3">
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
                  <div className="min-w-0 flex-1 space-y-2">
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
                    {i.coverage_details && <p className="text-sm text-muted-foreground">{i.coverage_details}</p>}
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
                        <Button size="sm" onClick={() => publish([i])}>
                          <Star className="size-4" /> Feature
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => update(i.key, { status: "dismissed" })}>
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
