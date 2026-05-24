import Link from "next/link";
import { Settings2, ChevronRight } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getProfiles, getHabitsForProfile, getTodayCheckIns } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { ProgressRing } from "@/components/ProgressRing";
import { ConfigNotice } from "@/components/ConfigNotice";
import { TopTabs } from "@/components/TopTabs";
import { cardClassName } from "@/components/ui/Card";
import { slugify } from "@/lib/utils";
import { colorClasses, getColor } from "@/lib/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!isSupabaseConfigured) return <ConfigNotice />;

  let profiles;
  try {
    profiles = await getProfiles();
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const msg = err.message ?? (e instanceof Error ? e.message : String(e));
    if (err.code === "PGRST205" || msg.includes("Could not find the table") || msg.includes("schema cache")) {
      return <ConfigNotice reason="missing-tables" detail={msg} />;
    }
    throw e;
  }

  const progress = await Promise.all(
    profiles.map(async (p) => {
      const [habits, todayCheckIns] = await Promise.all([
        getHabitsForProfile(p.id),
        getTodayCheckIns(p.id),
      ]);
      const total = habits.length;
      const done = todayCheckIns.length;
      return { id: p.id, total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
    })
  );
  const progressMap = new Map(progress.map((p) => [p.id, p]));

  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6 pb-20">
      <TopTabs active="check" />

      <header className="mb-7">
        <p className="eyebrow">{weekday}</p>
        <h1 className="font-display text-[2.5rem] font-semibold leading-[1.02] mt-1.5 tracking-tight">
          {monthDay}
        </h1>
        <p className="text-[15px] text-[color:var(--muted)] mt-2 max-w-xs">
          Tap your profile to check off today.
        </p>
      </header>

      <ul className="space-y-2.5">
        {profiles.map((p) => {
          const stat = progressMap.get(p.id)!;
          const c = colorClasses[getColor(p.color_theme)];
          return (
            <li key={p.id}>
              <Link
                href={`/p/${slugify(p.name)}`}
                className={`${cardClassName("interactive")} group flex items-center gap-4 p-3.5`}
              >
                <ProgressRing
                  size={60}
                  stroke={2}
                  percent={stat.percent}
                  fillClassName={c.bg.replace("bg-", "stroke-")}
                >
                  <Avatar name={p.name} avatarUrl={p.avatar_url} color={p.color_theme} size={52} />
                </ProgressRing>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-[19px] leading-tight">
                    {p.name}
                  </div>
                  <div className="text-[13px] text-[color:var(--muted)] mt-0.5 tabular-nums">
                    {stat.done} of {stat.total} habits
                  </div>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className={`font-display text-[22px] font-semibold tabular-nums leading-none ${c.text}`}>
                    {stat.percent}
                  </span>
                  <span className="text-[12px] text-[color:var(--muted)] font-medium">%</span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-[color:var(--muted)] -ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-center">
        <Link
          href="/manage"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
        >
          <Settings2 size={14} />
          Manage habits
        </Link>
      </div>
    </main>
  );
}
