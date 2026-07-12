import { fmt } from "@/lib/data";

export function BarChart({
  title, data, color = "var(--accent)", unit = "",
}: {
  title: string;
  data: Record<string, number>;
  color?: string;
  unit?: string;
}) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div className="chart">
      <div className="chart-title">{title}</div>
      <div className="bars" role="list">
        {entries.map(([label, v]) => (
          <div className="bar-row" role="listitem" key={label}>
            <div className="lbl" title={label}>{label}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.max((v / max) * 100, 2)}%`, background: color }}
              />
            </div>
            <div className="val">{fmt(v)}{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
