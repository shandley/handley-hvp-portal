import { CAUDOVIRALES, TAXONOMY_CHANGES, PROGRAM, fmt } from "@/lib/data";
import { CaudoviralesFlow } from "@/components/CaudoviralesFlow";
import { TaxonomyExplorer } from "@/components/TaxonomyExplorer";

export const metadata = {
  title: "Viral taxonomy change | Handley Lab HVP Portal",
  description:
    "How ICTV viral taxonomy changed from 2005 to 2024, computed from the Master Species Lists.",
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
      <section className="hero tax-hero">
        <div className="wrap">
          <div className="prose">
            <div className="kicker">Handley Lab · a synthesis</div>
            <h1>How viral taxonomy changed, 2005 to 2024.</h1>
            <p className="standfirst">
              The International Committee on Taxonomy of Viruses (ICTV) revises its
              classification through periodic Master Species List (MSL) releases. Names
              are renamed, split, merged, and abolished. This section reads 20 years of
              those releases and shows what changed, starting with the largest single
              reorganization: the 2021 collapse of the order Caudovirales.
            </p>
          </div>
        </div>
        <div className="wrap tax-centerpiece">
          <CaudoviralesFlow />
        </div>
        <div className="wrap">
          <div className="disclaimer">
            <span>Handley Lab synthesis of ICTV data, not an official ICTV product.</span>
            <span>Source: {CAUDOVIRALES.meta.as_of}, computed from the MSL files.</span>
          </div>
        </div>
      </section>

      <section id="synthesis" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">01</div>
            <h2>What actually changed</h2>
          </div>
          <div className="cols two">
            <div className="prose">
              <p>
                The headline is quieter than the Caudovirales story suggests. Family names
                are mostly stable. Of the {present2005.length} family names present in 2005,
                {" "}{survivalPct}% still exist in 2024. Across the whole series,
                {" "}{famGone} of {fmt(famEver)} family names have left the taxonomy.
              </p>
              <p className="muted">
                The instability is concentrated. A few large reorganizations account for
                most of the disruption, and the Caudovirales abolition is the largest of
                them: {fmt(orderPeak)} species in the order in 2020, redistributed across
                genome-based families in 2021, with many now assigned only to the class
                Caudoviricetes.
              </p>
            </div>
            <div className="figs">
              <div className="fig"><div className="v">{fmt(famEver)}</div><div className="k">family names, 2005 to 2024</div></div>
              <div className="fig"><div className="v">{survivalPct}%</div><div className="k">of 2005 families still current</div></div>
              <div className="fig"><div className="v">{famGone}</div><div className="k">family names retired</div></div>
              <div className="fig"><div className="v">{fmt(genera.length)}</div><div className="k">genus names tracked</div></div>
            </div>
          </div>
          <ul className="caveats">
            <li>A retired name may have been renamed, split, promoted, or abolished. Those
              are different events, and the name alone does not distinguish them.</li>
            <li>Polyphyletic families such as the abolished morphology groups cannot be
              placed into a single new family from the name. That needs the genome.</li>
          </ul>
        </div>
      </section>

      <section id="explore" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">02</div>
            <h2>Trace any taxon</h2>
          </div>
          <p className="prose muted">
            Search a family or genus name, current or historical, to see its 20-year
            trajectory: when it appeared, and the rename, split, promotion, or
            abolition that ended it, with the ICTV proposal on record.
          </p>
          <TaxonomyExplorer />
        </div>
      </section>

      <section id="methods" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">03</div>
            <h2>How this was computed</h2>
          </div>
          <div className="prose">
            <p>
              Every number here is computed from the 18 real ICTV Master Species List
              files (MSL23, 2005, through MSL40, 2024). Change events come from ICTV&apos;s
              own rename and abolition records where they exist, and otherwise from
              tracking a taxon&apos;s members forward between releases. Genus is the stable
              unit: a family is followed by its genera, so a family that changes name can
              still be located by where its genera land.
            </p>
            <p className="muted">
              The tracking method was checked against ICTV&apos;s own change records and
              reproduced them without contradiction on the cases they document. It cannot
              resolve polyphyletic splits from the name alone, and it reports those as
              needing the genome rather than guessing. Data as of {PROGRAM.data_as_of} for
              the portal; taxonomy source as of {CAUDOVIRALES.meta.as_of}.
            </p>
            <p className="muted">
              ICTV taxonomy and proposals are published at{" "}
              <a href="https://ictv.global/msl">ictv.global/msl</a>. This section is an
              independent reading of that public data by the Handley Lab.
            </p>
          </div>
          <div className="tax-download">
            <div>
              <div className="tax-download-title">Download the crosswalk</div>
              <p className="muted">
                Every family and genus name from 2005 to 2024, with its status, the
                change that ended it, the ICTV proposal, and where its members went. One
                row per taxon, {fmt(TAXONOMY_CHANGES.meta.n_taxa)} rows. Useful for
                updating a dataset annotated under older names.
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
