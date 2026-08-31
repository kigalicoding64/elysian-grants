import { useState } from "react";
import {
  Building2,
  MapPin,
  ArrowUpRight,
  Bookmark,
  Clock,
  ChevronRight,
  Share2,
  Link2,
  MessageCircle,
  Twitter,
  Linkedin,
  ArrowBigUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { coverageTags, daysUntil, deadlineLabel, type Scholarship } from "@/lib/scholarship";
import {
  buildShareLinks,
  useSavedScholarship,
  useUpvotedScholarship,
} from "@/lib/engagement";

export function ScholarshipCard({
  scholarship,
  onManagedApply,
}: {
  scholarship: Scholarship;
  onManagedApply: (s: Scholarship) => void;
}) {
  const { active: isSaved, toggle: toggleSaved } = useSavedScholarship(scholarship.id);
  const { active: isUpvoted, toggle: toggleUpvote } = useUpvotedScholarship(scholarship.id);
  const [shareOpen, setShareOpen] = useState(false);
  const days = daysUntil(scholarship.deadline);
  const urgent = days !== null && days >= 0 && days <= 14;
  const closed = days !== null && days < 0;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?scholarship=${scholarship.id}`
      : "";
  const shareLinks = buildShareLinks(shareUrl, scholarship.title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy the link");
    }
    setShareOpen(false);
  }

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-950">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5 dark:border-slate-900">
          
          {/* Degree & Funding Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {scholarship.degree_levels.map((level) => (
              <span
                key={level}
                className="rounded-md bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-slate-100 dark:bg-slate-100 dark:text-slate-900"
              >
                {level}
              </span>
            ))}

            <span
              className={`rounded-md px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                scholarship.funding_type === "full"
                  ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {scholarship.funding_type === "full" ? "100% Funded" : "Partial Grant"}
            </span>
          </div>

          {/* Save / Share actions */}
          <div className="flex items-center gap-1">
            <Popover open={shareOpen} onOpenChange={setShareOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-slate-400 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                  aria-label="Share scholarship"
                >
                  <Share2 className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-1.5">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Link2 className="size-3.5" /> Copy link
                </button>
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MessageCircle className="size-3.5" /> WhatsApp
                </a>
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Twitter className="size-3.5" /> Twitter / X
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Linkedin className="size-3.5" /> LinkedIn
                </a>
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={() => {
                const saved = toggleSaved();
                toast.success(saved ? "Saved to your list" : "Removed from your list");
              }}
              className="text-slate-400 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
              aria-label={isSaved ? "Remove from saved" : "Save program"}
              aria-pressed={isSaved}
            >
              <Bookmark className={`size-4 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-amber-400">
          {scholarship.title}
        </h3>

        {/* Institution & Country */}
        <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
            <Building2 className="size-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{scholarship.university}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-slate-400" />
            <span>{scholarship.country}</span>
          </div>
        </div>

        {/* Coverage Details */}
        {scholarship.coverage_details ? (
          <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {scholarship.coverage_details}
          </p>
        ) : null}

        {/* Premium Coverage Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {coverageTags(scholarship.coverage_details).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-200 bg-slate-50/50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900">
        
        {/* Deadline Status */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Deadline</span>
          <span
            className={`inline-flex items-center gap-1.5 font-semibold ${
              closed
                ? "text-slate-400"
                : urgent
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-700 dark:text-slate-300"
            }`}
          >
            <Clock className="size-3" />
            {deadlineLabel(scholarship.deadline)}
          </span>
        </div>

        {/* High-End Action Group */}
        <div className="grid grid-cols-2 gap-2.5">
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="w-full border-slate-200 bg-transparent text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <a href={scholarship.official_link ?? "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1">
              Official Link <ArrowUpRight className="size-3 text-slate-400" />
            </a>
          </Button>

          <Button 
            size="sm"
            onClick={() => onManagedApply(scholarship)}
            className="w-full bg-slate-900 text-xs font-semibold text-amber-400 transition-all hover:bg-slate-800 hover:shadow-sm dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
          >
            <span className="inline-flex items-center gap-1">
              Managed Concierge <ChevronRight className="size-3" />
            </span>
          </Button>
        </div>

      </div>
    </article>
  );
}
