# Handley Lab HVP Portal

Public, lab-authored synthesis of the NIH Human Virome Program. Next.js 16 (App Router) +
React 19, TypeScript strict, deployed to Vercel. Not an official HVP product. The data comes
from a separate **private** corpus repo (`~/Code/research/active/HVP`); see "Data" below.

## Shipping changes: PR flow, never push to main

`main` is branch-protected: it requires a pull request plus the "Build and voice lint" CI
check, and `enforce_admins` is on, so **direct pushes are rejected even for the owner**.
Merging to `main` auto-deploys to production on Vercel (no manual promotion).

Scott is the sole dev and does not want to touch PRs for small changes, so the convention is:
Claude handles the whole PR round-trip and just reports it as done. For a change:

1. Commit locally, then `git branch <feature> HEAD` and `git reset --hard origin/main`.
2. `git push -u origin <feature>`; `gh pr create --base main --head <feature> ...`.
3. `gh pr checks <n> --watch` until green; `gh pr merge <n> --squash --delete-branch`.
4. `git checkout main && git pull && git fetch --prune`.

Do not push to `main` directly. Do not disable the branch protection (the voice-lint gate is
valuable; it has caught real slips).

## Voice lint (self-check before pushing so CI passes first try)

CI (`.github/workflows/ci.yml`) runs `pnpm build` plus a voice lint that fails on:
- em-dashes or en-dashes (`—` / `–`) anywhere in `app/` or `components/` (prose only; data
  JSON is exempt because year ranges are legitimate data).
- banned marketing words in `app/`, `components/`, `lib/`: cutting-edge, robust, leverage,
  utilize, streamline, seamless, unlock, empower, harness, dive in, game-changing,
  revolutionize, supercharge.

Grep the diff for both before pushing. Full copy rules are in `VOICE.md` (report, do not sell;
distinguish planned from measured; sentence case; define acronyms).

## Architecture notes

- **Interactive components split server + client.** Compute heavy geometry/data in a server
  component and pass plain props to a thin `"use client"` component, so large deps stay off the
  browser bundle. Example: `ConsortiumMap` (d3-geo + topojson, server) hands projected points to
  `ConsortiumMapView` (client, hover/pin/filter). `AwardsTable` is the same pattern for search.
- Reuse the existing filter-chip idiom (`.res-chip`, `.legend-chip`) for new filters.
- No UI framework: a small OKLCH design system in `app/globals.css`. Read `DESIGN.md` (tokens,
  the dark hero band) and `PRODUCT.md` (register) before changing the look.

## Data

Static JSON in `data/` is the cleared public bundle generated from the private corpus, not
hand-edited here. To refresh: in the corpus repo run `python3 scripts/build_public_data.py`
(and `check_bioproject_status.py` for the release gate), copy `corpus/public/*.json` into
`data/`, then ship via the PR flow above. The bundle is aggregate-only and gates datasets on
verified NCBI release status.

## Run

```bash
pnpm install         # first time: pnpm approve-builds --all (for sharp)
pnpm dev             # http://localhost:3000
pnpm build && pnpm start
```
