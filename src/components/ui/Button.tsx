import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] rounded-[var(--radius-md)]",
  md: "h-11 px-5 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-[15px] rounded-[var(--radius-lg)]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-[color:var(--accent)] text-[color:var(--accent-fg)] font-semibold",
    "shadow-[var(--shadow-button)]",
    "hover:brightness-[1.06]",
    "active:translate-y-px active:shadow-[var(--shadow-button-active)] active:brightness-[0.98]",
    "transition-[transform,filter,box-shadow] duration-100"
  ),
  secondary: cn(
    "bg-[color:var(--surface)] text-[color:var(--foreground)] font-semibold",
    "border border-[color:var(--border)] shadow-[var(--shadow-xs)]",
    "hover:bg-[color:var(--surface-2,var(--surface))] hover:border-[color:var(--border-strong)]",
    "active:translate-y-px",
    "transition-[transform,background-color,border-color] duration-100"
  ),
  ghost: cn(
    "bg-transparent text-[color:var(--foreground)] font-medium",
    "hover:bg-[color:var(--accent-soft)]",
    "transition-colors duration-100"
  ),
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, type = "button", ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...rest}
      />
    );
  }
);

/** className helper for non-button elements (Link, anchor) that should look like a button. */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md"
) {
  return cn(
    "inline-flex items-center justify-center gap-2 select-none",
    sizeClasses[size],
    variantClasses[variant]
  );
}
