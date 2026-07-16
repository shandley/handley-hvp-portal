import { CAUDOVIRALES, TAXONOMY_CHANGES, fmt } from "@/lib/data";
import { HISTORY_BIB, HISTORY_ERAS } from "@/lib/history";
import { Timeline } from "@/components/Timeline";
import { CaudoviralesFlow } from "@/components/CaudoviralesFlow";
import { SectionNav } from "@/components/SectionNav";

const SECTIONS = [
  { id: "timeline", label: "Timeline" },
  { id: "classification", label: "The great reclassification" },
  { id: "bibliography", label: "Sources" },
];

export const metadata = {
  title: "A history of the virome · Handley Lab Virome",
  description:
    "The history of the virome, from the first filterable agents of the 1890s to the human virome, as a sourced timeline with a chapter on viral classification.",
};

export default function Page() {
  const taxa = TAXONOMY_CHANGES.taxa;
  const families = taxa.filter((t) => t.rank === "family");
  const famEver = families.length;
  const famCurrent = families.filter((t) => t.current).length;
  const famGone = famEver - famCurrent;
  const present2005 = families.filter((t) => t.first_year <= 2005);
  const survived2005 = present2005.filter((t) => t.current).length;
  const survivalPct = Math.round((survived2005 / present2005.length) * 100);
  const genera = taxa.filter((t) => t.rank === "genus");
  const flow2020 = CAUDOVIRALES.timeline.find((t) => t.year === 2020);
  const orderPeak = flow2020?.order_Caudovirales ?? 0;

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="prose">
            <div className="kicker">Handley Lab Virome · History</div>
            <h1>A history of the virome.</h1>
            <p className="standfirst">
              From the first filterable agents of the 1890s to a coordinated map of the human
              virome, the study of viruses as communities has a long and surprising history.
              This is the timeline; the chapters tell the stories.
            </p>
            <div className="disclaimer">
              <span>
                Dates and attributions are sourced from the primary literature, with contested
                points flagged.
              </span>
            </div>
          </div>
        </div>
      </section>

      <SectionNav sections={SECTIONS} />

      <section id="timeline" className="section-pad">
        <div className="wrap">
          <Timeline />
        </div>
      </section>

      <section id="classification" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Chapter</div>
            <h2>The great reclassification</h2>
          </div>
          <p className="prose muted" style={{ marginBottom: "1.4rem" }}>
            Classification is part of the history too, and it is still moving. The
            International Committee on Taxonomy of Viruses revises its scheme through periodic
            Master Species List releases, in which names are renamed, split, merged, and
            abolished. The largest single reorganization in twenty years was the 2021 collapse
            of the order Caudovirales, the tailed bacteriophages, from morphology-based families
            into genome-based ones.
          </p>
        </div>
        <div className="wrap" id="caudovirales-flow">
          <div className="flow-dark">
            <CaudoviralesFlow />
          </div>
        </div>
        <div className="wrap">
          <div className="cols two" style={{ marginTop: "2rem" }}>
            <div className="prose">
              <p>
                The headline is quieter than the Caudovirales story suggests. Family names are
                mostly stable. Of the {present2005.length} family names present in 2005,{" "}
                {survivalPct}% still exist in 2024. Across the whole series, {famGone} of{" "}
                {fmt(famEver)} family names have left the taxonomy.
              </p>
              <p className="muted">
                The instability is concentrated. A few large reorganizations account for most of
                the disruption, and the Caudovirales abolition is the largest: {fmt(orderPeak)}{" "}
                species in the order in 2020, redistributed across genome-based families in 2021,
                with many now assigned only to the class Caudoviricetes.
              </p>
            </div>
            <div className="figs">
              <div className="fig"><div className="v">{fmt(famEver)}</div><div className="k">family names, 2005 to 2024</div></div>
              <div className="fig"><div className="v">{survivalPct}%</div><div className="k">of 2005 families still current</div></div>
              <div className="fig"><div className="v">{famGone}</div><div className="k">family names retired</div></div>
              <div className="fig"><div className="v">{fmt(genera.length)}</div><div className="k">genus names tracked</div></div>
            </div>
          </div>
          <p className="muted" style={{ fontSize: "0.86rem", marginTop: "1.2rem" }}>
            Computed from the ICTV Master Species List files (2005 to 2024), a synthesis of ICTV
            data. Trace any taxon or reconcile a name list with the taxonomy utilities under{" "}
            <a href="/virome#taxonomy-utilities">Methods</a>.
          </p>
        </div>
      </section>

      <section id="bibliography" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Sources</div>
            <h2>A living bibliography</h2>
          </div>
          <p className="prose muted" style={{ marginBottom: "1.6rem" }}>
            The full literature behind the timeline, {HISTORY_BIB.length} sources, each verified
            against PubMed or CrossRef and grouped by era. Not a curated highlight reel; this is
            every source cited above.
          </p>
          <div className="biblio">
            {HISTORY_ERAS.map((era) => {
              const refs = HISTORY_BIB.filter((b) => b.era === era.key);
              if (!refs.length) return null;
              return (
                <div className="biblio-group" key={era.key}>
                  <div className="biblio-era">
                    <span className="tl-sw" style={{ background: era.color }} />
                    {era.name}
                  </div>
                  <ul>
                    {refs.map((b, i) => (
                      <li key={i}>
                        {b.ref}{" "}
                        {b.doi ? (
                          <a className="mono" href={`https://doi.org/${b.doi}`}>doi:{b.doi}</a>
                        ) : b.url ? (
                          <a className="mono" href={b.url}>{b.url}</a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
