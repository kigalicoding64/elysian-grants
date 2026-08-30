import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";
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
    <div className="w-full">
      {/* Hero Header Section */}
      <section className="border-b border-slate-200 bg-slate-900 text-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Guides &amp; Insights
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Everything we have learned from managing scholarship applications, written for students.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-10 border-slate-200 pl-9 text-xs dark:border-slate-800"
            maxLength={100}
            placeholder="Search guides..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                category === c
                  ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Dynamic States (Loading, Error, Empty, List) */}
        {isLoading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 rounded-xl border border-red-200 bg-red-50 p-10 text-center text-xs font-medium text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {(error as Error).message}
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No articles published matching your search criteria.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((a) => (
              <article
                key={a.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                {a.featured_image && (
                  <div className="overflow-hidden">
                    <img
                      src={a.featured_image}
                      alt={a.title}
                      loading="lazy"
                      className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                    {a.category}
                  </span>
                  <h2 className="mt-2 text-base font-bold leading-snug text-slate-900 dark:text-slate-100">
                    {a.title}
                  </h2>
                  {a.summary && (
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {a.summary}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-5 text-xs text-slate-400">
                    <span>{formatDate(a.published_at)}</span>
                    <Link
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
                    >
                      Read <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
