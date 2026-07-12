import program from "@/data/program.json";
import consortium from "@/data/consortium.json";
import landscape from "@/data/data_landscape.json";
import bioprojects from "@/data/bioprojects.json";
import flow from "@/data/data_flow.json";
import publicDatasets from "@/data/public_datasets.json";

export type Program = {
  name: string; mission: string; goals: string[]; phase: string;
  funding_headline: string; sources: string[]; note: string; data_as_of: string;
};
export type Award = {
  grant: string; activity_code: string; component: string; title: string;
  institution: string; region: string; pis: string; period: string;
};
export type MapPoint = { institution: string; region: string; lat: number; lon: number; grants: string[] };
export type Consortium = {
  counts_by_component: Record<string, number>; total_awards: number;
  awards: Award[]; map_points: MapPoint[]; data_as_of: string;
};
export type Landscape = {
  headline: { cohorts: number; planned_samples: number; hvp_participants_est: number; parent_biobank_enrollment: number };
  caveats: string[];
  cohorts_by_body_site: Record<string, number>;
  plans_by_modality: Record<string, number>;
  plans_by_platform: Record<string, number>;
  cohorts_by_initiative: Record<string, number>;
  note: string; data_as_of: string;
};
export type BioProject = {
  accession: string; level: string; grant: string; title: string;
  release_status: string; n_sra_runs: number;
};
export type BioProjects = {
  umbrella: string; checked: string;
  counts_by_status: Record<string, number>;
  public: BioProject[];
  note: string; bioprojects: BioProject[]; data_as_of: string;
};
export type Flow = {
  nodes: { id: string; label: string; owner: string }[];
  edges: [string, string, string][];
  note: string; data_as_of: string;
};

export type PublicResource = {
  name: string; category: "unified-resource" | "reference-taxonomy" | "cohort-dataset";
  tier: "core" | "useful" | "niche"; body_sites: string; site_tags: string[];
  lifespan: string; organism_scope: string; identifier: string; identifier_url: string;
  url: string; size_scope: string; access_modality: string; summary: string;
  access_note: string; verified: string;
  data_type: "raw-reads" | "assembled-catalog" | "reference" | "taxonomy" | "";
  download_method: string; pull_target: string; license: string;
  reanalysis_ready: "yes" | "partial" | "";
};
export type PublicData = {
  count: number; counts_by_category: Record<string, number>;
  counts_by_tier: Record<string, number>; counts_by_ready: Record<string, number>;
  counts_by_data_type: Record<string, number>; site_filters: string[];
  resources: PublicResource[]; note: string; data_as_of: string;
};

export const DATA_TYPE_LABEL: Record<string, string> = {
  "raw-reads": "raw reads",
  "assembled-catalog": "catalog",
  reference: "reference",
  taxonomy: "taxonomy",
};

export const PROGRAM = program as Program;
export const CONSORTIUM = consortium as Consortium;
export const LANDSCAPE = landscape as Landscape;
export const BIOPROJECTS = bioprojects as BioProjects;
export const FLOW = flow as unknown as Flow;
export const PUBLIC_DATA = publicDatasets as PublicData;

export const CATEGORY_LABEL: Record<string, string> = {
  "unified-resource": "Unified and aggregated resources",
  "reference-taxonomy": "Reference and taxonomy",
  "cohort-dataset": "Individual cohort datasets",
};

// Okabe-Ito, mapped to consortium components (colorblind-safe; the lab figure standard)
export const OKABE = {
  black: "#000000", orange: "#E69F00", sky: "#56B4E9", green: "#009E73",
  yellow: "#F0E442", blue: "#0072B2", vermillion: "#D55E00", purple: "#CC79A7",
} as const;

export const COMPONENT_COLOR: Record<string, string> = {
  "Virome Characterization Center": OKABE.blue,
  "Functional Studies": OKABE.vermillion,
  "Tools and Methods": OKABE.green,
  "Coordinating Center (CODCC)": OKABE.orange,
};

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
