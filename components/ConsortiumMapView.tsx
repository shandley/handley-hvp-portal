"use client";

import { useState } from "react";
import type { Award } from "@/lib/data";

export type PlacedPoint = {
  institution: string;
  region: string;
  x: number;
  y: number;
  r: number;
  color: string;
  lx: number;
  ly: number;
  anchor: "start" | "end";
  offset: boolean;
  awards: Award[];
};

type Props = {
  w: number;
  h: number;
  statePaths: string[];
  nationPath: string;
  points: PlacedPoint[];
  legend: [string, number][];
  colors: Record<string, string>;
};

export function ConsortiumMapView({ w, h, statePaths, nationPath, points, legend, colors }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [filters, setFilters] = useState<Set<string>>(new Set());

  const active = pinned ?? hover;
  const activePoint = points.find((p) => p.institution === active) ?? null;

  const matches = (p: PlacedPoint) =>
    filters.size === 0 || p.awards.some((a) => filters.has(a.component));

  const toggleFilter = (comp: string) =>
    setFilters((prev) => {
      const next = new Set(prev);
      next.has(comp) ? next.delete(comp) : next.add(comp);
      return next;
    });

  return (
    <div>
      <div className="map-wrap" onClick={() => setPinned(null)}>
        <svg
          className="map"
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label="Map of the United States showing HVP award institutions, colored by program component. Hover or focus an institution for its awards."
        >
          <g>
            {statePaths.map((d, i) => (
              <path key={i} d={d} fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={0.6} />
            ))}
            <path d={nationPath} fill="none" stroke="var(--faint)" strokeWidth={1.1} strokeOpacity={0.55} />
          </g>
          {points.map((p) => {
            const isActive = p.institution === active;
            const dim = !matches(p); // dimming is reserved for legend filtering, not hover
            const label = p.awards.length === 1 ? "award" : "awards";
            return (
              <g key={p.institution} className={dim ? "dimmed" : undefined}>
                {p.offset && (
                  <line x1={p.x} y1={p.y} x2={p.lx} y2={p.ly - 3.5} stroke="var(--line-strong)" strokeWidth={0.7} />
                )}
                <circle
                  className="pt"
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? p.r + 2 : p.r}
                  fill={p.color}
                  fillOpacity={0.9}
                  stroke="var(--bg)"
                  strokeWidth={1.4}
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.institution}, ${p.region}: ${p.awards.length} ${label}`}
                  onMouseEnter={() => setHover(p.institution)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(p.institution)}
                  onBlur={() => setHover(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPinned((cur) => (cur === p.institution ? null : p.institution));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPinned((cur) => (cur === p.institution ? null : p.institution));
                    }
                    if (e.key === "Escape") setPinned(null);
                  }}
                />
                <text
                  className="pt-label"
                  x={p.lx}
                  y={p.ly}
                  fontSize={11}
                  fontFamily="var(--sans)"
                  fill="var(--ink)"
                  fontWeight={isActive ? 650 : 400}
                  textAnchor={p.anchor}
                  pointerEvents="none"
                >
                  {p.institution}
                </text>
              </g>
            );
          })}
        </svg>

        {activePoint && (
          <div
            className="map-tip"
            style={{
              left: `${(activePoint.x / w) * 100}%`,
              top: `${(activePoint.y / h) * 100}%`,
              // flip to the left near the right edge so the card stays in frame
              transform: activePoint.x > w * 0.62 ? "translate(-100%, -50%)" : "translate(0, -50%)",
              marginLeft: activePoint.x > w * 0.62 ? -14 : 14,
              pointerEvents: pinned ? "auto" : "none",
            }}
            role="dialog"
            aria-label={`${activePoint.institution} awards`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tip-head">
              <span className="tip-inst">{activePoint.institution}</span>
              <span className="tip-region">{activePoint.region}</span>
            </div>
            <ul className="tip-awards">
              {activePoint.awards.map((a) => (
                <li key={a.grant}>
                  <span className="tip-tag">
                    <i style={{ background: colors[a.component] ?? "var(--accent)" }} />
                    {a.component}
                  </span>
                  <span className="tip-grant">
                    {a.grant} · {a.period}
                  </span>
                  <span className="tip-title">{a.title}</span>
                  <span className="tip-pis">{a.pis}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="legend legend-interactive">
        {legend.map(([comp, n]) => {
          const on = filters.has(comp);
          const faded = filters.size > 0 && !on;
          return (
            <button
              key={comp}
              type="button"
              className={`legend-chip${on ? " active" : ""}${faded ? " faded" : ""}`}
              aria-pressed={on}
              onMouseEnter={() => setHover(null)}
              onClick={() => toggleFilter(comp)}
            >
              <i style={{ background: colors[comp] ?? "var(--accent)" }} />
              {comp} ({n})
            </button>
          );
        })}
        <span className="muted">
          {filters.size > 0 ? "Filtering. Click a component to toggle." : "Point size ≈ awards. Hover a point for detail; click to pin."}
        </span>
      </div>
    </div>
  );
}
