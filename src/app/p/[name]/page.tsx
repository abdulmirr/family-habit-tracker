import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getProfiles, getHabitsWithStats } from "@/lib/data";
import { ConfigNotice } from "@/components/ConfigNotice";
import { TodayHabitList } from "@/components/TodayHabitList";
import { BottomNav } from "@/components/BottomNav";
import { Avatar } from "@/components/Avatar";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { name: string };

export default async function TodayPage({ params }: { params: Promise<Params> }) {
  if (!isSupabaseConfigured) return <ConfigNotice />;

  const { name } = await params;
  const profiles = await getProfiles();
  const profile = profiles.find((p) => slugify(p.name) === name);
  if (!profile) notFound();

  const habits = await getHabitsWithStats(profile.id);
  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <>
      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6 pb-28">
        <header className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="-ml-2 p-2 rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--surface-2,transparent)] transition-colors"
            aria-label="Back to family"
          >
            <ChevronLeft size={22} />
          </Link>
          <Avatar name={profile.name} avatarUrl={profile.avatar_url} color={profile.color_theme} size={44} />
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-[19px] leading-tight tracking-tight">
              {profile.name}
            </div>
            <div className="text-[12px] text-[color:var(--muted)] tabular-nums">
              {weekday} · {monthDay}
            </div>
          </div>
        </header>

        <TodayHabitList habits={habits} profileId={profile.id} profileName={profile.name} />
      </main>
      <BottomNav name={name} />
    </>
  );
}
