"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ICON_OPTIONS, COLOR_OPTIONS, colorClasses, getIcon } from "@/lib/icons";
import { createHabitAction, deleteHabitAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  habits: Habit[];
  ownerId: string | null;
  title: string;
  subtitle?: string;
};

export function HabitEditor({ habits, ownerId, title, subtitle }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0].key);
  const [color, setColor] = useState<string>("indigo");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      await createHabitAction({ name: name.trim(), icon, color, owner_id: ownerId });
      setName("");
      setAdding(false);
    });
  };

  const remove = (id: string) => {
    if (!confirm("Remove this habit? Past check-ins stay in history.")) return;
    startTransition(() => deleteHabitAction(id));
  };

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-display font-semibold text-[17px] leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-[12px] text-[color:var(--muted)] mt-0.5 max-w-xs">{subtitle}</p>
          )}
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)} variant="primary" size="sm">
            <Plus size={15} /> Add
          </Button>
        )}
      </div>

      <ul className="space-y-2 mb-3">
        {habits.map((h) => {
          const Icon = getIcon(h.icon);
          const c = colorClasses[(h.color as keyof typeof colorClasses) ?? "slate"] ?? colorClasses.slate;
          return (
            <li
              key={h.id}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-[var(--shadow-xs)]"
            >
              <div className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center ${c.bgSoft}`}>
                <Icon size={20} className={c.text} />
              </div>
              <div className="flex-1 min-w-0 font-medium truncate">{h.name}</div>
              <button
                onClick={() => remove(h.id)}
                disabled={pending}
                aria-label={`Remove ${h.name}`}
                className="p-2 rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 size={17} />
              </button>
            </li>
          );
        })}
        {habits.length === 0 && (
          <li className="text-sm text-[color:var(--muted)] px-1">No habits yet.</li>
        )}
      </ul>

      {adding && (
        <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 space-y-4 shadow-[var(--shadow-sm)]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit name"
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--border)] bg-transparent px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--accent)] transition"
            autoFocus
          />

          <div>
            <div className="eyebrow mb-2">Icon</div>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((opt) => {
                const Icon = getIcon(opt.key);
                const active = icon === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setIcon(opt.key)}
                    className={cn(
                      "aspect-square rounded-[var(--radius-md)] border flex items-center justify-center transition-colors",
                      active
                        ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                        : "border-[color:var(--border)] text-[color:var(--foreground-soft,var(--foreground))] hover:border-[color:var(--border-strong)]"
                    )}
                    aria-label={opt.label}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-2">Color</div>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((col) => {
                const c = colorClasses[col];
                const active = color === col;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColor(col)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      c.bg,
                      active
                        ? "ring-2 ring-offset-2 ring-offset-[color:var(--surface)] ring-[color:var(--foreground)] scale-110"
                        : "hover:scale-105"
                    )}
                    aria-label={col}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={submit}
              disabled={pending || !name.trim()}
              variant="primary"
              size="md"
              className="flex-1"
            >
              {pending ? "Saving…" : "Add habit"}
            </Button>
            <Button onClick={() => setAdding(false)} variant="secondary" size="md">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
