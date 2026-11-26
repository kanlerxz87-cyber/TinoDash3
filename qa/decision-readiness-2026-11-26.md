# Decision-readiness and privacy review

**Review date:** 2026-11-26 UTC  
**Scope:** Current checkout at `540e82c` and the current public decision-support pages. This is a repository/site review, not legal, tax, appraisal, investment, or insurance advice. No household-level input was used or reproduced.

## Executive summary

**The responsible decision today is “not ready to rank the household’s choices.”** The public site already provides the core decision framework: Property A (the future inheritance) is distinguished from Property B (already owned); the first screen identifies answer-changing facts; mixed and pure paths share horizons; projections are ranges across designed economic sequences; Black Swan staging displays reinvestment risk; and the site includes what-if controls, a process timeline, a question register, a printable professional brief, a glossary, flags, and a suggestions/decision log.

That is a useful decision-support product, but it cannot produce a household-specific “best plan” from the privacy-safe public inputs. The tax-rate area, written date-of-death appraisal, rent evidence, insurance quotes, capital plan, leases, debt, complete estate/gift history, and actual household goals remain private evidence gates. Do not treat normalized model outputs, assumed scenario returns, or current legal thresholds as a forecast for a transfer expected decades from now.

The current test suite passes, and the current-tree privacy scanner passes. **Neither result scrubs previously published Git objects, caches, forks, or other copies.** The historical-exposure incident remains open and requires an owner-authorized incident response. A separate wording inconsistency in the public privacy section and an overbroad interpretation of the automated source-link check are logged below for the owning sessions; this audit did not edit their files.

## What is already present in the current site

| Decision need | Current coverage | Review result |
| --- | --- | --- |
| Inherited asset versus already-owned asset | Landing-page distinction and path framing | Correctly separates the decision being made from the continuing Property B baseline. |
| “What would change the answer?” before projections | First screen and five evidence gates | Present and prominently framed as blocked pending evidence. |
| Pre-commitment before figures arrive | Written thresholds and private decision rules | Present; the completed thresholds should remain in the private workbook. |
| Pure and mixed options | Eight paths, including rent/sell/live mixtures and staged reinvestment | Present; user-specific legal/operating costs are not verified just by having path labels. |
| Same transfer date and horizon; controls | Range model with horizon, tax, cost, occupancy, imputed-rent and staging controls | Present as a generic model. A user should confirm each selected control is actually reflected in each path before using the output. |
| Black Swan and reinvestment risk | 1929/2008-style stress tests; Treasury staging comparison | Present as designed scenarios, not probabilities or a forecast. Current crash-depth evidence and modelled recovery durations are distinguished in the flag register. |
| Deadlines and transfer process | Timeline plus estate, title, assessment, sale and exchange steps | Present. Counsel must re-date every deadline from the actual event and applicable law. |
| Professional handoff | Printable attorney/CPA brief | Present; it is a briefing aid, not a substitute for review of private source documents. |
| Missing-information discovery | Questions and answers register with discovery routes | Present; unanswered facts are appropriately marked as private, missing or unverified rather than filled with guesses. |
| Change proposals | Review page has a suggestions register, status, rationale, risk, and decision log | Present; the register is a review gate, not evidence that a proposal has been approved. |
| Current-law monitoring | Official-source register and flagged items | Present as a dated snapshot. A 2040–2050 decision requires a fresh recheck; proposals must remain distinct from enacted law. |

## Decision gates that remain open

Collect the following in a separately controlled, encrypted workspace. Do **not** add completed household answers to this repository, a public issue, or the Pages site.

| Question to resolve | Honest answer from this checkout | How to discover it / who should supply it |
| --- | --- | --- |
| What is the date-of-death fair-market value and defensible income-tax basis? | Unknown; no property-specific valuation is published. | Obtain a qualified written appraisal as of the legally relevant valuation date; estate counsel and the CPA confirm basis records. IRS [Publication 559](https://www.irs.gov/pub/irs-pdf/p559.pdf) describes basis generally and exceptions. |
| Does the heir meet the applicable Prop. 19 family-home requirements, and will the home be occupied long term? | Unknown; no eligibility or future occupancy decision is assumed. | Have the assessor/counsel review the transfer, claimant, timing, principal-residence, filing, and continued-use facts. Start with the [California BOE Prop. 19 FAQ](https://boe.ca.gov/prop19/) and the [official county assessor portal](https://asr.santaclaracounty.gov/home); recheck the rules and indexed amount at transfer. |
| What is the actual assessed value and published tax rate for the inherited parcel? | Unknown; a postal area or old tax bill cannot establish the current tax-rate area or post-transfer assessment. | Obtain the parcel’s tax-rate-area identification and published rate from the assessor/tax collector, then verify local assessments and the roll. The [BOE property-tax publication](https://boe.ca.gov/pdf/pub800-10.pdf) explains general mechanics, not the parcel’s bill. |
| What would a sale in the inheritance tax year net after basis, costs, tax, debt, and transfer fees? | Unknown; no property-specific sale proceeds or tax result is claimed. | Ask the CPA to model the same-tax-year sale first using the valuation, trust/estate ownership facts, sale costs and then-current federal/California rules; obtain current official recorder fee schedules. |
| Does a living path qualify for Prop. 19 and/or the federal home-sale exclusion? | Unknown; eligibility depends on facts, dates, and the final use/ownership structure. | Counsel/CPA test the actual occupancy calendar and requirements. Review [IRS Publication 523](https://www.irs.gov/publications/p523), then recheck the current-year rules. Do not assume a short stay is enough for a long-term plan. |
| What are realistic rent, vacancy, management and tenant-law outcomes? | Unknown; no public market-rent estimate is used as a household fact. | Obtain at least two independent, written rent opinions and review current leases, permitted use, vacancy, local tenant protections and operating records with qualified local professionals. |
| What insurance can actually be bound, at what coverage and premium? | Unknown; no premium is verified or inserted. | Seek written quotes for each permitted occupancy and obtain a coverage/nonrenewal review from a licensed broker; consult the [California Department of Insurance](https://www.insurance.ca.gov/). An online average is not a bindable quote. |
| What maintenance, repair, and capital work is likely over five years? | Unknown; no property-specific plan or cost is verified. | Commission independent inspections and written trade bids; separate recurring maintenance, deferred repairs, and capital replacements. Do not extrapolate from a generic inflation rate without a project list. |
| What are depreciation, adjusted basis, and recapture after any rental period? | Unknown; depreciation history and rental start/use facts are private and absent. | CPA reconstructs basis, land/building allocation, depreciation allowed/allowable and sale treatment using actual records; see [IRS Publication 527](https://www.irs.gov/publications/p527) and [Publication 544](https://www.irs.gov/publications/p544). |
| What is the complete estate-tax and liquidity position? | Unknown; the home alone is insufficient and other assets, debt, gifts and prior portability are not in the public model. | Estate attorney/CPA inventory the taxable estate, adjusted taxable gifts, prior returns, portability election and cash needed for tax/administration; see [IRS Form 706 instructions](https://www.irs.gov/instructions/i706). Recheck the exclusion in the actual death year. |
| Is a like-kind exchange actually desired and available? | Unknown; no replacement property or investment intent is assumed. | Decide before a sale with a tax adviser and qualified intermediary; test whether the asset/use qualifies and whether the timing and replacement property are workable. See [IRS Publication 544](https://www.irs.gov/publications/p544). |
| What investment allocation, liquidity reserve, staging duration, and failure rule are acceptable? | No household policy has been supplied; the public model uses normalized, illustrative assumptions. | Write and approve an investment policy before proceeds exist: target allocation, reserve, staging schedule, rebalancing, cash-yield/reinvestment rule, tax location, and conditions to pause or change the plan. Re-run immediate-entry and staged paths under multiple rates and crash sequences. |
| What would make the household choose each path? | Not known from this public checkout. | Before any updated figures are shared, beneficiaries write their objectives, constraints, decision thresholds, tie-breaker, and default path; date and retain it privately. This prevents reverse-engineering the rule to fit a preferred projection. |

## Findings and requested corrections

### P0 — Historical exposure is not contained by a clean current tree

The coordination record describes prior public exposure in reachable Git history and open copies/caches. A current-tree deletion, passing scanner, new commit, or site update does not make old commits disappear. This session did not rewrite Git history or claim the incident is resolved. The repository owner/privacy counsel should decide whether to coordinate a controlled history rewrite or move to a clean repository, then address GitHub Pages artifacts, forks, caches, clones, and known copies. Preserve a private incident record; do not reproduce the removed values in the remediation itself. Track this under existing T-003.

### P1 — Privacy wording in `review.html` is internally inconsistent

At `review.html` lines 177–187, the heading says nothing identifying is published, and Rule 1 says no identifying details appear “anywhere in the published pages, the repository, or this build’s notes.” The same page later acknowledges identifiers remain in historical commit blobs. Taken literally, the Rule 1 statement is false. The owner of the existing review-page scope should change the wording to distinguish the **current checkout/current deployed pages** from the unresolved public-history incident, and keep the open incident highly visible. This audit did not edit `review.html` because it is owned by another coordination task.

### P1 — The static checker does not establish official-source quality

`scripts/check-site.mjs` verifies that each marked source-table row contains an anchor; it treats every `http(s)` link as external and skips it. Therefore a passing `npm test` does **not** prove that every row links to an official authority, that a link still resolves, that the linked text supports the claim, or that proposals are labelled correctly. The user’s row-by-row authority requirement still needs human claim-to-source review. Request the owner of the checker scope to add a clear distinction between (a) official authority, (b) documented discovery method/primary evidence required, and (c) explicitly unverified rows; do not award “verified” status merely for link presence.

### P2 — Household ranking remains blocked by private evidence

The current site’s public data intentionally withholds individual property amounts and operational records. This is the right privacy posture, but it means there is no evidence-based answer yet to “live, rent, sell, or mix?” The generic scenarios can show sensitivity and trade-offs, not determine which path is most profitable for this household. In particular, market rent, insurance, utilities, current occupancy/leases, tax-rate area, capital costs, date-of-death valuation, basis/depreciation, debt and whole-estate figures must not be filled from online averages or inferred from the private description.

## Recommended sequence (no public input required)

1. **Contain and govern privacy:** keep all case evidence out of the repository; ask the owner/privacy counsel to resolve T-003 and correct the contradictory privacy wording.
2. **Pre-commit:** privately sign a dated decision charter with goals, path-specific triggers, acceptable liquidity/occupancy, default action, and tie-break rules before new projections are shown.
3. **Build the evidence file:** obtain the written valuation, title/trust records, tax-rate-area/rate, lease review, rent opinions, insurance quotes, inspection/capital plan, utility tariffs, debt schedule, basis/depreciation records, complete estate/gift/portability inventory, and sale-cost schedule.
4. **Have professionals separate the tax systems:** estate tax/liquidity; income-tax basis and gain/recapture; and property-tax assessment/Prop. 19 are separate workpapers. Test the sale in the inheritance year before evaluating later sale dates.
5. **Rebuild privately:** apply the evidence and the law in force for the event year; compare all paths on identical dates/horizons, then run sensitivities and adverse scenarios. Log the date, source, changed input, changed ranking, and reason for every update.
6. **Annual refresh:** recheck official federal, state, and local authorities, record enacted law separately from proposals, and repeat the sensitivity review. Treat every 2040–2050 legal projection as conditional.

## Verification performed in this session

- `npm test` passed on the reviewed tree: privacy scan of 33 text files, static checks for 16 HTML pages, and 23 engine/render/figure test cases. The figure suite explicitly skipped checks requiring gitignored private inputs.
- Read the landing page, questions register, review/privacy page, flagged register, and the static checker to confirm what the automated checks actually cover.
- Cross-checked the public-page claims against the project’s dated official-source register and citations; this report does not independently re-verify every law or external page as of the transfer year.
- The current checkout passes automated privacy patterns; the scan explicitly warns that patterns are incomplete. It does not cure or independently attest to the historical exposure, external caches, forks, or copies.

## Authority links for manual review

- [IRS Publication 559 — Survivors, Executors, and Administrators](https://www.irs.gov/pub/irs-pdf/p559.pdf)
- [IRS Form 706 instructions](https://www.irs.gov/instructions/i706)
- [IRS Publication 523 — Selling Your Home](https://www.irs.gov/publications/p523)
- [IRS Publication 544 — Sales and Other Dispositions of Assets](https://www.irs.gov/publications/p544)
- [California BOE Prop. 19 FAQ](https://boe.ca.gov/prop19/)
- [California BOE Publication 800-10](https://boe.ca.gov/pdf/pub800-10.pdf)
- [California Department of Insurance](https://www.insurance.ca.gov/)
- [U.S. Treasury daily Treasury par yield curve](https://home.treasury.gov/resource-center/data-chart-center/interest-rates)
- [Federal Reserve History — 1929 stock market crash](https://www.federalreservehistory.org/essays/stock-market-crash-of-1929)
- [Federal Reserve History — Great Recession](https://www.federalreservehistory.org/essays/great-recession-of-200709)
