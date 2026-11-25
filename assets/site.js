(() => {
  const page = document.body.dataset.page || "home";
  const pages = {
    home: "index.html",
    process: "process.html",
    paths: "paths.html",
    questions: "questions.html",
    brief: "brief.html",
    sources: "sources.html",
    review: "review.html"
  };

  const isCurrent = (key) => page === key ? " current" : "";
  const header = `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${pages.home}" aria-label="Inheritance Decision Desk home">
          <span class="brand-mark" aria-hidden="true">◇</span><span>Inheritance Decision Desk</span>
        </a>
        <div class="header-actions">
          <nav class="nav" aria-label="Primary navigation">
            <a class="${isCurrent("home")}" href="${pages.home}">Overview</a>
            <div class="nav-group">
              <button type="button" aria-expanded="false">Decision work <span aria-hidden="true">⌄</span></button>
              <div class="nav-panel">
                <small>Compare before deciding</small>
                <a class="${isCurrent("paths")}" href="${pages.paths}">Paths &amp; stress tests</a>
                <a class="${isCurrent("process")}" href="${pages.process}">Transfer timeline &amp; tax map</a>
                <a class="${isCurrent("questions")}" href="${pages.questions}">Questions &amp; private inventory</a>
              </div>
            </div>
            <div class="nav-group">
              <button type="button" aria-expanded="false">Review &amp; export <span aria-hidden="true">⌄</span></button>
              <div class="nav-panel">
                <small>Professional review</small>
                <a class="${isCurrent("brief")}" href="${pages.brief}">Attorney &amp; CPA brief</a>
                <a class="${isCurrent("sources")}" href="${pages.sources}">Sources &amp; law monitor</a>
                <a class="${isCurrent("review")}" href="${pages.review}">Flags &amp; suggestions</a>
              </div>
            </div>
          </nav>
          <button class="button subtle" type="button" data-open-glossary>Glossary</button>
          <button class="menu-button" type="button" data-menu-toggle aria-expanded="false">Menu</button>
        </div>
      </div>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <div class="footer-title">Private by design</div>
          <p>This public site deliberately contains no address, name, parcel number, exact tax bill, lease, account, or household balance. It uses Property A (inherited home) and Property B (already-owned multi-unit home).</p>
        </div>
        <div>
          <div class="footer-title">Decision boundary</div>
          <p>Educational decision support, not legal, tax, investment, appraisal, insurance, or tenancy advice. Do not act until the missing facts and current rules are reviewed with licensed professionals.</p>
        </div>
        <div>
          <div class="footer-title">Build snapshot</div>
          <p>Official-source review snapshot: 25 Nov 2026. Recheck before every irreversible action and at least annually.</p>
          <p><a href="sources.html">Source registry &amp; status</a></p>
        </div>
      </div>
    </footer>`;

  const glossary = `
    <div class="dialog-backdrop" data-glossary-backdrop></div>
    <aside class="glossary-dialog" aria-modal="true" role="dialog" aria-labelledby="glossary-title" data-glossary-dialog>
      <div class="dialog-top"><h2 id="glossary-title">Plain-language glossary</h2><button class="dialog-close" type="button" data-close-glossary>Close</button></div>
      <dl>
        <dt>Basis</dt><dd>The tax starting value used to calculate gain or loss. For inherited property it is generally date-of-death fair market value, subject to exceptions and estate-tax elections.</dd>
        <dt>Factored base year value (FBYV)</dt><dd>California’s assessed-value track after annual inflation adjustments; it is not the same as market value or federal income-tax basis.</dd>
        <dt>Prop 19 exclusion</dt><dd>A California reassessment exclusion with strict family-home, occupancy, filing, and value-limit conditions. It is not an automatic inheritance benefit.</dd>
        <dt>Imputed rent</dt><dd>The estimated housing value of living in a home instead of paying rent elsewhere. It is a decision comparison item, not cash income.</dd>
        <dt>Recapture</dt><dd>Tax treatment that can apply to prior depreciation when rental or business property is sold. A CPA must calculate it from records.</dd>
        <dt>Reinvestment risk</dt><dd>The risk that proceeds parked in short-term instruments must be reinvested at future yields that may be lower or higher than today’s yield.</dd>
        <dt>Tax rate area (TRA)</dt><dd>A local geography that determines the combination of property-tax rates. A postal area alone is not enough to identify a TRA.</dd>
        <dt>DSUE / portability</dt><dd>Deceased Spousal Unused Exclusion. A federal estate-tax election may transfer unused exclusion to a surviving spouse if filing rules are met.</dd>
      </dl>
      <p class="disclosure">Definitions are simplified. Open the <a href="sources.html">source registry</a> for authorities and review facts with counsel.</p>
    </aside>`;

  const headerSlot = document.querySelector("[data-site-header]");
  const footerSlot = document.querySelector("[data-site-footer]");
  if (headerSlot) headerSlot.innerHTML = header;
  if (footerSlot) footerSlot.innerHTML = footer;
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

  const todaySlots = document.querySelectorAll("[data-build-date]");
  todaySlots.forEach((node) => { node.textContent = "25 Nov 2026"; });
})();
