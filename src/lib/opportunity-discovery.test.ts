import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { kigaliDate, matchesDiscovery, upcomingShowcase } from "./opportunity-discovery";
import type { Scholarship } from "./scholarship";

const row = (deadline: string | null, values: Partial<Scholarship> = {}): Scholarship => ({
  id: "example", slug: "example", title: "University award", university: "University", country: "Canada", degree_levels: ["Master's"], funding_type: "full", coverage_details: null, official_link: null, deadline, status: "published", created_at: "2026-01-01", ...values,
});

describe("upcoming scholarship discovery", () => {
  it("includes the entire closing day and excludes expired dates", () => {
    assert.equal(matchesDiscovery(row("2026-11-11"), "active", "2026-11-11"), true);
    assert.equal(matchesDiscovery(row("2026-11-10"), "active", "2026-11-11"), false);
    assert.equal(kigaliDate(new Date("2026-11-11T22:30:00Z")), "2026-11-12");
  });
  it("closing soon covers the next 30 days, not missing deadlines", () => {
    assert.equal(matchesDiscovery(row("2026-12-11"), "closing", "2026-11-11"), true);
    assert.equal(matchesDiscovery(row("2026-12-12"), "closing", "2026-11-11"), false);
    assert.equal(matchesDiscovery(row(null), "closing", "2026-11-11"), false);
  });
  it("January–February 2027 filter uses deadline dates", () => {
    for (const date of ["2027-01-01", "2027-02-28"]) assert.equal(matchesDiscovery(row(date), "winter", "2026-11-11"), true);
    assert.equal(matchesDiscovery(row("2027-03-01"), "winter", "2026-11-11"), false);
  });
  it("Rwanda filter reflects recorded mentions, not assumed eligibility", () => {
    assert.equal(matchesDiscovery(row(null, { title: "HEC bilateral award" }), "rwanda", "2026-11-11"), true);
    assert.equal(matchesDiscovery(row(null), "rwanda", "2026-11-11"), false);
  });
  it("fully funded excludes partial and expired awards", () => {
    assert.equal(matchesDiscovery(row(null), "full", "2026-11-11"), true);
    assert.equal(matchesDiscovery(row(null, { funding_type: "partial" }), "full", "2026-11-11"), false);
    assert.equal(matchesDiscovery(row("2026-11-10"), "full", "2026-11-11"), false);
  });
  it("showcase uses live rows in deadline order with at most six awards", () => {
    const rows = Array.from({ length: 9 }, (_, i) => row(`2026-11-${20 - i}`));
    const result = upcomingShowcase([row("2026-10-01"), ...rows, row(null)], "2026-11-11");
    assert.equal(result.length, 6);
    assert.equal(result[0]?.deadline, "2026-11-12");
    assert.equal(result[5]?.deadline, "2026-11-17");
  });
});