import { Building2, CalendarClock, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coverageTags, daysUntil, deadlineLabel, type Scholarship } from "@/lib/scholarship";

export function ScholarshipCard({
  scholarship,
  onManagedApply,
}: {
  scholarship: Scholarship;
  onManagedApply: (s: Scholarship) => void;
}) {
  const days = daysUntil(scholarship.deadline);
  const urgent = days !== null && days >= 0 && days <= 7;
  const closed = days !== null && days < 0;

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex flex-wrap items-center gap-2">
        {scholarship.degree_levels.map((level) => (
          <span
            key={level}
            className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-semibold text-navy-foreground"
          >
            {level}
          </span>
        ))}
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            scholarship.funding_type === "full"
              ? "bg-accent text-accent-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {scholarship.funding_type === "full" ? "Fully Funded" : "Partially Funded"}
        </span>
        <span
          className={`ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            closed
              ? "bg-muted text-muted-foreground"
              : urgent
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary text-secondary-foreground"
          }`}
        >
          <CalendarClock className="size-3" />
          {deadlineLabel(scholarship.deadline)}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug">{scholarship.title}</h3>

      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <Building2 className="mt-0.5 size-4 shrink-0" />
          {scholarship.university}
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          {scholarship.country}
        </p>
      </div>

      {scholarship.coverage_details ? (
        <p className="mt-3 line-clamp-3 text-sm text-foreground/80">
          {scholarship.coverage_details}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {coverageTags(scholarship.coverage_details).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-primary/25 bg-accent/60 px-2 py-0.5 text-[11px] font-medium text-accent-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <a href={scholarship.official_link ?? "#"} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" /> Apply Officially
          </a>
        </Button>
        <Button className="flex-1" onClick={() => onManagedApply(scholarship)}>
          <Sparkles className="size-4" /> Apply via ElScholarship
        </Button>
      </div>
    </article>
  );
}
