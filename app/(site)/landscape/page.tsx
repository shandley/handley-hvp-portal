import { PROGRAM, CONSORTIUM, LANDSCAPE, BIOPROJECTS, PUBLIC_DATA, OKABE, fmt } from "@/lib/data";
import { BarChart } from "@/components/BarChart";
import { ConsortiumMap } from "@/components/ConsortiumMap";
import { AwardsTable } from "@/components/AwardsTable";
import { DataFlow } from "@/components/DataFlow";
import { PublicData } from "@/components/PublicData";

export default function Page() {
  const h = LANDSCAPE.headline;
  const bp = BIOPROJECTS;
  const openN = bp.counts_by_status["open-sra"] ?? 0;
  const controlledN = bp.counts_by_status["controlled-dbgap"] ?? 0;
  const notReleasedN =
    (bp.counts_by_status["not-released"] ?? 0) + (bp.counts_by_status["unknown"] ?? 0);
  return (
    <>
      {/* Hero / intro */}
      <section className="hero">
        <div className="wrap">
          <div className="prose">
            <div className="kicker">Handley Lab · a synthesis</div>
            <h1>The Human Virome Program, synthesized.</h1>
            <p className="standfirst">
              An independent reading of the NIH Human Virome Program: the consortium behind it,
              the data it is generating across the human body, and the infrastructure that moves
              that data. Assembled and interpreted by the Handley Lab, kept honest about what is
              planned versus in hand.
            </p>
            <div className="disclaimer">
              <span>Independent synthesis, not an official HVP product.</span>
              <span>Data as of <span className="mono">{PROGRAM.data_as_of}</span>.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Program */}
      <section id="program" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">01</div>
            <h2>The program</h2>
          </div>
          <div className="cols two">
            <div className="prose">
              <p>{PROGRAM.mission} Its first phase runs {PROGRAM.phase}, an NIH Common Fund
                investment of {PROGRAM.funding_headline}.</p>
              <p className="muted">
                It is organized as a consortium: characterization centers that catalog the
                virome across cohorts, functional studies of host-virome interactions, tool and
                method development, and a coordinating center for data.
              </p>
            </div>
            <div>
              <ol className="goals">
                {PROGRAM.goals.map((g, i) => (
                  <li key={i}><span className="n">{String(i + 1).padStart(2, "0")}</span><span>{g}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Consortium */}
      <section id="consortium" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">02</div>
            <h2>The consortium</h2>
          </div>
          <p className="prose muted" style={{ marginBottom: "1.6rem" }}>
            {CONSORTIUM.total_awards} first-phase awards across the country: five Virome
            Characterization Centers, five Functional Studies, ten Tools and Methods projects,
            and one Coordinating Center.
          </p>
          <ConsortiumMap />
          <div style={{ marginTop: "1.8rem" }}>
            <AwardsTable awards={CONSORTIUM.awards} />
          </div>
        </div>
      </section>

      {/* Data landscape */}
      <section id="data" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">03</div>
            <h2>The data landscape</h2>
          </div>
          <p className="prose muted" style={{ marginBottom: "1.4rem" }}>
            {LANDSCAPE.note}
          </p>
          <div className="figs">
            <div className="fig"><div className="v">{fmt(h.cohorts)}</div><div className="k">cohorts across the program</div></div>
            <div className="fig"><div className="v">{fmt(h.planned_samples)}</div><div className="k">samples planned or in hand</div></div>
            <div className="fig"><div className="v">{fmt(h.hvp_participants_est)}</div><div className="k">HVP participants (est.)</div></div>
            <div className="fig"><div className="v">{fmt(h.parent_biobank_enrollment)}</div><div className="k">parent-biobank enrollment, counted separately</div></div>
          </div>
          <ul className="caveats">
            {LANDSCAPE.caveats.map((c, i) => <li key={i}>{c}</li>)}
          </ul>

          <div className="cols two" style={{ marginTop: "2.4rem" }}>
            <div>
              <BarChart title="Cohorts by body site" data={LANDSCAPE.cohorts_by_body_site} color={OKABE.blue} />
              <BarChart title="Sequencing plans by platform" data={LANDSCAPE.plans_by_platform} color={OKABE.green} />
            </div>
            <div>
              <BarChart title="Sequencing plans by data modality" data={LANDSCAPE.plans_by_modality} color={OKABE.vermillion} />
              <BarChart title="Cohorts by program component" data={LANDSCAPE.cohorts_by_initiative} color={OKABE.orange} />
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section id="infrastructure" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">04</div>
            <h2>How the data moves</h2>
          </div>
          <p className="prose muted" style={{ marginBottom: "1.4rem" }}>
            Data generators submit metadata through a Baylor validation step and files to NCBI;
            both converge at the coordinating center repository (UMIGS), which feeds the public
            data portal and Harvard&apos;s processing, then a JGI genome repository and
            visualization. ICTV supplies viral taxonomy.
          </p>
          <DataFlow />

          <div className="gate">
            <div className="gate-head">
              <span className="pill">release status</span>
              <span className="muted">
                {bp.bioprojects.length} BioProjects under <span className="mono">{bp.umbrella}</span>,
                status verified against NCBI{bp.checked ? ` on ${bp.checked}` : ""}.
              </span>
            </div>
            <div className="figs gate-figs">
              <div className="fig"><div className="v">{openN}</div><div className="k">public (open SRA)</div></div>
              {controlledN > 0 && (
                <div className="fig"><div className="v">{controlledN}</div><div className="k">controlled (dbGaP), under a data use agreement</div></div>
              )}
              <div className="fig"><div className="v">{notReleasedN}</div><div className="k">registered, no data deposited yet</div></div>
            </div>

            {bp.public.length > 0 && (
              <div className="public-list">
                <div className="chart-title">Public datasets available for reanalysis</div>
                <ul>
                  {bp.public.map((d) => (
                    <li key={d.accession}>
                      <a className="mono" href={`https://www.ncbi.nlm.nih.gov/bioproject/${d.accession}`}>
                        {d.accession}
                      </a>
                      <span>{d.title}</span>
                      <span className="num muted">{d.n_sra_runs.toLocaleString()} runs</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="gate-note muted">{bp.note}</p>
            <p className="gate-note muted">
              While the program&apos;s own data lands, {PUBLIC_DATA.counts_by_ready?.yes ?? 0}{" "}
              public human-virome datasets are available to download and reanalyze now.{" "}
              <a href="#resources">See public data resources below.</a>
            </p>
          </div>
        </div>
      </section>

      {/* Public data resources */}
      <section id="resources" className="section-pad">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">05</div>
            <h2>Public data resources</h2>
          </div>
          <p className="prose muted" style={{ marginBottom: "0.4rem" }}>
            Most of the program&apos;s own sequence data is not yet released (see the release status
            above). In the meantime, these are the public human-virome datasets and data resources
            the Handley Lab finds most useful as reference points and starting material:{" "}
            {PUBLIC_DATA.counts_by_category["unified-resource"]} unified and aggregated resources,{" "}
            {PUBLIC_DATA.counts_by_category["reference-taxonomy"]} reference and taxonomy sets, and{" "}
            {PUBLIC_DATA.counts_by_category["cohort-dataset"]} individual cohort datasets.
          </p>
          <p className="prose muted" style={{ marginBottom: "1.6rem", fontSize: "0.86rem" }}>
            Of these, {PUBLIC_DATA.counts_by_ready?.yes ?? 0} have data you can download and reanalyze
            now (raw reads or assembled catalogs); the rest are browsable portals or reference sets.
            Use the toggle to see just the reanalysis-ready ones. This is a curated selection, not a
            complete index. Every identifier was checked against CrossRef, DataCite, or NCBI as of{" "}
            <span className="mono">{PUBLIC_DATA.data_as_of}</span>; each entry links to the source.
          </p>
          <PublicData />
        </div>
      </section>
    </>
  );
}
