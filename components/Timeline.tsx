"use client";

import { useEffect, useRef, useState } from "react";
import { HISTORY_ERAS, HISTORY_EVENTS } from "@/lib/history";

// Axis geometry (true-scale time axis, 1890 to 2026)
const AW = 1040, PL = 20, PR = 20, BASE = 60, PW = AW - PL - PR;
const Y0 = 1890, Y1 = 2026;
const xOf = (yr: number) => PL + ((yr - Y0) / (Y1 - Y0)) * PW;
const axisYear = (year: string) => parseInt(year.slice(0, 4), 10);

const BANDS = [
  { key: "e1", from: 1890, to: 1914 },
  { key: "e2", from: 1914, to: 1945 },
  { key: "e3", from: 1945, to: 1988 },
  { key: "e4", from: 1988, to: 2009 },
  { key: "e5", from: 2009, to: 2026 },
];
const colorOf = (k: string) => HISTORY_ERAS.find((e) => e.key === k)?.color ?? "#888";
const eraName = (k: string) => HISTORY_ERAS.find((e) => e.key === k)?.name ?? "";
const TICKS = [1900, 1925, 1950, 1975, 2000, 2025];

export function Timeline() {
  const events = HISTORY_EVENTS.filter((e) => e.key);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ribbon = ribbonRef.current;
    if (!ribbon) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const cards = [...ribbon.querySelectorAll<HTMLElement>(".htl-card")];
        const center = ribbon.scrollLeft + ribbon.clientWidth / 2;
        let best = 0, bestD = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
          if (d < bestD) { bestD = d; best = i; }
        });
        setActive(best);
      });
    };
    ribbon.addEventListener("scroll", onScroll, { passive: true });
    return () => ribbon.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToCard = (i: number) => {
    const ribbon = ribbonRef.current;
    if (!ribbon) return;
    const card = ribbon.querySelectorAll<HTMLElement>(".htl-card")[i];
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ribbon.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - ribbon.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const activeX = xOf(axisYear(events[active].year));

  return (
    <div className="htl">
      <p className="htl-cap">
        <b>Placed by real date.</b> Notice how sparse the early decades are, and how the pace
        accelerates after 2000.
      </p>
      <svg className="htl-axis" viewBox={`0 0 ${AW} 92`} role="img"
        aria-label="Time axis of key virome milestones, 1892 to 2026, positioned by real date.">
        {BANDS.map((b) => {
          const x0 = xOf(b.from), x1 = xOf(b.to);
          return (
            <g key={b.key}>
              <rect className="htl-band" x={x0} y={30} width={x1 - x0} height={30} fill={colorOf(b.key)} />
              <text className="htl-era-lbl" x={(x0 + x1) / 2} y={24} textAnchor="middle">{eraName(b.key)}</text>
            </g>
          );
        })}
        <line className="htl-base" x1={PL} y1={BASE} x2={AW - PR} y2={BASE} />
        {TICKS.map((yr) => (
          <g key={yr}>
            <line className="htl-tick" x1={xOf(yr)} y1={BASE} x2={xOf(yr)} y2={BASE + 5} />
            <text className="htl-tick-lbl" x={xOf(yr)} y={BASE + 18} textAnchor="middle">{yr}</text>
          </g>
        ))}
        <line className="htl-ind" x1={activeX} y1={30} x2={activeX} y2={BASE} />
        {events.map((e, i) => (
          <circle key={i} className="htl-dot" cx={xOf(axisYear(e.year))} cy={BASE}
            r={i === active ? 7 : 4.5} fill={colorOf(e.era)} fillOpacity={i === active ? 1 : 0.85}
            onClick={() => scrollToCard(i)} style={{ cursor: "pointer" }}>
            <title>{`${e.year} ${e.title}`}</title>
          </circle>
        ))}
      </svg>

      <div className="htl-ribbon-head">
        <span className="htl-t">Key milestones</span>
        <span className="htl-hint">scroll horizontally &rarr;</span>
      </div>
      <div className="htl-ribbon" ref={ribbonRef}>
        {events.map((e, i) => (
          <article key={i} className={`htl-card${i === active ? " on" : ""}`} style={{ "--c": colorOf(e.era) } as React.CSSProperties}>
            <div className="htl-yr">{e.year}</div>
            <div className="htl-cera">{eraName(e.era)}</div>
            <h3>{e.title}</h3>
            <p>{e.desc}</p>
            <div className="htl-cite">{e.cite}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
