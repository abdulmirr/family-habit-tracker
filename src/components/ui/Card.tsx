import * as React from "react";
import { cn } from "@/lib/utils";

export type CardElevation = "flat" | "raised" | "interactive";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  elevation?: CardElevation;
  padded?: boolean;
};

const elevationClass: Record<CardElevation, string> = {
  flat: "bg-[color:var(--surface)] border border-[color:var(--border)]",
  raised:
    "bg-[color:var(--surface)] border border-[color:var(--border)] shadow-[var(--shadow-sm)]",
  interactive: cn(
    "bg-[color:var(--surface)] border border-[color:var(--border)]",
    "shadow-[var(--shadow-sm)] transition-all duration-150",
    "hover:shadow-[var(--shadow-md)] hover:-translate-y-px",
    "active:translate-y-0 active:shadow-[var(--shadow-xs)]"
  ),
};

export function Card({
  elevation = "flat",
  padded = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)]",
        elevationClass[elevation],
        padded && "p-4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function cardClassName(elevation: CardElevation = "flat") {
  return cn("rounded-[var(--radius-lg)]", elevationClass[elevation]);
}
