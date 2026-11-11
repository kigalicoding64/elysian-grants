import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { TIER_FEES_USD, normalizeMtnMsisdn, usdToRwf } from "./pricing";

describe("pricing", () => {
  it("full managed application costs $25", () => {
    assert.equal(TIER_FEES_USD.managed, 25);
  });
  it("document review costs half: $12.50", () => {
    assert.equal(TIER_FEES_USD.review, 12.5);
  });
  it("converts USD to RWF rounding up", () => {
    assert.equal(usdToRwf(12.5, 1400.4), 17505);
  });
  it("normalizes Rwandan MTN numbers", () => {
    assert.equal(normalizeMtnMsisdn("078 123 4567"), "250781234567");
    assert.equal(normalizeMtnMsisdn("+250 79 123 4567"), "250791234567");
    assert.equal(normalizeMtnMsisdn("12345"), null);
  });
});
