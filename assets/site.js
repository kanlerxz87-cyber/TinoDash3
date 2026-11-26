(() => {
  const page = document.body.dataset.page || "home";
  const pages = {
    home: "index.html",
    paths: "paths.html",
    assumptions: "assumptions.html",
    process: "process.html",
    questions: "questions.html",
    sources: "sources.html",
    glossary: "glossary.html",
    review: "review.html",
    brief: "brief.html",
    figures: "figures.html",
    blackswan: "blackswan.html",
    flagged: "flagged.html",
    verification: "verification.html",
    "decision-rules": "decision-rules.html",
    requests: "requests.html"
  };

  const current = (key) => (page === key ? " current" : "");

  const header = `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${pages.home}" aria-label="Inheritance Decision Desk home">
          <span class="brand-mark" aria-hidden="true">◇</span><span>Inheritance Decision Desk</span>
        </a>
        <div class="header-actions">
          <nav class="nav" aria-label="Primary navigation">
            <a class="${current("home")}" href="${pages.home}">Overview</a>
            <div class="nav-group">
              <button type="button" aria-expanded="false">Model <span aria-hidden="true">⌄</span></button>
              <div class="nav-panel">
                <small>Numbers &amp; what moves them</small>
                <a class="${current("paths")}" href="${pages.paths}">Paths, ranges &amp; crash tests</a>
                <a class="${current("blackswan")}" href="${pages.blackswan}">Black Swan staging</a>
                <a class="${current("assumptions")}" href="${pages.assumptions}">Assumptions register</a>
                <a class="${current("process")}" href="${pages.process}">Tax &amp; transaction math</a>
                <a class="${current("figures")}" href="${pages.figures}">Figures &amp; thresholds</a>
              </div>
            </div>
            <div class="nav-group">
              <button type="button" aria-expanded="false">Evidence <span aria-hidden="true">⌄</span></button>
              <div class="nav-panel">
                <small>What is still missing</small>
                <a class="${current("questions")}" href="${pages.questions}">Questions &amp; gates</a>
                <a class="${current("process")}" href="${pages.process}#timeline">Step-by-step &amp; deadlines</a>
                <a class="${current("review")}" href="${pages.review}">Flags &amp; suggestions</a>
                <a class="${current("flagged")}" href="${pages.flagged}">Flagged for review</a>
                <a class="${current("requests")}" href="${pages.requests}">Recheck &amp; request tracker</a>
                <a href="${pages.questions}#inventory">Private inventory</a>
              </div>
            </div>
            <div class="nav-group">
              <button type="button" aria-expanded="false">Reference <span aria-hidden="true">⌄</span></button>
              <div class="nav-panel">
                <small>Check it, do not trust it</small>
                <a class="${current("sources")}" href="${pages.sources}">Sources &amp; law monitor</a>
                <a class="${current("verification")}" href="${pages.verification}">Verification register</a>
                <a class="${current("decision-rules")}" href="${pages["decision-rules"]}">Pre-committed decision rules</a>
                <a class="${current("glossary")}" href="${pages.glossary}">Glossary</a>
                <a class="${current("review")}" href="${pages.review}">Flags &amp; suggestions</a>
              </div>
            </div>
            <a class="${current("brief")}" href="${pages.brief}">Brief</a>
          </nav>
          <button class="button subtle no-print" type="button" data-open-glossary>Glossary</button>
          <button class="menu-button" type="button" data-menu-toggle aria-expanded="false">Menu</button>
        </div>
      </div>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <div class="footer-title">Private by design</div>
          <p>This public site contains no address, name, parcel number, tax bill, lease, account balance or utility account. It publishes rates, formulas and normalised results only. Exact figures belong in an encrypted private workbook.</p>
        </div>
        <div>
          <div class="footer-title">Decision boundary</div>
          <p>Educational decision support. Not legal, tax, investment, appraisal, insurance or tenancy advice. No path should be executed until the missing facts and current rules have been reviewed with licensed professionals.</p>
        </div>
        <div>
          <div class="footer-title">Snapshot</div>
          <p>Official-source review: 25 Nov 2026. Recheck before every irreversible action and at least annually.</p>
          <p><a href="${pages.sources}">Source register</a> · <a href="${pages.assumptions}">Assumption register</a></p>
        </div>
      </div>
    </footer>`;

  const glossary = `
    <div class="dialog-backdrop" data-glossary-backdrop></div>
    <aside class="glossary-dialog" aria-modal="true" role="dialog" aria-labelledby="glossary-dialog-title" data-glossary-dialog>
      <div class="dialog-top"><h2 id="glossary-dialog-title">Quick glossary</h2><button class="dialog-close" type="button" data-close-glossary>Close</button></div>
      <dl>
        <dt>Basis</dt><dd>The tax starting value for measuring gain. For inherited property it is generally date-of-death fair market value, with exceptions and elections.</dd>
        <dt>Factored base year value (FBYV)</dt><dd>California's assessed value after annual inflation adjustments, capped at 2% per year. It is not market value and not income-tax basis.</dd>
        <dt>Prop. 19 exclusion</dt><dd>A California reassessment exclusion for an eligible family home, with occupancy, exemption-filing and value-limit conditions.</dd>
        <dt>Imputed rent</dt><dd>The housing value of living in a home instead of paying rent elsewhere. It is a comparison item, not cash income.</dd>
        <dt>Recapture</dt><dd>Tax on previously claimed depreciation when rental property is sold, generally at a capped rate.</dd>
        <dt>Reinvestment risk</dt><dd>The risk that cash parked in short instruments must be reinvested later at an unknown yield.</dd>
        <dt>Sequence risk</dt><dd>The risk that the order of returns, not the average, determines the outcome.</dd>
        <dt>Tax rate area (TRA)</dt><dd>A local geography that fixes the property-tax rate. A postal code does not identify one.</dd>
        <dt>DSUE / portability</dt><dd>Deceased spousal unused exclusion: a federal election that can pass unused exclusion to a surviving spouse.</dd>
      </dl>
      <p class="disclosure">Simplified definitions. See the <a href="${pages.glossary}">full glossary</a> and the <a href="${pages.sources}">source register</a>.</p>
    </aside>`;

  document.querySelector("[data-site-header]")?.insertAdjacentHTML("afterbegin", header);
  document.querySelector("[data-site-footer]")?.insertAdjacentHTML("afterbegin", footer);
  document.body.insertAdjacentHTML("beforeend", glossary);

  const nav = document.querySelector(".nav");
  const menuButton = document.querySelector("[data-menu-toggle]");
  menuButton?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav-group > button").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".nav-group");
      const isOpen = group.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  const dialog = document.querySelector("[data-glossary-dialog]");
  const backdrop = document.querySelector("[data-glossary-backdrop]");
  const openGlossary = () => {
    dialog.classList.add("open");
    backdrop.classList.add("open");
    document.querySelector("[data-close-glossary]")?.focus();
  };
  const closeGlossary = () => {
    dialog.classList.remove("open");
    backdrop.classList.remove("open");
  };
  document.querySelectorAll("[data-open-glossary]").forEach((button) => button.addEventListener("click", openGlossary));
  document.querySelector("[data-close-glossary]")?.addEventListener("click", closeGlossary);
  backdrop?.addEventListener("click", closeGlossary);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeGlossary(); });

  document.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", () => window.print()));

  document.querySelectorAll("[data-build-date]").forEach((node) => { node.textContent = "25 Nov 2026"; });
})();
