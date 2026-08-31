export type Scholarship = {
  id: string;
  title: string;
  university: string;
  country: string;
  degree_levels: string[];
  funding_type: "full" | "partial";
  coverage_details: string | null;
  official_link: string | null;
  deadline: string | null;
  status: "published" | "draft";
  created_at: string;
};

export type ApplicationStatus =
  "DOC_REVIEW" | "DOC_APPROVED" | "PREP_IN_PROGRESS" | "SUBMITTED" | "ACCEPTED" | "REJECTED";

export type Application = {
  id: string;
  user_id: string;
  scholarship_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  app_type: "managed" | "direct";
  status: ApplicationStatus;
  official_app_id: string | null;
  proof_url: string | null;
  created_at: string;
  scholarships?: Pick<Scholarship, "title" | "university" | "deadline"> | null;
};

export type DocumentRow = {
  id: string;
  user_id: string;
  application_id: string | null;
  file_name: string;
  file_type: string | null;
  file_url: string;
  status: "pending" | "approved" | "revision_required";
  created_at: string;
};

export const DEGREE_LEVELS = ["Undergraduate", "Master's", "PhD"] as const;

export const REGIONS = ["Global", "Rwanda", "Europe", "UK", "Canada"] as const;

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DOC_REVIEW: "New Received",
  DOC_APPROVED: "Documents Approved",
  PREP_IN_PROGRESS: "Submission Prep",
  SUBMITTED: "Submitted to University",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const PIPELINE: ApplicationStatus[] = [
  "DOC_REVIEW",
  "DOC_APPROVED",
  "PREP_IN_PROGRESS",
  "SUBMITTED",
  "ACCEPTED",
];

export const DOC_TYPES = [
  "Academic Transcripts",
  "Statement of Purpose",
  "Passport / National ID",
  "English Test Scores",
] as const;

export function daysUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const target = new Date(`${deadline}T00:00:00Z`).getTime();
  const today = Date.now();
  return Math.ceil((target - today) / 86_400_000);
}

export type ScholarshipStatusTag = "Open" | "Closing Today" | "Closed";

export function scholarshipStatusTag(deadline: string | null): ScholarshipStatusTag {
  const days = daysUntil(deadline);
  if (days !== null && days < 0) return "Closed";
  if (days === 0) return "Closing Today";
  return "Open";
}

export function deadlineLabel(deadline: string | null): string {
  const days = daysUntil(deadline);
  if (days === null) return "Rolling intake";
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  if (days <= 7) return `${days} day${days === 1 ? "" : "s"} left`;
  if (days <= 60) return `${days} days left`;
  return `Closes ${new Date(`${deadline}T00:00:00Z`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

export function coverageTags(coverage: string | null): string[] {
  if (!coverage) return [];
  const text = coverage.toLowerCase();
  const tags: string[] = [];
  if (text.includes("tuition")) tags.push("Tuition");
  if (text.includes("stipend") || text.includes("living")) tags.push("Living Stipend");
  if (text.includes("airfare") || text.includes("flight") || text.includes("travel"))
    tags.push("Airfare");
  if (text.includes("laptop")) tags.push("Laptop");
  if (text.includes("insurance")) tags.push("Health Insurance");
  if (text.includes("mentor")) tags.push("Mentorship");
  return tags;
}

/**
  Sorts scholarships in order:
  1. Open / active opportunities, including rolling intake
  2. Upcoming deadlines in ascending order, so closing-soon opportunities surface first
  3. Closed / expired opportunities at the bottom
 */
export function sortScholarshipsByUrgency(scholarships: Scholarship[]): Scholarship[] {
  return [...scholarships].sort((a, b) => {
    const daysA = daysUntil(a.deadline);
    const daysB = daysUntil(b.deadline);

    const isClosedA = daysA !== null && daysA < 0;
    const isClosedB = daysB !== null && daysB < 0;

    // Active opportunities ALWAYS come before Closed ones
    if (!isClosedA && isClosedB) return -1;
    if (isClosedA && !isClosedB) return 1;

    if (!isClosedA && !isClosedB) {
      if (daysA === null && daysB === null) return 0;
      if (daysA === null) return 1;
      if (daysB === null) return -1;
      return daysA - daysB;
    }

    if (daysA === null && daysB === null) return 0;
    if (daysA === null) return 1;
    if (daysB === null) return -1;

    // Both Closed: Descending order (most recently expired first)
    return daysB - daysA;
  });
}
