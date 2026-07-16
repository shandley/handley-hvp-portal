"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CapsidScene = dynamic(() => import("./CapsidScene"), { ssr: false });

export default function CapsidBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="capsid-bg" aria-hidden="true">
      {mounted ? <CapsidScene animate={!reduced} /> : null}
    </div>
  );
}
