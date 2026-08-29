import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Globe2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ScholarshipCard } from "@/components/scholarship-card";
import { ApplyModal } from "@/components/apply-modal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { DEGREE_LEVELS, REGIONS, type Scholarship } from "@/lib/scholarship";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElScholarship — Fully Funded Scholarships Worldwide" },
      {
        name: "description",
        content:
          "Browse 100% verified fully funded scholarships, tuition waivers and government grants, or let our officers manage your application end to end.",
      },
      { property: "og:title", content: "ElScholarship — Fully Funded Scholarships Worldwide" },
      {
        property: "og:description",
        content:
          "Verified global scholarship listings plus managed concierge application services for students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [degree, setDegree] = useState("all");
  const [funding, setFunding] = useState("all");
  const [region, setRegion] = useState("all");
  const [selected, setSelected] = useState<Scholarship | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["scholarships", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("status", "published")
        .order("deadline", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Scholarship[];
    },
  });

  const results = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return (data ?? []).filter((s) => {
      const matchesTerm =
        !term ||
        s.title.toLowerCase().includes(term) ||
        s.university.toLowerCase().includes(term) ||
        s.country.toLowerCase().includes(term);
      const matchesDegree = degree === "all" || s.degree_levels.includes(degree);
      const matchesFunding = funding === "all" || s.funding_type === funding;
      const matchesRegion =
        region === "all" || s.country.toLowerCase().includes(region.toLowerCase());
      return matchesTerm && matchesDegree && matchesFunding && matchesRegion;
    });
  }, [data, keyword, degree, funding, region]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-surface text-navy-foreground">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="size-3.5" /> Every listing manually verified
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              Find &amp; Apply for Fully Funded Scholarships Worldwide
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-navy-foreground/75">
              Explore 100% verified grants, tuition waivers, and managed application services.
            </p>

            <div className="mt-10 grid gap-3 rounded-2xl bg-card p-4 text-card-foreground shadow-elevated md:grid-cols-[2fr_1fr_1fr_1fr]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search scholarships"
                  placeholder="Search by title or university"
                  className="pl-9"
                  maxLength={100}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <Select value={degree} onValueChange={setDegree}>
                <SelectTrigger aria-label="Degree level">
                  <SelectValue placeholder="Degree level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All degree levels</SelectItem>
                  {DEGREE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={funding} onValueChange={setFunding}>
                <SelectTrigger aria-label="Funding type">
                  <SelectValue placeholder="Funding type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All funding types</SelectItem>
                  <SelectItem value="full">Fully Funded</SelectItem>
                  <SelectItem value="partial">Partially / Government Sponsored</SelectItem>
                </SelectContent>
              </Select>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger aria-label="Region">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Verified opportunities</h2>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading listings…" : `${results.length} scholarship(s) available`}
              </p>
            </div>
            <p className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <Globe2 className="size-4" /> Updated continuously
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full rounded-xl" />
                ))
              : results.map((s) => (
                  <ScholarshipCard key={s.id} scholarship={s} onManagedApply={setSelected} />
                ))}
          </div>

          {!isLoading && results.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <Sparkles className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No scholarships match those filters</p>
              <p className="text-sm text-muted-foreground">
                Try a broader region or clear the keyword search.
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <SiteFooter />

      <ApplyModal
        scholarship={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}
