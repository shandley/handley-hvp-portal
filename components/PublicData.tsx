"use client";

import { useState } from "react";
import { PUBLIC_DATA, CATEGORY_LABEL, DATA_TYPE_LABEL, type PublicResource } from "@/lib/data";

const CATEGORY_ORDER = ["unified-resource", "reference-taxonomy", "cohort-dataset"];

function ResourceCard({ r }: { r: PublicResource }) {
  const primary = r.identifier_url || r.url;
  const ready = r.reanalysis_ready === "yes";
  return (
    <article className="res-card">
      <div className="res-top">
        <a className="res-name" href={primary} target="_blank" rel="noopener noreferrer">
          {r.name}
        </a>
        <span className={`res-tier res-tier-${r.tier}`}>{r.tier}</span>
      </div>
      <div className="res-meta">
        {r.site_tags.map((t) => (
          <span className="res-tag" key={t}>{t}</span>
        ))}
        {r.data_type ? (
          <span className={`res-dtype${ready ? " ready" : ""}`}>
            {DATA_TYPE_LABEL[r.data_type] ?? r.data_type}
          </span>
        ) : null}
      </div>
      <p className="res-summary">{r.summary}</p>
      <div className="res-foot">
        {r.identifier_url ? (
          <a className="res-id mono" href={r.identifier_url} target="_blank" rel="noopener noreferrer">
            {r.identifier}
          </a>
        ) : (
          <a className="res-id mono" href={r.url} target="_blank" rel="noopener noreferrer">
            visit resource
          </a>
        )}
        {ready && r.download_method !== "portal" ? (
          <span className="res-get">
            {r.download_method}
            {r.license && r.license !== "see source" ? ` · ${r.license}` : ""}
          </span>
        ) : (
          <span className="res-access">{r.access_note}</span>
        )}
      </div>
    </article>
  );
}

export function PublicData() {
  const [site, setSite] = useState<string>("all");
  const [readyOnly, setReadyOnly] = useState<boolean>(false);
  const all = PUBLIC_DATA.resources;
  const readyN = PUBLIC_DATA.counts_by_ready?.yes ?? 0;

  let shown = readyOnly ? all.filter((r) => r.reanalysis_ready === "yes") : all;
  if (site !== "all") shown = shown.filter((r) => r.site_tags.includes(site));

  return (
    <div className="res">
      <div className="res-controls">
        <button
          className={`res-toggle${readyOnly ? " on" : ""}`}
          onClick={() => setReadyOnly((v) => !v)}
          aria-pressed={readyOnly}
        >
          <span className="res-toggle-dot" /> Reanalysis-ready only
          <span className="res-chip-n">{readyN}</span>
        </button>
      </div>

      <div className="res-filter" role="group" aria-label="Filter resources by body site">
        <button
          className={`res-chip${site === "all" ? " active" : ""}`}
          onClick={() => setSite("all")}
        >
          All <span className="res-chip-n">{readyOnly ? readyN : all.length}</span>
        </button>
        {PUBLIC_DATA.site_filters.map((s) => {
          const pool = readyOnly ? all.filter((r) => r.reanalysis_ready === "yes") : all;
          const n = pool.filter((r) => r.site_tags.includes(s)).length;
          if (!n) return null;
          return (
            <button
              key={s}
              className={`res-chip${site === s ? " active" : ""}`}
              onClick={() => setSite(s)}
            >
              {s} <span className="res-chip-n">{n}</span>
            </button>
          );
        })}
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const group = shown.filter((r) => r.category === cat);
        if (!group.length) return null;
        return (
          <section className="res-group" key={cat}>
            <h3 className="res-group-head">
              {CATEGORY_LABEL[cat]} <span className="res-group-n">{group.length}</span>
            </h3>
            <div className="res-grid">
              {group.map((r) => (
                <ResourceCard key={r.name} r={r} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
