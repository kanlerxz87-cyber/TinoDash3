# Inheritance Decision Desk

A privacy-first static GitHub Pages decision-support site for a future inherited California home (**Property A**) and a separately already-owned multi-unit home (**Property B**).

## What it does

- Puts **“what would change the answer”** before any outcome ranking.
- Keeps estate tax, inherited income-tax basis, California property-tax assessment, rental operations, and investment decisions separate.
- Compares sale, rent, live, and mixed paths at common transfer dates and 5-, 10-, 25-, and 50-year horizons.
- Includes a Black Swan stress test with a 24–36 month 3M–2Y Treasury staging path before phased stock investing, with reinvestment risk displayed beside the headline.
- Provides an official-source registry, enacted-versus-proposed law monitor, step-by-step timeline, missing-information register, five-year maintenance/capital template, suggestions board, and one-page printable attorney/CPA brief.
- Keeps household inputs private (gitignored `private/` only): the published figures page is generic and carries no household values, alongside a dedicated Flagged for Review register, an official-source verification register, and pre-committed decision rules written before any model output existed.

## Privacy boundary

This repository is public. It intentionally does **not** contain addresses, owner names, APNs, exact tax bills, historic assessment trails, leases, rent rolls, account data, trust documents, utility records, valuation reports, or exact household balances. Keep all evidence in an encrypted private workspace outside Git and use only `Property A` / `Property B` in public artifacts.

The published calculator starts from a generic `$1.0M` normalized unit. It is a stress-test teaching tool, not a valuation, tax return, financial plan, or recommendation.

## Local checks

No dependency install is required.

```bash
npm test
# optional local preview
npm run serve
```

`npm test` runs:

1. a privacy scan for prohibited household identifiers;
2. a static link/source-table check across all pages; and
3. the engine, render and figures test suites (range/scenario arithmetic, page wiring, official anchors, and privacy of published figure files — household-specific checks run only when the gitignored `private/` inputs are present).

## Deployment

`.github/workflows/pages.yml` publishes the repository root through GitHub Pages after a reviewed merge to `main` (or a manual workflow dispatch), when the repository Pages environment is enabled for GitHub Actions. `.nojekyll` keeps static assets predictable. See `COORDINATION.md` for the active task board, source verification log, and deployment record.

## Important limitation

Legal, tax, property, insurance, rent, and investment results depend on future law and private facts. Official links are supplied for manual review; refresh them at least annually, at the inheritance event, and before any irreversible action.
