import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileCheck2, Send, UserCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/concierge")({
  head: () => ({
    meta: [
      { title: "Managed Concierge Applications — ElScholarship" },
      {
        name: "description",
        content:
          "Let ElScholarship officers review your documents, prepare your file and submit your scholarship application to the university on your behalf.",
      },
      { property: "og:title", content: "Managed Concierge Applications — ElScholarship" },
      {
        property: "og:description",
        content: "A dedicated officer prepares and submits your scholarship application for you.",
      },
    ],
  }),
  component: ConciergePage,
});

const STEPS = [
  {
    icon: UserCheck,
    title: "Profile intake",
    body: "Share your contact details and study goals in a three-step guided form.",
  },
  {
    icon: FileCheck2,
    title: "Document vetting",
    body: "Officers review transcripts, SOP, ID and test scores, flagging anything that needs revision.",
  },
  {
    icon: Send,
    title: "Submission & proof",
    body: "We submit to the official portal and return the reference number plus receipt to your dashboard.",
  },
];

function ConciergePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="hero-surface text-navy-foreground">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
            <h1 className="max-w-2xl text-4xl font-semibold">
              A scholarship officer handling your file, end to end
            </h1>
            <p className="mt-4 max-w-2xl text-navy-foreground/75">
              The managed concierge service takes your documents once and drives every submission
              through to an official portal reference number.
            </p>
            <Button asChild variant="hero" className="mt-8">
              <Link to="/">Browse scholarships</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <step.icon className="size-6 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
          <h2 className="text-2xl font-semibold">What is included</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Eligibility screening against the official scholarship criteria",
              "Reusable document vault so you never re-upload the same file",
              "Statement of purpose structure feedback before submission",
              "Live pipeline status from document review to final decision",
              "Official application ID and submission receipt filed to your dashboard",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
