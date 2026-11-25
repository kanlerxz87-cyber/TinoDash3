// Pre-committed decision rules.
// Written and committed on 2026-11-25 BEFORE any model output for this project was generated.
// Changing a threshold later requires a dated entry in the decision log (see decision-rules.html),
// stating the reason and the owner who approved it. Thresholds are NOT tuned to any projection.

export const RULES_WRITTEN = "2026-11-25";
export const RULES_STATUS = "Pre-committed; no model output existed when these thresholds were written.";

export const rules = [
  {
    id: "R0",
    title: "Evidence gate — no recommendation while gating facts are open",
    rule: "No path is recommended until each gating item is verified from primary records: (a) a written date-of-death valuation of Property A; (b) the Property A tax-rate area and current bill read from the Santa Clara County Assessor; (c) the heir's Prop. 19 facts (intent and ability to occupy as principal residence, and the one-year claim); (d) whole-estate value and the portability position; (e) written insurance quotes for both properties; (f) Property B lease, rent-registration and Prop. H status.",
    outcome_if_unmet: "HOLD — collect evidence. The model may be run, but its output is labelled 'not decidable'.",
    thresholds: "All six items verified; any single open item blocks ranking.",
    sources: ["S-SCC-ASSESSOR", "S-BOE-PROP19", "S-IRS-FAQ-ESTATE", "S-SF-PROP-H"]
  },
  {
    id: "R1",
    title: "Living paths need documented Prop. 19 facts",
    rule: "Living-based paths (Live 2 years then sell; Live long term) are ranked only if the heir can document a plan to make Property A the principal residence within one year and to file the claim within the BOE deadlines. Without that documentation the living paths keep full reassessment and are shown as 'excluded from ranking'.",
    outcome_if_unmet: "Living paths excluded from ranking.",
    thresholds: "Documented facts for all three conditions (occupancy plan, one-year move-in, claim filing).",
    sources: ["S-BOE-PROP19", "S-BOE-LTA-2025-009"]
  },
  {
    id: "R2",
    title: "Rental paths need a written market rent",
    rule: "Hold-as-rental is ranked only when an independent written market-rent estimate for Property A (comparable rentals, adjusted for condition) exists. Until then it is a floor. Rental property does not qualify for Prop. 19 parent-child treatment, so the rental path is modeled with full reassessment.",
    outcome_if_unmet: "Rental path shown as a floor with the break-even net rent it would need to match the sell path.",
    thresholds: "Independent rent estimate on file.",
    sources: ["S-BOE-PROP19"]
  },
  {
    id: "R3",
    title: "Sell-now versus staged investing (black-swan test)",
    rule: "Choose staged investing (3M–2Y Treasuries for 24–36 months, then phase into equities) over an immediate lump-sum equity investment if BOTH hold: (i) in the base case the 10-year real wealth difference (staged minus lump) is no worse than −10% of net proceeds; and (ii) in the crash test (a 2008-type or 1929-type equity fall beginning at the transfer date) the 10-year real difference (staged minus lump) is at least +5% of net proceeds. Choose lump-sum if the base-case advantage of lump-sum over staged is at least 5% of net proceeds. Otherwise record 'no clear winner' and decide on liquidity and owner tolerance, documented in writing.",
    outcome_if_unmet: "No clear winner; decide on documented liquidity needs.",
    thresholds: "Base case: staged ≥ lump − 10% of proceeds. Crash: staged − lump ≥ +5% of proceeds. Lump-sum preferred when lump − staged ≥ 5% of proceeds in base case.",
    sources: ["S-TREAS-YIELD", "S-FED-1929", "S-FED-GREAT-RECESSION"]
  },
  {
    id: "R4",
    title: "Sell versus living: break-even imputed rent",
    rule: "Sell is preferred over living in Property A when the monthly imputed rent the heir could earn elsewhere (what-if input) is below the break-even rent computed by the model over 10 years, AND an independent market-rent estimate confirms that the heir's avoided housing cost is at or above that break-even. If no rent evidence exists, sell-versus-live is 'not yet decidable'.",
    outcome_if_unmet: "Not yet decidable.",
    thresholds: "Independent rent evidence on file; comparison at the 10-year horizon in the base case.",
    sources: ["S-BOE-PROP19"]
  },
  {
    id: "R5",
    title: "Mixed path needs a clear §121 and Prop. 19 benefit",
    rule: "Live 2 years then sell, then stage, is preferred to a pure sell only if the two-year occupancy adds at least 3% of net proceeds to 10-year real wealth in the base case AND Prop. 19 status is verified. If Prop. 19 is not verified, the mixed path is shown but not preferred.",
    outcome_if_unmet: "Pure sell path stands; mixed path shown for information.",
    thresholds: "≥ +3% of proceeds, base case, 10-year horizon.",
    sources: ["S-IRS-TC701", "S-BOE-PROP19"]
  },
  {
    id: "R6",
    title: "Estate-level exposure overrides path ranking",
    rule: "If the projected gross estate in the transfer year exceeds 90% of the federal basic exclusion amount for that year (2027 published: $15,480,000; later years indexed, unverified), the estate liquidity plan, the portability election and gift-history review are completed first. The path ranking is then secondary.",
    outcome_if_unmet: "Estate tasks first.",
    thresholds: "Gross estate > 90% of the indexed basic exclusion in the transfer year.",
    sources: ["S-IRS-IR-2026-133", "S-IRS-FAQ-ESTATE"]
  },
  {
    id: "R7",
    title: "High entry-risk flag",
    rule: "Any path whose 5-year real loss in a 2008-type crash starting at transfer exceeds 40% of net proceeds is labelled 'high entry risk'. The flag does not change the ranking by itself but requires written owner sign-off before implementation.",
    outcome_if_unmet: "Owner sign-off required.",
    thresholds: "5-year real loss > 40% of net proceeds.",
    sources: ["S-FED-GREAT-RECESSION"]
  },
  {
    id: "R8",
    title: "Law changes count only after enactment",
    rule: "A proposed or pending law changes a ranking only after it is enacted and effective. Proposals appear as sensitivity cases, not in the base case. Status is re-checked at least annually and before any irreversible step.",
    outcome_if_unmet: "Base case unchanged; sensitivity shown.",
    thresholds: "Enacted and effective.",
    sources: ["S-LEG-AB942", "S-CALMATTERS-P40"]
  },
  {
    id: "R9",
    title: "Rerun and record",
    rule: "After every verified input change the model is rebuilt and the site regenerated. If the recommendation changes, the decision log records the date, the input that changed, and the reason. The recommendation is never changed by editing an assumption to fit a preferred outcome; assumption changes are logged separately from fact changes.",
    outcome_if_unmet: "Change is not accepted.",
    thresholds: "Dated log entry for every change.",
    sources: []
  }
];
