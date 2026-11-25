// T-009 tests: arithmetic, rounding, privacy of published figures, and official anchors.
// Run: node tests/figures.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const F = require(path.join(root, "assets/figures.js"));
let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log("ok -", name);
}

test("r10 rounds to nearest $10 (half up)", () => {
  assert.equal(F.r10(1234), 1230);
  assert.equal(F.r10(1235), 1240);
  assert.equal(F.r10(1233), 1230);
  assert.equal(F.r10(995), 1000);
  assert.equal(F.r10(-125), -120);
});

test("usd formats rounded values and flags blanks", () => {
  assert.equal(F.usd(1234567), "$1,234,570");
  assert.equal(F.usd(-120), "−$120");
  assert.equal(F.usd(null), "Blank — unverified");
});

test("every stored household figure is a multiple of $10", () => {
  for (const row of [...F.PROP_A_HISTORY, ...F.PROP_B_HISTORY]) {
    for (const v of [row[1], row[3]]) {
      if (v !== null) assert.equal(v % 10, 0, `not rounded: ${v}`);
    }
  }
  for (const v of [F.INPUTS.propA_marketValueNov2026, F.INPUTS.propB_marketValueNov2026, F.INPUTS.propA_baseAssessedValue2026]) {
    assert.equal(v % 10, 0);
  }
});

test("Property A 2026 assessed value equals 2025 roll plus 2% (within $10 rounding)", () => {
  const expected = F.INPUTS.propA_assessedLast * 1.02;
  assert.ok(Math.abs(expected - F.INPUTS.propA_baseAssessedValue2026) <= 10, `${expected} vs ${F.INPUTS.propA_baseAssessedValue2026}`);
});

test("implied non-assessed charge on Property A is derived, not assumed to be official", () => {
  assert.equal(F.propAOtherCharges2026(), 1810);
});

test("Prop 19 exclusion amount matches BOE NR 25-02 (transfers 16 Feb 2025 – 15 Feb 2027)", () => {
  assert.equal(F.OFFICIAL.prop19ExclusionAmount, 1044586);
  assert.equal(F.OFFICIAL.prop19ExclusionEnds, "15 Feb 2027");
});

test("federal basic exclusion for 2026 is $15,000,000 (IRS filing-threshold table)", () => {
  assert.equal(F.OFFICIAL.federalBasicExclusion2026, 15000000);
});

test("Prop 19 assessed value never falls below the base-year value and never exceeds market by more than the base", () => {
  for (const y of [2040, 2050]) for (const g of F.ASSUME.marketGrowthScenarios) {
    const base = F.holdAssessed(y);
    const mv = F.marketAt(y, g);
    const av = F.prop19Assessed(y, g);
    assert.ok(av >= base - 1e-6, "below base");
    assert.ok(av <= mv + 1e-6, "above market");
  }
});

test("reassessed tax minus Prop 19 tax equals the 1% gap on the excess over the exclusion", () => {
  const s = F.transferScenario(2040, 0.03);
  // Gap in assessed value is (market - Prop19 AV); tax gap = 1% of that (within rounding).
  const avGap = s.assessedReassessed - s.assessedProp19;
  assert.ok(Math.abs(s.annualGapReassessedMinusProp19 - 0.01 * avGap) <= 20, `${s.annualGapReassessedMinusProp19} vs ${0.01 * avGap}`);
});

test("hold projection grows at 2% per year (Prop 13 ceiling)", () => {
  const a = F.holdAssessed(2030);
  const b = F.holdAssessed(2031);
  assert.ok(Math.abs(b / a - 1.02) < 1e-9);
});

test("operating costs annualize monthly ranges and keep solar as a credit", () => {
  const c = F.operatingCosts();
  assert.deepEqual(c.propAWaterYear, [1200, 1800]);
  assert.deepEqual(c.propBWaterYear, [3960, 4800]);
  assert.deepEqual(c.propBElectricYear, [360, 840]);
  assert.deepEqual(c.propASolarYear, [-240, -120]);
  assert.equal(c.propBRentYear, 7150 * 12);
});

test("insurance is left blank, never inferred", () => {
  assert.equal(F.INPUTS.propA_insurance_year, null);
  assert.equal(F.INPUTS.propB_insurance_year, null);
});

test("estate headroom reports incomplete status when other assets are unknown", () => {
  const h = F.estateHeadroom(4900000);
  assert.equal(h.status, "Incomplete — other assets unknown");
  assert.equal(h.headroomToFederal2026, 10100000);
});

test("staging: zero-volatility market loses only the cash-drag cost", () => {
  const r = F.simulate(1000000, F.REGIMES.base, 120, F.OFFICIAL.treasury3M, 24, 12);
  assert.ok(r.stagedMinusLump < 0, "staging should cost return with no crash");
});

test("staging: staged path has a higher worst-point value than lump sum in a crash", () => {
  const r = F.simulate(1000000, F.REGIMES.crash2008, 120, F.OFFICIAL.treasury3M, 24, 12);
  assert.ok(r.stagedWorst >= r.lumpWorst);
});

test("staging: lower cash yield (reinvestment risk) reduces staged outcome", () => {
  const hi = F.simulate(1000000, F.REGIMES.crash2008, 120, 0.0436, 24, 12);
  const lo = F.simulate(1000000, F.REGIMES.crash2008, 120, 0.02, 24, 12);
  assert.ok(lo.stagedEnd < hi.stagedEnd);
});

test("Treasury anchors are the official 24 Nov 2026 par yields", () => {
  assert.equal(F.OFFICIAL.treasury3M, 0.0436);
  assert.equal(F.OFFICIAL.treasury2Y, 0.0463);
  assert.equal(F.OFFICIAL.treasuryDate, "24 Nov 2026");
});

// ---------- privacy: published files must not contain raw figures or location identifiers ----------
// Forbidden literals are stored only as SHA-256 digests so this public test file never republishes them.
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const forbiddenNumberDigests = new Set([
  "39842cd9da3b334e8c1db206f1705d15a9a1f052c0e5b25a148dc4da26cf31f1",
  "099edec0edb103d87794b711571ef49360169a7aaea268f842e5aa45d59ee0d3",
  "97e993dda390f1cf07230629d658f0facdcb99b24c227500537366d1a3161802",
  "e98a698e90e42c7d3391f33497d7cef396e39d4bd25179562206f6f4cf7bf501",
  "ee7e99405d3d9c32eefc0fe7cd20207e84027c2e3487c805cbaf5505a8d5f61a",
  "46ece05546fb2626da88a216af6aa066b5172e824ad9eae6742d8e12ef6fbcc8",
  "30332d66f3ddf1ced8fd978136e88dc7cbbdb9e40c570f4e81f875408fd3ad24",
  "492053065ed017f42aae8c1f37647cec9d3d2b464f8760bb4ba0373b0309a0ea",
  "85df60af2698a93c36c364ac69eb29d981cb26c683f0b68b402f484aab57f000",
  "d376881f5bd00764c32b8645a0f7966bc86ec3d3ea0e7b51e830e5f12aae3071",
  "04e97796ac4d1ffe851398d3a25afad5f62916ef5ac22f6f10e83192dc15e8c3"
]);
const forbiddenWordDigests = new Set([
  "f6f9c5f004b4e5b525d9712aaafefcf17a8e93130541a137e5d7d9cf495a50f9",
  "0829103205fbe7963996bfacbaeaab326bb8eded5bd97e9b677f7c05fbe44b5b" // neighborhood name
]);
const forbiddenPostalDigests = new Set([
  "2478d903d7c875f05299efe5a271b802046c65fdbb33ab2d0a0085f5b73748ed",
  "43086d953bcc428c4a8bf097446b87d9f577a80d4bd010a4313d575484cc9f21" // Property B postal code
]);
const identifierPatterns = [/\bAPN\b/, /parcel number/i];

const publicFiles = ["figures.html", "blackswan.html", "flagged.html", "assets/figures.js"]
  .map((f) => path.join(root, f))
  .filter((f) => fs.existsSync(f));

test("published figure files contain no raw (unrounded) household figures", () => {
  for (const file of publicFiles) {
    const text = fs.readFileSync(file, "utf8");
    const numbers = text.match(/\d{1,3}(?:,\d{3})+|\d{4,}/g) || [];
    for (const token of numbers) {
      assert.ok(!forbiddenNumberDigests.has(sha(token.replace(/,/g, ""))), `${path.basename(file)} contains a raw household figure`);
    }
  }
});

test("published figure files contain no postal codes, city/neighborhood names, or parcel identifiers", () => {
  for (const file of publicFiles) {
    const text = fs.readFileSync(file, "utf8");
    const words = text.toLowerCase().match(/[a-z]+/g) || [];
    for (const w of words) {
      assert.ok(!forbiddenWordDigests.has(sha(w)), `${path.basename(file)} contains a forbidden place name`);
    }
    const fiveDigit = text.match(/(?<![\d,])\d{5}(?![\d,])/g) || [];
    for (const token of fiveDigit) {
      assert.ok(!forbiddenPostalDigests.has(sha(token)), `${path.basename(file)} contains a forbidden postal code`);
    }
    for (const rx of identifierPatterns) {
      assert.ok(!rx.test(text), `${path.basename(file)} matches an identifier pattern`);
    }
  }
});

console.log(`\n${passed} figure tests passed.`);
