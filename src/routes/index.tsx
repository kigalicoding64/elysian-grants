import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Sparkles, GraduationCap, Globe2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScholarshipCard } from "@/components/scholarship-card";
import { ApplyModal } from "@/components/apply-modal";
import { AdBanner } from "@/components/ui/ad-banner";
import { UniversityMarqueeTicker } from "@/components/UniversityMarqueeTicker";
import { supabase } from "@/integrations/supabase/client";
import {
  DEGREE_LEVELS,
  REGIONS,
  sortScholarshipsByUrgency,
  type Scholarship,
} from "@/lib/scholarship";

const SITE_URL = "https://elysian-grants.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElScholarship — Verified Fully Funded Scholarships Directory" },
      {
        name: "description",
        content:
          "Browse verified fully funded scholarships worldwide, filter by degree, region and funding type, or apply through our managed concierge service.",
      },
      { property: "og:title", content: "ElScholarship — Verified Fully Funded Scholarships" },
      {
        property: "og:description",
        content:
          "Browse verified fully funded scholarships worldwide and apply with expert managed support.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/elscholaship-logo.jpg` },
      { name: "twitter:image", content: `${SITE_URL}/elscholaship-logo.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: IndexComponent,
});

function IndexComponent() {
  const [search, setSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [fundingFilter, setFundingFilter] = useState<string>("all");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Fetch Published Scholarships
  const { data: rawScholarships = [], isLoading } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("status", "published")
        .order("deadline", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data as Scholarship[];
    },
  });

  // Filter & Sort Logic
  const processedScholarships = useMemo(() => {
    // 1. Filter by user inputs
    const filtered = rawScholarships.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.university.toLowerCase().includes(search.toLowerCase()) ||
        item.country.toLowerCase().includes(search.toLowerCase());

      const matchesDegree = degreeFilter === "all" || item.degree_levels.includes(degreeFilter);

      const matchesRegion =
        regionFilter === "all" ||
        (regionFilter === "Global"
          ? true
          : item.country.toLowerCase().includes(regionFilter.toLowerCase()));

      const matchesFunding = fundingFilter === "all" || item.funding_type === fundingFilter;

      return matchesSearch && matchesDegree && matchesRegion && matchesFunding;
    });

    // 2. Sort by Status & Urgency (Open -> Closing Soon -> Closed -> Rolling)
    return sortScholarshipsByUrgency(filtered);
  }, [rawScholarships, search, degreeFilter, regionFilter, fundingFilter]);

  const handleManagedApply = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setApplyModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50/50 pb-20 dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border hero-surface py-20">
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                <Sparkles className="size-3.5" /> Managed Global Mobility Concierge
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-foreground sm:text-6xl">
                Fully funded degrees,
                <span className="block text-primary">handled end to end.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-foreground/70 sm:text-lg">
                Every listing on ElScholarship is manually verified against the official awarding
                body. Our senior advisory officers then prepare, review and submit your file — so
                nothing is lost to a missed clause or a late deadline.
              </p>

              <div className="mx-auto mt-8 max-w-2xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 size-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by university, degree title, or destination country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-14 rounded-xl border-transparent bg-card pl-12 pr-4 text-sm shadow-elevated"
                  />
                </div>
              </div>

              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-navy-foreground/10 pt-6">
                {[
                  { k: "100%", v: "Sources verified" },
                  { k: "48h", v: "Advisor response" },
                  { k: "60+", v: "Host countries" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="text-2xl font-bold text-navy-foreground">{s.k}</dt>
                    <dd className="mt-1 text-xs uppercase tracking-wider text-navy-foreground/60">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-navy-foreground/10 bg-card/95 p-7 shadow-elevated backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                How the concierge works
              </p>
              <ol className="mt-5 space-y-5">
                {[
                  {
                    t: "Eligibility review",
                    d: "We audit your transcripts, language scores and funding profile against each award's published criteria.",
                  },
                  {
                    t: "Document preparation",
                    d: "Motivation letters, CVs and referee packs are drafted and reviewed by an assigned senior officer.",
                  },
                  {
                    t: "Submission & tracking",
                    d: "We file before the deadline and track the outcome in your dashboard until a decision lands.",
                  },
                ].map((step, i) => (
                  <li key={step.t} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{step.t}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
                No agency fee is charged before an eligibility review is completed and shared with
                you in writing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <UniversityMarqueeTicker />

      {/* Trust pillars */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              t: "Verified at the source",
              d: "Each award is cross-checked against the university or ministry portal before publication, and re-checked when deadlines shift.",
            },
            {
              t: "Senior advisory officers",
              d: "Your file is owned by one named advisor with postgraduate admissions experience — not a rotating support queue.",
            },
            {
              t: "Transparent by design",
              d: "Funding scope, covered costs, eligibility and closing dates are published in full on every listing. No hidden conditions.",
            },
          ].map((p) => (
            <div key={p.t}>
              <div className="h-1 w-10 rounded-full bg-primary" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">{p.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="size-4 text-amber-500" /> Filter Directory
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:w-auto">
            {/* Degree Select */}
            <Select value={degreeFilter} onValueChange={setDegreeFilter}>
              <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800">
                <GraduationCap className="size-3.5 mr-1.5 text-slate-400" />
                <SelectValue placeholder="Degree Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Degree Levels</SelectItem>
                {DEGREE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Region Select */}
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800">
                <Globe2 className="size-3.5 mr-1.5 text-slate-400" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destination Regions</SelectItem>
                {REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Funding Select */}
            <Select value={fundingFilter} onValueChange={setFundingFilter}>
              <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Funding Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Funding Types</SelectItem>
                <SelectItem value="full">100% Fully Funded</SelectItem>
                <SelectItem value="partial">Partial Grant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Directory Stats Counter */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>
            Displaying{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              {processedScholarships.length}
            </strong>{" "}
            verified opportunities
          </p>
          <span className="font-medium text-slate-400">Ordered by Priority & Deadline Urgency</span>
        </div>

        {/* Card Grid */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : processedScholarships.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              No matching scholarships found
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try broadening your filters or clearing your search term.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => {
                setSearch("");
                setDegreeFilter("all");
                setRegionFilter("all");
                setFundingFilter("all");
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {processedScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onManagedApply={handleManagedApply}
                />
              ))}
            </div>
            <AdBanner slot="1234567890" className="mt-8" />
          </>
        )}
      </main>

      {/* Managed Application Modal */}
      <ApplyModal
        scholarship={selectedScholarship}
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
      />
    </div>
  );
}
