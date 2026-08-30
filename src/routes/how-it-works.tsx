import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  CheckCircle2, 
  Compass, 
  FileCheck, 
  FolderLock, 
  HelpCircle, 
  Send, 
  ShieldCheck, 
  UserCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ElScholarship Works — Full Process & Application Tracks" },
      {
        name: "description",
        content:
          "Learn how ElScholarship verifies fully funded opportunities, manages your secure document vault, and handles university submissions end-to-end.",
      },
      { property: "og:title", content: "How ElScholarship Works — Detailed Guide" },
      {
        property: "og:description",
        content: "Discover, prepare, apply, and track fully funded scholarships with absolute transparency.",
      },
    ],
  }),
  component: HowItWorks,
});

const PROCESS_STEPS = [
  {
    n: "01",
    icon: Compass,
    title: "100% Verified Discovery",
    tagline: "No expired deadlines or fake opportunities.",
    body: "Every scholarship listed on ElScholarship undergoes strict manual verification against official university, government, or foundation portals. Filter by degree level (Bachelors, Masters, PhD), field of study, country, and funding coverage (tuition, stipend, housing, airfare).",
  },
  {
    n: "02",
    icon: FolderLock,
    title: "Centralized Document Vault",
    tagline: "Upload once, reuse everywhere.",
    body: "Store your academic transcripts, Statements of Purpose (SOP), recommendation letters, passport scans, and language test results (IELTS/TOEFL) in an encrypted vault. Update your files anytime without re-uploading for every new application.",
  },
  {
    n: "03",
    icon: UserCheck,
    title: "Choose Your Application Route",
    tagline: "Direct apply or full concierge management.",
    body: "You decide how to apply. Follow direct official portal links for self-submission, or hand your file to our scholarship concierge team to manage the application process on your behalf.",
  },
  {
    n: "04",
    icon: Send,
    title: "Submission & Real-time Tracking",
    tagline: "Complete transparency from review to decision.",
    body: "Track every stage of your application live from your student dashboard. Receive official application reference numbers, confirmation receipts, and status updates until the final university decision is released.",
  },
];

const PATHWAYS = [
  {
    title: "Direct Self-Apply",
    badge: "Free Route",
    description: "Ideal for students who want full hands-on control over their submissions.",
    features: [
      "Access to verified scholarship directory & criteria",
      "Direct links to official university admission portals",
      "Free document checklist and deadline calendar",
      "Community insights and application guides",
    ],
  },
  {
    title: "Managed Concierge",
    badge: "Recommended",
    description: "Ideal for busy students seeking expert file preparation & guaranteed submission.",
    features: [
      "Dedicated scholarship officer handles your entire file",
      "Thorough document vetting and feedback before submission",
      "Official portal registration and application filing on your behalf",
      "Submission proof, reference ID, and dashboard pipeline tracking",
    ],
  },
];

const DOCUMENT_TYPES = [
  {
    title: "Academic Transcripts & Certificates",
    tag: "Required for all routes",
    description:
      "Official records of your grades, degree completion, and academic rank.",
    details: [
      "Must show all completed semesters, credit hours, and official GPA/grading scale key.",
      "Requires official translations (English/host language) certified by an authorized translator if original is in another language.",
      "Provisional certificates are acceptable for graduating candidates, provided final graduation occurs prior to scholarship intake.",
    ],
  },
  {
    title: "Statement of Purpose (SOP) / Personal Essay",
    tag: "Highest Evaluation Weight",
    description:
      "A tailored 500–1,500 word narrative explaining your motivation, research intent, and career trajectory.",
    details: [
      "Must clearly align your past academic/professional background with the specific program curriculum.",
      "Should address how the scholarship funding impacts your home country or target field after graduation.",
      "Concierge officers review structure, tone, flow, and alignment against official selection rubrics before filing.",
    ],
  },
  {
    title: "Letters of Recommendation (LOR)",
    tag: "2 to 3 required",
    description:
      "Formal evaluations from academic professors, thesis supervisors, or professional employers.",
    details: [
      "Academic LORs must evaluate your analytical skills, research capability, and classroom performance.",
      "Professional LORs (for work/fellowship experience) focus on leadership, execution, and team impact.",
      "Must be printed on official institutional letterhead with verified contact details (institutional email required).",
    ],
  },
  {
    title: "Proof of Language Proficiency",
    tag: "Program specific",
    description:
      "Standardized test results or institutional waivers proving readiness for full instruction.",
    details: [
      "English tracks: Official score reports for IELTS Academic, TOEFL iBT, or Duolingo English Test (DET).",
      "Language Medium Certificates (MOI) are acceptable for select universities accepting English-medium prior education.",
      "Non-English tracks (e.g., Chinese CSC, German DAAD): Official HSK, TestDaF, or Goethe certificates required.",
    ],
  },
  {
    title: "Curriculum Vitae (CV) / Academic Resume",
    tag: "Europass / Academic Format",
    description:
      "A concise, structured summary of your academic accomplishments, publications, and leadership.",
    details: [
      "Focuses on chronological academic history, published papers, conference presentations, and awards.",
      "Highlights relevant volunteer work, community leadership, and extracurricular achievements.",
      "Strictly formatted to international standards (e.g., Europass or Harvard-style layout).",
    ],
  },
  {
    title: "Research Proposal (Master’s Thesis / PhD)",
    tag: "Postgraduate Research Only",
    description:
      "A 1,000–3,000 word technical framework detailing your intended thesis project.",
    details: [
      "Must define clear research questions, literature gaps, methodology, and feasibility timeline.",
      "Requires prior identification or alignment with potential faculty supervisors (where specified by the program).",
      "Evaluated heavily on novelty, methodology rigor, and societal or technical impact.",
    ],
  },
];

const FAQS = [
  {
    q: "How does ElScholarship verify scholarships?",
    a: "Our editorial team verifies every entry directly against the granting institution's official domain. We cross-check funding scope, eligibility rules, and active deadlines before publishing.",
  },
  {
    q: "Are my uploaded documents secure in the Vault?",
    a: "Yes. All files in your Document Vault are encrypted at rest (AES-256) and in transit (TLS 1.3). They are strictly accessed only for your designated applications and are never shared with third parties.",
  },
  {
    q: "What happens after I request Managed Concierge service?",
    a: "An assigned scholarship officer reviews your vault documents within 24 hours, flags any missing or non-compliant requirements, prepares your portal forms, and files the official application. You receive a confirmation receipt and reference ID on your dashboard.",
  },
  {
    q: "Can I apply for multiple scholarships using one set of documents?",
    a: "Yes! Your primary academic records (transcripts, degrees, passport, language tests) stay in your Vault and automatically link across applications. You only need to tailor your Statement of Purpose (SOP) or Research Proposal for each target program.",
  },
  {
    q: "What if my target scholarship requires direct email/portal submission from my recommenders?",
    a: "If a university portal requires direct professor submission, our system triggers an automated recommendation request link to your referee's institutional email address or notifies your Concierge officer to manage portal invites.",
  },
  {
    q: "What is the difference between Fully Funded and Partially Funded listings?",
    a: "Fully Funded listings cover 100% of tuition, provide a monthly living stipend, and often include roundtrip airfare and health insurance. Partially Funded scholarships cover tuition only or provide a fixed one-time grant.",
  },
  {
    q: "Do I need certified/legalized document translations right away?",
    a: "For initial directory browsing and concierge preparation, official English translations are sufficient. If your target university requires embassy legalization or apostille certification, your Concierge officer will notify you ahead of the final submission deadline.",
  },
];

function HowItWorks() {
  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="border-b border-slate-200 bg-slate-900 text-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            End-to-End Transparency
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
            How ElScholarship Works
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
            From discovering fully funded opportunities to uploading your document vault and receiving official submission receipts—here is how we streamline your path to studying abroad.
          </p>
        </div>
      </section>

      {/* Main 4-Step Breakdown */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Four Steps to Your Fully Funded Degree
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A structured workflow designed to remove confusion and save hundreds of application hours.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {PROCESS_STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.n}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    <IconComponent className="size-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-800">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-500">
                  {step.tagline}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Application Routes Comparison */}
      <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Choose Your Application Pathway
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Select the option that best fits your schedule and level of support needed.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {PATHWAYS.map((path) => (
              <div
                key={path.title}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {path.title}
                  </h3>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    {path.badge}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {path.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {path.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Document Vault Breakdown */}
      <section className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
              Document Vault Specifications
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              International Scholarship Document Standards
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Understand exact formatting, verification, and preparation requirements for every document type.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DOCUMENT_TYPES.map((doc) => (
              <div
                key={doc.title}
                className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    {doc.tag}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
                  {doc.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {doc.description}
                </p>
                
                <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {doc.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
          <HelpCircle className="size-5" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
          {FAQS.map((faq) => (
            <div key={faq.q} className="py-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {faq.q}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Callout */}
        <div className="mt-12 flex flex-col items-center rounded-xl bg-slate-900 p-8 text-center text-white dark:bg-slate-950">
          <ShieldCheck className="size-10 text-amber-500" />
          <h3 className="mt-4 text-xl font-bold">Ready to Start Your Application?</h3>
          <p className="mt-2 max-w-xl text-xs text-slate-300">
            Browse active fully funded opportunities or set up your document vault in under two minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400">
              <Link to="/">Browse Scholarships</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
              <Link to="/concierge">Explore Concierge Service</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
