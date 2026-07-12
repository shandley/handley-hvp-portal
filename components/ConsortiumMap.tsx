import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import statesTopo from "us-atlas/states-10m.json";
import { CONSORTIUM, COMPONENT_COLOR, type Award } from "@/lib/data";
import { ConsortiumMapView, type PlacedPoint } from "./ConsortiumMapView";

const W = 980, H = 560;

// build once at module load (server-side, static); topojson never ships to the client
const topo = statesTopo as unknown as Parameters<typeof feature>[0];
const nation = feature(topo, (topo as any).objects.nation) as any;
const states = feature(topo, (topo as any).objects.states) as any;
const projection = geoAlbersUsa().fitSize([W, H], nation);
const path = geoPath(projection);

export function ConsortiumMap() {
  const awardByGrant = new Map<string, Award>();
  for (const a of CONSORTIUM.awards) awardByGrant.set(a.grant, a);

  const raw = CONSORTIUM.map_points
    .map((p) => {
      const xy = projection([p.lon, p.lat]);
      if (!xy) return null;
      const awards = p.grants.map((g) => awardByGrant.get(g)).filter(Boolean) as Award[];
      const comps = awards.map((a) => a.component);
      const primary =
        comps.sort(
          (a, b) => comps.filter((c) => c === b).length - comps.filter((c) => c === a).length,
        )[0] ?? "Virome Characterization Center";
      return {
        institution: p.institution,
        region: p.region,
        x: xy[0],
        y: xy[1],
        r: 4.5 + Math.min(p.grants.length, 4),
        color: COMPONENT_COLOR[primary] ?? "var(--accent)",
        awards,
      };
    })
    .filter(Boolean) as Omit<PlacedPoint, "lx" | "ly" | "anchor" | "offset">[];

  // greedy label de-confliction: push colliding labels downward; right-edge points
  // get left-anchored labels so nothing overflows the frame.
  const placed: PlacedPoint[] = [];
  for (const p of [...raw].sort((a, b) => a.y - b.y)) {
    const anchor: "start" | "end" = p.x > W - 150 ? "end" : "start";
    let ly = p.y + 3.5;
    let guard = 0;
    while (guard++ < 40) {
      const clash = placed.find((q) => Math.abs(q.ly - ly) < 12.5 && Math.abs(q.x - p.x) < 135);
      if (!clash) break;
      ly = clash.ly + 12.5;
    }
    placed.push({
      ...p,
      lx: anchor === "end" ? p.x - p.r - 4 : p.x + p.r + 4,
      ly,
      anchor,
      offset: Math.abs(ly - (p.y + 3.5)) > 7,
    });
  }

  const statePaths = states.features.map((f: any) => path(f) ?? "").filter(Boolean) as string[];
  const nationPath = path(nation) ?? "";
  const legend = Object.entries(CONSORTIUM.counts_by_component) as [string, number][];

  return (
    <ConsortiumMapView
      w={W}
      h={H}
      statePaths={statePaths}
      nationPath={nationPath}
      points={placed}
      legend={legend}
      colors={COMPONENT_COLOR}
    />
  );
}
