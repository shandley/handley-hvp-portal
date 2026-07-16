import type { Metadata } from "next";
import CapsidBackground from "@/components/CapsidBackground";

export const metadata: Metadata = {
  title: "Handley Lab Virome",
  description:
    "The Handley Lab's virome methods, tools, data views, and resources, across human and environmental viromes.",
};

const AREAS = [
  {
    href: "/virome",
    title: "Virome methods",
    body: "ViroForge and virome-qc, and an opinionated guide to contamination and site-specific virome analysis.",
  },
  {
    href: "/taxonomy",
    title: "Taxonomy",
    body: "Version-controlled viral taxonomy and the Caudovirales reclassification.",
  },
  {
    href: "/data",
    title: "Public data resources",
    body: "A curated selection of public human-virome datasets and reference resources, with the reanalysis-ready ones flagged.",
  },
];

export default function Home() {
  return (
    <div className="explore">
      <CapsidBackground />
      <div className="explore-scrim" aria-hidden="true" />

      <div className="explore-inner">
        <div className="explore-top">
          <span className="brand-lite">Handley Lab Virome</span>
        </div>

        <div className="explore-hero">
          <div className="kicker light">Handley Lab &middot; Washington University in St. Louis</div>
          <h1 className="display">
            Most viruses<br />are still unknown.
          </h1>
          <p className="explore-lead">
            The Handley Lab studies viromes across the human body and beyond, from healthy and
            diseased human samples to environmental communities. This site collects the
            lab&apos;s methods, tools, data views, and resources.
          </p>

          <div className="explore-areas">
            {AREAS.map((a) => (
              <a className="area-card" href={a.href} key={a.href}>
                <span className="ac-title">{a.title}</span>
                <span className="ac-body">{a.body}</span>
              </a>
            ))}
          </div>
        </div>

        <p className="explore-foot">Handley Lab, Washington University in St. Louis</p>
      </div>
    </div>
  );
}
