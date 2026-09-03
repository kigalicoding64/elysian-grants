import { useState } from "react";
import { Link } from "@tanstack/react-router";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  coverageTags,
  daysUntil,
  deadlineLabel,
  scholarshipStatusTag,
  type Scholarship,
} from "@/lib/scholarship";
import { buildShareLinks, useSavedScholarship, useUpvotedScholarship } from "@/lib/engagement";

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
  const statusTag = scholarshipStatusTag(scholarship.deadline);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/?scholarship=${scholarship.id}` : "";
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
    <article className="neu-flat group relative flex flex-col justify-between rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3.5">
          {/* Degree & Funding Badges */}
          <div className="flex flex-wrap items-center gap-2">
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


          {/* Save / Share actions */}
          <div className="relative z-10 flex items-center gap-1">
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
          <Link
            to="/scholarships/$id"
            params={{ id: scholarship.id }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {scholarship.title}
          </Link>
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
              className="neu-pressed rounded-full px-3 py-1 text-[10px] font-medium text-[#6b7280]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-6 pt-4">
        {/* Upvote */}
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-medium text-[#6b7280]">Community</span>
          <button
            type="button"
            onClick={() => {
              const up = toggleUpvote();
              toast.success(up ? "Upvoted" : "Upvote removed");
            }}
            aria-pressed={isUpvoted}
            className={`relative z-10 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              isUpvoted ? "neu-pressed text-[#047857]" : "neu-btn text-[#6b7280]"
            }`}
          >
            <ArrowBigUp className={`size-3.5 ${isUpvoted ? "fill-emerald-700" : ""}`} />
            {isUpvoted ? "Upvoted" : "Upvote"}
          </button>
        </div>

        {/* Deadline Status */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="font-medium text-[#6b7280]">Deadline</span>
          <span
            className={`inline-flex items-center gap-1.5 font-semibold ${
              closed ? "text-[#6b7280]" : urgent ? "text-[#b45309]" : "text-[#374151]"
            }`}
          >
            <Clock className="size-3" />
            {deadlineLabel(scholarship.deadline)}
          </span>
        </div>

        {/* High-End Action Group */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Button asChild variant="outline" size="sm" className="w-full text-xs">
            <Link
              to="/scholarships/$id"
              params={{ id: scholarship.id }}
              className="relative z-10 inline-flex items-center justify-center gap-1"
            >
              View Details <ArrowUpRight className="size-3" />
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => onManagedApply(scholarship)}
            className="relative z-10 w-full text-xs text-[#047857]"
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
