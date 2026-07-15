"use client";

import { useMemo, useState } from "react";
import { TAXONOMY_CHANGES, OKABE, type TaxonChange } from "@/lib/data";

const YEAR0 = 2005;
const YEAR1 = 2024;

// Curated examples spanning the kinds of change, all verified against the crosswalk.
const NOTABLE: { name: string; type: string; line: string }[] = [
  { name: "Reoviridae", type: "split", line: "into Spinareoviridae and Sedoreoviridae" },
  { name: "Herpesviridae", type: "renamed", line: "to Orthoherpesviridae" },
  { name: "Autographiviridae", type: "promoted", line: "to the order Autographivirales" },
  { name: "Flavivirus", type: "renamed", line: "genus, to Orthoflavivirus" },
  { name: "Ebolavirus", type: "renamed", line: "genus, to Orthoebolavirus" },
  { name: "Coronaviridae", type: "current", line: "since 2005" },
];

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  current: { color: "var(--faint)", label: "unchanged" },
  renamed: { color: OKABE.blue, label: "renamed" },
  split: { color: OKABE.vermillion, label: "split" },
  promoted: { color: OKABE.green, label: "promoted" },
  demoted: { color: OKABE.orange, label: "demoted" },
  abolished: { color: "var(--ink)", label: "abolished" },
  unknown: { color: "var(--faint)", label: "changed" },
};

const CONFIDENCE_LABEL: Record<string, string> = {
  current: "unchanged",
  exact: "exact, from an ICTV record",
  "genus-inferred": "inferred from member tracking",
  ambiguous: "ambiguous, needs the genome",
  "sequence-required": "not resolvable from the name",
};

const byName = new Map<string, TaxonChange>();
for (const t of TAXONOMY_CHANGES.taxa) if (!byName.has(t.name)) byName.set(t.name, t);

export function TaxonomyExplorer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return TAXONOMY_CHANGES.taxa
      .filter((t) => t.name.toLowerCase().includes(q))
      .sort((a, b) => (a.name.toLowerCase().indexOf(q) - b.name.toLowerCase().indexOf(q))
        || a.name.localeCompare(b.name))
      .slice(0, 12);
  }, [query]);

  const taxon = selected ? byName.get(selected) ?? null : null;

  const pick = (name: string) => { setSelected(name); setQuery(""); };

  return (
    <div className="tax-explorer">
      <div className="tax-notable">
        <div className="tax-notable-head">Notable changes</div>
        <div className="tax-notable-grid">
          {NOTABLE.map((n) => {
            const s = STATUS_STYLE[n.type] ?? STATUS_STYLE.unknown;
            return (
              <button key={n.name} type="button" className="tax-notable-card"
                onClick={() => pick(n.name)}>
                <span className="tax-notable-name">{n.name}</span>
                <span className="tax-notable-tag" style={{ color: s.color, borderColor: s.color }}>{s.label}</span>
                <span className="tax-notable-line">{n.line}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="tax-search-row">
        <input
          className="awards-search"
          type="search"
          value={query}
          placeholder="Or search any family or genus name, current or historical"
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search a viral family or genus name"
        />
      </div>

      {results.length > 0 && (
        <ul className="tax-results" role="listbox" aria-label="Search results">
          {results.map((t) => {
            const s = STATUS_STYLE[t.status] ?? STATUS_STYLE.unknown;
            return (
              <li key={`${t.rank}-${t.name}`}>
                <button type="button" onClick={() => pick(t.name)} role="option" aria-selected={false}>
                  <span className="tax-r-name">{t.name}</span>
                  <span className="tax-r-rank">{t.rank}</span>
                  <span className="tax-r-status" style={{ color: s.color }}>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {taxon ? <TaxonCard t={taxon} /> : (
        <p className="muted tax-hint">
          Search a name, or pick an example. Every family and genus that appears in any
          release from 2005 to 2024 is here, current or superseded.
        </p>
      )}
    </div>
  );
}

function Lifeline({ t }: { t: TaxonChange }) {
  const W = 760, H = 92;
  const M = { left: 8, right: 8, top: 30, bottom: 26 };
  const IW = W - M.left - M.right;
  const x = (year: number) => M.left + ((year - YEAR0) / (YEAR1 - YEAR0)) * IW;
  const rowY = M.top + 14;
  const s = STATUS_STYLE[t.status] ?? STATUS_STYLE.unknown;
  const x0 = x(t.first_year);
  const x1 = x(t.last_year);
  const ticks = [2005, 2010, 2015, 2020, 2024];
  return (
    <svg className="tax-lifeline" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`${t.name} was present from ${t.first_year} to ${t.last_year}${t.current ? " and is current" : `, then ${s.label}`}.`}>
      {ticks.map((yr) => (
        <g key={yr}>
          <line x1={x(yr)} y1={M.top} x2={x(yr)} y2={H - M.bottom} stroke="var(--line)" strokeWidth={1} />
          <text x={x(yr)} y={H - 8} textAnchor="middle" fontFamily="var(--mono)" fontSize={11}
            fill="var(--faint)">{yr}</text>
        </g>
      ))}
      {/* the taxon's span */}
      <line x1={x0} y1={rowY} x2={x1} y2={rowY} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={x0} cy={rowY} r={4} fill="var(--bg)" stroke="var(--ink)" strokeWidth={2} />
      <text x={x0} y={rowY - 10} textAnchor="middle" fontFamily="var(--sans)" fontSize={10.5}
        fill="var(--muted)">appears {t.first_year}</text>
      {t.current ? (
        <>
          <path d={`M${x1} ${rowY} l10 -4 l0 8 Z`} fill="var(--ink)" />
          <text x={x1 + 14} y={rowY + 3.5} fontFamily="var(--sans)" fontSize={10.5} fill="var(--muted)">current</text>
        </>
      ) : (
        <>
          <circle cx={x1} cy={rowY} r={5.5} fill={s.color} stroke="var(--bg)" strokeWidth={1.5} />
          <text x={x1} y={rowY - 10} textAnchor="middle" fontFamily="var(--sans)" fontSize={10.5}
            fill={s.color} fontWeight={600}>{s.label} {t.last_year}</text>
        </>
      )}
    </svg>
  );
}

function TaxonCard({ t }: { t: TaxonChange }) {
  const s = STATUS_STYLE[t.status] ?? STATUS_STYLE.unknown;
  const line = t.note ?? (t.was
    ? `Current in ${TAXONOMY_CHANGES.meta.as_of}, unchanged as a name. Its members were classified as ${t.was.map((w) => w.name).join(", ")} in ${t.was[0].as_of}.`
    : `Present since ${t.first_version}, still current in ${TAXONOMY_CHANGES.meta.as_of}. The name has not changed.`);
  return (
    <div className="tax-card">
      <div className="tax-card-head">
        <span className="tax-card-name">{t.name}</span>
        <span className="tax-card-rank">{t.rank}</span>
        <span className="tax-card-status" style={{ color: s.color, borderColor: s.color }}>{s.label}</span>
      </div>
      <Lifeline t={t} />
      <p className="tax-card-line">{line}</p>
      <div className="tax-card-meta">
        <span>Confidence: {CONFIDENCE_LABEL[t.confidence] ?? t.confidence}</span>
        {t.change_type && <span>ICTV change: {t.change_type}</span>}
        {t.proposal && <span className="mono">Proposal: {t.proposal.replace(/\.zip$/, "")}</span>}
      </div>
      {t.destinations && t.destinations.length > 0 && (
        <div className="tax-dests">
          <div className="tax-dests-head">Members now sit in:</div>
          <ul>
            {t.destinations.slice(0, 8).map((d) => (
              <li key={d.name}>
                <span className="tax-dest-name">{d.name}</span>
                <span className="num tax-dest-frac">{(d.fraction * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
