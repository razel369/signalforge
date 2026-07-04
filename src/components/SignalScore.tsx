import type { Signal } from "@/lib/types";

const urgencyHe: Record<Signal["urgency"], string> = {
  critical: "דחוף",
  high: "גבוה",
  medium: "בינוני",
  low: "נמוך",
};

type Props = {
  score: number;
  type: Signal["type"];
  urgency?: Signal["urgency"];
  size?: "sm" | "lg";
};

export function SignalScore({ score, type, urgency, size = "lg" }: Props) {
  const isSm = size === "sm";
  const dim = isSm ? 44 : 64;
  const r = isSm ? 17 : 26;
  const stroke = isSm ? 3 : 3.5;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;
  const strokeColor = type === "tender" ? "#f97316" : "#38bdf8";
  const trackColor = type === "tender" ? "rgba(249,115,22,0.15)" : "rgba(56,189,248,0.15)";
  const scoreClass = type === "tender" ? "score-tender" : "score-company";
  const fontSize = isSm ? "text-sm" : "text-xl";

  const glowClass = score >= 70
    ? type === "tender" ? "score-glow-tender" : "score-glow-company"
    : "";

  return (
    <div className={`flex shrink-0 flex-col items-center justify-center text-center ${glowClass}`}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums leading-none ${fontSize} ${scoreClass}`}
        >
          {score}
        </span>
      </div>
      {urgency && !isSm && (
        <span className="mt-2 text-[11px] font-medium text-zinc-500">
          {urgencyHe[urgency]}
        </span>
      )}
    </div>
  );
}
