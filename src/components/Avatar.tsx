import { colorClasses, getColor } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  avatarUrl?: string | null;
  color?: string;
  size?: number;
  className?: string;
};

export function Avatar({ name, avatarUrl, color = "slate", size = 64, className }: Props) {
  const c = colorClasses[getColor(color)];
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold bg-gradient-to-br",
        c.gradFrom,
        c.gradTo,
        "text-white",
        className
      )}
      style={{ width: size, height: size, fontSize: size / 2.6 }}
    >
      {initials}
    </div>
  );
}
