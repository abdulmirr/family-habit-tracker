import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// All "today" math runs in the family's local timezone so that server (UTC on
// most hosts) and client agree on which calendar day a check-in belongs to.
const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE ?? "America/Chicago";

function ymdInZone(d: Date, timeZone: string): string {
  // en-CA formats as YYYY-MM-DD, which is what we want.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function todayISO(): string {
  return ymdInZone(new Date(), APP_TIMEZONE);
}

export function daysAgoISO(n: number): string {
  // Anchor at noon UTC of today's zone-local date, then subtract n whole days
  // in UTC. Reading back UTC components is safe because the anchor avoids any
  // midnight/DST edge.
  const today = todayISO();
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
