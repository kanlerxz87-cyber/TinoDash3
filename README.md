# Inheritance Decision Lab

A privacy-first, static GitHub Pages decision dashboard for comparing paths for an inherited Cupertino-area home (`Property A`) alongside an already-owned San Francisco-area property (`Property B`).

## What is in the site

- Executive summary with **what would change the answer** on the first screen.
- Same-date, same-horizon comparison of live, rent, sell, phased Treasury-to-stocks, and mixed paths.
- Black-swan entry-risk controls for 2008-style, 1929-style, and stagflation stress cases.
- A 24–36 month 3M–2Y Treasury staging path with reinvestment risk displayed beside the headline.
- Range-based model outputs rather than a single point forecast.
- Separate estate-tax, income-tax-basis, and California property-tax-assessment explanations.
- Official-source register, deadline timeline, glossary, one-page printable Attorney + CPA briefing sheet, suggestions backlog, and Flagged for Review page.
- Public-data containment: no names, exact addresses, postal identifiers, APNs, trust identifiers, lease identifiers, contact details, or household-specific account data.

## Privacy model

The public website intentionally omits household-specific values. The model is normalized to `$1.00` of inherited-property value and its controls are clearly labeled illustrative sensitivities. Private appraisals, tax bills, leases, insurance declarations, utility bills, debt statements, trust documents, and estate inventory belong in a separate secure copy. The `.gitignore` protects common private filenames, but privacy still requires a release-time search and human review.

Never add the following to this repository or the Pages artifact:

- names, email addresses, phone numbers, exact addresses, ZIP codes, APNs, trust IDs, SSNs, account numbers, or unredacted legal documents;
- exact household valuations, rents, tax bills, insurance premiums, debt balances, or bank/brokerage balances;
- private source documents or data exports.

## Run locally

This is a static site. From the repository root:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Open `http://localhost:4173/`. No package install or runtime API is required.

## Verification

- `node --check app.js`
- Visit every `.html` page through the local server.
- Confirm the model controls update all paths together.
- Confirm the print button creates a one-page brief.
- Search the repository for personal identifiers before release.
- Check every research table row has an official or clearly labeled research source link.
- Recheck all official links and enacted/proposal statuses before any household decision.

## Source boundary

The site links directly to IRS, California FTB, California BOE, county, City and County of San Francisco, California Department of Insurance, utility, U.S. Treasury, Federal Reserve, and NBER materials. A source link can establish a rule or method; it cannot verify an omitted private household fact. See `research.html` and `flagged.html`.

## Deployment

`.github/workflows/pages.yml` deploys the static root to GitHub Pages when the repository's Pages source is configured for GitHub Actions. The workflow does not upload a private data directory.
