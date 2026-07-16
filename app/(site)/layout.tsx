import { PROGRAM } from "@/lib/data";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <a className="brand" href="/" aria-label="Handley Lab Virome home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-placeholder.svg" alt="" width={28} height={28} />
            <span>
              <strong>Handley Lab Virome</strong>
            </span>
          </a>
          <nav className="nav" aria-label="Sections">
            <a href="/virome">Methods</a>
            <a href="/taxonomy">Taxonomy</a>
            <a href="/data">Public data</a>
          </nav>
        </div>
      </header>

      <main id="top">{children}</main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <h3>About Handley Lab Virome</h3>
              <p>
                The Handley Lab&apos;s virome work: methods, tools, data views, and resources
                across human and environmental viromes, maintained at Washington University in
                St. Louis.
              </p>
              <p className="muted">
                Program facts come from public sources (NIH RePORTER, NCBI, program
                announcements).
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
