/*
 * Household figures and projection engine (T-009).
 *
 * PRIVACY: every household figure is stored ROUNDED TO THE NEAREST $10 and
 * no raw source value is kept in this file. Figures are user-supplied
 * (unverified) unless a row states otherwise. Property A / Property B only.
 *
 * Pure functions: no DOM access, so tests can run under Node.
 */
(function (root) {
  "use strict";

  // ---------- rounding and formatting ----------
  function r10(x) {
    return Math.round(x / 10) * 10;
  }
  function usd(x) {
    if (x === null || x === undefined || Number.isNaN(x)) return "Blank — unverified";
    const v = r10(x);
    const sign = v < 0 ? "−" : "";
    return sign + "$" + Math.abs(v).toLocaleString("en-US");
  }
  function pct(x, digits) {
    if (x === null || x === undefined) return "—";
    return (x * 100).toFixed(digits === undefined ? 2 : digits) + "%";
  }

  // ---------- official anchors (verified in this session; see sources.html) ----------
  const OFFICIAL = {
    prop19ExclusionAmount: 1044586, // BOE news release NR 25-02 (transfers 16 Feb 2025 – 15 Feb 2027)
    prop19ExclusionEnds: "15 Feb 2027",
    federalBasicExclusion2026: 15000000, // IRS estate-tax page, filing threshold table, 2026
    federalExclusion2025: 13990000, // IRS estate-tax page, 2025
    annualGiftExclusion2026: 19_000, // reported by secondary sources only; official check pending (flagged)
    treasury3M: 0.0436, // Treasury Daily Par Yield Curve, 24 Nov 2026 (3 Mo)
    treasury2Y: 0.0463, // Treasury Daily Par Yield Curve, 24 Nov 2026 (2 Yr)
    treasuryDate: "24 Nov 2026",
    recession1929: { peak: "Aug 1929", trough: "Mar 1933", months: 43 }, // NBER
    recession2008: { peak: "Dec 2007", trough: "Jun 2009", months: 18 }, // NBER
    fedInflationTarget: 0.02, // Federal Reserve FAQ (PCE 2% longer run)
    prop13CapCeiling: 0.02 // Cal. Const. art. XIII A, 2% ceiling on annual assessed-value growth (statute text, see flags)
  };

  // ---------- Property A (user-supplied, rounded to $10) ----------
  // [year, property tax (usd), tax change, assessed value (usd), assessed change]
  const PROP_A_HISTORY = [
    [2026, null, null, 550540, "+2% (projected)"],
    [2025, 7210, "+2.9%", 539740, "+2%"],
    [2024, 7000, "+1.2%", 529160, "+2%"],
    [2023, 6920, "+2.4%", 518790, "+2%"],
    [2022, 6760, "+1.4%", 508610, "+2%"],
    [2021, 6660, "+1.5%", 498640, "+1%"],
    [2020, 6570, null, 493530, "+2%"],
    [2019, 6570, "+2.8%", 483850, "+2%"],
    [2018, 6380, null, 474370, "+2%"],
    [2017, 6380, "−0.5%", 465070, "+2%"],
    [2016, 6410, "+4.6%", 455950, "+1.5%"],
    [2015, 6130, "+2.8%", 449100, "+2%"],
    [2014, 5970, "+0.5%", 440310, null]
  ];

  // ---------- Property B (user-supplied, rounded to $10) ----------
  const PROP_B_HISTORY = [
    [2025, 2440, "+5.3%", 114250, "+2%"],
    [2024, 2320, "+6.2%", 112010, "+2%"],
    [2023, 2180, "+3.4%", 109810, "+2%"],
    [2022, 2110, "+2%", 107660, "+2%"],
    [2021, 2070, "−5.9%", 105600, "+1%"],
    [2020, 2200, "+3%", 104510, "+2%"],
    [2019, 2130, "+3.5%", 102470, "+2%"],
    [2018, 2060, "+18.4%", 100460, "+2%"],
    [2017, 1740, "+3.9%", 98_490, "+2%"],
    [2016, 1680, "+1.6%", 96_560, "+1.5%"]
  ];

  // ---------- Current estimates and operating inputs (user-supplied, unverified) ----------
  const INPUTS = {
    propA_marketValueNov2026: 3100000, // user estimate; no written appraisal yet
    propA_baseAssessedValue2026: 550540, // rounded projection (2% cap applied to 2025 roll)
    propA_taxLast: 7210, // 2025 bill, rounded
    propA_assessedLast: 539740, // 2025 roll, rounded
    propA_water_month: [100, 150], // range
    propA_solarNet_month: [-20, -10], // negative = credit to household (user estimate)
    propB_marketValueNov2026: 1800000,
    propB_rentMonthly: 7150, // two rented units, combined
    propB_water_month: [330, 400], // three livable units, combined
    propB_electric_month: [30, 70], // combined range
    propA_insurance_year: null, // not verified — leave blank
    propB_insurance_year: null // not verified — leave blank
  };

  // Derived (not official): implied non-ad-valorem charge on Property A
  // (2025 tax minus 1% of 2025 assessed value). Used only as a proxy.
  function propAOtherCharges2026() {
    return r10(INPUTS.propA_taxLast - 0.01 * INPUTS.propA_assessedLast);
  }

  // Property A projections (nominal, USD). Assumptions are explicit parameters.
  const ASSUME = {
    growthAssessedCap: OFFICIAL.prop13CapCeiling, // base-year growth assumed at the 2% ceiling (upper bound)
    otherChargesGrowth: 0.02,
    marketGrowthScenarios: [0.02, 0.03, 0.04], // inflation-like, base, strong
    transferYears: [2040, 2050]
  };

  function holdAssessed(year) {
    return INPUTS.propA_baseAssessedValue2026 * Math.pow(1 + ASSUME.growthAssessedCap, year - 2026);
  }
  function marketAt(year, g) {
    return INPUTS.propA_marketValueNov2026 * Math.pow(1 + g, year - 2026);
  }
  function otherChargesAt(year) {
    return propAOtherCharges2026() * Math.pow(1 + ASSUME.otherChargesGrowth, year - 2026);
  }
  // Prop 19 parent-child case (only if the transferee makes it a principal residence and files on time).
  // Taxable value = base + excess of market over (base + exclusion amount), per the BOE description that the
  // excludable amount is capped at base-year value plus the exclusion amount. CPA/assessor must confirm mechanics.
  function prop19Assessed(year, g) {
    const base = holdAssessed(year);
    const mv = marketAt(year, g);
    return base + Math.max(0, mv - base - OFFICIAL.prop19ExclusionAmount);
  }
  function reassessedAssessed(year, g) {
    return marketAt(year, g); // full reassessment at change of ownership
  }
  function taxFromAssessed(av, year) {
    return 0.01 * av + otherChargesAt(year);
  }

  function transferScenario(year, g) {
    const mv = marketAt(year, g);
    const avP19 = prop19Assessed(year, g);
    const avRe = reassessedAssessed(year, g);
    const taxP19 = taxFromAssessed(avP19, year);
    const taxRe = taxFromAssessed(avRe, year);
    return {
      year,
      growth: g,
      marketValue: r10(mv),
      assessedProp19: r10(avP19),
      assessedReassessed: r10(avRe),
      taxProp19: r10(taxP19),
      taxReassessed: r10(taxRe),
      annualGapReassessedMinusProp19: r10(taxRe - taxP19)
    };
  }

  function yearRows(years, g) {
    return years.map((y) => ({
      year: y,
      marketValue: r10(marketAt(y, g)),
      holdAssessed: r10(holdAssessed(y)),
      taxHold: r10(taxFromAssessed(holdAssessed(y), y)),
      taxProp19: r10(taxFromAssessed(prop19Assessed(y, g), y)),
      taxReassessed: r10(taxFromAssessed(reassessedAssessed(y, g), y))
    }));
  }

  // ---------- Operating costs (annual, rounded) ----------
  function annualRange(monthly) {
    return [r10(monthly[0] * 12), r10(monthly[1] * 12)];
  }
  function operatingCosts() {
    return {
      propAWaterYear: annualRange(INPUTS.propA_water_month),
      propASolarYear: annualRange(INPUTS.propA_solarNet_month),
      propBWaterYear: annualRange(INPUTS.propB_water_month),
      propBElectricYear: annualRange(INPUTS.propB_electric_month),
      propBRentYear: r10(INPUTS.propB_rentMonthly * 12)
    };
  }

  // ---------- Inheritance thresholds ----------
  function estateHeadroom(knownRealEstate, otherAssetsKnown) {
    // Only known real estate is entered; other assets are unknown, so the result is a floor, not a conclusion.
    const known = knownRealEstate + (otherAssetsKnown || 0);
    return {
      knownTotal: r10(known),
      headroomToFederal2026: r10(OFFICIAL.federalBasicExclusion2026 - known),
      status: otherAssetsKnown === undefined ? "Incomplete — other assets unknown" : "Partial"
    };
  }

  // ---------- Black Swan staging simulation (stylized, deterministic, monthly) ----------
  // Equity index: 1.0 at t=0, flat until the shock starts at 0, falls linearly to (1-depth) by month shockMonths,
  // recovers linearly to 1.0 over recoveryMonths, then grows at nominal annual rate afterGrowth.
  function equityIndex(t, p) {
    if (t <= 0) return 1;
    if (t <= p.shockMonths) return 1 - p.depth * (t / p.shockMonths);
    const recEnd = p.shockMonths + p.recoveryMonths;
    if (t <= recEnd) return 1 - p.depth + p.depth * ((t - p.shockMonths) / p.recoveryMonths);
    return Math.pow(1 + p.afterGrowth, (t - recEnd) / 12);
  }

  // Lump sum: all capital into equities at t=0. Staged: cash earns cashYield for stageMonths,
  // then equal monthly buys over deployMonths. Returns wealth and worst intermediate value.
  function simulate(P, p, horizonMonths, cashYield, stageMonths, deployMonths) {
    const cashM = Math.pow(1 + cashYield, 1 / 12) - 1;
    // Lump sum
    const lumpUnits = P / equityIndex(0, p);
    let lumpWorst = P;
    for (let t = 1; t <= horizonMonths; t++) {
      lumpWorst = Math.min(lumpWorst, lumpUnits * equityIndex(t, p));
    }
    const lumpEnd = lumpUnits * equityIndex(horizonMonths, p);

    // Staged
    let cash = P;
    let units = 0;
    let stagedWorst = P;
    const perBuy = deployMonths > 0 ? 1 / deployMonths : 1;
    for (let t = 1; t <= horizonMonths; t++) {
      cash *= 1 + cashM;
      if (t > stageMonths && t <= stageMonths + deployMonths) {
        const amount = cash * perBuy;
        units += amount / equityIndex(t, p);
        cash -= amount;
      }
      const value = cash + units * equityIndex(t, p);
      stagedWorst = Math.min(stagedWorst, value);
    }
    const stagedEnd = cash + units * equityIndex(horizonMonths, p);

    return {
      lumpEnd: r10(lumpEnd),
      lumpWorst: r10(lumpWorst),
      stagedEnd: r10(stagedEnd),
      stagedWorst: r10(stagedWorst),
      stagedMinusLump: r10(stagedEnd - lumpEnd)
    };
  }

  // Stylized regimes. Depths and months are NOT yet verified against an index provider (flagged on the page).
  const REGIMES = {
    crash1929: { label: "1929–1933-style collapse", depth: 0.89, shockMonths: 34, recoveryMonths: 300, afterGrowth: 0.04 },
    crash2008: { label: "2007–2009-style financial crisis", depth: 0.57, shockMonths: 17, recoveryMonths: 48, afterGrowth: 0.05 },
    base: { label: "No crash (steady growth)", depth: 0, shockMonths: 1, recoveryMonths: 1, afterGrowth: 0.05 }
  };

  const STAGING = { stageMonthsOptions: [24, 36], deployMonths: 12, horizonOptions: [120, 240] };

  const api = {
    r10,
    usd,
    pct,
    OFFICIAL,
    INPUTS,
    ASSUME,
    PROP_A_HISTORY,
    PROP_B_HISTORY,
    propAOtherCharges2026,
    holdAssessed,
    marketAt,
    prop19Assessed,
    reassessedAssessed,
    taxFromAssessed,
    transferScenario,
    yearRows,
    operatingCosts,
    estateHeadroom,
    equityIndex,
    simulate,
    REGIMES,
    STAGING
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.Figures = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
