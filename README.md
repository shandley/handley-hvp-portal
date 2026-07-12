# Handley Lab HVP Portal

An independent, lab-authored synthesis of the NIH Human Virome Program: the
consortium, the data-generation landscape, and the data infrastructure. Maintained by
the Handley Lab (Washington University in St. Louis). **Not an official HVP product.**

v1 is the synthesized landscape: a single page covering the program, the consortium
(map + awards), the aggregate data landscape (cohorts, body sites, assays, platforms),
and the data-management flow.

## Stack
- Next.js 16 (App Router) + React 19, TypeScript strict.
- No UI framework: a small OKLCH design system in `app/globals.css`, custom SVG for
  the map and data-flow diagram, Okabe-Ito colorblind-safe palette for charts.
- Static: the page prerenders to HTML; deploys to Vercel with zero config.

## Run
```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```
Note: on first install, approve the sharp build once with `pnpm approve-builds --all`
(a Next dependency). TypeScript is pinned to 5.x (Next 16 does not yet support the
TypeScript 7 preview).

## Data
The page reads static JSON in `data/`. That JSON is the **public, cleared** bundle
generated from the private HVP corpus, not hand-edited here. To refresh:

1. In the corpus repo (`~/Code/research/active/HVP`), run
   `python3 scripts/build_public_data.py` to regenerate `corpus/public/*.json`.
2. Copy those files into this repo's `data/`.

The generator enforces two rules that this site depends on:
- **Aggregate only.** Others' unpublished data appears as program-level aggregates;
  per-cohort / per-PI specifics never leave the corpus.
- **Gated datasets.** Each BioProject carries a `release_status`; individual datasets
  are only featured or reanalyzed once verified public (open SRA vs controlled dbGaP).

## Contributing and deploys
Pushing to `main` auto-deploys to production on Vercel. There is no manual promotion
step, so a bad commit on `main` ships immediately.

Prefer opening a pull request instead of committing straight to `main`. Two things then
validate the change before it reaches production:

- CI (`.github/workflows/ci.yml`) runs on every PR: it installs with a frozen lockfile,
  runs `pnpm build`, and runs a voice lint that fails on em/en-dashes in prose under
  `app/` and `components/` and on the banned marketing words from `VOICE.md`.
- Vercel posts a preview deployment URL on the PR, so you can review the rendered site
  before merging.

Merge to `main` only after CI is green and the preview looks right. CI also runs on the
push to `main` as a backstop, but the point is to catch problems on the PR first.

## Branding
`public/logo-placeholder.svg` is a placeholder mark. Swap for real Handley Lab
branding. Keep the "independent synthesis, not an official HVP product" framing and do
not use the official HVP logos (that would imply endorsement).

## Design context
`PRODUCT.md` and `DESIGN.md` hold the register (academic/scientific, restrained) and
the design system. Read them before changing the look.
