(function () {
  const D = window.DASH_DATA;
  const fmt = (n) => (n == null ? "—" : "$" + Math.round(n / 10) * 10 === 0 && n !== 0 ? "$0" : (Math.round(n / 10) * 10).toLocaleString("en-US"));

  // Navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById("page-" + btn.dataset.page);
      if (target) target.classList.add("active");
    });
  });

  // Render Property History Tables
  function renderHistory(tableId, rows) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    tbody.innerHTML = rows
      .map(
        (r) => `<tr>
          <td>${r.year}</td>
          <td>${r.tax == null ? '<span class="badge warn">Pending</span>' : fmt(r.tax)}</td>
          <td>${fmt(r.assessed)}</td>
          <td>${r.note}</td>
        </tr>`
      )
      .join("");
  }
  renderHistory("table-propA-history", D.propertyA.history);
  renderHistory("table-propB-history", D.propertyB.history);

  // Render Verified Rules
  const rulesBody = document.querySelector("#table-verified-rules tbody");
  if (rulesBody) {
    rulesBody.innerHTML = D.verifiedRules
      .map(
        (r) => `<tr>
          <td><strong>${r.topic}</strong></td>
          <td>${r.value}</td>
          <td>${r.impact}</td>
          <td><span class="badge ok">${r.status}</span></td>
          <td><a href="${r.sourceUrl}" target="_blank" rel="noopener">${r.sourceLabel}</a></td>
        </tr>`
      )
      .join("");
  }

  // Render Flagged Items
  const flaggedBody = document.querySelector("#table-flagged tbody");
  if (flaggedBody) {
    flaggedBody.innerHTML = D.flaggedItems
      .map(
        (f) => `<tr>
          <td><strong>${f.item}</strong></td>
          <td>${f.reason}</td>
          <td>${f.action}</td>
          <td><a href="${f.sourceUrl}" target="_blank" rel="noopener">Official Ref</a></td>
        </tr>`
      )
      .join("");
  }

  // Render Timeline
  const timelineEl = document.getElementById("timeline-list");
  if (timelineEl) {
    timelineEl.innerHTML = D.timeline
      .map(
        (t) => `<div class="card" style="margin-bottom:10px;">
          <div class="kpi-label">${t.when}</div>
          <div style="font-weight:700;margin:2px 0;">${t.title}</div>
          <div style="font-size:0.88rem;color:#374151;">${t.detail}</div>
        </div>`
      )
      .join("");
  }

  // Render Questions
  const qBody = document.querySelector("#table-questions tbody");
  if (qBody) {
    qBody.innerHTML = D.questions
      .map((q) => `<tr><td>${q.q}</td><td>${q.discovery}</td></tr>`)
      .join("");
  }

  // Render Suggestions
  const sBody = document.querySelector("#table-suggestions tbody");
  if (sBody) {
    sBody.innerHTML = D.suggestions
      .map(
        (s) => `<tr>
          <td>${s.id}</td>
          <td><strong>${s.title}</strong></td>
          <td><span class="badge ${s.status === "Implemented" ? "ok" : "warn"}">${s.status}</span></td>
          <td>${s.detail}</td>
        </tr>`
      )
      .join("");
  }

  // Render Glossary
  const gBody = document.querySelector("#table-glossary tbody");
  if (gBody) {
    gBody.innerHTML = D.glossary
      .map((g) => `<tr><td><strong>${g.term}</strong></td><td>${g.def}</td></tr>`)
      .join("");
  }

  // What-If Financial Model (Pure + Mixed Paths)
  const inputs = ["inp-year", "inp-home-growth", "inp-eq-return", "inp-rent-a", "inp-imputed", "inp-sec121", "inp-prop19"];
  function runModel() {
    const transferYear = parseInt(document.getElementById("inp-year").value, 10);
    const homeGrowth = parseFloat(document.getElementById("inp-home-growth").value) / 100;
    const eqReturn = parseFloat(document.getElementById("inp-eq-return").value) / 100;
    const rentA = parseFloat(document.getElementById("inp-rent-a").value);
    const imputedRent = parseFloat(document.getElementById("inp-imputed").value);
    const useSec121 = document.getElementById("inp-sec121").checked;
    const useProp19 = document.getElementById("inp-prop19").checked;

    document.getElementById("val-year").textContent = transferYear;
    document.getElementById("val-home-growth").textContent = (homeGrowth * 100).toFixed(1) + "%";
    document.getElementById("val-eq-return").textContent = (eqReturn * 100).toFixed(1) + "%";
    document.getElementById("val-rent-a").textContent = fmt(rentA) + "/mo";
    document.getElementById("val-imputed").textContent = fmt(imputedRent) + "/mo";

    const yrsToTransfer = transferYear - 2026;
    const valAtTransfer = D.propertyA.estimatedValue2026 * Math.pow(1 + homeGrowth, yrsToTransfer);
    const fbyvAtTransfer = 550540 * Math.pow(1.02, yrsToTransfer);
    const horizon = 20; // 20-year post-inheritance horizon

    // Transfer tax + selling costs (~0.11% SCC transfer tax + ~4.5% closing/agent)
    const sellCostRate = 0.0461;

    // 1. Pure Sell & Invest
    const netProceeds = valAtTransfer * (1 - sellCostRate);
    const sellInvest20 = netProceeds * Math.pow(1 + eqReturn, horizon);

    // 2. Pure Rent Property A (no Prop 19 -> full reassessment at transfer)
    const reassessedTaxRate = 0.01336;
    let rentWealth = valAtTransfer * Math.pow(1 + homeGrowth, horizon);
    let rentCash = 0;
    for (let y = 1; y <= horizon; y++) {
      const grossRent = rentA * 12 * Math.pow(1.03, y);
      const propTax = valAtTransfer * Math.pow(1.02, y) * reassessedTaxRate;
      const opEx = (D.propertyA.insuranceAnnualEstimate + D.propertyA.maintenanceAnnualEstimate + 1500) * Math.pow(1.03, y);
      const netCF = (grossRent - propTax - opEx) * 0.65; // after-tax CF
      rentCash = (rentCash + netCF) * (1 + eqReturn * 0.7);
    }
    const pureRent20 = rentWealth + rentCash;

    // 3. Pure Live in Property A (Prop 19 if enabled)
    const prop19Taxable = useProp19 ? Math.max(fbyvAtTransfer, valAtTransfer - 1000000) : valAtTransfer;
    let liveWealth = valAtTransfer * Math.pow(1 + homeGrowth, horizon);
    let liveSavings = 0;
    for (let y = 1; y <= horizon; y++) {
      const imp = imputedRent * 12 * Math.pow(1.03, y);
      const propTax = prop19Taxable * Math.pow(1.02, y) * reassessedTaxRate;
      const opEx = (D.propertyA.insuranceAnnualEstimate + D.propertyA.maintenanceAnnualEstimate + 1500) * Math.pow(1.03, y);
      liveSavings = (liveSavings + (imp - propTax - opEx)) * (1 + eqReturn * 0.7);
    }
    const pureLive20 = liveWealth + liveSavings;

    // 4. Mixed: Live 2 yrs (Prop 19 + §121), then Sell & Invest
    const valYr2 = valAtTransfer * Math.pow(1 + homeGrowth, 2);
    const gainYr2 = Math.max(0, valYr2 - valAtTransfer);
    const sec121Excl = useSec121 ? 500000 : 0;
    const taxableGain = Math.max(0, gainYr2 - sec121Excl);
    const netProceedsYr2 = valYr2 * (1 - sellCostRate) - taxableGain * 0.33;
    const mixedLiveSell20 = netProceedsYr2 * Math.pow(1 + eqReturn, horizon - 2);

    const paths = [
      { name: "Sell at Inheritance & Invest (Pure)", val: sellInvest20, note: "Step-up in basis eliminates cap gains; 0.11% SCC transfer tax." },
      { name: "Live 2 Yrs (§121 + Prop 19) then Sell (Mixed)", val: mixedLiveSell20, note: useSec121 ? "Uses $500k §121 exclusion on post-death appreciation." : "§121 off: post-death gain taxed." },
      { name: "Rent Property A 20 Yrs (Pure)", val: pureRent20, note: "Full reassessment at transfer; 35% effective tax on net rent." },
      { name: "Live in Property A 20 Yrs (Pure)", val: pureLive20, note: useProp19 ? "Prop 19 FBYV+$1M cap applied." : "No Prop 19: full reassessment." }
    ].sort((a, b) => b.val - a.val);

    const outBody = document.querySelector("#table-model-paths tbody");
    if (outBody) {
      outBody.innerHTML = paths
        .map(
          (p, i) => `<tr>
            <td><strong>${i === 0 ? "★ " : ""}${p.name}</strong></td>
            <td><strong>${fmt(p.val)}</strong></td>
            <td>${p.note}</td>
          </tr>`
        )
        .join("");
    }

    // Simple Distribution Chart (10th / 50th / 90th percentile for top path)
    drawDistChart(paths[0].val, eqReturn);
  }

  function drawDistChart(medianVal, eqReturn) {
    const canvas = document.getElementById("dist-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = canvas.offsetWidth || 600);
    const h = (canvas.height = 220);
    ctx.clearRect(0, 0, w, h);

    const p10 = medianVal * 0.58;
    const p50 = medianVal;
    const p90 = medianVal * 1.65;
    const maxV = p90 * 1.1;

    const bars = [
      { label: "10th Percentile (Bear)", val: p10, color: "#b91c1c" },
      { label: "50th Percentile (Base)", val: p50, color: "#1d4ed8" },
      { label: "90th Percentile (Bull)", val: p90, color: "#047857" }
    ];

    const barW = 90;
    const gap = (w - bars.length * barW) / (bars.length + 1);
    bars.forEach((b, idx) => {
      const x = gap + idx * (barW + gap);
      const bh = (b.val / maxV) * (h - 60);
      const y = h - 30 - bh;
      ctx.fillStyle = b.color;
      ctx.fillRect(x, y, barW, bh);
      ctx.fillStyle = "#111827";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(fmt(b.val), x + barW / 2, y - 6);
      ctx.font = "11px sans-serif";
      ctx.fillText(b.label, x + barW / 2, h - 10);
    });
  }

  inputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", runModel);
  });
  runModel();

  // Black Swan + Phased Investing
  function runBlackSwan() {
    const scenario = document.getElementById("bs-scenario").value;
    const stagingMonths = parseInt(document.getElementById("bs-staging").value, 10);
    const tbYield = parseFloat(document.getElementById("bs-tbyield").value) / 100;
    document.getElementById("val-bs-staging").textContent = stagingMonths + " months";
    document.getElementById("val-bs-tbyield").textContent = (tbYield * 100).toFixed(1) + "%";

    const startCapital = 3000000;
    const shocks = {
      "1929": { name: "1929 Great Depression (-80% over 3 yrs, slow recovery)", lumpSum5Yr: 0.35, phased5Yr: 0.78 },
      "2008": { name: "2008 Global Financial Crisis (-50% in 18 mos, V-recovery)", lumpSum5Yr: 1.05, phased5Yr: 1.24 },
      "1970s": { name: "1970s Stagflation (High inflation, flat real equities)", lumpSum5Yr: 0.92, phased5Yr: 1.04 },
      "ca_ins": { name: "CA Insurance / Earthquake Shock (-25% home value)", lumpSum5Yr: 1.28, phased5Yr: 1.22 }
    };
    const s = shocks[scenario];
    const lumpEnd = startCapital * s.lumpSum5Yr;
    const phasedEnd = startCapital * (s.phased5Yr + (tbYield - 0.04) * (stagingMonths / 12) * 0.5);

    const bsOut = document.getElementById("bs-results");
    if (bsOut) {
      bsOut.innerHTML = `
        <div class="grid">
          <div class="card">
            <div class="kpi-label">Lump-Sum Equity Entry (Year 5)</div>
            <div class="kpi-val">${fmt(lumpEnd)}</div>
            <div class="kpi-note">${s.name}</div>
          </div>
          <div class="card">
            <div class="kpi-label">Phased-Investing (3M–2Y Treasuries → Stocks)</div>
            <div class="kpi-val" style="color:var(--success);">${fmt(phasedEnd)}</div>
            <div class="kpi-note">${stagingMonths}-month Treasury staging @ ${(tbYield * 100).toFixed(1)}%</div>
          </div>
          <div class="card" style="border-left:4px solid var(--warn);">
            <div class="kpi-label">Reinvestment Risk</div>
            <div class="kpi-val" style="font-size:1.1rem;color:var(--warn);">Moderate–High</div>
            <div class="kpi-note">If 3M–2Y Treasury yields fall during ${stagingMonths}m or equities rally immediately, cash drag reduces upside.</div>
          </div>
        </div>`;
    }
  }
  ["bs-scenario", "bs-staging", "bs-tbyield"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", runBlackSwan);
  });
  runBlackSwan();
})();
