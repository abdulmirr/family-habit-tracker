import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSharedHabits } from "@/lib/data";
import { ConfigNotice } from "@/components/ConfigNotice";
import { HabitEditor } from "@/components/HabitEditor";

export const dynamic = "force-dynamic";

export default async function ManagePage() {
  if (!isSupabaseConfigured) return <ConfigNotice />;
  const habits = await getSharedHabits();

  return (
    <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6 pb-16">
      <header className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="-ml-2 p-2 rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[19px] leading-tight tracking-tight">
            Family habits
          </div>
          <p className="eyebrow mt-0.5">Shared by everyone</p>
        </div>
      </header>

      <HabitEditor
        habits={habits}
        ownerId={null}
        title="Shared habits"
        subtitle="These apply to all 5 family members. Adding one here adds it for everyone."
      />
    </main>
  );
}
