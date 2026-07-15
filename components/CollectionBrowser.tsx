"use client";

import { useEffect, useMemo, useState } from "react";
import {
  familyComposition,
  familyCount,
  genomeTypeComposition,
  type CompositionSlice,
  type VfCollection,
  type VfCollectionsFile,
} from "@/lib/viroforge";

const pctf = (x: number) => `${(x * 100).toFixed(1)}%`;
const lengthLabel = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)} kb` : `${n} bp`);

function CompositionBars({ title, slices }: { title: string; slices: CompositionSlice[] }) {
  const max = Math.max(...slices.map((s) => s.value), 0.0001);
  return (
    <div className="chart">
      <div className="chart-title">{title}</div>
      <div className="bars" role="list">
        {slices.map((s) => (
          <div className="bar-row" role="listitem" key={s.label}>
            <div className="lbl" title={`${s.label} (${s.count} genomes)`}>{s.label}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.max((s.value / max) * 100, 2)}%`, background: s.color }}
              />
            </div>
            <div className="val">{pctf(s.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CollectionBrowser() {
  const [file, setFile] = useState<VfCollectionsFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number>(9);

  useEffect(() => {
    let alive = true;
    fetch("/data/collections.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: VfCollectionsFile) => {
        if (!alive) return;
        setFile(data);
        if (!data.collections.some((c) => c.id === 9)) {
          setSelectedId(data.collections[0]?.id ?? 9);
        }
      })
      .catch((e) => alive && setError(String(e)));
    return () => {
      alive = false;
    };
  }, []);

  const collection = useMemo<VfCollection | null>(
    () => file?.collections.find((c) => c.id === selectedId) ?? null,
    [file, selectedId],
  );
  const famComp = useMemo(() => (collection ? familyComposition(collection.genomes) : []), [collection]);
  const typeComp = useMemo(() => (collection ? genomeTypeComposition(collection.genomes) : []), [collection]);

  if (error) {
    return (
      <p className="muted sans">
        Could not load collection data ({error}). Run the ViroForge export and copy
        collections.json to <span className="mono">public/data/</span>.
      </p>
    );
  }
  if (!file || !collection) {
    return <p className="muted sans">Loading collections…</p>;
  }

  const topGenomes = collection.genomes.slice(0, 25);

  return (
    <div>
      <div className="vf-toolbar">
        <label className="vf-field">
          <span className="vf-field-label">Collection</span>
          <select
            className="vf-select"
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            aria-label="Select a virome collection"
          >
            {file.collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <span className="awards-count muted">{file.collections.length} reference collections</span>
      </div>

      {collection.description && <p className="prose vf-desc">{collection.description}</p>}

      <div className="vf-statrow">
        <div className="vf-stat">
          <span className="vf-stat-n mono">{collection.genomes.length}</span>
          <span className="vf-stat-l">genomes</span>
        </div>
        <div className="vf-stat">
          <span className="vf-stat-n mono">{familyCount(collection.genomes)}</span>
          <span className="vf-stat-l">families</span>
        </div>
        <div className="vf-stat">
          <span className="vf-stat-n mono">{typeComp[0]?.label ?? "-"}</span>
          <span className="vf-stat-l">dominant genome type</span>
        </div>
      </div>

      <div className="vf-charts">
        <CompositionBars title="Composition by viral family (relative abundance)" slices={famComp} />
        <CompositionBars title="Composition by genome type" slices={typeComp} />
      </div>

      <div className="chart-title vf-tabletitle">Most abundant genomes</div>
      <div className="table-scroll">
        <table className="awards vf-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Virus</th>
              <th>Family</th>
              <th>Type</th>
              <th>Length</th>
              <th>GC</th>
              <th>Abundance</th>
            </tr>
          </thead>
          <tbody>
            {topGenomes.map((g, i) => (
              <tr key={g.genome_id}>
                <td className="mono">{i + 1}</td>
                <td className="inst">{g.name}</td>
                <td className="sans">{g.taxonomy.family ?? "Unclassified"}</td>
                <td className="sans">{g.genome_type}</td>
                <td className="mono">{lengthLabel(g.length)}</td>
                <td className="mono">{g.gc_content != null ? `${(g.gc_content * 100).toFixed(0)}%` : "-"}</td>
                <td className="mono">{pctf(g.relative_abundance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted sans vf-foot">
        Showing the {Math.min(25, collection.genomes.length)} most abundant of{" "}
        {collection.genomes.length} genomes. Compositions are curated reference abundances from
        ViroForge, used to benchmark virome quality control. They are synthetic reference
        communities, not measured samples.
      </p>
    </div>
  );
}
