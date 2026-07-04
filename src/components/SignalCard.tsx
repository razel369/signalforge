import Link from "next/link";
import type { Signal } from "@/lib/types";
import { SignalScore } from "./SignalScore";

const typeLabel = { tender: "מכרז", company: "חברה חדשה" };

type Props = {
  signal: Signal;
  variant?: "card" | "compact";
  style?: React.CSSProperties;
};

export function SignalCard({ signal, variant = "card", style }: Props) {
  const stripe = signal.type === "tender" ? "stripe-tender" : "stripe-company";
  const tagBg =
    signal.type === "tender"
      ? "bg-orange-500/12 text-orange-300 ring-1 ring-orange-500/20"
      : "bg-sky-500/12 text-sky-300 ring-1 ring-sky-500/20";

  if (variant === "compact") {
    return (
      <article
        className="animate-fade-up group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
        style={style}
      >
        <div className={`w-1 shrink-0 self-stretch rounded-full ${stripe} opacity-80`} />
        <div className="min-w-0 flex-1">
          <span
            className={`mb-1.5 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${tagBg}`}
          >
            {typeLabel[signal.type]}
          </span>
          <h3 className="truncate text-sm font-semibold text-white group-hover:text-orange-50 transition-colors">
            {signal.title}
          </h3>
          <p className="truncate text-xs text-zinc-500">{signal.subtitle}</p>
        </div>
        <SignalScore score={signal.score} type={signal.type} size="sm" />
      </article>
    );
  }

  return (
    <article
      className="glass-sm glass-sm-interactive group flex gap-5 p-5"
      style={style}
    >
      <div className={`w-1 shrink-0 rounded-full ${stripe}`} />

      <div className="min-w-0 flex-1">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${tagBg}`}>
            {typeLabel[signal.type]}
          </span>
          {signal.type === "tender" && (
            <span className="font-mono text-xs text-zinc-500">
              {signal.meta.daysLeft as number} ימים · {signal.meta.housingUnits as number} יח״ד
            </span>
          )}
          {signal.type === "company" && (
            <span className="font-mono text-xs text-zinc-500">
              {signal.city}
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold leading-snug text-white transition-colors group-hover:text-orange-50">
          {signal.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{signal.subtitle}</p>

        <a
          href={signal.actionUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 transition hover:text-orange-300"
        >
          מקור רשמי
          <span aria-hidden className="transition group-hover:-translate-x-0.5">←</span>
        </a>
      </div>

      <SignalScore score={signal.score} type={signal.type} urgency={signal.urgency} />
    </article>
  );
}
