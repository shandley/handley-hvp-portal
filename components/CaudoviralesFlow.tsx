import { CAUDOVIRALES, OKABE, type CaudTimeline } from "@/lib/data";
import { CaudoviralesFlowView, type FlowGeo } from "./CaudoviralesFlowView";

// Server component: compute all geometry from the static flow data and hand plain
// props to the client view. No charting library; paths are hand-built, matching the
// portal's ConsortiumMap pattern.

const W = 980;
const H = 380;
const M = { top: 30, right: 20, bottom: 34, left: 54 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

const MORPH: { key: keyof CaudTimeline; label: string; color: string }[] = [
  { key: "Podoviridae", label: "Podoviridae", color: OKABE.sky },
  { key: "Myoviridae", label: "Myoviridae", color: OKABE.vermillion },
  { key: "Siphoviridae", label: "Siphoviridae", color: OKABE.orange },
];

const Y_MAX = 6000;
const x = (year: number, y0 = 2005, y1 = 2024) => M.left + ((year - y0) / (y1 - y0)) * IW;
const y = (v: number) => M.top + IH - (v / Y_MAX) * IH;

function stackedAreaPaths(timeline: CaudTimeline[]) {
  // cumulative stacking, bottom to top in MORPH order
  const base = timeline.map(() => 0);
  const paths: { color: string; d: string }[] = [];
  for (const m of MORPH) {
    const top = timeline.map((t, i) => base[i] + (t[m.key] as number));
    const up = timeline.map((t, i) => `${x(t.year)},${y(top[i])}`);
    const down = timeline.map((t, i) => `${x(t.year)},${y(base[i])}`).reverse();
    paths.push({ color: m.color, d: `M${up.join("L")}L${down.join("L")}Z` });
    for (let i = 0; i < base.length; i++) base[i] = top[i];
  }
  return paths;
}

export function CaudoviralesFlow() {
  const { timeline, redistribution } = CAUDOVIRALES;
  const areas = stackedAreaPaths(timeline);

  // class Caudoviricetes line (members are here once families dissolve)
  const classPts = timeline
    .filter((t) => t.class_Caudoviricetes > 0)
    .map((t) => `${x(t.year)},${y(t.class_Caudoviricetes)}`);
  const classLine = `M${classPts.join("L")}`;

  const yTicks = [0, 1500, 3000, 4500, 6000].map((v) => ({ v, y: y(v) }));
  const xTicks = timeline
    .filter((t) => [2005, 2010, 2015, 2020, 2024].includes(t.year))
    .map((t) => ({ year: t.year, x: x(t.year) }));

  const peak = timeline.find((t) => t.year === 2020);
  const abolishX = x(2021);
  const threeSum = MORPH.reduce((s, m) => s + ((peak?.[m.key] as number) ?? 0), 0);

  // redistribution: one honest horizontal bar per family, width proportional to its
  // 2020 species count; segments are genus-level destinations (top few + rest + the
  // "no family" sink). Genus is the unit that tracks; species need the genome.
  const RW = 620;
  const maxSpecies = Math.max(...MORPH.map((m) => (peak?.[m.key] as number) ?? 0));
  const bars = MORPH.map((m) => {
    const species = (peak?.[m.key] as number) ?? 0;
    const info = redistribution[m.label];
    const dests = info?.destinations ?? [];
    const noFam = dests.find((d) => d.name.startsWith("no family"));
    const named = dests.filter((d) => !d.name.startsWith("no family"));
    const shownN = 4;
    const shown = named.slice(0, shownN);
    const restFrac = named.slice(shownN).reduce((s, d) => s + d.fraction, 0);
    const totalNamed = named.reduce((s, d) => s + d.fraction, 0) + (noFam?.fraction ?? 0);
    const segs: { label: string; frac: number; kind: string }[] = [
      ...shown.map((d) => ({ label: d.name, frac: d.fraction, kind: "family" })),
    ];
    if (restFrac > 0.001) segs.push({ label: `${named.length - shownN} more families`, frac: restFrac, kind: "rest" });
    if (noFam) segs.push({ label: "no family (class only)", frac: noFam.fraction, kind: "none" });
    // normalize to the fraction of members actually traced, scale bar to species size
    const barLen = (species / maxSpecies) * RW;
    let acc = 0;
    const placed = segs.map((s) => {
      const w = (s.frac / (totalNamed || 1)) * barLen;
      const seg = { ...s, x: acc, w };
      acc += w;
      return seg;
    });
    return { family: m.label, color: m.color, species, len: barLen, segs: placed };
  });

  const geo: FlowGeo = {
    w: W, h: H, plotLeft: M.left, plotRight: W - M.right, plotTop: M.top, plotBottom: H - M.bottom,
    areas, classLine, classEndLabel: {
      x: x(2024), y: y(timeline[timeline.length - 1].class_Caudoviricetes),
      value: timeline[timeline.length - 1].class_Caudoviricetes,
    },
    yTicks, xTicks, abolishX,
    peakLabel: { x: x(2020), y: y(threeSum), value: threeSum },
    legend: MORPH.map((m) => ({ label: m.label, color: m.color })),
    bars, redistLeftX: M.left,
    asOf: CAUDOVIRALES.meta.as_of,
  };

  return <CaudoviralesFlowView geo={geo} />;
}
