import { CollectionBrowser } from "@/components/CollectionBrowser";

export const metadata = {
  title: "Virome methods · Handley Lab HVP Portal",
  description:
    "Browse the curated reference virome collections that back the lab's virome quality-control benchmarking.",
};

export default function Page() {
  return (
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
            This view browses those collections: what viruses each one contains, how abundance is
            distributed across families, and how the genome types differ by body site.
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
  );
}
