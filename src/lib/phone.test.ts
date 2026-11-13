import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPhone, validatePhone } from "./phone";

test("Rwanda accepts 9 digits starting with 7", () => {
  assert.equal(formatPhone("RW", "0788 123 456"), "+250788123456");
  assert.equal(validatePhone("RW", "788123456"), null);
});
test("Rwanda rejects wrong length or prefix", () => {
  assert.notEqual(validatePhone("RW", "78812345"), null);
  assert.notEqual(validatePhone("RW", "588123456"), null);
});
test("Burundi requires 8 digits", () => {
  assert.equal(validatePhone("BI", "79123456"), null);
  assert.notEqual(validatePhone("BI", "791234567"), null);
});
