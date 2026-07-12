"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { HoverInfo } from "./CapsidScene";
import type { Award } from "@/lib/data";

const CapsidScene = dynamic(() => import("./CapsidScene"), { ssr: false });

export default function CapsidBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hover, setHover] = useState<HoverInfo>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onSelect = (a: Award) => {
    document.body.style.cursor = "";
    window.location.assign(`/landscape#${a.grant}`);
  };

  // keep the tooltip on screen near the right/bottom edges
  const tipStyle = hover
    ? {
        left: Math.min(hover.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - 300),
        top: Math.min(hover.y + 16, (typeof window !== "undefined" ? window.innerHeight : 800) - 150),
      }
    : undefined;

  return (
    <>
      <div className="capsid-bg" aria-hidden="true">
        {mounted ? <CapsidScene animate={!reduced} onHover={setHover} onSelect={onSelect} /> : null}
      </div>
      {hover && (
        <div className="capsid-tip" style={tipStyle} role="status">
          <div className="tip-inst">{hover.award.institution}</div>
          <div className="tip-comp">{hover.award.component.replace(" (CODCC)", "")}</div>
          <div className="tip-grant">{hover.award.grant}</div>
          <div className="tip-pis">{hover.award.pis}</div>
          <div className="tip-foot">
            {hover.award.period} &middot; click to view in the landscape
          </div>
        </div>
      )}
    </>
  );
}
