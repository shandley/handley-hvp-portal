"use client";

import { useEffect, useState } from "react";

export type Section = { id: string; label: string };

// A sticky in-page nav for long pages: lists the page's sections so they are
// discoverable, and jumps to them on click (no long scroll). Highlights the
// section currently in view.
export function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav className="secnav" aria-label="On this page">
      <div className="wrap secnav-in">
        <span className="secnav-lbl">On this page</span>
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : ""}>
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
