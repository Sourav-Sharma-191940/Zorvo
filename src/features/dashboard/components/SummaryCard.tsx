import { Clock3, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Card, type Tone } from "@/components/ui/primitives";

export function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  trend: "up" | "down" | "neutral";
  tone: Tone;
}) {
  return (
    <Card className="summary-card">
      <div className="summary-heading">
        <span className={`icon-tile icon-${tone}`}>
          <Icon size="1.0625rem" strokeWidth={1.9} />
        </span>
        <div className="summary-label">{label}</div>
      </div>
      <div className="summary-value">{value}</div>
      <div className={`summary-detail trend-${trend}`}>
        {trend === "up" && <TrendingUp size="0.875rem" />}
        {trend === "down" && <TrendingDown size="0.875rem" />}
        {trend === "neutral" && <Clock3 size="0.875rem" />}
        <span>{detail}</span>
      </div>
    </Card>
  );
}
