import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => legalHead("/privacy", "Privacy Policy — ElScholarship", "How ElScholarship collects, uses and protects student data, uploaded documents, analytics and advertising cookies."),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="13 November 2026" intro="ElScholarship helps students in Rwanda and worldwide find and apply for scholarships. This policy explains what information we collect, why, and the choices you have.">
      <section>
        <h2>Information you give us</h2>
        <ul>
          <li>Account details: your name, email address and sign-in information (including Google sign-in if you use it).</li>
          <li>Application details: phone number, the scholarship you choose and the service you select.</li>
          <li>Documents you upload, such as transcripts, statements of purpose, passports or IDs and English test results.</li>
          <li>Payment details for paid services, such as the MTN Mobile Money number used for a payment request.</li>
        </ul>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>We use your information to run your account, review your documents, prepare and submit managed applications, request payment for paid services, and contact you about your applications. We do not sell your personal information.</p>
      </section>
      <section>
        <h2>Your documents</h2>
        <p>Uploaded documents are kept in private storage. Only you and authorised ElScholarship officers handling your application can open them, through short-lived secure links.</p>
      </section>
      <section>
        <h2>Visitor analytics</h2>
        <p>We use Lovable's built-in visitor analytics. It uses no cookies, stores nothing on your device, doesn't keep IP addresses and doesn't identify visitors. Lovable collects this data for us. <a href="https://lovable.dev/privacy" target="_blank" rel="noreferrer">Lovable's privacy policy</a> explains how it handles it.</p>
        <p>It records the pages visited, where visitors came from, their country, browser, operating system and device type, how long they stay, how fast pages load, errors, and which buttons and links are clicked. Detailed data is kept for 90 days and daily summaries for a year. All of this is recorded for every visitor, without cookies and without identifying anyone.</p>
      </section>
      <section>
        <h2>Advertising</h2>
        <p>Public pages show ads from Google AdSense, Adcash and other ad networks. These partners may set cookies or use similar technology on your device to show and measure ads, and they receive information such as the page you are viewing, your browser and your approximate location. You can manage Google ad personalisation at <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">adssettings.google.com</a>. Ads are not shown in your student dashboard or in the officer area.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>You can view and update your details from your dashboard, and ask us to delete your account and documents at any time by contacting our <a href="/contact">Contact page</a> or WhatsApp at +250 794 433 166.</p>
      </section>
    </LegalPage>
  );
}
