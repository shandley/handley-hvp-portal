import { PROGRAM } from "@/lib/data";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <a className="brand" href="/" aria-label="Handley Lab HVP Portal home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-placeholder.svg" alt="" width={28} height={28} />
            <span>
              <strong>Handley Lab</strong> <span className="sub">· HVP Portal</span>
            </span>
          </a>
          <nav className="nav" aria-label="Sections">
            <a href="/landscape#program">Program</a>
            <a href="/landscape#consortium">Consortium</a>
            <a href="/landscape#data">Data landscape</a>
            <a href="/landscape#infrastructure">Infrastructure</a>
            <a href="/landscape#resources">Public data</a>
            <a href="/virome">Virome methods</a>
            <a href="/taxonomy">Taxonomy change</a>
          </nav>
          <span className="tag">independent synthesis</span>
        </div>
      </header>

      <main id="top">{children}</main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <h3>About this portal</h3>
              <p>
                An independent synthesis of the NIH Human Virome Program, maintained by
                the Handley Lab at Washington University in St. Louis. It is not an
                official HVP product and does not speak for the consortium.
              </p>
              <p className="muted">
                Program facts come from public sources (NIH RePORTER, NCBI, program
                announcements). Data-generation figures are the lab&apos;s aggregate synthesis;
                per-group specifics are withheld until the underlying data is public.
              </p>
            </div>
            <div>
              <h3>Sources</h3>
              <p>
                {PROGRAM.sources.map((s, i) => (
                  <span key={i}>{s}<br /></span>
                ))}
                <a href="https://commonfund.nih.gov/humanvirome">NIH Common Fund: HVP</a>
              </p>
            </div>
            <div>
              <h3>Data as of</h3>
              <p className="mono">{PROGRAM.data_as_of}</p>
              <p className="muted">A dated snapshot. Regenerated from the lab&apos;s HVP data corpus.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
