import { describe, expect, it } from "vitest";
import { TIER_FEES_USD, normalizeMtnMsisdn, usdToRwf } from "./pricing";

describe("pricing", () => {
  it("full managed application costs $25", () => {
    expect(TIER_FEES_USD.managed).toBe(25);
  });
  it("document review costs half: $12.50", () => {
    expect(TIER_FEES_USD.review).toBe(12.5);
  });
  it("converts USD to RWF rounding up", () => {
    expect(usdToRwf(12.5, 1400.4)).toBe(17505);
  });
  it("normalizes Rwandan MTN numbers", () => {
    expect(normalizeMtnMsisdn("078 123 4567")).toBe("250781234567");
    expect(normalizeMtnMsisdn("+250 79 123 4567")).toBe("250791234567");
    expect(normalizeMtnMsisdn("12345")).toBeNull();
  });
});
