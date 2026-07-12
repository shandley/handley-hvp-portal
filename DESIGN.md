# Design system: Handley Lab HVP Portal

Register: product (design serves the content). Academic/scientific, restrained.

## Theme
Light. Scene: a researcher reading at a desk in daytime, scanning a dense synthesis
for specific facts. Warm paper background, high legibility, no dark-dashboard drama.

## Color (OKLCH; tinted neutrals, restrained strategy)
- `--bg`        oklch(0.985 0.004 95)   warm paper
- `--surface`   oklch(0.965 0.005 95)   raised panels, table zebra
- `--ink`       oklch(0.26 0.012 260)   body text (tinted near-black, never #000)
- `--muted`     oklch(0.50 0.012 260)   secondary text, captions
- `--line`      oklch(0.90 0.005 95)    hairline rules and borders
- `--accent`    oklch(0.45 0.09 255)    links, active states, keylines (sober ink-blue)
- `--accent-weak` oklch(0.95 0.02 255)  accent tint backgrounds

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
