import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getProfiles, getSharedHabits, getPersonalHabits } from "@/lib/data";
import { ConfigNotice } from "@/components/ConfigNotice";
import { BottomNav } from "@/components/BottomNav";
import { HabitEditor } from "@/components/HabitEditor";
import { Avatar } from "@/components/Avatar";
import { slugify } from "@/lib/utils";
import { getIcon, colorClasses, getColor } from "@/lib/icons";

export const dynamic = "force-dynamic";

export default async function HabitsPage({ params }: { params: Promise<{ name: string }> }) {
  if (!isSupabaseConfigured) return <ConfigNotice />;

  const { name } = await params;
  const profiles = await getProfiles();
  const profile = profiles.find((p) => slugify(p.name) === name);
  if (!profile) notFound();

  const [shared, personal] = await Promise.all([
    getSharedHabits(),
    getPersonalHabits(profile.id),
  ]);

  return (
    <>
      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6 pb-28">
        <header className="flex items-center gap-3 mb-6">
          <Link
            href={`/p/${name}`}
            className="-ml-2 p-2 rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </Link>
          <Avatar name={profile.name} avatarUrl={profile.avatar_url} color={profile.color_theme} size={44} />
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-[19px] leading-tight tracking-tight">
              {profile.name}&rsquo;s habits
            </div>
            <p className="eyebrow mt-0.5">Personal extras only</p>
          </div>
        </header>

        <section className="mb-8">
          <HabitEditor
            habits={personal}
            ownerId={profile.id}
            title="Personal habits"
            subtitle="Just for you. Shared family habits live under Manage."
          />
        </section>

        <section>
          <h2 className="eyebrow px-1 mb-3">Family habits (shared)</h2>
          <ul className="space-y-2">
            {shared.map((h) => {
              const Icon = getIcon(h.icon);
              const c = colorClasses[getColor(h.color)];
              return (
                <li
                  key={h.id}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-[var(--shadow-xs)]"
                >
                  <div className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center ${c.bgSoft}`}>
                    <Icon size={20} className={c.text} />
                  </div>
                  <div className="flex-1 min-w-0 font-medium truncate">{h.name}</div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[12px] text-[color:var(--muted)] px-1">
            Manage shared habits in{" "}
            <Link href="/manage" className="underline underline-offset-2 hover:text-[color:var(--accent)] transition-colors">
              Manage
            </Link>
            .
          </p>
        </section>
      </main>
      <BottomNav name={name} />
    </>
  );
}
