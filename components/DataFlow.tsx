import { FLOW } from "@/lib/data";

const W = 980, H = 340;
const BW = 164, BH = 50;

// hand-placed layout, left (generation) to right (visualization)
const POS: Record<string, [number, number]> = {
  dgg: [90, 170],
  vbr: [290, 95],
  ncbi: [290, 250],
  repo: [500, 170],
  portal: [710, 80],
  proc: [710, 190],
  img: [900, 170],
  ictv: [710, 300],
};

function edgePath(a: [number, number], b: [number, number]) {
  // straight-ish connector between box edges
  return `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`;
}

export function DataFlow() {
  return (
    <svg className="flow" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label="HVP data-management flow: data generating groups to Baylor and NCBI, to the UMIGS repository, to the data portal and Harvard processing, to the JGI IMG repository, with ICTV taxonomy.">
      <defs>
        <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--faint)" />
        </marker>
      </defs>

      {FLOW.edges.map(([from, to, label], i) => {
        const a = POS[from], b = POS[to];
        if (!a || !b) return null;
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        return (
          <g key={i}>
            <path d={edgePath(a, b)} stroke="var(--faint)" strokeWidth={1.3} fill="none" markerEnd="url(#arw)" />
            {label ? (
              <text x={mx} y={my - 5} fontSize={10} fontFamily="var(--sans)" fill="var(--muted)" textAnchor="middle">
                {label}
              </text>
            ) : null}
          </g>
        );
      })}

      {FLOW.nodes.map((n) => {
        const p = POS[n.id];
        if (!p) return null;
        return (
          <g key={n.id}>
            <rect x={p[0] - BW / 2} y={p[1] - BH / 2} width={BW} height={BH} rx={6}
              fill="var(--surface)" stroke="var(--line-strong)" />
            <text x={p[0]} y={p[1] - 3} fontSize={11.5} fontFamily="var(--sans)" fontWeight={600}
              fill="var(--ink)" textAnchor="middle">
              {n.label}
            </text>
            <text x={p[0]} y={p[1] + 13} fontSize={10} fontFamily="var(--sans)"
              fill="var(--muted)" textAnchor="middle">
              {n.owner}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
