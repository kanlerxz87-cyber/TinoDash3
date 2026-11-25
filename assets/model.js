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
  const fmtPct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

  /* ---------------- paths page ---------------- */

  const pathsRoot = document.querySelector("[data-engine='paths']");
  if (pathsRoot) {
    const controls = {
      scenario: document.querySelector("#scenarioSelect"),
      horizon: document.querySelector("#horizonSelect"),
      stage: document.querySelector("#stageSelect"),
      taxes: document.querySelector("#taxSelect"),
      imputed: document.querySelector("#imputedRange"),
      vacancy: document.querySelector("#vacancyRange"),
      rent: document.querySelector("#rentRange"),
      sale: document.querySelector("#saleCostRange"),
      primary: document.querySelector("#primaryToggle"),
      real: document.querySelector("#realToggle")
    };

    const readState = () => {
      const assumptions = Engine.mergeAssumptions({
        stageMonths: Number(controls.stage.value),
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

      setText("#horizonLabel", `${state.horizon}-year`);
      setText("#scenarioNote", Engine.SCENARIOS[state.scenario].note);
      setText("#valueMode", a.showReal ? "inflation-adjusted (today's money)" : "nominal");
      setText("#stageLabel", `${a.stageMonths} months`);
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

      // range view for the two liquid entries and one property path
      const rangeBody = document.querySelector("#rangeRows");
      if (rangeBody) {
        ["sellStocks", "sellStage36", "rentThenSell", "holdRental"].forEach(() => {});
        rangeBody.innerHTML = ["sellStocks", "sellStage36", "rentThenSell", "holdRental"].map((key) => {
          const r = Engine.evaluateRange(state, key, 20);
          const name = Engine.PATH_META.find((m) => m.key === key).name;
          return `<tr>
            <td><strong>${name}</strong></td>
            <td class="num">${fmtIndex(r.min)}</td>
            <td class="num">${fmtIndex(r.p25)}</td>
            <td class="num">${fmtIndex(r.median)}</td>
            <td class="num">${fmtIndex(r.p75)}</td>
            <td class="num">${fmtIndex(r.max)}</td>
            <td class="num">${(r.max - r.min).toFixed(3)}</td>
          </tr>`;
        }).join("");
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
      const chart = document.querySelector("#distributionChart");
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
        chart.innerHTML = `<title>Normalised outcome by path</title><desc>Ranked outcomes per 1.00 starting unit for the selected stress scenario and horizon. Not a probability distribution.</desc>` +
          `${grid}<text x="${padding.left}" y="18" fill="#526767" font-size="12" font-weight="700">${Engine.SCENARIOS[state.scenario].label} · ${state.horizon} years · ${fmtMoney(1)} start</text>` +
          `${bars}<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + ch}" stroke="#90a3a2"/>`;
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
