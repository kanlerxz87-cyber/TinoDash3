// Privacy-First Data Store: All figures rounded to nearest $10; no PII, no addresses, no APNs.
window.DASH_DATA = {
  propertyA: {
    label: "Property A (Cupertino, CA 95014 — Inherited via Trust)",
    estimatedValue2026: 3100000,
    waterMonthlyRange: [100, 150],
    electricMonthlyRange: [-20, -10], // Solar net credit
    insuranceAnnualEstimate: 1660, // Rounded CDI CA avg benchmark ($1,655 -> $1,660); unverified quote
    maintenanceAnnualEstimate: 6200,
    history: [
      { year: 2026, tax: null, assessed: 550540, note: "2026 tax bill pending; +2% Prop 13" },
      { year: 2025, tax: 7210, assessed: 539740, note: "+2.9% tax / +2% assessed" },
      { year: 2024, tax: 7000, assessed: 529160, note: "+1.2% tax / +2% assessed" },
      { year: 2023, tax: 6920, assessed: 518790, note: "+2.4% tax / +2% assessed" },
      { year: 2022, tax: 6760, assessed: 508610, note: "+1.4% tax / +2% assessed" },
      { year: 2021, tax: 6660, assessed: 498640, note: "+1.5% tax / +1% assessed" },
      { year: 2020, tax: 6570, assessed: 493530, note: "+2% assessed" },
      { year: 2019, tax: 6570, assessed: 483850, note: "+2.8% tax / +2% assessed" },
      { year: 2018, tax: 6380, assessed: 474370, note: "+2% assessed" },
      { year: 2017, tax: 6380, assessed: 465070, note: "-0.5% tax / +2% assessed" },
      { year: 2016, tax: 6410, assessed: 455950, note: "+4.6% tax / +1.5% assessed" },
      { year: 2015, tax: 6130, assessed: 449100, note: "+2.8% tax / +2% assessed" },
      { year: 2014, tax: 5970, assessed: 440310, note: "+0.5% assessed" }
    ]
  },
  propertyB: {
    label: "Property B (San Francisco, CA 94122 — Currently Owned 3-Unit)",
    estimatedValue2026: 1800000,
    rentedUnits: 2,
    vacantOwnerUnits: 1,
    monthlyRentIncome: 7150,
    waterMonthlyRange: [330, 400],
    electricMonthlyRange: [30, 70],
    insuranceAnnualEstimate: 2400, // 3-unit rental/owner-occ placeholder; flagged for quote
    maintenanceAnnualEstimate: 9500,
    history: [
      { year: 2025, tax: 2440, assessed: 114250, note: "+5.3% tax / +2% assessed" },
      { year: 2024, tax: 2320, assessed: 112010, note: "+6.2% tax / +2% assessed" },
      { year: 2023, tax: 2180, assessed: 109810, note: "+3.4% tax / +2% assessed" },
      { year: 2022, tax: 2110, assessed: 107660, note: "+2% tax / +2% assessed" },
      { year: 2021, tax: 2070, assessed: 105600, note: "-5.9% tax / +1% assessed" },
      { year: 2020, tax: 2200, assessed: 104510, note: "+3% tax / +2% assessed" },
      { year: 2019, tax: 2130, assessed: 102470, note: "+3.5% tax / +2% assessed" },
      { year: 2018, tax: 2060, assessed: 100460, note: "+18.4% tax / +2% assessed" },
      { year: 2017, tax: 1740, assessed: 98490, note: "+3.9% tax / +2% assessed" },
      { year: 2016, tax: 1680, assessed: 96560, note: "+1.6% tax / +1.5% assessed" }
    ]
  },
  verifiedRules: [
    {
      topic: "Federal Estate Tax Basic Exclusion (2026)",
      value: "$15,000,000 per individual ($5,945,800 credit)",
      impact: "Estates below $15M owe $0 federal estate tax; portability (DSUE) requires timely Form 706.",
      status: "Verified",
      sourceLabel: "IRS Form 706 Instructions (2026)",
      sourceUrl: "https://www.irs.gov/instructions/i706"
    },
    {
      topic: "CA Proposition 19 Parent-Child Exclusion",
      value: "FBYV + $1,000,000 cap (principal residence required)",
      impact: "Heir must move in within 1 year and file Homeowners' Exemption; moving out triggers reassessment.",
      status: "Verified",
      sourceLabel: "CA Board of Equalization — Prop 19",
      sourceUrl: "https://www.boe.ca.gov/prop19/"
    },
    {
      topic: "CA Form 540 Capital Gains & 1% MHST",
      value: "Ordinary income rates + 1% Mental Health Services Tax > $1,000,000",
      impact: "No preferential CA capital gains rate; top combined CA rate is 14.3% above $1M taxable income.",
      status: "Verified",
      sourceLabel: "CA FTB Form 540 Booklet",
      sourceUrl: "https://www.ftb.ca.gov/forms/2022/2022-540-booklet.html"
    },
    {
      topic: "Federal IRC §121 Primary Residence Exclusion",
      value: "$250,000 Single / $500,000 Married Filing Jointly",
      impact: "Applies if heir lives in Property A as principal residence for 2 of last 5 years before selling.",
      status: "Verified",
      sourceLabel: "IRS Publication 523",
      sourceUrl: "https://www.irs.gov/pub/irs-pdf/p523.pdf"
    },
    {
      topic: "San Francisco Secured Property Tax Rate (FY 2026-27)",
      value: "1.18162182%",
      impact: "Applied to Property B's Prop 13 assessed value (~$114,250 in 2025).",
      status: "Verified",
      sourceLabel: "SF Treasurer & Tax Collector",
      sourceUrl: "https://sftreasurer.org/property/secured-property-taxes"
    },
    {
      topic: "San Francisco Real Property Transfer Tax",
      value: "$3.75 per $500 ($1M–$5M); $11.25 per $500 ($5M–$10M)",
      impact: "Applies if Property B is ever sold; 0.75% for $1M–$5M tier.",
      status: "Verified",
      sourceLabel: "SF Assessor-Recorder",
      sourceUrl: "https://www.sfassessor.org/recorder-information/recording-document/transfer-tax"
    },
    {
      topic: "Santa Clara County Documentary Transfer Tax",
      value: "$0.55 per $500 (County) — Cupertino has no separate city transfer tax",
      impact: "0.11% transfer tax on Property A sale (much lower than SF).",
      status: "Verified",
      sourceLabel: "Santa Clara County Clerk-Recorder",
      sourceUrl: "https://clerkrecorder.santaclaracounty.gov/recording-documents/recording-real-estate"
    },
    {
      topic: "SF Rent Board Fee & Owner-Occupied Exemption",
      value: "$59.00 per dwelling unit (2025-26); owner-occupied unit exempt",
      impact: "Must file exemption annually; OMI evictions carry 36-month occupancy & relocation rules.",
      status: "Verified",
      sourceLabel: "SF Rent Board",
      sourceUrl: "https://www.sf.gov/rent-board-fee-link"
    },
    {
      topic: "California Average Homeowners Insurance Premium",
      value: "$1,655/yr CA average ($1,737/yr US)",
      impact: "Baseline benchmark only; actual 95014/94122 replacement-cost quotes may be higher.",
      status: "Verified (Benchmark)",
      sourceLabel: "CA Dept. of Insurance",
      sourceUrl: "https://www.insurance.ca.gov/01-consumers/180-climate-change/sustainable-insurance-strategy.Cfm"
    }
  ],
  flaggedItems: [
    {
      item: "Property A Exact Tax Rate Area (TRA) & Parcel Assessments",
      reason: "2025 tax ($7,210) / assessed ($539,740) implies ~1.336% effective rate including local bonds, but exact TRA schedule needs verification.",
      action: "Look up Property A's TRA on Santa Clara County Assessor Tax Rate Book.",
      sourceUrl: "https://files.santaclaracounty.gov/exjcpb1531/migrated/Tax_Rate_Book_2023-2024_11.20.23_0.pdf"
    },
    {
      item: "2040–2050 Federal Estate Tax & Prop 19 Legislative Uncertainty",
      reason: "Tax laws between 2026 and 2040–2050 may change (e.g., estate exemption sunset, Prop 19 repeal/modification, CA wealth/transfer tax proposals).",
      action: "Re-run model annually and track enacted vs. proposed legislation.",
      sourceUrl: "https://www.irs.gov/instructions/i706"
    },
    {
      item: "Actual Insurance Quotes for 95014 (Primary) & 94122 (3-Unit Rental)",
      reason: "User-provided $1,500 estimates are unverified; CA FAIR Plan or admitted carrier quotes for $3.1M / $1.8M rebuild values may differ.",
      action: "Obtain written binder quotes from 2+ admitted carriers.",
      sourceUrl: "https://www.insurance.ca.gov/01-consumers/180-climate-change/sustainable-insurance-strategy.Cfm"
    },
    {
      item: "Cupertino (95014) Market Rent Comparables",
      reason: "Rent path currently uses estimated range ($6,500–$8,500/mo); needs 3+ local single-family comps.",
      action: "Obtain independent rental comps or property manager assessment.",
      sourceUrl: "https://www.boe.ca.gov/prop19/"
    }
  ],
  timeline: [
    { when: "Pre-Inheritance (Now – 2040)", title: "Estate & Trust Prep", detail: "Confirm revocable living trust terms, portability/prior taxable gifts, and 5-year CapEx plan for Property A & B." },
    { when: "Date of Death (Day 0)", title: "Step-Up in Basis Valuation", detail: "Order qualified written appraisal of Property A at Date of Death (IRC §1014) to establish stepped-up tax basis." },
    { when: "Within 9 Months", title: "IRS Form 706 (if applicable)", detail: "File Form 706 if gross estate exceeds federal exclusion OR to elect portability (DSUE) for surviving spouse." },
    { when: "Within 1 Year", title: "Prop 19 Occupancy & Exemption", detail: "If keeping Property A as primary residence, move in within 1 year and file Homeowners' Exemption with Santa Clara County." },
    { when: "45 / 180 Days (if 1031)", title: "1031 Exchange Deadlines", detail: "If selling Property A after holding as rental and exchanging, identify replacement property within 45 days and close within 180 days." },
    { when: "24–36 Months (Phased)", title: "Treasury-to-Equity Staging", detail: "If selling Property A, optionally park proceeds in 3M–2Y Treasuries for 24–36 months while phasing into equities." }
  ],
  questions: [
    { q: "What is the exact total estate size (Property A + liquid/investment assets) relative to the $15M federal exclusion?", discovery: "Build private estate inventory with CPA; check prior taxable gifts." },
    { q: "Is the heir willing to live in Property A (Cupertino) as a primary residence for 1+ years to qualify for Prop 19?", discovery: "Household pre-commitment agreement before transfer." },
    { q: "What are the current lease terms, rent-control status, and tenant occupancy of Property B's 2 rented units?", discovery: "Review leases and SF Rent Board registration." },
    { q: "What is the 5-year CapEx/maintenance forecast (roof, foundation, seismic, solar inverter) for both properties?", discovery: "Obtain licensed contractor inspection." }
  ],
  suggestions: [
    { id: "S1", title: "Add Monte Carlo / Distribution Chart", status: "Implemented", detail: "Added range-based 10th/50th/90th percentile wealth distribution chart." },
    { id: "S2", title: "Add Phased-Investing Black Swan Path", status: "Implemented", detail: "Tests 24–36 month 3M–2Y Treasury staging during 1929/2008 crashes with reinvestment risk callout." },
    { id: "S3", title: "Add One-Page Printable Attorney & CPA Brief", status: "Implemented", detail: "Dedicated print-ready briefing sheet with @media print styling." },
    { id: "S4", title: "Add Live Santa Clara TRA Lookup", status: "Proposed (Review)", detail: "Link directly to parcel TRA once user looks it up privately." }
  ],
  glossary: [
    { term: "Step-Up in Basis (IRC §1014)", def: "Resets the inherited property's cost basis to Fair Market Value at Date of Death, eliminating decades of unrealized capital gains if sold soon after." },
    { term: "FBYV (Factored Base Year Value)", def: "Prop 13 assessed value adjusted annually by up to 2% inflation." },
    { term: "Prop 19 Exclusion Cap", def: "Allows parent-child transfer without full reassessment up to FBYV + $1,000,000, ONLY if the child makes it their principal residence within 1 year." },
    { term: "IRC §121 Exclusion", def: "Excludes up to $250,000 ($500,000 MFJ) of capital gain when selling a primary residence lived in for 2 of the last 5 years." },
    { term: "Reinvestment Risk", def: "The risk that short-term Treasury yields drop when maturing during a 24–36 month phased-investing window, or that equities rally while cash sits on the sidelines." },
    { term: "Imputed Rent", def: "The market rent you avoid paying by living in a home you own, representing the economic value of occupancy." }
  ]
};
