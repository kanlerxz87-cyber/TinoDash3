/*
  Engine regression tests.
  These assert model invariants and the exact figures published on the site, so a
  refactor that silently changes a headline number fails the build instead of
  quietly invalidating a page.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const engine = require("../assets/engine.js");

const BASE = { scenario: "baseline", horizon: 25, assumptions: engine.mergeAssumptions({}) };

const state = (scenario, horizon, overrides) => ({
  scenario,
  horizon,
  assumptions: engine.mergeAssumptions(overrides || {})
});

const near = (actual, expected, tolerance, label) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected} ±${tolerance}, got ${actual}`
  );
};

test("eight paths, unique keys, every kind and risk labelled", () => {
  assert.equal(engine.PATH_META.length, 8);
  const keys = engine.PATH_META.map((p) => p.key);
  assert.equal(new Set(keys).size, 8);
  for (const path of engine.PATH_META) {
    assert.ok(path.name && path.kind && path.risk, `path ${path.key} needs name/kind/risk`);
  }
});

test("four designed scenarios, each a full 20-year series per asset", () => {
  assert.deepEqual(Object.keys(engine.SCENARIOS).sort(), [
    "baseline",
    "crash1929",
    "crisis2008",
    "stagflation"
  ]);
  for (const scenario of Object.values(engine.SCENARIOS)) {
    for (const asset of ["equity", "treasury", "property", "rent", "inflation"]) {
      assert.equal(scenario[asset].length, engine.SCENARIO_LENGTH, `${scenario.key}.${asset}`);
    }
  }
});

test("evaluate returns one ranked row per path with finite positive values", () => {
  const rows = engine.evaluate(BASE);
  assert.equal(rows.length, 8);
  assert.deepEqual(rows.map((r) => r.rank), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const row of rows) {
    assert.ok(Number.isFinite(row.value) && row.value > 0, `${row.key} not finite/positive`);
  }
  for (let i = 1; i < rows.length; i += 1) {
    assert.ok(rows[i - 1].value >= rows[i].value, "rows must be descending by value");
  }
});

test("evaluate is deterministic for identical inputs", () => {
  const a = engine.evaluate(BASE).map((r) => r.value);
  const b = engine.evaluate(BASE).map((r) => r.value);
  assert.deepEqual(a, b);
});

test("published baseline figures at 5, 10, 25 and 50 years", () => {
  const expected = {
    5: { sellStocks: 1.186, sellDca12: 1.165, sellStage36: 1.149, holdLive: 1.093 },
    10: { rentThenSell: 1.369, sellStocks: 1.266, sellStage36: 1.226, holdLive: 1.077 },
    25: { holdRental: 2.416, sellStocks: 2.367, sellStage36: 2.293, holdLive: 1.571 },
    50: { holdRental: 6.346, sellStocks: 5.04, sellDca12: 4.948, holdLive: 3.006 }
  };
  for (const [horizon, rows] of Object.entries(expected)) {
    const result = engine.evaluate(state("baseline", Number(horizon)));
    for (const [key, value] of Object.entries(rows)) {
      const row = result.find((r) => r.key === key);
      near(row.value, value, 0.002, `${key} @ ${horizon}y`);
    }
  }
});

test("1929-style crash: staging beats immediate entry, as published", () => {
  const rows = engine.evaluate(state("crash1929", 5));
  const staged = rows.find((r) => r.key === "sellStage36").value;
  const immediate = rows.find((r) => r.key === "sellStocks").value;
  near(staged, 1.359, 0.002, "stage36 @ 5y crash");
  near(immediate, 0.588, 0.002, "sellStocks @ 5y crash");
  assert.ok(staged > immediate, "staging must beat immediate entry in the crash cell");
  assert.equal(rows[0].key, "sellStage36");
});

test("robustness covers 16 cells and reports a consistent tally", () => {
  const { cells, rows } = engine.robustness(engine.mergeAssumptions({}));
  assert.equal(cells, 16);
  assert.equal(rows.length, 8);
  assert.equal(rows.reduce((sum, r) => sum + r.top2, 0), 32, "two top-two slots per cell");
  assert.equal(rows.reduce((sum, r) => sum + r.wins, 0), 16, "one winner per cell");
  for (const row of rows) {
    assert.ok(row.top2 <= 16 && row.wins <= row.top2, `${row.key} tally out of range`);
    assert.ok(row.best >= row.worst);
  }
  assert.ok(rows[0].top2 >= rows[rows.length - 1].top2, "rows sorted by top-two finishes");
  assert.equal(rows.find((r) => r.key === "sellStage36").top2, 7);
  assert.equal(rows.find((r) => r.key === "sellStage36").wins, 6);
});

test("ladder comparison ranks 30-month best in the 1929 ten-year cell", () => {
  const cell = engine
    .stagingComparison(engine.mergeAssumptions({}))
    .find((c) => c.scenario === "crash1929" && c.horizon === 10);
  const byKey = Object.fromEntries(cell.values.map((v) => [v.key, v.value]));
  near(byKey.sellStocks, 0.7098, 0.002, "equities now");
  near(byKey.sellDca12, 0.8889, 0.002, "12-month entry");
  near(byKey.stage24, 1.5915, 0.002, "24-month ladder");
  near(byKey.stage30, 1.6408, 0.002, "30-month ladder");
  near(byKey.stage36, 1.5902, 0.002, "36-month ladder");
  // All three ladder lengths beat both immediate and 12-month entry in this cell, and
  // the ranking between 24 and 36 months is within one half of one percent.
  assert.ok(byKey.stage30 > byKey.stage36);
  assert.ok(Math.abs(byKey.stage24 - byKey.stage36) < 0.005, "24 and 36 months are effectively tied");
  for (const key of ["stage24", "stage30", "stage36"]) {
    assert.ok(byKey[key] > byKey.sellDca12 && byKey.sellDca12 > byKey.sellStocks);
  }
});

test("break-even ladder yield: baseline ~4.95% and the crash case is unmatched or negative", () => {
  const baseline = engine.breakEvenTreasuryRate(state("baseline", 10));
  near(baseline.rate, 0.0495, 0.002, "baseline break-even");
  assert.equal(baseline.unmatched, false);

  const crash = engine.breakEvenTreasuryRate(state("crash1929", 10));
  assert.ok(crash.rate < baseline.rate, "the crash case must need a lower ladder yield");
  assert.ok(crash.rate <= 0, "the published crash break-even is not a positive yield");

  for (const scenario of Object.keys(engine.SCENARIOS)) {
    const result = engine.breakEvenTreasuryRate(state(scenario, 10));
    assert.ok(Number.isFinite(result.rate), `${scenario} break-even must be finite`);
    assert.ok(result.rate >= -0.2501 && result.rate <= 0.6001, `${scenario} break-even out of bounds`);
  }
});

test("section 121 sweep is zero for short occupancy and grows with the window", () => {
  const sweep = engine.section121Sweep(engine.mergeAssumptions({}));
  const byYears = Object.fromEntries(sweep.map((r) => [r.liveYears, r.delta]));
  assert.equal(byYears[1], 0);
  assert.equal(byYears[2], 0);
  assert.equal(byYears[3], 0);
  near(byYears[5], 0.0115, 0.0005, "5-year delta");
  near(byYears[20], 0.0985, 0.0005, "20-year delta");
  for (const row of sweep) {
    assert.ok(row.with >= row.without, "the exclusion can never reduce proceeds");
    assert.equal(typeof row.horizon, "number");
  }
});

test("applySection121 excludes up to the stated units and never below zero", () => {
  const off = engine.mergeAssumptions({ section121: false });
  const on = engine.mergeAssumptions({ section121: true, section121Units: 0.5 });
  assert.equal(engine.applySection121(0.8, off), 0.8);
  near(engine.applySection121(0.8, on), 0.3, 1e-9, "half-unit exclusion");
  assert.equal(engine.applySection121(0.2, on), 0);
});

test("after-tax proceeds: costs, recapture ordering and the taxes-off switch", () => {
  const noTax = engine.afterTaxProceeds(1, 0.055, 1, 0, { capGainsRate: 0 });
  near(noTax, 0.945, 1e-9, "costs only");

  const taxed = engine.afterTaxProceeds(2, 0.05, 1, 0.2, {
    capGainsRate: 0.33,
    recaptureRate: 0.25
  });
  // net price 1.9, gain 0.9, recapture 0.2 @25%, capital gain 0.7 @33%
  near(taxed, 1.9 - 0.2 * 0.25 - 0.7 * 0.33, 1e-9, "recapture before capital gain");

  const loss = engine.afterTaxProceeds(0.9, 0.05, 1, 0, { capGainsRate: 0.33, recaptureRate: 0.25 });
  near(loss, 0.855, 1e-9, "a loss is not taxed here and is not refunded");
});

test("official fees reproduce the published worked example exactly", () => {
  const fees = engine.officialFees(1000000, { citySurcharge: true });
  assert.equal(fees.countyTransferTax, 1100);
  assert.equal(fees.cityConveyance, 3300);
  assert.equal(fees.recordingFirstPage, 92, "the $10 fraud fee is not charged on a deed paying transfer tax");
  assert.equal(fees.recording, 95);
  assert.equal(fees.total, 4495);

  const withoutTransferTax = engine.officialFees(1000000, { citySurcharge: false, transferTaxDocument: false });
  assert.equal(withoutTransferTax.recordingFirstPage, 102);
  assert.equal(withoutTransferTax.recording, 105);

  const fractional = engine.officialFees(1000500, {});
  near(fractional.countyTransferTax, 1100.55, 1e-9, "any fractional portion of $500 is charged");
});

test("property tax projection follows the 2% cap and shows both rate bands", () => {
  const rows = engine.propertyTaxProjection();
  assert.deepEqual(rows.map((r) => r.years), [0, 5, 10, 20, 30, 40, 50]);
  const atZero = rows[0];
  near(atZero.assessedAtCap, 1, 1e-9, "year 0 is the base year value");
  near(atZero.taxAt110, 0.011, 1e-9, "1.10% band at base year");
  near(atZero.taxAt125, 0.0125, 1e-9, "1.25% band at base year");

  const atTen = rows.find((r) => r.years === 10);
  near(atTen.assessedAtCap, Math.pow(1.02, 10), 1e-9, "2% annual cap");
  near(atTen.assessedLower, Math.pow(1.015, 10), 1e-9, "slower CPI path");
  for (const row of rows) {
    assert.ok(row.taxAt110 < row.taxAt125);
    assert.ok(row.assessedLower <= row.assessedAtCap);
  }
});

test("sensitivity probes flip the 25-year leader only where published", () => {
  const probes = engine.sensitivity(BASE);
  const byLabel = Object.fromEntries(probes.map((p) => [p.label, p]));
  assert.equal(byLabel["Capital-gains rate 0 → 33%"].flips, false);
  assert.equal(byLabel["Sale costs 5.5% → 9%"].flips, false);
  assert.equal(byLabel["Vacancy 5% → 12%"].winnerKey, "sellStocks");
  assert.equal(byLabel["Operating costs 28% → 45% of rent"].winnerKey, "sellStocks");
  assert.equal(byLabel["Gross rent yield 3.0% → 1.8%"].winnerKey, "sellStocks");
  assert.equal(byLabel["Imputed rent 0% → 3%"].winnerKey, "holdLive");
  assert.equal(byLabel["Treasury parking 30 → 36 months"].flips, false);
});

test("evaluateRange reports an ordered distribution of sequence variants", () => {
  const range = engine.evaluateRange(state("baseline", 10), "sellStage36", 12);
  assert.equal(range.count, 12);
  assert.ok(range.min <= range.p25, "min <= p25");
  assert.ok(range.p25 <= range.median, "p25 <= median");
  assert.ok(range.median <= range.p75, "median <= p75");
  assert.ok(range.p75 <= range.max, "p75 <= max");
  assert.ok(range.min > 0 && range.max < 100, "distribution stays in a sane band");
});

test("real terms are never larger than nominal terms with positive inflation", () => {
  const nominal = engine.resultFor("sellStocks", state("baseline", 25, { showReal: false }));
  const real = engine.resultFor("sellStocks", state("baseline", 25, { showReal: true }));
  assert.ok(real.value < nominal.value, "deflated result must be smaller");
  near(nominal.value, nominal.nominal, 1e-12, "real switch off leaves nominal untouched");
});

test("mergeAssumptions keeps defaults and ignores NaN or null overrides", () => {
  const merged = engine.mergeAssumptions({ stageMonths: NaN, vacancyRate: null, grossRentYield: 0.02 });
  assert.equal(merged.stageMonths, engine.DEFAULT_ASSUMPTIONS.stageMonths);
  assert.equal(merged.vacancyRate, engine.DEFAULT_ASSUMPTIONS.vacancyRate);
  assert.equal(merged.grossRentYield, 0.02);
  const copy = engine.mergeAssumptions({});
  copy.stageMonths = 99;
  assert.equal(
    engine.DEFAULT_ASSUMPTIONS.stageMonths,
    30,
    "callers must not be able to mutate the defaults"
  );
});
