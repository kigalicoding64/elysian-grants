import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchArticleBySlug, formatDate } from "@/lib/content";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — ElScholarship` },
      {
        name: "description",
        content: "Scholarship guidance from the ElScholarship editorial team.",
      },
      { property: "og:title", content: "ElScholarship guide" },
      {
        property: "og:description",
        content: "Scholarship guidance from the ElScholarship editorial team.",
      },
    ],
  }),
  component: ArticlePage,
  errorComponent: ({ error }) => (
    <ArticleMessage title="This guide didn't load" body={error.message} />
  ),
  notFoundComponent: () => (
    <ArticleMessage title="Guide not found" body="This article may have been unpublished." />
  ),
});

function ArticleMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <Link to="/articles" className="mt-6 inline-block text-sm font-semibold text-primary">
          Back to all guides
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const article = await fetchArticleBySlug(slug);
      if (!article) throw notFound();
      return article;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-14 sm:px-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ArticleMessage
        title="Guide unavailable"
        body={(error as Error | null)?.message ?? "This article may have been unpublished."}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All guides
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-primary">
            {data.category}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {data.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {data.author ?? "Editorial Team"} · {formatDate(data.published_at)}
          </p>

          {data.featured_image ? (
            <img
              src={data.featured_image}
              alt={data.title}
              className="mt-8 w-full rounded-xl object-cover"
            />
          ) : null}

          <div className="prose-content mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
