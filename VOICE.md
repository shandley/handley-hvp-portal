# Voice and copy guide

This guide sets the writing voice for the Handley Lab HVP portal. It applies to every
page, caption, label, and metadata string. When a design pass (for example /impeccable)
proposes copy, revise that copy to match this guide before shipping.

## Who is writing, and to whom

The portal is written by a research lab for a scientifically literate audience: virome
researchers, people in adjacent fields, and readers who can follow technical language.
The register is academic and expository. We describe a program and report what its data
shows. We are not promoting a product.

## Register: report, do not sell

The failure mode to avoid is the product or marketing voice that generic design tools
reach for by default. Concretely:

- No conversion calls to action. Use plain navigation labels ("View the data landscape")
  rather than imperatives that push a click ("Enter", "Get started", "Explore now").
- No second person used to persuade. "You" is acceptable only when it is scientifically
  apt and literally true, not as a sales device.
- No hype or superlatives about the program or the portal. State what a thing is and
  what it does.
- Let numbers and sources carry the weight. For this audience an accurate figure with
  its caveat is more convincing than an adjective.

## Accuracy and hedging

This is the part that matters most for a research audience.

- Distinguish planned from measured. Say "planned or in hand" for sample counts that are
  not yet deposited. Do not imply data exists when it does not.
- Distinguish estimate from count. Mark estimates as estimates.
- Do not state a specific quantity you cannot defend from a source. Prefer an honest
  qualitative statement ("most human viruses are still unknown") over a precise-looking
  number that is really a guess.
- Cite where facts come from (NIH RePORTER, NCBI, program announcements). Keep the
  "independent synthesis, not an official HVP product" framing visible.
- Convert relative dates to absolute, and label the snapshot date.

## Plain prose

Follow the lab's global writing rules (see `~/.claude/CLAUDE.md`, "Documentation
writing"): plain, direct prose that reads as though a person wrote it. That file holds
the banned-word list, so it is not repeated here. In short: no "cutting-edge / robust /
leverage / utilize / streamline / seamless", no bold lead-in summary sentences, no "The
core idea:", no intensifiers such as "dramatically".

Portal preferences on top of that:

- Sentence case for headings and labels.
- Active voice, third person about the program.
- Short sentences. One claim per sentence where you can.
- Define acronyms on first use (CODCC, VCC, SRA, dbGaP, BioProject).

## Punctuation: dashes

- In prose, do not use em-dashes or en-dashes. Rewrite with a comma, a colon,
  parentheses, or two sentences.
- In data and identifiers, conventional typography stays. A year range that comes from a
  data source ("2024-2028" rendered as its native "2024–2028") and accession identifiers
  keep their source form. These are data, not prose, and are not AI tells. Do not run a
  global dash replace across data columns.
- For compound modifiers in prose, use a hyphen ("host-virome interactions", "long-read").

## Terminology

- NIH Common Fund Human Virome Program, then "the program" or "HVP".
- Virome Characterization Center (VCC), Functional Studies, Tools and Methods,
  Coordinating Center (CODCC).
- "planned or in hand", not "collected", for sample counts.
- BioProject; SRA for open access; dbGaP for controlled access.

## Two registers on the site

- The landing is the one place a vivid, arresting opening line is allowed, as long as it
  is accurate. Vivid is fine. Hype and false precision are not.
- Every content page (the landscape and anything after it) stays restrained and
  expository throughout.

## Before shipping

- Read every new or changed string against this guide.
- Grep for em and en dashes, and for the banned words, across `app`, `components`, `lib`,
  and the generated data JSON.
- Check that every number on the page is defensible from a cited source, and is correctly
  marked planned versus deposited and estimate versus count.
