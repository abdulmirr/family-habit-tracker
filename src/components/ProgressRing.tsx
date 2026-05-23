type Props = {
  size?: number;
  stroke?: number;
  percent: number; // 0-100
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  children?: React.ReactNode;
};

export function ProgressRing({
  size = 88,
  stroke = 6,
  percent,
  className = "",
  trackClassName = "stroke-zinc-200 dark:stroke-zinc-800",
  fillClassName = "stroke-indigo-500",
  children,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ease-out ${fillClassName}`}
        />
      </svg>
      {children ? <div className="absolute inset-0 flex items-center justify-center">{children}</div> : null}
    </div>
  );
}
