"use client";

import { useMemo, useRef, useState } from "react";
import { TAXONOMY_CHANGES, fmt, type TaxonChange } from "@/lib/data";

// Lowercased name to taxon. Family and genus names do not collide in ICTV.
const INDEX = new Map<string, TaxonChange>();
for (const t of TAXONOMY_CHANGES.taxa) {
  const k = t.name.trim().toLowerCase();
  if (!INDEX.has(k)) INDEX.set(k, t);
}

type Res = { status: string; current: string; note: string; bucket: Bucket };
type Bucket = "unchanged" | "updated" | "flagged" | "unrecognized";

function reconcile(raw: string): Res {
  const name = raw.trim();
  if (!name) return { status: "", current: "", note: "empty", bucket: "unrecognized" };
  const t = INDEX.get(name.toLowerCase());
  if (!t) {
    return { status: "not found", current: "", bucket: "unrecognized",
      note: "not an ICTV family or genus name from 2005 to 2024" };
  }
  if (t.current) {
    return { status: "current", current: t.name, note: "unchanged", bucket: "unchanged" };
  }
  const named = (t.destinations ?? []).filter((d) => !d.name.startsWith("no family"));
  if (t.status === "renamed" && named.length === 1) {
    return { status: "renamed", current: named[0].name, bucket: "updated",
      note: `renamed to ${named[0].name}` };
  }
  if (t.status === "abolished" || named.length === 0) {
    return { status: t.status, current: "", bucket: "flagged",
      note: "name retired, successor not resolvable from the name" };
  }
  const n = named.length;
  return { status: t.status, current: "", bucket: "flagged",
    note: `${t.status}, members now across ${n} ${n === 1 ? "family" : "families"} `
        + `(a species needs its genome to place it)` };
}

function parseDelimited(text: string, delim: string): string[][] {
  const out: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === delim) { row.push(field); field = ""; i++; continue; }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); out.push(row); field = ""; row = []; i++; continue;
    }
    field += c; i++;
  }
  if (field !== "" || row.length > 0) { row.push(field); out.push(row); }
  return out.filter((r) => r.some((f) => f.trim() !== ""));
}

function csvEscape(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

const NAME_HINT = /^(family|genus|taxon|taxonomy|organism|classification|name)$/i;
const BUCKET_LABEL: Record<Bucket, string> = {
  unchanged: "unchanged", updated: "updated", flagged: "needs sequence", unrecognized: "not recognized",
};

export function BatchReconcile() {
  const [text, setText] = useState("");
  const [delim, setDelim] = useState<string>(",");
  const [colIdx, setColIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => {
    if (!text.trim()) return null;
    const rows = parseDelimited(text, delim);
    if (rows.length === 0) return null;
    const headers = rows[0];
    return { headers, rows: rows.slice(1) };
  }, [text, delim]);

  const results = useMemo(() => {
    if (!parsed) return null;
    const annotated = parsed.rows.map((r) => ({ row: r, res: reconcile(r[colIdx] ?? "") }));
    const counts: Record<Bucket, number> = { unchanged: 0, updated: 0, flagged: 0, unrecognized: 0 };
    for (const a of annotated) counts[a.res.bucket]++;
    return { annotated, counts };
  }, [parsed, colIdx]);

  const ingest = (raw: string) => {
    const d = ((raw.split(/\r?\n/, 1)[0] ?? "").match(/\t/g)?.length ?? 0)
      > ((raw.split(/\r?\n/, 1)[0] ?? "").match(/,/g)?.length ?? 0) ? "\t" : ",";
    setDelim(d);
    setText(raw);
    // auto-pick a likely name column
    const headers = parseDelimited(raw, d)[0] ?? [];
    const hit = headers.findIndex((h) => NAME_HINT.test(h.trim()));
    setColIdx(hit >= 0 ? hit : 0);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => ingest(String(reader.result ?? ""));
    reader.readAsText(f);
  };

  const download = () => {
    if (!parsed || !results) return;
    const outHeaders = [...parsed.headers, "ictv_status", "ictv_current_name", "ictv_note"];
    const lines = [outHeaders.map(csvEscape).join(",")];
    for (const { row, res } of results.annotated) {
      lines.push([...row, res.status, res.current, res.note].map(csvEscape).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reconciled_taxonomy.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const total = results?.annotated.length ?? 0;

  return (
    <div className="tax-batch">
      <p className="prose muted">
        Paste or upload a table of family or genus names and get each one reconciled to its
        current placement. This runs entirely in your browser. Nothing is uploaded.
      </p>

      <div className="tax-batch-input">
        <textarea
          className="tax-batch-text"
          value={text}
          placeholder={"Paste CSV or TSV with a header row, for example:\nsample,family\nS1,Myoviridae\nS2,Flavivirus"}
          onChange={(e) => ingest(e.target.value)}
          aria-label="Paste a CSV or TSV of taxon names"
        />
        <div className="tax-batch-controls">
          <button type="button" className="tax-chip" onClick={() => fileRef.current?.click()}>
            Upload a file
          </button>
          <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values"
            hidden onChange={(e) => onFile(e.target.files?.[0])} />
          {parsed && parsed.headers.length > 0 && (
            <label className="tax-batch-col">
              Name column
              <select value={colIdx} onChange={(e) => setColIdx(Number(e.target.value))}>
                {parsed.headers.map((h, i) => (
                  <option key={i} value={i}>{h.trim() || `column ${i + 1}`}</option>
                ))}
              </select>
            </label>
          )}
          {results && <button type="button" className="tax-download-link" onClick={download}>Download annotated CSV</button>}
        </div>
      </div>

      {results && total > 0 && (
        <>
          <div className="figs tax-batch-figs">
            <div className="fig"><div className="v">{fmt(total)}</div><div className="k">rows</div></div>
            <div className="fig"><div className="v">{fmt(results.counts.unchanged)}</div><div className="k">unchanged</div></div>
            <div className="fig"><div className="v">{fmt(results.counts.updated)}</div><div className="k">renamed, updated</div></div>
            <div className="fig"><div className="v">{fmt(results.counts.flagged)}</div><div className="k">need sequence</div></div>
            <div className="fig"><div className="v">{fmt(results.counts.unrecognized)}</div><div className="k">not recognized</div></div>
          </div>
          <div className="table-scroll tax-batch-preview">
            <table className="awards">
              <thead>
                <tr>
                  <th>{parsed?.headers[colIdx]?.trim() || "name"}</th>
                  <th>status</th><th>current name</th><th>resolution</th>
                </tr>
              </thead>
              <tbody>
                {results.annotated.slice(0, 12).map(({ row, res }, i) => (
                  <tr key={i}>
                    <td className="inst">{row[colIdx]}</td>
                    <td><span className={`tax-batch-tag b-${res.bucket}`}>{BUCKET_LABEL[res.bucket]}</span></td>
                    <td className="inst">{res.current}</td>
                    <td className="muted">{res.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 12 && <p className="muted tax-batch-more">Showing 12 of {fmt(total)} rows. Download for the full table.</p>}
          <p className="caveats tax-batch-caveat">
            Renamed names resolve to an exact current name. Splits and promotions cannot be
            placed into a single family from the name, so they are flagged as needing the
            genome rather than guessed.
          </p>
        </>
      )}
    </div>
  );
}
