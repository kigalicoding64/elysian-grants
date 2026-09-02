import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Clock,
  GraduationCap,
  MapPin,
  Bookmark,
  ArrowBigUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/ui/ad-banner";
import { ApplyModal } from "@/components/apply-modal";
import { supabase } from "@/integrations/supabase/client";
import { useSavedScholarship, useUpvotedScholarship } from "@/lib/engagement";
import { heroImageFor } from "@/lib/hero";
import {
  coverageTags,
  deadlineLabel,
  scholarshipStatusTag,
  type Scholarship,
} from "@/lib/scholarship";

const SITE_URL = "https://elysian-grants.lovable.app";

export const Route = createFileRoute("/scholarships/$id")({
  head: ({ params }) => {
    const url = `${SITE_URL}/scholarships/${params.id}`;
    const hero = heroImageFor(params.id);
    return {
      meta: [
        { title: "Scholarship Details — ElScholarship" },
        {
          name: "description",
          content:
            "Full details for this verified scholarship: funding scope, eligibility, deadline and how to apply with managed concierge support.",
        },
        {
          name: "keywords",
          content: "Scholarships, Fully Funded, University Grants, Study Abroad, Education",
        },
        { property: "og:title", content: "Scholarship Details — ElScholarship" },
        {
          property: "og:description",
          content:
            "Verified scholarship listing with funding scope, deadline and managed application support.",
        },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: hero },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: hero },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "Verified scholarship",
            url,
            image: hero,
            provider: { "@type": "Organization", name: "ElScholarship" },
          }),
        },
      ],
    };
  },
  component: ScholarshipDetailPage,
});


function ScholarshipDetailPage() {
  const { id } = Route.useParams();
  const [applyOpen, setApplyOpen] = useState(false);
  const { active: isSaved, toggle: toggleSaved } = useSavedScholarship(id);
  const { active: isUpvoted, toggle: toggleUpvote } = useUpvotedScholarship(id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as Scholarship | null;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Scholarship not available
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This listing may have been removed or is no longer published.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-6">
          <Link to="/">Back to directory</Link>
        </Button>
      </div>
    );
  }

  const scholarship = data;
  const statusTag = scholarshipStatusTag(scholarship.deadline);
  const heroImage = heroImageFor(scholarship.id);

  return (
    <div className="w-full bg-slate-50/50 pb-20 dark:bg-slate-950">
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <img
          src={heroImage}
          alt={`${scholarship.university} campus`}
          loading="lazy"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container mx-auto max-w-4xl px-4 pb-6 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              {scholarship.country}
            </p>
            <p className="mt-1 text-lg font-bold text-white sm:text-2xl">{scholarship.title}</p>
          </div>
        </div>
      </div>
      <section className="border-b border-slate-200/80 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">

        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400"
          >
            <ArrowLeft className="size-3.5" /> Back to directory
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {scholarship.degree_levels.map((level) => (
              <span
                key={level}
                className="rounded-md bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-100 dark:bg-slate-100 dark:text-slate-900"
              >
                {level}
              </span>
            ))}
            <span
              className={`rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                scholarship.funding_type === "full"
                  ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {scholarship.funding_type === "full" ? "100% Funded" : "Partial Grant"}
            </span>
            <span
              className={`rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                statusTag === "Closed"
                  ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  : statusTag === "Closing Today"
                    ? "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                    : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
              }`}
            >
              {statusTag}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            {scholarship.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Building2 className="size-4 text-slate-400" /> {scholarship.university}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-slate-400" /> {scholarship.country}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 text-slate-400" /> {deadlineLabel(scholarship.deadline)}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              onClick={() => setApplyOpen(true)}
              className="bg-slate-900 text-sm font-semibold text-amber-400 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
            >
              Apply with Managed Concierge
            </Button>
            {scholarship.official_link ? (
              <Button asChild variant="outline" className="text-sm font-semibold">
                <a href={scholarship.official_link} target="_blank" rel="noopener noreferrer">
                  Official Link <ArrowUpRight className="ml-1 size-3.5" />
                </a>
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="text-sm font-semibold"
              aria-pressed={isSaved}
              onClick={() => {
                const saved = toggleSaved();
                toast.success(saved ? "Saved to your list" : "Removed from your list");
              }}
            >
              <Bookmark className={`mr-1 size-4 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="text-sm font-semibold"
              aria-pressed={isUpvoted}
              onClick={() => {
                const up = toggleUpvote();
                toast.success(up ? "Upvoted" : "Upvote removed");
              }}
            >
              <ArrowBigUp className={`mr-1 size-4 ${isUpvoted ? "fill-emerald-500" : ""}`} />
              {isUpvoted ? "Upvoted" : "Upvote"}
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Coverage & Benefits
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {scholarship.coverage_details ??
                "Full coverage details are confirmed with your advisory officer during the managed application process."}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {coverageTags(scholarship.coverage_details).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-50/50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              At a glance
            </h2>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">Degrees</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-200">
                  {scholarship.degree_levels.join(", ") || "—"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">Funding</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-200">
                  {scholarship.funding_type === "full" ? "Fully funded" : "Partial"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">Host</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-200">
                  {scholarship.university}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">Deadline</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-200">
                  {deadlineLabel(scholarship.deadline)}
                </dd>
              </div>
            </dl>
            <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <GraduationCap className="size-3.5" /> Verified by ElScholarship advisors
            </p>
          </aside>
        </div>

        <AdBanner slot="1234567890" className="mt-8" />
      </main>

      <ApplyModal scholarship={scholarship} open={applyOpen} onOpenChange={setApplyOpen} />
    </div>
  );
}
