"use client";

import { useEffect } from "react";

export function ScrollToToday() {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>("[data-board-scroll]");
    const target = container?.querySelector<HTMLElement>("[data-today-col]");
    if (!container || !target) return;

    const offset = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, offset), behavior: "auto" });
  }, []);

  return null;
}
