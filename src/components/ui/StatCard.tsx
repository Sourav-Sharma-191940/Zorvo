import { TrendingDown, type LucideIcon } from "lucide-react";
import type { Tone } from "./primitives";

/**
 * Compact KPI card used in the summary row of every management page.
 * Wrap a set of these in `<div className="stat-grid">`.
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: Tone;
  /** "good" highlights the detail line in emerald with a downward trend icon. */
  trend?: "good";
}) {
  return (
    <section className="card stat-card">
      <div className="stat-heading">
        <span className={`icon-tile icon-${tone}`}>
          <Icon size="1.0625rem" />
        </span>
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      <small className={trend === "good" ? "stat-good" : undefined}>
        {trend === "good" && <TrendingDown size="0.8125rem" />}
        {detail}
      </small>
    </section>
  );
}
