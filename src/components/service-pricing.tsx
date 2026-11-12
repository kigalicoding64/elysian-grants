import { CheckCircle2, FileCheck2, Send, ArrowUpRight } from "lucide-react";
import { TIER_FEES_USD, TIER_LABELS } from "@/lib/pricing";

export function PricingSummary() {
  return (
    <div className="space-y-1 text-sm text-foreground">
      <p><strong>{TIER_LABELS.managed}: ${TIER_FEES_USD.managed}</strong> per application</p>
      <p>{TIER_LABELS.review}: <strong>${TIER_FEES_USD.review.toFixed(2)}</strong></p>
      <p className="text-xs text-muted-foreground">Direct self-application: free. Paid services are charged after the initial eligibility check.</p>
    </div>
  );
}

export function ServicePricing() {
  const services = [
    { title: "Direct Self-Application", price: "Free", unit: "No ElScholarship service fee", icon: ArrowUpRight, features: ["Follow the official application link", "Prepare your documents yourself", "Submit and track your own application"] },
    { title: TIER_LABELS.review, price: `$${TIER_FEES_USD.review.toFixed(2)}`, unit: "Per application reviewed · USD", icon: FileCheck2, features: ["Document compliance audit", "Statement of purpose feedback", "Personalized guidelines; you submit yourself"] },
    { title: TIER_LABELS.managed, price: `$${TIER_FEES_USD.managed}`, unit: "Per managed application · USD", icon: Send, features: ["Document review and file preparation", "Officer submits on your behalf", "Official submission proof and tracking"] },
  ];
  return (
    <section aria-labelledby="service-pricing-title" className="border-y border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase text-primary">Clear service fees</p>
        <h2 id="service-pricing-title" className="mt-2 text-2xl font-bold text-foreground">Choose your application support</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {services.map(({ title, price, unit, icon: Icon, features }) => (
            <div key={title} className="neu-flat rounded-lg p-6 text-card-foreground">
              <Icon className="size-5 text-primary" />
              <h3 className="mt-3 text-base font-semibold">{title}</h3>
              <p className="mt-4 text-3xl font-bold text-primary">{price}</p>
              <p className="mt-1 text-xs text-muted-foreground">{unit}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {features.map((feature) => <li key={feature} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /><span>{feature}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">No payment is required to request the initial eligibility check. Review and managed application services are paid, not free. Any university or third-party fees are separate; scholarship awards are not guaranteed.</p>
        <p className="mt-2 text-xs text-muted-foreground">Prices are in USD. The RWF amount will be confirmed at payment using the applicable exchange rate.</p>
      </div>
    </section>
  );
}