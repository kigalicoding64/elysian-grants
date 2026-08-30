import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchArticles, formatDate } from "@/lib/content";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "Scholarship Guides & Insights — ElScholarship" },
      {
        name: "description",
        content:
          "Practical guides on scholarship applications, statements of purpose, visas and studying abroad on full funding.",
      },
      { property: "og:title", content: "Scholarship Guides & Insights — ElScholarship" },
      {
        property: "og:description",
        content: "Editorial guides for students applying to fully funded scholarships.",
      },
    ],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  const categories = useMemo(
    () => ["All", ...Array.from(new Set((data ?? []).map((a) => a.category))).sort()],
    [data],
  );

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    return (data ?? []).filter(
      (a) =>
        (!q || a.title.toLowerCase().includes(q) || (a.summary ?? "").toLowerCase().includes(q)) &&
        (category === "All" || a.category === category),
    );
  }, [data, term, category]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="hero-surface border-b border-border/60">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Guides &amp; insights
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Everything we have learned from managing scholarship applications, written for
              students.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              maxLength={100}
              placeholder="Search guides"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? "bg-navy text-navy-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <p className="mt-10 rounded-xl border border-border bg-card p-10 text-center text-sm text-destructive">
              {(error as Error).message}
            </p>
          ) : rows.length === 0 ? (
            <p className="mt-10 rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No articles published in this category yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((a) => (
                <article
                  key={a.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card"
                >
                  {a.featured_image ? (
                    <img
                      src={a.featured_image}
                      alt={a.title}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {a.category}
                    </span>
                    <h2 className="mt-2 text-lg font-semibold leading-snug">{a.title}</h2>
                    {a.summary ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.summary}</p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between pt-5 text-xs text-muted-foreground">
                      <span>{formatDate(a.published_at)}</span>
                      <Link
                        to="/articles/$slug"
                        params={{ slug: a.slug }}
                        className="inline-flex items-center gap-1 font-semibold text-primary"
                      >
                        Read <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
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
