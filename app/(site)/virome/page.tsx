import { CollectionBrowser } from "@/components/CollectionBrowser";
import { TaxonomyExplorer } from "@/components/TaxonomyExplorer";
import { BatchReconcile } from "@/components/BatchReconcile";
import { TAXONOMY_CHANGES, CAUDOVIRALES, PROGRAM, fmt } from "@/lib/data";

export const metadata = {
  title: "Virome methods · Handley Lab Virome",
  description:
    "Reference virome collections behind the lab's QC benchmarking, plus taxonomy utilities for tracing and reconciling ICTV names.",
};

export default function Page() {
  return (
    <>
      <section className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Virome methods</div>
            <h2>Reference virome collections</h2>
          </div>
          <div className="prose vf-intro">
            <p>
              The lab&apos;s virome analysis tooling is benchmarked against curated reference
              collections that stand in for real body-site viromes. Each collection is a set of
              viral genomes with a defined composition, drawn from RefSeq with ICTV taxonomy, and
              used by ViroForge to generate synthetic sequencing data with known ground truth.
              This view browses those collections: what viruses each one contains, how abundance
              is distributed across families, and how the genome types differ by body site.
            </p>
            <p className="muted">
              These are reference compositions for benchmarking, not measured samples. The
              interactive layer, where wet-lab and sequencing choices reshape a collection, comes
              next.
            </p>
          </div>
          <CollectionBrowser />
        </div>
      </section>

      <section id="taxonomy-utilities" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Taxonomy utilities</div>
            <h2>Trace and reconcile ICTV names</h2>
          </div>
          <p className="prose muted">
            Viral taxonomy changes with every ICTV Master Species List. These utilities read 20
            years of releases (2005 to 2024) so you can follow a name or update a dataset
            annotated under older ones. The history of that change, including the Caudovirales
            collapse, is in <a href="/history#classification">History</a>.
          </p>
        </div>

        <div className="wrap" style={{ marginTop: "1.8rem" }}>
          <div className="chart-title">Trace any taxon</div>
          <p className="prose muted" style={{ marginBottom: "1rem" }}>
            Search a family or genus name, current or historical, to see its 20-year trajectory:
            when it appeared, and the rename, split, promotion, or abolition that ended it, with
            the ICTV proposal on record.
          </p>
          <TaxonomyExplorer />
        </div>

        <div className="wrap" style={{ marginTop: "2.4rem" }}>
          <div className="chart-title">Reconcile a list of names</div>
          <BatchReconcile />
        </div>

        <div className="wrap" style={{ marginTop: "2.4rem" }}>
          <div className="prose">
            <p className="muted">
              Every number is computed from the 18 real ICTV Master Species List files (MSL23,
              2005, through MSL40, 2024). Change events come from ICTV&apos;s own rename and
              abolition records where they exist, and otherwise from tracking a taxon&apos;s
              members forward between releases. It cannot resolve polyphyletic splits from the
              name alone and reports those as needing the genome. Data as of {PROGRAM.data_as_of};
              taxonomy source as of {CAUDOVIRALES.meta.as_of}. ICTV taxonomy and proposals are at{" "}
              <a href="https://ictv.global/msl">ictv.global/msl</a>.
            </p>
          </div>
          <div className="tax-download">
            <div>
              <div className="tax-download-title">Download the crosswalk</div>
              <p className="muted">
                Every family and genus name from 2005 to 2024, with its status, the change that
                ended it, the ICTV proposal, and where its members went. One row per taxon,{" "}
                {fmt(TAXONOMY_CHANGES.meta.n_taxa)} rows.
              </p>
            </div>
            <a className="tax-download-link" href="/data/ictv_taxonomy_crosswalk.csv" download>
              ictv_taxonomy_crosswalk.csv
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
