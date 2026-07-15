"use client";

import { useEffect, useRef, useState } from "react";
import { fmt } from "@/lib/data";

export type FlowGeo = {
  w: number; h: number;
  plotLeft: number; plotRight: number; plotTop: number; plotBottom: number;
  areas: { color: string; d: string }[];
  classLine: string;
  classEndLabel: { x: number; y: number; value: number };
  yTicks: { v: number; y: number }[];
  xTicks: { year: number; x: number }[];
  abolishX: number;
  peakLabel: { x: number; y: number; value: number };
  legend: { label: string; color: string }[];
  bars: { family: string; color: string; species: number; len: number;
    segs: { label: string; frac: number; kind: string; x: number; w: number }[] }[];
  redistLeftX: number;
  asOf: string;
};

const CREAM = "rgba(243,239,230,";
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function CaudoviralesFlowView({ geo }: { geo: FlowGeo }) {
  const [p, setP] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setP(1); return; }
    const DUR = 1700;
    let raf = 0;
    let t0 = 0;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const raw = Math.min((ts - t0) / DUR, 1);
      setP(easeOutQuart(raw));
      if (raw < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const revealW = geo.plotLeft + p * (geo.plotRight - geo.plotLeft);
  const barP = Math.max(0, Math.min((p - 0.6) / 0.4, 1));

  return (
    <div className="tax-flow">
      <svg viewBox={`0 0 ${geo.w} ${geo.h}`} role="img"
        aria-label="Species in the Caudovirales region of viral taxonomy from 2005 to 2024. The morphology families Myoviridae, Siphoviridae, and Podoviridae grow until 2020, then fall to zero in 2021 when the order is abolished; the class Caudoviricetes keeps rising as members move to it.">
        <defs>
          <clipPath id="tax-reveal"><rect x={0} y={0} width={revealW} height={geo.h} /></clipPath>
        </defs>

        {/* y gridlines + labels */}
        {geo.yTicks.map((t) => (
          <g key={t.v}>
            <line x1={geo.plotLeft} y1={t.y} x2={geo.plotRight} y2={t.y}
              stroke={`${CREAM}0.12)`} strokeWidth={1} />
            <text x={geo.plotLeft - 8} y={t.y + 3} textAnchor="end"
              fontFamily="var(--mono)" fontSize={11} fill={`${CREAM}0.5)`}>{fmt(t.v)}</text>
          </g>
        ))}
        {/* x labels */}
        {geo.xTicks.map((t) => (
          <text key={t.year} x={t.x} y={geo.plotBottom + 20} textAnchor="middle"
            fontFamily="var(--mono)" fontSize={11} fill={`${CREAM}0.5)`}>{t.year}</text>
        ))}
        <text x={geo.plotLeft} y={geo.plotTop - 12} fontFamily="var(--sans)" fontSize={11.5}
          fill={`${CREAM}0.62)`}>Species (count)</text>

        {/* revealed data */}
        <g clipPath="url(#tax-reveal)">
          {geo.areas.map((a, i) => (
            <path key={i} d={a.d} fill={a.color} fillOpacity={0.82} />
          ))}
          <path d={geo.classLine} fill="none" stroke={`${CREAM}0.9)`} strokeWidth={2}
            strokeDasharray="1 5" strokeLinecap="round" />
        </g>

        {/* abolition marker (appears with the reveal) */}
        {revealW >= geo.abolishX && (
          <g>
            <line x1={geo.abolishX} y1={geo.plotTop} x2={geo.abolishX} y2={geo.plotBottom}
              stroke={`${CREAM}0.55)`} strokeWidth={1} strokeDasharray="3 3" />
            <text x={geo.abolishX + 6} y={geo.plotTop + 12} fontFamily="var(--sans)" fontSize={11}
              fill={`${CREAM}0.78)`}>2021: order abolished</text>
          </g>
        )}
        {/* peak annotation */}
        {p > 0.55 && (
          <text x={geo.peakLabel.x - 8} y={geo.peakLabel.y - 8} textAnchor="end"
            fontFamily="var(--sans)" fontSize={11.5} fill={`${CREAM}0.82)`}>
            {fmt(geo.peakLabel.value)} species in these three families (2020)
          </text>
        )}
        {p > 0.9 && (
          <text x={geo.classEndLabel.x - 4} y={geo.classEndLabel.y - 8} textAnchor="end"
            fontFamily="var(--sans)" fontSize={11.5} fill={`${CREAM}0.82)`}>
            class Caudoviricetes: {fmt(geo.classEndLabel.value)}
          </text>
        )}
      </svg>

      <div className="tax-flow-legend">
        {geo.legend.map((l) => (
          <span key={l.label}><i style={{ background: l.color }} />{l.label}</span>
        ))}
        <span><i className="cls" />Caudoviricetes (class)</span>
      </div>

      {/* redistribution: where the members are now */}
      <div className="tax-redist" style={{ opacity: barP }}>
        <div className="tax-redist-head">
          Where the members are now (2024), by genus. Species-level placement needs the genome.
        </div>
        <svg viewBox={`0 0 ${geo.w} ${geo.bars.length * 46 + 8}`} role="img"
          aria-label="Genus-level redistribution of the three abolished families into current families, with a large share now assigned only to the class.">
          {geo.bars.map((b, i) => {
            const rowY = i * 46 + 8;
            return (
              <g key={b.family}>
                <text x={geo.redistLeftX} y={rowY + 10} fontFamily="var(--sans)" fontSize={12}
                  fill={`${CREAM}0.9)`}>{b.family}</text>
                <text x={geo.redistLeftX} y={rowY + 26} fontFamily="var(--mono)" fontSize={10.5}
                  fill={`${CREAM}0.5)`}>{fmt(b.species)} species (2020)</text>
                {b.segs.map((s, j) => (
                  <g key={j}>
                    <rect x={geo.redistLeftX + 120 + s.x} y={rowY} width={Math.max(s.w * barP, 0)} height={20}
                      fill={s.kind === "none" ? `${CREAM}0.14)` : s.kind === "rest" ? `${CREAM}0.3)` : b.color}
                      fillOpacity={s.kind === "family" ? 0.85 : 1}
                      stroke={`${CREAM}0.08)`} strokeWidth={0.5}>
                      <title>{`${s.label}: ${(s.frac * 100).toFixed(0)}% of genera`}</title>
                    </rect>
                  </g>
                ))}
                {b.segs.filter((s) => s.kind === "none").map((s, j) => (
                  <text key={`n${j}`} x={geo.redistLeftX + 120 + s.x + Math.max(s.w * barP, 0) + 6} y={rowY + 14}
                    fontFamily="var(--sans)" fontSize={10.5} fill={`${CREAM}0.55)`} opacity={barP > 0.8 ? 1 : 0}>
                    {(s.frac * 100).toFixed(0)}% no family
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
