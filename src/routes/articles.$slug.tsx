import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdBanner } from "@/components/ui/ad-banner";
import { formatDate } from "@/lib/content";
import { articleQuery } from "@/lib/public-content-queries";
import { heroImageFor } from "@/lib/hero";

const SITE_URL = "https://elysian-grants.lovable.app";

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ params, context }) => {
    const article = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    if (!article) throw notFound();
    return article;
  },
  head: ({ params, loaderData }) => {
    const url = `${SITE_URL}/articles/${params.slug}`;
    const readable = loaderData?.meta_title || loaderData?.title || "Scholarship guide unavailable";
    const cover = loaderData?.featured_image || heroImageFor(params.slug);
    const hero = cover.startsWith("https://") ? cover : `${SITE_URL}${cover}`;
    const description = loaderData?.meta_description || loaderData?.summary || "Scholarship application guidance for students in Rwanda from ElScholarship.";
    return {
      meta: [
        { title: `${readable} — ElScholarship` },
        { name: "description", content: description },
        {
          name: "keywords",
          content: (loaderData?.target_keywords ?? ["scholarship applications Rwanda", "study abroad funding"]).join(", "),
        },
        { property: "og:title", content: `${readable} — ElScholarship` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: hero },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: hero },
        { property: "article:author", content: loaderData?.author || "ElScholarship Team" },
        { name: "robots", content: loaderData ? "index, follow, max-image-preview:large" : "noindex" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: loaderData?.title || readable,
            ...(loaderData?.published_at ? { datePublished: loaderData.published_at } : {}),
            description,
            mainEntityOfPage: url,
            image: hero,
            author: { "@type": "Organization", name: loaderData?.author || "ElScholarship Team" },
            publisher: {
              "@type": "Organization",
              name: "ElScholarship",
            },
            },
          }),
        },
      ],
    };
  },

  component: ArticlePage,
  errorComponent: ({ error }) => (
    <ArticleMessage title="This guide didn't load" body={error instanceof Error ? error.message : "Unknown error"} />
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
  const { data } = useSuspenseQuery(articleQuery(slug));
  const isLoading = false;
  const isError = false;
  const error = null;

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

      <img
        src={data.featured_image || heroImageFor(slug)}
        alt={data.title}
        loading="lazy"
        className="mt-8 h-56 w-full rounded-xl object-cover sm:h-72"
      />

      {/* Google Ad - Top of Article */}
      <AdBanner 
        provider="adsense"
        slot="2345678901"
        format="auto"
        className="mt-8"
        label="Sponsored Content"
      />

      <div className="prose-content mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
      </div>

      {/* Google Ad - Mid Article */}
      <AdBanner 
        provider="adsense"
        slot="4567890123"
        format="auto"
        className="my-8"
        label="Sponsored"
      />

      {/* Google Ad - Bottom of Article */}
      <AdBanner 
        provider="adsense"
        slot="6789012345"
        format="auto"
        className="mt-8"
        label="Sponsored Content"
      />
    </div>
  );
}
