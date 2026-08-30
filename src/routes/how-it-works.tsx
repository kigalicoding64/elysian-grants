import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ElScholarship Works — From Search to Submission" },
      {
        name: "description",
        content:
          "Search verified scholarships, apply officially yourself or hand your file to an ElScholarship officer, then track every stage from your dashboard.",
      },
      { property: "og:title", content: "How ElScholarship Works" },
      {
        property: "og:description",
        content: "Search, apply, and track verified scholarship applications in four steps.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    n: "01",
    title: "Search the verified directory",
    body: "Filter by degree level, funding type and region. Every entry is checked against the official source before it is published.",
  },
  {
    n: "02",
    title: "Choose your application route",
    body: "Apply officially through the university portal, or submit through ElScholarship's managed concierge service.",
  },
  {
    n: "03",
    title: "Upload your document vault once",
    body: "Transcripts, statement of purpose, passport and English test scores are stored securely and reused across applications.",
  },
  {
    n: "04",
    title: "Track to a final decision",
    body: "Follow your file through document review, submission prep, submission and the final outcome, with proof of submission attached.",
  },
];

function HowItWorks() {
  return (
    <div className="w-full">
      {/* Hero Header Section */}
      <section className="border-b border-slate-200 bg-slate-900 text-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            How ElScholarship works
          </h1>
          <p className="mt-3 text-slate-300">
            One account covers discovery, document management, and submission tracking.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <ol className="space-y-5">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <span className="text-2xl font-black text-amber-600 dark:text-amber-500">
                {step.n}
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button asChild size="lg" className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400">
            <Link to="/">Start searching</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
