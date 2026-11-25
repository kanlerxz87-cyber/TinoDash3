/*
  Inheritance Decision Desk — normalised scenario engine (pure, no DOM).
  All scenario sequences are deliberate stress-test conventions, not forecasts,
  not historical reconstructions and not market data. See paths.html#method.
  Everything is normalised to a starting value of 1.00 unit so no household figure
  is ever needed or stored.
*/
(function (root) {
  "use strict";

  var SCENARIO_LENGTH = 20; // years of designed sequence; beyond this the cycle repeats (documented).

  function seq(values) {
    if (values.length !== SCENARIO_LENGTH) {
      throw new Error("scenario series must have " + SCENARIO_LENGTH + " annual entries");
    }
    return values;
  }

  var SCENARIOS = {
    baseline: {
      key: "baseline",
      label: "Irregular baseline",
      note: "Moderate but uneven cycles. A stress-test convention, not a forecast.",
      equity: seq([0.085, -0.04, 0.12, 0.055, 0.02, 0.10, -0.08, 0.15, 0.03, -0.11, 0.14, 0.06, -0.02, 0.09, 0.045, -0.06, 0.11, 0.02, 0.07, -0.03]),
      treasury: seq([0.042, 0.038, 0.034, 0.041, 0.032, 0.036, 0.039, 0.035, 0.030, 0.028, 0.033, 0.040, 0.043, 0.037, 0.031, 0.029, 0.034, 0.041, 0.038, 0.033]),
      property: seq([0.028, -0.02, 0.045, 0.022, 0.01, 0.036, -0.025, 0.04, 0.015, -0.09, 0.05, 0.03, 0.005, 0.035, 0.02, -0.045, 0.04, 0.025, 0.03, 0.01]),
      rent: seq([0.015, 0.013, 0.016, 0.014, 0.012, 0.015, 0.011, 0.015, 0.017, 0.010, 0.014, 0.016, 0.012, 0.013, 0.015, 0.011, 0.014, 0.016, 0.013, 0.012]),
      inflation: seq([0.027, 0.021, 0.029, 0.024, 0.022, 0.026, 0.020, 0.025, 0.031, 0.018, 0.024, 0.028, 0.021, 0.023, 0.027, 0.019, 0.025, 0.030, 0.022, 0.024])
    },
    crash1929: {
      key: "crash1929",
      label: "1929–1933-style early contraction",
      note: "A deliberately severe early shock informed by the NBER-dated August 1929 peak and March 1933 trough; not a reconstruction of historical returns.",
      equity: seq([-0.35, -0.22, -0.08, 0.18, 0.13, 0.09, 0.07, 0.11, -0.12, 0.06, 0.10, 0.04, 0.08, -0.05, 0.12, 0.02, 0.09, -0.03, 0.10, 0.05]),
      treasury: seq([0.041, 0.036, 0.031, 0.029, 0.032, 0.035, 0.037, 0.036, 0.030, 0.028, 0.031, 0.034, 0.036, 0.038, 0.033, 0.030, 0.034, 0.037, 0.035, 0.032]),
      property: seq([-0.13, -0.09, -0.02, 0.02, 0.03, 0.028, 0.024, 0.03, -0.05, 0.01, 0.035, 0.02, 0.015, -0.03, 0.03, 0.02, 0.025, -0.01, 0.03, 0.02]),
      rent: seq([0.010, 0.008, 0.009, 0.012, 0.013, 0.014, 0.014, 0.015, 0.011, 0.009, 0.012, 0.013, 0.014, 0.012, 0.013, 0.011, 0.014, 0.012, 0.013, 0.014]),
      inflation: seq([-0.010, -0.020, 0.000, 0.012, 0.020, 0.024, 0.023, 0.024, 0.018, 0.026, 0.022, 0.025, 0.021, 0.019, 0.024, 0.027, 0.022, 0.020, 0.025, 0.023])
    },
    crisis2008: {
      key: "crisis2008",
      label: "2007–2009-style liquidity and housing shock",
      note: "A severe sequence test informed by the NBER-dated December 2007 peak and the June 2009 trough; not a reconstruction or a prediction.",
      equity: seq([-0.37, 0.22, 0.11, 0.08, -0.07, 0.16, 0.06, 0.09, 0.12, -0.09, 0.15, 0.05, 0.10, -0.04, 0.13, 0.03, 0.11, -0.06, 0.14, 0.06]),
      treasury: seq([0.035, 0.029, 0.026, 0.030, 0.034, 0.038, 0.036, 0.039, 0.031, 0.027, 0.032, 0.036, 0.040, 0.033, 0.029, 0.031, 0.037, 0.041, 0.034, 0.030]),
      property: seq([-0.16, -0.08, 0.01, 0.035, 0.026, 0.02, 0.03, 0.028, 0.018, -0.06, 0.04, 0.03, 0.02, -0.02, 0.035, 0.025, 0.03, -0.01, 0.028, 0.022]),
      rent: seq([0.009, 0.010, 0.012, 0.013, 0.012, 0.014, 0.014, 0.015, 0.013, 0.010, 0.013, 0.014, 0.015, 0.012, 0.013, 0.011, 0.014, 0.013, 0.014, 0.015]),
      inflation: seq([0.015, 0.008, 0.018, 0.024, 0.021, 0.023, 0.025, 0.024, 0.020, 0.017, 0.022, 0.026, 0.023, 0.019, 0.024, 0.027, 0.021, 0.018, 0.024, 0.022])
    },
    stagflation: {
      key: "stagflation",
      label: "Stagflation / rate reset",
      note: "High and uneven inflation with weak nominal asset returns and higher short rates; a stress-test convention, not a forecast.",
      equity: seq([-0.12, 0.01, 0.06, -0.03, 0.09, 0.04, 0.07, 0.05, -0.08, 0.03, 0.05, -0.02, 0.08, 0.02, 0.06, -0.04, 0.07, 0.03, 0.05, -0.01]),
      treasury: seq([0.047, 0.052, 0.048, 0.045, 0.041, 0.039, 0.042, 0.040, 0.055, 0.050, 0.044, 0.038, 0.041, 0.046, 0.051, 0.047, 0.042, 0.039, 0.045, 0.048]),
      property: seq([0.005, -0.04, 0.015, 0.008, 0.022, 0.018, 0.02, 0.021, -0.01, 0.004, 0.018, 0.012, 0.024, 0.016, 0.02, -0.015, 0.022, 0.014, 0.019, 0.012]),
      rent: seq([0.014, 0.013, 0.016, 0.015, 0.016, 0.015, 0.015, 0.015, 0.013, 0.014, 0.017, 0.016, 0.018, 0.015, 0.016, 0.014, 0.017, 0.015, 0.016, 0.016]),
      inflation: seq([0.065, 0.072, 0.060, 0.052, 0.044, 0.038, 0.034, 0.031, 0.058, 0.066, 0.055, 0.046, 0.040, 0.035, 0.033, 0.048, 0.057, 0.049, 0.042, 0.036])
    }
  };

  var PATH_META = [
    { key: "sellStocks", name: "Sell → equities now", kind: "Pure liquid", risk: "Immediate sequence-of-returns exposure: the first years decide a lot." },
    { key: "sellStage36", name: "Sell → 3M–2Y ladder → phase in", kind: "Mixed liquid", risk: "Reinvestment risk: each maturity may reset at a lower or higher yield." },
    { key: "sellDca12", name: "Sell → 12-month equity entry", kind: "Mixed liquid", risk: "Partial sequence mitigation; most of the money is still exposed within a year." },
    { key: "rentThenSell", name: "Rent 5y → sell → staged", kind: "Mixed property", risk: "Rent, vacancy, capex, compliance and recapture are not verified." },
    { key: "liveThenSell", name: "Live 2y → sell → staged", kind: "Mixed occupancy", risk: "Occupancy alone does not create a tax exclusion; the tests must be met." },
    { key: "partialSell", name: "Sell half, rent half 5y", kind: "Mixed split", risk: "Two tax records, two exit dates, and landlord exposure on the retained half." },
    { key: "holdRental", name: "Hold as rental", kind: "Pure property", risk: "Lowest liquidity; operating, capital and tenant-law exposure continue." },
    { key: "holdLive", name: "Live long term", kind: "Pure occupancy", risk: "Incomplete without a verified imputed-rent estimate and carry costs." }
  ];

  function annualRateAt(scenario, asset, year) {
    var series = SCENARIOS[scenario][asset];
    return series[((year % SCENARIO_LENGTH) + SCENARIO_LENGTH) % SCENARIO_LENGTH];
  }

  function monthlyRate(annual) {
    return Math.pow(1 + annual, 1 / 12) - 1;
  }

  /* ---------- cost / tax inputs (all optional, all documented defaults) ---------- */

  var DEFAULT_ASSUMPTIONS = {
    stageMonths: 30,            // 24–36 month Treasury parking
    phaseMonths: 12,            // linear equity phase-in after the ladder
    rentBridgeMonths: 60,       // rent-then-sell bridge
    liveBridgeMonths: 24,       // live-then-sell screening window
    imputedRent: 0,             // annual % of property value; 0 = unverified
    grossRentYield: 0.030,      // annual gross rent as % of property value
    vacancyRate: 0.05,
    operatingCostRatio: 0.28,   // % of gross rent: insurance, tax, utilities, mgmt, repairs
    ownerCarryRatio: 0.020,     // % of value/yr while owner-occupied: tax, insurance, utilities, upkeep
    ownerOccupied: false,
    saleCostRatio: 0.055,       // commissions, escrow, title, transfer/recording, prep
    capGainsRate: 0,            // 0 = taxes deliberately OFF in the normalised view
    recaptureRate: 0,
    depreciationYears: 27.5,
    showReal: false,
    // Section 121 screen. Expressed in normalised units: 0.5 = half the starting
    // value, standing in for a $500,000 joint exclusion against a $1,000,000 start.
    // The real amount and the real gain must be recomputed from actual facts.
    section121: false,
    section121Units: 0.5,
    expansionMonths: 0
  };

  function mergeAssumptions(overrides) {
    var out = {};
    var key;
    for (key in DEFAULT_ASSUMPTIONS) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_ASSUMPTIONS, key)) out[key] = DEFAULT_ASSUMPTIONS[key];
    }
    if (overrides) {
      for (key in overrides) {
        if (Object.prototype.hasOwnProperty.call(overrides, key) && overrides[key] !== undefined && overrides[key] !== null && !Number.isNaN(overrides[key])) {
          out[key] = overrides[key];
        }
      }
    }
    return out;
  }

  /* ---------- building blocks ---------- */

  // Invest a lump sum. If stageMonths > 0, park in 3M–2Y Treasuries then phase into
  // equities linearly over phaseMonths. Returns nominal ending value.
  function invest(start, months, scenario, opts) {
    var stageMonths = Math.max(0, Math.min(opts.stageMonths || 0, months));
    var phaseMonths = Math.max(1, opts.phaseMonths || 1);
    var gradual = phaseMonths > 1;
    var equity = gradual ? 0 : start;
    var treasury = gradual ? start : 0;
    var month, year, transfer;
    for (month = 0; month < months; month += 1) {
      if (gradual && month >= stageMonths && month < stageMonths + phaseMonths) {
        transfer = treasury / (stageMonths + phaseMonths - month);
        treasury -= transfer;
        equity += transfer;
      }
      year = Math.floor(month / 12);
      equity *= 1 + monthlyRate(annualRateAt(scenario, "equity", year));
      treasury *= 1 + monthlyRate(annualRateAt(scenario, "treasury", year));
    }
    return equity + treasury;
  }

  // Hold property. Separate capital value growth from net operating cash flow.
  function holdProperty(start, months, scenario, opts) {
    var value = start;
    var cash = 0;          // accumulated net operating cash, reinvested at Treasury rates
    var imputed = 0;       // non-cash housing value of owner occupancy
    var rentCollected = 0;
    var costs = 0;
    var depreciation = 0;
    var carry = 0;
    var carryOpportunity = 0;
    var month, year, grossRent, net, imputedMonthly, carryMonthly;

    for (month = 0; month < months; month += 1) {
      year = Math.floor(month / 12);
      var opening = value;
      value *= 1 + monthlyRate(annualRateAt(scenario, "property", year));

      // Rent is modelled on opening value, grown by the scenario's rent series.
      grossRent = (opening * opts.grossRentYield / 12) * Math.pow(1 + annualRateAt(scenario, "rent", year), year);
      grossRent *= 1 - opts.vacancyRate;
      net = grossRent * (1 - opts.operatingCostRatio);
      costs += grossRent - net;
      rentCollected += grossRent;
      cash += net;

      imputedMonthly = opening * (opts.imputedRent / 12);
      imputed += imputedMonthly;

      // Owner-occupied carry: property tax, insurance, utilities and routine upkeep
      // are real cash outflows that renters do not pay. Held separately from the
      // capital value so the comparison is not flattered.
      if (opts.ownerOccupied) {
        carryMonthly = opening * (opts.ownerCarryRatio / 12);
        carry += carryMonthly;
        carryOpportunity += carryMonthly;
        carryOpportunity *= 1 + monthlyRate(annualRateAt(scenario, "treasury", year));
      }

      // Cash is not left idle: it earns the Treasury series.
      cash *= 1 + monthlyRate(annualRateAt(scenario, "treasury", year));

      // Straight-line depreciation on the building share only (illustrative).
      depreciation += (opening * 0.75) / (opts.depreciationYears * 12);
    }

    return {
      value: value,
      cash: cash,
      imputed: imputed,
      carry: carry,
      carryOpportunity: carryOpportunity,
      rentCollected: rentCollected,
      costs: costs,
      depreciation: depreciation,
      total: value + cash,
      totalWithImputed: value + cash + imputed - carryOpportunity
    };
  }

  function proceedsWith121(price, saleCostRatio, basis, a) {
    var netPrice = price * (1 - saleCostRatio);
    if (!a.capGainsRate) return netPrice;
    var gainUnits = Math.max(0, netPrice - basis);
    var taxable = applySection121(gainUnits, a);
    return netPrice - taxable * a.capGainsRate;
  }

  function ownerOccupied(a) {
    var copy = mergeAssumptions(a);
    copy.ownerOccupied = true;
    return copy;
  }

  // Published county transfer-tax and recording math (Santa Clara County).
  // rate values come from the official recorder pages linked in sources.html.
  var OFFICIAL_FEES = {
    countyTransferTaxPer500: 0.55,
    cityConveyancePer500SanJosePaloAltoMountainView: 1.65,
    recordingFirstPage: 102,
    recordingAdditionalPage: 3,
    pcORpenalty: 20
  };

  function officialFees(price, options) {
    var opts = options || {};
    var pages = opts.pages || 2;
    var citySurcharge = opts.citySurcharge ? OFFICIAL_FEES.cityConveyancePer500SanJosePaloAltoMountainView : 0;
    var county = Math.ceil((price / 500)) * OFFICIAL_FEES.countyTransferTaxPer500;
    var city = Math.ceil((price / 500)) * citySurcharge;
    var recording = OFFICIAL_FEES.recordingFirstPage + Math.max(0, pages - 1) * OFFICIAL_FEES.recordingAdditionalPage;
    return { countyTransferTax: county, cityConveyance: city, recording: recording, total: county + city + recording };
  }

  // Section 121: exclude up to the stated units of gain on a qualifying sale.
  function applySection121(gainUnits, a) {
    if (!a.section121) return gainUnits;
    return Math.max(0, gainUnits - a.section121Units);
  }

  // After-tax proceeds of a sale. Basis is the inherited value plus post-death
  // improvements (not modelled) minus accumulated depreciation for rental use.
  function afterTaxProceeds(price, saleCostRatio, basis, depreciation, opts) {
    if (!opts.capGainsRate) return price * (1 - saleCostRatio);
    var netPrice = price * (1 - saleCostRatio);
    var gain = Math.max(0, netPrice - basis);
    var recapture = Math.min(Math.max(0, depreciation), gain);
    var capitalGain = Math.max(0, gain - recapture);
    var tax = recapture * (opts.recaptureRate || 0) + capitalGain * opts.capGainsRate;
    return netPrice - tax;
  }

  /* ---------- paths ---------- */

  function calculatePath(key, state) {
    var a = state.assumptions;
    var months = Math.round(state.horizon * 12);
    var scenario = state.scenario;
    var start = 1;
    var basis = 1;
    var rentMonths, held, proceeds, remaining;

    switch (key) {
      case "sellStocks":
        return { nominal: invest(afterTaxProceeds(start, a.saleCostRatio, basis, 0, a), months, scenario, { stageMonths: 0, phaseMonths: 1 }) };

      case "sellStage36":
        return { nominal: invest(afterTaxProceeds(start, a.saleCostRatio, basis, 0, a), months, scenario, { stageMonths: a.stageMonths, phaseMonths: a.phaseMonths }) };

      case "sellDca12":
        return { nominal: invest(afterTaxProceeds(start, a.saleCostRatio, basis, 0, a), months, scenario, { stageMonths: 0, phaseMonths: 12 }) };

      case "rentThenSell": {
        rentMonths = Math.min(months, a.rentBridgeMonths);
        held = holdProperty(start, rentMonths, scenario, a);
        proceeds = afterTaxProceeds(held.value, a.saleCostRatio, basis, held.depreciation, a);
        remaining = months - rentMonths;
        if (remaining <= 0) return { nominal: proceeds + held.cash };
        return { nominal: held.cash + invest(proceeds, remaining, scenario, { stageMonths: a.stageMonths, phaseMonths: a.phaseMonths }) };
      }

      case "liveThenSell": {
        var liveMonths = Math.min(months, a.liveBridgeMonths);
        held = holdProperty(start, liveMonths, scenario, ownerOccupied(a));
        // The §121 exclusion is never added automatically: the caller must switch it on
        // and the facts must satisfy Pub. 523. Basis stays at the inherited amount.
        proceeds = proceedsWith121(held.value, a.saleCostRatio, basis, a);
        remaining = months - liveMonths;
        var liveNet = held.imputed - held.carryOpportunity;
        if (remaining <= 0) return { nominal: proceeds + liveNet, imputed: liveNet };
        return { nominal: liveNet + invest(proceeds, remaining, scenario, { stageMonths: a.stageMonths, phaseMonths: a.phaseMonths }), imputed: liveNet };
      }

      case "partialSell": {
        var sellShare = 0.5;
        var rentShare = 0.5;
        rentMonths = Math.min(months, a.rentBridgeMonths);
        held = holdProperty(start * rentShare, rentMonths, scenario, a);
        var soldNow = afterTaxProceeds(start * sellShare, a.saleCostRatio, basis * sellShare, 0, a);
        var soldLater = afterTaxProceeds(held.value, a.saleCostRatio, basis * rentShare, held.depreciation, a);
        remaining = months - rentMonths;
        var front = invest(soldNow, months, scenario, { stageMonths: a.stageMonths, phaseMonths: a.phaseMonths });
        var back = remaining <= 0 ? soldLater : invest(soldLater, remaining, scenario, { stageMonths: a.stageMonths, phaseMonths: a.phaseMonths });
        return { nominal: front + back + held.cash };
      }

      case "holdRental": {
        held = holdProperty(start, months, scenario, a);
        proceeds = afterTaxProceeds(held.value, a.saleCostRatio, basis, held.depreciation, a);
        return { nominal: proceeds + held.cash };
      }

      case "holdLive": {
        held = holdProperty(start, months, scenario, ownerOccupied(a));
        return { nominal: held.totalWithImputed, imputed: held.imputed - held.carryOpportunity };
      }

      default:
        return { nominal: start };
    }
  }

  function cumulativeInflation(scenario, months) {
    var factor = 1;
    var month, year;
    for (month = 0; month < months; month += 1) {
      year = Math.floor(month / 12);
      factor *= 1 + monthlyRate(annualRateAt(scenario, "inflation", year));
    }
    return factor;
  }

  function resultFor(key, state) {
    var months = Math.round(state.horizon * 12);
    var raw = calculatePath(key, state);
    var deflator = state.assumptions.showReal ? cumulativeInflation(state.scenario, months) : 1;
    return {
      key: key,
      nominal: raw.nominal,
      value: raw.nominal / deflator,
      imputed: raw.imputed || 0
    };
  }

  function evaluate(state) {
    var rows = PATH_META.map(function (meta) {
      var res = resultFor(meta.key, state);
      return {
        key: meta.key,
        name: meta.name,
        kind: meta.kind,
        risk: meta.risk,
        value: res.value,
        nominal: res.nominal,
        imputed: res.imputed
      };
    });
    rows.sort(function (x, y) { return y.value - x.value; });
    rows.forEach(function (row, index) { row.rank = index + 1; });
    return rows;
  }

  /* ---------- distribution across sequence variants (not a probability) ---------- */

  // Rotate the 20-year design sequences so the same scenario can land its shocks at
  // different points in the holding period. This is sequence risk, unweighted.
  function sequenceVariants(scenario, count) {
    var variants = [];
    var i;
    for (i = 0; i < (count || 12); i += 1) variants.push(i);
    return variants;
  }

  function evaluateRange(state, pathKey, variantCount) {
    var offsets = sequenceVariants(state.scenario, variantCount || 12);
    var values = offsets.map(function (offset) {
      var shifted = {
        scenario: state.scenario,
        horizon: state.horizon,
        assumptions: state.assumptions,
        shift: offset
      };
      return shiftedResult(pathKey, shifted, offset);
    });
    values.sort(function (a, b) { return a - b; });
    return {
      min: values[0],
      p25: values[Math.floor(values.length * 0.25)],
      median: values[Math.floor(values.length / 2)],
      p75: values[Math.floor(values.length * 0.75)],
      max: values[values.length - 1],
      count: values.length
    };
  }

  // A shifted evaluation re-indexes every annual series by the offset.
  function shiftedResult(pathKey, state, offset) {
    var months = Math.round(state.horizon * 12);
    var helper = makeShiftedScenario(state.scenario, offset);
    var a = state.assumptions;

    function investShift(start, count, stageMonths, phaseMonths) {
      var gradual = phaseMonths > 1;
      var equity = gradual ? 0 : start;
      var treasury = gradual ? start : 0;
      var month, transfer, yr;
      for (month = 0; month < count; month += 1) {
        if (gradual && month >= stageMonths && month < stageMonths + phaseMonths) {
          transfer = treasury / (stageMonths + phaseMonths - month);
          treasury -= transfer;
          equity += transfer;
        }
        yr = Math.floor(month / 12);
        equity *= 1 + monthlyRate(helper("equity", yr));
        treasury *= 1 + monthlyRate(helper("treasury", yr));
      }
      return equity + treasury;
    }

    function holdShift(share, count, isOwner) {
      var value = share;
      var cash = 0;
      var imputed = 0;
      var dep = 0;
      var carryOpp = 0;
      var month, yr, opening, grossRent, net;
      for (month = 0; month < count; month += 1) {
        yr = Math.floor(month / 12);
        opening = value;
        value *= 1 + monthlyRate(helper("property", yr));
        grossRent = (opening * a.grossRentYield / 12) * Math.pow(1 + helper("rent", yr), yr) * (1 - a.vacancyRate);
        net = grossRent * (1 - a.operatingCostRatio);
        cash += net;
        imputed += opening * (a.imputedRent / 12);
        cash *= 1 + monthlyRate(helper("treasury", yr));
        dep += (opening * 0.75) / (a.depreciationYears * 12);
        if (isOwner) {
          carryOpp += opening * (a.ownerCarryRatio / 12);
          carryOpp *= 1 + monthlyRate(helper("treasury", yr));
        }
      }
      return { value: value, cash: cash, imputed: imputed, depreciation: dep, carryOpportunity: carryOpp };
    }

    var saleTax = function (price, dep, basisShare) {
      return afterTaxProceeds(price, a.saleCostRatio, basisShare === undefined ? 1 : basisShare, dep, a);
    };
    var rentMonths = Math.min(months, a.rentBridgeMonths);
    var liveMonths = Math.min(months, a.liveBridgeMonths);
    var held, proceeds, remaining;

    switch (pathKey) {
      case "sellStocks": return investShift(saleTax(1, 0), months, 0, 1);
      case "sellStage36": return investShift(saleTax(1, 0), months, a.stageMonths, a.phaseMonths);
      case "sellDca12": return investShift(saleTax(1, 0), months, 0, 12);
      case "rentThenSell":
        held = holdShift(1, rentMonths);
        proceeds = saleTax(held.value, held.depreciation);
        remaining = months - rentMonths;
        return held.cash + (remaining <= 0 ? proceeds : investShift(proceeds, remaining, a.stageMonths, a.phaseMonths));
      case "liveThenSell":
        held = holdShift(1, liveMonths, true);
        proceeds = proceedsWith121(held.value, a.saleCostRatio, 1, a);
        remaining = months - liveMonths;
        return (held.imputed - held.carryOpportunity) + (remaining <= 0 ? proceeds : investShift(proceeds, remaining, a.stageMonths, a.phaseMonths));
      case "partialSell":
        held = holdShift(0.5, rentMonths);
        remaining = months - rentMonths;
        return investShift(saleTax(0.5, 0, 0.5), months, a.stageMonths, a.phaseMonths) +
          held.cash + (remaining <= 0 ? saleTax(held.value, held.depreciation, 0.5) : investShift(saleTax(held.value, held.depreciation, 0.5), remaining, a.stageMonths, a.phaseMonths));
      case "holdRental":
        held = holdShift(1, months);
        return held.cash + saleTax(held.value, held.depreciation);
      case "holdLive":
        held = holdShift(1, months, true);
        return held.value + held.cash + held.imputed - held.carryOpportunity;
      default:
        return 1;
    }
  }

  function makeShiftedScenario(scenario, offset) {
    return function (asset, year) {
      return annualRateAt(scenario, asset, year + offset);
    };
  }

  /* ---------- reinvestment risk beside the headline ---------- */

  // The constant Treasury yield that the ladder would have had to earn for the staged
  // path to match immediate equity entry over the same horizon.
  function breakEvenTreasuryRate(state) {
    var months = Math.round(state.horizon * 12);
    var scenario = state.scenario;
    var a = state.assumptions;
    var target = resultFor("sellStocks", { scenario: scenario, horizon: state.horizon, assumptions: withShowReal(a, false) }).nominal;
    var start = afterTaxProceeds(1, a.saleCostRatio, 1, 0, withTaxesOff(a));

    function stagedAt(rate) {
      var equity = 0;
      var treasury = start;
      var month, transfer, yr;
      for (month = 0; month < months; month += 1) {
        if (month >= a.stageMonths && month < a.stageMonths + a.phaseMonths) {
          transfer = treasury / (a.stageMonths + a.phaseMonths - month);
          treasury -= transfer;
          equity += transfer;
        }
        yr = Math.floor(month / 12);
        equity *= 1 + monthlyRate(annualRateAt(scenario, "equity", yr));
        // All ladder cash is assumed to earn the tested constant rate.
        treasury *= 1 + monthlyRate(rate);
      }
      return equity + treasury;
    }

    var low = -0.25;
    var high = 0.60;
    var mid, i;
    for (i = 0; i < 80; i += 1) {
      mid = (low + high) / 2;
      if (stagedAt(mid) < target) low = mid; else high = mid;
    }
    return { rate: (low + high) / 2, unmatched: low <= -0.2499 || high >= 0.5999 };
  }

  function withShowReal(a, flag) {
    var copy = mergeAssumptions(a);
    copy.showReal = flag;
    return copy;
  }
  function withTaxesOff(a) {
    var copy = mergeAssumptions(a);
    copy.capGainsRate = 0;
    copy.recaptureRate = 0;
    return copy;
  }

  /* ---------- "what would change the answer" ---------- */

  function winnerTable(base) {
    var scenarios = Object.keys(SCENARIOS);
    var horizons = [5, 10, 25, 50];
    return scenarios.map(function (scenario) {
      return {
        scenario: scenario,
        label: SCENARIOS[scenario].label,
        winners: horizons.map(function (horizon) {
          var rows = evaluate({ scenario: scenario, horizon: horizon, assumptions: base });
          return { horizon: horizon, key: rows[0].key, name: rows[0].name, value: rows[0].value, second: rows[1].name, gap: rows[0].value - rows[1].value };
        })
      };
    });
  }

  // How often does each path finish in the top two across every designed scenario and
  // every horizon? A robustness count, not a probability and not a recommendation.
  function robustness(base) {
    var scenarios = Object.keys(SCENARIOS);
    var horizons = [5, 10, 25, 50];
    var tally = {};
    PATH_META.forEach(function (meta) { tally[meta.key] = { key: meta.key, name: meta.name, top2: 0, wins: 0, worst: Infinity, best: -Infinity, total: 0 }; });
    var cells = 0;
    scenarios.forEach(function (scenario) {
      horizons.forEach(function (horizon) {
        cells += 1;
        var rows = evaluate({ scenario: scenario, horizon: horizon, assumptions: mergeAssumptions(base) });
        rows.forEach(function (row, index) {
          var t = tally[row.key];
          t.total += 1;
          if (index < 2) t.top2 += 1;
          if (index === 0) t.wins += 1;
          if (row.value < t.worst) t.worst = row.value;
          if (row.value > t.best) t.best = row.value;
        });
      });
    });
    return {
      cells: cells,
      rows: Object.keys(tally).map(function (k) { return tally[k]; }).sort(function (a, b) {
        return b.top2 - a.top2 || b.wins - a.wins || b.best - a.best;
      })
    };
  }

  // Staged-entry comparison: how much does parking in 3M–2Y Treasuries change the
  // result in a crash-entry scenario, and what constant ladder yield would have been
  // needed to match immediate equity entry over the same horizon?
  function stagingComparison(base) {
    var out = [];
    ["crash1929", "crisis2008", "baseline", "stagflation"].forEach(function (scenario) {
      [5, 10, 25].forEach(function (horizon) {
        var a = mergeAssumptions(base);
        var deps = [{ key: "sellStocks", label: "Equities now", stage: 0, phase: 1 },
                    { key: "sellDca12", label: "12-month entry", stage: 0, phase: 12 },
                    { key: "stage24", label: "24-month ladder", stage: 24, phase: 12 },
                    { key: "stage30", label: "30-month ladder", stage: 30, phase: 12 },
                    { key: "stage36", label: "36-month ladder", stage: 36, phase: 12 }];
        var values = deps.map(function (dep) {
          var local = mergeAssumptions(a);
          local.stageMonths = dep.stage;
          local.phaseMonths = dep.phase;
          var start = afterTaxProceeds(1, local.saleCostRatio, 1, 0, local);
          return { key: dep.key, label: dep.label, value: start === 0 ? 0 : invest(start, horizon * 12, scenario, { stageMonths: dep.stage, phaseMonths: dep.phase }) };
        });
        var be = breakEvenTreasuryRate({ scenario: scenario, horizon: horizon, assumptions: mergeAssumptions(base) });
        out.push({ scenario: scenario, label: SCENARIOS[scenario].label, horizon: horizon, values: values, breakEven: be });
      });
    });
    return out;
  }

  // Normalised property-tax projection. Uses only published Prop. 13 mechanics:
  // base-year value reassessed at transfer, then factored annually by the lower of
  // California CPI and 2%. The rate is 1% plus locally voter-approved debt, which is
  // parcel-specific and therefore shown as a range, never as a household figure.
  function propertyTaxProjection() {
    var rows = [];
    var capFactor = 1.02;
    var lowFactor = 1.015;
    [0, 5, 10, 20, 30, 40, 50].forEach(function (years) {
      var capped = Math.pow(capFactor, years);
      var lower = Math.pow(lowFactor, years);
      rows.push({
        years: years,
        assessedAtCap: capped,
        assessedLower: lower,
        taxAt110: capped * 0.0110,
        taxAt125: capped * 0.0125,
        taxLowerAt110: lower * 0.0110,
        taxLowerAt125: lower * 0.0125
      });
    });
    return rows;
  }

  // Does the primary-residence exclusion actually matter? Sweep the owner-occupancy
  // window and compare a taxed sale with the switch on and off. Short windows fail
  // because round-trip selling costs exceed the appreciation.
  function section121Sweep(base) {
    var out = [];
    [1, 2, 3, 5, 8, 10, 15, 20].forEach(function (liveYears) {
      var horizon = Math.max(liveYears + 8, 15);
      var offA = mergeAssumptions(base);
      offA.capGainsRate = 0.33;
      offA.section121 = false;
      offA.liveBridgeMonths = liveYears * 12;
      var onA = mergeAssumptions(offA);
      onA.section121 = true;
      var off = resultFor("liveThenSell", { scenario: "baseline", horizon: horizon, assumptions: offA });
      var on = resultFor("liveThenSell", { scenario: "baseline", horizon: horizon, assumptions: onA });
      out.push({ liveYears: liveYears, horizon: horizon, without: off.nominal, with: on.nominal, delta: on.nominal - off.nominal });
    });
    return out;
  }

  function sensitivity(base) {
    var probes = [
      { label: "Capital-gains rate 0 → 33%", apply: function (s) { s.assumptions.capGainsRate = 0.33; } },
      { label: "Sale costs 5.5% → 9%", apply: function (s) { s.assumptions.saleCostRatio = 0.09; } },
      { label: "Vacancy 5% → 12%", apply: function (s) { s.assumptions.vacancyRate = 0.12; } },
      { label: "Operating costs 28% → 45% of rent", apply: function (s) { s.assumptions.operatingCostRatio = 0.45; } },
      { label: "Gross rent yield 3.0% → 1.8%", apply: function (s) { s.assumptions.grossRentYield = 0.018; } },
      { label: "Imputed rent 0% → 3%", apply: function (s) { s.assumptions.imputedRent = 0.03; } },
      { label: "Treasury parking 30 → 36 months", apply: function (s) { s.assumptions.stageMonths = 36; } }
    ];
    var baseRows = evaluate(base);
    var baseWinner = baseRows[0].key;
    return probes.map(function (probe) {
      var next = { scenario: base.scenario, horizon: base.horizon, assumptions: mergeAssumptions(base.assumptions) };
      probe.apply(next);
      var rows = evaluate(next);
      return {
        label: probe.label,
        winner: rows[0].name,
        winnerKey: rows[0].key,
        flips: rows[0].key !== baseWinner,
        topValue: rows[0].value
      };
    });
  }

  var api = {
    SCENARIOS: SCENARIOS,
    SCENARIO_LENGTH: SCENARIO_LENGTH,
    PATH_META: PATH_META,
    DEFAULT_ASSUMPTIONS: DEFAULT_ASSUMPTIONS,
    mergeAssumptions: mergeAssumptions,
    annualRateAt: annualRateAt,
    evaluate: evaluate,
    resultFor: resultFor,
    evaluateRange: evaluateRange,
    robustness: robustness,
    section121Sweep: section121Sweep,
    stagingComparison: stagingComparison,
    propertyTaxProjection: propertyTaxProjection,
    officialFees: officialFees,
    OFFICIAL_FEES: OFFICIAL_FEES,
    applySection121: applySection121,
    breakEvenTreasuryRate: breakEvenTreasuryRate,
    winnerTable: winnerTable,
    sensitivity: sensitivity,
    cumulativeInflation: cumulativeInflation,
    invest: function (start, months, scenario, stageMonths, phaseMonths) {
      return invest(start, months, scenario, { stageMonths: stageMonths, phaseMonths: phaseMonths });
    },
    afterTaxProceeds: afterTaxProceeds
  };

  root.DDEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
