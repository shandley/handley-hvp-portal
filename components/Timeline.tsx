import { HISTORY_ERAS, HISTORY_EVENTS } from "@/lib/history";

export function Timeline() {
  const eraOf = (k: string) => HISTORY_ERAS.find((e) => e.key === k);
  let lastEra: string | null = null;

  return (
    <div className="tl">
      <div className="tl-legend">
        {HISTORY_ERAS.map((e) => (
          <span className="tl-li" key={e.key}>
            <span className="tl-sw" style={{ background: e.color }} />
            {e.name}
          </span>
        ))}
      </div>

      {HISTORY_EVENTS.map((ev, i) => {
        const era = eraOf(ev.era)!;
        const header =
          ev.era !== lastEra ? (
            <div className="tl-era" key={`era-${ev.era}`}>
              <span className="tl-sw" style={{ background: era.color }} />
              <h3>{era.name}</h3>
              <span className="tl-span">{era.span}</span>
            </div>
          ) : null;
        lastEra = ev.era;
        return (
          <div key={`wrap-${i}`}>
            {header}
            <div className="tl-ev">
              <div className="tl-yr">{ev.year}</div>
              <div className="tl-rail">
                <span className="tl-dot" style={{ background: era.color }} />
              </div>
              <div className="tl-body">
                <h4>{ev.title}</h4>
                <p>{ev.desc}</p>
                <div className="tl-cite">{ev.cite}</div>
                {ev.flag && <div className="tl-flag">Note: {ev.flag}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
