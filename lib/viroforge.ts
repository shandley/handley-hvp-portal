// Types and helpers for the ViroForge reference collections (public/data/collections.json,
// produced by viroforge/scripts/export_web_data.py). Kept free of server-only imports so it
// can be used from client components.

export type VfTaxonomy = {
  realm: string | null;
  kingdom: string | null;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
  subfamily: string | null;
  genus: string | null;
  species: string | null;
};

export type VfGenome = {
  genome_id: string;
  name: string;
  length: number;
  gc_content: number | null;
  genome_type: string;
  genome_structure: string | null;
  n_segments: number | null;
  relative_abundance: number;
  abundance_rank: number | null;
  prevalence: number | null;
  taxonomy: VfTaxonomy;
};

export type VfCollection = {
  id: number;
  name: string;
  description: string | null;
  n_genomes_declared: number | null;
  n_genomes_loaded: number;
  selection_criteria: string | null;
  literature_references: string | null;
  version: number | null;
  genomes: VfGenome[];
};

export type VfProvenance = {
  schema_version: string;
  viroforge_version: string;
  viroforge_git_sha: string | null;
  viroforge_git_dirty: boolean;
  generated_utc: string;
};

export type VfCollectionsFile = {
  provenance?: VfProvenance;
  source: {
    database: string;
    n_collections: number;
    n_collection_genomes: number;
    note: string;
  };
  collections: VfCollection[];
};

export type CompositionSlice = {
  label: string;
  value: number; // summed relative abundance (0..1)
  count: number; // number of genomes
  color: string;
};

// Okabe-Ito, the lab figure standard. Locally defined to avoid pulling the portal's
// program data modules into this (client-used) module.
const OKABE_SEQUENCE = [
  "#0072B2", // blue
  "#D55E00", // vermillion
  "#009E73", // green
  "#E69F00", // orange
  "#56B4E9", // sky
  "#CC79A7", // reddish purple
  "#F0E442", // yellow
  "#000000", // black
];

const GENOME_TYPE_COLOR: Record<string, string> = {
  dsDNA: "#0072B2",
  ssDNA: "#56B4E9",
  dsRNA: "#009E73",
  ssRNA: "#E69F00",
};

const GENOME_TYPE_ORDER = ["dsDNA", "ssDNA", "dsRNA", "ssRNA"];

export function familyComposition(genomes: VfGenome[], topN = 8): CompositionSlice[] {
  const byFamily = new Map<string, { value: number; count: number }>();
  for (const g of genomes) {
    const family = g.taxonomy.family ?? "Unclassified";
    const entry = byFamily.get(family) ?? { value: 0, count: 0 };
    entry.value += g.relative_abundance;
    entry.count += 1;
    byFamily.set(family, entry);
  }
  const sorted = [...byFamily.entries()].sort((a, b) => b[1].value - a[1].value);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const slices: CompositionSlice[] = top.map(([label, e], i) => ({
    label,
    value: e.value,
    count: e.count,
    color: OKABE_SEQUENCE[i % OKABE_SEQUENCE.length],
  }));
  if (rest.length > 0) {
    slices.push({
      label: `Other (${rest.length} families)`,
      value: rest.reduce((s, [, e]) => s + e.value, 0),
      count: rest.reduce((s, [, e]) => s + e.count, 0),
      color: "var(--surface-2)",
    });
  }
  return slices;
}

export function genomeTypeComposition(genomes: VfGenome[]): CompositionSlice[] {
  const byType = new Map<string, { value: number; count: number }>();
  for (const g of genomes) {
    const entry = byType.get(g.genome_type) ?? { value: 0, count: 0 };
    entry.value += g.relative_abundance;
    entry.count += 1;
    byType.set(g.genome_type, entry);
  }
  return [...byType.entries()]
    .sort((a, b) => {
      const ai = GENOME_TYPE_ORDER.indexOf(a[0]);
      const bi = GENOME_TYPE_ORDER.indexOf(b[0]);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .map(([label, e]) => ({
      label,
      value: e.value,
      count: e.count,
      color: GENOME_TYPE_COLOR[label] ?? "var(--surface-2)",
    }));
}

export function familyCount(genomes: VfGenome[]): number {
  return new Set(genomes.map((g) => g.taxonomy.family ?? "Unclassified")).size;
}
