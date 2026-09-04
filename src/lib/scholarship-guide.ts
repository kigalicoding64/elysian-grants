import { coverageTags, deadlineLabel, type Scholarship } from "@/lib/scholarship";

/**
 * Editorial content derived from the live scholarship row.
 * No mock records are created here — every sentence is composed from the
 * real title / university / country / funding / coverage / deadline fields.
 */

export type GuideSection = {
  id: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  bullets?: { label: string; detail: string }[];
};

function fundingWord(s: Scholarship): string {
  return s.funding_type === "full" ? "fully funded" : "partially funded";
}

function degreesPhrase(s: Scholarship): string {
  const levels = s.degree_levels?.filter(Boolean) ?? [];
  if (levels.length === 0) return "degree programmes across the institution";
  if (levels.length === 1) return `${levels[0]} study`;
  return `${levels.slice(0, -1).join(", ")} and ${levels[levels.length - 1]} study`;
}

/** Six-plus sentence editorial overview shown directly under the hero. */
export function overviewParagraphs(s: Scholarship): string[] {
  const funding = fundingWord(s);
  const tags = coverageTags(s.coverage_details);
  const coverageLine =
    tags.length > 0
      ? `Confirmed benefits currently attached to this award include ${tags.join(", ").toLowerCase()}.`
      : "Exact benefit lines are confirmed in writing with the provider before any submission is made on your behalf.";

  return [
    `The ${s.title} is a ${funding} opportunity hosted by ${s.university} in ${s.country}, created to remove the financial barrier that keeps capable international candidates out of world-class classrooms. It is open to applicants pursuing ${degreesPhrase(s)}, and it is assessed on academic record, motivation and the strength of the story you tell in your written materials. ${coverageLine} Our advisory desk re-verifies this listing against the provider's own published portal before it appears on ElScholarship, so what you read here reflects the live cycle rather than an archived announcement. The current application window is described as "${deadlineLabel(s.deadline)}", and late files are almost never reviewed by selection committees at this level. Read the four briefings below in order — institution, programme, funding and living guidance — because candidates who understand the award before touching the form consistently submit stronger applications.`,
    `You do not have to navigate any of it alone: once you have finished reading, you can either take the official link and apply independently, or hand the entire file to a managed concierge officer who prepares, checks and submits it with you.`,
  ];
}

export function guideSections(s: Scholarship): GuideSection[] {
  const tags = coverageTags(s.coverage_details);
  const isFull = s.funding_type === "full";

  return [
    {
      id: "institution",
      eyebrow: "Briefing 01",
      heading: `Inside ${s.university}`,
      paragraphs: [
        `${s.university} is the host institution for this award and the body that ultimately issues the admission decision, the funding letter and the enrolment documents you will use for your student visa. Studying there means joining an academic community in ${s.country}, with the teaching calendar, grading conventions and campus services of that system rather than the one you are used to at home. Faculties at this level typically expect independent reading, seminar participation and written work submitted to strict deadlines, and international students are held to exactly the same standard as domestic ones.`,
        `Institutional support usually extends well beyond lectures: orientation weeks, international student offices, academic writing centres, careers services, alumni mentoring and campus health provision are standard. Because ${s.university} is issuing the scholarship itself, its admissions office is also the correct authority for any question about eligibility, credential equivalence or programme structure — and our officers escalate directly to them where a listing needs clarification. Treat the institution, not a third-party blog, as the single source of truth for anything that affects your file.`,
      ],
      bullets: [
        { label: "Host institution", detail: s.university },
        { label: "Study destination", detail: s.country },
        { label: "Decision authority", detail: "University admissions & scholarship committee" },
        { label: "Verification", detail: "Re-checked against the provider's official portal" },
      ],
    },
    {
      id: "programme",
      eyebrow: "Briefing 02",
      heading: "Degree, entry standards and academic fit",
      paragraphs: [
        `This award supports ${degreesPhrase(s)}, so the first thing to confirm is that the programme you want sits inside that scope — applying to a level the scholarship does not cover is the single most common reason strong candidates are screened out. Entry standards at this tier normally combine a recognised prior qualification with solid grades, evidence of language ability where teaching is not in your first language, and academic or professional references who can speak to your work in detail.`,
        `Selection committees read for coherence: your previous study, your stated motivation and the specific courses in the programme should form one continuous line of reasoning. A statement that explains why this faculty, this supervisor or this curriculum answers a problem you genuinely care about will outperform a polished but generic essay every time. Build in time for transcript translation, credential evaluation and reference chasing, because those third-party steps — not the form itself — are what makes candidates miss deadlines.`,
      ],
      bullets: [
        { label: "Eligible levels", detail: s.degree_levels?.join(", ") || "See provider portal" },
        { label: "Typical evidence", detail: "Transcripts, degree certificate, CV, references" },
        { label: "Language proof", detail: "IELTS / TOEFL or an official medium-of-instruction letter" },
        { label: "Written materials", detail: "Statement of purpose plus a motivation or study plan" },
      ],
    },
    {
      id: "benefits",
      eyebrow: "Briefing 03",
      heading: isFull ? "What full funding actually covers" : "What partial funding actually covers",
      paragraphs: [
        s.coverage_details
          ? `The provider describes the package as follows: ${s.coverage_details}`
          : `The provider publishes the benefit schedule on its own portal, and our officers confirm every line in writing before an application is submitted on your behalf.`,
        isFull
          ? `A fully funded award is designed so that money is not the reason you decline a place, but "full" is defined by the provider and not by convention. Read the schedule carefully for the items that quietly stay with you — visa and immigration fees, credential evaluation, the initial flight if airfare is not listed, deposits for accommodation, and the first month of living costs before any stipend actually lands in your account. Budgeting for that gap is the difference between an award that works and one that becomes stressful in week three.`
          : `A partial award reduces cost rather than eliminating it, so treat it as one component of a funding plan. Successful partial-award holders normally stack it with a second source: a departmental bursary, an assistantship or on-campus work where the visa allows, a home-country loan or sponsorship, or a family contribution agreed in advance. Knowing the exact shortfall in writing, before you accept, is what keeps enrolment realistic.`,
        `Benefits are also conditional. Continuation almost always depends on maintaining a minimum academic standing, remaining enrolled full time and complying with the provider's reporting requirements, so the funding is renewed rather than simply granted once.`,
      ],
      bullets: [
        { label: "Funding type", detail: isFull ? "Full award" : "Partial award" },
        ...(tags.length > 0
          ? tags.map((t) => ({ label: "Included", detail: t }))
          : [{ label: "Included", detail: "Confirmed with the provider before submission" }]),
        { label: "Renewal", detail: "Subject to satisfactory academic progress" },
      ],
    },
    {
      id: "living",
      eyebrow: "Briefing 04",
      heading: `Arriving and living in ${s.country}`,
      paragraphs: [
        `Winning the award is the halfway point; relocating well is the rest. Once the offer and funding letter arrive you will need a student visa or residence permit, and most systems in ${s.country} ask for the admission letter, proof of funding, valid travel documents, health cover and sometimes a biometric appointment booked weeks ahead. Start that process the day your offer lands — visa slots, not universities, are usually the bottleneck.`,
        `Housing splits into university halls, which are simpler and safer for a first year abroad, and the private market, which is cheaper per month but demands deposits, contracts and a local guarantor. Open a local bank account in your first fortnight, register with the authorities or the campus international office if that is required, arrange a local SIM, and find out how health care works for students before you need it. Set a monthly budget across rent, food, transport, study materials and one emergency line, and remember that any stipend is normally paid in arrears.`,
        `Culturally, expect a settling curve. Join a society, use the international office, keep a routine and stay in contact with home on a fixed schedule — students who build a small local circle in the first month adapt far faster than those who wait for it to happen. Our advisors stay reachable through arrival week for exactly these questions.`,
      ],
      bullets: [
        { label: "Immigration", detail: "Student visa or residence permit with proof of funding" },
        { label: "Housing", detail: "University halls or private rental with deposit" },
        { label: "First-month costs", detail: "Deposit, transport pass, SIM, groceries, materials" },
        { label: "Health", detail: "Student insurance or national scheme registration" },
      ],
    },
  ];
}

export function timelineSteps(s: Scholarship): { step: string; detail: string }[] {
  return [
    { step: "Eligibility check", detail: `Confirm your level matches ${s.degree_levels?.join(" / ") || "the eligible degree levels"} and that your qualification is recognised in ${s.country}.` },
    { step: "Document assembly", detail: "Transcripts, degree certificate, passport, references, language proof and CV — allow three to four weeks." },
    { step: "Written materials", detail: "Draft, review and rewrite the statement of purpose against the programme's own wording." },
    { step: "Submission", detail: `Apply through the official portal or hand the file to a managed officer. Window: ${deadlineLabel(s.deadline)}.` },
    { step: "Decision & funding letter", detail: "Committees typically respond in four to twelve weeks; keep your email and phone reachable." },
    { step: "Visa and relocation", detail: "Begin immigration and housing steps the day the offer arrives." },
  ];
}

export function faqItems(s: Scholarship): { q: string; a: string }[] {
  return [
    {
      q: "Is this listing verified?",
      a: `Yes. Every listing, including the ${s.title}, is checked against ${s.university}'s own published information before it goes live, and re-checked when the cycle changes.`,
    },
    {
      q: "Does ElScholarship charge for the scholarship itself?",
      a: "No. The award is issued by the provider and we never charge for access to a listing or for the official link. Only the optional managed concierge service carries a service fee, quoted up front.",
    },
    {
      q: "Can I apply on my own?",
      a: "Absolutely. The official application link is provided on this page, and Option B in the apply modal walks you through applying independently at no cost.",
    },
    {
      q: "What does the managed option actually do?",
      a: "An advisory officer reviews your documents, strengthens your written materials, checks the file against the provider's requirements and submits it with you, then tracks the outcome in your dashboard.",
    },
    {
      q: "What happens to my documents?",
      a: "Uploads are stored in a private vault, visible only to you and the officer assigned to your file, and are never shared with third parties without your instruction.",
    },
    {
      q: "How long do decisions take?",
      a: "Most committees at this level respond within four to twelve weeks after the deadline, though competitive full awards can take longer.",
    },
  ];
}
