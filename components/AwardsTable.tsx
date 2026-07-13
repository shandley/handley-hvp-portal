"use client";

import { useMemo, useState } from "react";
import type { Award } from "@/lib/data";

const strip = (c: string) => c.replace(" (CODCC)", "");

export function AwardsTable({ awards }: { awards: Award[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<string>>(new Set());

  const components = useMemo(() => {
    const seen: string[] = [];
    for (const a of awards) if (!seen.includes(a.component)) seen.push(a.component);
    return seen;
  }, [awards]);

  const q = query.trim().toLowerCase();
  const filtered = awards.filter((a) => {
    if (active.size > 0 && !active.has(a.component)) return false;
    if (!q) return true;
    return [a.grant, a.institution, a.component, a.pis, a.title].join(" ").toLowerCase().includes(q);
  });

  const toggle = (c: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  return (
    <div>
      <div className="awards-controls">
        <input
          type="search"
          className="awards-search"
          placeholder="Search grant, institution, or investigator"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search awards"
        />
        {components.map((c) => (
          <button
            key={c}
            type="button"
            className={`res-chip${active.has(c) ? " active" : ""}`}
            aria-pressed={active.has(c)}
            onClick={() => toggle(c)}
          >
            {strip(c)}
          </button>
        ))}
        <span className="awards-count muted">
          {filtered.length === awards.length
            ? `${awards.length} awards`
            : `${filtered.length} of ${awards.length}`}
        </span>
      </div>

      <div className="table-scroll">
        <table className="awards">
          <thead>
            <tr>
              <th>Grant</th><th>Institution</th><th>Component</th><th>Investigators</th><th>Period</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.grant} id={a.grant}>
                <td className="grant">{a.grant}</td>
                <td className="inst">{a.institution}</td>
                <td className="sans">{strip(a.component)}</td>
                <td className="sans">{a.pis}</td>
                <td className="mono">{a.period}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="sans muted" colSpan={5}>No awards match this search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
