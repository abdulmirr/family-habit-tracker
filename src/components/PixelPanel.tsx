import * as React from "react";
import { cn } from "@/lib/utils";

type PixelPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  tone?: "default" | "soft" | "accent";
  padded?: boolean;
};

const toneClass = {
  default: "bg-[color:var(--surface)]",
  soft: "bg-[color:var(--surface-2)]",
  accent: "bg-[color:var(--accent-soft)]",
} as const;

export function PixelPanel({
  interactive = false,
  tone = "default",
  padded = false,
  className,
  ...rest
}: PixelPanelProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)]",
        "shadow-[var(--shadow-pixel)]",
        toneClass[tone],
        padded && "p-4",
        interactive &&
          "transition-[transform,box-shadow] duration-75 active:translate-y-[3px] active:shadow-[var(--shadow-pixel-pressed)]",
        className
      )}
      {...rest}
    />
  );
}

export function pixelPanelClass(
  tone: keyof typeof toneClass = "default",
  interactive = false
) {
  return cn(
    "rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)]",
    "shadow-[var(--shadow-pixel)]",
    toneClass[tone],
    interactive &&
      "transition-[transform,box-shadow] duration-75 active:translate-y-[3px] active:shadow-[var(--shadow-pixel-pressed)]"
  );
}
