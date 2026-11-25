(() => {
  const normalizedStart = 1_000_000;
  const paths = [
    { key: "sellStocks", name: "Sell Year 0 → stocks", kind: "Pure liquid", risk: "Immediate sequence-of-returns exposure." },
    { key: "sellStaged", name: "Sell Year 0 → Treasury ladder → stocks", kind: "Mixed liquid", risk: "Reinvestment risk: future ladder maturities may reset at lower or higher yields." },
    { key: "rentThenSell", name: "Rent 5y → sell → staged investing", kind: "Mixed property", risk: "Rent, vacancy, capex, compliance, and depreciation are not verified." },
    { key: "liveThenSell", name: "Live 2y → sell → staged investing", kind: "Mixed occupancy", risk: "A primary-residence exclusion is not assumed; facts must satisfy the actual test." },
    { key: "holdRental", name: "Hold as rental", kind: "Pure property", risk: "Lowest liquidity; operating, capital, and tenant-law exposure continue." },
    { key: "holdLive", name: "Live long term", kind: "Pure occupancy", risk: "Wealth comparison is incomplete without a verified imputed-rent estimate." }
  ];

  // Deliberately irregular stress paths. These are user-interface test assumptions, not forecasts,
  // historic reconstructions, market data, tax estimates, or recommendations.
  const scenarios = {
    baseline: {
      label: "Irregular baseline",
      note: "Variable but moderate cycles; a stress-test convention, not a forecast.",
      equity: [0.085, -0.04, 0.12, 0.055, 0.02, 0.10, -0.08, 0.15],
      treasury: [0.042, 0.038, 0.034, 0.041, 0.032, 0.036, 0.039, 0.035],
      property: [0.028, -0.02, 0.045, 0.022, 0.01, 0.036, -0.025, 0.04],
      rent: [0.015, 0.013, 0.016, 0.014, 0.012, 0.015, 0.011, 0.015],
      inflation: [0.027, 0.021, 0.029, 0.024, 0.022, 0.026, 0.02, 0.025]
    },
    crash1929: {
      label: "Early deep equity shock",
      note: "A deliberately severe early sequence test; not a reconstruction of any historical episode.",
      equity: [-0.35, -0.22, -0.08, 0.18, 0.13, 0.09, 0.07, 0.11],
      treasury: [0.041, 0.036, 0.031, 0.029, 0.032, 0.035, 0.037, 0.036],
      property: [-0.13, -0.09, -0.02, 0.02, 0.03, 0.028, 0.024, 0.03],
      rent: [0.01, 0.008, 0.009, 0.012, 0.013, 0.014, 0.014, 0.015],
      inflation: [-0.01, -0.02, 0, 0.012, 0.02, 0.024, 0.023, 0.024]
    },
    crisis2008: {
      label: "Liquidity / housing shock",
      note: "A severe financial-system-style stress sequence; not a reconstruction or prediction.",
      equity: [-0.37, 0.22, 0.11, 0.08, -0.07, 0.16, 0.06, 0.09],
      treasury: [0.035, 0.029, 0.026, 0.03, 0.034, 0.038, 0.036, 0.039],
      property: [-0.16, -0.08, 0.01, 0.035, 0.026, 0.02, 0.03, 0.028],
      rent: [0.009, 0.01, 0.012, 0.013, 0.012, 0.014, 0.014, 0.015],
      inflation: [0.015, 0.008, 0.018, 0.024, 0.021, 0.023, 0.025, 0.024]
    },
    stagflation: {
      label: "Stagflation / rate reset",
      note: "High and uneven inflation with modest nominal asset results; a stress-test convention, not a forecast.",
      equity: [-0.12, 0.01, 0.06, -0.03, 0.09, 0.04, 0.07, 0.05],
      treasury: [0.047, 0.052, 0.048, 0.045, 0.041, 0.039, 0.042, 0.04],
      property: [0.005, -0.04, 0.015, 0.008, 0.022, 0.018, 0.02, 0.021],
      rent: [0.014, 0.013, 0.016, 0.015, 0.016, 0.015, 0.015, 0.015],
      inflation: [0.065, 0.072, 0.06, 0.052, 0.044, 0.038, 0.034, 0.031]
    }
  };

  const controls = {
    scenario: document.querySelector("#scenarioSelect"),
    horizon: document.querySelector("#horizonSelect"),
    stage: document.querySelector("#stageSelect"),
    imputed: document.querySelector("#imputedRange"),
    primary: document.querySelector("#primaryToggle"),
    saleTiming: document.querySelector("#saleTiming")
  };
  if (!controls.scenario) return;

  const getRate = (scenario, asset, period) => scenarios[scenario][asset][period % scenarios[scenario][asset].length];
  const monthlyRate = (annual) => Math.pow(1 + annual, 1 / 12) - 1;
  const formatMoney = (number) => {
    const rounded = Math.round(number / 10) * 10;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(rounded);
  };
  const formatPct = (number) => `${(number * 100).toFixed(1)}%`;

  function invest(start, months, scenarioKey, stageMonths, stageStrategy) {
    let equity = stageStrategy ? 0 : start;
    let treasury = stageStrategy ? start : 0;
    for (let month = 0; month < months; month += 1) {
      if (stageStrategy && month >= stageMonths && month < stageMonths + 12) {
        const transfer = treasury / (stageMonths + 12 - month);
        treasury -= transfer;
        equity += transfer;
      }
      const year = Math.floor(month / 12);
      equity *= 1 + monthlyRate(getRate(scenarioKey, "equity", year));
      treasury *= 1 + monthlyRate(getRate(scenarioKey, "treasury", year));
    }
    return equity + treasury;
  }

  function holdProperty(start, months, scenarioKey, isRental, imputedRate) {
    let value = start;
    let benefit = 0;
    for (let month = 0; month < months; month += 1) {
      const year = Math.floor(month / 12);
      const current = value;
      value *= 1 + monthlyRate(getRate(scenarioKey, "property", year));
      if (isRental) benefit += current * (getRate(scenarioKey, "rent", year) / 12);
      if (!isRental && imputedRate > 0) benefit += current * (imputedRate / 12);
    }
    return { value, benefit, total: value + benefit };
  }

  function calculatePath(key, state) {
    const months = state.horizon * 12;
    const holdRentMonths = Math.min(months, 60);
    const holdLiveMonths = Math.min(months, 24);
    const stageMonths = state.stage;
    switch (key) {
      case "sellStocks":
        return invest(normalizedStart, months, state.scenario, stageMonths, false);
      case "sellStaged":
        return invest(normalizedStart, months, state.scenario, stageMonths, true);
      case "rentThenSell": {
        const held = holdProperty(normalizedStart, holdRentMonths, state.scenario, true, 0);
        if (months <= 60) return held.total;
        return invest(held.total, months - 60, state.scenario, stageMonths, true);
      }
      case "liveThenSell": {
        const held = holdProperty(normalizedStart, holdLiveMonths, state.scenario, false, state.imputed);
        if (months <= 24) return held.total;
        return invest(held.total, months - 24, state.scenario, stageMonths, true);
      }
      case "holdRental":
        return holdProperty(normalizedStart, months, state.scenario, true, 0).total;
      case "holdLive":
        return holdProperty(normalizedStart, months, state.scenario, false, state.imputed).total;
      default:
        return normalizedStart;
    }
  }

  function buildChart(state, values) {
    const chart = document.querySelector("#distributionChart");
    if (!chart) return;
    const width = 900;
    const height = 310;
    const padding = { top: 38, right: 18, bottom: 72, left: 68 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const max = Math.max(...values.map((entry) => entry.value), normalizedStart) * 1.12;
    const grid = [0, .25, .5, .75, 1].map((pct) => {
      const y = padding.top + chartHeight - chartHeight * pct;
      const label = formatMoney(max * pct);
      return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#dce4e2" stroke-width="1"/><text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" fill="#667a7b" font-size="11">${label}</text>`;
    }).join("");
    const step = chartWidth / values.length;
    const bars = values.map((entry, index) => {
      const barWidth = Math.min(76, step * .62);
      const x = padding.left + step * index + (step - barWidth) / 2;
      const barHeight = Math.max(2, (entry.value / max) * chartHeight);
      const y = padding.top + chartHeight - barHeight;
      const fills = ["#2c7a72", "#4f9f91", "#83c3b7", "#3d6fa5", "#976d3d", "#697d7d"];
      const label = entry.name.replace(" → ", "→").replace("Treasury ladder", "T-ladder");
      return `<g><rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${fills[index]}"/><text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" fill="#214846" font-size="11" font-weight="700">${formatMoney(entry.value)}</text><text x="${x + barWidth / 2}" y="${height - 41}" text-anchor="middle" fill="#526767" font-size="10"><tspan x="${x + barWidth / 2}" dy="0">${label.slice(0, 18)}</tspan><tspan x="${x + barWidth / 2}" dy="12">${label.slice(18, 36)}</tspan></text></g>`;
    }).join("");
    chart.setAttribute("viewBox", `0 0 ${width} ${height}`);
    chart.innerHTML = `<title>Scenario outcome distribution view</title><desc>Normalized outcomes by path. This is a stress-test scenario envelope, not a probability distribution.</desc>${grid}<text x="${padding.left}" y="19" fill="#526767" font-size="12" font-weight="700">${scenarios[state.scenario].label} · ${state.horizon}-year normalized result</text>${bars}<line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#90a3a2" stroke-width="1.2"/>`;
  }

  function update() {
    const state = {
      scenario: controls.scenario.value,
      horizon: Number(controls.horizon.value),
      stage: Number(controls.stage.value),
      imputed: Number(controls.imputed.value) / 100,
      primary: controls.primary.checked,
      saleTiming: controls.saleTiming.value
    };
    document.querySelector("#imputedValue").textContent = formatPct(state.imputed);
    document.querySelector("#scenarioDescription").textContent = scenarios[state.scenario].note;
    document.querySelector("#horizonLabel").textContent = `${state.horizon}-year`;
    document.querySelector("#stageLabel").textContent = `${state.stage} months`;
    document.querySelector("#primaryStatus").textContent = state.primary
      ? "Screening toggle on: this only highlights §121 review; no tax benefit is added."
      : "Screening toggle off: no primary-residence tax benefit is assumed.";
    document.querySelector("#saleTimingStatus").textContent = state.saleTiming === "same-year"
      ? "Same-tax-year sale selected: compare sale price to independently supported date-of-death basis; do not assume gain is zero."
      : "Later sale selected: post-inheritance appreciation, use, depreciation, and eligibility records must be modeled.";

    const values = paths.map((path) => ({ ...path, value: calculatePath(path.key, state) }));
    values.forEach((entry) => {
      document.querySelector(`[data-result="${entry.key}"]`).textContent = formatMoney(entry.value);
      document.querySelector(`[data-kind="${entry.key}"]`).textContent = entry.kind;
    });
    buildChart(state, values);

    const staged = values.find((entry) => entry.key === "sellStaged");
    const stocks = values.find((entry) => entry.key === "sellStocks");
    const difference = staged.value - stocks.value;
    const delta = document.querySelector("#stagingDelta");
    delta.textContent = `${difference >= 0 ? "+" : "−"}${formatMoney(Math.abs(difference))}`;
    document.querySelector("#stagingDeltaNote").textContent = `Staged minus immediate-stock outcome in this ${scenarios[state.scenario].label.toLowerCase()} stress test. This is not a forecast.`;
  }

  Object.values(controls).forEach((control) => control?.addEventListener("input", update));
  update();
})();
