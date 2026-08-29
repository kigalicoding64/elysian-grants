import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-4xl font-semibold">How ElScholarship works</h1>
          <p className="mt-4 text-muted-foreground">
            One account covers discovery, document management and submission tracking.
          </p>

          <ol className="mt-10 space-y-6">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="flex gap-5 rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <span className="text-2xl font-semibold text-primary">{step.n}</span>
                <div>
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Button asChild className="mt-10">
            <Link to="/">Start searching</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
