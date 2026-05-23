import { ExternalLink, AlertTriangle } from "lucide-react";

type Props = {
  reason?: "missing-env" | "missing-tables";
  detail?: string;
};

export function ConfigNotice({ reason = "missing-env", detail }: Props) {
  const isMissingTables = reason === "missing-tables";
  return (
    <main className="flex-1 w-full max-w-md mx-auto px-5 py-10">
      <div className="rounded-[var(--radius-lg)] border border-amber-300/70 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-900/70 p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-start gap-2.5 mb-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <h2 className="font-display font-semibold text-[17px] leading-tight tracking-tight">
              {isMissingTables ? "Database not set up yet" : "Supabase not configured"}
            </h2>
            <p className="text-[13px] mt-1 opacity-90">
              {isMissingTables
                ? "Your Supabase project is reachable, but the tables don't exist yet. Run the schema below in the SQL editor."
                : "Add your Supabase URL and anon key to .env.local, then restart the dev server."}
            </p>
          </div>
        </div>

        {isMissingTables && (
          <ol className="text-[13px] space-y-2 list-decimal pl-5 mb-3">
            <li>
              Open the{" "}
              <a
                href="https://supabase.com/dashboard/project/rnkiqhgdkczrrtpqgmwh/sql/new"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 inline-flex items-center gap-1"
              >
                SQL Editor <ExternalLink size={12} />
              </a>
            </li>
            <li>
              Paste the contents of{" "}
              <code className="bg-white/70 dark:bg-black/30 rounded px-1 py-0.5 text-[12px] font-mono">
                supabase/schema.sql
              </code>
              , run it
            </li>
            <li>
              Then paste{" "}
              <code className="bg-white/70 dark:bg-black/30 rounded px-1 py-0.5 text-[12px] font-mono">
                supabase/seed.sql
              </code>
              , run it
            </li>
            <li>Refresh this page</li>
          </ol>
        )}

        {detail && (
          <pre className="text-[11px] bg-white/70 dark:bg-black/30 rounded-[var(--radius-sm)] p-2.5 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
            {detail}
          </pre>
        )}
      </div>
    </main>
  );
}
