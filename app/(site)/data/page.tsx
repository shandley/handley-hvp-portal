import type { Metadata } from "next";
import { PUBLIC_DATA, BIOPROJECTS } from "@/lib/data";
import { PublicData } from "@/components/PublicData";

export const metadata: Metadata = {
  title: "Public data resources · Handley Lab Virome",
  description:
    "A curated selection of public human-virome datasets and data resources the Handley Lab finds most useful as reference points and starting material.",
};

export default function Page() {
  const hvpPublic = BIOPROJECTS.public.length;
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="prose">
            <div className="kicker">Handley Lab · resources</div>
            <h1>Public data resources.</h1>
            <p className="standfirst">
              The public human-virome datasets and data resources the Handley Lab finds most
              useful as reference points and starting material, across the human body and health
              states.
            </p>
            <div className="disclaimer">
              <span>A curated selection, not a complete index.</span>
              <span>Checked as of <span className="mono">{PUBLIC_DATA.data_as_of}</span>.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="wrap">
          <p className="prose muted" style={{ marginBottom: "0.4rem" }}>
            {PUBLIC_DATA.counts_by_category["unified-resource"]} unified and aggregated resources,{" "}
            {PUBLIC_DATA.counts_by_category["reference-taxonomy"]} reference and taxonomy sets, and{" "}
            {PUBLIC_DATA.counts_by_category["cohort-dataset"]} individual cohort datasets.
          </p>
          <p className="prose muted" style={{ marginBottom: "1.6rem", fontSize: "0.86rem" }}>
            Of these, {PUBLIC_DATA.counts_by_ready?.yes ?? 0} have data you can download and
            reanalyze now (raw reads or assembled catalogs); the rest are browsable portals or
            reference sets. Use the toggle to see just the reanalysis-ready ones. Every identifier
            was checked against CrossRef, DataCite, or NCBI as of{" "}
            <span className="mono">{PUBLIC_DATA.data_as_of}</span>; each entry links to the source.
          </p>
          <PublicData />
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <h2>One more resource: the NIH Human Virome Program</h2>
          </div>
          <p className="prose muted">
            The NIH Human Virome Program is generating its own human-virome datasets across the
            human body. Most are not yet released; {hvpPublic} public so far. The program overview
            page tracks its consortium, awards, data-generation landscape, and live NCBI release
            status.
          </p>
          <p className="prose">
            <a href="/landscape">NIH Human Virome Program overview &rarr;</a>
          </p>
        </div>
      </section>
    </>
  );
}
