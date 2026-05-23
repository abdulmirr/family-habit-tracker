import {
  BookMarked,
  BookOpen,
  Apple,
  Dumbbell,
  Moon,
  Star,
  Heart,
  Droplet,
  Leaf,
  Sun,
  Brain,
  Pencil,
  Music,
  Sparkles,
  Activity,
  Smile,
  Coffee,
  type LucideIcon,
} from "lucide-react";

const PrayerIcon: LucideIcon = ((props) => (
  // Custom-leaning mosque/prayer glyph built on Moon — simple, mosque-evoking
  <Moon {...props} />
)) as LucideIcon;

const QuranIcon: LucideIcon = ((props) => <BookOpen {...props} />) as LucideIcon;

export const HABIT_ICONS: Record<string, LucideIcon> = {
  prayer: PrayerIcon,
  quran: QuranIcon,
  book: BookMarked,
  apple: Apple,
  dumbbell: Dumbbell,
  star: Star,
  heart: Heart,
  water: Droplet,
  leaf: Leaf,
  sun: Sun,
  brain: Brain,
  pencil: Pencil,
  music: Music,
  sparkles: Sparkles,
  activity: Activity,
  smile: Smile,
  coffee: Coffee,
};

export const ICON_OPTIONS: { key: string; label: string }[] = [
  { key: "star", label: "Star" },
  { key: "heart", label: "Heart" },
  { key: "water", label: "Water" },
  { key: "leaf", label: "Leaf" },
  { key: "sun", label: "Sun" },
  { key: "brain", label: "Brain" },
  { key: "pencil", label: "Pencil" },
  { key: "music", label: "Music" },
  { key: "sparkles", label: "Sparkles" },
  { key: "activity", label: "Activity" },
  { key: "smile", label: "Smile" },
  { key: "coffee", label: "Coffee" },
  { key: "book", label: "Book" },
  { key: "apple", label: "Apple" },
  { key: "dumbbell", label: "Dumbbell" },
];

export function getIcon(key: string): LucideIcon {
  return HABIT_ICONS[key] ?? Star;
}

export type HabitColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet"
  | "slate"
  | "teal"
  | "orange"
  | "pink";

export const COLOR_OPTIONS: HabitColor[] = [
  "indigo",
  "emerald",
  "amber",
  "rose",
  "sky",
  "violet",
  "teal",
  "orange",
  "pink",
  "slate",
];

// Tailwind-safe class lookups (so JIT picks them up at build time)
export const colorClasses: Record<HabitColor, {
  bg: string;
  bgSoft: string;
  text: string;
  textSoft: string;
  border: string;
  ring: string;
  gradFrom: string;
  gradTo: string;
}> = {
  indigo:  { bg: "bg-indigo-500",  bgSoft: "bg-indigo-50 dark:bg-indigo-950/40",   text: "text-indigo-600 dark:text-indigo-300", textSoft: "text-indigo-700", border: "border-indigo-200 dark:border-indigo-900", ring: "ring-indigo-400",  gradFrom: "from-indigo-400",  gradTo: "to-indigo-600" },
  emerald: { bg: "bg-emerald-500", bgSoft: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-300", textSoft: "text-emerald-700", border: "border-emerald-200 dark:border-emerald-900", ring: "ring-emerald-400", gradFrom: "from-emerald-400", gradTo: "to-emerald-600" },
  amber:   { bg: "bg-amber-500",   bgSoft: "bg-amber-50 dark:bg-amber-950/40",     text: "text-amber-600 dark:text-amber-300",   textSoft: "text-amber-700",   border: "border-amber-200 dark:border-amber-900",   ring: "ring-amber-400",   gradFrom: "from-amber-400",   gradTo: "to-amber-600" },
  rose:    { bg: "bg-rose-500",    bgSoft: "bg-rose-50 dark:bg-rose-950/40",       text: "text-rose-600 dark:text-rose-300",     textSoft: "text-rose-700",    border: "border-rose-200 dark:border-rose-900",     ring: "ring-rose-400",    gradFrom: "from-rose-400",    gradTo: "to-rose-600" },
  sky:     { bg: "bg-sky-500",     bgSoft: "bg-sky-50 dark:bg-sky-950/40",         text: "text-sky-600 dark:text-sky-300",       textSoft: "text-sky-700",     border: "border-sky-200 dark:border-sky-900",       ring: "ring-sky-400",     gradFrom: "from-sky-400",     gradTo: "to-sky-600" },
  violet:  { bg: "bg-violet-500",  bgSoft: "bg-violet-50 dark:bg-violet-950/40",   text: "text-violet-600 dark:text-violet-300", textSoft: "text-violet-700",  border: "border-violet-200 dark:border-violet-900", ring: "ring-violet-400",  gradFrom: "from-violet-400",  gradTo: "to-violet-600" },
  teal:    { bg: "bg-teal-500",    bgSoft: "bg-teal-50 dark:bg-teal-950/40",       text: "text-teal-600 dark:text-teal-300",     textSoft: "text-teal-700",    border: "border-teal-200 dark:border-teal-900",     ring: "ring-teal-400",    gradFrom: "from-teal-400",    gradTo: "to-teal-600" },
  orange:  { bg: "bg-orange-500",  bgSoft: "bg-orange-50 dark:bg-orange-950/40",   text: "text-orange-600 dark:text-orange-300", textSoft: "text-orange-700",  border: "border-orange-200 dark:border-orange-900", ring: "ring-orange-400",  gradFrom: "from-orange-400",  gradTo: "to-orange-600" },
  pink:    { bg: "bg-pink-500",    bgSoft: "bg-pink-50 dark:bg-pink-950/40",       text: "text-pink-600 dark:text-pink-300",     textSoft: "text-pink-700",    border: "border-pink-200 dark:border-pink-900",     ring: "ring-pink-400",    gradFrom: "from-pink-400",    gradTo: "to-pink-600" },
  slate:   { bg: "bg-slate-500",   bgSoft: "bg-slate-50 dark:bg-slate-900/40",     text: "text-slate-600 dark:text-slate-300",   textSoft: "text-slate-700",   border: "border-slate-200 dark:border-slate-800",   ring: "ring-slate-400",   gradFrom: "from-slate-400",   gradTo: "to-slate-600" },
};

export function getColor(color: string): HabitColor {
  return (COLOR_OPTIONS as string[]).includes(color) ? (color as HabitColor) : "slate";
}
