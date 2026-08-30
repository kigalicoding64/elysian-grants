import { useState } from "react";
import { 
  Building2, 
  CalendarClock, 
  ExternalLink, 
  MapPin, 
  Sparkles, 
  Bookmark, 
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { coverageTags, daysUntil, deadlineLabel, type Scholarship } from "@/lib/scholarship";

export function ScholarshipCard({
  scholarship,
  onManagedApply,
}: {
  scholarship: Scholarship;
  onManagedApply: (s: Scholarship) => void;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const days = daysUntil(scholarship.deadline);
  const urgent = days !== null && days >= 0 && days <= 14;
  const closed = days !== null && days < 0;

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl dark:bg-slate-900">
      
      {/* Top Meta Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Degree Badges */}
            {scholarship.degree_levels.map((level) => (
              <span
                key={level}
                className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-slate-100 dark:text-slate-900"
              >
                {level}
              </span>
            ))}

            {/* Funding Status Badge */}
            <span
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${
                scholarship.funding_type === "full"
                  ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
              }`}
            >
              {scholarship.funding_type === "full" ? "Fully Funded" : "Partially Funded"}
            </span>

            {/* Verified Badge */}
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <CheckCircle2 className="size-3" /> Verified
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className={`rounded-lg p-1.5 transition-colors ${
              isSaved 
                ? "bg-amber-500/10 text-amber-500" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            aria-label="Bookmark scholarship"
          >
            <Bookmark className={`size-4 ${isSaved ? "fill-amber-500" : ""}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {scholarship.title}
        </h3>

        {/* Institution & Country */}
        <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2 font-medium">
            <Building2 className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">{scholarship.university}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            <span>{scholarship.country}</span>
          </p>
        </div>

        {/* Coverage Description */}
        {scholarship.coverage_details ? (
          <p className="mt-3.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
            {scholarship.coverage_details}
          </p>
        ) : null}

        {/* Coverage Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {coverageTags(scholarship.coverage_details).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
            >
              ✓ {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Pinning to Bottom */}
      <div className="mt-6 pt-4 border-t border-border/60">
        
        {/* Deadline Status */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Application Deadline:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
              closed
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                : urgent
                  ? "bg-rose-500/10 text-rose-600 animate-pulse dark:bg-rose-500/20 dark:text-rose-400"
                  : "bg-secondary text-secondary-foreground"
            }`}
          >
            {urgent ? <AlertTriangle className="size-3" /> : <Clock className="size-3" />}
            {deadlineLabel(scholarship.deadline)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="flex-1 font-semibold transition-colors hover:bg-secondary"
          >
            <a href={scholarship.official_link ?? "#"} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5 mr-1.5" /> Official Link
            </a>
          </Button>

          <Button 
            size="sm"
            onClick={() => onManagedApply(scholarship)}
            className="flex-1 bg-emerald-600 font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-md"
          >
            <Sparkles className="size-3.5 mr-1.5 text-amber-300" /> Managed Apply
          </Button>
        </div>

      </div>
    </article>
  );
}
