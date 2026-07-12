import type { Metadata } from "next";
import CapsidBackground from "@/components/CapsidBackground";
import { PROGRAM, CONSORTIUM, LANDSCAPE, fmt } from "@/lib/data";

export const metadata: Metadata = {
  title: "The human virome · Handley Lab",
  description: "An independent Handley Lab synthesis of the NIH Human Virome Program.",
};

export default function Explore() {
  const h = LANDSCAPE.headline;
  const vcc = CONSORTIUM.counts_by_component["Virome Characterization Center"] ?? 5;
  return (
    <div className="explore">
      <CapsidBackground />
      <div className="explore-scrim" aria-hidden="true" />

      <div className="explore-inner">
        <div className="explore-top">
          <span className="brand-lite">Handley Lab</span>
          <a href="/landscape">the landscape &rarr;</a>
        </div>

        <div className="explore-hero">
          <div className="kicker light">An independent synthesis &middot; the human virome</div>
          <h1 className="display">
            Most human viruses<br />are still unknown.
          </h1>
          <p className="explore-lead">
            The NIH Human Virome Program is the first coordinated effort to catalog them across
            the human body and the human lifespan. This is the Handley Lab&apos;s independent
            reading of that effort, drawn from public program records.
          </p>

          <div className="explore-stats">
            <div><b className="num">{CONSORTIUM.total_awards}</b><span>awards</span></div>
            <div><b className="num">{vcc}</b><span>characterization centers</span></div>
            <div><b className="num">{fmt(h.cohorts)}</b><span>cohorts</span></div>
            <div><b className="num">{fmt(h.planned_samples)}</b><span>samples mapped</span></div>
          </div>

          <a className="explore-cta" href="/landscape">View the data landscape &rarr;</a>
        </div>

        <p className="explore-foot">
          Handley Lab, Washington University in St. Louis &middot; not an official HVP product
          &middot; data as of {PROGRAM.data_as_of}
        </p>
      </div>
    </div>
  );
}
