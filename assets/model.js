/*
  Inheritance Decision Desk — page wiring for the normalised engine.
  No household data is read, stored or transmitted. Every input is a modelling
  convention. Money is shown per 1.00 starting unit and rounded to the nearest $10
  of a chosen illustrative unit, never to a household value.
*/
(() => {
  const Engine = window.DDEngine;
  if (!Engine) return;

  const UNIT = 1000000; // illustrative normalisation unit, not a household value

  const fmtMoney = (units) => {
    const dollars = units * UNIT;
    const rounded = Math.round(dollars / 10) * 10;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(rounded);
  };
  const fmtIndex = (units) => units.toFixed(3);
  const fmtSignedIndex = (units) => `${units > 0 ? "+" : ""}${fmtIndex(units)}`;
  const fmtPct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

  /* ---------------- paths page ---------------- */

  const pathsRoot = document.querySelector("[data-engine='paths']");
  if (pathsRoot) {
    const controls = {
      scenario: document.querySelector("#scenarioSelect"),
      horizon: document.querySelector("#horizonSelect"),
      stage: document.querySelector("#stageSelect"),
      cashYield: document.querySelector("#stagingYieldSelect"),
      taxes: document.querySelector("#taxSelect"),
      imputed: document.querySelector("#imputedRange"),
      vacancy: document.querySelector("#vacancyRange"),
      rent: document.querySelector("#rentRange"),
      sale: document.querySelector("#saleCostRange"),
      primary: document.querySelector("#primaryToggle"),
      real: document.querySelector("#realToggle")
    };

    const readState = () => {
      const yieldMode = controls.cashYield.value;
      const stagingCashYield = yieldMode === "snapshot"
        ? Engine.CASH_YIELD_REFERENCE.treasury3M
        : yieldMode === "stress"
          ? Engine.CASH_YIELD_REFERENCE.stress
          : null;
      const assumptions = Engine.mergeAssumptions({
        stageMonths: Number(controls.stage.value),
        stagingCashYield,
        capGainsRate: Number(controls.taxes.value),
        recaptureRate: Number(controls.taxes.value) ? 0.25 : 0,
        imputedRent: Number(controls.imputed.value) / 100,
        vacancyRate: Number(controls.vacancy.value) / 100,
        grossRentYield: Number(controls.rent.value) / 100,
        saleCostRatio: Number(controls.sale.value) / 100,
        section121: controls.primary.checked,
        showReal: controls.real.checked
      });
      return {
        scenario: controls.scenario.value,
        horizon: Number(controls.horizon.value),
        assumptions
      };
    };

    const setText = (selector, text) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = text;
    };

    const render = () => {
      const state = readState();
      const a = state.assumptions;
      const rows = Engine.evaluate(state);
      const yieldMode = controls.cashYield.value;
      const yieldLabel = yieldMode === "snapshot"
        ? `Fixed 3M ${fmtPct(Engine.CASH_YIELD_REFERENCE.treasury3M, 2)} proxy · ${Engine.CASH_YIELD_REFERENCE.date}`
        : yieldMode === "stress"
          ? `Fixed ${fmtPct(Engine.CASH_YIELD_REFERENCE.stress, 2)} stress on staged sale proceeds`
          : "Designed scenario Treasury series (not a forecast)";

      setText("#horizonLabel", `${state.horizon}-year`);
      setText("#scenarioNote", Engine.SCENARIOS[state.scenario].note);
      setText("#valueMode", a.showReal ? "inflation-adjusted (today's money)" : "nominal");
      setText("#stageLabel", `${a.stageMonths} months`);
      setText("#stagingYieldLabel", yieldLabel);
      setText("#imputedValue", `${Number(controls.imputed.value).toFixed(1)}%`);
      setText("#vacancyValue", `${Number(controls.vacancy.value).toFixed(0)}%`);
      setText("#rentValue", `${Number(controls.rent.value).toFixed(1)}%`);
      setText("#saleValue", `${Number(controls.sale.value).toFixed(1)}%`);
      setText("#primaryStatus", a.section121
        ? "Primary-residence exclusion screened ON: a fixed exclusion is subtracted from gain before tax. It has no effect unless the ownership, use, look-back and depreciation tests are actually met."
        : "Primary-residence exclusion OFF: no home-sale exclusion is assumed. Intention alone does not create the benefit.");

      // headline table
      const body = document.querySelector("#pathRows");
      if (body) {
        body.innerHTML = rows.map((row) => {
          const lead = row.rank === 1;
          return `<tr${lead ? ' class="lead-row"' : ""}>
            <td><span class="rank">${row.rank}</span></td>
            <td><strong>${row.name}</strong><small>${row.kind}</small></td>
            <td class="num">${fmtIndex(row.value)}</td>
            <td class="num">${fmtMoney(row.value)}</td>
            <td>${row.rank === 1 ? '<span class="status ready">Leads this cell</span>' : "—"}</td>
            <td class="risk-cell">${row.risk}</td>
          </tr>`;
        }).join("");
      }

      // Five-number range summary across all 20 unweighted sequence rotations.
      const rangeData = Engine.PATH_META.map((meta) => ({
        ...meta,
        ...Engine.evaluateRange(state, meta.key, 20)
      })).sort((left, right) => right.median - left.median);
      const rangeBody = document.querySelector("#rangeRows");
      if (rangeBody) {
        rangeBody.innerHTML = rangeData.map((row) => `<tr>
          <td><strong>${row.name}</strong><small>${row.kind}</small></td>
          <td class="num">${fmtIndex(row.min)}</td>
          <td class="num">${fmtIndex(row.p25)}</td>
          <td class="num">${fmtIndex(row.median)}</td>
          <td class="num">${fmtIndex(row.p75)}</td>
          <td class="num">${fmtIndex(row.max)}</td>
          <td class="num">${(row.max - row.min).toFixed(3)}</td>
        </tr>`).join("");
      }

      // sensitivity / flip table
      const flipBody = document.querySelector("#flipRows");
      if (flipBody) {
        const baseWinner = rows[0];
        flipBody.innerHTML = Engine.sensitivity(state).map((probe) => `<tr>
          <td>${probe.label}</td>
          <td>${probe.winner}</td>
          <td>${probe.flips ? '<span class="status blocked">Changes the leader</span>' : '<span class="status ready">Leader holds</span>'}</td>
          <td class="num">${fmtIndex(probe.topValue)}</td>
        </tr>`).join("") + `<tr class="base-row"><td colspan="2"><strong>Base case leader</strong></td><td colspan="2"><strong>${baseWinner.name} at ${fmtIndex(baseWinner.value)}</strong></td></tr>`;
      }

      // crash-entry staging comparison
      const stageBody = document.querySelector("#stageRows");
      if (stageBody) {
        stageBody.innerHTML = Engine.stagingComparison(a).map((cell) => `<tr>
          <td>${cell.label}</td>
          <td class="num">${cell.horizon}y</td>
          ${cell.values.map((v) => `<td class="num">${fmtIndex(v.value)}</td>`).join("")}
          <td class="num">${cell.breakEven.unmatched ? "n/a" : fmtPct(cell.breakEven.rate, 2)}</td>
        </tr>`).join("");
      }
      setText("#stageCaption", `Designed entry sequences under ${yieldLabel}; normalized multiples, not a forecast.`);

      // Fixed-yield sensitivity: same selected scenario and horizon, two cash cases.
      const yieldResult = Engine.cashYieldSensitivity(state);
      const yieldBody = document.querySelector("#yieldRows");
      if (yieldBody) {
        const yieldCases = [
          { key: "snapshot", result: yieldResult.snapshot, movement: "Reference" },
          { key: "stress", result: yieldResult.stress, movement: yieldResult.leaderMoved ? "Leader changes" : "Leader holds" }
        ];
        yieldBody.innerHTML = yieldCases.map((item) => `<tr>
          <td>${item.key === "snapshot"
            ? `<a class="source-link" href="${Engine.CASH_YIELD_REFERENCE.sourceUrl}">Treasury 3-month par-yield snapshot · ${Engine.CASH_YIELD_REFERENCE.date} (${fmtPct(item.result.rate, 2)})</a>`
            : `${fmtPct(item.result.rate, 2)} fixed stress assumption (not an official rate)`}</td>
          <td><strong>${item.result.winner}</strong></td>
          <td class="num">${fmtIndex(item.result.winnerValue)}</td>
          <td class="num">${item.result.stagedRank} / 8</td>
          <td class="num">${fmtIndex(item.result.stagedValue)}</td>
          <td class="num">${fmtSignedIndex(item.result.stagedMinusImmediate)}</td>
          <td>${item.movement}</td>
        </tr>`).join("");
      }
      setText("#yieldContext", `${Engine.SCENARIOS[state.scenario].label} · ${state.horizon} years · ${a.stageMonths}-month selected ladder`);
      const yieldLeaderMovement = document.querySelector("#yieldLeaderMovement");
      if (yieldLeaderMovement) {
        yieldLeaderMovement.className = `status ${yieldResult.leaderMoved ? "review" : "ready"}`;
        yieldLeaderMovement.textContent = yieldResult.leaderMoved
          ? `Leader moves from ${yieldResult.snapshot.winner} at 4.34% to ${yieldResult.stress.winner} at 2.00%.`
          : `Leader holds as ${yieldResult.snapshot.winner} at both 4.34% and 2.00%.`;
      }
      setText("#yieldStagedMovement", `The selected ladder's rank is ${yieldResult.snapshot.stagedRank} / 8 at 4.34% and ${yieldResult.stress.stagedRank} / 8 at 2.00%; its normalized ending value changes by ${fmtSignedIndex(yieldResult.stagedValueDelta)} units per 1.00 starting unit.`);

      // robustness
      const robustBody = document.querySelector("#robustRows");
      if (robustBody) {
        const rb = Engine.robustness(a);
        robustBody.innerHTML = rb.rows.map((row) => `<tr>
          <td><strong>${row.name}</strong></td>
          <td class="num">${row.top2} / ${rb.cells}</td>
          <td class="num">${row.wins}</td>
          <td class="num">${fmtIndex(row.best)}</td>
          <td class="num">${fmtIndex(row.worst)}</td>
        </tr>`).join("");
      }

      // §121 sweep
      const s121Body = document.querySelector("#s121Rows");
      if (s121Body) {
        s121Body.innerHTML = Engine.section121Sweep(a).map((row) => `<tr>
          <td class="num">${row.liveYears}y</td>
          <td class="num">${fmtIndex(row.without)}</td>
          <td class="num">${fmtIndex(row.with)}</td>
          <td class="num">${row.delta > 0.0005 ? "+" : ""}${fmtIndex(row.delta)}</td>
          <td>${row.delta > 0.0005 ? "Exclusion changes the result" : "No effect in this cell"}</td>
        </tr>`).join("");
      }

      // chart
      const chart = document.querySelector("#outcomeChart");
      if (chart) {
        const width = 940;
        const height = 330;
        const padding = { top: 34, right: 16, bottom: 86, left: 62 };
        const cw = width - padding.left - padding.right;
        const ch = height - padding.top - padding.bottom;
        const max = Math.max(...rows.map((r) => r.value), 1) * 1.14;
        const grid = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + ch - ch * pct;
          return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#dce4e2"/>` +
            `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" fill="#667a7b" font-size="11">${(max * pct).toFixed(2)}</text>`;
        }).join("");
        const step = cw / rows.length;
        const fills = ["#0e766e", "#4f9f91", "#83c3b7", "#2d5f9e", "#976d3d", "#697d7d", "#a93742", "#b85f08"];
        const bars = rows.map((row, index) => {
          const barWidth = Math.min(78, step * 0.6);
          const x = padding.left + step * index + (step - barWidth) / 2;
          const barHeight = Math.max(2, (row.value / max) * ch);
          const y = padding.top + ch - barHeight;
          const words = row.name.split(" ");
          const lines = [];
          let line = "";
          words.forEach((w) => {
            if ((line + " " + w).trim().length > 16) { lines.push(line.trim()); line = w; } else { line = `${line} ${w}`; }
          });
          if (line.trim()) lines.push(line.trim());
          const label = lines.slice(0, 3).map((l, i) => `<tspan x="${x + barWidth / 2}" dy="${i === 0 ? 0 : 11}">${l}</tspan>`).join("");
          return `<g><rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${fills[index % fills.length]}"/>` +
            `<text x="${x + barWidth / 2}" y="${y - 7}" text-anchor="middle" fill="#214846" font-size="11" font-weight="700">${row.value.toFixed(3)}</text>` +
            `<text x="${x + barWidth / 2}" y="${height - 58}" text-anchor="middle" fill="#526767" font-size="10">${label}</text></g>`;
        }).join("");
        chart.setAttribute("viewBox", `0 0 ${width} ${height}`);
        chart.innerHTML = `<title>Point outcome by path</title><desc>Ranked outcomes per 1.00 starting unit for the selected stress scenario and horizon. This single-sequence bar chart is not a probability distribution.</desc>` +
          `${grid}<text x="${padding.left}" y="18" fill="#526767" font-size="12" font-weight="700">${Engine.SCENARIOS[state.scenario].label} · ${state.horizon} years · ${fmtMoney(1)} start</text>` +
          `${bars}<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + ch}" stroke="#90a3a2"/>`;
      }

      // Range plot across all 20 unweighted sequence rotations: whisker = min/max,
      // box = P25/P75, centre line = median. No probability is assigned.
      const rangeChart = document.querySelector("#rangeDistributionChart");
      if (rangeChart) {
        const width = 1060;
        const rowHeight = 38;
        const padding = { top: 58, right: 30, bottom: 48, left: 260 };
        const height = padding.top + rangeData.length * rowHeight + padding.bottom;
        const plotRight = width - padding.right;
        const plotWidth = plotRight - padding.left;
        const plotBottom = padding.top + rangeData.length * rowHeight;
        const observedMax = Math.max(...rangeData.map((row) => row.max), 1);
        const axisMax = observedMax * 1.08;
        const x = (value) => padding.left + (Math.max(0, Math.min(axisMax, value)) / axisMax) * plotWidth;
        const ticks = [0, 0.25, 0.5, 0.75, 1];
        const grid = ticks.map((fraction) => {
          const tickX = padding.left + plotWidth * fraction;
          const tickValue = axisMax * fraction;
          return `<line x1="${tickX}" y1="${padding.top}" x2="${tickX}" y2="${plotBottom}" stroke="#dce4e2"/>` +
            `<text x="${tickX}" y="${plotBottom + 22}" text-anchor="middle" fill="#667a7b" font-size="11">${tickValue.toFixed(2)}</text>`;
        }).join("");
        const marks = rangeData.map((row, index) => {
          const y = padding.top + index * rowHeight + rowHeight / 2;
          const minX = x(row.min);
          const p25X = x(row.p25);
          const medianX = x(row.median);
          const p75X = x(row.p75);
          const maxX = x(row.max);
          const boxWidth = Math.max(2, p75X - p25X);
          const summary = `${row.name}: minimum ${fmtIndex(row.min)}, 25th percentile ${fmtIndex(row.p25)}, median ${fmtIndex(row.median)}, 75th percentile ${fmtIndex(row.p75)}, maximum ${fmtIndex(row.max)}; 20 unweighted rotations.`;
          return `<g role="listitem" tabindex="0"><title>${summary}</title>` +
            `<text x="12" y="${y + 4}" fill="#334b4b" font-size="12">${row.name}</text>` +
            `<line x1="${minX}" y1="${y}" x2="${maxX}" y2="${y}" stroke="#526767" stroke-width="2"/>` +
            `<line x1="${minX}" y1="${y - 7}" x2="${minX}" y2="${y + 7}" stroke="#526767" stroke-width="2"/>` +
            `<rect x="${p25X}" y="${y - 9}" width="${boxWidth}" height="18" rx="4" fill="#89c5b8" stroke="#2d7770"/>` +
            `<line x1="${medianX}" y1="${y - 12}" x2="${medianX}" y2="${y + 12}" stroke="#153f3b" stroke-width="3"/>` +
            `<line x1="${maxX}" y1="${y - 7}" x2="${maxX}" y2="${y + 7}" stroke="#526767" stroke-width="2"/>` +
            `</g>`;
        }).join("");
        const mode = a.showReal ? "real, inflation-adjusted terms" : "nominal terms";
        rangeChart.setAttribute("viewBox", `0 0 ${width} ${height}`);
        rangeChart.setAttribute("aria-label", `Five-number range plot for ${Engine.SCENARIOS[state.scenario].label}, ${state.horizon} years, ${mode}; 20 unweighted sequence rotations.`);
        rangeChart.innerHTML = `<title>Outcome ranges across sequence rotations</title>` +
          `<desc>For each of eight paths, whiskers show the minimum and maximum, the box shows the 25th to 75th percentile, and a vertical line marks the median. Rotations are unweighted designed sequences, not empirical probabilities.</desc>` +
          `<text x="${padding.left}" y="22" fill="#526767" font-size="13" font-weight="700">${Engine.SCENARIOS[state.scenario].label} · ${state.horizon} years · ${mode}</text>` +
          `${grid}${marks}` +
          `<line x1="${padding.left}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="#90a3a2"/>` +
          `<text x="${padding.left + plotWidth / 2}" y="${height - 4}" text-anchor="middle" fill="#526767" font-size="11">${a.showReal ? "Inflation-adjusted outcome multiple" : "Nominal outcome multiple"} (1.00 starting unit)</text>`;
      }
    };

    Object.values(controls).forEach((control) => {
      control?.addEventListener("input", render);
      control?.addEventListener("change", render);
    });
    render();
  }

  /* ---------------- process page: fee and property-tax calculators ---------------- */

  const feeRoot = document.querySelector("[data-engine='fees']");
  if (feeRoot) {
    const price = document.querySelector("#feePrice");
    const city = document.querySelector("#feeCity");
    const output = document.querySelector("#feeOutput");
    const renderFees = () => {
      const value = Number(price.value);
      const fees = Engine.officialFees(value, { citySurcharge: city.checked, pages: 2 });
      document.querySelector("#feePriceValue").textContent = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
      output.innerHTML = `
        <tr><td>County documentary transfer tax ($0.55 per $500 or fraction)</td><td class="num">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(fees.countyTransferTax)}</td></tr>
        <tr><td>City conveyance tax where the county page lists it (San Jose, Palo Alto, Mountain View at $1.65 per $500)</td><td class="num">${city.checked ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(fees.cityConveyance) : "not applied"}</td></tr>
        <tr><td>Recording fee, $92 first page for a deed paying documentary transfer tax ($3 per extra page, 2 pages)</td><td class="num">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(fees.recording)}</td></tr>
        <tr class="lead-row"><td><strong>Sum of published statutory items</strong></td><td class="num"><strong>${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(fees.total)}</strong></td></tr>`;
    };
    price?.addEventListener("input", renderFees);
    city?.addEventListener("change", renderFees);
    if (price) renderFees();
  }

  const taxRoot = document.querySelector("[data-engine='proptax']");
  if (taxRoot) {
    const body = document.querySelector("#propTaxRows");
    if (body) {
      body.innerHTML = Engine.propertyTaxProjection().map((row) => `<tr>
        <td class="num">${row.years}</td>
        <td class="num">${row.assessedAtCap.toFixed(2)}</td>
        <td class="num">${row.assessedLower.toFixed(2)}</td>
        <td class="num">${fmtMoney(row.taxAt110)}</td>
        <td class="num">${fmtMoney(row.taxAt125)}</td>
      </tr>`).join("");
    }
  }
})();
