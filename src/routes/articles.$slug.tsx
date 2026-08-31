import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdBanner } from "@/components/ui/ad-banner";
import { fetchArticleBySlug, formatDate } from "@/lib/content";

const SITE_URL = "https://elysian-grants.lovable.app";
const OG_IMAGE = `${SITE_URL}/elscholaship-logo.jpg`;

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    const url = `${SITE_URL}/articles/${params.slug}`;
    const readable = params.slug.replace(/-/g, " ");
    return {
      meta: [
        { title: `${readable} — ElScholarship` },
        {
          name: "description",
          content: "Scholarship guidance from the ElScholarship editorial team.",
        },
        { property: "og:title", content: `${readable} — ElScholarship` },
        {
          property: "og:description",
          content: "Scholarship guidance from the ElScholarship editorial team.",
        },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
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
    <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Link to="/articles" className="mt-6 inline-block text-sm font-semibold text-primary">
        Back to all guides
      </Link>
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
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-14 sm:px-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-64 w-full" />
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

      <AdBanner slot="2345678901" className="mt-8" />

      <div className="prose-content mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
      </div>

      <AdBanner slot="3456789012" className="mt-10" />
    </div>
  );
}
