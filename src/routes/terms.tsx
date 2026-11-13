import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";
import { TIER_FEES_USD } from "@/lib/pricing";

export const Route = createFileRoute("/terms")({
  head: () => legalHead("/terms", "Terms of Service — ElScholarship", "Terms for using ElScholarship's free scholarship directory and paid document review and managed application services."),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="13 November 2026" intro="By using ElScholarship you agree to these terms. Please read them carefully before using our paid services.">
      <section>
        <h2>Our services</h2>
        <ul>
          <li><strong>Direct self-application — free.</strong> You can open the official link for any listing and apply yourself at no cost.</li>
          <li><strong>Document review &amp; guidelines — ${TIER_FEES_USD.review.toFixed(2)} per application.</strong> We review your documents and give written guidance.</li>
          <li><strong>Full managed application — ${TIER_FEES_USD.managed.toFixed(2)} per application.</strong> Our team prepares and submits your application for you.</li>
        </ul>
        <p>Paid services are not free. Fees are shown in US dollars and may be charged in Rwandan francs at the current exchange rate. See <Link to="/concierge">Managed Concierge</Link> for details.</p>
      </section>
      <section>
        <h2>Payment</h2>
        <p>We check your eligibility first and only then send a payment request, for example through MTN Mobile Money. Work on a paid service starts once payment is confirmed.</p>
      </section>
      <section>
        <h2>No guarantee of award</h2>
        <p>Admission and scholarship decisions are made only by universities and funding bodies. We cannot promise that any application will succeed, and fees are for our work, not for an outcome.</p>
      </section>
      <section>
        <h2>Your responsibilities</h2>
        <p>You must give true and complete information and upload genuine documents. We may refuse or stop a service if documents are false or misleading.</p>
      </section>
      <section>
        <h2>Listing accuracy</h2>
        <p>We check listings against official sources, but deadlines and conditions can change. Always confirm the details on the official scholarship page before applying.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about these terms? <Link to="/contact">Contact our support team</Link>.</p>
      </section>
    </LegalPage>
  );
}
