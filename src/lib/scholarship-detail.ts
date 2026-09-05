import { coverageTags, deadlineLabel, type Scholarship } from "@/lib/scholarship";
import type { ScholarshipDetail } from "@/types/scholarship";

/**
 * Maps a live scholarship row into the structured ScholarshipDetail shape.
 * Every sentence is composed from the real title / university / country /
 * funding / coverage / deadline fields — no mock records are created.
 */
export function toScholarshipDetail(s: Scholarship): ScholarshipDetail {
  const isFull = s.funding_type === "full";
  const funding = isFull ? "fully funded" : "partially funded";
  const levels = s.degree_levels?.filter(Boolean) ?? [];
  const degreesPhrase =
    levels.length === 0
      ? "degree programmes across the institution"
      : levels.length === 1
        ? `${levels[0]} study`
        : `${levels.slice(0, -1).join(", ")} and ${levels[levels.length - 1]} study`;
  const tags = coverageTags(s.coverage_details);

  return {
    id: s.id,
    title: s.title,
    slug: s.id,
    institution: {
      name: s.university,
      location: s.country,
      about:
        `${s.university} is the host institution for this award and the body that issues the admission decision, the funding letter and the enrolment documents used for your student visa. Studying in ${s.country} means joining an academic system with its own teaching calendar, grading conventions and campus services, where international students are held to the same standard as domestic ones. Support typically extends well beyond lectures — orientation weeks, an international student office, writing centres, careers services and alumni mentoring are standard at this level. Because the institution itself administers the scholarship, its admissions office is the single source of truth for eligibility and credential questions, and our officers escalate directly to them when a listing needs clarification.`,
    },
    coverageAndBenefits: {
      summary: s.coverage_details
        ? `The provider describes the package as follows: ${s.coverage_details} Benefits are conditional — continuation almost always depends on maintaining a minimum academic standing, remaining enrolled full time and meeting the provider's reporting requirements, so the funding is renewed rather than granted once. ${isFull ? "A fully funded award is designed so money is never the reason you decline a place, but read the schedule for items that quietly stay with you: visa fees, credential evaluation, deposits and the first month before any stipend lands." : "A partial award reduces cost rather than eliminating it, so treat it as one component of a funding plan alongside a departmental bursary, assistantship or family contribution agreed in advance."}`
        : `This is a ${funding} award, and the provider publishes the exact benefit schedule on its own portal; our officers confirm every line in writing before any application is submitted on your behalf. Benefits are conditional on satisfactory academic progress and full-time enrolment, so funding is renewed year by year rather than granted once. ${isFull ? "Even on a fully funded award, budget for visa fees, deposits and the first month of living costs before any stipend arrives." : "On a partial award, know the exact shortfall in writing before you accept — stacking it with a second source of funding is what keeps enrolment realistic."}`,
      tags: tags.length > 0 ? tags : [isFull ? "Full Award" : "Partial Award", "Renewable"],
    },
    eligibilityAndRequirements: {
      description:
        `This award supports ${degreesPhrase}, so the first check is that the programme you want sits inside that scope — applying to a level the scholarship does not cover is the most common reason strong candidates are screened out. Entry standards at this tier normally combine a recognised prior qualification with solid grades, evidence of language ability where teaching is not in your first language, and references who can speak to your work in detail. Committees read for coherence: your previous study, your motivation and the specific courses in the programme should form one continuous line of reasoning. Note that providers at this level generally do not fund a second degree at the same level you already hold, so confirm your target programme represents genuine academic progression.`,
    },
    financialThresholds: {
      description:
        `Many awards at this level combine merit with a means test, and where a financial index applies (such as an income assessment or equivalent score) the threshold, exchange-rate treatment and documentation rules are set by the provider and published on its official portal. Where no income ceiling applies, selection typically weighs academic merit, the strength of your written materials and the fit between your goals and the programme. ${isFull ? "Fully funded awards are the most competitive, so a complete, consistent file matters more than any single number." : "For a partial award, demonstrating how you will fund the remaining costs can itself be part of the assessment."} Our officers confirm the current thresholds with the provider before submission so your file is judged against the live criteria, not last year's.`,
    },
    requiredCertificates: {
      description:
        `Expect to assemble official transcripts, your degree or completion certificate, a valid passport, academic or professional references, and language evidence (IELTS, TOEFL or an official medium-of-instruction letter) where required. Documents issued outside ${s.country} commonly need certified translations into the language of instruction, and some systems require legalisation, an apostille or a formal credential evaluation before the file is considered complete. Certified copies must come from a recognised authority — plain scans of unofficial printouts are routinely rejected. Build three to four weeks for these third-party steps, because translation and legalisation, not the form itself, are what makes candidates miss deadlines.`,
    },
    studentResponsibilities: {
      description:
        `Your side of the bargain is simple but strict: submit through the correct portal before the deadline (${deadlineLabel(s.deadline)}), keep every uploaded document legible and consistent, and respond quickly when the committee or your officer asks for anything. After enrolment, the award normally requires you to stay registered full time, complete the required credits each term and maintain the minimum academic standing stated in the funding letter. Report changes — address, programme, bank details — promptly, because funding is administered against the records on file. Candidates who treat the scholarship calendar as seriously as the academic one are the ones whose funding renews without drama.`,
    },
    atAGlance: {
      degrees: levels.join(", ") || "See provider portal",
      fundingType: isFull ? "Fully funded" : "Partial grant",
      host: s.university,
      deadline: deadlineLabel(s.deadline),
      verified: true,
    },
  };
}
