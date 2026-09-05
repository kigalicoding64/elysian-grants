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
    <div className="w-full px-3 pb-20 sm:px-6">
      <div className="neu-flat relative mt-4 h-56 w-full overflow-hidden rounded-[40px] sm:h-72">
        <img
          src={heroImage}
          alt={`${scholarship.university} campus`}
          loading="lazy"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#374151]/80 via-[#374151]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container mx-auto max-w-4xl px-6 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              {scholarship.country}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-50 sm:text-2xl">{scholarship.title}</p>
          </div>
        </div>
      </div>
      <section className="py-10">

        <div className="container mx-auto max-w-4xl">

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
                className="neu-pressed rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#374151]"
              >
                {level}
              </span>
            ))}
            <span
              className={`neu-pressed rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                scholarship.funding_type === "full" ? "text-[#b45309]" : "text-[#6b7280]"
              }`}
            >
              {scholarship.funding_type === "full" ? "100% Funded" : "Partial Grant"}
            </span>
            <span
              className={`neu-pressed rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                statusTag === "Closed"
                  ? "text-[#6b7280]"
                  : statusTag === "Closing Today"
                    ? "text-[#b91c1c]"
                    : "text-[#047857]"
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
            <Button onClick={() => setApplyOpen(true)} className="text-sm text-[#047857]">
              Apply Now
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

      <main className="container mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard icon={Building2} eyebrow="Section 01" title={`About ${detail.institution.name} & ${detail.institution.location}`}>
              <p>{detail.institution.about}</p>
            </SectionCard>

            <SectionCard icon={BadgeCheck} eyebrow="Section 02" title="What Is Covered by the Scholarship">
              <p>{detail.coverageAndBenefits.summary}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {detail.coverageAndBenefits.tags.map((tag) => (
                  <span
                    key={tag}
                    className="neu-pressed rounded-full px-3 py-1 text-[10px] font-medium text-[#6b7280]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon={GraduationCap} eyebrow="Section 03" title="Eligibility & Admission Requirements">
              <p>{detail.eligibilityAndRequirements.description}</p>
            </SectionCard>

            <SectionCard icon={Wallet} eyebrow="Section 04" title="Financial Indicators & Income Scores">
              <p>{detail.financialThresholds.description}</p>
            </SectionCard>

            <SectionCard icon={FileCheck} eyebrow="Section 05" title="Required Certificates & Documentation">
              <p>{detail.requiredCertificates.description}</p>
            </SectionCard>

            <SectionCard icon={ClipboardList} eyebrow="Section 06" title="What Is Needed From the Student">
              <p>{detail.studentResponsibilities.description}</p>
            </SectionCard>

            <div className="neu-flat rounded-3xl p-6 sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6b7280]">
                Your application timeline
              </h2>
              <ol className="mt-5 space-y-4">
                {timelineSteps(scholarship).map((t, i) => (
                  <li key={t.step} className="flex gap-4">
                    <span className="neu-pressed flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#b45309]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#374151]">{t.step}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-[#6b7280]">{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="neu-flat rounded-3xl p-6 sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6b7280]">
                Frequently asked questions
              </h2>
              <div className="mt-4 divide-y divide-[#a3b1c6]/30">
                {faqItems(scholarship).map((f) => (
                  <details key={f.q} className="group py-3.5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#374151]">
                      {f.q}
                      <ChevronDown className="size-4 shrink-0 text-[#6b7280] transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#6b7280]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="neu-flat rounded-3xl p-6 text-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6b7280]">
                At a glance
              </h2>
              <dl className="mt-4 space-y-3 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[#6b7280]">Degrees</dt>
                  <dd className="text-right font-medium text-[#374151]">{detail.atAGlance.degrees}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[#6b7280]">Funding</dt>
                  <dd className="text-right font-medium text-[#374151]">{detail.atAGlance.fundingType}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[#6b7280]">Host</dt>
                  <dd className="text-right font-medium text-[#374151]">{detail.atAGlance.host}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[#6b7280]">Deadline</dt>
                  <dd>
                    <span
                      className={`neu-pressed rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        statusTag === "Closed"
                          ? "text-[#6b7280]"
                          : statusTag === "Closing Today"
                            ? "text-[#b91c1c]"
                            : "text-[#047857]"
                      }`}
                    >
                      {detail.atAGlance.deadline}
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#047857]">
                <ShieldCheck className="size-3.5" /> Verified by ElScholarship advisors
              </p>

              <div className="mt-5 space-y-2.5">
                <Button onClick={() => setApplyOpen(true)} className="w-full text-sm text-[#047857]">
                  Apply Now
                </Button>
                {scholarship.official_link ? (
                  <Button asChild variant="outline" className="w-full text-sm font-semibold">
                    <a href={scholarship.official_link} target="_blank" rel="noopener noreferrer">
                      Official Link <ArrowUpRight className="ml-1 size-3.5" />
                    </a>
                  </Button>
                ) : null}
                <div className="grid grid-cols-2 gap-2.5">
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
            </div>
            <AdBanner slot="1234567890" className="mt-6" />
          </aside>
        </div>
      </main>

      <ApplyModal scholarship={scholarship} open={applyOpen} onOpenChange={setApplyOpen} />
    </div>
  );
}
