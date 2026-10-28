"use client";

import { useEffect, useState } from "react";

export const useActiveSection = (ids: readonly string[]) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .toSorted(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-5% 0px -80% 0px" }
    );

    for (const id of ids) {
      const section = document.querySelector(`#${id}`);
      if (section) {
        observer.observe(section);
      }
    }

    return () => observer.disconnect();
  }, [ids]);

  return { activeId, setActiveId };
};
