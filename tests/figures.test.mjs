// T-013 tests: arithmetic, rounding, privacy of published figures, and official anchors.
// Household values are private (private/household-inputs.js); their tests skip when absent.
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
// Tests that need household values run only when the private inputs file is present.
function htest(name, fn) {
  if (!F.HAS_PRIVATE_INPUTS) { console.log("skipped (private inputs absent) -", name); return; }
  test(name, fn);
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

htest("every stored household figure is a multiple of $10", () => {
  for (const row of [...F.PROP_A_HISTORY, ...F.PROP_B_HISTORY]) {
    for (const v of [row[1], row[3]]) {
      if (v !== null) assert.equal(v % 10, 0, `not rounded: ${v}`);
    }
  }
  for (const v of [F.INPUTS.propA_marketValueNov2026, F.INPUTS.propB_marketValueNov2026, F.INPUTS.propA_baseAssessedValue2026]) {
    assert.equal(v % 10, 0);
  }
});

htest("Property A 2026 assessed value equals 2025 roll plus 2% (within $10 rounding)", () => {
  const expected = F.INPUTS.propA_assessedLast * 1.02;
  assert.ok(Math.abs(expected - F.INPUTS.propA_baseAssessedValue2026) <= 10, `${expected} vs ${F.INPUTS.propA_baseAssessedValue2026}`);
});

htest("implied non-assessed charge on Property A is derived, not assumed to be official", () => {
  assert.equal(F.propAOtherCharges2026(), 1810);
});

test("Prop 19 exclusion amount matches BOE NR 25-02 (transfers 16 Feb 2025 – 15 Feb 2027)", () => {
  assert.equal(F.OFFICIAL.prop19ExclusionAmount, 1044586);
  assert.equal(F.OFFICIAL.prop19ExclusionEnds, "15 Feb 2027");
});

test("federal basic exclusion for 2026 is $15,000,000 (IRS filing-threshold table)", () => {
  assert.equal(F.OFFICIAL.federalBasicExclusion2026, 15000000);
});

htest("Prop 19 assessed value never falls below the base-year value and never exceeds market by more than the base", () => {
  for (const y of [2040, 2050]) for (const g of F.ASSUME.marketGrowthScenarios) {
    const base = F.holdAssessed(y);
    const mv = F.marketAt(y, g);
    const av = F.prop19Assessed(y, g);
    assert.ok(av >= base - 1e-6, "below base");
    assert.ok(av <= mv + 1e-6, "above market");
  }
});

htest("reassessed tax minus Prop 19 tax equals the 1% gap on the excess over the exclusion", () => {
  const s = F.transferScenario(2040, 0.03);
  // Gap in assessed value is (market - Prop19 AV); tax gap = 1% of that (within rounding).
  const avGap = s.assessedReassessed - s.assessedProp19;
  assert.ok(Math.abs(s.annualGapReassessedMinusProp19 - 0.01 * avGap) <= 20, `${s.annualGapReassessedMinusProp19} vs ${0.01 * avGap}`);
});

htest("hold projection grows at 2% per year (Prop 13 ceiling)", () => {
  const a = F.holdAssessed(2030);
  const b = F.holdAssessed(2031);
  assert.ok(Math.abs(b / a - 1.02) < 1e-9);
});

htest("operating costs annualize monthly ranges and keep solar as a credit", () => {
  const c = F.operatingCosts();
  assert.deepEqual(c.propAWaterYear, [1200, 1800]);
  assert.deepEqual(c.propBWaterYear, [3960, 4800]);
  // Expected values are computed from the private inputs; no household literal appears here.
  assert.deepEqual(c.propBElectricYear, F.INPUTS.propB_electric_month.map((v) => v * 12));
  assert.deepEqual(c.propASolarYear, F.INPUTS.propA_solarNet_month.map((v) => v * 12));
  assert.equal(c.propBRentYear, F.INPUTS.propB_rentMonthly * 12);
});

htest("insurance is left blank, never inferred", () => {
  assert.equal(F.INPUTS.propA_insurance_year, null);
  assert.equal(F.INPUTS.propB_insurance_year, null);
});

test("estate headroom reports incomplete status when other assets are unknown", () => {
  const h = F.estateHeadroom(1000000); // generic example input
  assert.equal(h.status, "Incomplete — other assets unknown");
  assert.equal(h.headroomToFederal2026, 14000000);
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

test("Treasury anchors are the latest fetched official 25 Nov 2026 par yields", () => {
  assert.equal(F.OFFICIAL.treasury3M, 0.0434);
  assert.equal(F.OFFICIAL.treasury2Y, 0.0461);
  assert.equal(F.OFFICIAL.treasuryDate, "25 Nov 2026");
});

test("published Black Swan outputs are regenerated from the current 3-month proxy", () => {
  const crash = F.simulate(1000000, F.REGIMES.crash1929, 120, F.OFFICIAL.treasury3M, 24, 12);
  assert.equal(crash.stagedEnd, 1854 * 1000 + 940);
  assert.equal(crash.stagedMinusLump, 1489 * 1000 + 800);
  const normal = F.simulate(1000000, F.REGIMES.base, 120, F.OFFICIAL.treasury3M, 24, 12);
  assert.equal(normal.stagedEnd, 1577 * 1000 + 630);
  assert.equal(normal.stagedMinusLump, -(38 * 1000 + 70));
  const page = fs.readFileSync(path.join(root, "blackswan.html"), "utf8");
  assert.ok(page.includes("$1,854,940"));
  assert.ok(page.includes("−$38,070"));
  assert.ok(page.includes("4.34% (Treasury 3M, 25 Nov 2026)"));
});

// ---------- privacy: published files must not contain raw figures or location identifiers ----------
// Household-specific forbidden values live only in the gitignored private/privacy-terms.js (SHA-256 digests).
// Generic identifier patterns below always run.
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
let PT = null;
try { PT = require(path.join(root, "private/privacy-terms.js")); } catch (e) { PT = null; }
const identifierPatterns = [/\bAPN\b/, /parcel number/i];

const publicFiles = ["figures.html", "blackswan.html", "flagged.html", "assets/figures.js"]
  .map((f) => path.join(root, f))
  .filter((f) => fs.existsSync(f));

test("published figure files contain no raw (unrounded) household figures (private list)", () => {
  if (!PT) { console.log("  skipped: private/privacy-terms.js not present"); return; }
  for (const file of publicFiles) {
    const text = fs.readFileSync(file, "utf8");
    const numbers = text.match(/\d{1,3}(?:,\d{3})+|\d{4,}/g) || [];
    for (const token of numbers) {
      assert.ok(!PT.forbiddenNumberDigests.has(sha(token.replace(/,/g, ""))), `${path.basename(file)} contains a raw household figure`);
    }
  }
});

test("published figure files contain no postal codes, place names, or parcel identifiers", () => {
  for (const file of publicFiles) {
    const text = fs.readFileSync(file, "utf8");
    if (PT) {
      const words = text.toLowerCase().match(/[a-z]+/g) || [];
      for (const w of words) assert.ok(!PT.forbiddenWordDigests.has(sha(w)), `${path.basename(file)} contains a forbidden place name`);
      const fiveDigit = text.match(/(?<![\d,])\d{5}(?![\d,])/g) || [];
      for (const token of fiveDigit) assert.ok(!PT.forbiddenPostalDigests.has(sha(token)), `${path.basename(file)} contains a forbidden postal code`);
    }
    for (const rx of identifierPatterns) {
      assert.ok(!rx.test(text), `${path.basename(file)} matches an identifier pattern`);
    }
  }
});

console.log(`\n${passed} figure tests passed${PT ? "" : " (private household checks skipped)"}.`);
