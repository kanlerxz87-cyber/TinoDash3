/*
 * Inheritance Decision Lab
 * Static, privacy-first dashboard. No household record is embedded here.
 * All values marked as model assumptions are scenario controls, not forecasts.
 */

const sources = {
  irsEstate: {
    title: "IRS — What's new: estate and gift tax",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax",
    status: "current"
  },
  irsForm706: {
    title: "IRS — Instructions for Form 706",
    url: "https://www.irs.gov/instructions/i706",
    status: "current"
  },
  irs559: {
    title: "IRS — Publication 559, Survivors, Executors, and Administrators",
    url: "https://www.irs.gov/publications/p559",
    status: "current"
  },
  irs551: {
    title: "IRS — Publication 551, Basis of Assets",
    url: "https://www.irs.gov/pub/irs-pdf/p551.pdf",
    status: "current"
  },
  irs523: {
    title: "IRS — Publication 523, Selling Your Home",
    url: "https://www.irs.gov/publications/p523",
    status: "current"
  },
  irs527: {
    title: "IRS — Publication 527, Residential Rental Property",
    url: "https://www.irs.gov/pub/irs-pdf/p527.pdf",
    status: "current"
  },
  irs8824: {
    title: "IRS — Instructions for Form 8824, Like-Kind Exchanges",
    url: "https://www.irs.gov/pub/irs-prior/i8824--2025.pdf",
    status: "current"
  },
  ftb540: {
    title: "California FTB — 2025 Form 540 instructions",
    url: "https://www.ftb.ca.gov/forms/2025/2025-540-instructions.html",
    status: "current"
  },
  ftbCapitalGains: {
    title: "California FTB — Capital gains and losses",
    url: "https://www.ftb.ca.gov/file/personal/income-types/capital-gains-and-losses.html",
    status: "current"
  },
  ftbEstate: {
    title: "California FTB — California estate and gift tax analysis",
    url: "https://www.ftb.ca.gov/tax-pros/law/legislation/2019-2020/SB378-032519.pdf",
    status: "review"
  },
  boeProp19: {
    title: "California BOE — Proposition 19",
    url: "https://www.boe.ca.gov/prop19/",
    status: "current"
  },
  boeProp19Info: {
    title: "California BOE — 2025 Proposition 19 information sheet",
    url: "https://boe.ca.gov/proptaxes/pdf/lta25015.pdf",
    status: "current"
  },
  boeProp13: {
    title: "California BOE — How property is assessed",
    url: "https://boe.ca.gov/pdf/pub800-10.pdf",
    status: "current"
  },
  sccAssessor: {
    title: "Santa Clara County Assessor — Property information",
    url: "https://www.sccassessor.org/",
    status: "verify"
  },
  sccTRA: {
    title: "Santa Clara County — Tax Rate Area dataset",
    url: "https://data.sccgov.org/Government/Tax-Rate-Area-TRA-/ez7c-wn3h",
    status: "current"
  },
  sccRecording: {
    title: "Santa Clara County Clerk-Recorder — Record fees and transfer tax",
    url: "https://clerkrecorder.sccgov.org/record-fees",
    status: "current"
  },
  sccAllocation: {
    title: "Santa Clara County — Property-tax allocation",
    url: "https://payments.sccgov.org/propertytaxallocation",
    status: "current"
  },
  sfTaxRate: {
    title: "San Francisco — FY 2026–27 property-tax-rate resolution",
    url: "https://media.api.sf.gov/documents/bag092226_minutes.pdf",
    status: "current"
  },
  sfRent: {
    title: "San Francisco Rent Board — Current rates",
    url: "https://www.sf.gov/reports--current-rates-including-rent-increase-relocation-sec-deposit",
    status: "current"
  },
  sfRentLaw: {
    title: "San Francisco — Rent limitations, Section 37.3",
    url: "https://www.sf.gov/information/sec-373-rent-limitations",
    status: "current"
  },
  sfPropH: {
    title: "San Francisco — November 2026 voter pamphlet, Proposition H",
    url: "https://media.api.sf.gov/documents/N26_EN_VIP.pdf",
    status: "proposal"
  },
  sfPropHEconomic: {
    title: "San Francisco Controller — Proposition H economic impact report",
    url: "https://media.api.sf.gov/documents/MUNI_parcel_tax_economic_impact_final.pdf",
    status: "proposal"
  },
  sfPropHResults: {
    title: "San Francisco Elections — November 3, 2026 official results page",
    url: "https://www.sfelections.org/results/20261103w/index.html",
    status: "preliminary"
  },
  sfElection: {
    title: "San Francisco — certified election results index",
    url: "https://www.sf.gov/past-election-results",
    status: "verify"
  },
  cdiInsurance: {
    title: "California Department of Insurance — Residential insurance",
    url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/upload/Residential-Insurance-Homeowners-and-Renters-One-Pager-Updated-091223.pdf",
    status: "current"
  },
  calwater: {
    title: "Cal Water — CPUC-approved 2026 rate information",
    url: "https://www.calwater.com/latest-news/2026-0430-cpuc-2024-general-rate-case-decision/",
    status: "current"
  },
  pge: {
    title: "PG&E — 2026 residential electric rate advisory",
    url: "https://www.pge.com/assets/pge/docs/account/rate-plans/electric-rate-advisory-0126.pdf",
    status: "current"
  },
  treasury: {
    title: "U.S. Treasury — Daily Treasury rate statistics",
    url: "https://home.treasury.gov/policy-issues/financing-the-government/interest-rate-statistics",
    status: "current"
  },
  nber: {
    title: "NBER — Business-cycle dating FAQ",
    url: "https://www.nber.org/research/business-cycle-dating/business-cycle-dating-procedure-frequently-asked-questions",
    status: "research"
  },
  fed2008: {
    title: "Federal Reserve — The Panic of 2008",
    url: "https://www.federalreserve.gov/newsevents/speech/warsh20090406a.htm",
    status: "research"
  },
  fredTreasury: {
    title: "Federal Reserve Bank of St. Louis — Treasury constant maturity series",
    url: "https://fred.stlouisfed.org/graph/?g=1KI80",
    status: "research"
  },
  modelMethod: {
    title: "Model method: official-rule register and scenario assumptions",
    url: "research.html#model-method",
    status: "method"
  }
};

const pageNames = {
  home: "Overview",
  model: "Scenario model",
  research: "Research register",
  timeline: "Timeline",
  briefing: "Attorney + CPA brief",
  glossary: "Glossary",
  suggestions: "Suggestions",
  flagged: "Flagged for review"
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sourceLink(id, label) {
  const source = sources[id];
  if (!source) return `<span class="status unverified">Source not registered</span>`;
  return `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${label || source.title}</a>`;
}

function sourceStatus(id) {
  const source = sources[id];
  if (!source) return "unverified";
  if (source.status === "current") return "current";
  if (source.status === "proposal") return "proposal";
  if (source.status === "preliminary") return "preliminary";
  if (source.status === "verify") return "review";
  return "verified";
}

function statusChip(text, kind = "") {
  return `<span class="status ${kind}">${text}</span>`;
}

function sourceCell(id, note = "Official source") {
  return `<div class="source-cell">${sourceLink(id, note)}<br>${statusChip(sourceStatus(id), sourceStatus(id))}</div>`;
}

function money(value, digits = 2) {
  return `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

function pct(value, digits = 1) {
  return `${Number(value).toFixed(digits)}%`;
}

function multiple(value) {
  return `${Number(value).toFixed(2)}×`;
}

function formatRange(low, high) {
  return `${multiple(low)}–${multiple(high)}`;
}

function navLink(href, label, key, current) {
  return `<a href="${href}" class="${current === key ? "active" : ""}" ${current === key ? 'aria-current="page"' : ""}>${label}</a>`;
}

function renderShell() {
  const current = document.body.dataset.page || "home";
  document.querySelector("#site-header").innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark" aria-hidden="true">ID</span>
          <span class="brand-copy"><strong>Inheritance Decision Lab</strong><span>Private-first household planning</span></span>
        </a>
        <nav class="primary-nav" aria-label="Primary navigation">
          ${navLink("index.html", "Overview", "home", current)}
          ${navLink("model.html", "Model", "model", current)}
          <details class="nav-group" ${["research", "timeline", "briefing"].includes(current) ? "open" : ""}>
            <summary>Evidence</summary>
            <div class="nav-menu">
              ${navLink("research.html", "Research register", "research", current)}
              ${navLink("timeline.html", "Deadlines timeline", "timeline", current)}
              ${navLink("briefing.html", "Attorney + CPA brief", "briefing", current)}
            </div>
          </details>
          <details class="nav-group" ${["glossary", "suggestions", "flagged"].includes(current) ? "open" : ""}>
            <summary>Tools</summary>
            <div class="nav-menu">
              ${navLink("glossary.html", "Glossary", "glossary", current)}
              ${navLink("suggestions.html", "Suggestions", "suggestions", current)}
              ${navLink("flagged.html", "Flagged for review", "flagged", current)}
            </div>
          </details>
        </nav>
      </div>
    </header>`;
  document.querySelector("#site-footer").innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <p><strong>Privacy first.</strong> This public build contains no names, exact addresses, ZIP codes, APNs, trust identifiers, lease identifiers, contact details, or household-specific account balances. Private values belong in a separate, untracked copy.</p>
          <p>Snapshot checked <strong>November 25, 2026</strong>. The future 2040–2050 decision cannot be made from today's law or a point forecast alone. This is an organizing and scenario tool, not legal, tax, insurance, appraisal, or investment advice.</p>
        </div>
        <div class="footer-links">
          <a href="research.html">Sources</a>
          <a href="flagged.html">Open issues</a>
          <a href="briefing.html">Print brief</a>
        </div>
      </div>
    </footer>`;
}

function pageHeader(eyebrow, title, description) {
  return `<section class="page-title"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></section>`;
}

function sectionHeading(eyebrow, title, description = "") {
  return `<div class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${description ? `<p>${description}</p>` : ""}</div></div>`;
}

function sourceFootnote() {
  return `<p class="small"><strong>Source rule:</strong> official authority links describe the rule or method. A private household figure is not treated as verified merely because an official search page exists; those items stay blank and appear on <a href="flagged.html">Flagged for review</a>.</p>`;
}

function propertyBOverlay() {
  return `
    <section class="section" id="property-b-overlay">
      ${sectionHeading("Existing asset overlay", "Property B is an operating property, not a second inheritance choice", "This is the household-supplied description carried forward as unverified context. Exact rent, leases, identifiers, tax bills, debt, and utility bills stay private and blank.")}
      <div class="grid grid-3">
        <article class="card soft-blue"><span class="card-number">B1</span><h3>Three livable units</h3><p>The working description says Property B has three livable units. Confirm lawful unit configuration, occupancy, insurance classification, and any owner-occupancy restrictions before using the fact.</p><p class="small">${sourceLink("sfRentLaw", "Official San Francisco rent rules")}</p></article>
        <article class="card soft-teal"><span class="card-number">B2</span><h3>Two units occupied or rented</h3><p>Two units are described as occupied or rented, creating existing rental income and lease obligations. The exact income, lease terms, deposits, expenses, and tenant facts are intentionally omitted and marked unverified.</p><p class="small">${sourceLink("sfRent", "Official rent-rate register")}</p></article>
        <article class="card soft-gold"><span class="card-number">B3</span><h3>Owner-occupancy option</h3><p>The third-unit / owner-occupancy choice must be tested against lawful notices, local rent rules, moving needs, utilities, reserves, insurance, and household utility. It is not assumed to be available or costless.</p><p class="small">${sourceLink("sfRentLaw", "Review owner-occupancy rules")}</p></article>
      </div>
      <div class="callout neutral" style="margin-top:16px"><div aria-hidden="true">i</div><div><strong>How it enters the model</strong><p>The public scenario outputs do not fabricate Property B dollars. B remains an overlay to every path: preserve rental income, move in, change occupancy, sell, refinance, or retain only after the private lease/debt/insurance/utility/capital records are verified.</p></div></div>
    </section>`;
}

function homePage() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Executive summary · decision gate</p>
        <h1>Decide what would change the answer before the figures arrive.</h1>
        <p class="lede">This dashboard separates an inherited Cupertino-area home from an already-owned San Francisco-area property, keeps the household private, and compares live, rent, sell, staged, and mixed paths on the same transfer date and horizon.</p>
        <div class="button-row">
          <a class="button" href="model.html">Open the what-if model</a>
          <a class="button-secondary" href="briefing.html">Print the attorney + CPA brief</a>
        </div>
      </div>
      <aside class="hero-panel" aria-label="Current decision status">
        <p class="card-kicker">Current status</p>
        <h2>Not ready for a household recommendation</h2>
        <p>Critical private inputs are blank by design. The responsible output today is a conditional framework, not a precise ranking.</p>
        <ul>
          <li>Verify the date-of-death value, title/trust facts, tax basis, leases, debt, insurance, and five-year capital plans.</li>
          <li>Write the household's choice rules before the projection is run.</li>
          <li>Re-run after each verified input change and annually.</li>
        </ul>
      </aside>
    </section>

    <section class="callout danger" aria-label="Privacy warning">
      <div aria-hidden="true">●</div>
      <div><strong>Privacy boundary</strong><p>No personal identifiers or exact property identifiers are in this public site. The supplied estimates are treated as private, unverified working inputs; they are not repeated here.</p></div>
    </section>

    <section class="section" id="what-changes">
      ${sectionHeading("First screen", "What would change the answer?", "These are the decision hinges. Resolve them before optimizing a spreadsheet result.")}
      <div class="grid grid-3">
        <article class="card soft-gold"><span class="card-number">01</span><h3>Prop 19 eligibility and intent</h3><p>Was the inherited property the transferor's family home, will the heir occupy it as a principal residence, and is that occupancy intended to be long term? Moving out can end the exclusion at the next lien date. ${sourceLink("boeProp19", "BOE Prop 19 rules")}</p></article>
        <article class="card soft-blue"><span class="card-number">02</span><h3>Date-of-death appraisal and basis</h3><p>A written valuation and estate records drive income-tax basis, gain on sale, depreciation, and recapture. A current online estimate is not a substitute. ${sourceLink("irs551", "IRS basis rule")}</p></article>
        <article class="card soft-teal"><span class="card-number">03</span><h3>Property B's real constraints</h3><p>Property B is already owned and has rental occupancy, so it is not interchangeable with an inherited asset. Verify leases, lawful units, rent limits, debt, insurance, and the cost of living there. ${sourceLink("sfRentLaw", "SF rent rules")}</p></article>
        <article class="card"><span class="card-number">04</span><h3>Liquidity and household utility</h3><p>Price the value of a home actually used, including imputed rent, moving friction, accessibility, care needs, and a cash reserve. A paper return is not the same as spendable liquidity.</p></article>
        <article class="card"><span class="card-number">05</span><h3>Tax profile at the sale date</h3><p>Basis, depreciation, recapture, California's ordinary-income treatment of capital gains, the 1% high-income sensitivity, and transaction costs can reverse an apparent winner. ${sourceLink("ftbCapitalGains", "California capital gains")}</p></article>
        <article class="card"><span class="card-number">06</span><h3>Sequence risk and reinvestment rule</h3><p>Immediate stock entry concentrates the date-of-inheritance risk. A 24–36 month 3M–2Y Treasury staging path can soften entry concentration, but introduces reinvestment-rate and delayed-upside risk. ${sourceLink("treasury", "Treasury rates")}</p></article>
      </div>
    </section>

    ${propertyBOverlay()}

    <section class="section">
      ${sectionHeading("Readout", "A clean answer has three layers")}
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi-label">Decision status</div><div class="kpi-value">Gated</div><div class="kpi-note">Do not choose from incomplete evidence.</div></div>
        <div class="kpi"><div class="kpi-label">Transfer window</div><div class="kpi-value">2040–2050</div><div class="kpi-note">Planning window supplied by household; not a forecast.</div></div>
        <div class="kpi"><div class="kpi-label">Risk headline</div><div class="kpi-value">Entry date</div><div class="kpi-note">Immediate equity entry is the most exposed to a crash at inheritance.</div></div>
        <div class="kpi"><div class="kpi-label">Public evidence</div><div class="kpi-value">Rules, not facts</div><div class="kpi-note">Official law is sourced; private facts remain blank.</div></div>
      </div>
    </section>

    <section class="section" id="choices">
      ${sectionHeading("Decision matrix", "Compare choices at the same transfer date and horizon", "The public build shows the structure and evidence gates. It deliberately does not fill in household-specific dollars.")}
      <div class="table-wrap">
        <table>
          <thead><tr><th>Path</th><th>Occupancy / cash flow</th><th>Tax + property-tax questions</th><th>Liquidity</th><th>Reinvestment risk</th><th>Source</th></tr></thead>
          <tbody>
            <tr><td><strong>Live in Property A</strong><br><small>Pure path</small></td><td>Use A as the principal home; B's rental income and living arrangement remain a separate model.</td><td>Prop 19 claim, homeowners' exemption, assessed-value carryover, utilities, insurance, maintenance, and imputed rent.</td><td>Low while held; high housing utility.</td><td>Low market-entry risk; high concentration in one property and local costs.</td><td>${sourceCell("boeProp19", "BOE Prop 19")}</td></tr>
            <tr><td><strong>Rent Property A</strong><br><small>Pure path</small></td><td>Let A; preserve B occupancy/rental plan. Obtain comparables and verify local rules before using rent.</td><td>Rental insurance, leases, depreciation, 27.5-year residential rental method, repairs vs improvements, and recapture.</td><td>Medium from rent; property remains illiquid.</td><td>Low stock-entry risk; landlord, vacancy, tenant, and local-rule risk.</td><td>${sourceCell("irs527", "IRS Pub. 527")}</td></tr>
            <tr><td><strong>Sell at inheritance</strong><br><small>Pure path</small></td><td>Convert A to liquid capital; price transfer tax, recording, sale costs, basis and tax before investing.</td><td>Date-of-death basis, gain, California tax, exclusion eligibility, debt payoff, transfer tax and fees.</td><td>High after closing.</td><td><strong>Highest</strong> if all proceeds enter stocks immediately at a stressed valuation.</td><td>${sourceCell("irs551", "IRS basis")}</td></tr>
            <tr><td><strong>Sell → Treasuries → stocks</strong><br><small>Black-swan path</small></td><td>Park net proceeds in a documented 3M–2Y Treasury ladder for 24–36 months; phase into stocks under a written policy.</td><td>Same sale taxes/costs; Treasury interest tax; investment-policy and allocation records.</td><td>High, subject to ladder maturity and reserve rules.</td><td><strong>Softens entry concentration</strong>; gives up some immediate equity upside and can face lower future yields.</td><td>${sourceCell("treasury", "U.S. Treasury")}</td></tr>
            <tr><td><strong>Live then sell</strong><br><small>Mixed path</small></td><td>Live in A for a defined period, then reassess or sell on the same comparison horizon.</td><td>Primary-residence exclusion tests, rental-use allocation, depreciation recapture, Prop 19 continuity, and selling costs.</td><td>Starts low, rises at sale.</td><td>Delayed entry; timing and residence-test risk.</td><td>${sourceCell("irs523", "IRS Pub. 523")}</td></tr>
            <tr><td><strong>Rent then sell</strong><br><small>Mixed path</small></td><td>Rent A for a defined period, then sell or reinvest; do not assume voucher rent is market rent.</td><td>Lease restrictions, depreciation/recapture, capital costs, sale basis, and any exclusion after conversion.</td><td>Rent plus later sale proceeds.</td><td>Delayed stock entry; tenant, vacancy, and market-rent risk.</td><td>${sourceCell("irs527", "IRS Pub. 527")}</td></tr>
          </tbody>
        </table>
      </div>
      ${sourceFootnote()}
    </section>

    <section class="section" id="missing">
      ${sectionHeading("Information register", "Questions, information, and answers required before a reasonable decision", "A blank is an intentional stop sign. Do not replace it with a rounded guess.")}
      <div class="table-wrap">
        <table>
          <thead><tr><th>Question to answer</th><th>Current public answer</th><th>What is missing</th><th>Next action</th><th>Source</th></tr></thead>
          <tbody>
            <tr><td><strong>What exactly transfers, when, and through which trust instrument?</strong></td><td>${statusChip("Blank", "unverified")}</td><td>Certified trust/deed, beneficiary share, date-of-death, debt, title, and distribution terms.</td><td>Attorney creates a redacted private estate inventory.</td><td>${sourceCell("irsForm706", "Form 706 instructions")}</td></tr>
            <tr><td><strong>What is Property A's written value at date of death?</strong></td><td>${statusChip("Blank", "unverified")}</td><td>Independent appraisal with effective date; separate land/building allocation if rental use begins.</td><td>Order a written appraisal; retain report privately.</td><td>${sourceCell("irs551", "IRS inherited basis")}</td></tr>
            <tr><td><strong>What are the property-tax values and tax-rate area?</strong></td><td>${statusChip("Blank", "unverified")}</td><td>APN, tax-rate area, current factored base-year value, exemptions, bonds, and supplemental bill.</td><td>Pull county records using the APN only in the private copy.</td><td>${sourceCell("sccTRA", "Santa Clara TRA")}</td></tr>
            <tr><td><strong>Will the heir occupy Property A long term?</strong></td><td>${statusChip("Not agreed", "review")}</td><td>Written household rule for live/rent/sell, move-in timing, and what happens if care, work, or family needs change.</td><td>Sign a dated decision policy before projections.</td><td>${sourceCell("boeProp19", "BOE Prop 19")}</td></tr>
            <tr><td><strong>Can Property B's leases and units be continued?</strong></td><td>${statusChip("Blank", "unverified")}</td><td>Executed leases, lawful unit count, rent-control coverage, deposits, notices, insurance, and owner-occupancy effects.</td><td>Have a local landlord attorney/property manager review each lease.</td><td>${sourceCell("sfRentLaw", "SF Rent Ordinance")}</td></tr>
            <tr><td><strong>What is the sale tax and cost stack?</strong></td><td>${statusChip("Blank", "unverified")}</td><td>Basis, improvements, depreciation, recapture, debt, commissions, transfer tax, recording fees, and federal/California tax profile.</td><td>CPA prepares a sale-year worksheet before listing.</td><td>${sourceCell("sccRecording", "County transfer tax + fees")}</td></tr>
            <tr><td><strong>What would make the household choose each path?</strong></td><td>${statusChip("Not agreed", "review")}</td><td>Pre-written thresholds for liquidity, housing utility, risk, taxes, care, and acceptable landlord work.</td><td>Use the policy page and date each change.</td><td>${sourceCell("modelMethod", "Decision-policy method")}</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      ${sectionHeading("Next step", "Use the model as a decision instrument, not an oracle")}
      <div class="grid grid-3">
        <article class="card"><h3>1. Lock the evidence</h3><p>Move unresolved facts to the private inventory, obtain independent estimates, and keep public outputs anonymized.</p><a href="flagged.html">Review flagged items →</a></article>
        <article class="card"><h3>2. Test the range</h3><p>Compare the same transfer year and horizon under normal, 2008-style, 1929-style, and stagflation conditions.</p><a href="model.html">Run what-if controls →</a></article>
        <article class="card"><h3>3. Record the choice</h3><p>Write the path, date, assumptions, evidence, and what would cause a re-run. Do not reverse-engineer the answer from one projection.</p><a href="briefing.html">Open briefing sheet →</a></article>
      </div>
    </section>`;
}

const defaultModelState = {
  transferYear: 2045,
  horizon: 20,
  propertyGrowth: 3.0,
  equityReturn: 6.0,
  treasuryYield: 3.5,
  stagingMonths: 30,
  saleFriction: 2.0,
  taxDrag: 20.0,
  rentYield: 0.0,
  imputedRent: 2.5,
  holdingCost: 1.7,
  residenceExclusion: "unknown",
  highIncomeSurtax: "unknown",
  propHStatus: "preliminary",
  stress: "gfc"
};

function getModelState() {
  const value = (id, fallback) => {
    const node = document.getElementById(id);
    return node ? node.value : fallback;
  };
  return {
    transferYear: Number(value("transfer-year", defaultModelState.transferYear)),
    horizon: Number(value("horizon", defaultModelState.horizon)),
    propertyGrowth: Number(value("property-growth", defaultModelState.propertyGrowth)),
    equityReturn: Number(value("equity-return", defaultModelState.equityReturn)),
    treasuryYield: Number(value("treasury-yield", defaultModelState.treasuryYield)),
    stagingMonths: Number(value("staging-months", defaultModelState.stagingMonths)),
    saleFriction: Number(value("sale-friction", defaultModelState.saleFriction)),
    taxDrag: Number(value("tax-drag", defaultModelState.taxDrag)),
    rentYield: Number(value("rent-yield", defaultModelState.rentYield)),
    imputedRent: Number(value("imputed-rent", defaultModelState.imputedRent)),
    holdingCost: Number(value("holding-cost", defaultModelState.holdingCost)),
    residenceExclusion: value("residence-exclusion", defaultModelState.residenceExclusion),
    highIncomeSurtax: value("high-income-surtax", defaultModelState.highIncomeSurtax),
    propHStatus: value("prop-h-status", defaultModelState.propHStatus),
    stress: value("stress", defaultModelState.stress)
  };
}

function stressSpec(name) {
  const specs = {
    none: { label: "No selected entry shock", shock: 0, note: "Normal-path sensitivity only." },
    gfc: { label: "2008-style entry shock", shock: -0.35, note: "Scenario shock, not a forecast; the Federal Reserve describes broad price declines and liquidity stress in 2008." },
    depression: { label: "1929-style deep contraction", shock: -0.45, note: "Scenario shock, not a reconstruction of every 1929–33 return." },
    stagflation: { label: "Stagflation + delayed recovery", shock: -0.20, note: "Model stress: equity drawdown plus lower real purchasing power; no single historical path is assumed." }
  };
  return specs[name] || specs.gfc;
}

function geometricSum(rate, years) {
  if (years <= 0) return 0;
  if (Math.abs(rate) < 0.000001) return years;
  return (Math.pow(1 + rate, years) - 1) / rate;
}

function investmentPlan(principal, years, state, staged) {
  const equity = state.equityReturn / 100;
  const treasury = state.treasuryYield / 100;
  const stress = stressSpec(state.stress);
  const saleNet = Math.max(0, principal);
  if (!staged) {
    let ending = saleNet * Math.pow(1 + equity, years);
    if (stress.shock !== 0) ending *= (1 + stress.shock);
    return {
      ending,
      exposure: 1,
      stressLoss: -stress.shock,
      treasuryShare: 0
    };
  }
  const months = Math.max(1, state.stagingMonths);
  let ending = 0;
  for (let month = 0; month < months; month += 1) {
    const tranche = saleNet / months;
    const yearsBeforeDeployment = month / 12;
    const yearsInEquity = Math.max(0, years - yearsBeforeDeployment);
    ending += tranche * Math.pow(1 + treasury, yearsBeforeDeployment) * Math.pow(1 + equity, yearsInEquity);
  }
  const exposure = Math.min(1, 12 / months);
  if (stress.shock !== 0) ending *= (1 + stress.shock * exposure);
  return {
    ending,
    exposure,
    stressLoss: -stress.shock * exposure,
    treasuryShare: Math.max(0, (months - 12) / months)
  };
}

function holdingCashflow(path, years, state) {
  const holdingCost = state.holdingCost / 100;
  const imputedHomeUse = state.imputedRent / 100;
  const rentYield = state.rentYield / 100;
  let annual = 0;
  if (path === "live") annual = imputedHomeUse - holdingCost;
  if (path === "rent") annual = rentYield - holdingCost;
  if (path === "mixed" || path === "rentThenSell") annual = (path === "mixed" ? imputedHomeUse : rentYield) - holdingCost;
  return annual * geometricSum(state.propertyGrowth / 100, years);
}

function simulatePath(path, state) {
  const years = state.horizon;
  const propertyGrowth = state.propertyGrowth / 100;
  const saleCost = state.saleFriction / 100;
  const taxDrag = state.taxDrag / 100;
  const surtaxDrag = state.highIncomeSurtax === "above" ? 0.01 : 0;
  const propertyAtEnd = Math.pow(1 + propertyGrowth, years);
  const baseSaleNet = Math.max(0, 1 - saleCost - taxDrag - surtaxDrag);
  let ending = 0;
  let liquidity = 0;
  let exposure = 0;
  let notes = "";

  if (path === "live" || path === "rent") {
    ending = propertyAtEnd + holdingCashflow(path, years, state);
    liquidity = path === "live" ? 0.08 : 0.14;
    notes = path === "live" ? "Home utility + concentration" : "Rent + landlord exposure";
  }

  if (path === "sell") {
    const plan = investmentPlan(baseSaleNet, years, state, false);
    ending = plan.ending;
    liquidity = 0.92;
    exposure = plan.exposure;
    notes = "Liquid, but full equity-entry exposure";
  }

  if (path === "staged") {
    const plan = investmentPlan(baseSaleNet, years, state, true);
    ending = plan.ending;
    liquidity = 0.90;
    exposure = plan.exposure;
    notes = `Treasury staging for ${state.stagingMonths} months`;
  }

  if (path === "mixed" || path === "rentThenSell") {
    const holdYears = Math.min(5, years);
    const heldValue = Math.pow(1 + propertyGrowth, holdYears);
    const heldFlow = holdingCashflow(path, holdYears, state);
    const residenceFactor = state.residenceExclusion === "eligible" ? 0.35 : (state.residenceExclusion === "unknown" ? 0.65 : 1);
    const mixedTaxDrag = path === "mixed" ? taxDrag * residenceFactor : taxDrag;
    const mixedNet = Math.max(0, heldValue * (1 - saleCost - mixedTaxDrag - surtaxDrag));
    const plan = investmentPlan(mixedNet, years - holdYears, state, true);
    ending = plan.ending + heldFlow;
    liquidity = 0.65;
    exposure = plan.exposure;
    notes = path === "mixed" ? "Live five years, then sell + stage" : "Rent five years, then sell + stage";
  }

  return { ending, liquidity, exposure, notes, stressLoss: exposure * -stressSpec(state.stress).shock };
}

function scenarioRange(path, state) {
  const lowState = {
    ...state,
    propertyGrowth: Math.max(0, state.propertyGrowth - 2),
    equityReturn: Math.max(0, state.equityReturn - 3),
    treasuryYield: Math.max(0, state.treasuryYield - 1),
    rentYield: Math.max(0, state.rentYield - 1),
    taxDrag: Math.min(60, state.taxDrag + 10)
  };
  const highState = {
    ...state,
    propertyGrowth: state.propertyGrowth + 2,
    equityReturn: state.equityReturn + 3,
    treasuryYield: state.treasuryYield + 1,
    rentYield: state.rentYield + 1,
    taxDrag: Math.max(0, state.taxDrag - 10)
  };
  const base = simulatePath(path, state);
  const low = simulatePath(path, lowState).ending;
  const high = simulatePath(path, highState).ending;
  return { base, low: Math.min(low, high), high: Math.max(low, high) };
}

const pathDefinitions = [
  { key: "live", name: "Live in Property A", type: "Pure", source: "boeProp19", risk: "Concentration + unpriced home costs" },
  { key: "rent", name: "Rent Property A", type: "Pure", source: "irs527", risk: "Vacancy + lease + maintenance" },
  { key: "sell", name: "Sell at inheritance", type: "Pure", source: "irs551", risk: "Immediate equity entry" },
  { key: "staged", name: "Sell → Treasuries → stocks", type: "Black swan", source: "treasury", risk: "Lower entry risk; reinvestment-rate risk" },
  { key: "mixed", name: "Live five years, then sell", type: "Mixed", source: "irs523", risk: "Residence-test + timing risk" },
  { key: "rentThenSell", name: "Rent five years, then sell", type: "Mixed", source: "irs527", risk: "Depreciation + tenant + timing risk" }
];

function modelTable(state) {
  return `<div class="table-wrap"><table>
    <thead><tr><th>Path</th><th>Illustrative ending wealth<br><small>per $1.00 inherited</small></th><th>Liquidity</th><th>Risk beside the headline</th><th>Tax / occupancy / cost treatment</th><th>Method source</th></tr></thead>
    <tbody>${pathDefinitions.map((path) => {
      const result = scenarioRange(path.key, state);
      const base = result.base;
      return `<tr>
        <td><strong>${path.name}</strong><br><span class="tag">${path.type}</span></td>
        <td><strong>${formatRange(result.low, result.high)}</strong><br><small>base ${multiple(base.ending)} · not a household dollar result</small></td>
        <td>${pct(base.liquidity * 100, 0)} liquid proxy<br><small>${esc(base.notes)}</small></td>
        <td><strong>${path.risk}</strong><br><small>Selected stress loss proxy: ${pct(base.stressLoss * 100, 0)} of equity-exposed capital.</small></td>
        <td>Sale friction ${pct(state.saleFriction)}; tax drag ${pct(state.taxDrag)} model control; debt payoff/interest is <strong>blank</strong> until verified. A net-rent yield ${pct(state.rentYield)}, carrying cost ${pct(state.holdingCost)}, and imputed rent ${pct(state.imputedRent)} are illustrative controls. ${state.residenceExclusion === "eligible" ? "Primary-residence sensitivity switched on for live-then-sell." : "Primary-residence exclusion remains unconfirmed."} ${state.highIncomeSurtax === "above" ? "CA 1% sensitivity switched on." : "CA 1% sensitivity not included until income is known."} ${state.propHStatus === "enacted" ? "Prop H marked enacted for private review; parcel-size charge is still blank and not priced." : (state.propHStatus === "preliminary" ? "Prop H has a preliminary Yes result but is not treated as enacted or priced; certification and implementation text remain pending." : "Prop H not included until status and parcel facts are verified.")}</td>
        <td>${sourceCell(path.source, "Official method")}</td>
      </tr>`;
    }).join("")}</tbody>
  </table></div>`;
}

function modelChart(state) {
  const points = [0, 5, 10, state.horizon].filter((v, index, array) => v <= state.horizon && array.indexOf(v) === index);
  const immediate = points.map((year) => investmentPlan(Math.max(0, 1 - state.saleFriction / 100 - state.taxDrag / 100), year, state, false).ending);
  const staged = points.map((year) => investmentPlan(Math.max(0, 1 - state.saleFriction / 100 - state.taxDrag / 100), year, state, true).ending);
  const max = Math.max(...immediate, ...staged, 1);
  return `<div class="chart" aria-label="Illustrative distribution chart">
    <p class="card-kicker">Distribution chart · sale proceeds only</p>
    <p class="small">Each row shows the model value of the same normalized net sale pool at the selected horizon. This is not a forecast and does not include Property B.</p>
    ${points.map((year, i) => `<div class="chart-row"><span class="chart-label">Year ${year}</span><div class="chart-track" title="Immediate entry ${multiple(immediate[i])}"><div class="chart-bar" style="width:${Math.max(3, immediate[i] / max * 100)}%"></div></div><span class="chart-value">${multiple(immediate[i])} immediate</span></div><div class="chart-row"><span class="chart-label"></span><div class="chart-track" title="Staged entry ${multiple(staged[i])}"><div class="chart-bar" style="width:${Math.max(3, staged[i] / max * 100)}%;background:linear-gradient(90deg,#a96818,#e2a844)"></div></div><span class="chart-value">${multiple(staged[i])} staged</span></div>`).join("")}
  </div>`;
}

function illustrativeLeader(state) {
  const ranked = pathDefinitions.map((path) => ({ path, result: scenarioRange(path.key, state) })).sort((a, b) => b.result.base.ending - a.result.base.ending);
  const leader = ranked[0];
  return `<div class="callout neutral" id="model-leader"><div aria-hidden="true">↗</div><div><strong>Illustrative signal moved to: ${leader.path.name}</strong><p>Under the current controls, the normalized base case is ${multiple(leader.result.base.ending)} per $1.00 inherited. This is not a household recommendation; it is the live indication that should be rechecked after each verified input change.</p></div></div>`;
}

function modelRiskBoard(state) {
  const stress = stressSpec(state.stress);
  const immediate = simulatePath("sell", state);
  const staged = simulatePath("staged", state);
  const softening = immediate.stressLoss > 0 ? Math.max(0, 1 - staged.stressLoss / immediate.stressLoss) : 0;
  return `<div class="risk-board">
    <div class="risk-card"><strong>Reinvestment risk beside the headline</strong><div class="risk-number">${stress.label}</div><p>${stress.note} The displayed loss is a model shock, not a historical return series.</p></div>
    <div class="risk-card"><strong>Immediate equity entry</strong><div class="risk-number">${pct(immediate.stressLoss * 100, 0)} exposed</div><p>All normalized sale proceeds are treated as equity-exposed at the shock point.</p></div>
    <div class="risk-card safe"><strong>Staged Treasury path</strong><div class="risk-number">${pct(staged.stressLoss * 100, 0)} exposed</div><p>At ${state.stagingMonths} months, staging softens the entry shock by about ${pct(softening * 100, 0)} in this simplified test; lower future yields can reduce the benefit.</p></div>
  </div>`;
}

function modelPage() {
  return `
    ${pageHeader("Scenario model", "Compare paths before you compare outcomes", "All paths use the same transfer year and horizon. The model is normalized to $1.00 of inherited-property value so the public website does not publish household financial data. Load private, verified values only in a private copy.")}
    <div class="callout warning"><div aria-hidden="true">!</div><div><strong>Illustrative controls only</strong><p>Property growth, equity return, carrying costs, tax drag, and sale friction are ranges for sensitivity testing. They are not sourced household facts. Legal rules and data sources are listed in the research register.</p><p><strong>First tax-year gate:</strong> compare inheritance plus an immediate sale on the same transfer date, using the written date-of-death basis, sale costs, debt payoff, and tax worksheet, before ranking any hold or staged path. Do not assume a 1031 exchange or tax deferral.</p></div></div>

    ${propertyBOverlay()}

    <section class="section" id="model-method">
      ${sectionHeading("Controls", "What-if controls", "No input is required to read the default comparison. Changing a control updates every path at once.")}
      <div class="controls" id="model-controls">
        <div class="control"><label for="transfer-year">Inheritance / transfer year</label><input id="transfer-year" type="range" min="2040" max="2050" step="1" value="2045"><output id="out-transfer-year">2045</output></div>
        <div class="control"><label for="horizon">Comparison horizon</label><input id="horizon" type="range" min="10" max="30" step="5" value="20"><output id="out-horizon">20 years</output></div>
        <div class="control"><label for="property-growth">Property nominal growth</label><input id="property-growth" type="range" min="0" max="6" step="0.5" value="3"><output id="out-property-growth">3.0%</output></div>
        <div class="control"><label for="equity-return">Equity nominal return</label><input id="equity-return" type="range" min="0" max="10" step="0.5" value="6"><output id="out-equity-return">6.0%</output></div>
        <div class="control"><label for="treasury-yield">3M–2Y Treasury yield assumption</label><input id="treasury-yield" type="range" min="0" max="6" step="0.25" value="3.5"><output id="out-treasury-yield">3.50%</output></div>
        <div class="control"><label for="staging-months">Treasury staging period</label><select id="staging-months"><option value="24">24 months</option><option value="30" selected>30 months</option><option value="36">36 months</option></select><output id="out-staging-months">30 months</output></div>
        <div class="control"><label for="sale-friction">Sale friction sensitivity</label><input id="sale-friction" type="range" min="0" max="5" step="0.5" value="2"><output id="out-sale-friction">2.0%</output></div>
        <div class="control"><label for="tax-drag">Sale-year tax drag sensitivity</label><input id="tax-drag" type="range" min="0" max="50" step="5" value="20"><output id="out-tax-drag">20%</output></div>
        <div class="control"><label for="rent-yield">Property A net-rent yield sensitivity</label><input id="rent-yield" type="range" min="0" max="6" step="0.5" value="0"><output id="out-rent-yield">0.0%</output></div>
        <div class="control"><label for="imputed-rent">Imputed-rent input for living path</label><input id="imputed-rent" type="range" min="0" max="6" step="0.5" value="2.5"><output id="out-imputed-rent">2.5%</output></div>
        <div class="control"><label for="holding-cost">Property carry + capital-cost sensitivity</label><input id="holding-cost" type="range" min="0" max="5" step="0.5" value="1.7"><output id="out-holding-cost">1.7%</output></div>
        <div class="control"><label for="residence-exclusion">Primary-residence exclusion</label><select id="residence-exclusion"><option value="unknown" selected>Not modeled — tests unverified</option><option value="eligible">Switch on for eligible live-then-sell path</option><option value="not-eligible">Switch off</option></select><output id="out-residence-exclusion">Not modeled</output></div>
        <div class="control"><label for="high-income-surtax">California 1% sensitivity</label><select id="high-income-surtax"><option value="unknown" selected>Not modeled — income unknown</option><option value="above">Switch on if CA taxable income exceeds $1M</option></select><output id="out-high-income-surtax">Not modeled</output></div>
        <div class="control"><label for="prop-h-status">SF Proposition H status</label><select id="prop-h-status"><option value="not-modeled">Not modeled / not priced</option><option value="preliminary" selected>Official preliminary Yes — certification pending</option><option value="enacted">Verified enacted — parcel facts still blank</option></select><output id="out-prop-h-status">Preliminary; not enacted</output></div>
        <div class="control"><label for="stress">Entry stress case</label><select id="stress"><option value="none">No selected entry shock</option><option value="gfc" selected>2008-style entry shock</option><option value="depression">1929-style deep contraction</option><option value="stagflation">Stagflation + delayed recovery</option></select><output id="out-stress">2008-style entry shock</output></div>
        <p class="control-note">The Treasury path is deliberately constrained to the requested 24–36 month window. Treasury securities still have interest-rate, reinvestment, inflation, tax, and issuer/operational considerations; “safer entry” does not mean risk-free. Debt payoff and Property B parcel-size facts remain blank until verified.</p>
      </div>
    </section>

    <section class="section">
      <div class="model-head"><div><p class="eyebrow">Synchronized output</p><h2>Same transfer date · same horizon · mixed paths included</h2><p class="section-intro">Transfer year <strong id="model-transfer-label">2045</strong> and horizon <strong id="model-horizon-label">20 years</strong>. The public model gives relative values only; actual dollars require private verified inputs.</p></div><div class="model-meta"><strong id="model-state-label">Illustrative base</strong><span>not a recommendation</span></div></div>
      <div id="model-risk-board">${modelRiskBoard(defaultModelState)}</div>
      <div style="margin-top:12px">${illustrativeLeader(defaultModelState)}</div>
    </section>

    <section class="section" id="comparison">
      ${sectionHeading("Path comparison", "Range output per $1.00 inherited", "The range changes with the controls. Values include an illustrative property or investment outcome, but not a household-specific tax return.")}
      <div id="model-table">${modelTable(defaultModelState)}</div>
      <p class="small">Model interpretation: a range is more honest than a point. The low and high columns vary growth, return, Treasury yield, and tax drag around the chosen base. They do not represent confidence intervals.</p>
    </section>

    <section class="section" id="distribution">
      ${sectionHeading("Distribution", "What happens during the path matters", "The staged path is designed to test entry timing, not to guarantee a better terminal value.")}
      <div id="model-chart">${modelChart(defaultModelState)}</div>
    </section>

    <section class="section">
      ${sectionHeading("Tax-aware reading", "Do not let the model hide the tax categories")}
      <div class="grid grid-3">
        <article class="card soft-blue"><h3>Estate tax</h3><p>Estate tax is evaluated at the estate level against the filing threshold, adjusted taxable gifts, deductions, and available exclusion. It is not the same as the heir's income-tax basis.</p><p class="small">${sourceLink("irsForm706", "Read Form 706 instructions")}</p></article>
        <article class="card soft-teal"><h3>Income-tax basis</h3><p>Inherited property generally starts at date-of-death fair market value or a valid alternate valuation. Obtain the written appraisal and estate reporting package.</p><p class="small">${sourceLink("irs551", "Read IRS Pub. 551")}</p></article>
        <article class="card soft-gold"><h3>Property-tax assessment</h3><p>California assessed value follows Proposition 13 and eligible exclusions; it is not the market value and not the income-tax basis. Prop 19 eligibility is conditional on occupancy.</p><p class="small">${sourceLink("boeProp13", "Read BOE assessment rules")}</p></article>
      </div>
    </section>`;
}

function researchPage() {
  return `
    ${pageHeader("Research register", "Official rules, current figures, and proposals kept separate", "The register records the source, status, and the exact decision question each authority can answer. Recheck the links before the 2040–2050 transfer window.")}
    <div class="anchor-nav"><a href="#federal">Federal</a><a href="#california">California</a><a href="#local">Local</a><a href="#economics">Economic stress</a><a href="#model-method">Model method</a></div>

    <section class="section" id="federal">
      ${sectionHeading("Federal", "Estate, basis, residence exclusion, depreciation, and 1031")}
      <div class="table-wrap"><table>
        <thead><tr><th>Topic</th><th>Verified rule / figure</th><th>What it changes</th><th>Status</th><th>Source</th></tr></thead>
        <tbody>
          <tr><td><strong>2026 federal basic exclusion</strong></td><td>$15,000,000 for a 2026 decedent; future annual amounts are not known here.</td><td>Compare gross estate + adjusted taxable gifts against the exclusion in the year of death; do not project 2040–2050 as a fixed number.</td><td>${statusChip("Enacted 2026", "current")}</td><td>${sourceCell("irsEstate", "IRS estate/gift update")}</td></tr>
          <tr><td><strong>2026 annual gift exclusion</strong></td><td>$19,000 per donee for 2026; future amounts are subject to change.</td><td>Ask about prior taxable gifts, gift splitting, and whether a Form 709 history changes the available exclusion.</td><td>${statusChip("Enacted 2026", "current")}</td><td>${sourceCell("irsEstate", "IRS annual exclusion")}</td></tr>
          <tr><td><strong>Estate tax filing / payment</strong></td><td>Form 706 is generally due within nine months of death; payment is generally due within nine months unless an extension applies.</td><td>Build a liquidity plan before the estate has to pay tax, expenses, debts, and property carrying costs.</td><td>${statusChip("Current procedure", "current")}</td><td>${sourceCell("irsForm706", "Form 706 timing")}</td></tr>
          <tr><td><strong>Portability</strong></td><td>A timely and complete Form 706 is needed to elect a deceased spousal unused exclusion amount; confirm the executor's facts and any available relief.</td><td>Ask now about marital status, prior spouse, prior taxable gifts, and prior portability filings.</td><td>${statusChip("Fact dependent", "review")}</td><td>${sourceCell("irsForm706", "Portability instructions")}</td></tr>
          <tr><td><strong>Inherited basis</strong></td><td>Generally fair market value at date of death, or an applicable alternate valuation / special-use rule.</td><td>Drives sale gain, capital gain, depreciation basis, and later recapture analysis.</td><td>${statusChip("Current rule", "current")}</td><td>${sourceCell("irs551", "IRS Pub. 551")}</td></tr>
          <tr><td><strong>Home-sale exclusion</strong></td><td>Generally requires ownership and use as a main home for two of the five years before sale; business/rental allocation and depreciation rules still matter.</td><td>Switch the exclusion on only for a documented live-then-sell path that satisfies the tests at the sale date.</td><td>${statusChip("Fact dependent", "review")}</td><td>${sourceCell("irs523", "IRS Pub. 523")}</td></tr>
          <tr><td><strong>Residential rental depreciation</strong></td><td>Residential rental property is generally depreciated under MACRS; the IRS publication describes 27.5-year GDS treatment and basis/placed-in-service rules.</td><td>Separate land/building, improvements, personal use, depreciation claimed or allowable, and recapture at sale.</td><td>${statusChip("Current method", "current")}</td><td>${sourceCell("irs527", "IRS Pub. 527")}</td></tr>
          <tr><td><strong>Like-kind exchange</strong></td><td>Section 1031 applies to qualifying real property held for business or investment; deferred exchanges use 45-day identification and 180-day receipt deadlines.</td><td>Decide with tax counsel before listing. A primary residence and stock reinvestment are not automatically eligible replacement property.</td><td>${statusChip("Election / fact dependent", "review")}</td><td>${sourceCell("irs8824", "Form 8824 instructions")}</td></tr>
        </tbody>
      </table></div>
    </section>

    <section class="section" id="california">
      ${sectionHeading("California", "Income tax, property tax, and Proposition 19")}
      <div class="table-wrap"><table>
        <thead><tr><th>Topic</th><th>Verified rule / figure</th><th>Decision use</th><th>Status</th><th>Source</th></tr></thead>
        <tbody>
          <tr><td><strong>California capital gains</strong></td><td>California does not provide a special lower capital-gains rate; capital gains are taxed as ordinary income.</td><td>Do not copy federal long-term capital-gain rates into a California sale worksheet.</td><td>${statusChip("Current rule", "current")}</td><td>${sourceCell("ftbCapitalGains", "FTB capital gains")}</td></tr>
          <tr><td><strong>1% tax above $1,000,000</strong></td><td>The Form 540 instructions show the 1% Behavioral Health Services Tax worksheet for taxable income above $1,000,000; the exact application depends on filing facts.</td><td>Keep a visible 1% sensitivity, but leave it out until the CPA confirms taxable-income and filing-status facts.</td><td>${statusChip("Current instruction", "current")}</td><td>${sourceCell("ftb540", "2025 Form 540")}</td></tr>
          <tr><td><strong>Proposition 13</strong></td><td>Statewide ad valorem rate is 1% plus voter-approved debt and other authorized charges; assessed value generally increases no more than 2% annually unless a change in ownership/new construction or decline-in-value rules apply.</td><td>Separate market value, assessed value, tax-rate area, and supplemental assessment.</td><td>${statusChip("Current rule", "current")}</td><td>${sourceCell("boeProp13", "BOE Prop 13 overview")}</td></tr>
          <tr><td><strong>Prop 19 family-home exclusion</strong></td><td>For qualifying transfers after February 16, 2021, the family home must be the transferor's principal residence and become the transferee's principal residence; a homeowners' or disabled-veterans' exemption claim is required within one year, with a separate claim deadline generally within three years or before third-party transfer.</td><td>Claim only if long-term occupancy is the written household choice. If the heir later moves out, reassessment consequences can follow.</td><td>${statusChip("Current rule; fact dependent", "review")}</td><td>${sourceCell("boeProp19", "BOE Prop 19")}</td></tr>
          <tr><td><strong>Prop 19 value limit</strong></td><td>The adjusted taxable value uses the factored base-year value plus the statutory allowance; amounts and rules must be checked at the actual transfer date.</td><td>Do not use a current allowance as a 2040–2050 promise. Obtain county confirmation.</td><td>${statusChip("Current framework; future amount unknown", "review")}</td><td>${sourceCell("boeProp19Info", "BOE 2025 information sheet")}</td></tr>
          <tr><td><strong>California estate / inheritance tax</strong></td><td>The FTB analysis describes California's federal estate-tax pick-up tax as zero after the federal credit repeal; this is not a promise that future California legislation cannot change the result.</td><td>Track enacted changes and proposals separately; have counsel confirm no local or state death tax applies at death.</td><td>${statusChip("Needs annual recheck", "review")}</td><td>${sourceCell("ftbEstate", "FTB legislative analysis")}</td></tr>
        </tbody>
      </table></div>
    </section>

    <section class="section" id="local">
      ${sectionHeading("Local", "The exact tax-rate area and property rules still require private verification")}
      <div class="table-wrap"><table>
        <thead><tr><th>Jurisdiction / issue</th><th>Officially published item</th><th>Household value</th><th>Action</th><th>Source</th></tr></thead>
        <tbody>
          <tr><td><strong>Property A tax-rate area</strong></td><td>Santa Clara publishes a Tax Rate Area dataset and county allocation tools.</td><td><span class="blank">Blank</span> — APN intentionally omitted.</td><td>Use the private APN to retrieve the exact TRA and current rate; do not publish it.</td><td>${sourceCell("sccTRA", "Santa Clara TRA")}</td></tr>
          <tr><td><strong>Property A transfer tax / recording</strong></td><td>Public display rounds the county record-fee schedule to approximately $10 per $10,000 of consideration and $30 for a standard first page; the official schedule is more precise, has additional page/fee rules, and city conveyance taxes may apply in listed cities.</td><td><span class="blank">Blank</span> — sale consideration and location facts are private/unverified.</td><td>Ask the title/escrow company for a sale-year estimate and cite the enacted schedule then.</td><td>${sourceCell("sccRecording", "County record fees")}</td></tr>
          <tr><td><strong>Property B tax rate</strong></td><td>San Francisco approved a combined FY 2026–27 rate of 1.18162182 per $100 of assessed value in the cited resolution.</td><td><span class="blank">Blank</span> — assessed value and applicable exemptions not published.</td><td>Pull the private tax bill and confirm the year's final rate; do not apply this rate to 2040–2050.</td><td>${sourceCell("sfTaxRate", "SF FY 2026–27 rate")}</td></tr>
          <tr><td><strong>San Francisco rent controls</strong></td><td>The Rent Board lists a 1.6% annual allowable increase for March 1, 2026–February 28, 2027 and publishes separate rules, notices, and passthroughs.</td><td><span class="blank">Blank</span> — each lease and unit coverage status is unknown.</td><td>Review every lease and lawful-unit record with a local professional.</td><td>${sourceCell("sfRent", "SF Rent Board rates")}</td></tr>
          <tr><td><strong>Proposition H — Muni parcel tax</strong></td><td>The official pamphlet describes a 15-year inflation-adjusted annual parcel tax beginning July 1, 2027, with 2027 rates publicly displayed here as about $130 per parcel up to a maximum of $400,000 by parcel type and building area; the linked legal schedule controls. The official results page currently reports a preliminary Yes result of 74.42%; it is not yet a certified result in this snapshot.</td><td><span class="blank">Blank</span> — no parcel size, building-area, exemption, pass-through, enactment, or implementation facts are applied to Property B.</td><td>Verify the certified result and enacted code / implementation schedule before modeling or treating it as law. Until then, keep it as preliminary and unpriced.</td><td>${sourceCell("sfPropHResults", "Preliminary official result")}<br>${sourceLink("sfPropH", "Official ballot pamphlet")}<br>${sourceLink("sfPropHEconomic", "Official economic report")}</td></tr>
          <tr><td><strong>Property insurance</strong></td><td>California DOI says premiums depend on location, fire protection, building, deductible, discounts, coverage, and limits; it directs consumers to comparison tools and quotes.</td><td><span class="blank">Blank</span> — no premium is verified.</td><td>Obtain written primary-residence and landlord-policy quotes; include deductibles, exclusions, FAIR Plan exposure, and loss-of-use.</td><td>${sourceCell("cdiInsurance", "California DOI")}</td></tr>
          <tr><td><strong>Water and electricity</strong></td><td>Utility tariffs are usage- and rate-plan-specific; Cal Water and PG&E publish current tariff/rate material.</td><td><span class="blank">Blank</span> — household bills and solar credits are not published.</td><td>Use 24 months of private bills, solar statements, and utility rate schedules; model ranges rather than one month.</td><td>${sourceCell("calwater", "Cal Water")}<br>${sourceLink("pge", "PG&E rate advisory")}</td></tr>
        </tbody>
      </table></div>
    </section>

    <section class="section" id="economics">
      ${sectionHeading("Economic conditions", "Black swans are scenarios, not forecasts", "The history supports testing a range of paths; it does not predict the year of inheritance or a future market return.")}
      <div class="grid grid-3">
        <article class="card soft-red"><h3>1929–1933-style stress</h3><p>NBER dates the peak in August 1929 and trough in March 1933, and describes the contraction as the worst in U.S. history. The model uses a separate user-controlled shock proxy rather than claiming to recreate the period.</p><p class="small">${sourceLink("nber", "NBER chronology")}</p></article>
        <article class="card soft-blue"><h3>2008-style stress</h3><p>The Federal Reserve describes broad stock-price declines, falling household net worth, credit stress, and liquidity disruption in 2008. The staged path tests how much capital is exposed at the entry point.</p><p class="small">${sourceLink("fed2008", "Federal Reserve account")}</p></article>
        <article class="card soft-gold"><h3>Stagflation / reinvestment risk</h3><p>A Treasury ladder can reduce immediate equity concentration but its maturing proceeds must be reinvested at rates that may be lower, while inflation reduces real purchasing power. Use the Treasury series as an input source, not a promise.</p><p class="small">${sourceLink("treasury", "Treasury statistics")}</p></article>
      </div>
    </section>

    <section class="section" id="model-method">
      ${sectionHeading("Model method", "What the public model does and does not claim")}
      <div class="grid grid-2">
        <div class="card"><h3>Included</h3><ul><li>Same transfer year and horizon for every path.</li><li>Pure live, rent, immediate sale, phased sale, and two mixed paths.</li><li>Sale friction, tax drag, occupancy utility, property carry, liquidity proxy, and a 24–36 month Treasury stage as transparent controls.</li><li>Low/base/high ranges rather than one point output.</li><li>Stress tests that show entry exposure beside the headline.</li></ul></div>
        <div class="card"><h3>Not included until verified</h3><ul><li>Any exact household property value, rent, tax bill, debt, insurance premium, utility bill, lease fact, or trust balance.</li><li>Legal eligibility opinions, appraisals, tax-return computations, or a Monte Carlo probability.</li><li>A claim that 1929, 2008, or any other crisis will repeat.</li><li>Automatic recommendation. The decision remains gated until the flagged items are answered.</li></ul></div>
      </div>
      ${sourceFootnote()}
    </section>`;
}

function timelinePage() {
  const items = [
    ["Now", "Protect privacy and write the decision policy", "Create a private estate inventory; remove names, exact addresses, APNs, trust IDs, and account data from public materials. Agree in writing what would make the household live, rent, sell, or stage proceeds before the figures arrive.", "modelMethod"],
    ["Now", "Verify Property A and Property B", "Obtain an independent date-of-death valuation plan, current property-tax bills, exact tax-rate areas, leases, lawful-unit records, debt statements, insurance declarations, utility history, and five-year maintenance/capital plans.", "sccAssessor"],
    ["Before death / before transfer", "Ask about estate liquidity and portability", "Inventory all assets, liabilities, prior taxable gifts, prior Form 706 filings, marital status, and whether portability could matter. Build a cash plan if the estate could exceed the filing threshold.", "irsForm706"],
    ["Date of death", "Preserve the evidence trail", "Get a written appraisal at the date of death, retain trust/deed and estate schedules, identify title and beneficiary interests, and open a private tax-basis ledger. Do not rely on a later online estimate.", "irs551"],
    ["Within 9 months", "Form 706 and estate tax liquidity gate", "Form 706 and any estate/GST tax payment are generally due within nine months; a timely complete return is also central to portability. Confirm extensions and payment options with the estate CPA.", "irsForm706"],
    ["Within 1 year", "Prop 19 principal-residence claim", "If and only if the heir will occupy the family home as a principal residence, file the homeowners' or disabled-veterans' exemption claim within one year and maintain a private occupancy record.", "boeProp19"],
    ["Within 3 years / before third-party transfer", "File the intergenerational exclusion claim", "BOE-19-P or the applicable form generally has a three-year or earlier-transfer deadline. A late claim can have prospective effects; the assessor and attorney should confirm the actual deadline.", "boeProp19"],
    ["Before any sale", "Choose a sale tax strategy", "Have the CPA model inherited basis, improvements, depreciation/recapture, primary-residence exclusion, federal and California tax, debt payoff, title/escrow, transfer tax, recording fees, and any 1031 plan before listing or accepting an offer.", "irs8824"],
    ["At sale / first 45 days", "If 1031 is wanted, act before proceeds are received", "A qualifying investment/business real-property exchange requires advance advice, a qualified intermediary structure, written identification within 45 days, and receipt within 180 days or the tax-return due date, whichever is earlier.", "irs8824"],
    ["24–36 months after sale", "Implement the written Treasury-to-equity policy", "If the household chooses staging, document Treasury maturities, reserve needs, tax handling, phase dates, allocation bands, rebalancing, and what happens if a stress event occurs. Do not improvise after a headline.", "treasury"],
    ["Every year", "Re-run the model and refresh the law", "Update official federal, California, county, city, rent, insurance, utility, and Treasury sources; refresh the private inventory; review the capital plan, leases, property-tax assessments, and investment policy; record the decision and date.", "ftb540"]
  ];
  return `
    ${pageHeader("Timeline", "Deadlines are part of the decision", "The date of death is the pivot. The public timeline is a checklist; the attorney and CPA must confirm dates from the actual transfer and filing facts.")}
    <div class="callout warning"><div aria-hidden="true">!</div><div><strong>Deadline rule</strong><p>Do not put a future deadline on a calendar as if today's law is guaranteed. Recheck the authority at the event date and save the cited version with the private file.</p></div></div>
    <section class="section"><div class="timeline">${items.map((item, index) => `<article class="timeline-item"><div class="timeline-dot">${index + 1}</div><div class="timeline-body"><div class="date">${item[0]}</div><h3>${item[1]}</h3><p>${item[2]}</p><p class="small">${sourceLink(item[3], "Official timing / rule")}</p></div></article>`).join("")}</div></section>`;
}

function briefingPage() {
  return `
    <div class="print-tools no-print"><span class="small"><strong>One-page printable export.</strong> Use your browser's Print → Save as PDF. No private facts are embedded.</span><button class="button" id="print-brief" type="button">Print / save PDF</button></div>
    <section class="brief-sheet" id="brief-sheet">
      <div class="brief-header"><div><p class="eyebrow">Attorney + CPA briefing sheet · private working copy</p><h1>Inheritance decision: questions before a choice</h1><p>Property A is inherited through a trust; Property B is already owned and has a separate occupancy/rental history. Public version intentionally omits identifying and financial details.</p></div><div class="brief-stamp">Decision<br>not ready</div></div>
      <div class="brief-columns">
        <div>
          <h2>1. Facts to verify</h2>
          <ul><li>Trust, deed, beneficiary shares, title, date of death, debts, and distribution timing.</li><li>Written date-of-death appraisal and the basis package; separate estate tax value, income-tax basis, and property-tax assessment.</li><li>Property A tax-rate area, Prop 19 family-home eligibility, homeowners' exemption, and one-/three-year claim deadlines.</li><li>Property B leases, lawful units, rent-control coverage, owner occupancy, deposits, debt, insurance, utilities, and capital needs.</li><li>Prior taxable gifts, prior Form 706, marital status, portability, domicile, and estate liquidity.</li></ul>
          <h2>2. Tax questions</h2>
          <ul><li>Is Form 706 required or advisable for portability? What is the filing/payment plan?</li><li>What is the inherited basis and what is the sale-year federal/California gain, including depreciation recapture?</li><li>Does a live-then-sell path meet the primary-residence exclusion tests? What rental-use allocation remains?</li><li>Is a like-kind exchange actually wanted and eligible? If yes, who is the intermediary and who owns the 45/180-day clock?</li><li>What transfer tax, recording, escrow, debt payoff, and local charges apply at the sale date?</li></ul>
        </div>
        <div>
          <h2>3. Written choice rules</h2>
          <ul><li><strong>Live:</strong> choose only if long-term occupancy, liquidity reserve, and household utility outweigh concentration and carrying costs.</li><li><strong>Rent:</strong> choose only with market-rent evidence, written lease review, insurance, maintenance, vacancy, and depreciation plans.</li><li><strong>Sell:</strong> choose only after a sale-year tax worksheet and a written investment policy exist.</li><li><strong>Stage:</strong> use 24–36 months of 3M–2Y Treasuries only if the household accepts reinvestment-rate risk and has a phase schedule.</li><li><strong>Mixed:</strong> pre-agree the date or trigger that moves from live/rent to sale; do not let a single forecast create the trigger.</li></ul>
          <h2>4. Decision record</h2>
          <table class="mini-table"><thead><tr><th>Item</th><th>Answer / owner / date</th></tr></thead><tbody><tr><td>Chosen path</td><td>Blank — household decision after evidence review</td></tr><tr><td>Why</td><td>Blank — write the facts and trade-offs</td></tr><tr><td>What changes it</td><td>Blank — define triggers before the projection</td></tr><tr><td>Next annual review</td><td>Blank — update law, values, leases, costs</td></tr></tbody></table>
          <h2>5. Current official anchors</h2>
          <p class="small">${sourceLink("boeProp19", "Prop 19")} · ${sourceLink("irs551", "Inherited basis")} · ${sourceLink("irsForm706", "Form 706")} · ${sourceLink("ftb540", "Form 540 1% worksheet")} · ${sourceLink("irs8824", "1031")} · ${sourceLink("treasury", "Treasury rates")}</p>
        </div>
      </div>
      <div class="callout neutral" style="margin-top:16px"><div aria-hidden="true">i</div><div><strong>Scope</strong><p>This is a briefing agenda, not legal or tax advice. The public site intentionally leaves household facts blank. Keep the completed version in a secure private workspace.</p></div></div>
    </section>`;
}

function glossaryPage() {
  const terms = [
    ["Assessed value", "The taxable value used by the county to apply the property-tax rate. It is not automatically the market value or the income-tax basis.", "boeProp13"],
    ["Base-year value / factored base-year value", "The Proposition 13 acquisition-value starting point and its inflation-adjusted value, subject to change-of-ownership, new-construction, and decline-in-value rules.", "boeProp13"],
    ["Date-of-death fair market value", "The value used in the general inherited-basis rule. Obtain a written appraisal or the estate's accepted valuation; do not substitute a current online estimate.", "irs551"],
    ["Deceased spousal unused exclusion (DSUE)", "The unused federal estate-tax exclusion that may be portable to a surviving spouse when the executor makes the required election.", "irsForm706"],
    ["Depreciation recapture", "Tax treatment that can apply to depreciation allowed or allowable on property used for rental or business. It must be modeled separately from ordinary appreciation.", "irs527"],
    ["Documentary transfer tax", "A tax charged on a qualifying real-property transfer, usually based on consideration or value. It is a transaction cost, not an income-tax basis adjustment by itself.", "sccRecording"],
    ["Imputed rent", "The non-cash housing service received by living in a property instead of paying market rent. It can be used as a decision metric, but it is not automatically taxable rent.", "modelMethod"],
    ["Like-kind exchange / Section 1031", "A tax-deferred exchange of qualifying real property held for business or investment. It is not a general way to sell a home and buy stocks without tax.", "irs8824"],
    ["Liquidity", "How readily an asset can be converted to cash without a large timing or price penalty. Real estate can have high value but low liquidity.", "modelMethod"],
    ["Primary residence", "The home used as the taxpayer's main home for the applicable tax and property-tax tests. A label alone does not satisfy the tests.", "irs523"],
    ["Prop 19 intergenerational exclusion", "A California property-tax reassessment exclusion for qualifying parent/child or grandparent/grandchild transfers subject to family-home/farm, occupancy, claim, and value-limit conditions.", "boeProp19"],
    ["Reinvestment risk", "The risk that staged proceeds mature when available yields or asset prices differ from the plan; staging reduces immediate stock-entry exposure but does not remove risk.", "treasury"],
    ["Tax drag", "A model control representing taxes that reduce sale proceeds or investment returns. It is not a legal rate and must be replaced with a CPA's sale-year calculation.", "modelMethod"],
    ["Tax-rate area", "A geographic area sharing the same property-tax revenue distribution. The exact area must be looked up from the private APN.", "sccTRA"],
    ["Treasury ladder", "A set of Treasury securities with staggered maturities. This dashboard tests 3-month to 2-year instruments over a 24–36 month staging period.", "treasury"]
  ];
  return `
    ${pageHeader("Glossary", "Plain language for a high-stakes decision", "Use these definitions to keep estate tax, income-tax basis, property-tax assessment, rent, and investment risk from being mixed together.")}
    <section class="section"><div class="card"><dl class="definition-list">${terms.map((term) => `<div class="definition"><dt>${term[0]}</dt><dd>${term[1]} <span class="small">${sourceLink(term[2], "Source")}</span></dd></div>`).join("")}</dl></div></section>`;
}

function suggestionsPage() {
  const suggestions = [
    ["P0", "Add a private-data import boundary", "Keep a local-only JSON/CSV intake for appraisal, tax bills, insurance, utilities, leases, debt, and estate inventory. Never upload it to Pages.", "Privacy + evidence", "Next integration"],
    ["P0", "Add a source-freshness audit", "Store checked date, status, and next recheck cadence for every official link; visually separate enacted rules, proposals, and unverified facts.", "Trust", "Planned"],
    ["P0", "Add a decision-policy sign-off", "Require a dated record of what would cause each path to be selected before displaying an outcome ranking.", "Behavioral guardrail", "Planned"],
    ["P1", "Add quote and document attachments in a private app", "Attach appraisals, declarations pages, tax bills, leases, and CPA worksheets by document ID, not file name or address.", "Audit trail", "Future"],
    ["P1", "Run Monte Carlo only after inputs are verified", "Use ranges and correlated housing/equity/inflation scenarios; report distribution, downside, and liquidity shortfall rather than a single expected value.", "Analysis", "Future"],
    ["P1", "Add market-rent evidence workflow", "Capture independent comparables, date, unit facts, source, and confidence; keep voucher benchmarks as a floor only when appropriate.", "Rental path", "Future"],
    ["P1", "Add insurance quote comparison", "Store replacement-cost limits, deductibles, exclusions, FAIR Plan status, landlord liability, and loss-of-use—not just a premium.", "Operating cost", "Future"],
    ["P2", "Add annual review reminders", "Create a yearly checklist for law proposals, Prop 19 status, leases, tax rate areas, maintenance, insurance, and investing-policy drift.", "Maintenance", "Future"],
    ["P2", "Add accessible exports", "Keep the one-page brief, source register, flagged list, and decision log printable and screen-reader friendly.", "Usability", "Implemented / maintain"]
  ];
  return `
    ${pageHeader("Suggestions", "Improve the site without weakening the decision", "This is a reviewable backlog. A suggestion should be accepted only when its privacy, source, and decision-quality impact is understood.")}
    <div class="callout"><div aria-hidden="true">✓</div><div><strong>Implementation rule</strong><p>Do not add a colorful metric merely because it is easy to compute. Add a field when it changes a decision, exposes uncertainty, or preserves an audit trail.</p></div></div>
    <section class="section"><div class="table-wrap"><table><thead><tr><th>Priority</th><th>Suggestion</th><th>Why it improves decisions</th><th>Category</th><th>Status</th></tr></thead><tbody>${suggestions.map((item) => `<tr><td><span class="tag">${item[0]}</span></td><td><strong>${item[1]}</strong></td><td>${item[2]}</td><td>${item[3]}</td><td>${item[4]}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="section"><div class="grid grid-3"><article class="card soft-teal"><h3>Best next improvement</h3><p>Build a private evidence intake and source-freshness audit before adding more forecast sophistication.</p></article><article class="card soft-blue"><h3>Do not implement yet</h3><p>Monte Carlo probabilities, automated recommendations, or external API imports that could leak personal information.</p></article><article class="card soft-gold"><h3>Review cadence</h3><p>Revisit this backlog after each annual model run and whenever a flagged item is resolved.</p></article></div></section>`;
}

function flaggedPage() {
  const items = [
    ["Property A identity and title", "APN, deed, trust certificate, beneficiary share, lien/debt, transfer date", "Attorney + private assessor record", "high", "sccAssessor"],
    ["Property A date-of-death appraisal", "Written valuation at the actual date of death; land/building and improvements if later rented", "Independent appraiser; keep report private", "high", "irs551"],
    ["Property A tax-rate area and assessment", "Exact TRA, factored base-year value, exemptions, bonds, supplemental bill", "County private lookup and CPA review", "high", "sccTRA"],
    ["Prop 19 eligibility / intent", "Transferor principal residence, heir principal residence, one-year exemption claim, long-term occupancy", "Attorney confirms; household writes the choice rule", "high", "boeProp19"],
    ["Property A insurance", "Primary-residence replacement-cost quote, deductible, exclusions, loss-of-use, FAIR Plan availability", "Obtain written comparison quotes", "high", "cdiInsurance"],
    ["Property A utilities and solar", "24 months of water, electricity, solar credits, true-up, rate plan, and outage/repair records", "Collect private bills; model range", "medium", "calwater"],
    ["Property A five-year capital plan", "Roof, systems, exterior, safety, accessibility, regular maintenance and reserves", "Licensed inspection + contractor ranges", "high", "irs527"],
    ["Property A market rent", "Independent comparables with unit facts, date, concessions, vacancy, management, and local rules", "Licensed broker/property manager or appraiser", "high", "irs527"],
    ["Property B lease and unit facts", "Executed leases, lawful three-unit status, deposits, rent-control coverage, notices, and owner occupancy", "Local landlord attorney/property manager", "high", "sfRentLaw"],
    ["Property B insurance and capital plan", "Landlord policy, liability, water/sewer responsibility, repairs, seismic/fire, and five-year capital schedule", "Written quotes and inspection", "high", "cdiInsurance"],
    ["Estate liquidity", "Cash, securities, retirement accounts, business interests, debts, expenses, and possible federal filing threshold", "Private inventory + estate CPA", "high", "irsForm706"],
    ["Prior gifts and portability", "Prior Form 709/706, split gifts, marital status, prior spouse, DSUE, domicile", "CPA and estate attorney interview", "high", "irsForm706"],
    ["Sale-year tax worksheet", "Basis, improvements, depreciation, recapture, Section 121, federal/CA capital gains, high-income 1% sensitivity", "CPA runs all paths at same dates", "high", "ftb540"],
    ["Transfer tax and recording fees", "Actual county/city transfer tax, recording, escrow, title, debt payoff, and any exemption", "Title/escrow written estimate", "medium", "sccRecording"],
    ["Written investing policy", "Reserve, Treasury ladder, phase dates, allocation bands, tax location, rebalancing, and stress response", "Investment adviser / household sign-off before proceeds arrive", "high", "treasury"],
    ["Prop H status and implementation", "Official preliminary Yes result is reported as of the last update, but certification, enacted text, effective-rate schedule, exemptions, pass-throughs, and implementation remain a gate", "Check the certified result and official code / implementation documents before applying or pricing", "medium", "sfPropHResults"]
  ];
  return `
    ${pageHeader("Flagged for review", "Blank means unverified — not zero", "This page is intentionally prominent. These items block a defensible household recommendation but do not block the public site from explaining the process.")}
    <div class="callout danger"><div aria-hidden="true">!</div><div><strong>Do not fill these rows from memory</strong><p>Use written records, independent estimates, official current rules, and a dated decision note. Keep identifiers and source documents in a secure private copy.</p></div></div>
    <section class="section"><div class="table-wrap"><table><thead><tr><th>Flag</th><th>Missing information</th><th>Suggested discovery action</th><th>Priority</th><th>Official starting point</th></tr></thead><tbody>${items.map((item) => `<tr><td><strong>${item[0]}</strong><br>${statusChip("Unverified", "unverified")}</td><td>${item[1]}</td><td>${item[2]}</td><td>${statusChip(item[3], item[3])}</td><td>${sourceCell(item[4], "Review authority")}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="section"><div class="card soft-blue"><h3>Public-data exposure containment</h3><p>The initial repository contained only a README. The public site uses Property A / Property B labels, regional descriptions, normalized model units, blank household facts, and no exact addresses or postal identifiers. A private working file is ignored by Git and must never be copied into the Pages artifact.</p><p class="small">Before every release, search the repository for names, addresses, APNs, ZIP codes, phone numbers, emails, account numbers, trust IDs, and unrounded household figures.</p></div></section>`;
}

function setupModel() {
  const controls = document.querySelectorAll("#model-controls input, #model-controls select");
  if (!controls.length) return;
  const updateLabel = (id, text) => { const node = document.getElementById(id); if (node) node.textContent = text; };
  const sync = () => {
    const state = getModelState();
    updateLabel("out-transfer-year", String(state.transferYear));
    updateLabel("out-horizon", `${state.horizon} years`);
    updateLabel("out-property-growth", pct(state.propertyGrowth));
    updateLabel("out-equity-return", pct(state.equityReturn));
    updateLabel("out-treasury-yield", `${state.treasuryYield.toFixed(2)}%`);
    updateLabel("out-staging-months", `${state.stagingMonths} months`);
    updateLabel("out-sale-friction", pct(state.saleFriction));
    updateLabel("out-tax-drag", pct(state.taxDrag));
    updateLabel("out-rent-yield", pct(state.rentYield));
    updateLabel("out-imputed-rent", pct(state.imputedRent));
    updateLabel("out-holding-cost", pct(state.holdingCost));
    updateLabel("out-residence-exclusion", state.residenceExclusion === "eligible" ? "Eligible sensitivity on" : "Not modeled");
    updateLabel("out-high-income-surtax", state.highIncomeSurtax === "above" ? "1% switched on" : "Not modeled");
    updateLabel("out-prop-h-status", state.propHStatus === "enacted" ? "Enacted status selected; not priced" : (state.propHStatus === "preliminary" ? "Preliminary; not enacted" : "Not modeled"));
    updateLabel("out-stress", stressSpec(state.stress).label);
    updateLabel("model-transfer-label", String(state.transferYear));
    updateLabel("model-horizon-label", `${state.horizon} years`);
    updateLabel("model-state-label", `${stressSpec(state.stress).label} · ${state.stagingMonths} month stage`);
    const risk = document.getElementById("model-risk-board");
    const table = document.getElementById("model-table");
    const chart = document.getElementById("model-chart");
    const leader = document.getElementById("model-leader");
    if (risk) risk.innerHTML = modelRiskBoard(state);
    if (table) table.innerHTML = modelTable(state);
    if (chart) chart.innerHTML = modelChart(state);
    if (leader) leader.parentElement.innerHTML = illustrativeLeader(state);
  };
  controls.forEach((control) => control.addEventListener("input", sync));
  controls.forEach((control) => control.addEventListener("change", sync));
  sync();
}

function setupBriefing() {
  const print = document.getElementById("print-brief");
  if (print) print.addEventListener("click", () => window.print());
}

function renderPage() {
  renderShell();
  const current = document.body.dataset.page || "home";
  const pages = { home: homePage, model: modelPage, research: researchPage, timeline: timelinePage, briefing: briefingPage, glossary: glossaryPage, suggestions: suggestionsPage, flagged: flaggedPage };
  const renderer = pages[current] || homePage;
  document.querySelector("#app").innerHTML = renderer();
  document.title = `${pageNames[current] || pageNames.home} | Inheritance Decision Lab`;
  setupModel();
  setupBriefing();
}

document.addEventListener("DOMContentLoaded", renderPage);
