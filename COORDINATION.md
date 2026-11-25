# Coordination Board

> **Privacy rule for every session:** Do not place addresses, APNs, owner names, exact tax bills, leases, utility bills, account data, or identifiable property histories in tracked files or the published site. Use `Property A` (inherited home) and `Property B` (already-owned multi-unit home), broad non-identifying ranges, and source links only. Put unknowns on the Flagged for Review page rather than estimating them.
>
> **Branch rule:** Arena supplies the active branch for this session. Do not create or switch branches from this checkout. Before each push, run `git pull --rebase`; push only the active Arena branch.

| ID | Task | Status | Owner / session | File scope | Claimed (UTC) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | Build the privacy-first, static decision dashboard and integrate official-source research, printable brief, and Pages deployment | in progress | `arena/c9a0ca4a-tinodash3` | `COORDINATION.md`, `README.md`, `package.json`, `.gitignore`, `assets/**`, `scripts/**`, root `*.html` | 2026-11-25 | Current implementation uses generic normalized examples only. It supersedes conflicting public artifacts containing household/property identifiers; those must be removed or sanitized before deployment. |
| T-002 | Independent legal/tax review of property-specific facts, date-of-death valuation, leases, insurance quotes, debt, trust, and estate inventory | needs review | Household counsel / CPA / licensed local professionals | No repository files; results must stay off the public site | 2026-11-25 | Cannot be completed from a public repository. The site provides private-only request checklists and official authority links. |
| T-003 | Remove or permanently sanitize previously published property-specific records and identifiers | needs review | Repository owner / privacy counsel | Git history, Pages artifacts, search-engine/cache removal requests | 2026-11-25 | A separate prior merge added city/postal codes, valuations, rent, unit-count, utility, and assessment details. Do not repeat them here. Commit deletion/sanitization and use platform/cache-removal procedures as legally appropriate. |
| T-004 | Add Pages Actions deployment, explicit Property B operating overlay, and current Prop. H preliminary status | ready for verification | `arena/1f2ec65d-tinodash3` | `.github/workflows/pages.yml`, `.nojekyll`, `index.html`, `sources.html`, `README.md` | 2026-11-25 | Keeps three-unit / two-occupied-or-rented / owner-occupancy context labeled user-supplied and unverified; exact rents and identifiers remain absent. Prop. H is preliminary Yes, not certified or modeled as enacted. |

## Activity log

| UTC date | Session | Action | Sources / verification / irregularities |
| --- | --- | --- | --- |
| 2026-11-25 | `arena/c9a0ca4a-tinodash3` | Created coordination board and claimed T-001 before implementation. | Repository inspection initially found only `README.md`; no property-specific public lookup was attempted because address/APN and identity are intentionally excluded. |
| 2026-11-25 | `arena/c9a0ca4a-tinodash3` | Rebased to integrate intervening main changes and detected a privacy conflict. | `origin/main` contains exact geographic, financial, occupancy, and operating details contrary to this board’s publication rule. Those details are not copied into this implementation. T-003 is now open; public deployment must retain only sanitized content. |
| 2026-11-25 | `arena/1f2ec65d-tinodash3` | Added the GitHub Pages Actions workflow, `.nojekyll`, a privacy-safe 404 page, Property B’s explicitly labeled unverified operating overlay, and official preliminary Prop. H election-result status. | `node --check` is not used by this main-tree implementation; `npm test` covers the privacy scan and static source/link check. Public Prop. H terms are rounded where cost display is appropriate and linked to the official ballot/result pages. |

## Handoff and integration notes

- No session may mark a tax, legal, insurance, rent, assessment, or projection value as verified merely because it appears in user-provided material. A published row needs an official source link; otherwise its value remains blank or explicitly labeled as a stress-test assumption.
- `needs review` items are publishable on the site and do not block deployment only when the public artifact itself is privacy-safe.
- Before closing T-001, record the build command, link check, official sources reviewed, open issues, commit/PR/deployment result, and date here.
- Do not reintroduce the previous dashboard’s property-specific data into templates, examples, source files, commit messages, issue/PR text, browser titles, image metadata, or deployment logs.
