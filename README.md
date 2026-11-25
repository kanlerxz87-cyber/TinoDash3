# Estate Pathfinder

A privacy-first static decision dashboard for comparing living in, renting, selling, or partially monetizing an inherited **Property A**, while accounting for an already-owned **Property B**.

## Privacy

Only anonymized labels and rounded scenario controls belong in this repository. Never commit names, addresses, APNs, trust documents, leases, appraisals, account data, or exact private records. `.gitignore` excludes `private/` and `raw-data/`, but sensitive material should live in an approved encrypted system outside the checkout.

## Run checks

```bash
npm test
npm run build
python3 -m http.server 8000
```

Open `http://localhost:8000`. GitHub Pages deploys from `main` through `.github/workflows/pages.yml` after Pages is configured for GitHub Actions.

## Evidence status

Official authority links are collected in `sources.html`. Because this build environment could not retrieve government domains, linked content is marked **live recheck required** rather than falsely verified. Transaction-specific values remain blank until supplied privately by qualified professionals.
