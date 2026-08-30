import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, ExternalLink, MapPin, Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchUniversities } from "@/lib/content";

export const Route = createFileRoute("/universities")({
  head: () => ({
    meta: [
      { title: "University Directory — ElScholarship" },
      {
        name: "description",
        content:
          "Browse verified universities with campuses, popular faculties and tuition ranges to plan your funded study abroad.",
      },
      { property: "og:title", content: "University Directory — ElScholarship" },
      {
        property: "og:description",
        content: "Verified universities, faculties and tuition ranges in one directory.",
      },
    ],
  }),
  component: UniversitiesPage,
});

function UniversitiesPage() {
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["universities"],
    queryFn: fetchUniversities,
  });

  const countries = useMemo(
    () => Array.from(new Set((data ?? []).map((u) => u.country))).sort(),
    [data],
  );

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    return (data ?? []).filter(
      (u) =>
        (!q ||
          u.name.toLowerCase().includes(q) ||
          (u.acronym ?? "").toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q)) &&
        (country === "all" || u.country === country),
    );
  }, [data, term, country]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="hero-surface border-b border-border/60">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              University directory
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Verified institutions hosting the scholarships in our directory — campuses, popular
              faculties and indicative tuition.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-60 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                maxLength={100}
                placeholder="Search university, acronym or city"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-52" aria-label="Filter by country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-56 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <p className="mt-10 rounded-xl border border-border bg-card p-10 text-center text-sm text-destructive">
              {(error as Error).message}
            </p>
          ) : rows.length === 0 ? (
            <p className="mt-10 rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No universities match your search yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((u) => (
                <article
                  key={u.id}
                  className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Building2 className="size-4" />
                    {u.type ?? "University"}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold leading-snug">
                    {u.name}
                    {u.acronym ? (
                      <span className="text-muted-foreground"> ({u.acronym})</span>
                    ) : null}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {u.city}, {u.country}
                  </p>
                  {u.description ? (
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {u.description}
                    </p>
                  ) : null}
                  {u.popular_faculties?.length ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {u.popular_faculties.slice(0, 4).map((f) => (
                        <li
                          key={f}
                          className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="text-xs text-muted-foreground">
                      {u.tuition_range ?? "Tuition on request"}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <a href={u.website} target="_blank" rel="noopener noreferrer">
                        Website <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
