# Design system: Handley Lab HVP Portal

Register: product (design serves the content). Academic/scientific, restrained.

## Theme
Light overall. Scene: a researcher reading at a desk in daytime, scanning a dense synthesis
for specific facts. Warm paper background, high legibility. The one exception is a dark navy
hero band on the landing and at the top of the landscape: it carries the landing's palette
(cream text, faint Okabe glows) and eases down into the cream body, so moving between pages
is not a brightness shock. It is a deliberate tonal bridge, not a dark dashboard.

## Color (OKLCH; tinted neutrals, restrained strategy)
`app/globals.css` `:root` is the source of truth for exact values; keep this in sync with it.
Current tokens (warm paper hue ~85, tinted-navy ink hue ~262):
- `--bg`         oklch(0.955 0.010 85)   warm paper
- `--surface`    oklch(0.935 0.012 85)   raised panels, table zebra
- `--surface-2`  oklch(0.915 0.013 85)   deeper surface (bar tracks, chips)
- `--ink`        oklch(0.25 0.026 262)   body text (tinted near-black, never #000)
- `--muted`      oklch(0.49 0.020 262)   secondary text, captions
- `--faint`      oklch(0.60 0.016 262)   faint labels, kickers
- `--line`       oklch(0.88 0.010 85)    hairline rules and borders
- `--line-strong` oklch(0.80 0.012 85)   stronger borders, input outlines
- `--accent`     oklch(0.48 0.13 245)    links, active states, keylines (Okabe blue family)
- `--accent-weak` oklch(0.92 0.03 245)   accent tint backgrounds

Hero band anchors (shared with the landing `app/page.tsx`):
- `--navy`  #0a0e1a, `--navy-2` #0d1322 (the dark hero), `--cream` #f3efe6 (text on the hero)

Data visualization uses the **Okabe-Ito** colorblind-safe palette (the lab's figure
standard), never a rainbow or a decorative gradient:
black #000000, orange #E69F00, sky #56B4E9, green #009E73, yellow #F0E442,
blue #0072B2, vermillion #D55E00, reddish-purple #CC79A7.

Color strategy is Restrained: neutrals carry the surface, accent ≤10%, data color only
in charts. No section-wide color fields, no gradients.

## Typography (system stacks; zero network, scholarly)
- Prose + headings: serif — `Charter, "Iowan Old Style", "Iowan", Georgia, "Times New Roman", serif`
- UI, labels, nav: sans — `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- Data (numbers, accessions, grant IDs): mono — `ui-monospace, "SF Mono", Menlo, monospace`
- Scale: modular ~1.28 ratio, `clamp()` on headings, restrained (no oversize hero type).
- Body 65–72ch max. Tabular numbers (`font-variant-numeric: tabular-nums`) in data.

## Layout
- Left-aligned. Prose column ~68ch; data sections span wider.
- Sections separated by hairline rules and generous vertical rhythm, not boxes.
- Tables and honest charts over card grids. No nested cards. No side-stripe borders.
- Sticky slim header: placeholder mark + section anchors. Footer carries the
  independence disclaimer, data-as-of, and sources.

## Motion
Minimal. No entrance choreography. Subtle link/hover transitions only.

## Bans (in addition to the shared ones)
No gradient text, no glassmorphism, no hero-metric template, no marketing choreography,
no biotech-cliché decoration. Numbers are never inflated; caveats sit next to figures.
