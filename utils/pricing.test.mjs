import assert from "node:assert/strict";
import { normalizeCurrency } from "./pricing.js";

assert.equal(
  normalizeCurrency({ amount: 100, currency: "SGD" }),
  345
);
assert.equal(
  normalizeCurrency({ amount: 100, currency: "MYR" }),
  100
);

console.log("All pricing normalization tests passed.");
