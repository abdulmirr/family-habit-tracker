"use client";

import { useEffect } from "react";

export function ScrollToToday() {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>("[data-board-scroll]");
    const target = container?.querySelector<HTMLElement>("[data-today-col]");
    if (!container || !target) return;

    const scrollToToday = () => {
      const stickyCol = container.querySelector<HTMLElement>("thead th.sticky");
      const stickyWidth = stickyCol?.offsetWidth ?? 0;
      const containerLeft = container.getBoundingClientRect().left;
      const targetLeft = target.getBoundingClientRect().left;
      const currentOffset = targetLeft - containerLeft + container.scrollLeft;
      // Align today flush to the right of the sticky habit column (snap-start)
      const offset = currentOffset - stickyWidth;
      container.scrollTo({ left: Math.max(0, offset), behavior: "auto" });
    };

    scrollToToday();
    const raf = requestAnimationFrame(scrollToToday);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
