import type { Scholarship } from "./scholarship";

export type DiscoveryFilter = "active" | "closing" | "winter" | "rwanda" | "full" | "all";

/** Compare calendar dates in Kigali, including the whole closing day. */
export function kigaliDate(now = new Date()): string {
  return new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isActiveOpportunity(s: Scholarship, today: string): boolean {
  return !s.deadline || s.deadline >= today;
}

export function matchesDiscovery(s: Scholarship, mode: DiscoveryFilter, today: string): boolean {
  if (mode === "all") return true;
  if (!isActiveOpportunity(s, today)) return false;
  if (mode === "closing") {
    const end = new Date(`${today}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 30);
    return Boolean(s.deadline && s.deadline <= end.toISOString().slice(0, 10));
  }
  if (mode === "winter") return Boolean(s.deadline && s.deadline >= "2027-01-01" && s.deadline <= "2027-02-28");
  if (mode === "rwanda") return /rwanda|rwandan|\bhec\b|\bmineduc\b/i.test(`${s.title} ${s.university} ${s.country} ${s.coverage_details ?? ""}`);
  if (mode === "full") return s.funding_type === "full";
  return true;
}

export function upcomingShowcase(rows: Scholarship[], today: string): Scholarship[] {
  return rows.filter((s) => isActiveOpportunity(s, today)).sort((a, b) =>
    (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999") || a.title.localeCompare(b.title),
  ).slice(0, 6);
}