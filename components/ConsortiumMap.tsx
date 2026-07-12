import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import statesTopo from "us-atlas/states-10m.json";
import { CONSORTIUM, COMPONENT_COLOR } from "@/lib/data";

const W = 980, H = 560;

// build once at module load (server-side, static)
const topo = statesTopo as unknown as Parameters<typeof feature>[0];
const nation = feature(topo, (topo as any).objects.nation) as any;
const states = feature(topo, (topo as any).objects.states) as any;
const projection = geoAlbersUsa().fitSize([W, H], nation);
const path = geoPath(projection);

type Placed = {
  institution: string; x: number; y: number; r: number; color: string;
  lx: number; ly: number; anchor: "start" | "end";
};

export function ConsortiumMap() {
  const grantComponent = new Map<string, string>();
  for (const a of CONSORTIUM.awards) grantComponent.set(a.grant, a.component);

  const raw = CONSORTIUM.map_points
    .map((p) => {
      const xy = projection([p.lon, p.lat]);
      if (!xy) return null;
      const comps = p.grants.map((g) => grantComponent.get(g)).filter(Boolean) as string[];
      const primary =
        comps.sort(
          (a, b) => comps.filter((c) => c === b).length - comps.filter((c) => c === a).length,
        )[0] ?? "Virome Characterization Center";
      return {
        institution: p.institution, x: xy[0], y: xy[1],
        r: 4.5 + Math.min(p.grants.length, 4),
        color: COMPONENT_COLOR[primary] ?? "var(--accent)",
      };
    })
    .filter(Boolean) as Omit<Placed, "lx" | "ly" | "anchor">[];

  // greedy label de-confliction: push colliding labels downward; right-edge points
  // get left-anchored labels so nothing overflows the frame.
  const placed: Placed[] = [];
  for (const p of [...raw].sort((a, b) => a.y - b.y)) {
    const anchor: "start" | "end" = p.x > W - 150 ? "end" : "start";
    let ly = p.y + 3.5;
    let guard = 0;
    while (guard++ < 40) {
      const clash = placed.find(
        (q) => Math.abs(q.ly - ly) < 12.5 && Math.abs(q.x - p.x) < 135,
      );
      if (!clash) break;
      ly = clash.ly + 12.5;
    }
    placed.push({ ...p, lx: anchor === "end" ? p.x - p.r - 4 : p.x + p.r + 4, ly, anchor });
  }

  return (
    <div>
      <svg className="map" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="Map of the United States showing HVP award institutions, colored by program component.">
        <g>
          {states.features.map((f: any, i: number) => (
            <path key={i} d={path(f) ?? undefined} fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={0.6} />
          ))}
          <path d={path(nation) ?? undefined} fill="none" stroke="var(--faint)" strokeWidth={1.1} strokeOpacity={0.55} />
        </g>
        {placed.map((p) => {
          const offset = Math.abs(p.ly - (p.y + 3.5)) > 7;
          return (
            <g key={p.institution}>
              {offset && (
                <line x1={p.x} y1={p.y} x2={p.lx} y2={p.ly - 3.5} stroke="var(--line-strong)" strokeWidth={0.7} />
              )}
              <circle cx={p.x} cy={p.y} r={p.r} fill={p.color} fillOpacity={0.9} stroke="var(--bg)" strokeWidth={1.4} />
              <text x={p.lx} y={p.ly} fontSize={11} fontFamily="var(--sans)" fill="var(--ink)" textAnchor={p.anchor}>
                {p.institution}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="legend">
        {Object.entries(CONSORTIUM.counts_by_component).map(([comp, n]) => (
          <span key={comp}>
            <i style={{ background: COMPONENT_COLOR[comp] ?? "var(--accent)" }} />
            {comp} ({n})
          </span>
        ))}
        <span className="muted">Point size ≈ number of awards.</span>
      </div>
    </div>
  );
}
