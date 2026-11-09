// Browser-safe pricing rules shared by the apply form, dashboards and payment functions.
export type ServiceTier = "review" | "managed";

export const TIER_FEES_USD: Record<ServiceTier, number> = {
  review: 12.5,
  managed: 25,
};

export const TIER_LABELS: Record<ServiceTier, string> = {
  review: "Document Review & Guidelines",
  managed: "Full Managed Application",
};

export const PAYMENT_LABELS: Record<string, string> = {
  unbilled: "Awaiting eligibility check",
  pending: "MTN MoMo prompt sent",
  paid: "Paid",
  failed: "Payment failed",
  waived: "Waived",
};

/** Convert USD to RWF, rounded up to the nearest whole franc. */
export function usdToRwf(usd: number, rate: number): number {
  if (!(rate > 0)) throw new Error("Invalid exchange rate");
  return Math.ceil(usd * rate);
}

/** Normalize a Rwandan MTN number to MSISDN form (2507XXXXXXXX). Returns null if invalid. */
export function normalizeMtnMsisdn(phone: string): string | null {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 10) d = "250" + d.slice(1);
  if (d.length === 9 && d.startsWith("7")) d = "250" + d;
  return /^2507[2389]\d{7}$/.test(d) ? d : null;
}
