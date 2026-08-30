import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  FileText, 
  HelpCircle, 
  Lock, 
  Search, 
  Send, 
  ShieldCheck, 
  UserCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/concierge")({
  head: () => ({
    meta: [
      { title: "Managed Concierge Applications — ElScholarship" },
      {
        name: "description",
        content:
          "Let ElScholarship officers review your documents, prepare your file, and submit your scholarship application to the university portal on your behalf.",
      },
      { property: "og:title", content: "Managed Concierge Applications — ElScholarship" },
      {
        property: "og:description",
        content: "A dedicated officer prepares, reviews, and submits your scholarship application for you with official proof.",
      },
    ],
  }),
  component: ConciergePage,
});

const PIPELINE_STAGES = [
  {
    step: "01",
    icon: UserCheck,
    title: "Profile & Target Selection",
    subtitle: "Under 5 minutes",
    body: "Select your target scholarship from our directory, connect your Document Vault, and complete a quick intake form specifying your academic goals.",
  },
  {
    step: "02",
    icon: FileCheck2,
    title: "Document Vetting & Audit",
    subtitle: "24–48 Hours",
    body: "A dedicated scholarship officer checks your transcripts, SOP, CV, and recommendation letters against the university's exact eligibility matrix.",
  },
  {
    step: "03",
    icon: FileText,
    title: "SOP & File Enhancement",
    subtitle: "Collaborative Review",
    body: "Receive structural feedback and grammar corrections on your essays to ensure maximum alignment with selection committee rubrics.",
  },
  {
    step: "04",
    icon: Send,
    title: "Portal Submission",
    subtitle: "Official Filing",
    body: "Your officer registers on the official portal, fills out all data fields, uploads your vetted file, and pays any mandatory portal fees if applicable.",
  },
  {
    step: "05",
    icon: ShieldCheck,
    title: "Proof & Status Tracking",
    subtitle: "Real-time Updates",
    body: "Your official portal application ID, submission PDF receipt, and login confirmation are uploaded directly to your student dashboard.",
  },
];

const WHAT_WE_REVIEW = [
  {
    title: "Academic Eligibility & GPA",
    description: "We calculate your grade equivalency and verify that your prior degree meet the institution's minimum entry requirement.",
  },
  {
    title: "Statement of Purpose Integrity",
    description: "We audit your SOP for clarity, alignment with host faculty research, and structure, eliminating generic templates.",
  },
  {
    title: "Recommendation Letter Validation",
    description: "We verify referee contact details, institutional letterheads, and mandatory signing formats required by grantors.",
  },
  {
    title: "Language Waiver Compliance",
    description: "We check if your prior medium of instruction (MOI) qualifies for an English test waiver (IELTS/TOEFL) to avoid unnecessary exam fees.",
  },
];

const COMPARISON_ITEMS = [
  {
    feature: "Verification of Portal Links",
    selfApply: "Manual check by student",
    concierge: "Verified by ElScholarship Team",
  },
  {
    feature: "Document Compliance Audit",
    selfApply: "Self-evaluated",
    concierge: "Dedicated Officer Vetting",
  },
  {
    feature: "SOP Structural Feedback",
    selfApply: "None",
    concierge: "Detailed Line-Item Review",
  },
  {
    feature: "Submission Filing",
    selfApply: "Student submits manually",
    concierge: "Officer submits on your behalf",
  },
  {
    feature: "Submission Proof & Tracking",
    selfApply: "Kept in personal email",
    concierge: "Archived on Dashboard Vault",
  },
];

const FAQS = [
  {
    q: "Does the Concierge service guarantee a scholarship award?",
    a: "No agency can guarantee admission or funding decisions made by university committees. However, our Concierge service guarantees 100% error-free, compliant, and verified submissions filed before official deadlines.",
  },
  {
    q: "How do I know my application was actually submitted?",
    a: "Within 2 hours of portal submission, your assigned officer uploads the official PDF confirmation receipt, portal application reference ID, and timestamped screenshot to your dashboard.",
  },
  {
    q: "What happens if my documents have errors during review?",
    a: "Your officer flags exact issues directly on your dashboard (e.g., 'Transcript missing grading scale key' or 'LOR missing official stamp') with instructions on how to re-upload before final filing.",
  },
  {
    q: "Can I use Concierge for multiple university applications?",
    a: "Yes. Once your primary document vault is audited, applying to additional partner institutions requires minimal adjustments, allowing quick multi-university submissions.",
  },
];

function ConciergePage() {
  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="border-b border-border bg-slate-900 text-white dark:bg-slate-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Managed Concierge Service
          </span>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            A dedicated scholarship officer handling your file end to end
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Hand over your document vault once. We vet your eligibility, polish your file, submit directly to official university portals, and attach submission receipts to your dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="default">
              <Link to="/">Browse Scholarships to Apply</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
              <Link to="/how-it-works">How Document Vault Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5-Step Pipeline Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            The Managed Application Pipeline
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            From initial document submission to your final portal reference number.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {PIPELINE_STAGES.map((stage) => {
            const IconComponent = stage.icon;
            return (
              <div
                key={stage.step}
                className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500">{stage.step}</span>
                  <IconComponent className="size-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-base font-bold text-card-foreground">{stage.title}</h3>
                <span className="mt-1 text-[11px] font-semibold text-muted-foreground">
                  {stage.subtitle}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {stage.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vetting Standards */}
      <section className="border-y border-border bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              What Our Officers Vet Before Filing
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We eliminate common administrative rejection reasons before your application reaches the university committee.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {WHAT_WE_REVIEW.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <CheckCircle2 className="size-5 text-amber-500" />
                <h3 className="mt-3 text-sm font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Self-Apply vs. Managed Concierge
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose the approach that fits your confidence level and available preparation time.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs text-card-foreground">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">Feature / Process</th>
                <th className="p-4 font-semibold">Direct Self-Apply</th>
                <th className="p-4 font-semibold text-amber-500">Managed Concierge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON_ITEMS.map((row) => (
                <tr key={row.feature} className="hover:bg-muted/30">
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-muted-foreground">{row.selfApply}</td>
                  <td className="p-4 font-semibold text-amber-600 dark:text-amber-400">
                    {row.concierge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-2 text-amber-500">
            <HelpCircle className="size-5" />
            <h2 className="text-xl font-bold text-foreground">Concierge FAQs</h2>
          </div>

          <div className="mt-6 divide-y divide-border">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-12 flex flex-col items-center rounded-xl bg-slate-900 p-8 text-center text-white dark:bg-slate-950">
            <Lock className="size-8 text-amber-500" />
            <h3 className="mt-4 text-xl font-bold">Ready to Delegate Your Application?</h3>
            <p className="mt-2 max-w-lg text-xs text-slate-300">
              Find your target program in our directory and select "Apply via Concierge" to initiate officer review.
            </p>
            <Button asChild variant="default" className="mt-6">
              <Link to="/">Explore Verified Directory</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
